# 01 – App-Überblick & Architektur

## Paket-Identität

| Feld | Wert | Quelle |
|---|---|---|
| Paketname | `com.fun.mxw` | XAPK `manifest.json` |
| App-Name | **Fun Print** | XAPK `manifest.json` |
| Version | 8.10.13 (versionCode 81013) | XAPK `manifest.json` |
| minSdk / targetSdk | 24 / 36 | XAPK `manifest.json` |
| ABI | armeabi-v7a (einzige) | `config.armeabi_v7a.apk` |
| Bezugsquelle | APKPure (XAPK-Container) | `ApkPure.com`-Member im XAPK |

XAPK = ZIP-Container: Base-APK (`com.fun.mxw.apk`, 185 MB, 7369 Member) + 19
Config-Splits (Sprachen, `armeabi_v7a`-Native-Libs, `xhdpi`-Ressourcen) + `manifest.json`.
12 Member des Base-APK sind CRC-korrupt (ausschließlich Sticker-Bild-Assets unter
`assets/fbeffect/sticker/…` und eine Galerie-Grafik) – für die Druckanalyse irrelevant;
DEX, Manifest und JS-Bundles sind intakt (geprüft per `zipfile.testzip`-Sweep).

## Architektur: uni-app + Native-Plugins

Die App ist eine **uni-app (DCloud/HBuilderX)**-Anwendung mit Weex-Runtime:

```
┌──────────────────────────────────────────────────────┐
│ app-service.js  (30 MB, Webpack-Bundle, 1303 Module) │  ← gesamte App-Logik (JS)
│   models/printer/*.js  ← Druck-Modelle               │
│   models/opencv.js     ← Bild-Pipeline-Orchestrierung│
│   common/ytb.js        ← Hilfsfunktionen, Modell-    │
│                          erkennung (a061)            │
└──────────────┬───────────────────────────────────────┘
               │ (a) plus.android.importClass(...)   ← direkter Java-Zugriff
               │ (b) uni.requireNativePlugin(...)    ← native uni-app-Plugins
               │ (c) uni.* BLE-APIs (iOS-Pfad)
┌──────────────▼───────────────────────────────────────┐
│ Android (DEX):                                        │
│  com.xyz.yintibao.OpencvUtilsWXModule  = "ImageProce  │
│      ss" (OpenCV-Bildverarbeitung + Hex-Encoder)      │
│  com.xyz.yintibao.library.V5g          = 5178-Encoder │
│  com.wtx.ytbbleplugin.ytbBleFastV3Module = "Ytbbluet  │
│      ooth" (FastBLE-Stack, Write-Queues, Flow-Ctrl)   │
│  AutoPrinterV5 / Vsonprinter / YtbWeiTeRuiModule      │
│      = weitere Druck-Plugins (V5/V8S/P7-Familien)     │
└──────────────────────────────────────────────────────┘
```

Belege: Modul `a305.js` (App.vue `globalData` mit allen Druckerinstanzen),
`uni.requireNativePlugin("ImageProcess")` in `0a9f.js`, `uni.requireNativePlugin("Ytbbluetooth")`
in `dc2f.js`, Java-Klassen unter `com/xyz/yintibao/` bzw. `com/wtx/ytbbleplugin/`
(in `analysis/decompiled/`).

## Die Druckerinstanzen der App (globalData, Modul `a305.js`)

| globalData-Feld | Modul | Bedeutung |
|---|---|---|
| `android_printer` | `0774` (`models/printer/android.js`) | **Bluetooth-Classic-SPP**-Druck (V6/V7S/V8/V10/X5/V8SJP…) |
| `android_ble` | `dc2f` (`models/printer/android_ble.js`) | BLE-Druck über natives `Ytbbluetooth`-Plugin (FastBLE) |
| `ble` | `c543` (`models/printer/ble.js`) | BLE über uni-APIs (Fallback, wenn `use_android_ble=false`) |
| `ios_ble` / `ios_printer` | `daf2` (`models/printer/ios.js`) | iOS-BLE (CoreBluetooth via uni-APIs) |
| `v5_printer` | `d51f` (`models/printer/v5.js`) | V5/V5PRO/V7/V7PRO über Plugin `AutoPrinterV5` |
| `vson_printer` | `8588` (`models/printer/vson.js`) | V8S/V8SPRO über Plugin `Vsonprinter` |
| `wtr_printer` | `e44e` (`models/printer/weiturui.js`) | P7/A4-Drucker (58P7_, A47, A55…) über `YtbWeiTeRuiModule` |
| `v5g_label` | `4ab3` (`models/printer/v5g_label.js`) | Label-Logik (Positionierung/Lernen) für V5G-Board |
| `v5x_label` (d5ca) | `d5ca` | V5X-Label-Protokoll (Dichte, Start/Cancel) |
| `socket` + `socket_port: 8081` | – | WiFi-/TCP-Drucker (Geräte mit Bildschirm, „FriendAI“) |

Verteilung Android (`e289.js`, Funktion `C`):
- **DCK, V5G, V5X, V5N, V5NPRO, V10G, V5C** → BLE (`android_ble` bzw. `ble`)
- **V5, V5PRO, V7, V7PRO** → natives Plugin `AutoPrinterV5`
- **V6, V6PRO, V10, V7S, V7SPRO, V8, V8PRO, V8SJP** → **SPP** über `android_printer`
- **V8S, V8SPRO** → natives Plugin `Vsonprinter`
- **P7** → natives Plugin `YtbWeiTeRuiModule`

## Server-Kommunikation (nicht Teil des Drucks, aber relevant)

- Backend: `https://g.yintb.com/app/` (international) bzw. `https://cn.yintb.com/app/`
  (Modul `4bd5`/`11c6`).
- **SN-Authentifizierung**: Nach Verbinden sendet die App `ble_name`, `ble_address`
  und die aus dem Gerät gelesene SN an `/v2/bluetooth/auth` bzw. `/v2/Bluetooth/get_sn`
  (`e289.js`). Scheitert die Auth, trennt die App die Verbindung. → Eine alternative
  App kann den Druck lokal unabhängig davon implementieren; zu beachten ist nur,
  dass die Original-App diese Backend-Auth für manche Modelle vorsieht.
- Print-Log/Hex-Upload (`/Printer/complete`, `upload_hex`-Config) – Telemetrie.

## Relevante Berechtigungen (Android)

`BLUETOOTH`, `BLUETOOTH_ADMIN`, `BLUETOOTH_SCAN`, `BLUETOOTH_CONNECT`,
`ACCESS_FINE_LOCATION` (BT-Scan vor Android 12), `INTERNET`, `CAMERA`,
`WRITE_EXTERNAL_STORAGE` u. a. – Runtime-Flow in Modul `0c36.js`
(`request_for_android_12()`: `BLUETOOTH_SCAN`+`BLUETOOTH_CONNECT` ab SDK 31,
sonst Location).
