#!/usr/bin/env bash
#
# Punyakoti Taila — interactive dev menu
#
# Stack this script is built for:
#   • Next.js App Router — storefront at /  and Payload CMS at /admin
#   • Payload CMS 3 — collections, globals, media (Postgres via Drizzle)
#   • Supabase Postgres — DATABASE_URL (local CLI :54325) or DATABASE_URL_PROD (cloud pooler :5432)
#   • Supabase Auth — shopper login (separate from Payload admin users)
#   • ImageKit — binary media; Payload Media docs hold imagekitUrl
#
# Typical local flow:
#   1) supabase start
#   2) pnpm menu → Database → Payload schema sync (after collection/global changes)
#   3) pnpm menu → Seed → collections/globals content
#   4) pnpm menu → Run app (dev:safe — PAYLOAD_DISABLE_DB_PUSH=true)
#
# Usage:
#   ./scripts/pt-dev.sh
#   pnpm menu
#
# Requires: pnpm, Node 20+, Supabase CLI for local Postgres reset/start.
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

PID_FILE="$ROOT/.pt-dev-server.pid"
LOG_FILE="$ROOT/.pt-dev-server.log"

# ── UI helpers ──────────────────────────────────────────────────────────────

if [[ -t 1 ]]; then
  BOLD='\033[1m'
  DIM='\033[2m'
  GREEN='\033[0;32m'
  YELLOW='\033[1;33m'
  RED='\033[0;31m'
  CYAN='\033[0;36m'
  RESET='\033[0m'
else
  BOLD='' DIM='' GREEN='' YELLOW='' RED='' CYAN='' RESET=''
fi

hr() { printf '%s\n' "${DIM}────────────────────────────────────────────────────────${RESET}"; }
pause() { read -r -p "$(echo -e "${DIM}Press Enter to continue…${RESET}")" _; }

die() {
  echo -e "${RED}Error:${RESET} $*" >&2
  exit 1
}

require_pnpm() {
  command -v pnpm >/dev/null 2>&1 || die "pnpm not found. Install Node 20+ and enable pnpm."
}

print_stack_cheat_sheet() {
  echo -e "${BOLD}Architecture (Payload CMS + Supabase)${RESET}"
  echo ""
  echo "  ${BOLD}Payload CMS${RESET} — source of truth for products, pages, homepage globals,"
  echo "  storefront copy, and admin users. Schema lives in Postgres tables managed"
  echo "  by Payload/Drizzle (pnpm cms:sync / pnpm db:sync)."
  echo ""
  echo "  ${BOLD}Supabase Postgres${RESET} — hosts that database only:"
  echo "    • Local:  DATABASE_URL → 127.0.0.1:54325 (supabase start)"
  echo "    • Prod:   DATABASE_URL_PROD → pooler :5432 (pnpm seed/db:sync → prod)"
  echo "  Next dev uses DATABASE_URL from .env unless a script overrides it."
  echo ""
  echo "  ${BOLD}Supabase Auth${RESET} — storefront shoppers (phone / Google / email)."
  echo "  Profiles sync to Payload ${DIM}customers${RESET} collection. Payload ${DIM}users${RESET}"
  echo "  are CMS admins only (/admin login)."
  echo ""
  echo "  ${BOLD}ImageKit${RESET} — product/home images; seed sync-assets / imagekit-media."
  echo ""
  hr
  echo -e "${BOLD}URLs (local)${RESET}"
  echo "  Storefront     http://localhost:3000"
  echo "  Payload admin  http://localhost:3000/admin"
  echo "  Payload API    http://localhost:3000/api"
  echo "  Supabase Studio (if CLI running) — see: supabase status"
  echo ""
  echo -e "${BOLD}After you change src/collections or src/globals${RESET}"
  echo "  1) pnpm db:sync  (pick local or prod Postgres)"
  echo "  2) pnpm seed     (fill or refresh CMS content)"
  echo ""
  echo -e "${BOLD}Docs${RESET}  doc/SEED_APIS.md · doc/AUTH.md · doc/DEPLOY_VERCEL.md · doc/IMAGEKIT.md"
  echo ""
}

DEV_PORT="${PT_DEV_PORT:-3000}"
LOCAL_PG_HOST="127.0.0.1"
LOCAL_PG_PORT="54325"

postgres_local_reachable() {
  if command -v nc >/dev/null 2>&1; then
    nc -z "$LOCAL_PG_HOST" "$LOCAL_PG_PORT" 2>/dev/null
    return $?
  fi
  return 1
}

http_reachable() {
  curl -sf -o /dev/null --max-time 3 "$1" 2>/dev/null
}

