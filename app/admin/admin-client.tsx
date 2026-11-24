"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createClient, type Session } from "@supabase/supabase-js";
import { FICHE_SCHEMA_VERSION, parseFichePrenom, type FichePrenomImport } from "@/lib/fiche-prenom";
import styles from "./admin.module.css";
import { Button } from "@/components/material3/Button";
import { TextField } from "@/components/material3/TextField";
import { Snackbar, type SnackbarSeverity } from "@/components/material3/Snackbar";
import { parseAdminCatalog, type AdminName, type AdminProfile } from "@/lib/admin-catalog";
import { verifyAdminAccess } from "@/lib/admin-auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

type ImportResult = { profileId: string; version: number };
type ProfileRow = AdminProfile;
type NameRow = AdminName;

const statusLabels: Record<ProfileRow["status"], string> = {
  brouillon: "Brouillon",
  publie: "Publié",
  archive: "Archivé"
};

export function AdminClient() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [email, setEmail] = useState("");
  const [json, setJson] = useState("");
  const [preview, setPreview] = useState<FichePrenomImport | null>(null);
  const [message, setMessage] = useState<{ text: string; type: SnackbarSeverity } | null>(null);

  function afficherMessage(text: string, type: SnackbarSeverity = "info") {
    setMessage({ text, type });
  }
  const [busy, setBusy] = useState(false);
  const [catalog, setCatalog] = useState<NameRow[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogTotal, setCatalogTotal] = useState(0);
  const [catalogOffset, setCatalogOffset] = useState(0);
  const [catalogNextOffset, setCatalogNextOffset] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [imported, setImported] = useState<ImportResult | null>(null);

  useEffect(() => {
    let active = true;
    let revision = 0;

    async function verifier(nextSession: Session | null) {
      const currentRevision = ++revision;
      setSession(nextSession);
      setChecking(true);

      if (!nextSession) {
        if (active && currentRevision === revision) {
          setAuthorized(false);
          setCatalog([]);
          setCatalogTotal(0);
          setCatalogOffset(0);
          setCatalogNextOffset(null);
          setCatalogLoading(false);
          setMessage(null);
          setChecking(false);
        }
        return;
      }

      try {
        const isAuthorized = await verifyAdminAccess(() => supabase.rpc("is_namesia_admin"));
        if (active && currentRevision === revision) {
          setAuthorized(isAuthorized);
          setMessage(null);
        }
      } catch {
        if (active && currentRevision === revision) {
          setAuthorized(false);
          setMessage({ text: "Impossible de vérifier les droits de ce compte. Vérifiez votre connexion puis réessayez.", type: "error" });
        }
      } finally {
        if (active && currentRevision === revision) setChecking(false);
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void verifier(nextSession);
    });

    void supabase.auth.getSession().then(({ data, error }) => {
      if (error) throw error;
      if (active && revision === 0) return verifier(data.session);
    }).catch(() => {
      if (active && revision === 0) {
        revision += 1;
        setSession(null);
        setAuthorized(false);
        setMessage({ text: "Impossible de lire la session. Vérifiez votre connexion puis réessayez.", type: "error" });
        setChecking(false);
      }
    });

    return () => {
      active = false;
      revision += 1;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session || !authorized) return;
    const accessToken = session.access_token;
    let active = true;
    const offset = catalogOffset;

    async function chargerCatalogue() {
      setCatalogLoading(true);
      try {
        const response = await fetch(`/api/admin/prenoms?offset=${offset}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: "no-store"
        });
        const payload: unknown = await response.json();
        if (!response.ok) {
          const errorMessage = typeof payload === "object" && payload !== null && "error" in payload && typeof payload.error === "string"
            ? payload.error
            : "Chargement du catalogue impossible.";
          throw new Error(errorMessage);
        }
        const result = parseAdminCatalog(payload);
        if (active) {
          setCatalog((current) => offset === 0 ? result.names : [...current, ...result.names]);
          setCatalogTotal(result.total);
          setCatalogNextOffset(result.nextOffset);
        }
      } catch (error) {
        if (active) afficherMessage(error instanceof Error ? error.message : "Chargement du catalogue impossible.", "error");
      } finally {
        if (active) setCatalogLoading(false);
      }
    }

    void chargerCatalogue();
    return () => {
      active = false;
    };
  }, [session?.access_token, authorized, refreshKey, catalogOffset]);

  async function connecter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: `${window.location.origin}/admin`, shouldCreateUser: false }
      });
      afficherMessage(error ? "Le lien de connexion n'a pas pu être envoyé." : "Un lien de connexion vient d'être envoyé si cette adresse existe et est autorisée.", error ? "error" : "info");
    } catch {
      afficherMessage("Le service de connexion est momentanément indisponible.", "error");
    } finally {
      setBusy(false);
    }
  }

  function previsualiser() {
    try {
      setPreview(parseFichePrenom(JSON.parse(json)));
      setImported(null);
      afficherMessage("Structure valide. Cette vérification ne confirme pas l'exactitude des informations.", "success");
    } catch (error) {
      setPreview(null);
      afficherMessage(error instanceof Error ? error.message : "Le JSON ne respecte pas le contrat Namesia.", "error");
    }
  }

  async function previsualiserVersion(profile: ProfileRow) {
    if (!session) return;
    const accessToken = session.access_token;
    setBusy(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/prenoms/${profile.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store"
      });
      const result = await response.json() as {
        fiche?: FichePrenomImport;
        status?: ProfileRow["status"];
        version?: number;
        error?: string;
      };
      if (!response.ok || !result.fiche) throw new Error(result.error ?? "Prévisualisation impossible.");

      const fiche = parseFichePrenom(result.fiche);
      setJson(JSON.stringify(fiche, null, 2));
      setPreview(fiche);
      setImported(result.status === "brouillon"
        ? { profileId: profile.id, version: result.version ?? profile.version }
        : null);
      afficherMessage(result.status === "brouillon"
        ? "Brouillon chargé. Tu peux le corriger en important une nouvelle version ou le publier."
        : `Version ${profile.version} en lecture seule.`, "info");
    } catch (error) {
      setPreview(null);
      setImported(null);
      afficherMessage(error instanceof Error ? error.message : "Prévisualisation impossible.", "error");
    } finally {
      setBusy(false);
    }
  }

  function rechargerCatalogue() {
    setCatalog([]);
    setCatalogTotal(0);
    setCatalogOffset(0);
    setCatalogNextOffset(null);
    setRefreshKey((current) => current + 1);
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
      afficherMessage(error instanceof Error ? error.message : "Le format de la fiche est invalide.", "error");
      return;
    }

    setBusy(true);
    setMessage(null);
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
      rechargerCatalogue();
      afficherMessage(`La version ${result.version} est enregistrée en brouillon. Elle n'est pas publique.`, "success");
    } catch (error) {
      afficherMessage(error instanceof Error ? error.message : "Import impossible.", "error");
    } finally {
      setBusy(false);
    }
  }

  async function publier() {
    if (!session || !imported) return;
    setBusy(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/prenoms/${imported.profileId}/publication`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Publication impossible.");
      afficherMessage("La fiche est publiée. La version précédente, si elle existait, est archivée.", "success");
      setImported(null);
      rechargerCatalogue();
    } catch (error) {
      afficherMessage(error instanceof Error ? error.message : "Publication impossible.", "error");
    } finally {
      setBusy(false);
    }
  }

  async function deconnecter() {
    await supabase.auth.signOut();
    setImported(null);
    setPreview(null);
    setCatalog([]);
    setCatalogTotal(0);
    setCatalogOffset(0);
    setCatalogNextOffset(null);
    afficherMessage("Déconnexion effectuée.", "info");
  }

  if (checking) return <p className={styles.notice}>Vérification de la session…</p>;

  if (!session) {
    return <section className={styles.panel}>
      <h2>Connexion administrateur</h2>
      <p>Recevez un lien de connexion par e-mail. Seuls les comptes autorisés dans Namesia peuvent administrer le catalogue.</p>
      <form className={styles.form} onSubmit={connecter}>
        <TextField id="admin-email" label="Adresse e-mail" variant="outlined" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
        <Button type="submit" disabled={busy}>{busy ? "Envoi…" : "Recevoir un lien de connexion"}</Button>
      </form>
      {message && <Snackbar severity={message.type}>{message.text}</Snackbar>}
    </section>;
  }

  if (!authorized) {
    return <section className={styles.panel}>
      <h2>Accès non autorisé</h2>
      <p>Ce compte est connecté, mais ne figure pas dans la liste des administrateurs Namesia.</p>
      {message && <Snackbar severity={message.type}>{message.text}</Snackbar>}
      <Button type="button" onClick={deconnecter}>Se déconnecter</Button>
    </section>;
  }

  return <section className={styles.panel}>
    <div className={styles.heading}>
      <div><h2>Importer une fiche</h2><p>Connecté en tant que {session.user.email}</p></div>
      <Button variant="outlined" type="button" onClick={deconnecter}>Déconnexion</Button>
    </div>
    <form className={styles.form} onSubmit={importer}>
      <label htmlFor="fiche-fichier">Importer un fichier JSON</label>
      <input id="fiche-fichier" type="file" accept="application/json,.json" disabled={busy} onChange={async (event) => {
        const file = event.target.files?.[0];
        if (file) {
          setJson(await file.text());
          setPreview(null);
          setImported(null);
        }
      }} />
      <TextField id="fiche-json" label={`Fiche JSON (version ${FICHE_SCHEMA_VERSION})`} variant="outlined" multiline rows={18} spellCheck={false} required supportingText="Collez ou importez le JSON de la fiche générée en amont." value={json} disabled={busy} className={styles.jsonField} onChange={(event) => {
        setJson(event.target.value);
        setPreview(null);
        setImported(null);
      }} />
      <div className={styles.actions}>
        <Button variant="outlined" type="button" disabled={busy || !json.trim()} onClick={previsualiser}>Prévisualiser</Button>
        <Button type="submit" disabled={busy || !preview}>{busy ? "Import…" : "Enregistrer en brouillon"}</Button>
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
      <Snackbar severity="warning" className={styles.previewWarning}>La validation porte sur la structure du JSON, pas sur la véracité des contenus générés.</Snackbar>
    </article>}

    {imported && <div className={styles.publish}>
      <p>La version {imported.version} est enregistrée en brouillon. Après vérification de l'aperçu, tu peux la publier.</p>
      <Button type="button" disabled={busy} onClick={publier}>Publier cette version</Button>
    </div>}

    <section className={styles.library}>
      <h3>Fiches et versions enregistrées</h3>
      <p>{catalog.length} fiche{catalog.length > 1 ? "s" : ""} affichée{catalog.length > 1 ? "s" : ""} sur {catalogTotal}</p>
      {catalogLoading && <p className={styles.notice}>Chargement du catalogue…</p>}
      {!catalogLoading && catalog.length === 0 && <p className={styles.notice}>Aucune fiche enregistrée.</p>}
      {catalog.map((name) => <article className={styles.entry} key={name.id}>
        <div className={styles.entryHeading}>
          <strong>{name.display_name}</strong>
          <span>{name.slug}</span>
        </div>
        {[...name.name_profiles].sort((a, b) => b.version - a.version).map((profile) => <div className={styles.versionRow} key={profile.id}>
          <span>Version {profile.version} · {statusLabels[profile.status]} · {new Date(profile.created_at).toLocaleDateString("fr-FR")}</span>
          <Button variant="outlined" type="button" disabled={busy} onClick={() => void previsualiserVersion(profile)}>Prévisualiser</Button>
        </div>)}
      </article>)}
      {catalogNextOffset !== null && <Button variant="outlined" type="button" disabled={catalogLoading} onClick={() => setCatalogOffset(catalogNextOffset)}>Charger les fiches suivantes</Button>}
    </section>
    {message && <Snackbar severity={message.type}>{message.text}</Snackbar>}
  </section>;
}
