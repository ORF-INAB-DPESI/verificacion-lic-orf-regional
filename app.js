/* ==========================================================================
   LÓGICA PRINCIPAL — SISTEMA DIGITAL DE VERIFICACIÓN DE ORF REGIONAL (VERSIÓN FINAL)
   Incluye Modificaciones 1 y 2 completas + Sincronización con Google Drive / Sheets / Gmail
   ========================================================================== */

const STORAGE_KEY = 'FORESTAL_ORF_PROD_V4';

// Listado oficial de las 10 Regiones con su contraseña única (1 usuario regional por Región I a X)
const REGIONS_CATALOG = [
  {
    id: 'I',
    code: 'region1',
    password: 'reg1_2026_inabMET',
    name: 'Región I – Metropolitana'
  },
  {
    id: 'II',
    code: 'region2',
    password: 'reg2_2026_inabAVIX',
    name: 'Región II – Alta Verapaz e Ixcán'
  },
  {
    id: 'III',
    code: 'region3',
    password: 'reg3_NRT2026_inab',
    name: 'Región III – Nororiente'
  },
  {
    id: 'IV',
    code: 'region4',
    password: 'reg4_2026SRT_inab',
    name: 'Región IV – Suroriente'
  },
  {
    id: 'V',
    code: 'region5',
    password: 'CHSACreg5_2026_inab',
    name: 'Región V – Chimaltenango y Sacatepéquez'
  },
  {
    id: 'VI',
    code: 'region6',
    password: 'reg6SCC_2026_inab',
    name: 'Región VI – Suroccidente'
  },
  {
    id: 'VII',
    code: 'region7',
    password: 'reg7_2026_NCCinab',
    name: 'Región VII – Noroccidente'
  },
  {
    id: 'VIII',
    code: 'region8',
    password: 'reg8_2026_inabPTN',
    name: 'Región VIII – Petén'
  },
  {
    id: 'IX',
    code: 'region9',
    password: 'reg9_CS2026_inab',
    name: 'Región IX – Costa Sur'
  },
  {
    id: 'X',
    code: 'region10',
    password: 'BVreg10_2026_inab',
    name: 'Región X – Baja Verapaz'
  }
];

const MOD1_CATEGORIES = [
  { key: 'Sí', label: 'Sí', color: '#7CB342' },
  { key: 'No', label: 'No', color: '#C62828' }
];

// Subregiones oficiales del INAB por Región (para el desplegable de Subregión en Módulo 1)
const SUBREGIONS_BY_REGION = {
  I: ['I-1 Guatemala'],
  II: ['II-1 Santa Cruz Verapaz', 'II-2 Tactic', 'II-3 Cobán', 'II-4 Chisec', 'II-5 Fray Bartolomé de las Casas', 'II-6 Ixcán', 'II-7 Santa Catalina La Tinta', 'II-8 Cahabón'],
  III: ['III-1 Izabal', 'III-2 Zacapa', 'III-3 Chiquimula', 'III-4 El Progreso'],
  IV: ['IV-1 Jalapa', 'IV-2 Santa Rosa', 'IV-3 Jutiapa'],
  V: ['V-1 Sacatepéquez', 'V-2 Chimaltenango'],
  VI: ['VI-1 Quetzaltenango', 'VI-2 San Marcos', 'VI-3 Totonicapán', 'VI-4 Sololá', 'VI-5 Tejutla'],
  VII: ['VII-1 Santa Cruz del Quiché', 'VII-2 Huehuetenango', 'VII-3 Uspantán', 'VII-4 Soloma', 'VII-5 Santa Ana Huista'],
  VIII: ['VIII-1 San Francisco', 'VIII-2 Poptún', 'VIII-3 Sayaxché', 'VIII-4 La Libertad', 'VIII-5 El Chal', 'VIII-6 Melchor de Mencos'],
  IX: ['IX-1 Mazatenango', 'IX-2 Escuintla', 'IX-3 Retalhuleu', 'IX-4 Coatepeque'],
  X: ['X-1 San Jerónimo', 'X-2 Rabinal', 'X-3 Granados']
};

// Tipos de licencia oficiales para el desplegable en Módulo 1
const TIPO_LICENCIA_OPTIONS = [
  'Licencia de Aprovechamiento Forestal con Fines de Producción',
  'Licencia de Cambio de Uso de la Tierra',
  'Licencia de Salvamento',
  'Licencia de Saneamiento',
  'Licencias de Aprovechamiento Forestal para Árboles Fuera de Bosque'
];

// Opciones oficiales para el desplegable de Tratamiento Silvicultural en Módulo 1
const TRATAMIENTO_SILVICULTURAL_OPTIONS = [
  'Corta total',
  'Corta selectiva',
  'Corta selectiva - árboles semilleros'
];

// Catálogo oficial de los 22 Departamentos y 340 Municipios de Guatemala
const GUATEMALA_DEPTOS_MUNICIPIOS = {
  'Alta Verapaz': ['Cobán', 'Santa Cruz Verapaz', 'San Cristóbal Verapaz', 'Tactic', 'Tamahú', 'Tucurú', 'Panzós', 'Senahú', 'San Pedro Carchá', 'San Juan Chamelco', 'Lanquín', 'Cahabón', 'Chisec', 'Chahal', 'Fray Bartolomé de las Casas', 'Santa Catalina La Tinta', 'Raxruhá'],
  'Baja Verapaz': ['Salamá', 'San Miguel Chicaj', 'Rabinal', 'Cubulco', 'Granados', 'El Chol', 'San Jerónimo', 'Purulhá'],
  'Chimaltenango': ['Chimaltenango', 'San José Poaquil', 'San Martín Jilotepeque', 'Comalapa', 'Santa Apolonia', 'Tecpán Guatemala', 'Patzún', 'Pochuta', 'Patzicía', 'Santa Cruz Balanyá', 'Acatenango', 'Yepocapa', 'San Andrés Itzapa', 'Parramos', 'Zaragoza', 'El Tejar'],
  'Chiquimula': ['Chiquimula', 'San José La Arada', 'San Juan Ermita', 'Jocotán', 'Camotán', 'Olopa', 'Esquipulas', 'Concepción Las Minas', 'Quezaltepeque', 'San Jacinto', 'Ipala'],
  'El Progreso': ['Guastatoya', 'Morazán', 'San Agustín Acasaguastlán', 'San Cristóbal Acasaguastlán', 'El Jícaro', 'Sansare', 'Sanarate', 'San Antonio La Paz'],
  'Escuintla': ['Escuintla', 'Santa Lucía Cotzumalguapa', 'La Democracia', 'Siquinalá', 'Masagua', 'Tiquisate', 'La Gomera', 'Guanagazapa', 'San José', 'Iztapa', 'Palín', 'San Vicente Pacaya', 'Nueva Concepción', 'Sipacate'],
  'Guatemala': ['Guatemala', 'Santa Catarina Pinula', 'San José Pinula', 'San José del Golfo', 'Palencia', 'Chinautla', 'San Pedro Ayampuc', 'Mixco', 'San Pedro Sacatepéquez', 'San Juan Sacatepéquez', 'San Raymundo', 'Chuarrancho', 'Fraijanes', 'Amatitlán', 'Villa Nueva', 'Villa Canales', 'Petapa'],
  'Huehuetenango': ['Huehuetenango', 'Chiantla', 'Malacatancito', 'Cuilco', 'Nentón', 'San Pedro Necta', 'Jacaltenango', 'Soloma', 'Ixtahuacán', 'Santa Bárbara', 'La Libertad', 'La Democracia', 'San Miguel Acatán', 'San Rafael La Independencia', 'Todos Santos Cuchumatán', 'San Juan Atitán', 'Santa Eulalia', 'San Mateo Ixtatán', 'Colotenango', 'San Sebastián Huehuetenango', 'Tectitán', 'Concepción Huista', 'San Juan Ixcoy', 'San Antonio Huista', 'San Sebastián Coatán', 'Barillas', 'Aguacatán', 'San Rafael Petzal', 'San Gaspar Ixchil', 'Santiago Chimaltenango', 'Santa Ana Huista', 'Unión Cantinil', 'Petatán'],
  'Izabal': ['Puerto Barrios', 'Livingston', 'El Estor', 'Morales', 'Los Amates'],
  'Jalapa': ['Jalapa', 'San Pedro Pinula', 'San Luis Jilotepeque', 'San Manuel Chaparrón', 'San Carlos Alzatate', 'Monjas', 'Mataquescuintla'],
  'Jutiapa': ['Jutiapa', 'El Progreso', 'Santa Catarina Mita', 'Agua Blanca', 'Asunción Mita', 'Yupiltepeque', 'Atescatempa', 'Jerez', 'El Adelanto', 'Zapotitlán', 'Comapa', 'Jalpatagua', 'Conguaco', 'Moyuta', 'Pasaco', 'San José Acatempa', 'Quesada'],
  'Petén': ['Flores', 'San José', 'San Benito', 'San Andrés', 'La Libertad', 'San Francisco', 'Santa Ana', 'Dolores', 'San Luis', 'Sayaxché', 'Melchor de Mencos', 'Poptún', 'Las Cruces', 'El Chal'],
  'Quetzaltenango': ['Quetzaltenango', 'Salcajá', 'Olintepeque', 'San Carlos Sija', 'Sibilia', 'Cabricán', 'Cajolá', 'San Miguel Sigüilá', 'Ostuncalco', 'San Mateo', 'Concepción Chiquirichapa', 'San Martín Sacatepéquez', 'Almolonga', 'Cantel', 'Huitán', 'Zunil', 'Colomba', 'San Francisco La Unión', 'El Palmar', 'Coatepeque', 'Génova', 'Flores Costa Cuca', 'La Esperanza', 'Palestina de Los Altos'],
  'Quiché': ['Santa Cruz del Quiché', 'Chiché', 'Chinique', 'Zacualpa', 'Chajul', 'Chichicastenango', 'Patzité', 'San Antonio Ilotenango', 'San Pedro Jocopilas', 'Cunén', 'San Juan Cotzal', 'Joyabaj', 'Nebaj', 'San Andrés Sajcabajá', 'Uspantán', 'Sacapulas', 'San Bartolomé Jocotenango', 'Canillá', 'Chicamán', 'Ixcán', 'Pachalum'],
  'Retalhuleu': ['Retalhuleu', 'San Sebastián', 'Santa Cruz Mulúa', 'San Martín Zapotitlán', 'San Felipe', 'San Andrés Villa Seca', 'Champerico', 'Nuevo San Carlos', 'El Asintal'],
  'Sacatepéquez': ['Antigua Guatemala', 'Jocotenango', 'Pastores', 'Sumpango', 'Santo Domingo Xenacoj', 'Santiago Sacatepéquez', 'San Bartolomé Milpas Altas', 'San Lucas Sacatepéquez', 'Santa Lucía Milpas Altas', 'Magdalena Milpas Altas', 'Santa María de Jesús', 'Ciudad Vieja', 'San Miguel Dueñas', 'Alotenango', 'San Antonio Aguas Calientes', 'Santa Catarina Barahona'],
  'San Marcos': ['San Marcos', 'San Pedro Sacatepéquez', 'San Antonio Sacatepéquez', 'Comitancillo', 'San Miguel Ixtahuacán', 'Concepción Tutuapa', 'Tacaná', 'Sibinal', 'Tajumulco', 'Tejutla', 'San Rafael Pie de la Cuesta', 'Nuevo Progreso', 'El Tumbador', 'El Rodeo', 'Malacatán', 'Catarina', 'Ayutla', 'Ocós', 'San Pablo', 'El Quetzal', 'La Reforma', 'Pajapita', 'Ixchiguán', 'San José Ojetenam', 'San Cristóbal Cucho', 'Sipacapa', 'Esquipulas Palo Gordo', 'Río Blanco', 'San Lorenzo', 'La Blanca'],
  'Santa Rosa': ['Cuilapa', 'Barberena', 'Santa Rosa de Lima', 'Casillas', 'San Rafael Las Flores', 'Oratorio', 'San Juan Tecuaco', 'Chiquimulilla', 'Taxisco', 'Santa María Ixhuatán', 'Guazacapán', 'Santa Cruz Naranjo', 'Pueblo Nuevo Viñas', 'Nueva Santa Rosa'],
  'Sololá': ['Sololá', 'San José Chacayá', 'Santa María Visitación', 'Santa Lucía Utatlán', 'Nahualá', 'Santa Catarina Ixtahuacán', 'Santa Clara La Laguna', 'Concepción', 'San Andrés Semetabaj', 'Panajachel', 'Santa Catarina Palopó', 'San Antonio Palopó', 'San Lucas Tolimán', 'Santa Cruz La Laguna', 'San Pablo La Laguna', 'San Marcos La Laguna', 'San Juan La Laguna', 'San Pedro La Laguna', 'Santiago Atitlán'],
  'Suchitepéquez': ['Mazatenango', 'Cuyotenango', 'San Francisco Zapotitlán', 'San Bernardino', 'San José El Ídolo', 'Santo Domingo Suchitepéquez', 'San Lorenzo', 'Samayac', 'San Pablo Jocopilas', 'San Antonio Suchitepéquez', 'San Miguel Panán', 'San Gabriel', 'Chicacao', 'Patulul', 'Santa Bárbara', 'San Juan Bautista', 'Santo Tomás La Unión', 'Zunilito', 'Pueblo Nuevo', 'Río Bravo', 'San José La Máquina'],
  'Totonicapán': ['Totonicapán', 'San Cristóbal Totonicapán', 'San Francisco El Alto', 'San Andrés Xecul', 'Momostenango', 'Santa María Chiquimula', 'Santa Lucía La Reforma', 'San Bartolo'],
  'Zacapa': ['Zacapa', 'Estanzuela', 'Río Hondo', 'Gualán', 'Teculután', 'Usumatlán', 'Cabañas', 'San Diego', 'La Unión', 'Huité', 'San Jorge']
};