# Storefront UI + Payload CMS + local Supabase Postgres (one-line each).
print_service_status_board() {
  local pg_ok=0 ui_ok=0 cms_ok=0
  postgres_local_reachable && pg_ok=1
  http_reachable "http://${LOCAL_PG_HOST}:${DEV_PORT}/" && ui_ok=1
  http_reachable "http://${LOCAL_PG_HOST}:${DEV_PORT}/admin" && cms_ok=1

  if [[ "$pg_ok" == 1 ]]; then
    echo -e "  Supabase Postgres (Docker)   ${GREEN}● running${RESET}  ${LOCAL_PG_HOST}:${LOCAL_PG_PORT}"
  else
    echo -e "  Supabase Postgres (Docker)   ${RED}○ stopped${RESET}   ${LOCAL_PG_HOST}:${LOCAL_PG_PORT}"
  fi
  if [[ "$ui_ok" == 1 ]]; then
    echo -e "  Storefront UI                ${GREEN}● up${RESET}          http://localhost:${DEV_PORT}"
  else
    echo -e "  Storefront UI                ${DIM}○ not running${RESET}  http://localhost:${DEV_PORT}"
  fi
  if [[ "$cms_ok" == 1 ]]; then
    echo -e "  Payload CMS (/admin)         ${GREEN}● up${RESET}          http://localhost:${DEV_PORT}/admin"
  else
    echo -e "  Payload CMS (/admin)         ${DIM}○ not running${RESET}  http://localhost:${DEV_PORT}/admin"
  fi
}

print_supabase_cli_status() {
  if ! command -v supabase >/dev/null 2>&1; then
    echo -e "  ${YELLOW}Supabase CLI not installed${RESET} — https://supabase.com/docs/guides/cli"
    return 0
  fi
  echo -e "${DIM}Supabase CLI (Docker containers):${RESET}"
  supabase status 2>&1 | sed 's/^/  /' || true
  echo ""
}

supabase_status_unhealthy() {
  if ! command -v supabase >/dev/null 2>&1; then
    return 1
  fi
  supabase status 2>&1 | grep -qiE 'not running|exited|error'
}

wait_for_postgres() {
  local max="${1:-120}"
  local waited=0
  while ! postgres_local_reachable && (( waited < max )); do
    sleep 1
    waited=$((waited + 1))
  done
  postgres_local_reachable
}

# Fix "supabase start is already running" while supabase_db_* container is exited.
repair_supabase_local() {
  echo -e "${YELLOW}Repairing local Supabase (stop → start)…${RESET}"
  echo -e "${DIM}This clears a stuck state when the DB container exited but the CLI still thinks the stack is up.${RESET}"
  echo ""

  if command -v docker >/dev/null 2>&1; then
    if ! docker info >/dev/null 2>&1; then
      die "Docker Desktop is not running. Start Docker, then try again."
    fi
  fi

  echo -e "${GREEN}→ supabase stop${RESET}"
  supabase stop 2>&1 | sed 's/^/  /' || true
  sleep 2

  echo -e "${GREEN}→ supabase start${RESET}"
  supabase start 2>&1 | sed 's/^/  /' || true

  if wait_for_postgres 120; then
    return 0
  fi

  # Last resort: start the DB container directly if it exists but is stopped.
  if command -v docker >/dev/null 2>&1; then
    local db_c
    db_c="$(docker ps -aq --filter 'name=supabase_db_' 2>/dev/null | head -1)"
    if [[ -n "$db_c" ]]; then
      echo -e "${YELLOW}→ docker start ${db_c}${RESET}"
      docker start "$db_c" 2>/dev/null || true
      wait_for_postgres 60 && return 0
    fi
  fi

  return 1
}

# Start or repair local Supabase until Postgres listens on :54325.
ensure_local_supabase_running() {
  if postgres_local_reachable; then
    return 0
  fi

  if command -v docker >/dev/null 2>&1 && ! docker info >/dev/null 2>&1; then
    die "Docker Desktop is not running. Start Docker, then run supabase start."
  fi

  echo -e "${GREEN}→ supabase start${RESET}"
  echo ""
  supabase start 2>&1 | sed 's/^/  /' || true

  if wait_for_postgres 30; then
    return 0
  fi

  if supabase_status_unhealthy; then
    echo ""
    repair_supabase_local && return 0
  fi

  return 1
}

