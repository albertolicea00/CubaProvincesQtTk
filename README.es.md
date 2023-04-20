# CubaProvincesQt

> 🌐 [English](README.md) · **Español**

Dos cuadros combinados (combo boxes) de PyQt5 enlazados para elegir una **provincia** cubana y su **municipio**. Al seleccionar una provincia en el primer cuadro, el segundo se rellena automáticamente con los municipios de esa provincia.

Incluye las 16 provincias y sus municipios (nombres en español, con acentos).

## Requisitos

- Python 3.x
- [PyQt5](https://pypi.org/project/PyQt5/) (`>=5.15`)

## Instalación

```bash
pip install -r requirements.txt
```

## Uso

Importa `CubaProvinces_BoxGroup` desde `qt` y llama a `exec()`. Dos modos:

### Modo A — usa tus propios combo boxes

Pasa dos widgets `QComboBox` existentes. El grupo rellena el cuadro de provincias y enlaza el cuadro de municipios.

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

### Modo B — deja que el grupo cree los cuadros

Pasa un widget `parent` y una `allignment`; el grupo crea y posiciona ambos combo boxes por ti.

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

Mira [qt.example1.py](qt.example1.py) (Modo A) y [qt.example2.py](qt.example2.py) (Modo B).

## API

### `CubaProvinces_BoxGroup(provinceBox=None, municipalityBox=None, parent=None, allignment="row")`

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `provinceBox` | `QComboBox` | Cuadro existente para provincias (Modo A). |
| `municipalityBox` | `QComboBox` | Cuadro existente para municipios (Modo A). |
| `parent` | `QWidget` | Widget padre; si se define, el grupo crea ambos cuadros (Modo B). |
| `allignment` | `str` | `"row"` (apilados) o `"column"` (lado a lado). Solo se usa en Modo B. |

- `exec()` / `exec_()` — rellena el cuadro de provincias y conecta el enlace provincia→municipio.

Comportamiento según los argumentos:

- ambos cuadros definidos → provincias rellenadas, cuadro de municipios enlazado a la selección de provincia.
- solo `provinceBox` → provincias rellenadas, sin enlace.
- solo `municipalityBox` → se rellena la lista plana completa de municipios.

## Provincias incluidas

Isla de la Juventud, Pinar del Río, Artemisa, La Habana, Mayabeque, Matanzas, Cienfuegos, Villa Clara, Sancti Spíritus, Ciego de Ávila, Camagüey, Las Tunas, Granma, Holguín, Santiago de Cuba, Guantánamo.

## Estructura del proyecto

```
qt.py            CubaProvinces_BoxGroup (la clase pública)
base/main.py     repositorio Provinces_Municipaly (datos provincia → municipio)
base/municipality_*.py   una lista de municipios por provincia
qt.example1.py   ejemplo Modo A
qt.example2.py   ejemplo Modo B
```
