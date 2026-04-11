# Website Builder — Claude Code Projektkontext

## Verfügbare Tools

Dieses Projekt nutzt drei installierte Design-Tools. Nutze sie aktiv:

### UI/UX Pro Max
- **Aktivierung:** Automatisch bei UI/UX-Anfragen, oder explizit via `/ui-ux-pro-max`
- **Fähigkeiten:** 50+ Design-Styles, 161 Farbpaletten, 57 Font-Pairings, 98 UX-Guidelines
- **Suchlauf:** `python scripts/search.py "<keyword>" --domain <style|color|typography|ux|chart|landing>`
- **Design-System generieren:** `python scripts/search.py "<product_type> <industry>" --design-system`
- **Wichtig:** Ergebnisse IMMER durch Anti-AI-Slop-Filter prüfen. Keine generischen Fonts (Inter, Roboto, Arial). Keine Purple-on-White-Gradients. Keine cookie-cutter SaaS-Layouts.

### Framer Motion
- **Nutzen für:** Page-Transitions, Hover-Effekte, Scroll-Reveals, Staggered Animations
- **Prinzipien:** 
  - CSS-only bevorzugen wo möglich
  - Timing: 150–300ms für Micro-Interactions
  - High-Impact-Momente fokussieren (Page-Load, Scroll-Reveals)
  - Asymmetrie und Overlap für visuelles Interesse

### 21st.dev Magic (MCP Server)
- **Komponenten:** 100+ produktionsreife React-Komponenten
- **Verfügbar:** Buttons, Navbars, Hero-Sections, Cards, Footers, Testimonials, Pricing-Tables
- **Nutzung:** Komponenten via MCP-Toolcall abrufen statt von Scratch bauen

## Design-Philosophie

1. **Anti-AI-Slop:** Jede Seite muss aussehen, als hätte ein Designer sie gebaut — nicht eine KI
2. **Distinctive Typography:** Ungewöhnliche, aber passende Fonts wählen. Google Fonts nutzen.
3. **Intentional Color:** Farbpaletten branchenspezifisch wählen via UI/UX Pro Max
4. **Motion with Purpose:** Animationen nur wo sie Wert schaffen, nicht überall
5. **Mobile First:** Responsive Design ist Pflicht, nicht optional

## Workflow für neue Websites

1. **Briefing verstehen:** Was macht das Business? Wer ist die Zielgruppe? Welcher Vibe?
2. **Design-System erstellen:** Via UI/UX Pro Max — README.md mit Farben, Fonts, Spacing
3. **Struktur planen:** Sektionen definieren, Copywriting-Konzept erstellen
4. **Sektion für Sektion bauen:** Eine nach der anderen, jede polieren bevor weiter
5. **Animationen hinzufügen:** Framer Motion für professionellen Touch
6. **Review & Polish:** Responsive testen, Performance prüfen, Details verfeinern

## Tech-Stack (Standard)

- **Framework:** Next.js (App Router) oder React + Vite
- **Styling:** Tailwind CSS
- **Animationen:** Framer Motion
- **Komponenten:** 21st.dev + shadcn/ui
- **Deployment:** Vercel (empfohlen)

## Beispiel-Prompts

```
Baue mir eine Landing Page für mein Beratungsunternehmen. Zielgruppe: KMU. 
Dark Theme, modern, mit Animationen.
```

```
Erstelle eine Portfolio-Website für einen Fotografen. Minimalistisch, 
viel Whitespace, elegante Bildergalerie mit Hover-Effekten.
```

```
Baue eine SaaS-Landing-Page mit Pricing-Section, Testimonials und 
Feature-Grid. Professionell, trustworthy, blaue Akzentfarbe.
```
