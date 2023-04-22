#!/usr/bin/env bash
# Verify PyQt5 is installed for the active Python, which the qt.py version
# needs. Override the interpreter with:  PYTHON=/usr/bin/python3 ./testqt.sh
set -euo pipefail
PYTHON="${PYTHON:-python3}"

"$PYTHON" - <<'EOF'
import sys
try:
    from PyQt5.QtCore import PYQT_VERSION_STR, QT_VERSION_STR
except ModuleNotFoundError as exc:
    sys.exit(
        f"PyQt5 NOT available on {sys.executable}: {exc}\n"
        "Install it with: pip install -r requirements.txt"
    )
print(f"PyQt5 OK (PyQt {PYQT_VERSION_STR}, Qt {QT_VERSION_STR}) - {sys.executable}")
EOF
