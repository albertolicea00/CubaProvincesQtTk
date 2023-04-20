# CubaProvincesQt

> 🌐 **English** · [Español](README.es.md)

Two linked PyQt5 combo boxes for picking a Cuban **province** and its **municipality**. Select a province in the first box and the second box auto-populates with that province's municipalities.

Ships with all 16 provinces and their municipalities (Spanish names, with accents).

## Requirements

- Python 3.x
- [PyQt5](https://pypi.org/project/PyQt5/) (`>=5.15`)

## Installation

```bash
pip install -r requirements.txt
```

## Usage

Import `CubaProvinces_BoxGroup` from `qt` and call `exec()`. Two modes:

### Mode A — bring your own combo boxes

Pass two existing `QComboBox` widgets. The group fills the province box and links the municipality box to it.

```python
from PyQt5.QtWidgets import *
from qt import *

app = QApplication([])
root = QMainWindow()

cb_provinces = QComboBox(root)
cb_municipality = QComboBox(root)
cb_provinces.setGeometry(0, 0, 200, 30)
cb_municipality.setGeometry(0, 32, 200, 30)

a = CubaProvinces_BoxGroup(provinceBox=cb_provinces, municipalityBox=cb_municipality)
a.exec()

root.show()
app.exec_()
```

### Mode B — let the group build the boxes

Pass a `parent` widget and an `allignment`; the group creates and positions both combo boxes for you.

```python
from PyQt5.QtWidgets import *
from qt import *

app = QApplication([])
root = QMainWindow()

a = CubaProvinces_BoxGroup(parent=root, allignment="row")
a.exec()

root.show()
app.exec_()
```

See [qt.example1.py](qt.example1.py) (Mode A) and [qt.example2.py](qt.example2.py) (Mode B).

## API

### `CubaProvinces_BoxGroup(provinceBox=None, municipalityBox=None, parent=None, allignment="row")`

| Parameter | Type | Description |
|-----------|------|-------------|
| `provinceBox` | `QComboBox` | Existing box for provinces (Mode A). |
| `municipalityBox` | `QComboBox` | Existing box for municipalities (Mode A). |
| `parent` | `QWidget` | Parent widget; if set, the group builds both boxes (Mode B). |
| `allignment` | `str` | `"row"` (stacked) or `"column"` (side by side). Only used in Mode B. |

- `exec()` / `exec_()` — populate the province box and wire the province→municipality link.

Behavior by argument combination:

- both boxes set → provinces filled, municipality box linked to province selection.
- only `provinceBox` → provinces filled, no link.
- only `municipalityBox` → the full flat municipality list is filled.

## Provinces included

Isla de la Juventud, Pinar del Río, Artemisa, La Habana, Mayabeque, Matanzas, Cienfuegos, Villa Clara, Sancti Spíritus, Ciego de Ávila, Camagüey, Las Tunas, Granma, Holguín, Santiago de Cuba, Guantánamo.

## Project structure

```
qt.py            CubaProvinces_BoxGroup (the public class)
base/main.py     Provinces_Municipaly repository (province → municipality data)
base/municipality_*.py   one municipality list per province
qt.example1.py   Mode A example
qt.example2.py   Mode B example
```
