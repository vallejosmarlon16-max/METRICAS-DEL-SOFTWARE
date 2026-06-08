'use strict';

// ══════════════════════════════════════════════
//  SISTEMA DE TOASTS
// ══════════════════════════════════════════════
const toastStack = document.getElementById('toast-stack');

const TOAST_ICONS = {
  warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>`,
  error:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/></svg>`,
  success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
};

function showToast(title, desc, type = 'warning', duration = 3500) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon-wrap">${TOAST_ICONS[type]}</div>
    <div class="toast-body">
      <p class="toast-title">${title}</p>
      <p class="toast-desc">${desc}</p>
    </div>
    <button class="toast-close" aria-label="Cerrar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
    <div class="toast-progress"></div>`;
  if (toastStack.children.length >= 4) dismissToast(toastStack.firstChild);
  toastStack.appendChild(toast);
  const timer = setTimeout(() => dismissToast(toast), duration);
  toast.querySelector('.toast-close').addEventListener('click', () => { clearTimeout(timer); dismissToast(toast); });
}

function dismissToast(t) {
  if (!t || !t.parentNode) return;
  t.classList.add('toast-out');
  setTimeout(() => t.remove(), 280);
}

// ══════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════

const SVG_CHECK = `<svg class="req-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>`;
const SVG_X     = `<svg class="req-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>`;

/** Actualiza un ítem de popover con ✓ o ✗ */
function setReq(id, isValid, label) {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = `req-item ${isValid ? 'req-valid' : 'req-invalid'}`;
  el.innerHTML = `${isValid ? SVG_CHECK : SVG_X} ${label}`;
}


/** Muestra u oculta el popover de un campo */
function openPop(id)  { document.getElementById(id)?.classList.remove('hidden'); }
function closePop(id) { document.getElementById(id)?.classList.add('hidden'); }


/** Estado del input-wrapper */
function wrapOk(wrap, okIcon, errIcon) {
  wrap.classList.remove('has-error'); wrap.classList.add('is-valid');
  okIcon?.classList.remove('hidden'); errIcon?.classList.add('hidden');
}
function wrapError(wrap, okIcon, errIcon) {
  wrap.classList.add('has-error'); wrap.classList.remove('is-valid');
  errIcon?.classList.remove('hidden'); okIcon?.classList.add('hidden');
}
function wrapNeutral(wrap, okIcon, errIcon) {
  wrap.classList.remove('has-error', 'is-valid');
  okIcon?.classList.add('hidden'); errIcon?.classList.add('hidden');
}

// ══════════════════════════════════════════════
//  REFERENCIAS
// ══════════════════════════════════════════════
const form          = document.getElementById('registro-form');
const successScreen = document.getElementById('success-screen');
const mainLayout    = document.getElementById('main-layout');
const btnVolver     = document.getElementById('btn-volver');

const inputCedula   = document.getElementById('cedula');
const inputNombre   = document.getElementById('nombre');
const inputTelefono = document.getElementById('telefono');
const inputEmail    = document.getElementById('email');
const inputPassword = document.getElementById('password');

const wrapCedula    = document.getElementById('wrap-cedula');
const wrapNombre    = document.getElementById('wrap-nombre');
const wrapTelefono  = document.getElementById('wrap-telefono');
const wrapEmail     = document.getElementById('wrap-email');
const wrapPassword  = document.getElementById('wrap-password');

const okCedula    = document.getElementById('ok-cedula');
const errCedula   = document.getElementById('err-cedula');
const okNombre    = document.getElementById('ok-nombre');
const errNombre   = document.getElementById('err-nombre');
const okTelefono  = document.getElementById('ok-telefono');
const errTelefono = document.getElementById('err-telefono');
const okEmail     = document.getElementById('ok-email');
const errEmail    = document.getElementById('err-email');

const togglePwd     = document.getElementById('toggle-pwd');
const eyeShow       = document.getElementById('eye-show');
const eyeHide       = document.getElementById('eye-hide');
const strengthBg    = document.getElementById('strength-bg');
const strengthBar   = document.getElementById('strength-bar');
const strengthLabel = document.getElementById('strength-label');

