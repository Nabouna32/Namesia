export async function verifyAdminAccess(
  check: () => PromiseLike<{ data: boolean | null; error: unknown | null }>
): Promise<boolean> {
  const { data, error } = await check();
  if (error) throw new Error("La vérification des droits administrateur a échoué.");
  if (typeof data !== "boolean") {
    throw new Error("La vérification des droits administrateur a retourné une réponse invalide.");
  }
  return data;
}