const MOD1_EXTRA_FIELD_KEYS = [
  'subregion',
  'expediente',
  'resolucion',
  'fechaAprobacion',
  'titular',
  'representante',
  'tipoLicencia',
  'departamento',
  'municipio',
  'areaObligacion',
  'areaProduccion',
  'volumen',
  'tratamientoSilvicultural',
  'especies'
];

const MOD2_CATEGORIES = [
  { key: 'En Región', label: 'En Región', color: '#99C000', pillClass: 'pill-region' },
  { key: 'En Subregión', label: 'En Subregión', color: '#009900', pillClass: 'pill-subregion' },
  { key: 'No disponible', label: 'No disponible', color: '#E13F3F', pillClass: 'pill-nodisp' }
];

// Listados oficiales precargados desde initial-data.js (Módulo 1: 2,846 registros | Módulo 2: 4,997 registros)
function getInitialMod1Licenses() {
  if (typeof OFFICIAL_MOD1_DATA !== 'undefined' && Array.isArray(OFFICIAL_MOD1_DATA)) {
    return JSON.parse(JSON.stringify(OFFICIAL_MOD1_DATA));
  }
  return [];
}

function getInitialMod2Licenses() {
  if (typeof OFFICIAL_MOD2_DATA !== 'undefined' && Array.isArray(OFFICIAL_MOD2_DATA)) {
    return JSON.parse(JSON.stringify(OFFICIAL_MOD2_DATA));
  }
  return [];
}

const DEFAULT_GAS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzoYXapagGndZV7oJihMsAQliJNscOkA2-5JFph6yawuFLwFBL0XtofHOKPHSG5HSMhUA/exec';
const DEFAULT_ADMIN_EMAIL = 'orf.inab.dn.planificacion2026@gmail.com';

let appState = {
  mod1Licenses: [],
  mod2Licenses: [],
  locks: {},
  submissions: [],
  cloudConfig: {
    gasWebhookUrl: DEFAULT_GAS_WEBHOOK_URL,
    adminNotifyEmail: DEFAULT_ADMIN_EMAIL
  },
  adminUnlocked: false,
  adminSelectedRegion: 'ALL'
};

let currentSession = {
  authenticated: false,
  regionId: '',
  regionName: '',
  subregionId: '',
  subregionName: '',
  isRegionalHQ: false,
  personName: '',
  personRole: '',
  personEmail: '',
  generatedOtp: '',
  activeModule: null,
  selectedFiles: []
};

let signaturePads = {
  sigCanvasMod1: { hasDrawn: false },
  sigCanvasMod2: { hasDrawn: false },
  sigCanvasMod3: { hasDrawn: false }
};

/* ==========================================================================
   INICIALIZACIÓN
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  loadStateFromStorage();
  populateLoginRegionsDropdown();
  initSignatureCanvas('sigCanvasMod1');
  initSignatureCanvas('sigCanvasMod2');
  initSignatureCanvas('sigCanvasMod3');
  renderAdminRegionSidebar();
  renderAdminDashboard();
  syncAdminVisibilityUI();
});

function loadStateFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const initialM1 = getInitialMod1Licenses();
      const initialM2 = getInitialMod2Licenses();

      let loadedM1 = Array.isArray(parsed.mod1Licenses) ? parsed.mod1Licenses : [];
      let loadedM2 = Array.isArray(parsed.mod2Licenses) ? parsed.mod2Licenses : [];

      // Si localStorage estaba vacío o tenía una versión previa incompleta y no fue vaciado manualmente por el admin, cargar listado oficial preservando respuestas
      if (!parsed.mod1ClearedByAdmin && loadedM1.length < initialM1.length && initialM1.length > 0) {
        const prevMap1 = new Map();
        loadedM1.forEach(item => {
          const key = `${item.regionId}|${item.year}|${item.correlativo}`;
          prevMap1.set(key, item);
        });
        loadedM1 = initialM1.map(officialItem => {
          const key = `${officialItem.regionId}|${officialItem.year}|${officialItem.correlativo}`;
          const prev = prevMap1.get(key);
          return prev ? { ...officialItem, ...prev, id: officialItem.id } : officialItem;
        });
      }

      const m2MissingSubregion = loadedM2.length > 0 && typeof loadedM2[0].subregion === 'undefined';
      if (!parsed.mod2ClearedByAdmin && (loadedM2.length < initialM2.length || m2MissingSubregion) && initialM2.length > 0) {
        const prevMap2 = new Map();
        loadedM2.forEach(item => {
          const key = `${item.regionId}|${item.no}|${item.resolucion}`;
          prevMap2.set(key, item);
        });
        loadedM2 = initialM2.map(officialItem => {
          const key = `${officialItem.regionId}|${officialItem.no}|${officialItem.resolucion}`;
          const prev = prevMap2.get(key);
          return prev
            ? {
                ...officialItem,
                disponibilidad: prev.disponibilidad || officialItem.disponibilidad,
                obs: prev.obs || officialItem.obs
              }
            : officialItem;
        });
      }

      appState = {
        ...appState,
        ...parsed,
        cloudConfig: {
          gasWebhookUrl: (parsed.cloudConfig && parsed.cloudConfig.gasWebhookUrl) ? parsed.cloudConfig.gasWebhookUrl : DEFAULT_GAS_WEBHOOK_URL,
          adminNotifyEmail: (parsed.cloudConfig && parsed.cloudConfig.adminNotifyEmail && parsed.cloudConfig.adminNotifyEmail !== 'planificacion.forestal@institucion.gob.gt')
            ? parsed.cloudConfig.adminNotifyEmail
            : DEFAULT_ADMIN_EMAIL
        },
        mod1Licenses: loadedM1,
        mod2Licenses: loadedM2
      };
      saveStateToStorage();
    } else {
      appState.mod1Licenses = getInitialMod1Licenses();
      appState.mod2Licenses = getInitialMod2Licenses();
      saveStateToStorage();
    }
  } catch (e) {
    console.error('Error cargando estado local:', e);
    appState.mod1Licenses = getInitialMod1Licenses();
    appState.mod2Licenses = getInitialMod2Licenses();
  }
}

function saveStateToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  } catch (e) {
    console.error('Error guardando estado local:', e);
  }
}

function getRegionLockState(regionId) {
  if (!appState.locks[regionId]) {
    appState.locks[regionId] = {
      mod1Locked: false,
      mod2Locked: false,
      mod3Locked: false
    };
  }
  return appState.locks[regionId];
}

/* ==========================================================================
   MODO ADMINISTRADOR
   ========================================================================== */
function promptAdminUnlock() {
  if (appState.adminUnlocked) {
    appState.adminUnlocked = false;
    saveStateToStorage();
    syncAdminVisibilityUI();
    switchMainView('portal');
    showToast('🔒 Modo Administrador cerrado.');
    return;
  }

  const pass = window.prompt('Ingrese la clave de Administrador:');
  if (pass === null) return;
  if (pass.trim() === 'admin2026') {
    appState.adminUnlocked = true;
    saveStateToStorage();
    syncAdminVisibilityUI();
    showToast('🔓 Controles de Administrador habilitados.');
  } else {
    showToast('❌ Clave incorrecta.');
  }
}

function syncAdminVisibilityUI() {
  const nav = document.getElementById('adminTopNav');
  const btnLock = document.getElementById('btnAdminToggleLock');

  if (appState.adminUnlocked) {
    nav.classList.add('visible');
    btnLock.textContent = '🔓 Salir Modo Admin';
  } else {
    nav.classList.remove('visible');
    btnLock.textContent = '🔒 Administrador';
  }
}

function switchMainView(viewName) {
  const viewPortal = document.getElementById('viewPortal');
  const viewAdmin = document.getElementById('viewAdmin');
  const navPortalBtn = document.getElementById('navPortalBtn');
  const navAdminBtn = document.getElementById('navAdminBtn');

  if (viewName === 'admin') {
    viewPortal.style.display = 'none';
    viewAdmin.style.display = 'block';
    navPortalBtn.classList.remove('active');
    navAdminBtn.classList.add('active');
    renderAdminRegionSidebar();
    renderAdminDashboard();
  } else {
    viewAdmin.style.display = 'none';
    viewPortal.style.display = 'block';
    navAdminBtn.classList.remove('active');
    navPortalBtn.classList.add('active');
  }
}

/* ==========================================================================
   CREDENCIALES DE INGRESO DIRECTO POR REGIÓN (I A X)
   ========================================================================== */
function populateLoginRegionsDropdown() {
  const select = document.getElementById('loginRegionUser');
  select.innerHTML = '<option value="">Seleccione su Región</option>';
  REGIONS_CATALOG.forEach(reg => {
    const opt = document.createElement('option');
    opt.value = reg.id;
    opt.textContent = reg.name;
    select.appendChild(opt);
  });
}

function handleRequestOtp(event) {
  event.preventDefault();
  const regionId = document.getElementById('loginRegionUser').value;
  const pass = document.getElementById('loginRegionPass').value.trim();
  const personName = document.getElementById('loginPersonName').value.trim();
  const personRole = document.getElementById('loginPersonRole').value.trim();
  const personEmail = document.getElementById('loginPersonEmail').value.trim();

  const regionObj = REGIONS_CATALOG.find(r => r.id === regionId);
  if (!regionObj) {
    showToast('⚠️ Seleccione su Región.');
    return;
  }

  if (pass !== regionObj.password) {
    showToast('⚠️ Contraseña (Regional) incorrecta para la región seleccionada.');
    return;
  }

  currentSession = {
    ...currentSession,
    authenticated: true,
    regionId: regionObj.id,
    regionName: regionObj.name,
    subregionId: `REG-${regionObj.id}`,
    subregionName: regionObj.name,
    isRegionalHQ: true,
    personName,
    personRole,
    personEmail,
    generatedOtp: '',
    activeModule: null,
    selectedFiles: []
  };

  document.getElementById('authSection').style.display = 'none';
  document.getElementById('AuthenticatedWorkspace').style.display = 'block';

  document.getElementById('sessionAvatar').textContent = `R${currentSession.regionId}`;
  document.getElementById('sessionTitleDisplay').textContent = currentSession.regionName;
  document.getElementById('sessionUserDisplay').textContent =
    `Responsable: ${currentSession.personName} (${currentSession.personRole}) · Correo: ${currentSession.personEmail}`;

  const userSummary = `${currentSession.personName} (${currentSession.personRole})`;
  document.getElementById('secSummaryUserMod1').textContent = userSummary;
  document.getElementById('secSummaryUserMod2').textContent = userSummary;
  document.getElementById('secSummaryUserMod3').textContent = userSummary;

  refreshModulesCardsState();
  closeActiveModuleView();

  showToast(`✅ Bienvenido/a. Acceso habilitado para ${currentSession.regionName}.`);
}