// ══════════════════════════════════════════════
//  CAPTCHA YAVIRAC SHIELD
// ══════════════════════════════════════════════
let captchaState = 'idle'; // idle | loading | verified

// Old Captcha logic removed, replaced by new logic at the bottom of the file
// ══════════════════════════════════════════════
//  CÉDULA ECUATORIANA
// ══════════════════════════════════════════════
function validarCedula(ci) {
  if (ci.length !== 10) return false;
  const prov = parseInt(ci.substring(0, 2), 10);
  if (prov < 1 || (prov > 24 && prov !== 30)) return false;
  if (parseInt(ci[2], 10) > 5) return false;
  const coef = [2,1,2,1,2,1,2,1,2];
  let suma = 0;
  for (let i = 0; i < 9; i++) {
    let v = parseInt(ci[i], 10) * coef[i];
    if (v >= 10) v -= 9;
    suma += v;
  }
  let res = 10 - (suma % 10);
  if (res === 10) res = 0;
  return res === parseInt(ci[9], 10);
}

// ══════════════════════════════════════════════
//  CAMPO: CÉDULA
// ══════════════════════════════════════════════
inputCedula.addEventListener('focus', () => openPop('pop-cedula'));

inputCedula.addEventListener('keypress', (e) => {
  if (!/[0-9]/.test(e.key) && !['Backspace','Delete','ArrowLeft','ArrowRight','Tab'].includes(e.key)) {
    e.preventDefault();
    showToast('Solo números', 'La cédula únicamente acepta dígitos del 0 al 9.', 'warning', 2500);
  }
});

inputCedula.addEventListener('input', function () {
  const clean = this.value.replace(/\D/g, '').slice(0, 10);
  this.value  = clean;

  const okNums  = true;
  const okLen   = clean.length === 10;
  const okValid = okLen && validarCedula(clean);

  if (!clean) {
    wrapNeutral(wrapCedula, okCedula, errCedula);
    setReq('rc-nums',  false, 'Solo dígitos numéricos (0-9)');
    setReq('rc-len',   false, 'Exactamente 10 dígitos');
    setReq('rc-valid', false, 'Cédula ecuatoriana válida');
    ['rule-cedula-nums','rule-cedula-len','rule-cedula-valid'].forEach(id => setChip(id,'idle'));
    return;
  }


  setReq('rc-nums',  okNums,  'Solo dígitos numéricos (0-9)');
  setReq('rc-len',   okLen,   'Exactamente 10 dígitos');
  setReq('rc-valid', okValid, 'Cédula ecuatoriana válida');

  if (okValid) {
    wrapOk(wrapCedula, okCedula, errCedula);
  } else if (okLen) {
    wrapError(wrapCedula, okCedula, errCedula);
    showToast('Cédula inválida', 'El número no supera la verificación del dígito validador.', 'error');
  } else {
    wrapNeutral(wrapCedula, okCedula, errCedula);
  }

});

inputCedula.addEventListener('blur', function () {
  setTimeout(() => closePop('pop-cedula'), 200);
  if (!this.value) {
    wrapError(wrapCedula, okCedula, errCedula);
    setReq('rc-nums',  false, 'Solo dígitos numéricos (0-9)');
    setReq('rc-len',   false, 'Exactamente 10 dígitos');
    setReq('rc-valid', false, 'Cédula ecuatoriana válida');
  }

});

// ══════════════════════════════════════════════
//  CAMPO: NOMBRE
// ══════════════════════════════════════════════
inputNombre.addEventListener('focus', () => openPop('pop-nombre'));

inputNombre.addEventListener('keypress', (e) => {
  if (/[0-9]/.test(e.key)) {
    e.preventDefault();
    showToast('Sin números', 'El nombre solo acepta letras y espacios.', 'warning', 2500);
  }
});

