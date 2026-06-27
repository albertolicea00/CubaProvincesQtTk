// Cuba Provinces & Municipalities Database (loaded dynamically from data.json)
let dataRepo = {};
let flatMunicipalities = [];
let provincesList = [];

// Global State
let activeMode = 'both';
let currentCodeTab = 'qt';

// ----------------------------------------------------------------------------
// Sound Engine (Windows XP sound effects)
// ----------------------------------------------------------------------------
const SOUND_FILES = {
  click:         'assets/sounds/click.mp3',
  open:          'assets/sounds/open.mp3',
  minimize:      'assets/sounds/minimize.mp3',
  shutdown:      'assets/sounds/shutdown.mp3',
  startup:       'assets/sounds/startup.mp3',
  batterylow:    'assets/sounds/batterylow.mp3',
  error:         'assets/sounds/error.mp3',
  ding:          'assets/sounds/ding.mp3',
};

// Preload one Audio per sound; cloned on play so rapid repeats overlap cleanly.
const soundCache = {};
for (const [name, src] of Object.entries(SOUND_FILES)) {
  const a = new Audio(src);
  a.preload = 'auto';
  soundCache[name] = a;
}

// Sound on by default; remembered across sessions via localStorage.
let soundEnabled = localStorage.getItem('xp-sound') !== 'off';

function playSound(name, volume = 0.6) {
  if (!soundEnabled) return;
  const base = soundCache[name];
  if (!base) return;
  // Clone so overlapping / rapid triggers don't cut each other off.
  const a = base.cloneNode();
  a.volume = volume;
  a.play().catch(() => {}); // ignore autoplay-block rejections
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  localStorage.setItem('xp-sound', soundEnabled ? 'on' : 'off');
  updateSoundIcon();
  if (soundEnabled) playSound('click', 0.5);
}

function updateSoundIcon() {
  const el = document.getElementById('tray-sound');
  if (el) {
    el.textContent = soundEnabled ? '🔊' : '🔇';
    el.title = soundEnabled ? t('tray.sound.on') : t('tray.sound.off');
  }
}

// Transient XP-style notification balloon near the system tray.
let balloonTimer = null;
function showBalloon(title, body, icon = 'ℹ️') {
  let balloon = document.getElementById('xp-balloon');
  if (!balloon) {
    balloon = document.createElement('div');
    balloon.id = 'xp-balloon';
    balloon.className = 'xp-balloon';
    balloon.addEventListener('click', hideBalloon);
    document.body.appendChild(balloon);
  }
  balloon.innerHTML =
    `<span class="balloon-close" title="Close">✕</span>` +
    `<div class="balloon-title">${icon} ${title}</div>` +
    `<div class="balloon-body">${body}</div>`;
  balloon.classList.add('show');
  clearTimeout(balloonTimer);
  balloonTimer = setTimeout(hideBalloon, 6000);
}
function hideBalloon() {
  const b = document.getElementById('xp-balloon');
  if (b) b.classList.remove('show');
}

// "Rotate your device" notice: show once on portrait phones, then never again.
function maybeShowRotateNotice() {
  if (localStorage.getItem('xp-rotate-seen') === '1') return;
  const portrait = window.matchMedia('(max-width: 860px) and (orientation: portrait)').matches;
  const el = document.getElementById('rotate-notice');
  if (portrait && el) el.classList.add('show');
}

function dismissRotateNotice() {
  const el = document.getElementById('rotate-notice');
  if (el) el.classList.remove('show');
  localStorage.setItem('xp-rotate-seen', '1'); // remember: don't show again
}

function showLowBattery() {
  playSound('batterylow', 0.5);
  showBalloon(t('battery.title'), t('battery.body'), '🔋');
  logToConsole('Power warning: battery level low.', 'warn');
}