function switchRegionInSession() {
  currentSession.authenticated = false;
  currentSession.activeModule = null;
  document.getElementById('AuthenticatedWorkspace').style.display = 'none';
  document.getElementById('authSection').style.display = 'grid';
}

/* ==========================================================================
   LOS 3 MÓDULOS HABILITADOS PARA CADA REGIÓN (I A X)
   ========================================================================== */
function refreshModulesCardsState() {
  const lock = getRegionLockState(currentSession.regionId);
  const card1 = document.getElementById('cardModule1');
  const card2 = document.getElementById('cardModule2');
  const card3 = document.getElementById('cardModule3');

  // Los 3 módulos están disponibles para la entidad regional única
  card1.style.display = 'flex';
  card2.style.display = 'flex';
  card3.style.display = 'flex';

  const configs = [
    { num: 1, locked: lock.mod1Locked, availText: '🟢 Disponible para envío' },
    { num: 2, locked: lock.mod2Locked, availText: '🟢 Disponible para envío' },
    { num: 3, locked: lock.mod3Locked, availText: '🟢 Disponible para carga' }
  ];

  configs.forEach(cfg => {
    const badge = document.getElementById(`badgeModule${cfg.num}`);
    const card = document.getElementById(`cardModule${cfg.num}`);
    const btn = document.getElementById(`btnOpenModule${cfg.num}`);

    if (cfg.locked) {
      badge.className = 'status-pill completed';
      badge.textContent = '🔒 Envío Completado (Bloqueado)';
      card.classList.add('locked');
      btn.textContent = 'Ver (Bloqueado)';
    } else {
      badge.className = 'status-pill available';
      badge.textContent = cfg.availText;
      card.classList.remove('locked');
      btn.textContent = 'Abrir →';
    }
  });
}

function closeActiveModuleView() {
  currentSession.activeModule = null;
  document.getElementById('modulesSelectionScreen').style.display = 'block';
  document.getElementById('btnBackToModulesGrid').style.display = 'none';
  document.getElementById('module1Container').style.display = 'none';
  document.getElementById('module2Container').style.display = 'none';
  document.getElementById('module3Container').style.display = 'none';
  refreshModulesCardsState();
}

function openModuleWorkspace(modNumber) {
  currentSession.activeModule = modNumber;
  document.getElementById('modulesSelectionScreen').style.display = 'none';
  document.getElementById('btnBackToModulesGrid').style.display = 'inline-flex';

  document.getElementById('module1Container').style.display = modNumber === 1 ? 'block' : 'none';
  document.getElementById('module2Container').style.display = modNumber === 2 ? 'block' : 'none';
  document.getElementById('module3Container').style.display = modNumber === 3 ? 'block' : 'none';

  if (modNumber === 1) renderModule1Table();
  if (modNumber === 2) renderModule2Table();
  if (modNumber === 3) updateModule3State();
}

/* ==========================================================================
   MÓDULO 1 (POR REGIÓN I A X) + FILTRO POR AÑO / ESTADO + BLOQUEO DE ENVÍO
   ========================================================================== */
function syncModuleYearDropdown(selectId, list) {
  const select = document.getElementById(selectId);
  if (!select) return 'ALL';
  const currentVal = select.value || 'ALL';
  const yearsSet = new Set();
  list.forEach(item => {
    if (item.year) yearsSet.add(String(item.year));
  });
  const sortedYears = Array.from(yearsSet).sort((a, b) => Number(a) - Number(b));

  select.innerHTML = `<option value="ALL">📅 Todos los años (${list.length})</option>` +
    sortedYears.map(yr => {
      const countYr = list.filter(i => String(i.year) === yr).length;
      return `<option value="${yr}">📅 Año ${yr} (${countYr})</option>`;
    }).join('');

  if (currentVal !== 'ALL' && sortedYears.includes(currentVal)) {
    select.value = currentVal;
  } else {
    select.value = 'ALL';
  }
  return select.value;
}

function isMod1RowComplete(lic) {
  return lic.emitida === 'Sí' || lic.emitida === 'No';
}

function getMod1LicensesForCurrentSession() {
  if (!currentSession.regionId) return [];
  return appState.mod1Licenses.filter(l => l.regionId === currentSession.regionId);
}