inputNombre.addEventListener('input', function () {
  const raw   = this.value;
  const clean = raw.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '');
  if (raw !== clean) {
    showToast('Carácter no permitido', 'Solo letras (con o sin tilde) y espacios.', 'warning', 2500);
    this.value = clean;
  }

  const okLetras = clean.length > 0;
  const okNoNums = !/[0-9]/.test(clean);
  const okLen    = clean.trim().length >= 3;

  if (!clean) {
    wrapNeutral(wrapNombre, okNombre, errNombre);
    setReq('rn-letras', false, 'Solo letras y espacios');
    setReq('rn-nonums', false, 'Sin números ni símbolos');
    setReq('rn-len',    false, 'Mínimo 3 caracteres');
    ['rule-nombre-letras','rule-nombre-nonums','rule-nombre-len'].forEach(id => setChip(id,'idle'));
    return;
  }

  setReq('rn-letras', okLetras, 'Solo letras y espacios');
  setReq('rn-nonums', okNoNums, 'Sin números ni símbolos');
  setReq('rn-len',    okLen,    'Mínimo 3 caracteres');

  if (okLetras && okNoNums && okLen) wrapOk(wrapNombre, okNombre, errNombre);
  else wrapNeutral(wrapNombre, okNombre, errNombre);

});

inputNombre.addEventListener('blur', function () {
  setTimeout(() => closePop('pop-nombre'), 200);
  if (!this.value.trim()) {
    wrapError(wrapNombre, okNombre, errNombre);
    setReq('rn-letras', false, 'Solo letras y espacios');
    setReq('rn-nonums', false, 'Sin números ni símbolos');
    setReq('rn-len',    false, 'Mínimo 3 caracteres');
  }

});

// ══════════════════════════════════════════════
//  CAMPO: TELÉFONO
// ══════════════════════════════════════════════
inputTelefono.addEventListener('focus', () => openPop('pop-telefono'));

inputTelefono.addEventListener('keypress', (e) => {
  if (!/[0-9]/.test(e.key) && !['Backspace','Delete','ArrowLeft','ArrowRight','Tab'].includes(e.key)) {
    e.preventDefault();
    showToast('Sin letras', 'El teléfono solo acepta dígitos. Ejemplo: 0991234567', 'warning', 2500);
  }
});

inputTelefono.addEventListener('input', function () {
  const clean = this.value.replace(/\D/g, '').slice(0, 10);
  this.value  = clean;

  const okNums   = true;
  const okNoLetr = true;
  const okLen    = clean.length === 10;

  if (!clean) {
    wrapNeutral(wrapTelefono, okTelefono, errTelefono);
    setReq('rt-nums',     false, 'Solo dígitos numéricos (0-9)');
    setReq('rt-noletras', false, 'Sin letras ni símbolos');
    setReq('rt-len',      false, 'Exactamente 10 dígitos');
    ['rule-tel-nums','rule-tel-noletras','rule-tel-len'].forEach(id => setChip(id,'idle'));
    return;
  }

  setReq('rt-nums',     okNums,   'Solo dígitos numéricos (0-9)');
  setReq('rt-noletras', okNoLetr, 'Sin letras ni símbolos');
  setReq('rt-len',      okLen,    'Exactamente 10 dígitos');

  if (okLen) wrapOk(wrapTelefono, okTelefono, errTelefono);
  else       wrapNeutral(wrapTelefono, okTelefono, errTelefono);

});

inputTelefono.addEventListener('blur', function () {
  setTimeout(() => closePop('pop-telefono'), 200);
  if (!this.value) {
    wrapError(wrapTelefono, okTelefono, errTelefono);
    setReq('rt-nums',     false, 'Solo dígitos numéricos (0-9)');
    setReq('rt-noletras', false, 'Sin letras ni símbolos');
    setReq('rt-len',      false, 'Exactamente 10 dígitos');
  }

});

// ══════════════════════════════════════════════
//  CAMPO: CORREO
// ══════════════════════════════════════════════
const REGEX_EMAIL   = /^[^\s@]+@(gmail\.com|hotmail\.es|hotmail\.com|outlook\.es)$/i;
const REGEX_DOMINIO = /^(gmail\.com|hotmail\.es|hotmail\.com|outlook\.es)$/i;

inputEmail.addEventListener('focus', () => openPop('pop-email'));

