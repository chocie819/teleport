<div align="center">

# 🌍 Teleport

### A chill, map-first geolocation spoofer for Chromium browsers

Override your browser's Geolocation API so any website sees the coordinates **you** choose.
Click a map to drop a pin, tap a calm preset, or type exact lat/lng — then flip the switch.

![Manifest V3](https://img.shields.io/badge/Manifest-V3-4285F4?logo=googlechrome&logoColor=white)
![Browser](https://img.shields.io/badge/Chromium-Chrome%20%C2%B7%20Edge%20%C2%B7%20Brave%20%C2%B7%20Arc-1a1a2e)
![No tracking](https://img.shields.io/badge/Telemetry-none-2ea44f)
![Local only](https://img.shields.io/badge/Network-map%20tiles%20only-orange)
![License](https://img.shields.io/badge/License-MIT-blue)

</div>

---

## ✨ Features

- 🗺️ **Map-first picker** — click anywhere on a Leaflet map to drop a pin and go.
- 🏖️ **Calm presets** — one-tap destinations like Santorini, Banff, Ubud, Reykjavík, and more.
- 🎯 **Precise coordinates** — type exact latitude/longitude for pinpoint control.
- 🌐 **Global override** — applies to every tab and every site at once.
- 🔌 **One-flip toggle** — on for the chosen spot, off for your real location.
- 🔒 **Local & private** — no accounts, no telemetry, no remote scripts. Leaflet is bundled.

---

## 🚀 Install (≈ 30 seconds)

1. Open `chrome://extensions` (works in any Chromium browser — Chrome, Edge, Brave, Arc).
2. Turn on **Developer mode** (top-right).
3. Click **Load unpacked** and select this `teleport` folder.
4. Pin **Teleport** from the puzzle-piece menu.

> 💡 Want a peek before installing? Open `preview.html` in a browser to see the popup UI.

---

## 🎮 Usage

| Action | What happens |
| --- | --- |
| **Click the map** | Drops a pin at that spot |
| **Tap a preset** | Jumps to a curated location |
| **Type lat/lng → Set this pin** | Uses exact coordinates |
| **Flip the toggle ON** | Every tab now reports your chosen spot |
| **Reload tab to apply** | Refreshes pages that already grabbed your location |
| **Flip the toggle OFF** | Instantly returns to your real location |

Test it live at **[browserleaks.com/geo](https://browserleaks.com/geo)**.

---

## 🛠️ How it works

```
┌─────────────┐   chrome.storage   ┌──────────────┐   window msg   ┌────────────┐
│   popup.*   │ ─────────────────▶ │   bridge.js  │ ─────────────▶ │  inject.js │
│  (picker)   │   saves the pin    │ (ISOLATED)   │  relays pin    │   (MAIN)   │
└─────────────┘                    └──────────────┘                └────────────┘
                                    every frame                     overrides
                                                                navigator.geolocation
```

- **`inject.js`** *(page MAIN world)* — replaces `navigator.geolocation` methods so they return the chosen coordinates.
- **`bridge.js`** *(ISOLATED world, every frame)* — reads the saved pin from `chrome.storage` and relays it to the page, with live updates when you change it.
- **`popup.*`** — the picker UI. The map uses **Leaflet** (bundled in `vendor/leaflet/`, so no remote scripts) with CARTO/OpenStreetMap tiles.

---

## 📁 Project structure

```
teleport/
├── manifest.json        # MV3 manifest
├── inject.js            # MAIN-world geolocation override
├── bridge.js            # ISOLATED-world storage ↔ page relay
├── popup.html           # Picker UI
├── popup.css            # Styling
├── popup.js             # Map, presets, toggle logic
├── preview.html         # Standalone popup preview (no install needed)
├── icons/               # 16 / 48 / 128 px icons
└── vendor/leaflet/      # Bundled Leaflet map library
```

---

## ⚠️ Good to know

- Overrides the **in-page JavaScript location API only** — it does **not** change your IP, so IP-based geolocation still reflects your real network.
- Built for **testing location features** and **limiting precise browser-location sharing** — not for evading fraud checks or violating any site's terms of service.
- Map tiles load from CARTO/OpenStreetMap while the popup is open.
- A few hardened sites freeze the geolocation object and won't be affected.

---

## 👤 Contributors

- **[chocie819](https://github.com/chocie819)** — creator & maintainer 🤍

## 📄 License

Released under the [MIT License](LICENSE). Use it, fork it, make it yours.

<div align="center">

Made with 🤍 &nbsp;·&nbsp; *go anywhere, stay chill*

</div>