// Cache for source codes (loaded dynamically or falling back to hardcoded strings)
const codeCache = {
  qt: `"""Public widget helper: two linked province/municipality combo boxes.
Uses PyQt5 signals to link checkboxes dynamically.
"""
from PyQt5.QtWidgets import QComboBox
from base.main import *

class CubaProvinces_BoxGroup():
    def __init__(self, provinceBox=None, municipalityBox=None, parent=None, allignment="row"):
        self.__repository = Provinces_Municipaly()
        self.__municipalityByIndex = [
            self.__repository.IsladelaJuventud,
            self.__repository.PinardelRio,
            # ... all 16 provinces ...
        ]
        self.__provinceBox = provinceBox
        self.__municipalityBox = municipalityBox
        self.allignment = allignment.lower()
        self.parent = parent
        self.__validateParent(parent)

    def exec_(self):
        if self.__provinceBox is not None and self.__municipalityBox is not None:
            self.__provinceBox.addItems(self.__repository.provinces)
            self.__provinceBox.currentIndexChanged.connect(self.__linkTogether)
        # ... logic for separate combobox modes ...

    def __buildComboBox(self, parent):
        self.__provinceBox = QComboBox(parent)
        self.__municipalityBox = QComboBox(parent)
        if self.allignment == "row":
            self.__provinceBox.setGeometry(0, 0, 200, 30)
            self.__municipalityBox.setGeometry(0, 32, 200, 30)
        elif self.allignment == "column":
            self.__provinceBox.setGeometry(0, 0, 200, 30)
            self.__municipalityBox.setGeometry(202, 0, 200, 30)

    @property
    def selected(self):
        province = self.__provinceBox.currentText() if self.__provinceBox is not None else None
        municipality = self.__municipalityBox.currentText() if self.__municipalityBox is not None else None
        return (province or None, municipality or None)

    @selected.setter
    def selected(self, municipality):
        if self.__municipalityBox is None:
            raise RuntimeError("selected setter requires a municipality box")
        index = self.__provinceIndexForMunicipality(municipality)
        if index is None:
            raise ValueError(f"unknown municipality: {municipality!r}")
        if self.__provinceBox is not None:
            self.__provinceBox.setCurrentIndex(index)
            self.__linkTogether(index)
        else:
            self.__municipalityBox.clear()
            self.__municipalityBox.addItems(self.__municipalityByIndex[index])
        self.__municipalityBox.setCurrentText(municipality)`,

  tk: `"""Public widget helper: two linked province/municipality comboboxes (Tkinter).
Uses virtual events (<<ComboboxSelected>>) to keep widgets in sync.
"""
from tkinter import ttk
from base.main import *

class CubaProvinces_BoxGroup():
    def __init__(self, provinceBox=None, municipalityBox=None, parent=None, allignment="row"):
        self.__repository = Provinces_Municipaly()
        self.__provinceBox = provinceBox
        self.__municipalityBox = municipalityBox
        self.allignment = allignment.lower()
        self.parent = parent
        self.__validateParent(parent)

    def exec_(self):
        if self.__provinceBox is not None and self.__municipalityBox is not None:
            self.__provinceBox["values"] = self.__repository.provinces
            self.__provinceBox.bind("<<ComboboxSelected>>", self.__linkTogether)
        # ... logic for separate combobox modes ...

    def __buildComboBox(self, parent):
        self.__provinceBox = ttk.Combobox(parent)
        self.__municipalityBox = ttk.Combobox(parent)
        if self.allignment == "row":
            self.__provinceBox.place(x=0, y=0, width=200, height=30)
            self.__municipalityBox.place(x=0, y=32, width=200, height=30)
        elif self.allignment == "column":
            self.__provinceBox.place(x=0, y=0, width=200, height=30)
            self.__municipalityBox.place(x=202, y=0, width=200, height=30)

    @property
    def selected(self):
        province = self.__provinceBox.get() if self.__provinceBox is not None else None
        municipality = self.__municipalityBox.get() if self.__municipalityBox is not None else None
        return (province or None, municipality or None)

    @selected.setter
    def selected(self, municipality):
        if self.__municipalityBox is None:
            raise RuntimeError("selected setter requires a municipality box")
        index = self.__provinceIndexForMunicipality(municipality)
        if index is None:
            raise ValueError(f"unknown municipality: {municipality!r}")
        if self.__provinceBox is not None:
            self.__provinceBox.current(index)
            self.__linkTogether()
        else:
            self.__municipalityBox["values"] = self.__municipalityByIndex[index]
        self.__municipalityBox.set(municipality)`,

  exampleQt1: `# PyQt5 execution example (Mode A: Caller Managed Combo Boxes)
from PyQt5.QtWidgets import QApplication, QMainWindow, QComboBox
from qt import CubaProvinces_BoxGroup

app = QApplication([])
root = QMainWindow()

cb_provinces = QComboBox(root)
cb_municipality = QComboBox(root)

cb_provinces.setGeometry(0, 0, 200, 30)
cb_municipality.setGeometry(0, 32, 200, 30)

group = CubaProvinces_BoxGroup(provinceBox=cb_provinces, municipalityBox=cb_municipality)
group.exec()

print(group.selected)

root.show()
app.exec_()`,

  exampleQt2: `# PyQt5 execution example (Mode D: Parent Managed Combo Boxes)
from PyQt5.QtWidgets import QApplication, QWidget
from qt import CubaProvinces_BoxGroup

app = QApplication([])
parent_widget = QWidget()
parent_widget.resize(450, 150)

group = CubaProvinces_BoxGroup(parent=parent_widget, allignment="row")
group.exec()

parent_widget.show()
app.exec_()`,

  exampleTk1: `# Tkinter execution example (Mode A: Caller Managed Combo Boxes)
import tkinter as tk
from tkinter import ttk
from tk import CubaProvinces_BoxGroup

root = tk.Tk()
root.geometry("300x200")

cb_provinces = ttk.Combobox(root)
cb_municipality = ttk.Combobox(root)

cb_provinces.place(x=10, y=10, width=200, height=24)
cb_municipality.place(x=10, y=42, width=200, height=24)

group = CubaProvinces_BoxGroup(provinceBox=cb_provinces, municipalityBox=cb_municipality)
group.exec()

root.mainloop()`,

  exampleTk2: `# Tkinter execution example (Mode D: Parent Built - Row Alignment)
import tkinter as tk
from tk import CubaProvinces_BoxGroup

root = tk.Tk()
root.geometry("450x150")

group = CubaProvinces_BoxGroup(parent=root, allignment="row")
group.exec()

root.mainloop()`
};

// PyQt app state
let qtProvince = null;
let qtMunicipality = null;

// Tkinter app state
let tkProvince = null;
let tkMunicipality = null;

// Asynchronously load database from local directory or GitHub Raw
async function initDatabase() {
  const sources = [
    'assets/data.json',
    // 'https://raw.githubusercontent.com/albertolicea00/CubaProvincesQtTk/refs/heads/main/web/assets/data.json'
  ];

  let loaded = false;
  for (const url of sources) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const json = await response.json();
        if (json && typeof json === 'object' && Object.keys(json).length > 0) {
          dataRepo = json;
          flatMunicipalities = Object.values(dataRepo).flat();
          provincesList = Object.keys(dataRepo);
          logToConsole(`Successfully loaded database from: ${url}`, 'success');
          loaded = true;
          break;
        }
      }
    } catch (err) {
      console.log(`Failed to fetch database from ${url}:`, err);
    }
  }

  if (!loaded) {
    logToConsole("Using built-in database fallback.", "info");
  }

  // Populate setter dropdown options
  const selectSetter = document.getElementById('muni-setter-val');
  if (selectSetter) {
    selectSetter.innerHTML = '';
    flatMunicipalities.sort().forEach(m => {
      const option = document.createElement('option');
      option.value = m;
      option.textContent = m;
      selectSetter.appendChild(option);
    });
  }

  // Refresh active mode layouts with the newly loaded data
  changeMode();
}