# Before Next dev: show stack status; start Supabase if Postgres is down.
preflight_dev_start() {
  echo ""
  echo -e "${BOLD}── Local stack status ──${RESET}"
  print_service_status_board
  echo ""

  if postgres_local_reachable; then
    print_supabase_cli_status
    return 0
  fi

  echo -e "${RED}Supabase Postgres is not reachable on ${LOCAL_PG_HOST}:${LOCAL_PG_PORT}.${RESET}"
  echo -e "  ${DIM}Payload CMS reads DATABASE_URL from .env — local dev expects Supabase in Docker.${RESET}"
  echo ""

  if ! command -v supabase >/dev/null 2>&1; then
    die "Install the Supabase CLI, then run: supabase start"
  fi

  print_supabase_cli_status

  if supabase_status_unhealthy; then
    echo -e "${YELLOW}Detected unhealthy Supabase containers (often: DB exited while CLI says 'already running').${RESET}"
    if confirm_yes "Repair and start local Supabase (supabase stop → start)?"; then
      echo ""
      if repair_supabase_local; then
        echo -e "${GREEN}Postgres is accepting connections on :${LOCAL_PG_PORT}.${RESET}"
        echo ""
        print_supabase_cli_status
        echo -e "${BOLD}── Updated stack status ──${RESET}"
        print_service_status_board
        echo ""
        return 0
      fi
      echo -e "${RED}Repair failed.${RESET} Try manually: supabase stop && supabase start"
      echo ""
    fi
  elif confirm_yes "Start local Supabase now (supabase start / Docker)?"; then
    echo ""
    if ensure_local_supabase_running; then
      echo -e "${GREEN}Postgres is accepting connections on :${LOCAL_PG_PORT}.${RESET}"
      echo ""
      print_supabase_cli_status
      echo -e "${BOLD}── Updated stack status ──${RESET}"
      print_service_status_board
      echo ""
      return 0
    fi
    echo -e "${RED}Could not start Supabase Postgres on :${LOCAL_PG_PORT}.${RESET}"
    echo -e "  Try: ${BOLD}supabase stop && supabase start${RESET} (with Docker Desktop running)"
    echo ""
  fi

  if confirm_yes "Start Next.js anyway without Postgres? (Payload will fail on DB access)"; then
    echo ""
    return 0
  fi

  echo "Cancelled — use main menu → 2 → 4 (Supabase start) or run: supabase stop && supabase start"
  return 1
}

# Stop Next dev and start dev:safe in background (storefront + Payload /admin).
restart_ui_and_payload() {
  echo ""
  echo -e "${BOLD}Restart storefront UI + Payload CMS${RESET}"
  echo -e "  ${DIM}Stops Next on :${DEV_PORT}, clears dev lock, starts pnpm dev:safe in background.${RESET}"
  echo ""

  if ! preflight_dev_start; then
    return 1
  fi

  stop_next_dev_server

  echo -e "${GREEN}→ pnpm dev:safe (background)${RESET}"
  nohup pnpm dev:safe >"$LOG_FILE" 2>&1 &
  echo $! >"$PID_FILE"
  echo "PID $(cat "$PID_FILE") — log: $LOG_FILE"
  sleep 3
  echo ""
  echo -e "${BOLD}── Stack status (after restart) ──${RESET}"
  print_service_status_board
  echo ""
  return 0
}

# Stop and start all local Supabase Docker containers (Postgres for Payload).
rebuild_supabase_containers() {
  echo ""
  echo -e "${BOLD}Rebuild local Supabase (Docker)${RESET}"
  echo -e "  ${DIM}supabase stop → supabase start — fixes exited DB containers and stuck CLI state.${RESET}"
  echo -e "  ${DIM}Does not wipe Payload data (use Reset menu for supabase db reset).${RESET}"
  echo ""

  command -v supabase >/dev/null 2>&1 || die "supabase CLI not installed"

  if command -v docker >/dev/null 2>&1 && ! docker info >/dev/null 2>&1; then
    die "Docker Desktop is not running. Start Docker, then try again."
  fi

  if ! confirm_yes "Stop and restart all local Supabase containers?"; then
    echo "Cancelled."
    return 0
  fi

  echo ""
  if repair_supabase_local; then
    echo -e "${GREEN}Supabase stack rebuilt.${RESET}"
  else
    echo -e "${RED}Rebuild failed.${RESET} Try manually: supabase stop && supabase start"
    return 1
  fi

  echo ""
  print_supabase_cli_status
  echo -e "${BOLD}── Stack status ──${RESET}"
  print_service_status_board
  echo ""
  return 0
}

# PIDs listening on a TCP port (macOS/Linux: lsof).
pids_on_port() {
  local port="$1"
  lsof -ti "tcp:${port}" -sTCP:LISTEN 2>/dev/null || true
}

