#!/usr/bin/env bash
# Verify the active Python has Tkinter (Tk) support, which the tk.py version
# needs. Override the interpreter with:  PYTHON=/usr/bin/python3 ./testtk.sh
set -euo pipefail
PYTHON="${PYTHON:-python3}"

"$PYTHON" - <<'EOF'
import sys
try:
    import tkinter
except ModuleNotFoundError as exc:
    sys.exit(f"Tkinter NOT available on {sys.executable}: {exc}")
print(f"Tkinter OK (Tk {tkinter.TkVersion}) - {sys.executable}")
EOF