// Asynchronously fetch sources from the workspace if running on a local server
async function initSourceCodes() {
  const filesToFetch = [
    { key: 'qt', urls: ['../qt.py', 'https://raw.githubusercontent.com/albertolicea00/CubaProvincesQtTk/main/qt.py'] },
    { key: 'tk', urls: ['../tk.py', 'https://raw.githubusercontent.com/albertolicea00/CubaProvincesQtTk/main/tk.py'] },
    { key: 'exampleQt1', urls: ['../example/qt.example1.py', 'https://raw.githubusercontent.com/albertolicea00/CubaProvincesQtTk/main/example/qt.example1.py'] },
    { key: 'exampleQt2', urls: ['../example/qt.example2.py', 'https://raw.githubusercontent.com/albertolicea00/CubaProvincesQtTk/main/example/qt.example2.py'] },
    { key: 'exampleTk1', urls: ['../example/tk.example1.py', 'https://raw.githubusercontent.com/albertolicea00/CubaProvincesQtTk/main/example/tk.example1.py'] },
    { key: 'exampleTk2', urls: ['../example/tk.example2.py', 'https://raw.githubusercontent.com/albertolicea00/CubaProvincesQtTk/main/example/tk.example2.py'] }
  ];

  for (const item of filesToFetch) {
    let loaded = false;
    for (const url of item.urls) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const text = await response.text();
          codeCache[item.key] = text;
          logToConsole(`Loaded source file dynamically: ${url}`, 'success');
          loaded = true;
          break;
        }
      } catch (err) {
        // Quietly proceed to the next fallback url
      }
    }
    if (!loaded) {
      console.log(`Using built-in fallback copy for ${item.key}`);
    }
  }
  renderCode();
}

// Init DOM
window.addEventListener('DOMContentLoaded', () => {
  updateClock();
  setInterval(updateClock, 1000);

  // Setup window dragging
  setupDraggable(document.getElementById('win-qt'), document.getElementById('win-qt-header'));
  setupDraggable(document.getElementById('win-tk'), document.getElementById('win-tk-header'));
  setupDraggable(document.getElementById('win-inspector'), document.getElementById('win-inspector-header'));
  setupDraggable(document.getElementById('win-notepad'), document.getElementById('win-notepad-header'));
  setupDraggable(document.getElementById('win-display'), document.getElementById('win-display-header'));
  setupDraggable(document.getElementById('win-about'), document.getElementById('win-about-header'));
  setupDraggable(document.getElementById('win-ie'), document.getElementById('win-ie-header'));

  // Click window focus
  document.querySelectorAll('.win-window').forEach(win => {
    win.addEventListener('mousedown', () => focusWindow(win.id));
  });

  // Global click closes dropdown lists and Start Menu
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.xp-combobox') && !e.target.closest('.tk-combobox-wrapper')) {
      document.querySelectorAll('.xp-dropdown-list, .tk-dropdown-popup').forEach(list => list.style.display = 'none');
    }

    // Close Start Menu if clicked outside
    const startMenu = document.getElementById('start-menu');
    if (startMenu && startMenu.style.display === 'flex') {
      if (!e.target.closest('#start-menu') && !e.target.closest('.start-button')) {
        startMenu.style.display = 'none';
      }
    }
  });

  logToConsole("Initializing both PyQt5 (qt.py) and Tkinter (tk.py) widget drivers.", "info");

  initDatabase(); // Fetch latest database and update UI
  initSourceCodes(); // Asynchronously load dynamic examples from directories
  initAbout(); // Fetch and render web/README.md in the About window

  maybeShowRotateNotice(); // one-time landscape hint on portrait phones

  // --- Sound wiring ---
  updateSoundIcon();

  // Play the XP startup chime once the desktop is ready.
  // NOTE: browsers may suppress this until the first user gesture due to their
  // autoplay policy — that's a browser constraint, not a bug.
  playSound('startup', 0.5);

  // Generic UI click sound for controls that don't already make their own.
  document.addEventListener('click', (e) => {
    if (e.target.closest('.xp-btn-control, .win-menu-item, .dialog-tab, .start-button, .start-all-programs')) {
      playSound('click', 0.4);
    }
  });

  // Occasional low-battery nag (it's a "laptop", after all).
  setInterval(() => {
    if (Math.random() < 0.35) showLowBattery();
  }, 30000);
});

// Time & Clock
function updateClock() {
  const now = new Date();
  
  let hours = now.getHours();
  let minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;

  const day = now.getDate();
  const month = now.getMonth() + 1; // 0-index
  const year = now.getFullYear();

  const dateStr = `${day}/${month}/${year}`;
  const timeStr = `${hours}:${minutes} ${ampm}`;
  
  document.getElementById('tray-clock').textContent = `${timeStr} · ${dateStr}`;
  // document.getElementById('tray-clock').innerHTML =`${hours}:${minutes} ${ampm}<br><span style="font-size:10px;">${dateStr}</span>`;
}

// Draggable (mouse + touch)
function setupDraggable(windowEl, headerEl) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  headerEl.addEventListener('mousedown', dragStart);
  headerEl.addEventListener('touchstart', dragStart, { passive: false });

  // Pull pointer coords from either a mouse event or the first touch.
  function point(e) {
    if (e.touches && e.touches.length) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  }

  function dragStart(e) {
    if (e.target.closest('.xp-btn') || e.target.closest('.win-menu-bar')) return;
    e.preventDefault();
    const p = point(e);
    pos3 = p.x;
    pos4 = p.y;
    document.addEventListener('mousemove', elementDrag);
    document.addEventListener('mouseup', closeDragElement);
    document.addEventListener('touchmove', elementDrag, { passive: false });
    document.addEventListener('touchend', closeDragElement);
    document.addEventListener('touchcancel', closeDragElement);
    focusWindow(windowEl.id);
  }

  function elementDrag(e) {
    e.preventDefault(); // also stops the page from scrolling while dragging on touch
    const p = point(e);
    pos1 = pos3 - p.x;
    pos2 = pos4 - p.y;
    pos3 = p.x;
    pos4 = p.y;

    let newTop = windowEl.offsetTop - pos2;
    let newLeft = windowEl.offsetLeft - pos1;

    if (newTop < 0) newTop = 0;
    windowEl.style.top = newTop + "px";
    windowEl.style.left = newLeft + "px";
  }

  function closeDragElement() {
    document.removeEventListener('mousemove', elementDrag);
    document.removeEventListener('mouseup', closeDragElement);
    document.removeEventListener('touchmove', elementDrag);
    document.removeEventListener('touchend', closeDragElement);
    document.removeEventListener('touchcancel', closeDragElement);
  }
}