# Stop Next.js dev for this repo: menu PID file, listeners on :3000/:3001, stale .next/dev lock.
stop_next_dev_server() {
  local killed=0
  local pid

  if [[ -f "$PID_FILE" ]]; then
    pid="$(cat "$PID_FILE")"
    if [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null; then
      echo -e "${YELLOW}Stopping background dev (PID ${pid})…${RESET}"
      kill "$pid" 2>/dev/null || true
      killed=1
    fi
    rm -f "$PID_FILE"
  fi

  local port pids
  for port in "$DEV_PORT" 3001; do
    pids="$(pids_on_port "$port")"
    if [[ -n "$pids" ]]; then
      echo -e "${YELLOW}Freeing port ${port} (PID(s): ${pids//[$'\n']/ })…${RESET}"
      while IFS= read -r pid; do
        [[ -z "$pid" ]] && continue
        kill "$pid" 2>/dev/null || true
        killed=1
      done <<<"$pids"
    fi
  done

  if [[ "$killed" == 1 ]]; then
    sleep 1
    for port in "$DEV_PORT" 3001; do
      pids="$(pids_on_port "$port")"
      while IFS= read -r pid; do
        [[ -z "$pid" ]] && continue
        if kill -0 "$pid" 2>/dev/null; then
          kill -9 "$pid" 2>/dev/null || true
        fi
      done <<<"$pids"
    done
    echo -e "${GREEN}Port ${DEV_PORT} is free.${RESET}"
    sleep 0.3
  fi

  # Next.js 16+ dev instance lock (same project dir).
  if [[ -d "$ROOT/.next/dev" ]]; then
    rm -f "$ROOT/.next/dev/lock" 2>/dev/null || true
  fi
}

# Run `pnpm <script>` after Supabase preflight and clearing any stale Next dev.
run_dev_foreground() {
  local script="$1"
  preflight_dev_start || return 1
  stop_next_dev_server
  echo -e "${GREEN}→ pnpm ${script}${RESET}"
  echo ""
  pnpm "$script"
}

banner() {
  clear 2>/dev/null || true
  echo -e "${BOLD}${CYAN}"
  echo "  ╔══════════════════════════════════════════════════════╗"
  echo "  ║    Punyakoti Taila — Payload CMS + Supabase Dev      ║"
  echo "  ╚══════════════════════════════════════════════════════╝"
  echo -e "${RESET}"
  echo -e "  ${DIM}Next.js storefront · Payload /admin · Postgres on Supabase${RESET}"
  echo -e "  ${DIM}Repo:${RESET} $ROOT"
  hr
}

to_lower() {
  printf '%s' "$1" | tr '[:upper:]' '[:lower:]'
}

pick_number() {
  local prompt="$1"
  local max="$2"
  local default="${3:-}"
  local min="${4:-1}"
  local answer
  if [[ -n "$default" ]]; then
    read -r -p "$(echo -e "${prompt} [${default}]: ${RESET}")" answer
    answer="${answer:-$default}"
  else
    read -r -p "$(echo -e "${prompt}: ${RESET}")" answer
  fi
  if ! [[ "$answer" =~ ^[0-9]+$ ]]; then
    return 1
  fi
  if (( answer < min || answer > max )); then
    return 1
  fi
  echo "$answer"
}

confirm_yes() {
  local msg="$1"
  local answer
  read -r -p "$(echo -e "${YELLOW}${msg}${RESET} [y/N]: ")" answer
  answer="$(to_lower "$answer")"
  [[ "$answer" == "y" || "$answer" == "yes" ]]
}

confirm_prod() {
  local action="$1"
  echo -e "${RED}${BOLD}PRODUCTION Supabase Postgres${RESET}"
  echo -e "  ${DIM}Payload will read/write collections & globals on the cloud DB.${RESET}"
  echo -e "  Action: ${action}"
  if [[ -f "$ROOT/.env" ]]; then
    grep -E '^DATABASE_URL_PROD=' "$ROOT/.env" 2>/dev/null | sed 's/:[^:@]*@/:****@/g' || true
  fi
  local answer
  read -r -p "$(echo -e "Type ${BOLD}yes${RESET} to continue: ")" answer
  answer="$(to_lower "$answer")"
  [[ "$answer" == "yes" ]]
}

pick_db_target() {
  echo ""
  echo -e "${BOLD}Which Supabase Postgres should Payload use?${RESET}"
  echo -e "  ${DIM}(pnpm seed / pnpm db:sync set DATABASE_URL for this run only)${RESET}"
  echo ""
  echo "  1) Local  — Supabase CLI Postgres @ 127.0.0.1:54325"
  echo "              env: DATABASE_URL in .env"
  echo "  2) Prod    — Supabase session pooler @ :5432"
  echo "              env: DATABASE_URL_PROD in .env"
  echo ""
  local n
  n="$(pick_number "Enter 1 or 2" 2 1)" || die "Invalid choice"
  if [[ "$n" == "2" ]]; then
    echo "prod"
  else
    echo "local"
  fi
}

run_seed() {
  local target="$1"
  local key="$2"
  local force="${3:-}"

  if [[ "$target" == "prod" ]] && ! confirm_prod "Seed: ${key}"; then
    echo "Cancelled."
    return 0
  fi

  local args=(seed -- "$target" "$key")
  if [[ -n "$force" ]]; then
    args+=(--force)
  fi

  echo ""
  echo -e "${GREEN}→ pnpm ${args[*]}${RESET}"
  echo ""
  pnpm "${args[@]}"
}

# Seeds that support --force are handled in menu_seed per option.

menu_seed() {
  banner
  echo -e "${BOLD}Seed Payload CMS (Supabase Postgres)${RESET}"
  echo ""
  echo "  Writes collections & globals via Payload API (products, pages,"
  echo "  homepage-settings, shop-listing, media, testimonials, …)."
  echo "  Idempotent by default; Force overwrites selected globals/catalogs."
  echo -e "  ${DIM}Does not create Payload admin users — use /admin after first boot.${RESET}"
  echo ""

  local target
  target="$(pick_db_target)"

  echo ""
  echo -e "${BOLD}Seed type${RESET}"
  echo "   1) Complete site seed (recommended for empty DB)"
  echo "   2) Sync assets/ → ImageKit → Payload media"
  echo "   3) ImageKit catalog → Payload media docs"
  echo "   4) Categories only"
  echo "   5) Media catalog (legacy Unsplash URLs)"
  echo "   6) Products + categories"
  echo "   7) PLP catalog (chip categories + district products)"
  echo "   8) Testimonials (+ portraits)"
  echo "   9) Service locations"
  echo "  10) Homepage settings (all bands + product wiring)"
  echo "  11) CMS site pages (block layouts)"
  echo "  12) Storefront globals (shop, cart, account, …)"
  echo "  13) Site pages + storefront globals"
  echo "  14) Open full interactive seed CLI (pnpm seed)"
  echo "   0) Back"
  echo ""

  local n
  n="$(pick_number "Enter 0–14" 14)" || { echo "Invalid choice"; pause; return; }

  case "$n" in
    0) return ;;
    1) run_seed "$target" all ;;
    2) run_seed "$target" sync-assets ;;
    3) run_seed "$target" imagekit-media ;;
    4) run_seed "$target" categories ;;
    5) run_seed "$target" media ;;
    6) run_seed "$target" products ;;
    7)
      local force=""
      if confirm_yes "Force overwrite PLP catalog?"; then force="1"; fi
      run_seed "$target" plp "$force"
      ;;
    8)
      local force=""
      if confirm_yes "Force overwrite testimonials?"; then force="1"; fi
      run_seed "$target" testimonials "$force"
      ;;
    9) run_seed "$target" service-locations ;;
    10)
      local force=""
      if confirm_yes "Force overwrite homepage global?"; then force="1"; fi
      run_seed "$target" homepage "$force"
      ;;
    11) run_seed "$target" site-pages ;;
    12) run_seed "$target" storefront-globals ;;
    13) run_seed "$target" pages ;;
    14) pnpm seed ;;
    *) echo "Invalid choice" ;;
  esac
  pause
}