function renderModule1Table() {
  const tbody = document.getElementById('mod1TableBody');
  const search = (document.getElementById('mod1SearchInput')?.value || '').toLowerCase().trim();
  const statusFilter = document.getElementById('mod1StatusFilter')?.value || 'ALL';
  const lock = getRegionLockState(currentSession.regionId);
  const isLocked = lock.mod1Locked;

  const list = getMod1LicensesForCurrentSession();
  const yearFilter = syncModuleYearDropdown('mod1YearFilter', list);
  const completedRows = list.filter(l => isMod1RowComplete(l)).length;
  const total = list.length;
  const missing = total - completedRows;
  const pct = total > 0 ? Math.round((completedRows / total) * 100) : 0;

  document.getElementById('mod1ProgressText').textContent = `Avance: ${completedRows} de ${total} licencias completadas`;
  document.getElementById('mod1ProgressPct').textContent = `${pct}%`;
  document.getElementById('mod1ProgressFill').style.width = `${pct}%`;

  const submitBtn = document.getElementById('btnSubmitMod1');
  const warningEl = document.getElementById('mod1CompletionWarning');

  if (isLocked) {
    submitBtn.disabled = true;
    submitBtn.textContent = '🔒 Información enviada y bloqueada';
    warningEl.textContent = 'Este formulario ya fue enviado.';
    warningEl.className = 'completion-warning-hint';
  } else if (total === 0 || missing > 0) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviar información';
    warningEl.textContent = `⚠️ Debe completar todos los registros para poder enviar (faltan ${missing} de ${total})`;
    warningEl.className = 'completion-warning-hint';
  } else {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Enviar información';
    warningEl.textContent = '✅ Todos los registros están completos. Firme y presione Enviar información.';
    warningEl.className = 'completion-warning-hint ready';
  }

  const filtered = list.filter(item => {
    const matchYear = yearFilter === 'ALL' || String(item.year) === String(yearFilter);
    const isDone = isMod1RowComplete(item);
    const matchStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'PENDING' && !isDone) ||
      (statusFilter === 'ANSWERED' && isDone);
    const matchSearch =
      !search ||
      String(item.correlativo).toLowerCase().includes(search) ||
      String(item.year).toLowerCase().includes(search) ||
      String(item.expediente || '').toLowerCase().includes(search) ||
      String(item.resolucion || '').toLowerCase().includes(search) ||
      String(item.titular || '').toLowerCase().includes(search) ||
      String(item.especies || '').toLowerCase().includes(search) ||
      String(item.obs || '').toLowerCase().includes(search);

    return matchYear && matchStatus && matchSearch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="19" class="center" style="padding: 28px; color: var(--text-muted);">
          ${list.length === 0
            ? 'No hay registros cargados para esta Región en el Módulo 1.'
            : 'No hay registros que coincidan con el filtro de año / estado seleccionado.'}
        </td>
      </tr>
    `;
    return;
  }

  const subregionOptionsList = SUBREGIONS_BY_REGION[currentSession.regionId] || [];
  const deptosList = Object.keys(GUATEMALA_DEPTOS_MUNICIPIOS);

  tbody.innerHTML = filtered.map((lic, idx) => {
    const isSi = lic.emitida === 'Sí';
    const isNo = lic.emitida === 'No';
    const isDone = isMod1RowComplete(lic);
    const extraDisabled = !isSi || isLocked;
    const disabledStyle = extraDisabled
      ? 'background:#F2F4F4;color:#909497;opacity:0.65;cursor:not-allowed;'
      : 'background:#FFFFFF;color:#1B2631;';

    const currentDepto = lic.departamento || '';
    const municipiosForDepto = GUATEMALA_DEPTOS_MUNICIPIOS[currentDepto] || [];

    const subregionSelectHtml = `
      <select
        class="obs-input"
        style="${disabledStyle}"
        ${extraDisabled ? 'disabled' : ''}
        onchange="handleUpdateMod1ExtraField('${lic.id}', 'subregion', this.value, true)"
      >
        <option value="">${isSi ? 'Seleccione Subregión...' : '— (Solo en Sí)'}</option>
        ${subregionOptionsList.map(opt => `<option value="${opt}" ${lic.subregion === opt ? 'selected' : ''}>${opt}</option>`).join('')}
      </select>
    `;

    const tipoLicSelectHtml = `
      <select
        class="obs-input"
        style="${disabledStyle}"
        ${extraDisabled ? 'disabled' : ''}
        onchange="handleUpdateMod1ExtraField('${lic.id}', 'tipoLicencia', this.value, true)"
      >
        <option value="">${isSi ? 'Seleccione Tipo...' : '— (Solo en Sí)'}</option>
        ${TIPO_LICENCIA_OPTIONS.map(opt => `<option value="${opt}" ${lic.tipoLicencia === opt ? 'selected' : ''}>${opt}</option>`).join('')}
      </select>
    `;

    const deptoSelectHtml = `
      <select
        class="obs-input"
        style="${disabledStyle}"
        ${extraDisabled ? 'disabled' : ''}
        onchange="handleUpdateMod1Depto('${lic.id}', this.value)"
      >
        <option value="">${isSi ? 'Seleccione Depto...' : '— (Solo en Sí)'}</option>
        ${deptosList.map(d => `<option value="${d}" ${currentDepto === d ? 'selected' : ''}>${d}</option>`).join('')}
      </select>
    `;

    const muniSelectHtml = `
      <select
        class="obs-input"
        style="${disabledStyle}"
        ${extraDisabled ? 'disabled' : ''}
        onchange="handleUpdateMod1ExtraField('${lic.id}', 'municipio', this.value, true)"
      >
        <option value="">${isSi ? (currentDepto ? 'Seleccione Municipio...' : 'Elija Depto. primero...') : '— (Solo en Sí)'}</option>
        ${municipiosForDepto.map(m => `<option value="${m}" ${lic.municipio === m ? 'selected' : ''}>${m}</option>`).join('')}
      </select>
    `;

    const tratamientoSelectHtml = `
      <select
        class="obs-input"
        style="${disabledStyle}"
        ${extraDisabled ? 'disabled' : ''}
        onchange="handleUpdateMod1ExtraField('${lic.id}', 'tratamientoSilvicultural', this.value, true)"
      >
        <option value="">${isSi ? 'Seleccione Tratamiento...' : '— (Solo en Sí)'}</option>
        ${TRATAMIENTO_SILVICULTURAL_OPTIONS.map(opt => `<option value="${opt}" ${lic.tratamientoSilvicultural === opt ? 'selected' : ''}>${opt}</option>`).join('')}
      </select>
    `;

    const renderTextInput = (fieldKey, placeholderText) => `
      <input
        type="text"
        class="obs-input"
        style="${disabledStyle}"
        placeholder="${isSi ? placeholderText : '— (Solo en Sí)'}"
        value="${String(lic[fieldKey] || '').replace(/"/g, '&quot;')}"
        ${extraDisabled ? 'disabled' : ''}
        oninput="handleUpdateMod1ExtraField('${lic.id}', '${fieldKey}', this.value, false)"
        onblur="refreshMod1ProgressOnly()"
      />
    `;

    return `
      <tr class="${isDone ? 'row-answered' : ''}">
        <td class="center"><strong>${lic.no || idx + 1}</strong></td>
        <td class="center">${lic.year}</td>
        <td class="center"><strong>${lic.correlativo}</strong></td>
        <td class="center">
          <div class="yes-no-group">
            <label class="choice-pill pill-si ${isSi ? 'selected' : ''}">
              <input
                type="radio"
                name="mod1_emitida_${lic.id}"
                value="Sí"
                ${isSi ? 'checked' : ''}
                ${isLocked ? 'disabled' : ''}
                onchange="handleSelectMod1Emitida('${lic.id}', 'Sí')"
              />
              Sí
            </label>
            <label class="choice-pill pill-no ${isNo ? 'selected' : ''}">
              <input
                type="radio"
                name="mod1_emitida_${lic.id}"
                value="No"
                ${isNo ? 'checked' : ''}
                ${isLocked ? 'disabled' : ''}
                onchange="handleSelectMod1Emitida('${lic.id}', 'No')"
              />
              No
            </label>
          </div>
        </td>
        <td>${subregionSelectHtml}</td>
        <td>${renderTextInput('expediente', 'Expediente')}</td>
        <td>${renderTextInput('resolucion', 'Resolución')}</td>
        <td>${renderTextInput('fechaAprobacion', 'DD/MM/AAAA')}</td>
        <td>${renderTextInput('titular', 'Titular')}</td>
        <td>${renderTextInput('representante', 'Representante')}</td>
        <td>${tipoLicSelectHtml}</td>
        <td>${deptoSelectHtml}</td>
        <td>${muniSelectHtml}</td>
        <td>${renderTextInput('areaObligacion', 'Ha')}</td>
        <td>${renderTextInput('areaProduccion', 'Ha')}</td>
        <td>${renderTextInput('volumen', 'm³')}</td>
        <td>${tratamientoSelectHtml}</td>
        <td>${renderTextInput('especies', 'Especies')}</td>
        <td>
          <input
            type="text"
            class="obs-input"
            placeholder="Observación..."
            value="${(lic.obs || '').replace(/"/g, '&quot;')}"
            ${isLocked ? 'disabled' : ''}
            oninput="handleUpdateMod1Obs('${lic.id}', this.value)"
          />
        </td>
      </tr>
    `;
  }).join('');
}

function refreshMod1ProgressOnly() {
  const lock = getRegionLockState(currentSession.regionId);
  const isLocked = lock.mod1Locked;
  const list = getMod1LicensesForCurrentSession();
  const completedRows = list.filter(l => isMod1RowComplete(l)).length;
  const total = list.length;
  const missing = total - completedRows;
  const pct = total > 0 ? Math.round((completedRows / total) * 100) : 0;

  document.getElementById('mod1ProgressText').textContent = `Avance: ${completedRows} de ${total} licencias completadas`;
  document.getElementById('mod1ProgressPct').textContent = `${pct}%`;
  document.getElementById('mod1ProgressFill').style.width = `${pct}%`;

  const submitBtn = document.getElementById('btnSubmitMod1');
  const warningEl = document.getElementById('mod1CompletionWarning');

  if (isLocked) {
    submitBtn.disabled = true;
    submitBtn.textContent = '🔒 Información enviada y bloqueada';
    warningEl.textContent = 'Este formulario ya fue enviado.';
    warningEl.className = 'completion-warning-hint';
  } else if (total === 0 || missing > 0) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviar información';
    warningEl.textContent = `⚠️ Debe completar todos los registros para poder enviar (faltan ${missing} de ${total})`;
    warningEl.className = 'completion-warning-hint';
  } else {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Enviar información';
    warningEl.textContent = '✅ Todos los registros están completos. Firme y presione Enviar información.';
    warningEl.className = 'completion-warning-hint ready';
  }
}

function handleSelectMod1Emitida(licId, val) {
  const item = appState.mod1Licenses.find(l => l.id === licId);
  if (!item) return;
  item.emitida = val;
  if (val === 'No') {
    MOD1_EXTRA_FIELD_KEYS.forEach(k => {
      item[k] = '';
    });
  }
  saveStateToStorage();
  renderModule1Table();
}

function handleUpdateMod1ExtraField(licId, fieldKey, val, shouldRerender) {
  const item = appState.mod1Licenses.find(l => l.id === licId);
  if (!item) return;
  item[fieldKey] = val;
  saveStateToStorage();
  if (shouldRerender) {
    renderModule1Table();
  } else {
    refreshMod1ProgressOnly();
  }
}

function handleUpdateMod1Depto(licId, deptoVal) {
  const item = appState.mod1Licenses.find(l => l.id === licId);
  if (!item) return;
  item.departamento = deptoVal;
  const validMunis = GUATEMALA_DEPTOS_MUNICIPIOS[deptoVal] || [];
  if (!validMunis.includes(item.municipio)) {
    item.municipio = '';
  }
  saveStateToStorage();
  renderModule1Table();
}

function handleUpdateMod1Obs(licId, val) {
  const item = appState.mod1Licenses.find(l => l.id === licId);
  if (!item) return;
  item.obs = val;
  saveStateToStorage();
}

function submitModule1Form() {
  const lock = getRegionLockState(currentSession.regionId);
  if (lock.mod1Locked) return;

  const list = getMod1LicensesForCurrentSession();
  const missing = list.filter(l => !isMod1RowComplete(l));
  if (list.length === 0 || missing.length > 0) {
    showToast(`⚠️ Faltan ${missing.length} registro(s) por responder antes de enviar.`);
    return;
  }

  if (!signaturePads.sigCanvasMod1.hasDrawn) {
    showToast('✍️ Dibuje su Firma Digital en la sección de Validación de envío.');
    return;
  }

  const sigDataUrl = document.getElementById('sigCanvasMod1').toDataURL('image/png');
  finalizeModuleSubmission({
    modNumber: 1,
    moduleTitle: 'Control de Licencias sin Información Digital (Módulo 1)',
    signatureDataUrl: sigDataUrl,
    snapshot: JSON.parse(JSON.stringify(list))
  });
}

/* ==========================================================================
   MÓDULO 2 (POR REGIÓN I A X) + FILTRO POR SUBREGIÓN Y AÑO + BLOQUEO DE ENVÍO
   ========================================================================== */
function syncModuleSubregionDropdown(selectId, list) {
  const select = document.getElementById(selectId);
  if (!select) return 'ALL';
  const currentVal = select.value || 'ALL';
  const subregionsSet = new Set();
  let emptyCount = 0;

  list.forEach(item => {
    const sub = String(item.subregion || '').trim();
    if (sub) {
      subregionsSet.add(sub);
    } else {
      emptyCount++;
    }
  });

  const sortedSubs = Array.from(subregionsSet).sort((a, b) => a.localeCompare(b, 'es', { numeric: true }));

  let optionsHtml = `<option value="ALL">📍 Todas las subregiones (${list.length})</option>`;
  optionsHtml += sortedSubs.map(sub => {
    const countSub = list.filter(i => String(i.subregion || '').trim() === sub).length;
    return `<option value="${sub}">📍 Subregión ${sub} (${countSub})</option>`;
  }).join('');

  if (emptyCount > 0) {
    optionsHtml += `<option value="__EMPTY__">📍 Sin subregión (${emptyCount})</option>`;
  }

  select.innerHTML = optionsHtml;

  if (currentVal === '__EMPTY__' && emptyCount > 0) {
    select.value = '__EMPTY__';
  } else if (currentVal !== 'ALL' && sortedSubs.includes(currentVal)) {
    select.value = currentVal;
  } else {
    select.value = 'ALL';
  }
  return select.value;
}

function getMod2LicensesForCurrentSession() {
  if (!currentSession.regionId) return [];
  return appState.mod2Licenses.filter(l => l.regionId === currentSession.regionId);
}

function renderModule2Table() {
  const tbody = document.getElementById('mod2TableBody');
  const search = (document.getElementById('mod2SearchInput')?.value || '').toLowerCase().trim();
  const statusFilter = document.getElementById('mod2StatusFilter')?.value || 'ALL';
  const lock = getRegionLockState(currentSession.regionId);
  const isLocked = lock.mod2Locked;

  const list = getMod2LicensesForCurrentSession();
  const subregionFilter = syncModuleSubregionDropdown('mod2SubregionFilter', list);
  const listAfterSubregion = list.filter(item => {
    const itemSub = String(item.subregion || '').trim();
    if (subregionFilter === 'ALL') return true;
    if (subregionFilter === '__EMPTY__') return itemSub === '';
    return itemSub === subregionFilter;
  });
  const yearFilter = syncModuleYearDropdown('mod2YearFilter', listAfterSubregion);

  const answered = list.filter(l => Boolean(l.disponibilidad)).length;
  const total = list.length;
  const missing = total - answered;
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0;

  document.getElementById('mod2ProgressText').textContent = `Avance: ${answered} de ${total} expedientes verificados`;
  document.getElementById('mod2ProgressPct').textContent = `${pct}%`;
  document.getElementById('mod2ProgressFill').style.width = `${pct}%`;

  const submitBtn = document.getElementById('btnSubmitMod2');
  const warningEl = document.getElementById('mod2CompletionWarning');

  // MODIFICACIÓN 3: No permitir enviar si no completan todos los registros
  if (isLocked) {
    submitBtn.disabled = true;
    submitBtn.textContent = '🔒 Información enviada y bloqueada';
    warningEl.textContent = 'Este formulario ya fue enviado.';
    warningEl.className = 'completion-warning-hint';
  } else if (total === 0 || missing > 0) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviar información';
    warningEl.textContent = `⚠️ Debe completar todos los registros para poder enviar (faltan ${missing} de ${total})`;
    warningEl.className = 'completion-warning-hint';
  } else {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Enviar información';
    warningEl.textContent = '✅ Todos los registros están completos. Firme y presione Enviar información.';
    warningEl.className = 'completion-warning-hint ready';
  }

  const filtered = listAfterSubregion.filter(item => {
    const matchYear = yearFilter === 'ALL' || String(item.year) === String(yearFilter);
    const isAnswered = Boolean(item.disponibilidad);
    const matchStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'PENDING' && !isAnswered) ||
      (statusFilter === 'ANSWERED' && isAnswered);
    const matchSearch =
      !search ||
      String(item.subregion || '').toLowerCase().includes(search) ||
      String(item.resolucion || '').toLowerCase().includes(search) ||
      String(item.expediente || '').toLowerCase().includes(search) ||
      String(item.titular || '').toLowerCase().includes(search) ||
      String(item.year || '').toLowerCase().includes(search) ||
      String(item.obs || '').toLowerCase().includes(search);

    return matchYear && matchStatus && matchSearch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" class="center" style="padding: 28px; color: var(--text-muted);">
          ${list.length === 0
            ? 'No hay registros cargados para esta Región en el Módulo 2.'
            : 'No hay registros que coincidan con el filtro de subregión / año / estado seleccionado.'}
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map((lic, idx) => {
    const buttonsHtml = MOD2_CATEGORIES.map(cat => {
      const selected = lic.disponibilidad === cat.key;
      return `
        <label class="choice-pill ${cat.pillClass} ${selected ? 'selected' : ''}">
          <input
            type="radio"
            name="mod2_disp_${lic.id}"
            value="${cat.key}"
            ${selected ? 'checked' : ''}
            ${isLocked ? 'disabled' : ''}
            onchange="handleSelectMod2Disponibilidad('${lic.id}', '${cat.key}')"
          />
          ${cat.label}
        </label>
      `;
    }).join('');

    const subDisplay = String(lic.subregion || '').trim() || '—';

    return `
      <tr class="${lic.disponibilidad ? 'row-answered' : ''}">
        <td class="center"><strong>${lic.no || idx + 1}</strong></td>
        <td class="center">
          <span style="display:inline-block;padding:3px 9px;border-radius:6px;background:#EBF5FB;color:#1A5276;font-weight:700;font-size:0.82rem;">
            ${subDisplay}
          </span>
        </td>
        <td><strong>${lic.resolucion || '—'}</strong></td>
        <td>${lic.expediente || '—'}</td>
        <td>${lic.titular || '—'}</td>
        <td class="center">${lic.year}</td>
        <td class="center">${Number(lic.area || 0).toFixed(2)}</td>
        <td class="center">
          <div class="mod2-options-group">
            ${buttonsHtml}
          </div>
        </td>
        <td>
          <input
            type="text"
            class="obs-input"
            placeholder="Observaciones..."
            value="${(lic.obs || '').replace(/"/g, '&quot;')}"
            ${isLocked ? 'disabled' : ''}
            oninput="handleUpdateMod2Obs('${lic.id}', this.value)"
          />
        </td>
      </tr>
    `;
  }).join('');
}

function handleSelectMod2Disponibilidad(licId, val) {
  const item = appState.mod2Licenses.find(l => l.id === licId);
  if (!item) return;
  item.disponibilidad = val;
  saveStateToStorage();
  renderModule2Table();
}

function handleUpdateMod2Obs(licId, val) {
  const item = appState.mod2Licenses.find(l => l.id === licId);
  if (!item) return;
  item.obs = val;
  saveStateToStorage();
}

function submitModule2Form() {
  const lock = getRegionLockState(currentSession.regionId);
  if (lock.mod2Locked) return;

  const list = getMod2LicensesForCurrentSession();
  const missing = list.filter(l => !l.disponibilidad);
  if (list.length === 0 || missing.length > 0) {
    showToast(`⚠️ No se permite enviar la información hasta completar todos los registros (faltan ${missing.length}).`);
    return;
  }

  if (!signaturePads.sigCanvasMod2.hasDrawn) {
    showToast('✍️ Dibuje su Firma Digital en la sección de Validación de envío.');
    return;
  }

  const sigDataUrl = document.getElementById('sigCanvasMod2').toDataURL('image/png');
  finalizeModuleSubmission({
    modNumber: 2,
    moduleTitle: 'Control de Licencias sin Polígono Digital (Módulo 2)',
    signatureDataUrl: sigDataUrl,
    snapshot: JSON.parse(JSON.stringify(list))
  });
}

/* ==========================================================================
   MÓDULO 3: CARGA DE POLÍGONOS GEORREFERENCIADOS CON LECTURA BASE64 PARA DRIVE
   ========================================================================== */
function handleDriveFilesSelected(event) {
  const files = Array.from(event.target.files || []);
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = () => {
      currentSession.selectedFiles.push({
        name: file.name,
        sizeKB: Math.round(file.size / 1024),
        mimeType: file.type || 'application/octet-stream',
        dataUrl: reader.result
      });
      renderSelectedDriveFiles();
      updateModule3State();
    };
    reader.readAsDataURL(file);
  });
}

function renderSelectedDriveFiles() {
  const container = document.getElementById('selectedFilesList');
  if (currentSession.selectedFiles.length === 0) {
    container.innerHTML = '';
    return;
  }
  container.innerHTML = currentSession.selectedFiles.map((file, idx) => `
    <div class="file-item-chip">
      <span>📦 <strong>${file.name}</strong> <small style="color:var(--text-muted);">(${file.sizeKB} KB)</small></span>
      <button type="button" class="btn-danger" style="padding: 4px 9px;" onclick="removeSelectedDriveFile(${idx})">✕</button>
    </div>
  `).join('');
}

function removeSelectedDriveFile(idx) {
  currentSession.selectedFiles.splice(idx, 1);
  renderSelectedDriveFiles();
  updateModule3State();
}

function updateModule3State() {
  const lock = getRegionLockState(currentSession.regionId);
  const btn = document.getElementById('btnSubmitMod3');
  const warningEl = document.getElementById('mod3CompletionWarning');

  if (lock.mod3Locked) {
    btn.disabled = true;
    btn.textContent = '🔒 Información enviada y bloqueada';
    warningEl.textContent = 'Este módulo ya fue enviado.';
    warningEl.className = 'completion-warning-hint';
  } else if (currentSession.selectedFiles.length === 0) {
    btn.disabled = true;
    btn.textContent = 'Enviar información';
    warningEl.textContent = '⚠️ Seleccione al menos un archivo o carpeta de polígonos para habilitar el envío';
    warningEl.className = 'completion-warning-hint';
  } else {
    btn.disabled = false;
    btn.textContent = 'Enviar información';
    warningEl.textContent = `✅ ${currentSession.selectedFiles.length} archivo(s) listo(s). Firme y presione Enviar información.`;
    warningEl.className = 'completion-warning-hint ready';
  }
}

function submitModule3Form() {
  const lock = getRegionLockState(currentSession.regionId);
  if (lock.mod3Locked) return;

  if (currentSession.selectedFiles.length === 0) {
    showToast('📁 Seleccione el archivo o carpeta comprimida con los polígonos georreferenciados.');
    return;
  }

  if (!signaturePads.sigCanvasMod3.hasDrawn) {
    showToast('✍️ Dibuje su Firma Digital en la sección de Validación de envío.');
    return;
  }

  const sigDataUrl = document.getElementById('sigCanvasMod3').toDataURL('image/png');
  const folderTarget = `/Poligonos_Georreferenciados/${currentSession.regionName}/`;

  finalizeModuleSubmission({
    modNumber: 3,
    moduleTitle: 'Carga de Polígonos Georreferenciados (Módulo 3)',
    signatureDataUrl: sigDataUrl,
    driveFolderTarget: folderTarget,
    filesUploaded: currentSession.selectedFiles.map(f => ({
      name: f.name,
      sizeKB: f.sizeKB,
      mimeType: f.mimeType,
      dataUrl: f.dataUrl
    })),
    notes: document.getElementById('module3GeneralNotes').value.trim()
  });

  currentSession.selectedFiles = [];
  document.getElementById('module3GeneralNotes').value = '';
  renderSelectedDriveFiles();
}

/* ==========================================================================
   REGISTRO UNIFICADO DE ENVÍO, BLOQUEO Y NOTIFICACIÓN DE CORREO
   ========================================================================== */
function finalizeModuleSubmission({ modNumber, moduleTitle, signatureDataUrl, snapshot, driveFolderTarget, filesUploaded, notes }) {
  const lock = getRegionLockState(currentSession.regionId);
  const now = new Date();
  const dateStr = now.toLocaleDateString('es-GT', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const timeStr = now.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const adminEmailMessage =
    `Formulario ${moduleTitle}, La ${currentSession.regionName} ha completado el formulario el ${dateStr} a las ${timeStr} a nombre de ${currentSession.personName} (${currentSession.personRole}).`;

  const userReceiptMessage =
    `Constancia de Envío: Estimado/a ${currentSession.personName} (${currentSession.personRole}), confirmamos la recepción exitosa de ${moduleTitle} correspondiente a ${currentSession.regionName} el ${dateStr} a las ${timeStr}.`;

  // Guardar en historial local (sin almacenar archivos gigantes en localStorage, pero enviándolos completos a Google Drive)
  const localFilesMeta = (filesUploaded || []).map(f => ({ name: f.name, sizeKB: f.sizeKB }));

  const submissionRecord = {
    id: `SUB-M${modNumber}-${Date.now()}`,
    timestamp: `${dateStr} ${timeStr}`,
    modNumber,
    moduleType: moduleTitle,
    regionId: currentSession.regionId,
    regionName: currentSession.regionName,
    subregionId: `REG-${currentSession.regionId}`,
    subregionName: currentSession.regionName,
    personName: currentSession.personName,
    personRole: currentSession.personRole,
    personEmail: currentSession.personEmail,
    signatureDataUrl,
    driveFolderTarget: driveFolderTarget || '',
    filesUploaded: localFilesMeta,
    notes: notes || '',
    adminEmailText: adminEmailMessage,
    userEmailText: userReceiptMessage,
    snapshot: snapshot || []
  };

  appState.submissions.unshift(submissionRecord);
  if (modNumber === 1) lock.mod1Locked = true;
  if (modNumber === 2) lock.mod2Locked = true;
  if (modNumber === 3) lock.mod3Locked = true;

  saveStateToStorage();

  // Enviar a Google Drive / Sheets / Gmail con los archivos completos en Base64
  sendSubmissionToGoogleCloud({
    ...submissionRecord,
    filesWithContent: filesUploaded || []
  });

  closeActiveModuleView();
  showToast(`✅ Información enviada correctamente. Se bloqueó el módulo para ${currentSession.regionName} y se emitieron las notificaciones.`);
}

function saveDraftToLocal(notify = true) {
  saveStateToStorage();
  if (notify) {
    showToast('💾 Avance guardado correctamente. Puede cerrar sesión o continuar más tarde sin perder sus respuestas.');
  }
}

/* ==========================================================================
   CANVAS DE FIRMA DIGITAL
   ========================================================================== */
function initSignatureCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = '#0B5345';
  ctx.lineWidth = 2.6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  let drawing = false;

  function getPos(evt) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
    const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  function start(evt) {
    evt.preventDefault();
    drawing = true;
    signaturePads[canvasId].hasDrawn = true;
    const pos = getPos(evt);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function move(evt) {
    if (!drawing) return;
    evt.preventDefault();
    const pos = getPos(evt);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }

  function end() {
    drawing = false;
  }

  canvas.addEventListener('mousedown', start);
  canvas.addEventListener('mousemove', move);
  window.addEventListener('mouseup', end);

  canvas.addEventListener('touchstart', start, { passive: false });
  canvas.addEventListener('touchmove', move, { passive: false });
  window.addEventListener('touchend', end);
}

function clearSignatureCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  signaturePads[canvasId].hasDrawn = false;
}

/* ==========================================================================
   PANEL DE CONTROL
   ========================================================================== */
function renderAdminRegionSidebar() {
  const list = document.getElementById('adminRegionFilterList');
  if (!list) return;

  const allBtn = `
    <button
      type="button"
      class="region-filter-btn ${appState.adminSelectedRegion === 'ALL' ? 'active' : ''}"
      onclick="selectAdminRegionFilter('ALL')"
    >
      <span>🌎 Todas las Regiones</span>
      <span>I – X</span>
    </button>
  `;

  const regBtns = REGIONS_CATALOG.map(reg => {
    const isActive = appState.adminSelectedRegion === reg.id;
    return `
      <button
        type="button"
        class="region-filter-btn ${isActive ? 'active' : ''}"
        onclick="selectAdminRegionFilter('${reg.id}')"
      >
        <span>${reg.name}</span>
      </button>
    `;
  }).join('');

  list.innerHTML = allBtn + regBtns;
}

function selectAdminRegionFilter(regionId) {
  appState.adminSelectedRegion = regionId;
  renderAdminRegionSidebar();
  renderAdminDashboard();
}

function renderAdminDashboard() {
  const regionFilter = appState.adminSelectedRegion;
  const activeExcelMod = document.getElementById('adminExcelModuleFilter')?.value || 'MOD1';
  const activeDatasetForYears = activeExcelMod === 'MOD1' ? appState.mod1Licenses : appState.mod2Licenses;
  const yearFilter = syncModuleYearDropdown('adminYearFilter', activeDatasetForYears);

  const statusBadge = document.getElementById('excelLoadedStatusBadge');
  if (statusBadge) {
    const totalInMod = activeExcelMod === 'MOD1' ? appState.mod1Licenses.length : appState.mod2Licenses.length;
    if (totalInMod > 0) {
      statusBadge.innerHTML = `📊 Libro activo: <strong>${totalInMod} registros</strong> en ${activeExcelMod === 'MOD1' ? 'Módulo 1' : 'Módulo 2'}`;
      statusBadge.style.color = '#DCE775';
    } else {
      statusBadge.innerHTML = `⚪ Sin libro cargado (0 registros en ${activeExcelMod === 'MOD1' ? 'Módulo 1' : 'Módulo 2'})`;
      statusBadge.style.color = '#FFCCBC';
    }
  }

  const regionObj = REGIONS_CATALOG.find(r => r.id === regionFilter);
  document.getElementById('adminMainHeading').textContent = regionObj
    ? `Tablero de Control · ${regionObj.name}`
    : 'Tablero de Control Nacional · Todas las Regiones (I a X)';

  document.getElementById('adminMainSubheading').textContent = activeExcelMod === 'MOD1'
    ? 'Vista enfocada en Módulo 1 (Regiones I a X): Control de Licencias sin información digital'
    : 'Vista enfocada en Módulo 2 (Regiones I a X): Control de Licencias sin polígono digital';

  const filteredRegions = regionFilter === 'ALL'
    ? REGIONS_CATALOG
    : REGIONS_CATALOG.filter(r => r.id === regionFilter);

  if (activeExcelMod === 'MOD1') {
    const list = appState.mod1Licenses.filter(l => {
      const mReg = regionFilter === 'ALL' || l.regionId === regionFilter;
      const mYr = yearFilter === 'ALL' || String(l.year) === String(yearFilter);
      return mReg && mYr;
    });
    const total = list.length;
    const siCount = list.filter(l => l.emitida === 'Sí').length;
    const noCount = list.filter(l => l.emitida === 'No').length;
    const answered = siCount + noCount;
    const pct = total > 0 ? Math.round((answered / total) * 100) : 0;

    document.getElementById('adminKpiGrid').innerHTML = `
      <div class="kpi-card" style="border-left-color: var(--c-ocean);">
        <small>Total Licencias (Mód. 1)</small>
        <strong>${total}</strong>
        <span>${answered} verificadas (${pct}%)</span>
      </div>
      <div class="kpi-card" style="border-left-color: #7CB342;">
        <small>Emitidas (Sí)</small>
        <strong>${siCount}</strong>
        <span>Confirmadas por sede regional</span>
      </div>
      <div class="kpi-card" style="border-left-color: #C62828;">
        <small>No Emitidas (No)</small>
        <strong>${noCount}</strong>
        <span>Sin emisión / Error correlativo</span>
      </div>
    `;

    document.getElementById('chartCatTitle').textContent = 'Módulo 1: ¿La licencia fue emitida? (Sí / No)';
    renderCategoryBarsChart(MOD1_CATEGORIES.map(c => ({
      label: c.label,
      color: c.color,
      count: list.filter(l => l.emitida === c.key).length
    })), total);
  } else {
    const list = appState.mod2Licenses.filter(l => {
      const mReg = regionFilter === 'ALL' || l.regionId === regionFilter;
      const mYr = yearFilter === 'ALL' || String(l.year) === String(yearFilter);
      return mReg && mYr;
    });
    const total = list.length;
    const regCount = list.filter(l => l.disponibilidad === 'En Región').length;
    const subCount = list.filter(l => l.disponibilidad === 'En Subregión').length;
    const noDispCount = list.filter(l => l.disponibilidad === 'No disponible').length;
    const answered = regCount + subCount + noDispCount;
    const pct = total > 0 ? Math.round((answered / total) * 100) : 0;

    document.getElementById('adminKpiGrid').innerHTML = `
      <div class="kpi-card" style="border-left-color: var(--c-ocean);">
        <small>Total Expedientes (Mód. 2)</small>
        <strong>${total}</strong>
        <span>${answered} verificados (${pct}%)</span>
      </div>
      <div class="kpi-card" style="border-left-color: #99C000;">
        <small>En Región</small>
        <strong>${regCount}</strong>
        <span>Disponibles en sede regional</span>
      </div>
      <div class="kpi-card" style="border-left-color: #009900;">
        <small>En Subregión</small>
        <strong>${subCount}</strong>
        <span>Disponibles en subregión</span>
      </div>
      <div class="kpi-card" style="border-left-color: #E13F3F;">
        <small>No Disponible</small>
        <strong>${noDispCount}</strong>
        <span>Sin expediente físico</span>
      </div>
    `;

    document.getElementById('chartCatTitle').textContent = 'Módulo 2: Disponibilidad de Expediente Físico';
    renderCategoryBarsChart(MOD2_CATEGORIES.map(c => ({
      label: c.label,
      color: c.color,
      count: list.filter(l => l.disponibilidad === c.key).length
    })), total);
  }

  renderSubregionProgressChart(filteredRegions);
  renderSubregionTripleStatusTable(filteredRegions);
  renderSubmissionsHistoryTable(regionFilter);
}

function renderCategoryBarsChart(items, totalCount) {
  const barsContainer = document.getElementById('categoryBarsContainer');
  const labelsContainer = document.getElementById('categoryLabelsContainer');
  const safeTotal = totalCount || 1;
  const maxVal = Math.max(...items.map(i => i.count), 1);

  barsContainer.innerHTML = items.map(item => {
    const pct = Math.round((item.count / safeTotal) * 100);
    const heightPct = Math.max(Math.round((item.count / maxVal) * 85), 6);
    return `
      <div class="v-bar-col" title="${item.label}: ${item.count} (${pct}%)">
        <div class="v-bar-value">${item.count} (${pct}%)</div>
        <div class="v-bar-fill" style="height: ${heightPct}%; background: ${item.color};"></div>
      </div>
    `;
  }).join('');

  labelsContainer.innerHTML = items.map(item => `
    <div class="v-bar-label-item">
      <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${item.color};margin-right:4px;"></span>
      ${item.label}
    </div>
  `).join('');
}

function renderSubregionProgressChart(regionsList) {
  const barsContainer = document.getElementById('subregionBarsContainer');
  const labelsContainer = document.getElementById('subregionLabelsContainer');

  const metrics = regionsList.map(reg => {
    const lk = getRegionLockState(reg.id);
    const doneCount = (lk.mod1Locked ? 1 : 0) + (lk.mod2Locked ? 1 : 0) + (lk.mod3Locked ? 1 : 0);
    const pct = Math.round((doneCount / 3) * 100);
    return { id: `Reg. ${reg.id}`, name: reg.name, pct };
  });

  const palette = ['#7CB342', '#17A589', '#0E6251', '#1A5276', '#3498DB', '#196F3D', '#AFB42B'];

  barsContainer.innerHTML = metrics.map((m, idx) => {
    const color = palette[idx % palette.length];
    return `
      <div class="v-bar-col" title="${m.name}: ${m.pct}%">
        <div class="v-bar-value">${m.pct}%</div>
        <div class="v-bar-fill" style="height: ${Math.max(m.pct, 6)}%; background: linear-gradient(180deg, ${color}, #0B5345);"></div>
      </div>
    `;
  }).join('');

  labelsContainer.innerHTML = metrics.map(m => `<div class="v-bar-label-item">${m.id}</div>`).join('');
}

function renderSubregionTripleStatusTable(regionsList) {
  const tbody = document.getElementById('adminSubregionStatusBody');

  tbody.innerHTML = regionsList.map(reg => {
    const lk = getRegionLockState(reg.id);

    const b1 = lk.mod1Locked
      ? `<span class="status-pill completed">🔒 Completado</span>`
      : `<span class="status-pill available">⚪ Pendiente</span>`;

    const b2 = lk.mod2Locked
      ? `<span class="status-pill completed">🔒 Completado</span>`
      : `<span class="status-pill available">⚪ Pendiente</span>`;

    const b3 = lk.mod3Locked
      ? `<span class="status-pill completed">🔒 Completado</span>`
      : `<span class="status-pill available">⚪ Pendiente</span>`;

    const anyLocked = lk.mod1Locked || lk.mod2Locked || lk.mod3Locked;

    return `
      <tr>
        <td><strong>${reg.name}</strong></td>
        <td class="center">${b1}</td>
        <td class="center">${b2}</td>
        <td class="center">${b3}</td>
        <td class="center">
          ${anyLocked ? `
            <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;">
              ${lk.mod1Locked ? `<button type="button" class="btn-warning" onclick="unlockRegionModule('${reg.id}', 1)">🔓 Desbloq. M1</button>` : ''}
              ${lk.mod2Locked ? `<button type="button" class="btn-warning" style="background:var(--c-ocean);" onclick="unlockRegionModule('${reg.id}', 2)">🔓 Desbloq. M2</button>` : ''}
              ${lk.mod3Locked ? `<button type="button" class="btn-warning" style="background:var(--c-teal-dark);" onclick="unlockRegionModule('${reg.id}', 3)">🔓 Desbloq. M3</button>` : ''}
            </div>
          ` : `<small style="color:var(--text-muted);">Habilitada</small>`}
        </td>
      </tr>
    `;
  }).join('');
}

function unlockRegionModule(regionId, modNum) {
  const lk = getRegionLockState(regionId);
  if (modNum === 1) lk.mod1Locked = false;
  if (modNum === 2) lk.mod2Locked = false;
  if (modNum === 3) lk.mod3Locked = false;

  saveStateToStorage();
  renderAdminDashboard();
  if (currentSession.authenticated && currentSession.regionId === regionId) {
    refreshModulesCardsState();
    renderModule1Table();
    renderModule2Table();
    updateModule3State();
  }
  showToast(`🔓 Módulo ${modNum} desbloqueado para Región ${regionId}. Los envíos anteriores se conservan en el historial.`);
}

function renderSubmissionsHistoryTable(regionFilter) {
  const tbody = document.getElementById('adminHistoryTableBody');
  const list = appState.submissions.filter(s => regionFilter === 'ALL' || s.regionId === regionFilter);

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="center" style="padding: 24px; color: var(--text-muted);">
          Aún no hay envíos registrados para este filtro.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = list.map(sub => `
    <tr>
      <td><strong>${sub.timestamp}</strong></td>
      <td><strong>${sub.moduleType}</strong></td>
      <td><strong>${sub.regionName}</strong></td>
      <td><strong>${sub.personName}</strong> (${sub.personRole})</td>
      <td><code>${sub.personEmail}</code></td>
      <td class="center">
        <button type="button" class="btn-secondary" style="padding: 6px 11px; font-size: 0.78rem;" onclick="inspectSubmissionDetail('${sub.id}')">
          👁️ Ver Firma y Correo
        </button>
      </td>
      <td class="center">
        <button type="button" class="btn-danger" onclick="deleteSubmissionManually('${sub.id}')">
          🗑️ Eliminar
        </button>
      </td>
    </tr>
  `).join('');
}

function inspectSubmissionDetail(submissionId) {
  const sub = appState.submissions.find(s => s.id === submissionId);
  if (!sub) return;

  document.getElementById('modalSubmissionTitle').textContent =
    `Respaldo de Envío · ${sub.regionName} (${sub.timestamp})`;

  document.getElementById('modalSubmissionBody').innerHTML = `
    <div style="display:grid;gap:16px;">
      <div style="padding:14px;border-radius:10px;background:#EBF7F4;border-left:4px solid var(--c-pine);">
        <strong>📧 Notificación enviada al Administrador:</strong><br>
        <em>"${sub.adminEmailText}"</em>
      </div>

      <div style="padding:14px;border-radius:10px;background:#EBF5FB;border-left:4px solid var(--c-ocean);">
        <strong>📩 Constancia enviada a ${sub.personEmail}:</strong><br>
        <em>"${sub.userEmailText}"</em>
        <div style="margin-top:12px;padding-top:10px;border-top:1px solid #CFE2DC;">
          <img src="firma_correo_optimizada.png" alt="Firma Institucional Pie de Correo" style="width:100%;max-width:540px;height:auto;display:block;border-radius:6px;" />
        </div>
      </div>

      <div class="signature-only-card" style="max-width:100%;">
        <h4>✍️ Firma Digital Registrada en Validación de Envío</h4>
        <img src="${sub.signatureDataUrl}" alt="Firma digital" style="width:100%;height:180px;object-fit:contain;background:#fff;border:1px solid var(--border-line);border-radius:8px;" />
      </div>

      ${sub.filesUploaded && sub.filesUploaded.length ? `
        <div>
          <strong>📦 Archivos de Polígonos cargados (${sub.driveFolderTarget}):</strong>
          <ul>
            ${sub.filesUploaded.map(f => `<li>${f.name} (${f.sizeKB} KB)</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    </div>
  `;

  document.getElementById('submissionDetailModal').classList.add('open');
}

function closeSubmissionModal() {
  document.getElementById('submissionDetailModal').classList.remove('open');
}

function deleteSubmissionManually(submissionId) {
  appState.submissions = appState.submissions.filter(s => s.id !== submissionId);
  saveStateToStorage();
  renderAdminDashboard();
  showToast('🗑️ Registro eliminado manualmente.');
}

/* ==========================================================================
   IMPORTACIÓN Y EXPORTACIÓN DE LIBRO DE EXCEL (10 REGIONES: I A X)
   ========================================================================== */
function normalizeRegionIdValue(rawVal, fallbackId) {
  const clean = String(rawVal || '').trim().toUpperCase();
  if (!clean) return fallbackId;
  const arabicToRoman = { '1': 'I', '2': 'II', '3': 'III', '4': 'IV', '5': 'V', '6': 'VI', '7': 'VII', '8': 'VIII', '9': 'IX', '10': 'X' };
  if (arabicToRoman[clean]) return arabicToRoman[clean];
  for (const [num, rom] of Object.entries(arabicToRoman)) {
    if (clean === `REGION ${num}` || clean === `REGIÓN ${num}` || clean === `REG-${num}` || clean === `REG ${num}`) {
      return rom;
    }
  }
  for (const reg of REGIONS_CATALOG) {
    if (
      reg.id.toUpperCase() === clean ||
      `REG-${reg.id}` === clean ||
      `REGION ${reg.id}` === clean ||
      `REGIÓN ${reg.id}` === clean ||
      reg.name.toUpperCase() === clean ||
      clean.startsWith(`${reg.id}-`)
    ) {
      return reg.id;
    }
  }
  return clean;
}

function findRegionAndSubregionBySheetName(sheetName) {
  const clean = String(sheetName).trim().toUpperCase();
  const arabicToRoman = { '1': 'I', '2': 'II', '3': 'III', '4': 'IV', '5': 'V', '6': 'VI', '7': 'VII', '8': 'VIII', '9': 'IX', '10': 'X' };
  for (const [num, rom] of Object.entries(arabicToRoman)) {
    if (clean === num || clean === `REGION ${num}` || clean === `REGIÓN ${num}` || clean === `REG-${num}` || clean === `REG ${num}`) {
      return { regionId: rom, subregionId: `REG-${rom}` };
    }
  }

  // 1. Coincidencia exacta por ID de Región ('I'..'X', 'REG-I'..'REG-X', o prefijo 'V-1' -> 'V')
  for (const reg of REGIONS_CATALOG) {
    if (
      reg.id.toUpperCase() === clean ||
      `REG-${reg.id}` === clean ||
      `REGION ${reg.id}` === clean ||
      `REGIÓN ${reg.id}` === clean ||
      reg.name.toUpperCase() === clean ||
      clean.startsWith(`${reg.id}-`)
    ) {
      return { regionId: reg.id, subregionId: `REG-${reg.id}` };
    }
  }

  // 2. Coincidencia por nombre descriptivo de la Región
  if (clean.length >= 4) {
    for (const reg of REGIONS_CATALOG) {
      if (reg.name.toUpperCase().includes(clean)) {
        return { regionId: reg.id, subregionId: `REG-${reg.id}` };
      }
    }
  }

  return { regionId: 'I', subregionId: 'REG-I' };
}

function handleImportExcelFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const targetMod = document.getElementById('adminExcelModuleFilter')?.value || 'MOD1';

  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      let importedRecords = [];

      workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
        const mappedLoc = findRegionAndSubregionBySheetName(sheetName);

        rows.forEach((r, idx) => {
          const regionId = normalizeRegionIdValue(r.Region || r.Región, mappedLoc.regionId);
          const subregionId = `REG-${regionId}`;

          if (targetMod === 'MOD1') {
            importedRecords.push({
              id: `M1-IMP-${Date.now()}-${sheetName}-${idx}`,
              regionId,
              subregionId,
              no: Number(r.No || r['No.'] || idx + 1),
              year: Number(r.Año || r.Anio || 2017),
              correlativo: String(r['Correlativo licencia'] || r.Correlativo || (idx + 1)),
              emitida: String(r['¿La licencia fue emitida?'] || r.Emitida || ''),
              subregion: String(r.Subregión || r.Subregion || ''),
              expediente: String(r.Expediente || ''),
              resolucion: String(r['Resolución de Licencia'] || r['Resolución Licencia'] || r.Resolucion || ''),
              fechaAprobacion: String(r['Fecha de aprobación'] || r.Fecha || ''),
              titular: String(r.Titular || ''),
              representante: String(r.Representante || ''),
              tipoLicencia: String(r['Tipo de Licencia'] || r['Tipo de licencia'] || ''),
              departamento: String(r.Departamento || ''),
              municipio: String(r.Municipio || ''),
              areaObligacion: String(r['Área de obligación'] || r.Area || ''),
              areaProduccion: String(r['Área de producción'] || ''),
              volumen: String(r.Volumen || ''),
              tratamientoSilvicultural: String(r['Tratamiento silvicultural'] || ''),
              especies: String(r.Especies || ''),
              obs: String(r.Observación || r.Observaciones || '')
            });
          } else {
            importedRecords.push({
              id: `M2-IMP-${Date.now()}-${sheetName}-${idx}`,
              regionId,
              subregionId,
              no: Number(r.No || r['No.'] || idx + 1),
              subregion: String(r.Subregión || r.Subregion || r['Subregión'] || '').trim(),
              resolucion: String(r['Resolución Licencia'] || r.Resolucion || ''),
              expediente: String(r.Expediente || ''),
              titular: String(r.Titular || ''),
              year: Number(r.Año || r.Anio || 2017),
              area: Number(r['Área (Ha)'] || r.Area || r['Área'] || 0),
              disponibilidad: String(r['Estado de disponibilidad del expediente físico'] || r.Disponibilidad || ''),
              obs: String(r.Observaciones || r.Observación || '')
            });
          }
        });
      });

      if (!importedRecords.length) {
        showToast('⚠️ El libro de Excel no contiene filas válidas.');
        return;
      }

      if (targetMod === 'MOD1') {
        appState.mod1Licenses = importedRecords;
        appState.mod1ClearedByAdmin = false;
      } else {
        appState.mod2Licenses = importedRecords;
        appState.mod2ClearedByAdmin = false;
      }

      saveStateToStorage();
      renderAdminDashboard();
      if (currentSession.authenticated) {
        renderModule1Table();
        renderModule2Table();
      }
      event.target.value = '';
      showToast(`📥 Se importaron ${importedRecords.length} registros desde ${workbook.SheetNames.length} hoja(s) para ${targetMod === 'MOD1' ? 'Módulo 1' : 'Módulo 2'}.`);
    } catch (err) {
      console.error(err);
      event.target.value = '';
      showToast('❌ Error procesando el libro de Excel.');
    }
  };
  reader.readAsArrayBuffer(file);
}

function clearUploadedExcelModule() {
  const targetMod = document.getElementById('adminExcelModuleFilter')?.value || 'MOD1';
  const modLabel = targetMod === 'MOD1'
    ? 'Módulo 1 (Sin información digital)'
    : 'Módulo 2 (Sin polígono digital)';

  const previousCount = targetMod === 'MOD1' ? appState.mod1Licenses.length : appState.mod2Licenses.length;

  if (targetMod === 'MOD1') {
    appState.mod1Licenses = [];
    appState.mod1ClearedByAdmin = true;
  } else {
    appState.mod2Licenses = [];
    appState.mod2ClearedByAdmin = true;
  }

  const fileInput = document.getElementById('excelUploadInput');
  if (fileInput) fileInput.value = '';

  saveStateToStorage();
  renderAdminDashboard();
  if (currentSession.authenticated) {
    renderModule1Table();
    renderModule2Table();
  }
  showToast(`🗑️ Se eliminaron los ${previousCount} registros cargados en ${modLabel}. Ahora está en 0.`);
}

function exportConsolidatedExcel() {
  if (typeof XLSX === 'undefined') return;
  const targetMod = document.getElementById('adminExcelModuleFilter')?.value || 'MOD1';
  const wb = XLSX.utils.book_new();

  if (targetMod === 'MOD1') {
    const rows = appState.mod1Licenses.map(l => ({
      Región: l.regionId,
      'No.': l.no,
      Año: l.year,
      'Correlativo licencia': l.correlativo,
      '¿La licencia fue emitida?': l.emitida || 'PENDIENTE',
      Subregión: l.emitida === 'Sí' ? (l.subregion || '') : '',
      Expediente: l.emitida === 'Sí' ? (l.expediente || '') : '',
      'Resolución de Licencia': l.emitida === 'Sí' ? (l.resolucion || '') : '',
      'Fecha de aprobación': l.emitida === 'Sí' ? (l.fechaAprobacion || '') : '',
      Titular: l.emitida === 'Sí' ? (l.titular || '') : '',
      Representante: l.emitida === 'Sí' ? (l.representante || '') : '',
      'Tipo de Licencia': l.emitida === 'Sí' ? (l.tipoLicencia || '') : '',
      Departamento: l.emitida === 'Sí' ? (l.departamento || '') : '',
      Municipio: l.emitida === 'Sí' ? (l.municipio || '') : '',
      'Área de obligación': l.emitida === 'Sí' ? (l.areaObligacion || '') : '',
      'Área de producción': l.emitida === 'Sí' ? (l.areaProduccion || '') : '',
      Volumen: l.emitida === 'Sí' ? (l.volumen || '') : '',
      'Tratamiento silvicultural': l.emitida === 'Sí' ? (l.tratamientoSilvicultural || '') : '',
      Especies: l.emitida === 'Sí' ? (l.especies || '') : '',
      Observación: l.obs || ''
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), 'Consolidado_Modulo_1');
    XLSX.writeFile(wb, `Consolidado_Modulo1_Sin_Info_Digital_${new Date().toISOString().slice(0, 10)}.xlsx`);
  } else {
    const rows = appState.mod2Licenses.map(l => ({
      Región: l.regionId,
      'No.': l.no,
      Subregión: l.subregion || '',
      'Resolución Licencia': l.resolucion,
      Expediente: l.expediente,
      Titular: l.titular,
      Año: l.year,
      'Área (Ha)': l.area,
      'Estado de disponibilidad del expediente físico': l.disponibilidad || 'PENDIENTE',
      Observaciones: l.obs || ''
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), 'Consolidado_Modulo_2');
    XLSX.writeFile(wb, `Consolidado_Modulo2_Sin_Poligono_Digital_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  showToast('📤 Consolidado Excel descargado correctamente.');
}

