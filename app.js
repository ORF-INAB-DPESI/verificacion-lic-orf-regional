/* ==========================================================================
   LÓGICA PRINCIPAL — SISTEMA DIGITAL DE VERIFICACIÓN DE ORF REGIONAL (VERSIÓN FINAL)
   Incluye Modificaciones 1 y 2 completas + Sincronización con Google Drive / Sheets / Gmail
   ========================================================================== */

const STORAGE_KEY = 'FORESTAL_ORF_PROD_V4';

// Listado oficial de las 10 Regiones con su contraseña única y sus Subregiones oficiales
const REGIONS_CATALOG = [
  {
    id: 'I',
    code: 'region1',
    password: 'reg1_2026_inabMET',
    name: 'Región I – Metropolitana',
    subregions: [
      { id: 'REG-I', name: 'Región I (Sede regional)', isRegionalHQ: true },
      { id: 'I-1', name: 'I-1 Guatemala' }
    ]
  },
  {
    id: 'II',
    code: 'region2',
    password: 'reg2_2026_inabAVIX',
    name: 'Región II – Alta Verapaz e Ixcán',
    subregions: [
      { id: 'REG-II', name: 'Región II (Sede regional)', isRegionalHQ: true },
      { id: 'II-1', name: 'II-1 Santa Cruz Verapaz' },
      { id: 'II-3', name: 'II-3 Cobán' },
      { id: 'II-5', name: 'II-5 Fray Bartolomé de las Casas' },
      { id: 'II-6', name: 'II-6 Ixcán' },
      { id: 'II-7', name: 'II-7 Santa Catalina La Tinta' }
    ]
  },
  {
    id: 'III',
    code: 'region3',
    password: 'reg3_NRT2026_inab',
    name: 'Región III – Nororiente',
    subregions: [
      { id: 'REG-III', name: 'Región III (Sede regional)', isRegionalHQ: true },
      { id: 'III-1', name: 'III-1 Izabal' },
      { id: 'III-2', name: 'III-2 Zacapa' },
      { id: 'III-3', name: 'III-3 Chiquimula' },
      { id: 'III-4', name: 'III-4 El Progreso' }
    ]
  },
  {
    id: 'IV',
    code: 'region4',
    password: 'reg4_2026SRT_inab',
    name: 'Región IV – Suroriente',
    subregions: [
      { id: 'REG-IV', name: 'Región IV (Sede regional)', isRegionalHQ: true },
      { id: 'IV-1', name: 'IV-1 Jalapa' },
      { id: 'IV-2', name: 'IV-2 Santa Rosa' },
      { id: 'IV-3', name: 'IV-3 Jutiapa' }
    ]
  },
  {
    id: 'V',
    code: 'region5',
    password: 'CHSACreg5_2026_inab',
    name: 'Región V – Chimaltenango y Sacatepéquez',
    subregions: [
      { id: 'REG-V', name: 'Región V (Sede regional)', isRegionalHQ: true },
      { id: 'V-1', name: 'V-1 Sacatepéquez' },
      { id: 'V-2', name: 'V-2 Chimaltenango' }
    ]
  },
  {
    id: 'VI',
    code: 'region6',
    password: 'reg6SCC_2026_inab',
    name: 'Región VI – Suroccidente',
    subregions: [
      { id: 'REG-VI', name: 'Región VI (Sede regional)', isRegionalHQ: true },
      { id: 'VI-1', name: 'VI-1 Quetzaltenango' },
      { id: 'VI-2', name: 'VI-2 San Marcos' },
      { id: 'VI-3', name: 'VI-3 Totonicapán' },
      { id: 'VI-4', name: 'VI-4 Sololá' },
      { id: 'VI-5', name: 'VI-5 Tejutla' }
    ]
  },
  {
    id: 'VII',
    code: 'region7',
    password: 'reg7_2026_NCCinab',
    name: 'Región VII – Noroccidente',
    subregions: [
      { id: 'REG-VII', name: 'Región VII (Sede regional)', isRegionalHQ: true },
      { id: 'VII-1', name: 'VII-1 Santa Cruz del Quiché' },
      { id: 'VII-2', name: 'VII-2 Huehuetenango' },
      { id: 'VII-3', name: 'VII-3 Uspantán' },
      { id: 'VII-4', name: 'VII-4 Soloma' },
      { id: 'VII-5', name: 'VII-5 Santa Ana Huista' }
    ]
  },
  {
    id: 'VIII',
    code: 'region8',
    password: 'reg8_2026_inabPTN',
    name: 'Región VIII – Petén',
    subregions: [
      { id: 'REG-VIII', name: 'Región VIII (Sede regional)', isRegionalHQ: true },
      { id: 'VIII-1', name: 'VIII-1 San Francisco' },
      { id: 'VIII-2', name: 'VIII-2 Poptún' },
      { id: 'VIII-3', name: 'VIII-3 Sayaxché' },
      { id: 'VIII-4', name: 'VIII-4 La Libertad' },
      { id: 'VIII-5', name: 'VIII-5 El Chal' }
    ]
  },
  {
    id: 'IX',
    code: 'region9',
    password: 'reg9_CS2026_inab',
    name: 'Región IX – Costa Sur',
    subregions: [
      { id: 'REG-IX', name: 'Región IX (Sede regional)', isRegionalHQ: true },
      { id: 'IX-1', name: 'IX-1 Mazatenango' },
      { id: 'IX-2', name: 'IX-2 Escuintla' },
      { id: 'IX-3', name: 'IX-3 Retalhuleu' },
      { id: 'IX-4', name: 'IX-4 Coatepeque' }
    ]
  },
  {
    id: 'X',
    code: 'region10',
    password: 'BVreg10_2026_inab',
    name: 'Región X – Baja Verapaz',
    subregions: [
      { id: 'REG-X', name: 'Región X (Sede regional)', isRegionalHQ: true },
      { id: 'X-1', name: 'X-1 San Jerónimo' },
      { id: 'X-2', name: 'X-2 Rabinal' },
      { id: 'X-3', name: 'X-3 Granados' }
    ]
  }
];

