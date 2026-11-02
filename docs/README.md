# Fun Print (com.fun.mxw) – Technical Analysis of the Printing Function

Reverse engineering of the Android app **Fun Print 8.10.13** (`com.fun.mxw-8.10.13.xapk`)
for small Chinese Bluetooth thermal printers. Goal: document all technical details of
the printing function (Bluetooth transports, protocols, image conversion) well enough
to build an **alternative UI** (own app).

## Quick summary (TL;DR)

| Topic | Summary |
|---|---|
| App type | uni-app (DCloud/HBuilderX) + Weex runtime; app logic in `app-service.js` (30 MB webpack bundle) |
| Vendor/cloud | YinTiBao (yintb.com) – one code base for several white labels (Fun Print, 印题宝, iBleem, 喵学王, FriendAI) |
| Printer families | Mini printers (BLE, proprietary `51 78` protocol), photo printers (Bluetooth Classic SPP, ESC/POS-like), label printers (`22 21` protocol), A4 printers (native plugins), WiFi printers (TCP 8081) |
| BLE transport | Service `0000FF00-…` (write `FF02` without response, notify `FF01`/`FF03`), alternatively `0000AE30-…` and `0000200A-…`; MTU requests of 82/503 |
| SPP transport | UUID `00001101-0000-1000-8000-00805F9B34FB`, `createInsecureRfcommSocketToServiceRecord` (Android, via the `plus.android` bridge from JS) |
| Print data | 1 bpp raster (black=1). Per family: `51 78` line frames (mini printers), `ESC * 0x21` 24-dot bands (V5/V7), `GS v 0` (V7S), `1D 82` raster (V8/V10), `22 21` frames (V5X label) |
| CRC | CRC-8, polynomial 0x07, init 0x00 ("CRC-8/ATM"), computed over the payload, before the `0xFF` terminator |
| Flow control | Printer sends pause/resume notifications (`…AE01010010 70 FF` = stop, `…AE01010000 00 FF` = continue); the native side pauses the write queue |
| Image pipeline | OpenCV: scale/rotate → dithering (Floyd/Sierra) for photos or adaptive threshold for text → per-model encoder → hex string → chunked BLE/SPP write |

## Documentation

1. [App overview & architecture](01-app-overview.md)
2. [Device & model matrix](02-devices-and-models.md)
3. [Bluetooth transports (SPP + BLE)](03-bluetooth-transport.md)
4. [Protocol "51 78" – BLE mini printers](04-protocol-5178.md)
5. ["ESC/POS-like" protocols – SPP photo printers](05-protocol-escpos-spp.md)
6. [Label & misc protocols (22 21 / 55 AA / 56 88)](06-protocol-label-misc.md)
7. [Image processing & encoders](07-image-processing.md)
8. [End-to-end print workflow](08-print-workflow.md)
9. [UI observations of the original app (basis for the redesign)](09-ui-observations.md)

## Evidence

- `analysis/decompiled/` – the key jadx-decompiled Java classes
  (incl. `V5g.java` = complete 5178 encoder, `OpencvUtilsWXModule.java` = image
  pipeline, `ytbBleFastV3Module.java` = BLE stack, `FlowWrite.java` = chunking/flow control)
- `analysis/*.js` – the relevant formatted webpack modules from `app-service.js`
  (file names = webpack module IDs; original paths are visible in the `at …` log
  strings, e.g. `0774.js` = `models/printer/android.js`)
- `analysis/page-paths.json` – all 154 pages of the original app
- `analysis/extract-modules.js` – script for splitting the bundle

> ⚠️ The decompiled sources are copyrighted material of the app vendor and are
> intended only for private interoperability analysis. They serve as evidence
> and must not be reused in a derived product.

## Open points / limitations

See [notes/analysis-notes.md](../notes/analysis-notes.md): statically analyzed;
no runtime measurement on the real device. Which printer is "yours" depends on its
Bluetooth name (identification guide in [Doc 02](02-devices-and-models.md)).
