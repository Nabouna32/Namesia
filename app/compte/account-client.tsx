"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Button } from "@/components/material3/Button";
import { TextField } from "@/components/material3/TextField";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { validatePassword } from "@/lib/auth-password";
import styles from "./account.module.css";

export type AccountMode = "login" | "register" | "forgot" | "recovery" | "change";

type Props = {
  redirectTo: string;
  initialMode: AccountMode;
  emailConfirmed: boolean;
};

type Feedback = { text: string; type: "info" | "success" | "error" };

const supabase = createSupabaseBrowserClient();

export function AccountClient({ redirectTo, initialMode, emailConfirmed }: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<AccountMode>(initialMode);
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(
    emailConfirmed ? { text: "Adresse e-mail confirmée.", type: "success" } : null
  );
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      if (event === "PASSWORD_RECOVERY") {
        setMode("recovery");
        setFeedback({ text: "Choisissez votre nouveau mot de passe.", type: "info" });
      } else if (event === "SIGNED_IN") {
        setMode("login");
      }
    });

    void supabase.auth.getSession().then(({ data, error }) => {
      if (error) throw error;
      if (!active) return;
      setSession(data.session);
      if (data.session && initialMode !== "recovery") setMode("login");
      setChecking(false);
    }).catch(() => {
      if (!active) return;
      setFeedback({ text: "Impossible de vérifier votre session. Réessayez dans un instant.", type: "error" });
      setChecking(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [initialMode]);

  useEffect(() => {
    if (!checking && session && redirectTo === "/admin" && mode !== "recovery" && mode !== "change") {
      router.replace("/admin");
    }
  }, [checking, mode, redirectTo, router, session]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setFeedback(null);

    try {
      if (mode === "register" || mode === "recovery") {
        const passwordError = validatePassword(password);
        if (passwordError) {
          setFeedback({ text: passwordError, type: "error" });
          return;
        }
        if (password !== confirmation) {
          setFeedback({ text: "Les deux mots de passe ne correspondent pas.", type: "error" });
          return;
        }
      }

      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: window.location.origin + "/compte?redirect=" + encodeURIComponent(redirectTo) + "&confirmed=1"
          }
        });
        if (error) {
          setFeedback({ text: "L'inscription n'a pas pu être finalisée. Vérifiez les informations et réessayez plus tard.", type: "error" });
        } else {
          setFeedback({ text: "Si cette adresse peut être utilisée, un e-mail de confirmation vient d'être envoyé. Consultez votre boîte de réception.", type: "success" });
        }
        setPassword("");
        setConfirmation("");
        return;
      }

      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });
        if (error) {
          setFeedback({ text: "Adresse e-mail ou mot de passe incorrect.", type: "error" });
        } else {
          setPassword("");
          if (redirectTo === "/admin") router.replace("/admin");
          else setFeedback({ text: "Vous êtes connecté à votre compte Namesia.", type: "success" });
        }
        return;
      }

      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: window.location.origin + "/compte?redirect=" + encodeURIComponent(redirectTo) + "&mode=recovery"
        });
        setFeedback({
          text: error
            ? "La demande n'a pas pu être traitée pour le moment. Réessayez plus tard."
            : "Si un compte correspond à cette adresse, un e-mail de récupération vient d'être envoyé.",
          type: error ? "error" : "success"
        });
        return;
      }

      if (mode === "recovery") {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) {
          setFeedback({ text: "Le nouveau mot de passe n'a pas pu être enregistré. Le lien a peut-être expiré.", type: "error" });
        } else {
          setPassword("");
          setConfirmation("");
          setMode("login");
          setFeedback({ text: "Votre mot de passe a été modifié.", type: "success" });
        }
      }
    } catch {
      setFeedback({ text: "Le service de compte est momentanément indisponible. Réessayez plus tard.", type: "error" });
    } finally {
      setBusy(false);
    }
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setFeedback(null);

    const passwordError = validatePassword(password);
    if (passwordError) {
      setFeedback({ text: passwordError, type: "error" });
      setBusy(false);
      return;
    }
    if (password !== confirmation) {
      setFeedback({ text: "Les deux mots de passe ne correspondent pas.", type: "error" });
      setBusy(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password,
        current_password: currentPassword
      });
      if (error) {
        setFeedback({ text: "Le mot de passe actuel est incorrect ou la modification a échoué.", type: "error" });
      } else {
        setPassword("");
        setConfirmation("");
        setCurrentPassword("");
        setMode("login");
        setFeedback({ text: "Votre mot de passe a été modifié.", type: "success" });
      }
    } catch {
      setFeedback({ text: "Le service de compte est momentanément indisponible.", type: "error" });
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    setBusy(true);
    const { error } = await supabase.auth.signOut();
    setBusy(false);
    if (error) {
      setFeedback({ text: "La déconnexion n'a pas pu être finalisée. Réessayez.", type: "error" });
      return;
    }
    setSession(null);
    setMode("login");
    setFeedback({ text: "Vous êtes déconnecté.", type: "success" });
    router.refresh();
  }

  if (checking) return <section className={styles.panel}><p role="status">Vérification de votre session…</p></section>;

  if (session && mode === "change") {
    return (
      <section className={styles.panel}>
        <h2>Modifier le mot de passe</h2>
        <p className={styles.accountEmail}>{session.user.email}</p>
        <form className={styles.form} onSubmit={changePassword}>
          <TextField id="account-current-password" label="Mot de passe actuel" variant="outlined" type="password" autoComplete="current-password" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
          <TextField id="account-new-password" label="Nouveau mot de passe" variant="outlined" type="password" autoComplete="new-password" required value={password} onChange={(event) => setPassword(event.target.value)} supportingText="8 caractères minimum, avec au moins une majuscule et un chiffre." />
          <TextField id="account-confirm-password" label="Confirmer le nouveau mot de passe" variant="outlined" type="password" autoComplete="new-password" required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} />
          <Button type="submit" disabled={busy}>{busy ? "Enregistrement…" : "Enregistrer le mot de passe"}</Button>
          <Button variant="text" type="button" disabled={busy} onClick={() => setMode("login")}>Annuler</Button>
        </form>
        {feedback && <p className={feedback.type === "error" ? `${styles.feedback} ${styles.error}` : styles.feedback} role={feedback.type === "error" ? "alert" : "status"}>{feedback.text}</p>}
      </section>
    );
  }

  if (session && mode !== "recovery") {
    return (
      <section className={styles.panel}>
        <h2>Vous êtes connecté</h2>
        <p className={styles.accountEmail}>{session.user.email}</p>
        <div className={styles.actions}>
          <Button variant="outlined" type="button" onClick={() => {
            setMode("change");
            setPassword("");
            setConfirmation("");
            setCurrentPassword("");
            setFeedback(null);
          }}>Modifier le mot de passe</Button>
          <Button variant="text" type="button" disabled={busy} onClick={() => void signOut()}>Se déconnecter</Button>
        </div>
        {feedback && <p className={feedback.type === "error" ? `${styles.feedback} ${styles.error}` : styles.feedback} role={feedback.type === "error" ? "alert" : "status"}>{feedback.text}</p>}
      </section>
    );
  }

  if (mode === "recovery") {
    if (!session) {
      return (
        <section className={styles.panel}>
          <h2>Réinitialiser le mot de passe</h2>
          <p>Ouvrez le lien reçu par e-mail pour accéder à cette étape. Si le formulaire ne s'active pas, demandez un nouveau lien de récupération.</p>
          {feedback && <p className={feedback.type === "error" ? `${styles.feedback} ${styles.error}` : styles.feedback} role={feedback.type === "error" ? "alert" : "status"}>{feedback.text}</p>}
          <Button variant="outlined" href="/compte?mode=forgot">Demander un nouveau lien</Button>
        </section>
      );
    }

    return (
      <section className={styles.panel}>
        <h2>Choisir un nouveau mot de passe</h2>
        <form className={styles.form} onSubmit={submit}>
          <TextField id="account-recovery-password" label="Nouveau mot de passe" variant="outlined" type="password" autoComplete="new-password" required value={password} onChange={(event) => setPassword(event.target.value)} supportingText="8 caractères minimum, avec au moins une majuscule et un chiffre." />
          <TextField id="account-recovery-confirm" label="Confirmer le nouveau mot de passe" variant="outlined" type="password" autoComplete="new-password" required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} />
          <Button type="submit" disabled={busy}>{busy ? "Enregistrement…" : "Réinitialiser le mot de passe"}</Button>
        </form>
        {feedback && <p className={feedback.type === "error" ? `${styles.feedback} ${styles.error}` : styles.feedback} role={feedback.type === "error" ? "alert" : "status"}>{feedback.text}</p>}
      </section>
    );
  }

  const title = mode === "register" ? "Créer un compte" : mode === "forgot" ? "Mot de passe oublié" : "Connexion";
  const submitLabel = mode === "register" ? "Créer mon compte" : mode === "forgot" ? "Envoyer le lien" : "Se connecter";

  return (
    <section className={styles.panel}>
      <h2>{title}</h2>
      <form className={styles.form} onSubmit={submit}>
        <TextField id="account-email" label="Adresse e-mail" variant="outlined" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
        {mode !== "forgot" && <>
          <TextField id="account-password" label="Mot de passe" variant="outlined" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required value={password} onChange={(event) => setPassword(event.target.value)} supportingText={mode === "login" ? undefined : "8 caractères minimum, avec au moins une majuscule et un chiffre."} />
          {mode === "register" && <TextField id="account-password-confirm" label="Confirmer le mot de passe" variant="outlined" type="password" autoComplete="new-password" required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} />}
        </>}
        <Button type="submit" disabled={busy}>{busy ? "Veuillez patienter…" : submitLabel}</Button>
      </form>
      <div className={styles.actions}>
        {mode !== "login" && <Button variant="text" type="button" disabled={busy} onClick={() => {
          setMode("login");
          setFeedback(null);
          setPassword("");
          setConfirmation("");
        }}>Retour à la connexion</Button>}
        {mode === "login" && <>
          <Button variant="text" type="button" disabled={busy} onClick={() => {
            setMode("register");
            setFeedback(null);
            setPassword("");
          }}>Créer un compte</Button>
          <Button variant="text" type="button" disabled={busy} onClick={() => {
            setMode("forgot");
            setFeedback(null);
            setPassword("");
          }}>Mot de passe oublié ?</Button>
        </>}
      </div>
      {feedback && <p className={feedback.type === "error" ? `${styles.feedback} ${styles.error}` : styles.feedback} role={feedback.type === "error" ? "alert" : "status"}>{feedback.text}</p>}
    </section>
  );
}