inputEmail.addEventListener('input', function () {
  const val = this.value.trim();

  const partes      = val.split('@');
  const okArroba    = val.includes('@') && partes[0].length > 0;
  const okUsuario   = partes[0]?.length > 0;
  const okDominio   = okArroba && REGEX_DOMINIO.test(partes[1] || '');
  const okCompleto  = REGEX_EMAIL.test(val);

  if (!val) {
    wrapNeutral(wrapEmail, okEmail, errEmail);
    setReq('re-arroba',  false, 'Contiene el símbolo @');
    setReq('re-usuario', false, 'Tiene un usuario antes del @');
    setReq('re-dominio', false, 'Dominio: @gmail · @hotmail · @outlook');
    ['rule-email-arroba','rule-email-dominio','rule-email-full'].forEach(id => setChip(id,'idle'));
    return;
  }

  setReq('re-arroba',  okArroba,  'Contiene el símbolo @');
  setReq('re-usuario', okUsuario, 'Tiene un usuario antes del @');
  setReq('re-dominio', okDominio, 'Dominio: @gmail · @hotmail · @outlook');

  if (okCompleto)       wrapOk(wrapEmail, okEmail, errEmail);
  else if (okArroba && !okDominio) wrapError(wrapEmail, okEmail, errEmail);
  else                  wrapNeutral(wrapEmail, okEmail, errEmail);

});

inputEmail.addEventListener('blur', function () {
  setTimeout(() => closePop('pop-email'), 200);
  const val = this.value.trim();
  if (!val) {
    wrapError(wrapEmail, okEmail, errEmail);
    setReq('re-arroba',  false, 'Contiene el símbolo @');
    setReq('re-usuario', false, 'Tiene un usuario antes del @');
    setReq('re-dominio', false, 'Dominio: @gmail · @hotmail · @outlook');
    return;
  }
  if (!REGEX_EMAIL.test(val)) {
    showToast('Correo no aceptado', 'Usa: @gmail.com · @hotmail.com · @hotmail.es · @outlook.es', 'error');
  }

});

// ══════════════════════════════════════════════
//  CAMPO: CONTRASEÑA
// ══════════════════════════════════════════════
const STRENGTH_LEVELS = [
  { label: 'Muy débil',  color: '#ef4444' },
  { label: 'Débil',      color: '#f97316' },
  { label: 'Regular',    color: '#f59e0b' },
  { label: 'Buena',      color: '#84cc16' },
  { label: 'Muy fuerte', color: '#22c55e' },
];

function calcPassword(val) {
  const okLen   = val.length >= 6 && val.length <= 12;
  const okUpper = /[A-Z]/.test(val);
  const okLower = /[a-z]/.test(val);
  const okNum   = /[0-9]/.test(val);
  const okSpc   = /[@$!%*?&.]/.test(val);
  const score   = [okLen,okUpper,okLower,okNum,okSpc].filter(Boolean).length;
  return { okLen, okUpper, okLower, okNum, okSpc, score };
}

inputPassword.addEventListener('focus', () => {
  if (inputPassword.value.length > 0) openPop('pop-password');
});

inputPassword.addEventListener('input', function () {
  const val = this.value;

  if (!val) {
    strengthBg.classList.add('hidden');
    strengthLabel.classList.add('hidden');
    closePop('pop-password');
    wrapNeutral(wrapPassword, null, null);
    wrapPassword.classList.remove('has-error','is-valid');
    ['rule-pwd-len','rule-pwd-upper','rule-pwd-lower','rule-pwd-num','rule-pwd-sym']
      .forEach(id => setChip(id,'idle'));
    return;
  }

  openPop('pop-password');
  strengthBg.classList.remove('hidden');
  strengthLabel.classList.remove('hidden');

  const { okLen, okUpper, okLower, okNum, okSpc, score } = calcPassword(val);

  setReq('rp-len',     okLen,   'Entre 6 y 12 caracteres');
  setReq('rp-upper',   okUpper, 'Una mayúscula (A-Z)');
  setReq('rp-lower',   okLower, 'Una minúscula (a-z)');
  setReq('rp-num',     okNum,   'Un número (0-9)');
  setReq('rp-special', okSpc,   'Un símbolo (@$!%*?&.)');

  const lvl = STRENGTH_LEVELS[Math.max(0, score - 1)];

  strengthBar.style.width           = `${(score / 5) * 100}%`;
  strengthBar.style.backgroundColor = lvl.color;
  strengthLabel.textContent         = lvl.label;
  strengthLabel.style.color         = lvl.color;

  const allOk = okLen && okUpper && okLower && okNum && okSpc;
  wrapPassword.classList.toggle('is-valid',  allOk);
  wrapPassword.classList.toggle('has-error', !allOk);
});