const MOD1_CATEGORIES = [
  { key: 'Sí', label: 'Sí', color: '#7CB342' },
  { key: 'No', label: 'No', color: '#C62828' }
];

const MOD2_CATEGORIES = [
  { key: 'En Región', label: 'En Región', color: '#FFCA28', pillClass: 'pill-region' },
  { key: 'En Subregión', label: 'En Subregión', color: '#689F38', pillClass: 'pill-subregion' },
  { key: 'No disponible', label: 'No disponible', color: '#D84315', pillClass: 'pill-nodisp' }
];

// Sin registros de prueba iniciales (listo para carga de archivos Excel reales)
function getInitialMod1Licenses() {
  return [];
}

function getInitialMod2Licenses() {
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
      appState = {
        ...appState,
        ...parsed,
        cloudConfig: {
          gasWebhookUrl: (parsed.cloudConfig && parsed.cloudConfig.gasWebhookUrl) ? parsed.cloudConfig.gasWebhookUrl : DEFAULT_GAS_WEBHOOK_URL,
          adminNotifyEmail: (parsed.cloudConfig && parsed.cloudConfig.adminNotifyEmail && parsed.cloudConfig.adminNotifyEmail !== 'planificacion.forestal@institucion.gob.gt')
            ? parsed.cloudConfig.adminNotifyEmail
            : DEFAULT_ADMIN_EMAIL
        },
        mod1Licenses: parsed.mod1Licenses && parsed.mod1Licenses.length ? parsed.mod1Licenses : getInitialMod1Licenses(),
        mod2Licenses: parsed.mod2Licenses && parsed.mod2Licenses.length ? parsed.mod2Licenses : getInitialMod2Licenses()
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

function getSubregionLockState(subregionId) {
  if (!appState.locks[subregionId]) {
    appState.locks[subregionId] = {
      mod1Locked: false,
      mod2Locked: false,
      mod3Locked: false
    };
  }
  return appState.locks[subregionId];
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
   CREDENCIALES DE INGRESO Y VALIDACIÓN OTP
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

function handleRegionUserChange() {
  const regionId = document.getElementById('loginRegionUser').value;
  const subSelect = document.getElementById('loginSubregionSelect');
  subSelect.innerHTML = '';

  if (!regionId) {
    subSelect.innerHTML = '<option value="">Seleccione su Región primero...</option>';
    return;
  }

  const regionObj = REGIONS_CATALOG.find(r => r.id === regionId);
  if (!regionObj) return;

  const defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.textContent = 'Seleccione sede subregional...';
  subSelect.appendChild(defaultOpt);

  regionObj.subregions.forEach(sub => {
    const opt = document.createElement('option');
    opt.value = sub.id;
    opt.textContent = sub.name;
    subSelect.appendChild(opt);
  });
}

async function handleRequestOtp(event) {
  event.preventDefault();
  const regionId = document.getElementById('loginRegionUser').value;
  const pass = document.getElementById('loginRegionPass').value.trim();
  const subregionId = document.getElementById('loginSubregionSelect').value;
  const personName = document.getElementById('loginPersonName').value.trim();
  const personRole = document.getElementById('loginPersonRole').value.trim();
  const personEmail = document.getElementById('loginPersonEmail').value.trim();

  const regionObj = REGIONS_CATALOG.find(r => r.id === regionId);
  const subObj = regionObj?.subregions.find(s => s.id === subregionId);
  if (!regionObj || !subObj) {
    showToast('⚠️ Seleccione su Región y Sede Subregional.');
    return;
  }

  if (pass !== regionObj.password) {
    showToast('⚠️ Contraseña (Regional) incorrecta para la región seleccionada.');
    return;
  }

  const otpCode = String(Math.floor(100000 + Math.random() * 900000));

  currentSession = {
    ...currentSession,
    authenticated: false,
    regionId: regionObj.id,
    regionName: regionObj.name,
    subregionId: subObj.id,
    subregionName: subObj.name,
    isRegionalHQ: Boolean(subObj.isRegionalHQ),
    personName,
    personRole,
    personEmail,
    generatedOtp: otpCode,
    activeModule: null,
    selectedFiles: []
  };

  if (appState.cloudConfig.gasWebhookUrl) {
    try {
      fetch(appState.cloudConfig.gasWebhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SEND_OTP',
          email: personEmail,
          personName,
          regionName: regionObj.name,
          subregionName: subObj.name,
          otpCode
        })
      });
    } catch (e) {
      console.warn('Error contactando GAS para OTP:', e);
    }
  }

  document.getElementById('stepTab1').classList.remove('active');
  document.getElementById('stepTab2').classList.add('active');
  document.getElementById('authStep1Body').style.display = 'none';
  document.getElementById('authStep2Body').style.display = 'block';

  document.getElementById('otpTargetEmailDisplay').textContent = personEmail;
  document.getElementById('otpInputCode').value = '';

  showToast(`📨 Código de verificación enviado a ${personEmail}`);
}

