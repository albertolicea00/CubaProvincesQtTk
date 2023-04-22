"""Example 1 - caller-managed comboboxes (Mode A), Tkinter version.

You create the province and municipality comboboxes yourself, then hand both
to ``CubaProvinces_BoxGroup``. The group fills the province box and links the
municipality box so it refreshes every time the selected province changes.

Run with:  python example/tk.example1.py
"""

# Standard library GUI toolkit. ``ttk`` provides the themed Combobox widget,
# the Tkinter equivalent of Qt's QComboBox.
import tkinter
from tkinter import ttk

# tk.py lives in the project root, one level up from this example/ folder. Put
# that root on sys.path so "from tk import ..." resolves when this script is
# run directly (e.g. python example/tk.example1.py).
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# The helper class under test; imported by name from tk.py (not "import *").
from tk import CubaProvinces_BoxGroup

# The root window. Unlike Qt, Tkinter has no separate QApplication: Tk() both
# creates the main window and starts the toolkit.
root = tkinter.Tk()
root.title("CubaProvinces - Tkinter (Mode A)")
root.geometry("220x80")  # place() does not resize the window, so set a size

# Mode A: we build the comboboxes ourselves and parent them to the window.
cb_provinces = ttk.Combobox(root)
cb_municipality = ttk.Combobox(root)

# Position each box as (x, y, width, height): provinces on top, municipalities
# 32 px below it.
cb_provinces.place(x=0, y=0, width=200, height=30)
cb_municipality.place(x=0, y=32, width=200, height=30)

# Hand both boxes to the group. exec() fills the province box and wires the
# municipality box to follow whichever province is selected.
a = CubaProvinces_BoxGroup(provinceBox=cb_provinces, municipalityBox=cb_municipality)
a.exec()

# Start the Tk event loop; blocks until the window is closed.
root.mainloop()
