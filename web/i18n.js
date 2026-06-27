// ----------------------------------------------------------------------------
// i18n: ES / EN language switching for the CubaProvinces XP simulator.
//   - Static DOM text via data-i18n / data-i18n-title / data-i18n-html attrs.
//   - Dynamic text (built in script.js) via the global t(key) helper.
//   - Choice persisted across sessions in localStorage ('xp-lang').
// Console "Stdout Logs" stay English on purpose (they emulate real stdout).
// ----------------------------------------------------------------------------

// key -> { en, es }. t(key) returns the active language, falling back to en, then key.
const I18N = {
  // Desktop icons
  'icon.pyqt':        { en: 'PyQt5 App',          
                        es: 'App PyQt5' },
  'icon.tkinter':     { en: 'Tkinter App',        
                        es: 'App Tkinter' },
  'icon.about':       { en: 'About Project',      
                        es: 'Acerca del proyecto' },
  'icon.sysprops':    { en: 'System Properties',  
                        es: 'Propiedades del sistema' },
  'icon.sourcecode':  { en: 'Source Code',        
                        es: 'Código fuente' },
  'icon.display':     { en: 'Display Settings',   
                        es: 'Configuración de pantalla' },

  // PyQt window
  'win.qt.title':     { en: 'Cuba Provinces - PyQt5 (qt.py)',            
                        es: 'Provincias de Cuba - PyQt5 (qt.py)' },
  'win.qt.heading':   { en: 'Cuba Provinces Selection Group (Qt Mode)',  
                        es: 'Grupo de selección de provincias de Cuba (Modo Qt)' },
  'status.tuple':     { en: 'selected property tuple:',                  
                        es: 'tupla de propiedad seleccionada:' },

  // Tkinter window
  'win.tk.title':     { en: 'Cuba Provinces - Tkinter (tk.py)',          
                        es: 'Provincias de Cuba - Tkinter (tk.py)' },
  'menu.file':         { en: 'File',     
                        es: 'Archivo' },
  'menu.options':     { en: 'Options',  
                        es: 'Opciones' },
  'menu.help':        { en: 'Help',     
                        es: 'Ayuda' },
  'win.tk.heading':   { en: 'Cuba Provinces Selection Group (Tk Mode)',  
                        es: 'Grupo de selección de provincias de Cuba (Modo Tk)' },

  // System Properties (inspector)
  'win.inspector.title':    { en: 'System Properties - CubaProvinces',      
                              es: 'Propiedades del sistema - CubaProvinces' },
  'tab.config':              { en: 'Configuration',   
                              es: 'Configuración' },
  'tab.setter':             { en: 'Setter',         
                              es: 'Setter' },
  'tab.logs':               { en: 'Stdout Logs',    
                              es: 'Registros (Stdout)' },
  'group.syncopts':         { en: 'Synchronisation Options',  
                              es: 'Opciones de sincronización' },
  'label.widgetmode':       { en: 'Widget Sync Mode:',        
                              es: 'Modo de sincronización del widget:' },
  'mode.both':              { en: 'Mode A: Both Boxes (Caller Managed - Linked)',  
                              es: 'Modo A: Ambos cuadros (Gestionado por el llamador - Enlazado)' },
  'mode.province_only':     { en: 'Mode B: Province Box Only (Unlinked)',          
                              es: 'Modo B: Solo cuadro de provincia (No enlazado)' },
  'mode.municipality_only': { en: 'Mode C: Municipality Box Only (Flat List)',     
                              es: 'Modo C: Solo cuadro de municipio (Lista plana)' },
  'mode.parent_row':        { en: 'Mode D: Parent Built - Row Alignment',          
                              es: 'Modo D: Construido por el padre - Alineación en fila' },
  'mode.parent_col':        { en: 'Mode E: Parent Built - Column Alignment',       
                              es: 'Modo E: Construido por el padre - Alineación en columna' },
  'text.modereconstruct':   { en: 'Changing this mode will reconstruct BOTH the PyQt5 widget and the Tkinter widget.',
                              es: 'Cambiar este modo reconstruirá AMBOS widgets: el de PyQt5 y el de Tkinter.' },
  'group.framework':        { en: 'Framework Details',  
                              es: 'Detalles del framework' },
  'framework.qt':           { en: '<strong>PyQt5 version (qt.py):</strong> Operates using the Qt signal/slot model (<span style="font-family: monospace;">currentIndexChanged.connect</span>) to sync lists.',
                              es: '<strong>Versión PyQt5 (qt.py):</strong> Funciona mediante el modelo de señales/slots de Qt (<span style="font-family: monospace;">currentIndexChanged.connect</span>) para sincronizar las listas.' },
  'framework.tk':           { en: '<strong>Tkinter version (tk.py):</strong> Operates using the Tk virtual events system (<span style="font-family: monospace;">bind("&lt;&lt;ComboboxSelected&gt;&gt;")</span>) to update values.',
                              es: '<strong>Versión Tkinter (tk.py):</strong> Funciona mediante el sistema de eventos virtuales de Tk (<span style="font-family: monospace;">bind("&lt;&lt;ComboboxSelected&gt;&gt;")</span>) para actualizar los valores.' },
  'group.setter':           { en: 'Simulate Property Assignment',  
                              es: 'Simular asignación de propiedad' },
  'label.targetmuni':       { en: 'Target Municipality:',          
                              es: 'Municipio objetivo:' },
  'btn.assign':             { en: 'Assign (.selected = value)',    
                              es: 'Asignar (.selected = valor)' },
  'text.setterexplain':     { en: 'Assigning a municipality directly will find its containing province, select it in the province dropdown, refresh the municipality lists, and then select the target item.',
                              es: 'Asignar un municipio directamente buscará la provincia que lo contiene, la seleccionará en el desplegable de provincias, actualizará las listas de municipios y luego seleccionará el elemento objetivo.' },

  // Notepad
  'win.notepad.title': { en: 'Notepad - Source Code Viewer',  
                         es: 'Bloc de notas - Visor de código fuente' },
  'code.qt':           { en: 'qt.py Code',          
                         es: 'Código qt.py' },
  'code.tk':           { en: 'tk.py Code',          
                         es: 'Código tk.py' },
  'code.exampleqt':    { en: 'Usage Example (Qt)',  
                         es: 'Ejemplo de uso (Qt)' },
  'code.exampletk':    { en: 'Usage Example (Tk)',  
                         es: 'Ejemplo de uso (Tk)' },
  'code.copy':         { en: 'Copy Code',           
                         es: 'Copiar código' },

  // Display Properties
  'win.display.title': { en: 'Display Properties',  
                         es: 'Propiedades de pantalla' },
  'tab.desktop':       { en: 'Desktop',             
                         es: 'Escritorio' },
  'group.background':  { en: 'Background',          
                         es: 'Fondo' },
  'label.selectbg':    { en: 'Select a background image or color:',  
                         es: 'Seleccione una imagen o color de fondo:' },
  'wallpaper.bliss':   { en: 'Bliss (Default)',     
                         es: 'Bliss (Predeterminado)' },
  'label.customcolor': { en: 'Custom Color:',       
                         es: 'Color personalizado:' },
  'btn.ok':            { en: 'OK',                  
                         es: 'Aceptar' },
  'btn.cancel':        { en: 'Cancel',              
                         es: 'Cancelar' },
  'btn.apply':         { en: 'Apply',               
                         es: 'Aplicar' },

  // About
  'win.about.title':  { en: 'About - CubaProvinces XP',  
                        es: 'Acerca de - CubaProvinces XP' },
  'about.loading':    { en: 'Loading README…',  
                        es: 'Cargando README…' },

  // Start menu (left)
  'start.qt.title':     { en: 'PyQt5 Province Selector',     
                          es: 'Selector de provincias PyQt5' },
  'start.qt.sub':       { en: 'Launch PyQt5 GUI simulator',  
                          es: 'Iniciar simulador GUI PyQt5' },
  'start.tk.title':     { en: 'Tkinter Province Selector',   
                          es: 'Selector de provincias Tkinter' },
  'start.tk.sub':       { en: 'Launch Tkinter GUI simulator', 
                          es: 'Iniciar simulador GUI Tkinter' },
  'start.props.title':  { en: 'System Properties',          
                          es: 'Propiedades del sistema' },
  'start.props.sub':    { en: 'Configure widget mode & view logs',  
                          es: 'Configurar modo del widget y ver registros' },
  'start.disp.title':   { en: 'Display Properties',          
                          es: 'Propiedades de pantalla' },
  'start.disp.sub':     { en: 'Change background wallpapers', 
                          es: 'Cambiar fondos de pantalla' },
  'start.note.title':   { en: 'Notepad - Source Code',       
                          es: 'Bloc de notas - Código fuente' },
  'start.note.sub':     { en: 'View and copy Python drivers', 
                          es: 'Ver y copiar los drivers de Python' },
  'start.allprograms':  { en: 'My first Programs',          
                          es: 'Mis primeros programas' },
  'prog.arff.sub':      { en: 'Attribute-Relation File Format generator',  
                          es: 'Generador de formato ARFF (Attribute-Relation File Format)' },
  'prog.cuba.sub':      { en: 'This',  
                          es: 'Este' },
  'prog.matrix.sub':    { en: 'Matrix operations class in Python',  
                          es: 'Clase de operaciones matriciales en Python' },
  'prog.twitter.sub':   { en: 'My first web .. a twitter clone',    
                          es: 'Mi primera web .. un clon de twitter' },
  'prog.bcs.sub':       { en: 'My Cuban Tesis',  
                          es: 'Mi tesis cubana' },
  'prog.helpers.sub':   { en: 'Object/dictionary helper utilities', 
                          es: 'Utilidades de ayuda para objetos/diccionarios' },
  'prog.more.sub':      { en: 'View all projects on GitHub',  
                          es: 'Ver todos los proyectos en GitHub' },

  // Start menu (right) + footer
  'start.right.repo':     { en: 'My GitHub Repo',      
                            es: 'Mi repositorio de GitHub' },
  'start.right.download': { en: 'Download data.json',  
                            es: 'Descargar data.json' },
  'start.right.about':    { en: 'About',  
                            es: 'Acerca de' },
  'start.right.theme':    { en: 'Theme',  
                            es: 'Tema' },
  'start.turnoff':        { en: 'Turn Off',  
                            es: 'Apagar' },

  // Watermark
  'wm.sub1':  { en: 'Bootleg edition — handcrafted by @albertolicea00',  
                es: 'Edición pirata — hecha a mano por @albertolicea00' },
  'wm.sub2':  { en: 'this copy of Windows is definitely not genuine',    
                es: 'esta copia de Windows definitivamente no es original' },

  // Taskbar tabs
  'task.qt':        { en: 'qt.py Selector',     
                      es: 'Selector qt.py' },
  'task.tk':        { en: 'tk.py Selector',     
                      es: 'Selector tk.py' },
  'task.inspector': { en: 'System Properties',  
                      es: 'Propiedades del sistema' },
  'task.about':     { en: 'About',              
                      es: 'Acerca de' },
  'task.display':   { en: 'Display Settings',   
                      es: 'Config. de pantalla' },
  'task.notepad':   { en: 'Notepad - Code',     
                      es: 'Bloc de notas - Código' },

  // XP error dialog
  'error.title':   { en: 'CubaProvinces XP',  
                     es: 'CubaProvinces XP' },
  'error.standby': { en: 'Stand By is not available on a bootleg copy of Windows.',
                     es: 'Suspender no está disponible en una copia pirata de Windows.' },
  'error.restart': { en: 'Restart failed: this copy of Windows is too fake to reboot.',
                     es: 'Error al reiniciar: esta copia de Windows es demasiado falsa para reiniciar.' },
  'error.mypc':         { en: 'My Computer is not your computer. Access denied.',
                          es: 'Mi PC no es tu PC. Acceso denegado.' },
  'error.recyclebin':   { en: 'The Recycle Bin is corrupted. (This copy of Windows was bootleg too.)',
                          es: 'La papelera de reciclaje está dañada. (Esta copia de Windows también era pirata.)' },
  'error.switchuser':   { en: 'User switching is disabled on this unlicensed copy of Windows.',
                          es: 'El cambio de usuario está deshabilitado en esta copia sin licencia de Windows.' },
  'error.controlpanel': { en: 'Control Panel is unavailable. Please contact your bootlegger.',
                          es: 'El Panel de control no está disponible. Contacte con su pirata de confianza.' },
  'error.doom3':        { en: 'This computer has no dedicated 3D graphics card. Please insert a GeForce3 Ti 500 or higher.',
                          es: 'Este equipo no tiene una tarjeta gráfica 3D dedicada. Por favor, inserte una GeForce3 Ti 500 o superior.' },
  'error.noporbia':     { en: 'Warning: This folder requires Parental Controls permission. Ask your parents for authorization.',
                          es: 'Advertencia: Esta carpeta requiere permisos de Control Parental. Pídele autorización a tus padres.' },

  // Internet Explorer window ("page cannot be displayed")
  'ie.go':            { en: 'Go', es: 'Ir' },
  'ie.cannotdisplay': { en: 'The page cannot be displayed',
                        es: 'No se puede mostrar la página' },
  'ie.body':          { en: 'The page you are looking for is currently unavailable. The Web site might be experiencing technical difficulties, or you may need to adjust your browser settings.',
                        es: 'La página que busca no está disponible en este momento. El sitio web podría tener dificultades técnicas, o quizá deba ajustar la configuración de su explorador.' },
  'ie.suggest':       { en: 'Please try the following:',
                        es: 'Pruebe lo siguiente:' },
  'ie.suggest1':      { en: 'Click the Refresh button, or try again later.',
                        es: 'Haga clic en el botón Actualizar o intente de nuevo más tarde.' },
  'ie.suggest2':      { en: 'Make sure this is a genuine, non-bootleg copy of Windows.',
                        es: 'Asegúrese de que esta sea una copia original (no pirata) de Windows.' },
  'ie.openbtn':       { en: 'Open the search in a new window →',
                        es: 'Abrir la búsqueda en una ventana nueva →' },
  'ie.dnserror':      { en: 'Cannot find server or DNS Error — Internet Explorer',
                        es: 'No se encuentra el servidor o error de DNS — Internet Explorer' },

  'icon.recyclebin':          { en: 'Recycle Bin',
                                es: 'Papelera de reciclaje' },
  'icon.mypc':                { en: 'My Computer',
                                es: 'Mi PC' },
  'icon.ie':                  { en: 'Internet Explorer',
                                es: 'Internet Explorer' },
  'icon.doom3':               { en: 'Doom 3',
                                es: 'Doom 3' },
  'icon.noporbia':            { en: 'My homework (xxx) 97GB',
                                es: 'tarea Mate (xxx) 97GB' },
  'start.logoff':             { en: 'Log Off',       
                                es: 'Cerrar sesión' },
  'start.right.controlpanel': { en: 'Control Panel', 
                                es: 'Panel de control' },

  // Turn off computer dialog
  'shutdown.title':   { en: 'Turn off computer',  
                        es: 'Apagar equipo' },
  'shutdown.standby': { en: 'Stand By',  
                        es: 'Suspender' },
  'shutdown.turnoff': { en: 'Turn Off',  
                        es: 'Apagar' },
  'shutdown.restart': { en: 'Restart',   
                        es: 'Reiniciar' },

  // Rotate-device notice (portrait phones)
  'rotate.title': { en: 'Rotate your device',  
                    es: 'Rota tu dispositivo' },
  'rotate.body':  { en: 'CubaProvinces XP is best viewed in landscape. Please rotate your device.',
                    es: 'CubaProvinces XP se ve mejor en horizontal. Por favor, rota tu dispositivo.' },

  // System tray
  'tray.lang.title': { en: 'Switch language (EN/ES)',  
                       es: 'Cambiar idioma (EN/ES)' },
  'tray.sound.on':   { en: 'Sounds on (click to mute)',     
                       es: 'Sonido activado (clic para silenciar)' },
  'tray.sound.off':  { en: 'Sounds muted (click to unmute)', 
                       es: 'Sonido silenciado (clic para activar)' },

  // --- Dynamic widget text (built in script.js) ---
  'combo.selectprov':        { en: '-- Select Province --',        
                               es: '-- Seleccione provincia --' },
  'combo.selectmuni':        { en: '-- Select Municipality --',    
                               es: '-- Seleccione municipio --' },
  'combo.selectprovfirst':    { en: '-- Select Province First --',  
                               es: '-- Seleccione provincia primero --' },
  'combo.provfirst':          { en: 'Select province first',        
                               es: 'Seleccione provincia primero' },
  'wlabel.qt.prov':          { en: 'Province (QComboBox)',                 
                               es: 'Provincia (QComboBox)' },
  'wlabel.qt.muni':          { en: 'Municipality (QComboBox - Linked)',    
                               es: 'Municipio (QComboBox - Enlazado)' },
  'wlabel.tk.prov':          { en: 'Province (ttk.Combobox)',              
                               es: 'Provincia (ttk.Combobox)' },
  'wlabel.tk.muni':          { en: 'Municipality (ttk.Combobox - Linked)', 
                               es: 'Municipio (ttk.Combobox - Enlazado)' },
  'wlabel.qt.prov.unlinked': { en: 'Province (QComboBox - Unlinked)',      
                               es: 'Provincia (QComboBox - No enlazado)' },
  'wlabel.tk.prov.unlinked': { en: 'Province (ttk.Combobox - Unlinked)',   
                               es: 'Provincia (ttk.Combobox - No enlazado)' },
  'wlabel.qt.muniflat':       { en: 'Municipality Flat List (QComboBox)',   
                               es: 'Lista plana de municipios (QComboBox)' },
  'wlabel.tk.muniflat':       { en: 'Municipality Flat List (ttk.Combobox)', 
                               es: 'Lista plana de municipios (ttk.Combobox)' },
  'parent.row':              { en: "Parent widget (alignment='row')",     
                               es: "Widget padre (alignment='row')" },
  'parent.col':              { en: "Parent widget (alignment='column')",  
                               es: "Widget padre (alignment='column')" },

  // Dialogs / balloons
  'confirm.turnoff':  { en: 'Turn off the computer?',  
                       es: '¿Apagar la computadora?' },
  'battery.title':   { en: 'Low Battery',  
                       es: 'Batería baja' },
  'battery.body':    { en: 'Your battery is running low. Plug in a power source soon.',
                       es: 'La batería se está agotando. Conecte una fuente de energía pronto.' },
};

