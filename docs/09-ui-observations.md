# 09 – UI Observations of the Original App (Requirements Basis for the Redesign)

This document summarizes what the original app can do – as a menu to choose from
when designing an alternative UI. (Observed from the page registry, i18n strings
and module structure; not meant as a UX template – much of it is a
monetization-heavy framework with login/ads.)

## Feature inventory (154 pages, `analysis/page-paths.json`)

### Printing (core)
- **Image printing**: gallery/camera → editing (crop, rotate, brightness/contrast,
  "enhance", red/blue channel removal for special paper) → preview with dithering
  options → print.
- **Text printing**: notes, templates, diary ("publishing mood"), poems.
- **Document printing**: documents, web printing (URL → server-side rendering →
  print), online course printing.
- **OCR/text recognition** and translation (server-side).
- **AI features**: AI print, AI painting (cartoon/polymer/clay styles), AI search,
  chat bot – all server-based (yintb.com), with points purchase.
- **Label printing**: label editor (Fabric.js templates in a webview,
  `pages/lable_app*`), standard label sizes (20/25/30/40/50 mm), round labels,
  barcode/QR, material learning.
- **Study/class features**: timetable, vocabulary trainer, exam questions, error
  notebook, formulas (study-app origin of the code base).
- **Banner printing** (multi-page split printing), **tattoo preview**.
- **Device management**: BT scan/connect, device info (model, SN, FW, battery),
  firmware update, WiFi configuration (for screen devices).

### Connect/status UX
- Device search with name filter + tip list ("Please turn on the device…")
- Connection status via event bus (`update_connected_status`, `connect_complete`,
  `ble_connect_state_change`)
- Print progress in percent (`print_percent` – **counted up per packet, partly
  with random increments, i.e. cosmetic**)
- Status popups: paper out / overheat / battery / cancelled

### Design language (observation)
- Tab bar + page navigation, day/night mode, i18n (25+ languages incl. DE).
- Color scheme/base: native navbars, uni-popup components, mui/hybrid-html pages
  for content. Ad/splash logic and a login wall are clearly visible in the bundle.

## Recommendation for the alternative UI (interpretation, not observation)

1. **Treat the core loop as a first-class citizen**: connect → pick image/text →
   preview (true 1 bpp rendering, exactly like the printer!) → print with real
   progress (packet X/Y) and flow-control state.
2. **Live raster preview**: the app knows all parameters (width in px, dithering,
   threshold) – an alternative can render the preview pixel-exact from the same
   encoder, guaranteeing "what I see is what the head prints".
3. **Density as a slider** instead of 3 levels (the protocol supports 1–200 energy).
4. **Status bar**: poll the A3 status cyclically (paper, heat, battery) – the
   original app waits for error events; proactive polling is better.
5. **No cloud requirement**: printing works fully locally (BLE/SPP). Servers are
   only needed for AI/OCR/templates/telemetry – a minimal app needs no backend.
6. **Skip firmware update** (risky, little value) or keep it isolated.