function downloadExcelTemplate() {
  if (typeof XLSX === 'undefined') return;
  const targetMod = document.getElementById('adminExcelModuleFilter')?.value || 'MOD1';
  const wb = XLSX.utils.book_new();

  REGIONS_CATALOG.forEach(reg => {
    const sheetName = `REG-${reg.id}`;
    if (targetMod === 'MOD1') {
      const sampleRows = [
        { 'No.': 1, Región: reg.id, Año: 2016, 'Correlativo licencia': `LF-${reg.id}-001`, '¿La licencia fue emitida?': '', Observación: '' },
        { 'No.': 2, Región: reg.id, Año: 2017, 'Correlativo licencia': `LF-${reg.id}-002`, '¿La licencia fue emitida?': '', Observación: '' }
      ];
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sampleRows), sheetName);
    } else {
      const sampleRows = [
        { 'No.': 1, Región: reg.id, Subregión: `${reg.id}-1`, 'Resolución Licencia': `RES-${reg.id}-2016-01`, Expediente: `EXP-${reg.id}-001`, Titular: 'Ejemplo Titular', Año: 2016, 'Área (Ha)': 15.0, 'Estado de disponibilidad del expediente físico': '', Observaciones: '' }
      ];
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sampleRows), sheetName);
    }
  });

  XLSX.writeFile(wb, `Plantilla_10_Regiones_${targetMod}.xlsx`);
}