// Active language: 'en' | 'es'. Default English; remembered across sessions.
let LANG = localStorage.getItem('xp-lang') === 'es' ? 'es' : 'en';

// Translate a key for the active language.
function t(key) {
  const entry = I18N[key];
  if (!entry) return key;
  return entry[LANG] || entry.en || key;
}

// Apply translations to all static DOM nodes carrying data-i18n* attributes.
function applyLanguage() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.getAttribute('data-i18n-html'));
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.getAttribute('data-i18n-title'));
  });

  document.documentElement.lang = LANG;

  const langEl = document.getElementById('tray-lang');
  if (langEl) langEl.textContent = LANG.toUpperCase();
}

// Toggle EN <-> ES, persist, then re-render static + dynamic UI.
function toggleLanguage() {
  LANG = LANG === 'en' ? 'es' : 'en';
  localStorage.setItem('xp-lang', LANG);

  applyLanguage();

  // updateSoundIcon / changeMode live in script.js; guard in case of load order.
  if (typeof updateSoundIcon === 'function') updateSoundIcon();
  if (typeof changeMode === 'function') changeMode(); // rebuilds the dynamic widgets

  if (typeof playSound === 'function') playSound('click', 0.4);
}

// Translate static nodes as soon as the DOM is ready (before script.js builds widgets).
window.addEventListener('DOMContentLoaded', applyLanguage);
