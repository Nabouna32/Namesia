"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createClient, type Session } from "@supabase/supabase-js";
import { parseFichePrenom, type FichePrenomImport } from "@/lib/fiche-prenom";
import styles from "./admin.module.css";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

type ImportResult = { profileId: string; version: number };

export function AdminClient() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [email, setEmail] = useState("");
  const [json, setJson] = useState("");
  const [preview, setPreview] = useState<FichePrenomImport | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [imported, setImported] = useState<ImportResult | null>(null);

  useEffect(() => {
    let active = true;

    async function verifier(nextSession: Session | null) {
      setSession(nextSession);
      if (!nextSession) {
        if (active) {
          setAuthorized(false);
          setChecking(false);
        }
        return;
      }

      const { data, error } = await supabase.rpc("is_namesia_admin");
      if (active) {
        setAuthorized(data === true && !error);
        setMessage(error ? "Impossible de vérifier les droits de ce compte." : "");
        setChecking(false);
      }
    }

    void supabase.auth.getSession().then(({ data }) => verifier(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void verifier(nextSession);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function connecter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: `${window.location.origin}/admin`, shouldCreateUser: false }
      });
      setMessage(error ? "Le lien de connexion n'a pas pu être envoyé." : "Un lien de connexion vient d'être envoyé si cette adresse existe et est autorisée.");
    } catch {
      setMessage("Le service de connexion est momentanément indisponible.");
    } finally {
      setBusy(false);
    }
  }

  function previsualiser() {
    try {
      setPreview(parseFichePrenom(JSON.parse(json)));
      setImported(null);
      setMessage("Structure valide. Cette vérification ne confirme pas l'exactitude des informations.");
    } catch (error) {
      setPreview(null);
      setMessage(error instanceof Error ? error.message : "Le JSON ne respecte pas le contrat Namesia.");
    }
  }

  async function importer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session) return;

    let fiche: FichePrenomImport;
    try {
      fiche = parseFichePrenom(JSON.parse(json));
      setPreview(fiche);
    } catch (error) {
      setPreview(null);
      setMessage(error instanceof Error ? error.message : "Le format de la fiche est invalide.");
      return;
    }

    setBusy(true);
    setMessage("");
    setImported(null);
    try {
      const response = await fetch("/api/admin/prenoms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify(fiche)
      });
      const result = await response.json() as ImportResult & { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Import impossible.");
      setImported({ profileId: result.profileId, version: result.version });
      setMessage(`La version ${result.version} est enregistrée en brouillon. Elle n'est pas publique.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Import impossible.");
    } finally {
      setBusy(false);
    }
  }

  async function publier() {
    if (!session || !imported) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/prenoms/${imported.profileId}/publication`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Publication impossible.");
      setMessage("La fiche est publiée. La version précédente, si elle existait, est archivée.");
      setImported(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Publication impossible.");
    } finally {
      setBusy(false);
    }
  }

  async function deconnecter() {
    await supabase.auth.signOut();
    setImported(null);
    setPreview(null);
    setMessage("Déconnexion effectuée.");
  }

  if (checking) return <p className={styles.notice}>Vérification de la session…</p>;

  if (!session) {
    return <section className={styles.panel}>
      <h2>Connexion administrateur</h2>
      <p>Recevez un lien de connexion par e-mail. Seuls les comptes autorisés dans Namesia peuvent administrer le catalogue.</p>
      <form className={styles.form} onSubmit={connecter}>
        <label htmlFor="admin-email">Adresse e-mail</label>
        <input id="admin-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
        <button className="button button-dark" type="submit" disabled={busy}>{busy ? "Envoi…" : "Recevoir un lien de connexion"}</button>
      </form>
      {message && <p className={styles.notice} role="status">{message}</p>}
    </section>;
  }

  if (!authorized) {
    return <section className={styles.panel}>
      <h2>Accès non autorisé</h2>
      <p>Ce compte est connecté, mais ne figure pas dans la liste des administrateurs Namesia.</p>
      {message && <p className={styles.notice} role="status">{message}</p>}
      <button className="button button-dark" type="button" onClick={deconnecter}>Se déconnecter</button>
    </section>;
  }

  return <section className={styles.panel}>
    <div className={styles.heading}>
      <div><h2>Importer une fiche</h2><p>Connecté en tant que {session.user.email}</p></div>
      <button className={styles.secondary} type="button" onClick={deconnecter}>Déconnexion</button>
    </div>
    <form className={styles.form} onSubmit={importer}>
      <label htmlFor="fiche-json">Fiche JSON (version 2.0.0)</label>
      <input type="file" accept="application/json,.json" onChange={async (event) => {
        const file = event.target.files?.[0];
        if (file) {
          setJson(await file.text());
          setPreview(null);
          setImported(null);
        }
      }} />
      <textarea id="fiche-json" spellCheck={false} required rows={18} value={json} onChange={(event) => {
        setJson(event.target.value);
        setPreview(null);
        setImported(null);
      }} placeholder={'{"schema_version":"2.0.0","identity":{...},"content":{...}}'} />
      <div className={styles.actions}>
        <button className={styles.secondary} type="button" disabled={busy || !json.trim()} onClick={previsualiser}>Prévisualiser</button>
        <button className="button button-dark" type="submit" disabled={busy || !preview}>{busy ? "Import…" : "Enregistrer en brouillon"}</button>
      </div>
    </form>
    {preview && <article className={styles.preview}>
      <span className={styles.previewLabel}>Aperçu · {preview.identity.gender}</span>
      <h3>{preview.identity.display_name}</h3>
      <p>{preview.content.introduction}</p>
      {preview.content.origin && <section><h4>Origine & signification</h4><p>{preview.content.origin}</p></section>}
      {preview.content.history && <section><h4>Histoire du prénom</h4><p>{preview.content.history}</p></section>}
      {preview.content.usage && <section><h4>Variantes & usages</h4><p>{preview.content.usage}</p></section>}
      {preview.content.symbolic_associations.map((symbol) => <section key={`${symbol.category}-${symbol.value}`}><h4>{symbol.category} · {symbol.value}</h4><p>{symbol.context_note}</p></section>)}
      <p className={styles.previewWarning}>La validation porte sur la structure du JSON, pas sur la véracité des contenus générés.</p>
    </article>}
    {imported && <div className={styles.publish}>
      <p>La version {imported.version} est enregistrée en brouillon. Après vérification de l'aperçu, tu peux la publier.</p>
      <button className="button button-dark" type="button" disabled={busy} onClick={publier}>Publier cette version</button>
    </div>}
    {message && <p className={styles.notice} role="status">{message}</p>}
  </section>;
}
