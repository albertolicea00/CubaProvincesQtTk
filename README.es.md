# CubaProvincesQtTk

> 🌐 [English](README.md) · **Español**

![Python](https://img.shields.io/badge/Python-3.x-3776AB?style=flat-square&logo=python&logoColor=white)
![PyQt5](https://img.shields.io/badge/PyQt5-5.15+-41CD52?style=flat-square&logo=qt&logoColor=white)
![Tkinter](https://img.shields.io/badge/Tkinter-stdlib-FF6F00?style=flat-square)

Dos listas desplegables enlazadas para elegir una **provincia** cubana y su
**municipio**: al seleccionar una provincia en el primer cuadro, el segundo se
rellena automáticamente con los municipios de esa provincia.

Se distribuye en **dos implementaciones intercambiables** con la misma API:

| Implementación | Módulo | Toolkit | Dependencia |
|----------------|--------|---------|-------------|
| PyQt5 | [qt.py](qt.py) | `PyQt5.QtWidgets.QComboBox` | `PyQt5` |
| Tkinter | [tk.py](tk.py) | `tkinter.ttk.Combobox` | biblioteca estándar |

## Requisitos

- Python 3.x
- **Versión PyQt5:** [PyQt5](https://pypi.org/project/PyQt5/) (`>=5.15`) — `pip install -r requirements.txt`
- **Versión Tkinter:** sin instalación extra, pero tu Python debe estar
  compilado con soporte de Tk (`python -c "import tkinter"` debe funcionar).

### Comprobar el entorno

Confirma que el toolkit que quieres está disponible antes de ejecutar:

```bash
./testqt.sh   # comprueba que PyQt5 está instalado
./testtk.sh   # comprueba el soporte de Tkinter (Tk)
```

Ambos admiten un override de `PYTHON`, p. ej. `PYTHON=/usr/bin/python3 ./testtk.sh`.

## Ejemplos

El uso está documentado dentro de los scripts de [example/](example/):

| Script | Toolkit | Modo |
|--------|---------|------|
| [example/qt.example1.py](example/qt.example1.py) | PyQt5 | cuadros propios |
| [example/qt.example2.py](example/qt.example2.py) | PyQt5 | cuadros creados por el grupo |
| [example/tk.example1.py](example/tk.example1.py) | Tkinter | cuadros propios |
| [example/tk.example2.py](example/tk.example2.py) | Tkinter | cuadros creados por el grupo |

Ejecútalos **desde la raíz del proyecto** para que los imports `from qt`/`from tk`
se resuelvan:

```bash
python example/qt.example1.py
python example/qt.example2.py
python example/tk.example1.py
python example/tk.example2.py
```

## Provincias incluidas

<kbd>Isla de la Juventud</kbd> <kbd>Pinar del Río</kbd> <kbd>Artemisa</kbd> <kbd>La Habana</kbd> <kbd>Mayabeque</kbd> <kbd>Matanzas</kbd> <kbd>Cienfuegos</kbd> <kbd>Villa Clara</kbd> <kbd>Sancti Spíritus</kbd> <kbd>Ciego de Ávila</kbd> <kbd>Camagüey</kbd> <kbd>Las Tunas</kbd> <kbd>Granma</kbd> <kbd>Holguín</kbd> <kbd>Santiago de Cuba</kbd> <kbd>Guantánamo</kbd>

## Estructura del proyecto

```
qt.py            CubaProvinces_BoxGroup (implementación PyQt5)
tk.py            CubaProvinces_BoxGroup (implementación Tkinter)
base/main.py     repositorio Provinces_Municipaly (datos provincia → municipio)
base/municipality_*.py   una lista de municipios por provincia
example/         scripts de ejemplo Modo A / Modo B para ambos toolkits
testqt.sh        comprobación de disponibilidad de PyQt5
testtk.sh        comprobación de disponibilidad de Tkinter
requirements.txt fijado de la dependencia PyQt5
```

---

Creado por [@albertolicea00](https://github.com/albertolicea00)