inputPassword.addEventListener('blur', function () {
  setTimeout(() => closePop('pop-password'), 200);
  const val = this.value;
  if (!val) {
    wrapPassword.classList.add('has-error');
    return;
  }
  const { score } = calcPassword(val);
  if (score < 5) {
    showToast('Contraseña insegura', 'Debe tener 6-12 chars, mayúscula, minúscula, número y símbolo.', 'error', 4500);
  }

});

// ══════════════════════════════════════════════
//  VER / OCULTAR CONTRASEÑA
// ══════════════════════════════════════════════
togglePwd.addEventListener('click', function () {
  const isHidden = inputPassword.type === 'password';
  inputPassword.type = isHidden ? 'text' : 'password';
  eyeShow.classList.toggle('hidden', isHidden);
  eyeHide.classList.toggle('hidden', !isHidden);
});

// ══════════════════════════════════════════════
//  ENVÍO
// ══════════════════════════════════════════════
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const cedula   = inputCedula.value.trim();
  const nombre   = inputNombre.value.trim();
  const telefono = inputTelefono.value.trim();
  const email    = inputEmail.value.trim();
  const password = inputPassword.value;
  const { score } = calcPassword(password);

  let hasError = false;

  if (!cedula || cedula.length !== 10 || !validarCedula(cedula)) {
    wrapError(wrapCedula, okCedula, errCedula); hasError = true;
  }
  if (!nombre || nombre.trim().length < 3) {
    wrapError(wrapNombre, okNombre, errNombre); hasError = true;
  }
  if (!telefono || telefono.length !== 10) {
    wrapError(wrapTelefono, okTelefono, errTelefono); hasError = true;
  }
  if (!email || !REGEX_EMAIL.test(email)) {
    wrapError(wrapEmail, okEmail, errEmail); hasError = true;
  }
  if (score < 5) {
    wrapPassword.classList.add('has-error'); wrapPassword.classList.remove('is-valid'); hasError = true;
  }
  if (captchaState !== 'verified') {
    const card = document.getElementById('turnstile-card');
    if(card) card.style.borderColor = '#ef4444';
    hasError = true;
  } else {
    const card = document.getElementById('turnstile-card');
    if(card) card.style.borderColor = '';
  }

  if (hasError) {
    showToast('Revisa el formulario', 'Hay campos incompletos o con errores.', 'error');
    return;
  }

  document.getElementById('success-avatar').textContent  = nombre.charAt(0).toUpperCase();
  document.getElementById('success-nombre').textContent  = nombre;
  document.getElementById('success-email').textContent   = email;
  document.getElementById('success-email-2').textContent = email;
  mainLayout.classList.add('hidden');
  successScreen.classList.remove('hidden');
  showToast('¡Registro completado!', `Bienvenido, ${nombre.split(' ')[0]}. Tu cuenta ha sido creada.`, 'success', 5000);
});

// ══════════════════════════════════════════════
//  RESETEAR TODO
// ══════════════════════════════════════════════
btnVolver.addEventListener('click', function () {
  form.reset();
  [wrapCedula,wrapNombre,wrapTelefono,wrapEmail,wrapPassword]
    .forEach(w => w.classList.remove('has-error','is-valid'));
  [okCedula,errCedula,okNombre,errNombre,okTelefono,errTelefono,okEmail,errEmail]
    .forEach(i => i?.classList.add('hidden'));
  ['pop-cedula','pop-nombre','pop-telefono','pop-email','pop-password']
    .forEach(id => closePop(id));

  strengthBg.classList.add('hidden');
  strengthLabel.classList.add('hidden');
  strengthBar.style.width = '0';
  inputPassword.type = 'password';
  eyeShow.classList.remove('hidden');
  eyeHide.classList.add('hidden');
  successScreen.classList.add('hidden');
  mainLayout.classList.remove('hidden');

  captchaState = 'idle';
  const turnstileCard = document.getElementById('turnstile-card');
  const turnstileCheckbox = document.getElementById('turnstile-checkbox');
  const turnstileCheck = document.getElementById('turnstile-check');
  if (turnstileCard) {
    turnstileCard.className = 'turnstile-card';
    turnstileCard.style.borderColor = '';
  }
  if (turnstileCheckbox) turnstileCheckbox.className = 'turnstile-checkbox';
  if (turnstileCheck) turnstileCheck.classList.add('hidden');
});

