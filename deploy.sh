#!/usr/bin/env bash
# Deploy the "How to Read a Poem" workshop site to GitHub Pages.
set -e
cd "$(dirname "$0")"
OWNER="jts3et"
REPO="how-to-read-a-poem"
MSG="${1:-Update workshop site}"

git init -q 2>/dev/null || true
git add -A
git commit -q -m "$MSG" || echo "(nothing to commit)"
git branch -M main

if gh repo view "$OWNER/$REPO" >/dev/null 2>&1; then
  git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$OWNER/$REPO.git"
  git push -q -u origin main
else
  gh repo create "$OWNER/$REPO" --public --source=. --remote=origin --push
fi

# enable Pages (idempotent: create, else update)
gh api -X POST "repos/$OWNER/$REPO/pages" -f "source[branch]=main" -f "source[path]=/" >/dev/null 2>&1 \
  || gh api -X PUT "repos/$OWNER/$REPO/pages" -f "source[branch]=main" -f "source[path]=/" >/dev/null 2>&1 \
  || true
gh api -X POST "repos/$OWNER/$REPO/pages/builds" >/dev/null 2>&1 || true

echo "https://$OWNER.github.io/$REPO/"
