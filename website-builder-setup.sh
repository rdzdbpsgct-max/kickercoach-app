#!/usr/bin/env bash
# ============================================================================
# 🚀 Website Builder Setup für Claude Code
# ============================================================================
# Basiert auf: tenfoldmarc/website-builder-setup
# Installiert: UI/UX Pro Max + Framer Motion + 21st.dev Magic
# Nutzung: bash website-builder-setup.sh
# ============================================================================

set -euo pipefail

# Farben
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Status-Tracking
INSTALLED=()
FAILED=()
SKIPPED=()

print_header() {
  echo ""
  echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${CYAN}║${NC}  ${BOLD}🚀 Website Builder Setup für Claude Code${NC}                   ${CYAN}║${NC}"
  echo -e "${CYAN}║${NC}  UI/UX Pro Max · Framer Motion · 21st.dev Magic             ${CYAN}║${NC}"
  echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
  echo ""
}

print_step() {
  local step_num=$1
  local step_name=$2
  echo ""
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BOLD}  Schritt ${step_num}/4: ${step_name}${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

ok()   { echo -e "  ${GREEN}✔${NC} $1"; }
warn() { echo -e "  ${YELLOW}⚠${NC} $1"; }
fail() { echo -e "  ${RED}✘${NC} $1"; }
info() { echo -e "  ${BLUE}ℹ${NC} $1"; }

# ============================================================================
# SCHRITT 0: Voraussetzungen prüfen
# ============================================================================

print_header

print_step "0" "Voraussetzungen prüfen"

# Node.js prüfen
if command -v node &>/dev/null; then
  NODE_VERSION=$(node --version 2>&1)
  ok "Node.js gefunden: ${NODE_VERSION}"
else
  fail "Node.js ist nicht installiert!"
  echo ""
  echo -e "  ${YELLOW}Bitte installiere Node.js (LTS):${NC}"
  echo -e "  → ${BOLD}https://nodejs.org${NC}"
  echo ""
  echo -e "  Danach Terminal neu starten und dieses Script erneut ausführen."
  exit 1
fi

# npm prüfen
if command -v npm &>/dev/null; then
  NPM_VERSION=$(npm --version 2>&1)
  ok "npm gefunden: v${NPM_VERSION}"
else
  fail "npm ist nicht installiert (sollte mit Node.js kommen)."
  exit 1
fi

# Claude Code prüfen
if command -v claude &>/dev/null; then
  ok "Claude Code gefunden"
else
  warn "Claude Code nicht im PATH gefunden."
  info "Falls du Claude Code über die Desktop-App nutzt, ist das OK."
fi

# ============================================================================
# SCHRITT 1: UI/UX Pro Max installieren
# ============================================================================

print_step "1" "UI/UX Pro Max"
info "Design-Intelligenz: 50+ Styles, 161 Farbpaletten, 57 Font-Pairings"
info "Damit sehen deine Seiten designed aus — nicht AI-generiert."
echo ""

echo -e "  Installiere uipro-cli global..."
if npm install -g uipro-cli 2>&1 | tail -1; then
  ok "uipro-cli installiert"

  echo -e "  Initialisiere für Claude Code..."
  if uipro init --ai claude 2>&1 | tail -3; then
    ok "UI/UX Pro Max ist einsatzbereit!"
    INSTALLED+=("UI/UX Pro Max")
  else
    warn "uipro init fehlgeschlagen."
    info "Manuell nachholen: uipro init --ai claude"
    FAILED+=("UI/UX Pro Max (init)")
  fi
else
  fail "npm install fehlgeschlagen."
  info "Manuell nachholen: npm install -g uipro-cli && uipro init --ai claude"
  FAILED+=("UI/UX Pro Max")
fi

# ============================================================================
# SCHRITT 2: Framer Motion Skill installieren
# ============================================================================

print_step "2" "Framer Motion Animations"
info "Smooth Animationen: Page-Transitions, Hover-Effekte, Scroll-Reveals"
info "Der Unterschied zwischen einer 500€- und einer 10.000€-Website."
echo ""

MOTION_INSTALLED=false

# Methode 1: claude install-skill
if command -v claude &>/dev/null; then
  echo -e "  Versuche Installation via claude install-skill..."
  if claude install-skill https://github.com/secondsky/claude-skills -- --name motion 2>&1; then
    ok "Framer Motion Skill installiert (Methode 1)"
    MOTION_INSTALLED=true
    INSTALLED+=("Framer Motion")
  else
    warn "Methode 1 fehlgeschlagen, versuche Alternative..."
  fi
fi

# Methode 2: Backup via npx
if [ "$MOTION_INSTALLED" = false ]; then
  echo -e "  Versuche Installation via npx lobehub market-cli..."
  if npx -y @lobehub/market-cli skills install secondsky-claude-skills-motion --agent claude-code 2>&1; then
    ok "Framer Motion Skill installiert (Methode 2)"
    MOTION_INSTALLED=true
    INSTALLED+=("Framer Motion")
  else
    fail "Automatische Installation fehlgeschlagen."
    info "Manuell nachholen:"
    info "  claude install-skill https://github.com/secondsky/claude-skills -- --name motion"
    FAILED+=("Framer Motion")
  fi
fi

# ============================================================================
# SCHRITT 3: 21st.dev Magic MCP Server einrichten
# ============================================================================

print_step "3" "21st.dev Components (MCP Server)"
info "100+ produktionsreife React-Komponenten: Buttons, Navbars, Hero-Sections,"
info "Cards, Footers — alles vordesigned und sofort einsatzbereit."
echo ""

CLAUDE_CONFIG="$HOME/.claude.json"

echo -e "  ${YELLOW}Dieser Schritt braucht einen kostenlosen API-Key:${NC}"
echo ""
echo -e "  ${BOLD}1.${NC} Öffne: ${CYAN}https://21st.dev/magic/console${NC}"
echo -e "  ${BOLD}2.${NC} Registriere dich / logge dich ein (kostenlos)"
echo -e "  ${BOLD}3.${NC} Kopiere deinen API-Key"
echo ""
read -rp "  Füge deinen 21st.dev API-Key hier ein (oder ENTER zum Überspringen): " API_KEY

if [ -n "$API_KEY" ]; then
  # Claude Config lesen/erstellen und MCP Server hinzufügen
  if [ -f "$CLAUDE_CONFIG" ]; then
    # Prüfen ob mcpServers schon existiert
    if python3 -c "
import json, sys
with open('$CLAUDE_CONFIG', 'r') as f:
    config = json.load(f)
if 'mcpServers' not in config:
    config['mcpServers'] = {}
config['mcpServers']['21st-dev-magic'] = {
    'command': 'npx',
    'args': ['-y', '@21st-dev/magic@latest'],
    'env': {
        'API_KEY': '$API_KEY'
    }
}
with open('$CLAUDE_CONFIG', 'w') as f:
    json.dump(config, f, indent=2)
print('OK')
" 2>&1 | grep -q "OK"; then
      ok "21st.dev Magic MCP Server konfiguriert in ~/.claude.json"
      INSTALLED+=("21st.dev Magic")
    else
      fail "Konnte ~/.claude.json nicht automatisch bearbeiten."
      info "Füge folgendes manuell zu ~/.claude.json unter 'mcpServers' hinzu:"
      echo ""
      cat <<MCPJSON
    "21st-dev-magic": {
      "command": "npx",
      "args": ["-y", "@21st-dev/magic@latest"],
      "env": {
        "API_KEY": "$API_KEY"
      }
    }
MCPJSON
      echo ""
      FAILED+=("21st.dev Magic (Config)")
    fi
  else
    # Neue Config erstellen
    cat > "$CLAUDE_CONFIG" <<NEWCONFIG
{
  "mcpServers": {
    "21st-dev-magic": {
      "command": "npx",
      "args": ["-y", "@21st-dev/magic@latest"],
      "env": {
        "API_KEY": "$API_KEY"
      }
    }
  }
}
NEWCONFIG
    ok "~/.claude.json erstellt mit 21st.dev Magic MCP Server"
    INSTALLED+=("21st.dev Magic")
  fi
else
  warn "Übersprungen — kein API-Key eingegeben."
  info "Später nachholen: https://21st.dev/magic/console"
  SKIPPED+=("21st.dev Magic")
fi

# ============================================================================
# ZUSAMMENFASSUNG
# ============================================================================

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${NC}  ${BOLD}📋 Setup-Zusammenfassung${NC}                                    ${CYAN}║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ ${#INSTALLED[@]} -gt 0 ]; then
  echo -e "  ${GREEN}✔ Installiert:${NC}"
  for item in "${INSTALLED[@]}"; do
    echo -e "    ${GREEN}•${NC} $item"
  done
fi

if [ ${#FAILED[@]} -gt 0 ]; then
  echo ""
  echo -e "  ${RED}✘ Fehlgeschlagen:${NC}"
  for item in "${FAILED[@]}"; do
    echo -e "    ${RED}•${NC} $item"
  done
fi

if [ ${#SKIPPED[@]} -gt 0 ]; then
  echo ""
  echo -e "  ${YELLOW}⚠ Übersprungen:${NC}"
  for item in "${SKIPPED[@]}"; do
    echo -e "    ${YELLOW}•${NC} $item"
  done
fi

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ ${#INSTALLED[@]} -gt 0 ]; then
  echo ""
  echo -e "  ${BOLD}${GREEN}🎉 Setup abgeschlossen!${NC}"
  echo ""
  echo -e "  ${BOLD}Nächste Schritte:${NC}"
  echo -e "  ${YELLOW}1.${NC} Claude Code neu starten (Terminal schließen + öffnen)"
  echo -e "  ${YELLOW}2.${NC} Sag Claude einfach, was du willst. Beispiel:"
  echo ""
  echo -e "  ${CYAN}\"Baue mir eine Landing Page für mein Beratungsunternehmen.${NC}"
  echo -e "  ${CYAN} Zielgruppe: kleine Unternehmen. Dark Theme, modern, mit Animationen.\"${NC}"
  echo ""
  echo -e "  Claude kümmert sich um Design, Layout, Animationen, Responsive — alles."
else
  echo ""
  echo -e "  ${YELLOW}Keine Tools konnten installiert werden.${NC}"
  echo -e "  Prüfe die Fehlermeldungen oben und versuche die manuelle Installation."
fi

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  Quelle: github.com/tenfoldmarc/website-builder-setup"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
