import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const provider = await readFile(new URL("../components/features/favorites/FavoritesProvider.tsx", import.meta.url), "utf8");
const button = await readFile(new URL("../components/features/favorites/FavoriteButton.tsx", import.meta.url), "utf8");
const list = await readFile(new URL("../components/features/favorites/FavoritesList.tsx", import.meta.url), "utf8");
const migration = await readFile(new URL("../supabase/migrations/20261127133138_user_favorites.sql", import.meta.url), "utf8");

test("les favoris courants sont chargés depuis Supabase et jamais depuis le stockage local", () => {
  assert.match(provider, /createSupabaseBrowserClient/);
  assert.match(provider, /\.from\("user_favorites"\)/);
  assert.match(provider, /\.eq\("user_id", targetUserId\)/);
  assert.match(provider, /\.insert\(\{ user_id: userId, name_id: name\.id \}\)/);
  assert.doesNotMatch(provider, /localStorage|sessionStorage/);
});

test("une fiche reste consultable sans compte et propose une connexion pour ajouter un favori", () => {
  assert.match(button, /Se connecter pour enregistrer/);
  assert.match(button, /\/compte\?redirect=/);
  assert.match(list, /if \(!authenticated\)/);
  assert.match(list, /Vous pouvez continuer à explorer toutes les fiches sans vous connecter/);
});

test("la migration locale ne lit les anciens favoris qu'après l'action explicite", () => {
  const migrationAction = list.slice(list.indexOf("async function migrerFavorisLocaux"), list.indexOf("return (", list.indexOf("async function migrerFavorisLocaux")));
  assert.match(list, /Importer mes anciens favoris de cet appareil/);
  assert.match(migrationAction, /window\.localStorage\.getItem\(CLE_FAVORIS_LEGACY\)/);
  assert.match(migrationAction, /await ajouterPlusieurs\(legacySlugs\)/);
  assert.ok(migrationAction.indexOf("await ajouterPlusieurs(legacySlugs)") < migrationAction.indexOf("window.localStorage.removeItem(CLE_FAVORIS_LEGACY)"));
  assert.match(migrationAction, /if \(partial\)[\s\S]*?return;/);
  assert.doesNotMatch(provider, /localStorage/);
});

test("la table des favoris est protégée par des policies de propriété et de publication", () => {
  assert.match(migration, /enable row level security/);
  assert.match(migration, /auth\.uid\(\)\) = user_id/);
  assert.match(migration, /p\.status = 'publie'/);
  assert.doesNotMatch(migration, /to anon/);
});