function backToAuthStep1() {
  document.getElementById('stepTab2').classList.remove('active');
  document.getElementById('stepTab1').classList.add('active');
  document.getElementById('authStep2Body').style.display = 'none';
  document.getElementById('authStep1Body').style.display = 'block';
}

function handleVerifyOtp(event) {
  event.preventDefault();
  const entered = document.getElementById('otpInputCode').value.trim();
  if (entered !== currentSession.generatedOtp) {
    showToast('❌ El código ingresado no coincide. Verifique su correo.');
    return;
  }

  currentSession.authenticated = true;
  document.getElementById('authSection').style.display = 'none';
  document.getElementById('AuthenticatedWorkspace').style.display = 'block';

  document.getElementById('sessionAvatar').textContent = `R${currentSession.regionId}`;
  document.getElementById('sessionTitleDisplay').textContent =
    `${currentSession.regionName} · ${currentSession.subregionName}`;
  document.getElementById('sessionUserDisplay').textContent =
    `Responsable: ${currentSession.personName} (${currentSession.personRole}) · Correo: ${currentSession.personEmail}`;

  const userSummary = `${currentSession.personName} (${currentSession.personRole})`;
  document.getElementById('secSummaryUserMod1').textContent = userSummary;
  document.getElementById('secSummaryUserMod2').textContent = userSummary;
  document.getElementById('secSummaryUserMod3').textContent = userSummary;

  refreshModulesCardsState();
  closeActiveModuleView();

  showToast(`✅ Acceso verificado (${currentSession.isRegionalHQ ? 'Nivel Sede Regional' : 'Nivel Sede Subregional'}).`);
}

