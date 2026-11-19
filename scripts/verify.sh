#!/usr/bin/env bash
# Closed-loop verification helper for Forge
# Usage: ./scripts/verify.sh [smoke|full]

set -euo pipefail

MODE=${1:-smoke}
URL=${URL:-http://localhost:3000}

if ! command -v kane-cli &>/dev/null; then
  echo "kane-cli not found. Install with: npm install -g @testmuai/kane-cli"
  exit 1
fi

if [ "$MODE" = "full" ]; then
  TARGET="tests/full_flow_test.md"
else
  TARGET="tests/smoke_test.md"
fi

echo "→ Running Kane CLI ($MODE) against $URL"
echo "  File: $TARGET"
echo

kane-cli testmd run "$TARGET" --agent --headless --url "$URL"
STATUS=$?

if [ $STATUS -eq 0 ]; then
  echo
  echo "✅  Kane PASSED. Safe to claim the feature is done."
else
  echo
  echo "❌  Kane FAILED. Read the evidence above, fix, then re-run."
  echo "    Do not mark the task complete until this script exits 0."
fi

exit $STATUS