// ══════════════════════════════════════════════
//  VOLVER AL LOGIN
// ══════════════════════════════════════════════
document.getElementById('go-login').addEventListener('click', function(e) {
  e.preventDefault();
  document.getElementById('login-redirect-modal').classList.remove('hidden');
  
  setTimeout(() => {
    showToast('Redirección simulada', 'En un entorno real, esto te llevaría a login.html', 'success');
    document.getElementById('login-redirect-modal').classList.add('hidden');
  }, 2000);
});

// ══════════════════════════════════════════════
//  CAPTCHA ESTILO CLOUDFLARE TURNSTILE
// ══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  // Inicializa Lucide Icons
  lucide.createIcons();
  // Elementos DOM del Checkbox
  const turnstileCard = document.getElementById('turnstile-card');
  const turnstileCheckbox = document.getElementById('turnstile-checkbox');
  const turnstileCheck = document.getElementById('turnstile-check');
  const turnstileSpinner = document.getElementById('turnstile-spinner');
  // Elementos DOM del Modal Captcha
  const captchaModal = document.getElementById('captcha-modal');
  const closeCaptchaModal = document.getElementById('close-captcha-modal');
  const captchaGrid = document.getElementById('captcha-grid');
  const refreshGridCaptchaBtn = document.getElementById('refresh-grid-captcha');
  const verifyGridCaptchaBtn = document.getElementById('verify-grid-captcha');
  const captchaTargetLabel = document.getElementById('captcha-target-label');
  const gridCaptchaError = document.getElementById('grid-captcha-error');
  const gridCaptchaSuccess = document.getElementById('grid-captcha-success');
  // Estado del Captcha
  let isCaptchaVerified = false;
  let isCheckingRobot = false;
  let currentTargetCategory = null;
  let gridItems = [];
  let selectedIndices = [];
  // Categorías de imágenes
  const CAPTCHA_CATEGORIES = [
    { id: 'gato', label: 'Gato' },
    { id: 'perro', label: 'Perro' },
    { id: 'auto', label: 'Automóvil' },
    { id: 'montaña', label: 'Montaña' },
    { id: 'computadora', label: 'Computadora' }
  ];
  // Base de datos de imágenes
  const IMAGES_DATABASE = [
    // Gatos
    { id: 1, category: 'gato', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&h=150&fit=crop&q=60' },
    { id: 2, category: 'gato', url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=150&h=150&fit=crop&q=60' },
    { id: 3, category: 'gato', url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=150&h=150&fit=crop&q=60' },
    // Perros
    { id: 4, category: 'perro', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=150&h=150&fit=crop&q=60' },
    { id: 5, category: 'perro', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=150&h=150&fit=crop&q=60' },
    { id: 6, category: 'perro', url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=150&h=150&fit=crop&q=60' },
    // Autos
    { id: 7, category: 'auto', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=150&h=150&fit=crop&q=60' },
    { id: 8, category: 'auto', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=150&h=150&fit=crop&q=60' },
    { id: 9, category: 'auto', url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=150&h=150&fit=crop&q=60' },
    // Montañas
    { id: 10, category: 'montaña', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=150&h=150&fit=crop&q=60' },
    { id: 11, category: 'montaña', url: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=150&h=150&fit=crop&q=60' },
    { id: 12, category: 'montaña', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=150&h=150&fit=crop&q=60' },
    // Computadoras
    { id: 13, category: 'computadora', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=150&h=150&fit=crop&q=60' },
    { id: 14, category: 'computadora', url: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=150&h=150&fit=crop&q=60' },
    { id: 15, category: 'computadora', url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=150&h=150&fit=crop&q=60' }
  ];
  function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  // Carga las imágenes y la categoría a adivinar
  function initGridCaptcha() {
    gridCaptchaError.classList.add('hidden');
    gridCaptchaSuccess.classList.add('hidden');
    selectedIndices = [];
    verifyGridCaptchaBtn.disabled = true;
    // Categoría aleatoria
    const targetIndex = Math.floor(Math.random() * CAPTCHA_CATEGORIES.length);
    currentTargetCategory = CAPTCHA_CATEGORIES[targetIndex];
    captchaTargetLabel.innerText = currentTargetCategory.label;
    // Mezclar: 3 correctas y 6 incorrectas
    const targetImages = IMAGES_DATABASE.filter(img => img.category === currentTargetCategory.id);
    const selectedTargets = shuffleArray(targetImages).slice(0, 3);
    const otherImages = IMAGES_DATABASE.filter(img => img.category !== currentTargetCategory.id);
    const selectedOthers = shuffleArray(otherImages).slice(0, 6);
    gridItems = shuffleArray([...selectedTargets, ...selectedOthers]);
    // Renderizar la cuadrícula
    captchaGrid.innerHTML = '';
    gridItems.forEach((item, index) => {
      const cell = document.createElement('div');
      cell.className = 'captcha-item';
      cell.dataset.index = index;
      cell.innerHTML = `
        <img src="${item.url}" alt="captcha-img-${index}" loading="lazy">
        <div class="captcha-check-overlay">
          <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
      `;
      cell.addEventListener('click', () => {
        if (isCaptchaVerified) return;
        cell.classList.toggle('selected');
        const idx = parseInt(cell.dataset.index, 10);
        const existingIdx = selectedIndices.indexOf(idx);
        if (existingIdx > -1) {
          selectedIndices.splice(existingIdx, 1);
        } else {
          selectedIndices.push(idx);
        }
        // Habilita el botón solo si seleccionó exactamente 3
        verifyGridCaptchaBtn.disabled = selectedIndices.length !== 3;
      });
      captchaGrid.appendChild(cell);
    });
  }
  function resetCaptcha() {
    isCaptchaVerified = false;
    isCheckingRobot = false;
    turnstileCard.className = 'turnstile-card';
    turnstileCheckbox.className = 'turnstile-checkbox';
    turnstileCheck.classList.add('hidden');
    turnstileSpinner.classList.add('hidden');
    captchaModal.classList.add('hidden');
  }
  // Click en checkbox
  turnstileCheckbox.addEventListener('click', () => {
    if (isCaptchaVerified || isCheckingRobot) return;
    isCheckingRobot = true;
    turnstileCheckbox.classList.add('loading');
    turnstileSpinner.classList.remove('hidden');
    setTimeout(() => {
      initGridCaptcha();
      captchaModal.classList.remove('hidden');
      lucide.createIcons();
    }, 500);
  });
  // Cancelar captcha
  function closeCaptcha() {
    captchaModal.classList.add('hidden');
    isCheckingRobot = false;
    turnstileCheckbox.classList.remove('loading');
    turnstileSpinner.classList.add('hidden');
  }
  closeCaptchaModal.addEventListener('click', closeCaptcha);
  refreshGridCaptchaBtn.addEventListener('click', initGridCaptcha);
  // Verificar selección
  verifyGridCaptchaBtn.addEventListener('click', () => {
    if (selectedIndices.length !== 3) return;
    const allCorrect = selectedIndices.every(idx => gridItems[idx].category === currentTargetCategory.id);
    if (allCorrect) {
      isCaptchaVerified = true;
      isCheckingRobot = false;
      gridCaptchaSuccess.classList.remove('hidden');
      gridCaptchaError.classList.add('hidden');
      verifyGridCaptchaBtn.disabled = true;
      // Actualizamos estado original para que form formVerificar lo lea
      captchaState = 'verified';
      setTimeout(() => {
        captchaModal.classList.add('hidden');
        turnstileCheckbox.classList.remove('loading');
        turnstileSpinner.classList.add('hidden');
        turnstileCheckbox.classList.add('success');
        turnstileCheck.classList.remove('hidden');
        turnstileCard.classList.add('verified');
        lucide.createIcons();
      }, 500);
    } else {
      isCaptchaVerified = false;
      gridCaptchaError.classList.remove('hidden');
      gridCaptchaSuccess.classList.add('hidden');
      setTimeout(() => {
        initGridCaptcha();
      }, 1000);
    }
  });
});
