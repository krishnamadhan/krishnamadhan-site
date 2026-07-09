#!/usr/bin/env bash
# kinetic-status.sh — SAFE, LOG-ONLY continuity check for the kinetic redesign.
# Reads docs/KINETIC_TASKS.md, logs progress + the exact next step to
# ~/logs/kinetic-redesign.log. It NEVER starts/kills processes, never touches
# pm2/banteragent, never pushes, never deletes, never modifies the repo.
set -euo pipefail

REPO="/home/pi/krishnamadhan-site"
LOG="/home/pi/logs/kinetic-redesign.log"
TASKS="$REPO/docs/KINETIC_TASKS.md"
mkdir -p /home/pi/logs

{
  echo "──────────────────────────────────────────"
  echo "kinetic-status $(date '+%F %T')"
  if [ ! -f "$TASKS" ]; then
    echo "STATUS: tracker missing — start from docs/KINETIC_REDESIGN_LOG.md"
    exit 0
  fi
  DONE=$(grep -c '^\- \[x\]' "$TASKS" || true)
  TOTAL=$(grep -c '^\- \[' "$TASKS" || true)
  NEXT=$(grep -m1 '^\- \[ \]' "$TASKS" || echo "ALL TASKS COMPLETE")
  BRANCH=$(git -C "$REPO" branch --show-current 2>/dev/null || echo "?")
  HEAD=$(git -C "$REPO" log --oneline -1 2>/dev/null || echo "?")
  DIRTY=$(git -C "$REPO" status --porcelain 2>/dev/null | grep -cv '^$' || true)
  echo "PROGRESS: $DONE/$TOTAL checked · branch=$BRANCH · dirty_files=$DIRTY"
  echo "HEAD: $HEAD"
  echo "NEXT: $NEXT"
  echo "RESUME: cd $REPO && read docs/KINETIC_REDESIGN_LOG.md (bottom entry), then:"
  echo "        claude \"Resume the kinetic redesign from docs/KINETIC_TASKS.md — continue at the first unchecked task.\""
} >> "$LOG"
