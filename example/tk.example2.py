"""Example 2 - group-built comboboxes (Mode B), Tkinter version.

Instead of creating the comboboxes yourself, pass a ``parent`` widget and an
``allignment``. ``CubaProvinces_BoxGroup`` then creates, positions, fills, and
links both comboboxes for you.

Run with:  python example/tk.example2.py
"""

# Standard library GUI toolkit. No ttk import here: in Mode B the group builds
# the comboboxes itself.
import tkinter

# tk.py lives in the project root, one level up from this example/ folder. Put
# that root on sys.path so "from tk import ..." resolves when this script is
# run directly (e.g. python example/tk.example2.py).
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# The helper class under test; imported by name from tk.py (not "import *").
from tk import CubaProvinces_BoxGroup

# The root window. Unlike Qt, Tkinter has no separate QApplication: Tk() both
# creates the main window and starts the toolkit.
root = tkinter.Tk()
root.title("CubaProvinces - Tkinter (Mode B)")
root.geometry("220x80")  # place() does not resize the window, so set a size

# Mode B: give the group a parent and a layout direction; it does the rest.
#   allignment="row"    -> boxes stacked (province above municipality)
#   allignment="column" -> boxes side by side
# exec() builds both boxes, fills the province box, and links them together.
a = CubaProvinces_BoxGroup(parent=root, allignment="row")
a.exec()

# Start the Tk event loop; blocks until the window is closed.
root.mainloop()
