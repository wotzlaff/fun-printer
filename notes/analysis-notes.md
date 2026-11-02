# Analysis Notes (Methodology, Limitations, Open Points)

## Working environment & methodology

1. **XAPK unpacked** (`unzip`) → `extracted/` (not in Git, 206 MB).
   - The XAPK's `manifest.json` = package data (app name, version, permissions, splits).
   - Base APK `com.fun.mxw.apk`: 7369 members, 12 CRC-corrupt (sticker assets only).
2. **uni-app bundle extracted**: `analysis/extract-modules.js` runs
   `assets/apps/__UNI__573AE67/www/app-service.js` in a Node VM with a
   `webpackJsonp` stub and captures the module map → 1303 modules as individual
   files. (The bundle itself is too large for the repo; reconstruct via the
   script + XAPK.)
3. **Relevant modules identified** by searching for
   `plus.android.importClass("android.bluetooth.…")`, `writeBLECharacteristicValue`,
   hex commands (`1B79…`, `5178…`, `2221…`, `55AA…`) → 23 modules formatted
   (`npx js-beautify`) and checked into `analysis/`.
4. **DEX decompiled**: jadx 1.5.4 (`--no-res --no-debug-info -j 6`) over the base
   APK → 11,699 classes; relevant packages:
   `com.xyz.yintibao.*` (image pipeline/encoders, uni plugin "ImageProcess"),
   `com.wtx.ytbbleplugin.*` (uni plugin "Ytbbluetooth", FastBLE).
   The large `hex()` method only decompiled as a bytecode dump
   (`--single-class … --comments-level debug`, stored under `/tmp/opencode/`);
   the dispatch was reconstructed from that dump + the JS wrapper.
5. Documentation with evidence references: JS module ID (`0774.js` = original
   `models/printer/android.js`, visible from the `at …` log strings) and
   Java class/line.

## Alternative DEX analysis via REA (for later deep dives)

REA offers Android tools (`inspect_android_package`, `inspect_android_method` …),
but they require the bring-your-own JAR:

```bash
mkdir -p ~/.local/share/rea/android && cd ~/.local/share/rea/android
curl -fL -o jadx-headless-mcp-0.7.1-all.jar \
  https://github.com/1013503897/jadx-headless-mcp/releases/download/v0.7.1/jadx-headless-mcp-0.7.1-all.jar
echo '6e5eacf500b64292bfb73c49797c1958f6ee44646e43e868039ae7feb573ff75  jadx-headless-mcp-0.7.1-all.jar' | sha256sum -c -
# then restart the REA/MCP client with REA_JADX_MCP_JAR=<absolute path>
```
(Source: `/tmp/rea-repo/docs/android-analysis.md`.) The running REA process read
the variable at startup – after setting it, the MCP client must be restarted.

## Observed limitations (open points)

- **Static, no runtime trace**: all frames derived from code. The CRC-8
  assumptions (poly 0x07 over payload) were verified computationally against
  observed frames (paper F9, quality 97/99, speed 36, energy A2, lattice A1,
  finish 11, AE 00/70, V5X E0/90) – a BLE sniffer trace on the real device
  (nRF Connect / HCI log) remains the final verification step, especially:
  - A3 response layout (positions 4/10/12/14) on your own device,
  - GT01 constants `paperSize/printSize = 384` (jadx constant verified:
    `BitmapCounterConfig.DEFAULT_MAX_BITMAP_COUNT = 384`).
- **Own printer identified**: the device announces itself as **MX10** → model class
  **V5G** (module `3429` `ble_name_config`), 5178 BLE protocol, print width 384 px at
  203 dpi (see Doc 02 section "The device in this project: MX10").
- **MX10 board-name puzzle**: the JS would remap the board name to "GT10"
  (`replace("MX","GT")`), which has no entry in native `PrinterModel.java` (NPE if
  that path were taken). Either MX10 prints through a different entry point, or the
  server-driven device config overrides the static mapping. Flagged as inference in
  Doc 02; a BLE sniff of the original app printing one image resolves it.
- **V8S/V8SPRO (Vson) and P7 (Weiturui)** print via closed plugin encoders
  (no hex format visible in JS); DEX classes exist (`Vsonprinter` module), but
  for these two families the raster path is not fully unraveled.
- **SN auth**: some models verify the SN against the backend (yintb.com);
  whether the hardware itself enforces this is unknown (probably not –
  the check is app-side).
- **12 corrupt assets** in the XAPK (sticker graphics) – irrelevant for printing.

## Device lists (copy from module `c543.js`, as of 8.10.13)

```
GT01 YT01 YT02 MX01 MX02 MX03 MX05 MX06 "MINI PRINTER" MX07 MX09 C21 NEWSMY
D1 D2 E2 JL-BR22 MX08 "URBANWORX KIDS CAMERA" "CYLO BT PRINTER" MXTP-100
AZ-P2108X MX10 MX11 MX12 PD01 "XO POPPY" MX13 BQ01 BQ02 "EWTTO ET-Z0499"
MXW009 MXW010 GV-MA211 KP-IM606 BQ03 BQ17 IM.17
```