// Focus Window
function focusWindow(winId) {
  document.querySelectorAll('.win-window').forEach(w => {
    w.style.zIndex = 5;
    w.classList.add('inactive-focus');
  });
  const win = document.getElementById(winId);
  if (win) {
    win.style.zIndex = 100;
    win.classList.remove('inactive-focus');
  }
}

// Toggle Minimize
function toggleWindow(winId) {
  const win = document.getElementById(winId);
  const btn = document.getElementById(`taskbar-${winId}`);
  if (win.classList.contains('minimized')) {
    win.classList.remove('minimized');
    btn.classList.add('active');
    focusWindow(winId);
    playSound('open', 0.5);
  } else {
    const isInactive = win.classList.contains('inactive-focus');
    if (!isInactive) {
      win.classList.add('minimized');
      btn.classList.remove('active');
      playSound('minimize', 0.5);
    } else {
      focusWindow(winId);
    }
  }
}

function minimizeWindow(winId) {
  document.getElementById(winId).classList.add('minimized');
  document.getElementById(`taskbar-${winId}`).classList.remove('active');
  playSound('minimize', 0.5);
}

function closeWindow(winId) {
  minimizeWindow(winId);
}

function toggleMaximize(winId) {
  document.getElementById(winId).classList.toggle('maximized');
  playSound('open', 0.4);
  logToConsole(`Window resize signal processed for widget pane: ${winId}`, 'info');
}

// Dropdown list popups
function toggleDropdown(event, dropdownId) {
  event.stopPropagation();
  const dropEl = document.getElementById(dropdownId);
  const isVisible = dropEl.style.display === 'block';
  
  document.querySelectorAll('.xp-dropdown-list, .tk-dropdown-popup').forEach(list => list.style.display = 'none');
  
  if (!isVisible) {
    dropEl.style.display = 'block';
  }
}

// PyQt5 Dropdown populator
function populateQtProvinces() {
  const provList = document.getElementById('qt-prov-list');
  if (!provList) return;
  provList.innerHTML = '';

  provincesList.forEach(p => {
    const item = document.createElement('div');
    item.className = 'xp-dropdown-item';
    item.textContent = p;
    item.onclick = (e) => {
      e.stopPropagation();
      selectQtProvince(p);
      provList.style.display = 'none';
    };
    provList.appendChild(item);
  });
}

function selectQtProvince(provName) {
  qtProvince = provName;
  document.getElementById('qt-provinces-text').textContent = provName;
  logToConsole(`PyQt5: currentIndexChanged fired. Selected Province: ${provName}`, 'info');

  document.querySelectorAll('#qt-prov-list .xp-dropdown-item').forEach(item => {
    item.classList.toggle('selected', item.textContent === provName);
  });

  if (activeMode === 'both' || activeMode.startsWith('parent')) {
    qtMunicipality = null;
    document.getElementById('qt-municipalities-text').textContent = t('combo.selectmuni');
    populateQtMunicipalities(dataRepo[provName]);
    updateSelectionDisplayQt();
  } else {
    updateSelectionDisplayQt();
  }
}

function populateQtMunicipalities(muniArray) {
  const muniList = document.getElementById('qt-muni-list');
  muniList.innerHTML = '';

  if (!muniArray || muniArray.length === 0) {
    muniList.innerHTML = `<div class="xp-dropdown-item disabled" style="color:#808080;">${t('combo.provfirst')}</div>`;
    return;
  }

  muniArray.forEach(m => {
    const item = document.createElement('div');
    item.className = 'xp-dropdown-item';
    item.textContent = m;
    item.onclick = (e) => {
      e.stopPropagation();
      selectQtMunicipality(m);
      muniList.style.display = 'none';
    };
    muniList.appendChild(item);
  });
}

function selectQtMunicipality(muniName) {
  qtMunicipality = muniName;
  document.getElementById('qt-municipalities-text').textContent = muniName;
  logToConsole(`PyQt5: Selected Municipality changed to: ${muniName}`, 'info');

  document.querySelectorAll('#qt-muni-list .xp-dropdown-item').forEach(item => {
    item.classList.toggle('selected', item.textContent === muniName);
  });

  updateSelectionDisplayQt();
}

function updateSelectionDisplayQt() {
  const disp = document.getElementById('selection-display-qt');
  const provStr = qtProvince ? `'${qtProvince}'` : 'None';
  const muniStr = qtMunicipality ? `'${qtMunicipality}'` : 'None';
  disp.textContent = `(${provStr}, ${muniStr})`;
  logToConsole(`qt.py selected -> (${provStr}, ${muniStr})`, 'cmd');
}

// Tkinter Dropdown populator
function populateTkProvinces() {
  const provList = document.getElementById('tk-prov-list');
  if (!provList) return;
  provList.innerHTML = '';

  provincesList.forEach(p => {
    const item = document.createElement('div');
    item.className = 'tk-item';
    item.textContent = p;
    item.onclick = (e) => {
      e.stopPropagation();
      selectTkProvince(p);
      provList.style.display = 'none';
    };
    provList.appendChild(item);
  });
}

function selectTkProvince(provName) {
  tkProvince = provName;
  document.getElementById('tk-provinces-text').textContent = provName;
  logToConsole(`Tkinter: <<ComboboxSelected>> event triggered for Province box. Selection: ${provName}`, 'info');

  document.querySelectorAll('#tk-prov-list .tk-item').forEach(item => {
    item.classList.toggle('selected', item.textContent === provName);
  });

  if (activeMode === 'both' || activeMode.startsWith('parent')) {
    tkMunicipality = null;
    document.getElementById('tk-municipalities-text').textContent = '';
    populateTkMunicipalities(dataRepo[provName]);
    updateSelectionDisplayTk();
  } else {
    updateSelectionDisplayTk();
  }
}

function populateTkMunicipalities(muniArray) {
  const muniList = document.getElementById('tk-muni-list');
  muniList.innerHTML = '';

  if (!muniArray || muniArray.length === 0) {
    muniList.innerHTML = `<div class="tk-item" style="color:#808080;">${t('combo.provfirst')}</div>`;
    return;
  }

  muniArray.forEach(m => {
    const item = document.createElement('div');
    item.className = 'tk-item';
    item.textContent = m;
    item.onclick = (e) => {
      e.stopPropagation();
      selectTkMunicipality(m);
      muniList.style.display = 'none';
    };
    muniList.appendChild(item);
  });
}