/* ==========================================================================
   DESCARGA DE LISTADO EN PDF PARA BÚSQUEDA EN ARCHIVO FÍSICO (MÓDULOS 1 Y 2)
   ========================================================================== */
function downloadModulePdfForArchive(modNumber) {
  const regionName = currentSession.regionName || `Región ${currentSession.regionId || ''}`;
  const regionId = currentSession.regionId || 'I';
  const nowStr = new Date().toLocaleString('es-GT', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  let filteredRows = [];
  let filterSummary = [];
  let moduleTitle = '';
  let fileName = '';

  if (modNumber === 1) {
    moduleTitle = 'MÓDULO 1: CONTROL DE LICENCIAS SIN INFORMACIÓN DIGITAL (BÚSQUEDA EN ARCHIVO)';
    const list = getMod1LicensesForCurrentSession();
    const yearFilter = document.getElementById('mod1YearFilter')?.value || 'ALL';
    const statusFilter = document.getElementById('mod1StatusFilter')?.value || 'ALL';
    const search = (document.getElementById('mod1SearchInput')?.value || '').toLowerCase().trim();

    filterSummary.push(yearFilter === 'ALL' ? 'Año: Todos' : `Año: ${yearFilter}`);
    filterSummary.push(
      statusFilter === 'PENDING'
        ? 'Estado: Solo pendientes'
        : statusFilter === 'ANSWERED'
        ? 'Estado: Solo respondidos'
        : 'Estado: Todos'
    );
    if (search) filterSummary.push(`Búsqueda: "${search}"`);

    filteredRows = list.filter(item => {
      const matchYear = yearFilter === 'ALL' || String(item.year) === String(yearFilter);
      const isDone = isMod1RowComplete(item);
      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'PENDING' && !isDone) ||
        (statusFilter === 'ANSWERED' && isDone);
      const matchSearch =
        !search ||
        String(item.correlativo).toLowerCase().includes(search) ||
        String(item.year).toLowerCase().includes(search) ||
        String(item.expediente || '').toLowerCase().includes(search) ||
        String(item.resolucion || '').toLowerCase().includes(search) ||
        String(item.titular || '').toLowerCase().includes(search) ||
        String(item.obs || '').toLowerCase().includes(search);
      return matchYear && matchStatus && matchSearch;
    });

    const yrSlug = yearFilter === 'ALL' ? 'Todos_Anios' : `Anio_${yearFilter}`;
    fileName = `Listado_Archivo_Modulo1_Region_${regionId}_${yrSlug}.pdf`;
  } else {
    moduleTitle = 'MÓDULO 2: CONTROL DE LICENCIAS SIN POLÍGONO DIGITAL (VERIFICACIÓN EN ARCHIVO)';
    const list = getMod2LicensesForCurrentSession();
    const subregionFilter = document.getElementById('mod2SubregionFilter')?.value || 'ALL';
    const yearFilter = document.getElementById('mod2YearFilter')?.value || 'ALL';
    const statusFilter = document.getElementById('mod2StatusFilter')?.value || 'ALL';
    const search = (document.getElementById('mod2SearchInput')?.value || '').toLowerCase().trim();

    filterSummary.push(
      subregionFilter === 'ALL'
        ? 'Subregión: Todas'
        : subregionFilter === '__EMPTY__'
        ? 'Subregión: Sin especificar'
        : `Subregión: ${subregionFilter}`
    );
    filterSummary.push(yearFilter === 'ALL' ? 'Año: Todos' : `Año: ${yearFilter}`);
    filterSummary.push(
      statusFilter === 'PENDING'
        ? 'Estado: Solo pendientes'
        : statusFilter === 'ANSWERED'
        ? 'Estado: Solo respondidos'
        : 'Estado: Todos'
    );
    if (search) filterSummary.push(`Búsqueda: "${search}"`);

    filteredRows = list.filter(item => {
      const itemSub = String(item.subregion || '').trim();
      const matchSub =
        subregionFilter === 'ALL' ||
        (subregionFilter === '__EMPTY__' ? itemSub === '' : itemSub === subregionFilter);
      const matchYear = yearFilter === 'ALL' || String(item.year) === String(yearFilter);
      const isAnswered = Boolean(item.disponibilidad);
      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'PENDING' && !isAnswered) ||
        (statusFilter === 'ANSWERED' && isAnswered);
      const matchSearch =
        !search ||
        itemSub.toLowerCase().includes(search) ||
        String(item.resolucion || '').toLowerCase().includes(search) ||
        String(item.expediente || '').toLowerCase().includes(search) ||
        String(item.titular || '').toLowerCase().includes(search) ||
        String(item.year || '').toLowerCase().includes(search) ||
        String(item.obs || '').toLowerCase().includes(search);
      return matchSub && matchYear && matchStatus && matchSearch;
    });

    const subSlug = subregionFilter === 'ALL' ? 'Todas_Subregiones' : `Sub_${subregionFilter.replace(/[^a-zA-Z0-9_-]/g, '')}`;
    const yrSlug = yearFilter === 'ALL' ? 'Todos_Anios' : `Anio_${yearFilter}`;
    fileName = `Listado_Archivo_Modulo2_Region_${regionId}_${subSlug}_${yrSlug}.pdf`;
  }

  if (filteredRows.length === 0) {
    showToast('⚠️ No hay registros en la vista actual para exportar a PDF.');
    return;
  }

  const jspdfNs = window.jspdf;
  if (!jspdfNs || !jspdfNs.jsPDF) {
    window.print();
    return;
  }

  const doc = new jspdfNs.jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'letter'
  });

  // Encabezado Institucional
  doc.setFillColor(11, 83, 69);
  doc.rect(10, 8, 259, 18, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('SISTEMA DE VERIFICACIÓN DE OBLIGACIONES DE REPOBLACIÓN FORESTAL REGIONAL', 14, 14.5);
  doc.setFontSize(9.2);
  doc.setFont('helvetica', 'normal');
  doc.text(moduleTitle, 14, 21.5);

  // Metadatos del listado impreso
  doc.setTextColor(27, 38, 49);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.8);
  doc.text(`Región: ${regionName}`, 10, 31.5);
  doc.text(`Total registros en listado: ${filteredRows.length}`, 115, 31.5);
  doc.text(`Fecha impresión: ${nowStr}`, 200, 31.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.text(`Filtros aplicados: ${filterSummary.join('  |  ')}   ·   Responsable en sesión: ${currentSession.personName || '—'}`, 10, 36.5);

  let head = [];
  let body = [];
  let columnStyles = {};

  if (modNumber === 1) {
    head = [[
      'No.',
      'Año',
      'Correlativo licencia',
      'Observaciones'
    ]];

    body = filteredRows.map((lic, idx) => [
      lic.no || idx + 1,
      lic.year,
      lic.correlativo,
      lic.obs || ''
    ]);

    columnStyles = {
      0: { cellWidth: 22, halign: 'center' },
      1: { cellWidth: 28, halign: 'center' },
      2: { cellWidth: 48, halign: 'center', fontStyle: 'bold' },
      3: { cellWidth: 161 }
    };
  } else {
    head = [[
      'No.',
      'Subregión',
      'Resolución Licencia',
      'Expediente',
      'Titular',
      'Año',
      'Área (Ha)',
      'Observaciones'
    ]];

    body = filteredRows.map((lic, idx) => [
      lic.no || idx + 1,
      lic.subregion || '—',
      lic.resolucion || '—',
      lic.expediente || '—',
      lic.titular || '—',
      lic.year,
      Number(lic.area || 0).toFixed(2),
      lic.obs || ''
    ]);

    columnStyles = {
      0: { cellWidth: 14, halign: 'center' },
      1: { cellWidth: 22, halign: 'center', fontStyle: 'bold' },
      2: { cellWidth: 42, fontStyle: 'bold' },
      3: { cellWidth: 36 },
      4: { cellWidth: 58 },
      5: { cellWidth: 15, halign: 'center' },
      6: { cellWidth: 20, halign: 'right' },
      7: { cellWidth: 52 }
    };
  }

  const footerRegionText = `Instituto Nacional de Bosques - ${regionName.replace('–', '-')}`;

  doc.autoTable({
    startY: 40,
    head,
    body,
    theme: 'grid',
    margin: { top: 18, right: 10, bottom: 16, left: 10 },
    styles: {
      fontSize: modNumber === 1 ? 8.5 : 8,
      cellPadding: modNumber === 1 ? 3 : 2.4,
      lineColor: [189, 195, 199],
      lineWidth: 0.2,
      textColor: [27, 38, 49],
      valign: 'middle'
    },
    headStyles: {
      fillColor: modNumber === 1 ? [14, 98, 81] : [26, 82, 118],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
      fontSize: modNumber === 1 ? 8.8 : 8.2
    },
    alternateRowStyles: {
      fillColor: [248, 251, 249]
    },
    columnStyles,
    didDrawPage: function (data) {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(100, 110, 115);
      doc.text(
        footerRegionText,
        10,
        208
      );
      doc.text(
        `Página ${data.pageNumber} de ${pageCount}`,
        245,
        208
      );
    }
  });

  doc.save(fileName);
  showToast(`🖨️ Listado PDF generado (${filteredRows.length} registros) listo para imprimir y llevar a archivo.`);
}