menu_run_app() {
  banner
  echo -e "${BOLD}Run Next.js + Payload${RESET}"
  echo ""
  echo -e "  ${DIM}Payload admin and REST/GraphQL API mount on the same dev server.${RESET}"
  echo -e "  ${DIM}Use dev:safe so Drizzle does not push schema on every file save.${RESET}"
  echo -e "  ${DIM}If port ${DEV_PORT} is busy, the menu stops the old Next dev process first.${RESET}"
  echo ""
  echo "   1) Dev server (safe) — ${DIM}PAYLOAD_DISABLE_DB_PUSH=true — recommended${RESET}"
  echo "   2) Dev server — standard next dev"
  echo "   3) Dev server — allow Payload Drizzle schema push on boot"
  echo "   4) Production build + start (local smoke test)"
  echo "   5) Start dev server in background (safe)"
  echo "   6) Stop dev server (free port ${DEV_PORT})"
  echo "   7) Tail background dev log"
  echo "   8) Restart UI + Payload — stop Next → dev:safe in background"
  echo "   0) Back"
  echo ""

  local n
  n="$(pick_number "Enter 0–8" 8)" || { echo "Invalid choice"; pause; return; }

  case "$n" in
    0) return ;;
    1) run_dev_foreground dev:safe || pause ;;
    2) run_dev_foreground dev || pause ;;
    3) run_dev_foreground dev:with-push || pause ;;
    4)
      preflight_dev_start || { pause; return; }
      stop_next_dev_server
      pnpm dev:prod
      ;;
    5)
      preflight_dev_start || { pause; return; }
      stop_next_dev_server
      echo -e "${GREEN}Starting pnpm dev:safe in background…${RESET}"
      nohup pnpm dev:safe >"$LOG_FILE" 2>&1 &
      echo $! >"$PID_FILE"
      echo "PID $(cat "$PID_FILE") — log: $LOG_FILE"
      sleep 2
      echo ""
      echo -e "${BOLD}── Stack status (after start) ──${RESET}"
      print_service_status_board
      echo ""
      pause
      ;;
    6)
      stop_next_dev_server
      echo "Dev server stopped (port ${DEV_PORT} / background PID cleared)."
      pause
      ;;
    7)
      if [[ -f "$LOG_FILE" ]]; then
        tail -n 80 -f "$LOG_FILE"
      else
        echo "No log at $LOG_FILE"
        pause
      fi
      ;;
    8)
      restart_ui_and_payload || true
      pause
      ;;
    *) echo "Invalid choice"; pause ;;
  esac
}

