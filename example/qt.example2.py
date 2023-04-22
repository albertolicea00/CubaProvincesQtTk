"""Example 2 - group-built combo boxes (Mode B).

Instead of creating the combo boxes yourself, pass a ``parent`` widget and an
``allignment``. ``CubaProvinces_BoxGroup`` then creates, positions, fills, and
links both combo boxes for you.

Run with:  python example/qt.example2.py
"""

# Import only the widgets this example actually uses (no wildcard imports).
# Note there is no QComboBox here: in Mode B the group builds the boxes itself.
from PyQt5.QtWidgets import QApplication, QMainWindow

# qt.py lives in the project root, one level up from this example/ folder. Put
# that root on sys.path so "from qt import ..." resolves when this script is
# run directly (e.g. python example/qt.example2.py).
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# The helper class under test; imported by name instead of "from qt import *".
from qt import CubaProvinces_BoxGroup

# Every Qt program needs exactly one QApplication. The list is sys.argv-style
# command-line args; an empty list is fine for a demo.
app = QApplication([])

# Top-level window. We pass it to the group as the parent for the boxes it
# builds.
root = QMainWindow()

# Mode B: give the group a parent and a layout direction; it does the rest.
#   allignment="row"    -> boxes stacked (province above municipality)
#   allignment="column" -> boxes side by side
# exec() builds both boxes, fills the province box, and links them together.
a = CubaProvinces_BoxGroup(parent=root, allignment="row")
a.exec()

# Show the window, then start the event loop. exec_() blocks until the window
# is closed.
root.show()
app.exec_()