function switchSubregionInSession() {
  currentSession.authenticated = false;
  currentSession.activeModule = null;
  document.getElementById('AuthenticatedWorkspace').style.display = 'none';
  document.getElementById('authSection').style.display = 'grid';
  backToAuthStep1();
  handleRegionUserChange();
}

/* ==========================================================================
   MODIFICACIÓN 4 (PDF 2): ACCESO CONDICIONADO A LOS MÓDULOS SEGÚN NIVEL
   - Región Y (Sede regional) -> SOLO disponible Módulo 1
   - Sedes Subregionales -> SOLO disponibles Módulos 2 y 3
   ========================================================================== */
function refreshModulesCardsState() {
  const lock = getSubregionLockState(currentSession.subregionId);
  const card1 = document.getElementById('cardModule1');
  const card2 = document.getElementById('cardModule2');
  const card3 = document.getElementById('cardModule3');

  if (currentSession.isRegionalHQ) {
    // Nivel Regional: solo Módulo 1 disponible
    card1.style.display = 'flex';
    card2.style.display = 'none';
    card3.style.display = 'none';
  } else {
    // Nivel Subregional: solo Módulos 2 y 3 disponibles
    card1.style.display = 'none';
    card2.style.display = 'flex';
    card3.style.display = 'flex';
  }

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
  // Validar que el usuario tenga permiso según su nivel (Modificación 4)
  if (currentSession.isRegionalHQ && modNumber !== 1) {
    showToast('⚠️ Las Sedes Regionales tienen asignado únicamente el módulo de Control de Licencias sin información digital.');
    return;
  }
  if (!currentSession.isRegionalHQ && modNumber === 1) {
    showToast('⚠️ Las Sedes Subregionales tienen asignados únicamente los módulos 2 y 3.');
    return;
  }

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
   MÓDULO 1 (EXCLUSIVO SEDE REGIONAL) + MODIFICACIÓN 3 (BLOQUEAR ENVÍO SI FALTAN REGISTROS)
   ========================================================================== */
function getMod1LicensesForCurrentSession() {
  if (!currentSession.regionId) return [];
  return appState.mod1Licenses.filter(l => l.regionId === currentSession.regionId);
}

function renderModule1Table() {
  const tbody = document.getElementById('mod1TableBody');
  const search = (document.getElementById('mod1SearchInput')?.value || '').toLowerCase().trim();
  const lock = getSubregionLockState(currentSession.subregionId);
  const isLocked = lock.mod1Locked;

  const list = getMod1LicensesForCurrentSession();
  const answered = list.filter(l => l.emitida === 'Sí' || l.emitida === 'No').length;
  const total = list.length;
  const missing = total - answered;
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0;

  document.getElementById('mod1ProgressText').textContent = `Avance: ${answered} de ${total} licencias respondidas`;
  document.getElementById('mod1ProgressPct').textContent = `${pct}%`;
  document.getElementById('mod1ProgressFill').style.width = `${pct}%`;

  const submitBtn = document.getElementById('btnSubmitMod1');
  const warningEl = document.getElementById('mod1CompletionWarning');

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

  const filtered = list.filter(item => {
    if (!search) return true;
    return (
      String(item.correlativo).toLowerCase().includes(search) ||
      String(item.year).toLowerCase().includes(search) ||
      String(item.obs || '').toLowerCase().includes(search)
    );
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="center" style="padding: 28px; color: var(--text-muted);">
          No hay registros cargados para esta Región en el Módulo 1.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map((lic, idx) => {
    const isSi = lic.emitida === 'Sí';
    const isNo = lic.emitida === 'No';

    return `
      <tr class="${(isSi || isNo) ? 'row-answered' : ''}">
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

function handleSelectMod1Emitida(licId, val) {
  const item = appState.mod1Licenses.find(l => l.id === licId);
  if (!item) return;
  item.emitida = val;
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
  const lock = getSubregionLockState(currentSession.subregionId);
  if (lock.mod1Locked) return;

  const list = getMod1LicensesForCurrentSession();
  const missing = list.filter(l => l.emitida !== 'Sí' && l.emitida !== 'No');
  if (list.length === 0 || missing.length > 0) {
    showToast(`⚠️ No se permite enviar la información hasta completar todos los registros (faltan ${missing.length}).`);
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
   MÓDULO 2 (EXCLUSIVO SEDE SUBREGIONAL) + MODIFICACIÓN 3 (BLOQUEAR ENVÍO SI FALTAN REGISTROS)
   ========================================================================== */
function getMod2LicensesForCurrentSession() {
  if (!currentSession.regionId) return [];
  return appState.mod2Licenses.filter(l => l.subregionId === currentSession.subregionId);
}

function renderModule2Table() {
  const tbody = document.getElementById('mod2TableBody');
  const search = (document.getElementById('mod2SearchInput')?.value || '').toLowerCase().trim();
  const lock = getSubregionLockState(currentSession.subregionId);
  const isLocked = lock.mod2Locked;

  const list = getMod2LicensesForCurrentSession();
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

  const filtered = list.filter(item => {
    if (!search) return true;
    return (
      String(item.resolucion).toLowerCase().includes(search) ||
      String(item.expediente).toLowerCase().includes(search) ||
      String(item.titular).toLowerCase().includes(search) ||
      String(item.year).toLowerCase().includes(search)
    );
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="center" style="padding: 28px; color: var(--text-muted);">
          No hay registros cargados para esta subregión en el Módulo 2.
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

    return `
      <tr class="${lic.disponibilidad ? 'row-answered' : ''}">
        <td class="center"><strong>${lic.no || idx + 1}</strong></td>
        <td><strong>${lic.resolucion}</strong></td>
        <td>${lic.expediente}</td>
        <td>${lic.titular}</td>
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
  const lock = getSubregionLockState(currentSession.subregionId);
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
  const lock = getSubregionLockState(currentSession.subregionId);
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
  const lock = getSubregionLockState(currentSession.subregionId);
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
  const folderTarget = `/Poligonos_Georreferenciados/${currentSession.regionName}/${currentSession.subregionName}/`;

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
  const lock = getSubregionLockState(currentSession.subregionId);
  const now = new Date();
  const dateStr = now.toLocaleDateString('es-GT', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const timeStr = now.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const adminEmailMessage =
    `Formulario ${moduleTitle}, La ${currentSession.regionName}, ${currentSession.subregionName}, ha completado el formulario el ${dateStr} a las ${timeStr} a nombre de ${currentSession.personName} (${currentSession.personRole}).`;

  const userReceiptMessage =
    `Constancia de Envío: Estimado/a ${currentSession.personName} (${currentSession.personRole}), confirmamos la recepción exitosa de ${moduleTitle} correspondiente a ${currentSession.regionName} - ${currentSession.subregionName} el ${dateStr} a las ${timeStr}.`;

  // Guardar en historial local (sin almacenar archivos gigantes en localStorage, pero enviándolos completos a Google Drive)
  const localFilesMeta = (filesUploaded || []).map(f => ({ name: f.name, sizeKB: f.sizeKB }));

  const submissionRecord = {
    id: `SUB-M${modNumber}-${Date.now()}`,
    timestamp: `${dateStr} ${timeStr}`,
    modNumber,
    moduleType: moduleTitle,
    regionId: currentSession.regionId,
    regionName: currentSession.regionName,
    subregionId: currentSession.subregionId,
    subregionName: currentSession.subregionName,
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
  showToast(`✅ Información enviada correctamente. Se bloqueó el módulo para ${currentSession.subregionName} y se emitieron las notificaciones.`);
}

function saveDraftToLocal(notify = true) {
  saveStateToStorage();
  if (notify) {
    showToast('💾 Avance guardado en borrador temporal.');
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
  const yearFilter = document.getElementById('adminYearFilter')?.value || 'ALL';
  const activeExcelMod = document.getElementById('adminExcelModuleFilter')?.value || 'MOD1';

  const regionObj = REGIONS_CATALOG.find(r => r.id === regionFilter);
  document.getElementById('adminMainHeading').textContent = regionObj
    ? `Tablero de Control · ${regionObj.name}`
    : 'Tablero de Control Nacional · Todas las Regiones (I a X)';

  document.getElementById('adminMainSubheading').textContent = activeExcelMod === 'MOD1'
    ? 'Vista enfocada en Módulo 1 (Nivel Regional): Control de Licencias sin información digital'
    : 'Vista enfocada en Módulo 2 (Nivel Subregional): Control de Licencias sin polígono digital';

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
      <div class="kpi-card" style="border-left-color: #FFCA28;">
        <small>En Región</small>
        <strong>${regCount}</strong>
        <span>Disponibles en sede regional</span>
      </div>
      <div class="kpi-card" style="border-left-color: #689F38;">
        <small>En Subregión</small>
        <strong>${subCount}</strong>
        <span>Disponibles en subregión</span>
      </div>
      <div class="kpi-card" style="border-left-color: #D84315;">
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

  const metrics = [];
  regionsList.forEach(reg => {
    reg.subregions.forEach(sub => {
      const lk = getSubregionLockState(sub.id);
      let pct = 0;
      if (sub.isRegionalHQ) {
        pct = lk.mod1Locked ? 100 : 0;
      } else {
        const doneCount = (lk.mod2Locked ? 1 : 0) + (lk.mod3Locked ? 1 : 0);
        pct = Math.round((doneCount / 2) * 100);
      }
      metrics.push({ id: sub.id, name: sub.name, pct });
    });
  });

  const visible = metrics.slice(0, 12);
  const palette = ['#7CB342', '#17A589', '#0E6251', '#1A5276', '#3498DB', '#196F3D', '#AFB42B'];

  barsContainer.innerHTML = visible.map((m, idx) => {
    const color = palette[idx % palette.length];
    return `
      <div class="v-bar-col" title="${m.name}: ${m.pct}%">
        <div class="v-bar-value">${m.pct}%</div>
        <div class="v-bar-fill" style="height: ${Math.max(m.pct, 6)}%; background: linear-gradient(180deg, ${color}, #0B5345);"></div>
      </div>
    `;
  }).join('');

  labelsContainer.innerHTML = visible.map(m => `<div class="v-bar-label-item">${m.id}</div>`).join('');
}

function renderSubregionTripleStatusTable(regionsList) {
  const tbody = document.getElementById('adminSubregionStatusBody');
  const rows = [];

  regionsList.forEach(reg => {
    reg.subregions.forEach(sub => {
      const lk = getSubregionLockState(sub.id);

      // Condicionado según Modificación 4:
      // Sede Regional -> solo aplica Módulo 1
      // Sede Subregional -> solo aplican Módulos 2 y 3
      const b1 = sub.isRegionalHQ
        ? (lk.mod1Locked ? `<span class="status-pill completed">🔒 Completado</span>` : `<span class="status-pill available">⚪ Pendiente</span>`)
        : `<small style="color:var(--text-muted);">— (Nivel Regional)</small>`;

      const b2 = !sub.isRegionalHQ
        ? (lk.mod2Locked ? `<span class="status-pill completed">🔒 Completado</span>` : `<span class="status-pill available">⚪ Pendiente</span>`)
        : `<small style="color:var(--text-muted);">— (Nivel Subregional)</small>`;

      const b3 = !sub.isRegionalHQ
        ? (lk.mod3Locked ? `<span class="status-pill completed">🔒 Completado</span>` : `<span class="status-pill available">⚪ Pendiente</span>`)
        : `<small style="color:var(--text-muted);">— (Nivel Subregional)</small>`;

      const anyLocked = (sub.isRegionalHQ && lk.mod1Locked) || (!sub.isRegionalHQ && (lk.mod2Locked || lk.mod3Locked));

      rows.push(`
        <tr>
          <td><strong>${reg.name}</strong></td>
          <td><strong>${sub.name}</strong></td>
          <td class="center">${b1}</td>
          <td class="center">${b2}</td>
          <td class="center">${b3}</td>
          <td class="center">
            ${anyLocked ? `
              <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;">
                ${(sub.isRegionalHQ && lk.mod1Locked) ? `<button type="button" class="btn-warning" onclick="unlockSubregionModule('${sub.id}', 1)">🔓 Desbloq. M1</button>` : ''}
                ${(!sub.isRegionalHQ && lk.mod2Locked) ? `<button type="button" class="btn-warning" style="background:var(--c-ocean);" onclick="unlockSubregionModule('${sub.id}', 2)">🔓 Desbloq. M2</button>` : ''}
                ${(!sub.isRegionalHQ && lk.mod3Locked) ? `<button type="button" class="btn-warning" style="background:var(--c-teal-dark);" onclick="unlockSubregionModule('${sub.id}', 3)">🔓 Desbloq. M3</button>` : ''}
              </div>
            ` : `<small style="color:var(--text-muted);">Habilitada</small>`}
          </td>
        </tr>
      `);
    });
  });

  tbody.innerHTML = rows.join('');
}

function unlockSubregionModule(subregionId, modNum) {
  const lk = getSubregionLockState(subregionId);
  if (modNum === 1) lk.mod1Locked = false;
  if (modNum === 2) lk.mod2Locked = false;
  if (modNum === 3) lk.mod3Locked = false;

  saveStateToStorage();
  renderAdminDashboard();
  showToast(`🔓 Módulo ${modNum} desbloqueado para ${subregionId}. Los envíos anteriores se conservan en el historial.`);
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
      <td>${sub.regionName}<br><strong>${sub.subregionName}</strong></td>
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
    `Respaldo de Envío · ${sub.subregionName} (${sub.timestamp})`;

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
  if (!window.confirm('¿Está segura de eliminar este registro de envío manualmente?')) return;
  appState.submissions = appState.submissions.filter(s => s.id !== submissionId);
  saveStateToStorage();
  renderAdminDashboard();
  showToast('🗑️ Registro eliminado manualmente.');
}

/* ==========================================================================
   IMPORTACIÓN Y EXPORTACIÓN DE LIBRO DE EXCEL
   ========================================================================== */
function findRegionAndSubregionBySheetName(sheetName) {
  const clean = String(sheetName).trim().toUpperCase();
  for (const reg of REGIONS_CATALOG) {
    if (reg.id.toUpperCase() === clean || reg.name.toUpperCase().includes(clean)) {
      return { regionId: reg.id, subregionId: `REG-${reg.id}` };
    }
    for (const sub of reg.subregions) {
      if (sub.id.toUpperCase() === clean || sub.name.toUpperCase().includes(clean)) {
        return { regionId: reg.id, subregionId: sub.id };
      }
    }
  }
  return { regionId: 'I', subregionId: 'I-1' };
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
          const regionId = String(r.Region || r.Región || mappedLoc.regionId).trim();
          const subregionId = String(r.Subregion || r.Subregión || mappedLoc.subregionId).trim();

          if (targetMod === 'MOD1') {
            importedRecords.push({
              id: `M1-IMP-${Date.now()}-${sheetName}-${idx}`,
              regionId,
              subregionId,
              no: Number(r.No || r['No.'] || idx + 1),
              year: Number(r.Año || r.Anio || 2017),
              correlativo: String(r['Correlativo licencia'] || r.Correlativo || (idx + 1)),
              emitida: String(r['¿La licencia fue emitida?'] || r.Emitida || ''),
              obs: String(r.Observación || r.Observaciones || '')
            });
          } else {
            importedRecords.push({
              id: `M2-IMP-${Date.now()}-${sheetName}-${idx}`,
              regionId,
              subregionId,
              no: Number(r.No || r['No.'] || idx + 1),
              resolucion: String(r['Resolución Licencia'] || r.Resolucion || `RES-${idx + 1}`),
              expediente: String(r.Expediente || `EXP-${idx + 1}`),
              titular: String(r.Titular || 'Sin titular'),
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
      } else {
        appState.mod2Licenses = importedRecords;
      }

      saveStateToStorage();
      renderAdminDashboard();
      showToast(`📥 Se importaron ${importedRecords.length} registros desde ${workbook.SheetNames.length} hoja(s) para ${targetMod === 'MOD1' ? 'Módulo 1' : 'Módulo 2'}.`);
    } catch (err) {
      console.error(err);
      showToast('❌ Error procesando el libro de Excel.');
    }
  };
  reader.readAsArrayBuffer(file);
}

function exportConsolidatedExcel() {
  if (typeof XLSX === 'undefined') return;
  const targetMod = document.getElementById('adminExcelModuleFilter')?.value || 'MOD1';
  const wb = XLSX.utils.book_new();

  if (targetMod === 'MOD1') {
    const rows = appState.mod1Licenses.map(l => ({
      Región: l.regionId,
      Sede: l.subregionId,
      'No.': l.no,
      Año: l.year,
      'Correlativo licencia': l.correlativo,
      '¿La licencia fue emitida?': l.emitida || 'PENDIENTE',
      Observación: l.obs || ''
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), 'Consolidado_Modulo_1');
    XLSX.writeFile(wb, `Consolidado_Modulo1_Sin_Info_Digital_${new Date().toISOString().slice(0, 10)}.xlsx`);
  } else {
    const rows = appState.mod2Licenses.map(l => ({
      Región: l.regionId,
      Subregión: l.subregionId,
      'No.': l.no,
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

  if (targetMod === 'MOD1') {
    const sampleRegions = ['REG-I', 'REG-II', 'REG-III', 'REG-IV', 'REG-V'];
    sampleRegions.forEach(regId => {
      const sampleRows = [
        { 'No.': 1, Año: 2015, 'Correlativo licencia': '11', '¿La licencia fue emitida?': '', Observación: '' },
        { 'No.': 2, Año: 2016, 'Correlativo licencia': '23', '¿La licencia fue emitida?': '', Observación: '' }
      ];
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sampleRows), regId);
    });
  } else {
    const sampleSubregions = ['I-1', 'II-1', 'III-1', 'IV-1', 'V-1'];
    sampleSubregions.forEach(subId => {
      const sampleRows = [
        { 'No.': 1, 'Resolución Licencia': `RES-${subId}-2016-01`, Expediente: 'EXP-001', Titular: 'Ejemplo Titular', Año: 2016, 'Área (Ha)': 15.0, 'Estado de disponibilidad del expediente físico': '', Observaciones: '' }
      ];
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sampleRows), subId);
    });
  }

  XLSX.writeFile(wb, `Plantilla_${targetMod}.xlsx`);
}

function loadSampleSubmissionsForDemo() {
  const lkReg1 = getSubregionLockState('REG-I');
  lkReg1.mod1Locked = true;

  const lkSub1 = getSubregionLockState('I-1');
  lkSub1.mod2Locked = true;
  lkSub1.mod3Locked = true;

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
    subregionName: 'Región I (Sede regional)',
    personName: 'Fatima Callejas',
    personRole: 'Consultor',
    personEmail: 'fcallejas.inab.2026@gmail.com',
    signatureDataUrl: dummyCanvas.toDataURL(),
    adminEmailText: 'Formulario Control de Licencias sin Información Digital (Módulo 1), La Región I – Metropolitana, Región I (Sede regional), ha completado el formulario el 25/10/2026 a las 09:55:06 a. m. a nombre de Fatima Callejas (Consultor).',
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