menu_database() {
  banner
  echo -e "${BOLD}Payload schema ↔ Supabase Postgres${RESET}"
  echo ""
  echo "  Payload (@payloadcms/db-postgres) maps collections/globals to Postgres"
  echo "  tables on Supabase. Run sync after changing src/collections or src/globals."
  echo ""
  echo "   1) db:sync — pick local or prod Supabase, then import map + types + Drizzle push"
  echo "   2) cms:sync — use DATABASE_URL from .env (usually local :54325)"
  echo "   3) Supabase CLI status (Postgres + Studio URLs)"
  echo "   4) Supabase start / repair (local Docker Postgres for Payload)"
  echo "   5) Supabase stop"
  echo "   6) Generate payload-types.ts only"
  echo "   7) Show stack & workflow cheat sheet"
  echo "   8) Rebuild Supabase Docker stack (stop → start, keeps DB data)"
  echo "   0) Back"
  echo ""

  local n
  n="$(pick_number "Enter 0–8" 8)" || { echo "Invalid choice"; pause; return; }

  case "$n" in
    0) return ;;
    1) pnpm db:sync ;;
    2)
      echo -e "${GREEN}→ pnpm cms:sync${RESET}"
      echo -e "${DIM}Targets DATABASE_URL in .env (local Supabase Postgres).${RESET}"
      if confirm_yes "Drizzle may prompt to accept column drops when globals changed — continue?"; then
        printf 'y\n' | pnpm cms:sync || pnpm cms:sync
      fi
      ;;
    3) command -v supabase >/dev/null && supabase status || die "supabase CLI not installed"
      pause
      ;;
    4)
      command -v supabase >/dev/null || die "supabase CLI not installed"
      echo -e "${DIM}Payload DATABASE_URL should point at ${LOCAL_PG_HOST}:${LOCAL_PG_PORT}.${RESET}"
      echo ""
      if postgres_local_reachable; then
        echo -e "${GREEN}Postgres is already reachable on :${LOCAL_PG_PORT}.${RESET}"
        print_supabase_cli_status
      elif supabase_status_unhealthy; then
        repair_supabase_local || die "Could not repair Supabase. Try: supabase stop && supabase start"
        print_supabase_cli_status
      elif ensure_local_supabase_running; then
        print_supabase_cli_status
      else
        repair_supabase_local || die "Could not start Supabase. Is Docker Desktop running?"
        print_supabase_cli_status
      fi
      pause
      ;;
    5) command -v supabase >/dev/null && supabase stop || die "supabase CLI not installed"
      pause
      ;;
    6) pnpm run generate:types
      pause
      ;;
    7)
      print_stack_cheat_sheet
      pause
      ;;
    8)
      rebuild_supabase_containers || true
      pause
      ;;
    *) echo "Invalid choice"; pause ;;
  esac
}

