# 09 – UI-Beobachtungen der Original-App (Anforderungsbasis fürs Redesign)

Diese Dokumentation fasst zusammen, was die Original-App kann – als Grundlage,
aus der man für eine alternative Oberfläche auswählen kann. (Beobachtet aus
Seitenregistry, i18n-Strings und Modulstruktur; nicht als UX-Vorlage gemeint –
vieles davon ist Zweck-Framework mit Login/Ads.)

## Funktionsumfang (154 Seiten, `analysis/page-paths.json`)

### Drucken (Kern)
- **Bild-Druck**: Galerie/Kamera → Bearbeitung (Zuschnitt, Rotieren, Helligkeit/
  Kontrast, „Enhance“, Rotton-/Blauton-Entfernung für Roxter-Papier) →
  Vorschau mit Dithering-Optionen → Druck.
- **Text-Druck**: Notizen, Vorlagen, Tagebuch („Publishing Mood“), Gedichte.
- **Dokument-Druck**: Dokumente, Web-Druck (URL → Server-Rendering → Druck),
  Online-Kurs-Druck.
- **OCR/Texterkennung** und Übersetzung (serverseitig).
- **AI-Funktionen**: AI-Druck, AI-Zeichnen (Cartoon/Polymer/Tuyahuihua-Stile),
  AI-Suche, Chat-Bot – alles serverbasiert (yintb.com), mit Punktekauf.
- **Label-Druck**: Label-Editor (Fabric.js-Templates im Webview,
  `pages/lable_app*`), Standard-Labelgrößen (20/25/30/40/50 mm), Rund-Labels,
  Barcode/QR, Material-Lernen.
- **Aufgaben-/Klassen-Features**: Zeitplan, Vokabeltrainer, Prüfungsaufgaben,
  Fehlerheft, Formeln (Lern-App-Herkunft der Codebasis).
- **Banner-Druck** (mehrseitiger Zusammendruck), **Tattoo-Vorschau**.
- **Geräteverwaltung**: BT-Scan/Verbinden, Geräteinfo (Modell, SN, FW, Akku),
  Firmware-Update, WiFi-Konfiguration (bei Screen-Geräten).

### Connect-/Status-UX
- Gerätesuche mit Namensfilter + Tipp-Liste („Bitte Gerät einschalten…“)
- Verbindungsstatus als Event-Bus (`update_connected_status`, `connect_complete`,
  `ble_connect_state_change`)
- Druckfortschritt in Prozent (`print_percent` – **an der Paketanzahl hochgezählt,
  teils mit Zufallsanteil, also kosmetisch**)
- Status-Popups: papierlos / überhitzt / Akku / abgebrochen

### Design-Sprache (Beobachtung)
- Tabbar + Seiten-Navigation, Tag-/Nachtmodus, i18n (25+ Sprachen inkl. DE).
- Farbschema/Basis: Native-Navbars, uni-popup-Komponenten, mui/hybrid-html-Seiten
  für Inhalt. Ad-/Splash-Logik und Login-Wall sind im Bundle deutlich sichtbar.

## Empfehlung für die alternative Oberfläche (Interpretation, nicht Beobachtung)

1. **Kern-Loop als First-Class-Bürger**: Verbinden → Bild/Text wählen → Vorschau
   (echtes 1bpp-Rendern wie der Drucker!) → Druck mit echtem Fortschritt
   (Paket-X/Y) und Flow-Control-Status.
2. **Live-Raster-Vorschau**: Die App kennt alle Parameter (Breite in px, Dithering,
   Schwelle) – eine Alternative kann die Vorschau pixelgenau aus demselben Encoder
   rendern und „was ich sehe, druckt der Kopf“ garantieren.
3. **Dichte als Slider** statt 3 Stufen (das Protokoll kann 1–200 Energie).
4. **Statusleiste**: A3-Status zyklisch abfragen (Papier, Hitze, Akku) – die
   Original-App wartet auf Fehler-Events; proaktives Polling ist besser.
5. **Kein Cloud-Zwang**: Druck geht komplett lokal (BLE/SPP). Server werden nur
   für AI/OCR/Templates/Telemetrie gebraucht – eine Minimal-App braucht kein Backend.
6. **Firmware-Update weglassen** (riskant, wenig Mehrwert) oder isoliert halten.
