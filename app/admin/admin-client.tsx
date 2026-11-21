"use client";

import { useEffect, useState } from "react";
import { createClient, type Session } from "@supabase/supabase-js";
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

      const { data, error } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", nextSession.user.id)
        .maybeSingle();

      if (active) {
        setAuthorized(Boolean(data) && !error);
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

  async function connecter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/admin` }
    });
    setMessage(error ? "Le lien de connexion n'a pas pu être envoyé." : "Un lien de connexion vient d'être envoyé si cette adresse est autorisée.");
    setBusy(false);
  }

  async function importer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session) return;

    let payload: unknown;
    try {
      payload = JSON.parse(json);
    } catch {
      setMessage("Le texte saisi n'est pas un JSON valide.");
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
        body: JSON.stringify(payload)
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
    setMessage("Déconnexion effectuée.");
  }

  if (checking) return <p className={styles.notice}>Vérification de la session…</p>;

  if (!session) {
    return <section className={styles.panel}>
      <h2>Connexion administrateur</h2>
      <p>Recevez un lien de connexion par e-mail. Seuls les comptes autorisés dans Supabase peuvent accéder à l'administration.</p>
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
        if (file) setJson(await file.text());
      }} />
      <textarea id="fiche-json" spellCheck={false} required rows={18} value={json} onChange={(event) => setJson(event.target.value)} placeholder={'{"schema_version":"2.0.0","identity":{...},"content":{...}}'} />
      <button className="button button-dark" type="submit" disabled={busy || !json.trim()}>{busy ? "Import…" : "Valider et enregistrer en brouillon"}</button>
    </form>
    {imported && <div className={styles.publish}>
      <p>La version {imported.version} est prête. Vérifie son rendu avant publication.</p>
      <button className="button button-dark" type="button" disabled={busy} onClick={publier}>Publier cette version</button>
    </div>}
    {message && <p className={styles.notice} role="status">{message}</p>}
  </section>;
}