menu_tests() {
  banner
  echo -e "${BOLD}Tests${RESET}"
  echo ""
  echo "   1) Full suite (Vitest + Playwright)"
  echo "   2) Unit / integration only (Vitest)"
  echo "   3) E2E — all Playwright specs"
  echo "   4) E2E — storefront home"
  echo "   5) E2E — auth login"
  echo "   6) E2E — admin"
  echo "   7) Install Playwright Chromium"
  echo "   8) Typecheck (tsc --noEmit)"
  echo "   9) Lint"
  echo "  10) Lint with auto-fix"
  echo "   0) Back"
  echo ""

  local n
  n="$(pick_number "Enter 0–10" 10)" || { echo "Invalid choice"; pause; return; }

  case "$n" in
    0) return ;;
    1) pnpm test ;;
    2) pnpm test:int ;;
    3) pnpm test:e2e ;;
    4) pnpm exec playwright test tests/e2e/frontend.e2e.spec.ts --reporter=line ;;
    5) pnpm exec playwright test tests/e2e/auth-login.e2e.spec.ts --reporter=line ;;
    6) pnpm exec playwright test tests/e2e/admin.e2e.spec.ts --reporter=line ;;
    7) pnpm exec playwright install chromium ;;
    8) pnpm exec tsc --noEmit ;;
    9) pnpm lint ;;
    10) pnpm lint:fix ;;
    *) echo "Invalid choice" ;;
  esac
  [[ "$n" != "0" ]] && pause
}

menu_reset_restore() {
  banner
  echo -e "${BOLD}Reset Supabase Postgres & restore Payload demo data${RESET}"
  echo ""
  echo -e "  ${YELLOW}Wipes Payload-managed tables in ${BOLD}local${RESET}${YELLOW} Supabase Postgres only.${RESET}"
  echo "  Does not delete cloud Supabase Auth users or production Postgres."
  echo "  Restore = supabase db reset → Payload cms:sync → pnpm seed (all)."
  echo ""
  echo "   1) Full local restore — reset DB → schema sync → complete seed"
  echo "   2) Wipe local DB only (supabase db reset)"
  echo "   3) Re-seed local only (complete site seed, no wipe)"
  echo "   4) Re-seed prod only (complete site seed, with confirmation)"
  echo "   5) Force homepage seed on local (overwrite homepage global)"
  echo "   0) Back"
  echo ""

  local n
  n="$(pick_number "Enter 0–5" 5)" || { echo "Invalid choice"; pause; return; }

  case "$n" in
    0) return ;;
    1)
      if ! confirm_yes "This will WIPE local Supabase and re-seed everything. Continue?"; then
        echo "Cancelled."
        pause
        return
      fi
      command -v supabase >/dev/null || die "supabase CLI required for db reset"
      echo -e "${GREEN}→ supabase db reset${RESET}"
      supabase db reset
      echo -e "${GREEN}→ pnpm cms:sync (Payload tables on fresh Postgres)${RESET}"
      printf 'y\n' | pnpm cms:sync || pnpm cms:sync
      echo -e "${GREEN}→ pnpm seed -- local all (Payload collections & globals)${RESET}"
      run_seed local all
      echo -e "${GREEN}Local restore complete.${RESET}"
      pause
      ;;
    2)
      if ! confirm_yes "Wipe local Supabase Postgres?"; then
        echo "Cancelled."
        pause
        return
      fi
      command -v supabase >/dev/null || die "supabase CLI required"
      supabase db reset
      echo "Done. Run schema sync + seed when ready (menu options 2 → 1 or 3)."
      pause
      ;;
    3) run_seed local all; pause ;;
    4) run_seed prod all; pause ;;
    5)
      if confirm_yes "Force overwrite homepage global on local?"; then
        pnpm seed -- local homepage --force
      fi
      pause
      ;;
    *) echo "Invalid choice"; pause ;;
  esac
}

menu_tooling() {
  banner
  echo -e "${BOLD}Tooling (Auth, media, docs)${RESET}"
  echo ""
  echo "   1) Supabase Auth URL config (Google/email redirects — doc/AUTH.md)"
  echo "   2) ImageKit catalog → imagekitCatalog.generated.ts"
  echo "   3) Payload seed HTTP APIs reference (doc/SEED_APIS.md)"
  echo "   4) Vercel deploy + DATABASE_URL_PROD (doc/DEPLOY_VERCEL.md)"
  echo "   5) Supabase + Payload architecture cheat sheet"
  echo "   0) Back"
  echo ""

  local n
  n="$(pick_number "Enter 0–5" 5)" || { echo "Invalid choice"; pause; return; }

  case "$n" in
    0) return ;;
    1) pnpm auth:configure-urls; pause ;;
    2) pnpm imagekit:list; pause ;;
    3)
      if command -v open >/dev/null; then open "$ROOT/doc/SEED_APIS.md"
      elif command -v xdg-open >/dev/null; then xdg-open "$ROOT/doc/SEED_APIS.md"
      else less "$ROOT/doc/SEED_APIS.md"
      fi
      ;;
    4)
      if command -v open >/dev/null; then open "$ROOT/doc/DEPLOY_VERCEL.md"
      elif command -v xdg-open >/dev/null; then xdg-open "$ROOT/doc/DEPLOY_VERCEL.md"
      else less "$ROOT/doc/DEPLOY_VERCEL.md"
      fi
      ;;
    5)
      print_stack_cheat_sheet
      pause
      ;;
    *) echo "Invalid choice"; pause ;;
  esac
}

