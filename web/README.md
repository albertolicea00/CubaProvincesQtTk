# CubaProvinces — Windows XP Edition

> A whole operating system, just to show off two dropdowns.

## Why does this exist?

I was digging through old archived projects rotting on my PC, found this little
Cuban province/municipality selector, and thought: *"what if I shipped it... but
inside Windows XP?"* It was funnier in my head. Then I built it anyway.

So here it is — a fake Windows XP desktop that lives in your browser, whose only
real job is to demo a [PyQt5 + Tkinter widget](../README.md). Bliss wallpaper and
all. No Python was harmed; the "apps" are HTML/CSS/JS recreations pretending to
be the real `qt.py` and `tk.py`.

## What's in the box

It's a desktop. You know how to use a desktop.

- **Draggable windows** with the classic minimize / maximize / close buttons
- **Start menu + taskbar** with a live clock that actually ticks
- **PyQt5 App** and **Tkinter App** windows — the province → municipality
  selector, running side by side, each showing its live `selected` tuple
- **About & Properties** — flip between **5 sync modes** (A–E), read the
  readme, or fire the `.selected = "municipality"` setter and watch it resolve
  the province for you
- **Display Properties** — change the wallpaper like it's 2003 (the full set of
  20 original XP desktops — Bliss, Ascent, Azul, Red Moon Desert, Stonehenge…
  or a tasteful solid teal)
- **Notepad** — view and copy the actual `qt.py` / `tk.py` source and usage
- **Get JSON** — download `data.json`: all 16 provinces and 168 municipalities,
  flat and structured

## Run it

It's 100% static — no build, no server required:

```bash
# just open it
open index.html              # macOS
# or serve it (nicer for the fetch() calls)
python3 -m http.server       # then visit http://localhost:8000
```

Serving via `http.server` is recommended so the README/code panels load cleanly.

## What it's actually demoing

The real project: [`CubaProvincesQtTk`](../README.md) — two linked dropdowns for
picking a Cuban province and its municipality, shipped in both **PyQt5** (`qt.py`)
and **Tkinter** (`tk.py`) with an identical API. This page just dresses it up in
its Sunday-best Luna theme.

## Files

```
index.html    the entire desktop
style.css     the XP look (Luna blue, bevels, that green Start button)
script.js     window dragging, the fake apps, wallpaper switching, the clock
assets/       avatar, data.json, and the wallpapers (all webp)
```

## Credits
The assets are the original Windows XP set, sourced from [bartekl1/windows-ui-assets](https://github.com/bartekl1/windows-ui-assets/tree/main/Wallpapers/Windows%20XP/Desktop). 

Wallpapers were re‑encoded to WebP for this project, the system sounds were extracted from the original Windows XP audio set and re‑encoded to MP3 for compatibility, and the original Windows XP icons were converted to PNG for use in the interface. 

All wallpapers, audio assets, and icons are © Microsoft and included strictly for nostalgic, non‑commercial demonstration purposes.

---

Built for fun by [@albertolicea00](https://github.com/albertolicea00). 
Insert dial-up sound here...