function loadSampleSubmissionsForDemo() {
  const lkReg1 = getRegionLockState('I');
  lkReg1.mod1Locked = true;
  lkReg1.mod2Locked = true;
  lkReg1.mod3Locked = true;

  const dummyCanvas = document.createElement('canvas');
  dummyCanvas.width = 400;
  dummyCanvas.height = 140;
  const ctx = dummyCanvas.getContext('2d');
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 400, 140);
  ctx.strokeStyle = '#0B5345';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(50, 95);
  ctx.bezierCurveTo(130, 25, 210, 125, 330, 55);
  ctx.stroke();

  appState.submissions.unshift({
    id: 'SUB-DEMO-' + Date.now(),
    timestamp: '25/10/2026 09:55:06 a. m.',
    modNumber: 1,
    moduleType: 'Control de Licencias sin Información Digital (Módulo 1)',
    regionId: 'I',
    regionName: 'Región I – Metropolitana',
    subregionId: 'REG-I',
    subregionName: 'Región I – Metropolitana',
    personName: 'Fatima Callejas',
    personRole: 'Consultor',
    personEmail: 'fcallejas.inab.2026@gmail.com',
    signatureDataUrl: dummyCanvas.toDataURL(),
    adminEmailText: 'Formulario Control de Licencias sin Información Digital (Módulo 1), La Región I – Metropolitana ha completado el formulario el 25/10/2026 a las 09:55:06 a. m. a nombre de Fatima Callejas (Consultor).',
    userEmailText: 'Constancia de recepción enviada a fcallejas.inab.2026@gmail.com.'
  });

  saveStateToStorage();
  renderAdminDashboard();
  showToast('✨ Envíos de ejemplo cargados.');
}