function selectTkMunicipality(muniName) {
  tkMunicipality = muniName;
  document.getElementById('tk-municipalities-text').textContent = muniName;
  logToConsole(`Tkinter: <<ComboboxSelected>> event triggered for Municipality box. Selection: ${muniName}`, 'info');

  document.querySelectorAll('#tk-muni-list .tk-item').forEach(item => {
    item.classList.toggle('selected', item.textContent === muniName);
  });

  updateSelectionDisplayTk();
}

function updateSelectionDisplayTk() {
  const disp = document.getElementById('selection-display-tk');
  const provStr = tkProvince ? `'${tkProvince}'` : 'None';
  const muniStr = tkMunicipality ? `'${tkMunicipality}'` : 'None';
  disp.textContent = `(${provStr}, ${muniStr})`;
  logToConsole(`tk.py selected -> (${provStr}, ${muniStr})`, 'cmd');
}

// Logs Console writer
function logToConsole(message, type = 'info') {
  const logs = document.getElementById('terminal-logs');
  if (!logs) return;
  const line = document.createElement('div');
  line.className = `log-line log-${type}`;

  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
  
  let prefix = `[${timeStr}] `;
  if (type === 'cmd') prefix += '>>> ';

  line.textContent = prefix + message;
  logs.appendChild(line);
  logs.scrollTop = logs.scrollHeight;

  // Audible cue for genuine error log lines.
  if (type === 'error') playSound('error', 0.4);
}

