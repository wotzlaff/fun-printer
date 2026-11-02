# 01 – App Overview & Architecture

## Package identity

| Field | Value | Source |
|---|---|---|
| Package name | `com.fun.mxw` | XAPK `manifest.json` |
| App name | **Fun Print** | XAPK `manifest.json` |
| Version | 8.10.13 (versionCode 81013) | XAPK `manifest.json` |
| minSdk / targetSdk | 24 / 36 | XAPK `manifest.json` |
| ABI | armeabi-v7a (only) | `config.armeabi_v7a.apk` |
| Distribution source | APKPure (XAPK container) | `ApkPure.com` member in the XAPK |

XAPK = ZIP container: base APK (`com.fun.mxw.apk`, 185 MB, 7369 members) + 19
config splits (languages, `armeabi_v7a` native libs, `xhdpi` resources) + `manifest.json`.
12 members of the base APK are CRC-corrupt (exclusively sticker image assets under
`assets/fbeffect/sticker/…` and one gallery image) – irrelevant for the print
analysis; DEX, manifest and JS bundles are intact (verified via a `zipfile.testzip` sweep).

## Architecture: uni-app + native plugins

The app is a **uni-app (DCloud/HBuilderX)** application with the Weex runtime:

```
┌──────────────────────────────────────────────────────┐
│ app-service.js  (30 MB, webpack bundle, 1303 modules)│  ← entire app logic (JS)
│   models/printer/*.js  ← print models                │
│   models/opencv.js     ← image pipeline orchestration│
│   common/ytb.js        ← helpers, model detection    │
│                          (a061)                      │
└──────────────┬───────────────────────────────────────┘
               │ (a) plus.android.importClass(...)   ← direct Java access
               │ (b) uni.requireNativePlugin(...)    ← native uni-app plugins
               │ (c) uni.* BLE APIs (iOS path)
┌──────────────▼───────────────────────────────────────┐
│ Android (DEX):                                        │
│  com.xyz.yintibao.OpencvUtilsWXModule  = "ImageProce  │
│      ss" (OpenCV image processing + hex encoders)     │
│  com.xyz.yintibao.library.V5g          = 5178 encoder │
│  com.wtx.ytbbleplugin.ytbBleFastV3Module = "Ytbbluet  │
│      ooth" (FastBLE stack, write queues, flow ctrl)   │
│  AutoPrinterV5 / Vsonprinter / YtbWeiTeRuiModule      │
│      = further print plugins (V5/V8S/P7 families)     │
└──────────────────────────────────────────────────────┘
```

Evidence: module `a305.js` (App.vue `globalData` holding all printer instances),
`uni.requireNativePlugin("ImageProcess")` in `0a9f.js`, `uni.requireNativePlugin("Ytbbluetooth")`
in `dc2f.js`, Java classes under `com/xyz/yintibao/` and `com/wtx/ytbbleplugin/`
(in `analysis/decompiled/`).

## The app's printer instances (globalData, module `a305.js`)

| globalData field | Module | Meaning |
|---|---|---|
| `android_printer` | `0774` (`models/printer/android.js`) | **Bluetooth Classic SPP** printing (V6/V7S/V8/V10/X5/V8SJP…) |
| `android_ble` | `dc2f` (`models/printer/android_ble.js`) | BLE printing via the native `Ytbbluetooth` plugin (FastBLE) |
| `ble` | `c543` (`models/printer/ble.js`) | BLE via uni APIs (fallback when `use_android_ble=false`) |
| `ios_ble` / `ios_printer` | `daf2` (`models/printer/ios.js`) | iOS BLE (CoreBluetooth via uni APIs) |
| `v5_printer` | `d51f` (`models/printer/v5.js`) | V5/V5PRO/V7/V7PRO via the `AutoPrinterV5` plugin |
| `vson_printer` | `8588` (`models/printer/vson.js`) | V8S/V8SPRO via the `Vsonprinter` plugin |
| `wtr_printer` | `e44e` (`models/printer/weiturui.js`) | P7/A4 printers (58P7_, A47, A55…) via `YtbWeiTeRuiModule` |
| `v5g_label` | `4ab3` (`models/printer/v5g_label.js`) | Label logic (positioning/learning) for the V5G board |
| `v5x_label` (d5ca) | `d5ca` | V5X label protocol (density, start/cancel) |
| `socket` + `socket_port: 8081` | – | WiFi/TCP printers (screen devices, "FriendAI") |

Android dispatch (`e289.js`, function `C`):
- **DCK, V5G, V5X, V5N, V5NPRO, V10G, V5C** → BLE (`android_ble` or `ble`)
- **V5, V5PRO, V7, V7PRO** → native plugin `AutoPrinterV5`
- **V6, V6PRO, V10, V7S, V7SPRO, V8, V8PRO, V8SJP** → **SPP** via `android_printer`
- **V8S, V8SPRO** → native plugin `Vsonprinter`
- **P7** → native plugin `YtbWeiTeRuiModule`

## Server communication (not part of printing, but relevant)

- Backend: `https://g.yintb.com/app/` (international) or `https://cn.yintb.com/app/`
  (module `4bd5`/`11c6`).
- **SN authentication**: after connecting, the app sends `ble_name`, `ble_address`
  and the SN read from the device to `/v2/bluetooth/auth` or `/v2/Bluetooth/get_sn`
  (`e289.js`). If auth fails, the app disconnects. → An alternative app can
  implement printing fully locally and independently; it only needs to know that
  the original app performs this backend auth for some models.
- Print log/hex upload (`/Printer/complete`, `upload_hex` config) – telemetry.

## Relevant permissions (Android)

`BLUETOOTH`, `BLUETOOTH_ADMIN`, `BLUETOOTH_SCAN`, `BLUETOOTH_CONNECT`,
`ACCESS_FINE_LOCATION` (BT scan before Android 12), `INTERNET`, `CAMERA`,
`WRITE_EXTERNAL_STORAGE`, among others – runtime flow in module `0c36.js`
(`request_for_android_12()`: `BLUETOOTH_SCAN`+`BLUETOOTH_CONNECT` on SDK 31+,
otherwise location).