function openCloudConfigModal() {
  document.getElementById('gasWebhookUrlInput').value = appState.cloudConfig.gasWebhookUrl || '';
  document.getElementById('adminNotifyEmailInput').value = appState.cloudConfig.adminNotifyEmail || '';
  document.getElementById('cloudConfigModal').classList.add('open');
}

function closeCloudConfigModal() {
  document.getElementById('cloudConfigModal').classList.remove('open');
}

function saveCloudConfig() {
  appState.cloudConfig.gasWebhookUrl = document.getElementById('gasWebhookUrlInput').value.trim();
  appState.cloudConfig.adminNotifyEmail = document.getElementById('adminNotifyEmailInput').value.trim();
  saveStateToStorage();
  closeCloudConfigModal();
  showToast('☁️ Configuración de Google Drive guardada.');
}

function sendSubmissionToGoogleCloud(submissionRecord) {
  if (!appState.cloudConfig.gasWebhookUrl) return;
  try {
    fetch(appState.cloudConfig.gasWebhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'SAVE_SUBMISSION',
        adminNotifyEmail: appState.cloudConfig.adminNotifyEmail,
        submission: submissionRecord
      })
    });
  } catch (e) {
    console.warn('Error sincronizando con GAS:', e);
  }
}

function showToast(message) {
  const container = document.getElementById('toastContainer');
  const item = document.createElement('div');
  item.className = 'toast-item';
  item.innerHTML = message;
  container.appendChild(item);

  setTimeout(() => {
    item.style.opacity = '0';
    item.style.transition = 'opacity 0.3s ease';
    setTimeout(() => item.remove(), 300);
  }, 4800);
}