// Switch dialog property tabs
function switchDialogTab(tabId) {
  document.querySelectorAll('.dialog-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(`tab-${tabId}`).classList.add('active');

  document.getElementById('panel-props').style.display = tabId === 'props' ? 'flex' : 'none';
  document.getElementById('panel-setter').style.display = tabId === 'setter' ? 'block' : 'none';
  document.getElementById('panel-logs').style.display = tabId === 'logs' ? 'block' : 'none';
}

// Switch mode inside inspector
function changeMode() {
  const mode = document.getElementById('widget-mode').value;
  activeMode = mode;
  logToConsole(`Layout synchronisation mode updated to: ${mode}`, 'info');

  const qtRoot = document.getElementById('pyqt-layout-root');
  const tkRoot = document.getElementById('tk-layout-root');

  qtRoot.innerHTML = '';
  tkRoot.innerHTML = '';

  qtProvince = null;
  qtMunicipality = null;
  tkProvince = null;
  tkMunicipality = null;

  // Populate layout containers
  if (mode === 'both') {
    // Mode A
    qtRoot.innerHTML = `
      <div id="qt-widget-box" class="pyqt-alignment-row">
        <div class="pyqt-form-group">
          <div class="pyqt-label">${t('wlabel.qt.prov')}</div>
          <div class="xp-combobox" onclick="toggleDropdown(event, 'qt-prov-list')">
            <span id="qt-provinces-text">${t('combo.selectprov')}</span>
            <div class="xp-combobox-arrow"></div>
            <div class="xp-dropdown-list" id="qt-prov-list"></div>
          </div>
        </div>
        <div class="pyqt-form-group">
          <div class="pyqt-label">${t('wlabel.qt.muni')}</div>
          <div class="xp-combobox" onclick="toggleDropdown(event, 'qt-muni-list')">
            <span id="qt-municipalities-text">${t('combo.selectprovfirst')}</span>
            <div class="xp-combobox-arrow"></div>
            <div class="xp-dropdown-list" id="qt-muni-list">
              <div class="xp-dropdown-item disabled" style="color:#808080;">${t('combo.provfirst')}</div>
            </div>
          </div>
        </div>
      </div>
    `;
    tkRoot.innerHTML = `
      <div id="tk-widget-box" class="pyqt-alignment-row">
        <div class="pyqt-form-group">
          <div class="tk-label">${t('wlabel.tk.prov')}</div>
          <div class="tk-combobox-wrapper">
            <div class="tk-combobox" onclick="toggleDropdown(event, 'tk-prov-list')">
              <span id="tk-provinces-text"></span>
              <div class="tk-combobox-btn"></div>
            </div>
            <div class="tk-dropdown-popup" id="tk-prov-list"></div>
          </div>
        </div>
        <div class="pyqt-form-group">
          <div class="tk-label">${t('wlabel.tk.muni')}</div>
          <div class="tk-combobox-wrapper">
            <div class="tk-combobox" onclick="toggleDropdown(event, 'tk-muni-list')">
              <span id="tk-municipalities-text"></span>
              <div class="tk-combobox-btn"></div>
            </div>
            <div class="tk-dropdown-popup" id="tk-muni-list">
              <div class="tk-item" style="color:#808080;">${t('combo.provfirst')}</div>
            </div>
          </div>
        </div>
      </div>
    `;
    populateQtProvinces();
    populateTkProvinces();
  } 
  else if (mode === 'province_only') {
    // Mode B
    qtRoot.innerHTML = `
      <div id="qt-widget-box" class="pyqt-alignment-row">
        <div class="pyqt-form-group">
          <div class="pyqt-label">${t('wlabel.qt.prov.unlinked')}</div>
          <div class="xp-combobox" onclick="toggleDropdown(event, 'qt-prov-list')">
            <span id="qt-provinces-text">${t('combo.selectprov')}</span>
            <div class="xp-combobox-arrow"></div>
            <div class="xp-dropdown-list" id="qt-prov-list"></div>
          </div>
        </div>
      </div>
    `;
    tkRoot.innerHTML = `
      <div id="tk-widget-box" class="pyqt-alignment-row">
        <div class="pyqt-form-group">
          <div class="tk-label">${t('wlabel.tk.prov.unlinked')}</div>
          <div class="tk-combobox-wrapper">
            <div class="tk-combobox" onclick="toggleDropdown(event, 'tk-prov-list')">
              <span id="tk-provinces-text"></span>
              <div class="tk-combobox-btn"></div>
            </div>
            <div class="tk-dropdown-popup" id="tk-prov-list"></div>
          </div>
        </div>
      </div>
    `;
    populateQtProvinces();
    populateTkProvinces();
  } 
  else if (mode === 'municipality_only') {
    // Mode C
    qtRoot.innerHTML = `
      <div id="qt-widget-box" class="pyqt-alignment-row">
        <div class="pyqt-form-group">
          <div class="pyqt-label">${t('wlabel.qt.muniflat')}</div>
          <div class="xp-combobox" onclick="toggleDropdown(event, 'qt-muni-list')">
            <span id="qt-municipalities-text">${t('combo.selectmuni')}</span>
            <div class="xp-combobox-arrow"></div>
            <div class="xp-dropdown-list" id="qt-muni-list"></div>
          </div>
        </div>
      </div>
    `;
    tkRoot.innerHTML = `
      <div id="tk-widget-box" class="pyqt-alignment-row">
        <div class="pyqt-form-group">
          <div class="tk-label">${t('wlabel.tk.muniflat')}</div>
          <div class="tk-combobox-wrapper">
            <div class="tk-combobox" onclick="toggleDropdown(event, 'tk-muni-list')">
              <span id="tk-municipalities-text"></span>
              <div class="tk-combobox-btn"></div>
            </div>
            <div class="tk-dropdown-popup" id="tk-muni-list"></div>
          </div>
        </div>
      </div>
    `;
    
    // Fill all flat municipalities
    const qtMuniList = document.getElementById('qt-muni-list');
    const tkMuniList = document.getElementById('tk-muni-list');
    qtMuniList.innerHTML = '';
    tkMuniList.innerHTML = '';

    flatMunicipalities.forEach(m => {
      const qtItem = document.createElement('div');
      qtItem.className = 'xp-dropdown-item';
      qtItem.textContent = m;
      qtItem.onclick = (e) => {
        e.stopPropagation();
        selectQtMunicipality(m);
        qtMuniList.style.display = 'none';
      };
      qtMuniList.appendChild(qtItem);

      const tkItem = document.createElement('div');
      tkItem.className = 'tk-item';
      tkItem.textContent = m;
      tkItem.onclick = (e) => {
        e.stopPropagation();
        selectTkMunicipality(m);
        tkMuniList.style.display = 'none';
      };
      tkMuniList.appendChild(tkItem);
    });
  } 
  else if (mode === 'parent_row') {
    // Mode D
    qtRoot.innerHTML = `
      <div style="border: 1px dashed var(--xp-blue-dark); padding: 10px; height: 90px; position: relative;">
        <div style="position: absolute; top:-6px; left: 6px; background-color: #f0f0f0; font-size: 8px; padding: 0 2px;">${t('parent.row')}</div>
        
        <div class="xp-combobox" style="position: absolute; top: 12px; left: 12px; width: 180px;" onclick="toggleDropdown(event, 'qt-prov-list')">
          <span id="qt-provinces-text">${t('combo.selectprov')}</span>
          <div class="xp-combobox-arrow"></div>
          <div class="xp-dropdown-list" id="qt-prov-list"></div>
        </div>
        
        <div class="xp-combobox" style="position: absolute; top: 44px; left: 12px; width: 180px;" onclick="toggleDropdown(event, 'qt-muni-list')">
          <span id="qt-municipalities-text">${t('combo.selectprovfirst')}</span>
          <div class="xp-combobox-arrow"></div>
          <div class="xp-dropdown-list" id="qt-muni-list">
            <div class="xp-dropdown-item disabled" style="color:#808080;">${t('combo.provfirst')}</div>
          </div>
        </div>
      </div>
    `;
    tkRoot.innerHTML = `
      <div style="border: 1.5px dashed var(--xp-blue-dark); padding: 10px; height: 90px; position: relative;">
        <div style="position: absolute; top:-6px; left: 6px; background-color: var(--xp-bg-gray); font-size: 8px; padding: 0 2px;">${t('parent.row')}</div>
        
        <div class="tk-combobox-wrapper" style="position: absolute; top: 12px; left: 12px; width: 180px;">
          <div class="tk-combobox" onclick="toggleDropdown(event, 'tk-prov-list')">
            <span id="tk-provinces-text"></span>
            <div class="tk-combobox-btn"></div>
          </div>
          <div class="tk-dropdown-popup" id="tk-prov-list"></div>
        </div>
        
        <div class="tk-combobox-wrapper" style="position: absolute; top: 44px; left: 12px; width: 180px;">
          <div class="tk-combobox" onclick="toggleDropdown(event, 'tk-muni-list')">
            <span id="tk-municipalities-text"></span>
            <div class="tk-combobox-btn"></div>
          </div>
          <div class="tk-dropdown-popup" id="tk-muni-list">
            <div class="tk-item" style="color:#808080;">${t('combo.provfirst')}</div>
          </div>
        </div>
      </div>
    `;
    populateQtProvinces();
    populateTkProvinces();
  } 
  else if (mode === 'parent_col') {
    // Mode E
    qtRoot.innerHTML = `
      <div style="border: 1px dashed var(--xp-blue-dark); padding: 10px; height: 50px; position: relative;">
        <div style="position: absolute; top:-6px; left: 6px; background-color: #f0f0f0; font-size: 8px; padding: 0 2px;">${t('parent.col')}</div>
        
        <div class="xp-combobox" style="position: absolute; top: 12px; left: 12px; width: 160px;" onclick="toggleDropdown(event, 'qt-prov-list')">
          <span id="qt-provinces-text">${t('combo.selectprov')}</span>
          <div class="xp-combobox-arrow"></div>
          <div class="xp-dropdown-list" id="qt-prov-list"></div>
        </div>
        
        <div class="xp-combobox" style="position: absolute; top: 12px; left: 184px; width: 160px;" onclick="toggleDropdown(event, 'qt-muni-list')">
          <span id="qt-municipalities-text">${t('combo.selectprovfirst')}</span>
          <div class="xp-combobox-arrow"></div>
          <div class="xp-dropdown-list" id="qt-muni-list">
            <div class="xp-dropdown-item disabled" style="color:#808080;">${t('combo.provfirst')}</div>
          </div>
        </div>
      </div>
    `;
    tkRoot.innerHTML = `
      <div style="border: 1.5px dashed var(--xp-blue-dark); padding: 10px; height: 50px; position: relative;">
        <div style="position: absolute; top:-6px; left: 6px; background-color: var(--xp-bg-gray); font-size: 8px; padding: 0 2px;">${t('parent.col')}</div>
        
        <div class="tk-combobox-wrapper" style="position: absolute; top: 12px; left: 12px; width: 160px;">
          <div class="tk-combobox" onclick="toggleDropdown(event, 'tk-prov-list')">
            <span id="tk-provinces-text"></span>
            <div class="tk-combobox-btn"></div>
          </div>
          <div class="tk-dropdown-popup" id="tk-prov-list"></div>
        </div>
        
        <div class="tk-combobox-wrapper" style="position: absolute; top: 12px; left: 184px; width: 160px;">
          <div class="tk-combobox" onclick="toggleDropdown(event, 'tk-muni-list')">
            <span id="tk-municipalities-text"></span>
            <div class="tk-combobox-btn"></div>
          </div>
          <div class="tk-dropdown-popup" id="tk-muni-list">
            <div class="tk-item" style="color:#808080;">${t('combo.provfirst')}</div>
          </div>
        </div>
      </div>
    `;
    populateQtProvinces();
    populateTkProvinces();
  }

  updateSelectionDisplayQt();
  updateSelectionDisplayTk();
  renderCode();
}

// Property Setter
function runSetter() {
  const targetMuni = document.getElementById('muni-setter-val').value;
  logToConsole(`Executing selected.setter for: '${targetMuni}'`, 'cmd');

  if (activeMode === 'province_only') {
    logToConsole("RuntimeError: selected setter requires a municipality box", "error");
    alert("RuntimeError: selected setter requires a municipality box");
    return;
  }

  // Find province
  let matchedProvince = null;
  for (const [prov, munis] of Object.entries(dataRepo)) {
    if (munis.includes(targetMuni)) {
      matchedProvince = prov;
      break;
    }
  }

  if (!matchedProvince) {
    logToConsole(`ValueError: unknown municipality: '${targetMuni}'`, "error");
    return;
  }

  // Set PyQt5 Simulator
  if (activeMode === 'municipality_only') {
    selectQtMunicipality(targetMuni);
  } else {
    selectQtProvince(matchedProvince);
    selectQtMunicipality(targetMuni);
  }

  // Set Tkinter Simulator
  if (activeMode === 'municipality_only') {
    selectTkMunicipality(targetMuni);
  } else {
    selectTkProvince(matchedProvince);
    selectTkMunicipality(targetMuni);
  }

  playSound('ding', 0.6);
}

// Switch Notepad tab
function switchCodeTab(tabId) {
  currentCodeTab = tabId;
  renderCode();
}

// Simple syntax highlighting for Notepad view
function highlight(code) {
  let escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const regex = /(""".*?"""|'''.*?'''|#[^\r\n]*|"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|\b(?:def|class|from|import|return|if|elif|else|None|self|property|raise|try|except|as|in|for|bind)\b|\b(?:QApplication|QMainWindow|QComboBox|QWidget|CubaProvinces_BoxGroup|Provinces_Municipaly|Tk|ttk|Combobox)\b)/gs;

  return escaped.replace(regex, (match) => {
    if (match.startsWith('#') || match.startsWith('"""') || match.startsWith("'''")) {
      return `<span class="c-comment">${match}</span>`;
    }
    if (match.startsWith('"') || match.startsWith("'")) {
      return `<span class="c-string">${match}</span>`;
    }
    if (['def','class','from','import','return','if','elif','else','None','self','property','raise','try','except','as','in','for','bind'].includes(match)) {
      return `<span class="c-keyword">${match}</span>`;
    }
    return `<span class="c-class">${match}</span>`;
  });
}

function renderCode() {
  const area = document.getElementById('notepad-text');
  if (!area) return;
  let code = '';

  if (currentCodeTab === 'qt') {
    code = codeCache.qt;
  } 
  else if (currentCodeTab === 'tk') {
    code = codeCache.tk;
  } 
  else if (currentCodeTab === 'example-qt') {
    if (activeMode === 'both' || activeMode === 'province_only' || activeMode === 'municipality_only') {
      code = codeCache.exampleQt1;
    } else {
      code = codeCache.exampleQt2;
    }
  } 
  else if (currentCodeTab === 'example-tk') {
    if (activeMode === 'both' || activeMode === 'province_only' || activeMode === 'municipality_only') {
      code = codeCache.exampleTk1;
    } else {
      code = codeCache.exampleTk2;
    }
  }

  area.innerHTML = highlight(code);
}

// Copy source code
function copyCode() {
  const area = document.getElementById('notepad-text');
  navigator.clipboard.writeText(area.innerText).then(() => {
    logToConsole("Source code copied to system clipboard successfully.", "info");
  });
}

// Wallpaper & Background Color Management
function previewWallpaper() {
  const select = document.getElementById('wallpaper-select');
  const monitor = document.getElementById('monitor-preview');
  if (!select || !monitor) return;

  const val = select.value;
  if (val.startsWith('color:')) {
    const color = val.split(':')[1];
    monitor.style.backgroundImage = 'none';
    monitor.style.backgroundColor = color;
  } else {
    monitor.style.backgroundImage = `url('${val}')`;
    monitor.style.backgroundColor = '';
  }
}

function applyWallpaper() {
  const select = document.getElementById('wallpaper-select');
  const wallpaper = document.getElementById('bliss-wallpaper');
  if (!select || !wallpaper) return;

  const val = select.value;
  if (val.startsWith('color:')) {
    const color = val.split(':')[1];
    wallpaper.style.backgroundImage = 'none';
    wallpaper.style.backgroundColor = color;
    logToConsole(`Desktop background updated to solid color: ${color}`, 'success');
  } else {
    wallpaper.style.backgroundImage = `url('${val}')`;
    wallpaper.style.backgroundColor = '';
    logToConsole(`Desktop wallpaper updated to: ${val}`, 'success');
  }
}

function customColorSelected(hex) {
  const select = document.getElementById('wallpaper-select');
  if (!select) return;

  // Add or update a dynamic Custom Color option
  let customOpt = Array.from(select.options).find(opt => opt.value.startsWith('color:'));
  if (!customOpt || customOpt.text.startsWith('Solid')) {
    // If no custom color option exists or it is one of the defaults, make a new option
    customOpt = document.createElement('option');
    select.appendChild(customOpt);
  }
  customOpt.value = `color:${hex}`;
  customOpt.textContent = `Custom Color (${hex})`;
  customOpt.selected = true;

  previewWallpaper();
}

// Start Menu Controls
function toggleStartMenu(event) {
  if (event) event.stopPropagation();
  const startMenu = document.getElementById('start-menu');
  if (!startMenu) return;
  
  if (startMenu.style.display === 'none') {
    startMenu.style.display = 'flex';
  } else {
    startMenu.style.display = 'none';
  }
}

function closeStartMenu() {
  const startMenu = document.getElementById('start-menu');  
  if (startMenu) {    
    startMenu.style.display = 'none';
  }
}

// Turn Off: open the XP "Turn off computer" dialog (no native confirm()).
function turnOff() {
  closeStartMenu();
  const d = document.getElementById('shutdown-dialog');
  if (d) d.classList.add('show');
  playSound('click', 0.4);
}

function closeShutdownDialog() {
  const d = document.getElementById('shutdown-dialog');
  if (d) d.classList.remove('show');
}

// Stand By: bootleg Windows can't suspend — throw a (pretty) XP error.
function standBy() {
  showXpError(t('error.standby'));
}

// Restart: also "fails" with an XP-style error.
function restartComputer() {
  showXpError(t('error.restart'));
}

// Reusable Windows XP-style error dialog.
function showXpError(message) {
  const box = document.getElementById('xp-error');
  const msg = document.getElementById('xp-error-msg');
  if (msg) msg.textContent = message;
  if (box) box.classList.add('show');
  playSound('error', 0.5);
}

function closeXpError() {
  const box = document.getElementById('xp-error');
  if (box) box.classList.remove('show');
}

// Turn Off: play the chime, then paint the XP-style shutdown screen (joke).
function shutDown() {
  closeShutdownDialog();
  playSound('shutdown', 0.7);
  logToConsole('Shutdown requested. Goodbye.', 'warn');

  // Browsers only let window.close() shut tabs that scripts opened; try it...
  window.open('', '_self');
  window.close();

  // ...then fall back to a fake XP shutdown screen.
  document.body.style.cssText = 'margin:0;';
  document.body.innerHTML =
    '<div class="xp-shutdown-screen">' +
      '<div class="xp-shutdown-title">ACCESS GRANTED.</div>' +
      '<div class="xp-shutdown-big">I stole all your browser passwords...</div>' +
      '<div class="xp-shutdown-sub">(do not alert fbi... please)</div>' +
      '<button class="xp-shutdown-back" onclick="location.reload()">← go back</button>' +
    '</div>';
}

// Markdown to HTML parser (headings, bold, italic, code, lists, quotes, links, fenced code)
function parseMarkdown(md) {
  md = md.replace(/\r\n/g, '\n');

  // Pull fenced code blocks out first so their contents aren't reformatted.
  const blocks = [];
  md = md.replace(/```[\w-]*\n([\s\S]*?)```/g, (m, code) => {
    const esc = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n$/, '');
    blocks.push(`<pre class="md-pre"><code>${esc}</code></pre>`);
    return ` \u0000B${blocks.length - 1}\u0000 `;
  });

  // Escape the rest of the HTML.
  md = md.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const inline = (t) => t
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" style="max-width:100%;">')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(/`([^`]+)`/g, '<code class="md-code">$1</code>');

  let html = '', inList = false;
  const closeList = () => { if (inList) { html += '</ul>'; inList = false; } };

  for (const line of md.split('\n')) {
    const t = line.trim();
    if (/^\u0000B\d+\u0000$/.test(t)) { closeList(); html += t; continue; }
    let m;
    if ((m = line.match(/^(#{1,4})\s+(.*)$/))) { closeList(); const l = m[1].length; html += `<h${l} class="md-h${l}">${inline(m[2])}</h${l}>`; continue; }
    if (/^(---+|\*\*\*+)\s*$/.test(t)) { closeList(); html += '<hr class="md-hr">'; continue; }
    if ((m = line.match(/^>\s?(.*)$/))) { closeList(); html += `<blockquote class="md-quote">${inline(m[1])}</blockquote>`; continue; }
    if ((m = line.match(/^\s*[-*]\s+(.*)$/))) { if (!inList) { html += '<ul class="md-ul">'; inList = true; } html += `<li>${inline(m[1])}</li>`; continue; }
    if (t === '') { closeList(); continue; }
    closeList();
    html += `<p class="md-p">${inline(line)}</p>`;
  }
  closeList();

  return html.replace(/\u0000B(\d+)\u0000/g, (m, i) => blocks[+i]);
}

// Load web/README.md into the About window and render it as markdown.
async function initAbout() {
  const target = document.getElementById('about-content');
  if (!target) return;

  const sources = [
    './README.md',
    'README.md',
    'https://raw.githubusercontent.com/albertolicea00/CubaProvincesQtTk/main/web/README.md'
  ];

  for (const url of sources) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const text = await response.text();
        target.innerHTML = parseMarkdown(text);
        logToConsole(`Loaded About (README) from: ${url}`, 'success');
        return;
      }
    } catch (err) {
      console.log(`Failed to fetch About from ${url}:`, err);
    }
  }

  target.innerHTML = parseMarkdown(
    '# CubaProvinces \u2014 Windows XP Edition\n\n' +
    '> A whole operating system, just to show off two dropdowns.\n\n' +
    'Could not load `web/README.md` (offline?). Visit the repo on ' +
    '[GitHub](https://github.com/albertolicea00/CubaProvincesQtTk).'
  );
  logToConsole('Loaded built-in About fallback.', 'info');
}


