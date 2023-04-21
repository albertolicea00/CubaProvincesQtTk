"""Example 1 - caller-managed combo boxes (Mode A).

You create the province and municipality combo boxes yourself, then hand both
to ``CubaProvinces_BoxGroup``. The group fills the province box and links the
municipality box so it refreshes every time the selected province changes.

Run with:  python qt.example1.py
"""

# Import only the widgets this example actually uses (no wildcard imports):
#   QApplication - owns the Qt event loop (one per program)
#   QMainWindow  - the top-level window
#   QComboBox    - the two dropdowns we fill
from PyQt5.QtWidgets import QApplication, QMainWindow, QComboBox

# The helper class under test; imported by name instead of "from qt import *".
from qt import CubaProvinces_BoxGroup

# Every Qt program needs exactly one QApplication. The list is sys.argv-style
# command-line args; an empty list is fine for a demo.
app = QApplication([])

# Top-level window that will host the two combo boxes.
root = QMainWindow()

# Mode A: we build the combo boxes ourselves and parent them to the window.
cb_provinces = QComboBox(root)
cb_municipality = QComboBox(root)

# Position each box as (x, y, width, height): provinces on top, municipalities
# 32 px below it.
cb_provinces.setGeometry(0, 0, 200, 30)
cb_municipality.setGeometry(0, 32, 200, 30)

# Hand both boxes to the group. exec() fills the province box and wires the
# municipality box to follow whichever province is selected.
a = CubaProvinces_BoxGroup(provinceBox=cb_provinces, municipalityBox=cb_municipality)
a.exec()

# Show the window, then start the event loop. exec_() blocks until the window
# is closed.
root.show()
app.exec_()
