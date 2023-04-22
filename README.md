# CubaProvincesQtTk

> 🌐 **English** · [Español](README.es.md)

![Python](https://img.shields.io/badge/Python-3.x-3776AB?style=flat-square&logo=python&logoColor=white)
![PyQt5](https://img.shields.io/badge/PyQt5-5.15+-41CD52?style=flat-square&logo=qt&logoColor=white)
![Tkinter](https://img.shields.io/badge/Tkinter-stdlib-FF6F00?style=flat-square)

Two linked dropdowns for picking a Cuban **province** and its **municipality**:
select a province in the first box and the second auto-populates with that
province's municipalities.

Ships in **two interchangeable implementations** with the same public API:

| Implementation | Module | Widget toolkit | Dependency |
|----------------|--------|----------------|------------|
| PyQt5 | [qt.py](qt.py) | `PyQt5.QtWidgets.QComboBox` | `PyQt5` |
| Tkinter | [tk.py](tk.py) | `tkinter.ttk.Combobox` | standard library |

## Requirements

- Python 3.x
- **PyQt5 version:** [PyQt5](https://pypi.org/project/PyQt5/) (`>=5.15`) — `pip install -r requirements.txt`
- **Tkinter version:** no extra install, but your Python must be built with Tk
  support (`python -c "import tkinter"` must succeed).

### Environment check

Confirm the toolkit you want is available before running:

```bash
./testqt.sh   # checks PyQt5 is installed
./testtk.sh   # checks Tkinter (Tk) support
```

Both accept a `PYTHON` override, e.g. `PYTHON=/usr/bin/python3 ./testtk.sh`.

## Examples

The usage is documented inline in the [example/](example/) scripts:

| Script | Toolkit | Mode |
|--------|---------|------|
| [example/qt.example1.py](example/qt.example1.py) | PyQt5 | caller-managed boxes |
| [example/qt.example2.py](example/qt.example2.py) | PyQt5 | group-built boxes |
| [example/tk.example1.py](example/tk.example1.py) | Tkinter | caller-managed boxes |
| [example/tk.example2.py](example/tk.example2.py) | Tkinter | group-built boxes |

Run them **from the project root** so the `from qt`/`from tk` imports resolve:

```bash
python example/qt.example1.py
python example/qt.example2.py
python example/tk.example1.py
python example/tk.example2.py
```

## Provinces included

<kbd>Isla de la Juventud</kbd> <kbd>Pinar del Río</kbd> <kbd>Artemisa</kbd> <kbd>La Habana</kbd> <kbd>Mayabeque</kbd> <kbd>Matanzas</kbd> <kbd>Cienfuegos</kbd> <kbd>Villa Clara</kbd> <kbd>Sancti Spíritus</kbd> <kbd>Ciego de Ávila</kbd> <kbd>Camagüey</kbd> <kbd>Las Tunas</kbd> <kbd>Granma</kbd> <kbd>Holguín</kbd> <kbd>Santiago de Cuba</kbd> <kbd>Guantánamo</kbd>

## Project structure

```
qt.py            CubaProvinces_BoxGroup (PyQt5 implementation)
tk.py            CubaProvinces_BoxGroup (Tkinter implementation)
base/main.py     Provinces_Municipaly repository (province → municipality data)
base/municipality_*.py   one municipality list per province
example/         Mode A / Mode B example scripts for both toolkits
testqt.sh        PyQt5 availability check
testtk.sh        Tkinter availability check
requirements.txt PyQt5 dependency pin
```

---

Created by [@albertolicea00](https://github.com/albertolicea00)
