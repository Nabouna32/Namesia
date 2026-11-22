#!/usr/bin/env bash
set -euo pipefail

if [[ "${VERCEL_ENV:-}" == "production" && "${VERCEL_GIT_COMMIT_REF:-}" == "main" ]]; then
  echo "Déploiement de production sur main autorisé."
  exit 1
fi

echo "Déploiement ignoré : seule une production issue de main est autorisée."
exit 0