menu_health() {
  banner
  echo -e "${BOLD}Environment & health (Payload + Supabase)${RESET}"
  echo ""

  if [[ -f "$ROOT/.env" ]]; then
    echo -e "${BOLD}Payload / Postgres (.env, masked)${RESET}"
    grep -E '^(DATABASE_URL|DATABASE_URL_PROD|DATABASE_URL_LOCAL|PAYLOAD_SECRET|PAYLOAD_DISABLE_DB_PUSH|NEXT_PUBLIC_SERVER_URL)=' "$ROOT/.env" 2>/dev/null \
      | sed 's/:[^:@]*@/:****@/g' \
      | sed 's/^PAYLOAD_SECRET=.*/PAYLOAD_SECRET=****/' || echo "  (no matching keys)"
    echo ""
    echo -e "${BOLD}Supabase Auth (storefront)${RESET}"
    grep -E '^(NEXT_PUBLIC_SUPABASE_URL|NEXT_PUBLIC_SUPABASE_ANON_KEY)=' "$ROOT/.env" 2>/dev/null \
      | sed 's/=.*/=****/' || echo "  (not set)"
    echo ""
    echo -e "${BOLD}ImageKit (Payload media)${RESET}"
    grep -E '^IMAGEKIT_URL_ENDPOINT=' "$ROOT/.env" 2>/dev/null || echo "  IMAGEKIT_URL_ENDPOINT not set"
  else
    echo -e "${YELLOW}No .env file — copy .env.example and set DATABASE_URL + PAYLOAD_SECRET.${RESET}"
  fi

  echo ""
  echo -e "${BOLD}── Service status ──${RESET}"
  print_service_status_board

  if command -v supabase >/dev/null; then
    echo ""
    print_supabase_cli_status
  else
    echo ""
    echo "  supabase CLI: not installed (needed for local Docker Postgres)"
  fi

  echo ""
  if [[ -f "$PID_FILE" ]] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
    echo -e "  ${GREEN}Background dev: running (PID $(cat "$PID_FILE"))${RESET}"
  else
    echo "  Background dev: not running"
  fi

  pause
}

main_menu() {
  require_pnpm

  while true; do
    banner
    echo -e "${BOLD}Main menu${RESET}"
    echo ""
    echo -e "${BOLD}── Stack status ──${RESET}"
    print_service_status_board
    echo ""
    echo "   1) Run Next.js + Payload (dev server)"
    echo "   2) Payload schema ↔ Supabase Postgres"
    echo "   3) Seed Payload collections & globals"
    echo "   4) Tests (unit + E2E + lint)"
    echo "   5) Reset local Supabase DB & restore Payload demo data"
    echo "   6) Tooling (Supabase Auth, ImageKit, docs)"
    echo "   7) Environment & health (Payload + Supabase)"
    echo "   8) Stack & workflow cheat sheet"
    echo "   9) Restart storefront UI + Payload (stop Next → dev:safe)"
    echo "  10) Rebuild local Supabase Docker (stop → start)"
    echo "   0) Exit"
    echo ""

    local n
    n="$(pick_number "Choose" 10 0 0)" || continue

    case "$n" in
      0) echo "Bye."; exit 0 ;;
      1) menu_run_app ;;
      2) menu_database ;;
      3) menu_seed ;;
      4) menu_tests ;;
      5) menu_reset_restore ;;
      6) menu_tooling ;;
      7) menu_health ;;
      8) banner; print_stack_cheat_sheet; pause ;;
      9) restart_ui_and_payload; pause ;;
      10) rebuild_supabase_containers; pause ;;
      *) echo "Invalid choice"; pause ;;
    esac
  done
}

# Non-interactive shortcuts: ./scripts/pt-dev.sh seed local homepage
if [[ $# -gt 0 ]]; then
  require_pnpm
  case "${1:-}" in
    seed)
      shift
      target="${1:-local}"
      key="${2:-all}"
      force="${3:-}"
      run_seed "$target" "$key" "$force"
      exit 0
      ;;
    health)
      menu_health
      exit 0
      ;;
    stack)
      banner
      print_stack_cheat_sheet
      exit 0
      ;;
    restart-ui)
      restart_ui_and_payload
      exit 0
      ;;
    rebuild-supabase)
      rebuild_supabase_containers
      exit 0
      ;;
    *)
      echo "Usage: $0 [seed <local|prod> <seed-key> [force]] | [health] | [stack] | [restart-ui] | [rebuild-supabase]"
      exit 1
      ;;
  esac
fi

main_menu
