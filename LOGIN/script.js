document.addEventListener('DOMContentLoaded', () => {
  // Inicializar Lucide Icons al cargar la página
  lucide.createIcons();

  // --- ELEMENTOS DEL DOM ---
  const loginForm = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const togglePwdBtn = document.getElementById('toggle-pwd-btn');
  const eyeIconShow = document.getElementById('eye-icon-show');
  const eyeIconHide = document.getElementById('eye-icon-hide');
  const submitBtn = document.getElementById('submit-btn');
  const errorAlert = document.getElementById('error-alert');

  // Lockout Banner
  const lockoutBanner = document.getElementById('lockout-banner');
  const lockoutTimer = document.getElementById('lockout-timer');

  // Barra de fuerza de la contraseña
  const strengthBarBg = document.getElementById('strength-bar-bg');
  const strengthBar = document.getElementById('strength-bar');

  // Popover absoluto de requisitos
  const requirementsPopover = document.getElementById('requirements-popover');
  const reqLength = document.getElementById('req-length');
  const reqUpper = document.getElementById('req-upper');
  const reqLower = document.getElementById('req-lower');
  const reqNumber = document.getElementById('req-number');
  const reqSpecial = document.getElementById('req-special');

  // Checkbox Turnstile 'No soy un robot'
  const turnstileCard = document.getElementById('turnstile-card');
  const turnstileCheckbox = document.getElementById('turnstile-checkbox');
  const turnstileCheck = document.getElementById('turnstile-check');
  const turnstileSpinner = document.getElementById('turnstile-spinner');

  // Modal de Captcha de Selección de Imágenes
  const captchaModal = document.getElementById('captcha-modal');
  const closeCaptchaModal = document.getElementById('close-captcha-modal');
  const captchaGrid = document.getElementById('captcha-grid');
  const refreshGridCaptchaBtn = document.getElementById('refresh-grid-captcha');
  const verifyGridCaptchaBtn = document.getElementById('verify-grid-captcha');
  const captchaTargetLabel = document.getElementById('captcha-target-label');
  const gridCaptchaError = document.getElementById('grid-captcha-error');
  const gridCaptchaSuccess = document.getElementById('grid-captcha-success');

  // Shortcuts Demo
  const demoStudentBtn = document.getElementById('demo-student-btn');
  const demoTeacherBtn = document.getElementById('demo-teacher-btn');

  // Modal recuperar contraseña (Multipaso)
  const forgotModal = document.getElementById('forgot-modal');
  const openForgotModalLink = document.getElementById('open-forgot-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const cancelModalBtn = document.getElementById('cancel-modal-btn');
  const forgotForm = document.getElementById('forgot-form');
  const recoveryEmailInput = document.getElementById('recovery-email');
  const recoveryError = document.getElementById('recovery-error');
  
  const modalInitialState = document.getElementById('modal-initial-state');
  const modalCodeState = document.getElementById('modal-code-state');
  const modalResetState = document.getElementById('modal-reset-state');
  const modalSuccessState = document.getElementById('modal-success-state');
  
  const sentCodeEmail = document.getElementById('sent-code-email');
  const simulationCodeValue = document.getElementById('simulation-code-value');
  const codeVerificationForm = document.getElementById('code-verification-form');
  const recoveryCodeInput = document.getElementById('recovery-code');
  const codeError = document.getElementById('code-error');
  const backToEmailBtn = document.getElementById('back-to-email-btn');
  
  const resetPasswordForm = document.getElementById('reset-password-form');
  const resetError = document.getElementById('reset-error');
  const recoveryNewPwdInput = document.getElementById('recovery-new-pwd');
  const recoveryConfirmPwdInput = document.getElementById('recovery-confirm-pwd');
  const doneModalBtn = document.getElementById('done-modal-btn');

  // Selectores para la validación de contraseña en recuperación
  const recRequirementsPopover = document.getElementById('rec-requirements-popover');
  const recReqLength = document.getElementById('rec-req-length');
  const recReqUpper = document.getElementById('rec-req-upper');
  const recReqLower = document.getElementById('rec-req-lower');
  const recReqNumber = document.getElementById('rec-req-number');
  const recReqSpecial = document.getElementById('rec-req-special');
  
  const recStrengthBarBg = document.getElementById('rec-strength-bar-bg');
  const recStrengthBar = document.getElementById('rec-strength-bar');

  // Botones de mostrar/ocultar contraseña en recuperación
  const toggleRecPwdBtn = document.getElementById('toggle-rec-pwd-btn');
  const recEyeIconShow = document.getElementById('rec-eye-icon-show');
  const recEyeIconHide = document.getElementById('rec-eye-icon-hide');

  const toggleRecConfirmPwdBtn = document.getElementById('toggle-rec-confirm-pwd-btn');
  const recConfirmEyeIconShow = document.getElementById('rec-confirm-eye-icon-show');
  const recConfirmEyeIconHide = document.getElementById('rec-confirm-eye-icon-hide');

  // Modal Éxito Inicio de Sesión
  const successModal = document.getElementById('success-modal');
  const successDoneBtn = document.getElementById('success-done-btn');
  const successWelcomeMessage = document.getElementById('success-welcome-message');

  // --- VARIABLES DE ESTADO ---
  let failedAttempts = 0;
  let lockoutTime = null;
  let isCaptchaVerified = false;
  let isCheckingRobot = false;
  let countdownInterval = null;
  let generatedRecoveryCode = '';
  let recoveringEmail = '';

  // --- INICIALIZAR ESTADOS ---
  const savedAttempts = localStorage.getItem('yavirac_login_attempts');
  const savedLockout = localStorage.getItem('yavirac_lockout_until');

  if (savedAttempts) failedAttempts = parseInt(savedAttempts, 10);

  if (savedLockout) {
    const lockoutTs = parseInt(savedLockout, 10);
    if (lockoutTs > Date.now()) {
      startLockout(lockoutTs);
    } else {
      localStorage.removeItem('yavirac_lockout_until');
      localStorage.setItem('yavirac_login_attempts', '0');
      failedAttempts = 0;
    }
  }

  // --- CAPTCHA DE SELECCIÓN DE IMÁGENES EN MODAL FLOTANTE (ESTILO RECAPTCHA) ---
  const CAPTCHA_CATEGORIES = [
    { id: 'gato', label: 'Gato' },
    { id: 'perro', label: 'Perro' },
    { id: 'auto', label: 'Automóvil' },
    { id: 'montaña', label: 'Montaña' },
    { id: 'computadora', label: 'Computadora' }
  ];

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

  let currentTargetCategory = null;
  let gridItems = [];
  let selectedIndices = [];

  function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function initGridCaptcha() {
    gridCaptchaError.classList.add('hidden');
    gridCaptchaSuccess.classList.add('hidden');
    selectedIndices = [];
    verifyGridCaptchaBtn.disabled = true;

    // Seleccionar una categoría objetivo aleatoria
    const targetIndex = Math.floor(Math.random() * CAPTCHA_CATEGORIES.length);
    currentTargetCategory = CAPTCHA_CATEGORIES[targetIndex];
    captchaTargetLabel.innerText = currentTargetCategory.label;

    // Crear la mezcla de 9 imágenes:
    // 3 de la categoría objetivo
    const targetImages = IMAGES_DATABASE.filter(img => img.category === currentTargetCategory.id);
    const selectedTargets = shuffleArray(targetImages).slice(0, 3);

    // 6 de otras categorías
    const otherImages = IMAGES_DATABASE.filter(img => img.category !== currentTargetCategory.id);
    const selectedOthers = shuffleArray(otherImages).slice(0, 6);

    // Unificar y mezclar
    gridItems = shuffleArray([...selectedTargets, ...selectedOthers]);

    // Limpiar y dibujar la cuadrícula
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

        // Habilitar botón de verificación al elegir exactamente 3
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

  // Clic en checkbox Turnstile (Lanza el modal)
  turnstileCheckbox.addEventListener('click', (e) => {
    if (e) e.preventDefault();
    if (isCaptchaVerified || isCheckingRobot) return;

    isCheckingRobot = true;
    errorAlert.classList.add('hidden');

    // Cambiar estado visual del checkbox a cargando
    turnstileCheckbox.classList.add('loading');
    turnstileSpinner.classList.remove('hidden');

    // Retardo sutil para abrir el modal flotante
    setTimeout(() => {
      initGridCaptcha();
      captchaModal.classList.remove('hidden');
      lucide.createIcons();
    }, 500);
  });

  // Accesibilidad para checkbox
  turnstileCheckbox.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      turnstileCheckbox.click();
    }
  });

  // Cerrar el modal (cancela el captcha)
  function closeCaptcha() {
    captchaModal.classList.add('hidden');
    isCheckingRobot = false;
    turnstileCheckbox.classList.remove('loading');
    turnstileSpinner.classList.add('hidden');
  }

  closeCaptchaModal.addEventListener('click', closeCaptcha);

  // Cerrar el modal al hacer clic en el overlay exterior
  captchaModal.addEventListener('click', (e) => {
    if (e.target === captchaModal) closeCaptcha();
  });

  refreshGridCaptchaBtn.addEventListener('click', () => {
    initGridCaptcha();
  });

  verifyGridCaptchaBtn.addEventListener('click', () => {
    if (selectedIndices.length !== 3) return;

    // Verificar si todos los elementos elegidos son correctos
    const allCorrect = selectedIndices.every(idx => gridItems[idx].category === currentTargetCategory.id);

    if (allCorrect) {
      isCaptchaVerified = true;
      isCheckingRobot = false;
      gridCaptchaSuccess.classList.remove('hidden');
      gridCaptchaError.classList.add('hidden');
      verifyGridCaptchaBtn.disabled = true;

      // Cerrar modal tras éxito con retardo de 500ms
      setTimeout(() => {
        captchaModal.classList.add('hidden');
        turnstileCheckbox.classList.remove('loading');
        turnstileSpinner.classList.add('hidden');
        turnstileCheckbox.classList.add('success');
        turnstileCheck.classList.remove('hidden');
        turnstileCard.classList.add('verified');
        lucide.createIcons();
        errorAlert.classList.add('hidden');
      }, 500);
    } else {
      isCaptchaVerified = false;
      gridCaptchaError.classList.remove('hidden');
      gridCaptchaSuccess.classList.add('hidden');

      // Esperar 1 segundo y refrescar imágenes
      setTimeout(() => {
        initGridCaptcha();
      }, 1000);
    }
  });

  // --- MOSTRAR / OCULTAR CONTRASEÑA ---
  togglePwdBtn.addEventListener('click', () => {
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIconShow.classList.add('hidden');
      eyeIconHide.classList.remove('hidden');
    } else {
      passwordInput.type = 'password';
      eyeIconShow.classList.remove('hidden');
      eyeIconHide.classList.add('hidden');
    }
  });

  // --- VALIDACIÓN DINÁMICA DE LA CONTRASEÑA ---
  function updateReqUI(element, isValid) {
    const checkIcon = element.querySelector('.req-check-icon');
    const xIcon = element.querySelector('.req-x-icon');

    if (isValid) {
      element.className = 'req-item req-valid';
      checkIcon.classList.remove('hidden');
      xIcon.classList.add('hidden');
    } else {
      element.className = 'req-item req-invalid';
      checkIcon.classList.add('hidden');
      xIcon.classList.remove('hidden');
    }
  }

  passwordInput.addEventListener('focus', () => {
    if (passwordInput.value.length > 0) {
      requirementsPopover.classList.remove('hidden');
    }
  });

  passwordInput.addEventListener('blur', () => {
    setTimeout(() => {
      requirementsPopover.classList.add('hidden');
    }, 180);
  });

  passwordInput.addEventListener('input', () => {
    const val = passwordInput.value;

    if (val.length > 0) {
      strengthBarBg.classList.remove('hidden');
      if (document.activeElement === passwordInput) {
        requirementsPopover.classList.remove('hidden');
      }
    } else {
      strengthBarBg.classList.add('hidden');
      requirementsPopover.classList.add('hidden');
    }

    const hasUpper = /[A-Z]/.test(val);
    const hasLower = /[a-z]/.test(val);
    const hasNumber = /[0-9]/.test(val);
    const hasSpecial = /[^A-Za-z0-9]/.test(val);
    const hasMinLen = val.length >= 8;

    updateReqUI(reqLength, hasMinLen);
    updateReqUI(reqUpper, hasUpper);
    updateReqUI(reqLower, hasLower);
    updateReqUI(reqNumber, hasNumber);
    updateReqUI(reqSpecial, hasSpecial);

    // Calcular barra de fuerza
    const strengthScore = [hasUpper, hasLower, hasNumber, hasSpecial, hasMinLen].filter(Boolean).length;
    strengthBar.style.width = `${(strengthScore / 5) * 100}%`;

    const isPasswordValid = hasUpper && hasLower && hasNumber && hasSpecial && hasMinLen;

    if (isPasswordValid) {
      strengthBar.style.backgroundColor = '#16a34a';
    } else if (strengthScore <= 2) {
      strengthBar.style.backgroundColor = '#ef4444';
    } else {
      strengthBar.style.backgroundColor = '#f59e0b';
    }
  });

  // --- SHORTCUTS DEMO ---
  demoStudentBtn.addEventListener('click', () => {
    emailInput.value = 'estudiante@test.com';
    passwordInput.value = localStorage.getItem('estudiante@test.com_password') || '12345@Ab';
    passwordInput.dispatchEvent(new Event('input'));
    resetCaptcha();
    errorAlert.classList.add('hidden');
    
    // Forzar el ocultado del popover de requisitos en la demo
    requirementsPopover.classList.add('hidden');
    strengthBarBg.classList.add('hidden');
  });

  demoTeacherBtn.addEventListener('click', () => {
    emailInput.value = 'docente@test.com';
    passwordInput.value = localStorage.getItem('docente@test.com_password') || '12345Ab@';
    passwordInput.dispatchEvent(new Event('input'));
    resetCaptcha();
    errorAlert.classList.add('hidden');
    
    // Forzar el ocultado del popover de requisitos en la demo
    requirementsPopover.classList.add('hidden');
    strengthBarBg.classList.add('hidden');
  });

  // --- MODAL DE RECUPERAR CONTRASEÑA ---
  function openModal() {
    resetForgotModal();
    forgotModal.classList.remove('hidden');
    recoveryEmailInput.focus();
  }

  function closeModal() {
    forgotModal.classList.add('hidden');
    resetForgotModal();
  }

  function resetForgotModal() {
    recoveryEmailInput.value = '';
    recoveryCodeInput.value = '';
    recoveryNewPwdInput.value = '';
    recoveryConfirmPwdInput.value = '';
    
    recoveryNewPwdInput.type = 'password';
    recoveryConfirmPwdInput.type = 'password';
    if (recEyeIconShow) recEyeIconShow.classList.remove('hidden');
    if (recEyeIconHide) recEyeIconHide.classList.add('hidden');
    if (recConfirmEyeIconShow) recConfirmEyeIconShow.classList.remove('hidden');
    if (recConfirmEyeIconHide) recConfirmEyeIconHide.classList.add('hidden');
    
    recoveryError.classList.add('hidden');
    recoveryError.innerText = '';
    codeError.classList.add('hidden');
    codeError.innerText = '';
    resetError.classList.add('hidden');
    resetError.innerText = '';

    modalInitialState.classList.remove('hidden');
    modalCodeState.classList.add('hidden');
    modalResetState.classList.add('hidden');
    modalSuccessState.classList.add('hidden');

    if (recStrengthBarBg) recStrengthBarBg.classList.add('hidden');
    if (recRequirementsPopover) recRequirementsPopover.classList.add('hidden');

    // Resetear checklist de recuperación a inválido por defecto
    const listItems = [recReqLength, recReqUpper, recReqLower, recReqNumber, recReqSpecial];
    listItems.forEach(item => {
      if (item) {
        item.className = 'req-item req-invalid';
        const checkIcon = item.querySelector('.req-check-icon');
        const xIcon = item.querySelector('.req-x-icon');
        if (checkIcon) checkIcon.classList.add('hidden');
        if (xIcon) xIcon.classList.remove('hidden');
      }
    });

    const sendBtn = document.getElementById('send-code-btn');
    if (sendBtn) {
      sendBtn.disabled = false;
      sendBtn.innerText = 'Enviar código';
    }
    
    const verifyBtn = document.getElementById('verify-code-btn');
    if (verifyBtn) {
      verifyBtn.disabled = false;
      verifyBtn.innerText = 'Verificar código';
    }
    
    const saveBtn = document.getElementById('save-new-pwd-btn');
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerText = 'Restablecer contraseña';
    }
  }

  openForgotModalLink.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });

  closeModalBtn.addEventListener('click', closeModal);
  cancelModalBtn.addEventListener('click', closeModal);
  doneModalBtn.addEventListener('click', closeModal);

  forgotModal.addEventListener('click', (e) => {
    if (e.target === forgotModal) closeModal();
  });

  // Limpiar errores al escribir
  recoveryEmailInput.addEventListener('input', () => {
    recoveryError.classList.add('hidden');
  });

  recoveryCodeInput.addEventListener('input', () => {
    codeError.classList.add('hidden');
  });

  recoveryNewPwdInput.addEventListener('input', () => {
    resetError.classList.add('hidden');
  });

  recoveryConfirmPwdInput.addEventListener('input', () => {
    resetError.classList.add('hidden');
  });

  // --- VALIDACIÓN DINÁMICA DE LA CONTRASEÑA EN RECUPERACIÓN ---
  recoveryNewPwdInput.addEventListener('focus', () => {
    if (recoveryNewPwdInput.value.length > 0) {
      recRequirementsPopover.classList.remove('hidden');
    }
  });

  recoveryNewPwdInput.addEventListener('blur', () => {
    setTimeout(() => {
      recRequirementsPopover.classList.add('hidden');
    }, 180);
  });

  recoveryNewPwdInput.addEventListener('input', () => {
    const val = recoveryNewPwdInput.value;

    if (val.length > 0) {
      recStrengthBarBg.classList.remove('hidden');
      if (document.activeElement === recoveryNewPwdInput) {
        recRequirementsPopover.classList.remove('hidden');
      }
    } else {
      recStrengthBarBg.classList.add('hidden');
      recRequirementsPopover.classList.add('hidden');
    }

    const hasUpper = /[A-Z]/.test(val);
    const hasLower = /[a-z]/.test(val);
    const hasNumber = /[0-9]/.test(val);
    const hasSpecial = /[^A-Za-z0-9]/.test(val);
    const hasMinLen = val.length >= 8;

    updateReqUI(recReqLength, hasMinLen);
    updateReqUI(recReqUpper, hasUpper);
    updateReqUI(recReqLower, hasLower);
    updateReqUI(recReqNumber, hasNumber);
    updateReqUI(recReqSpecial, hasSpecial);

    // Calcular barra de fuerza
    const strengthScore = [hasUpper, hasLower, hasNumber, hasSpecial, hasMinLen].filter(Boolean).length;
    recStrengthBar.style.width = `${(strengthScore / 5) * 100}%`;

    const isPasswordValid = hasUpper && hasLower && hasNumber && hasSpecial && hasMinLen;

    if (isPasswordValid) {
      recStrengthBar.style.backgroundColor = '#16a34a';
    } else if (strengthScore <= 2) {
      recStrengthBar.style.backgroundColor = '#ef4444';
    } else {
      recStrengthBar.style.backgroundColor = '#f59e0b';
    }
  });

  // --- MOSTRAR / OCULTAR CONTRASEÑA EN RECUPERACIÓN ---
  toggleRecPwdBtn.addEventListener('click', () => {
    if (recoveryNewPwdInput.type === 'password') {
      recoveryNewPwdInput.type = 'text';
      recEyeIconShow.classList.add('hidden');
      recEyeIconHide.classList.remove('hidden');
    } else {
      recoveryNewPwdInput.type = 'password';
      recEyeIconShow.classList.remove('hidden');
      recEyeIconHide.classList.add('hidden');
    }
  });

  toggleRecConfirmPwdBtn.addEventListener('click', () => {
    if (recoveryConfirmPwdInput.type === 'password') {
      recoveryConfirmPwdInput.type = 'text';
      recConfirmEyeIconShow.classList.add('hidden');
      recConfirmEyeIconHide.classList.remove('hidden');
    } else {
      recoveryConfirmPwdInput.type = 'password';
      recConfirmEyeIconShow.classList.remove('hidden');
      recConfirmEyeIconHide.classList.add('hidden');
    }
  });

  // Paso 1: Enviar código al correo registrado
  forgotForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = recoveryEmailInput.value.trim().toLowerCase();
    
    // Validar si el correo ingresado está registrado
    if (email !== 'estudiante@test.com' && email !== 'docente@test.com') {
      recoveryError.innerText = 'El correo institucional ingresado no está registrado.';
      recoveryError.classList.remove('hidden');
      return;
    }

    const sendBtn = document.getElementById('send-code-btn');
    sendBtn.disabled = true;
    sendBtn.innerText = 'Enviando...';

    setTimeout(() => {
      // Generar código de 6 dígitos
      generatedRecoveryCode = Math.floor(100000 + Math.random() * 900000).toString();
      recoveringEmail = email;

      // Actualizar interfaz
      sentCodeEmail.innerText = email;
      simulationCodeValue.innerText = generatedRecoveryCode;

      modalInitialState.classList.add('hidden');
      modalCodeState.classList.remove('hidden');
      recoveryCodeInput.focus();
      
      lucide.createIcons();
    }, 1000);
  });

  // Volver del paso 2 al paso 1
  backToEmailBtn.addEventListener('click', () => {
    modalCodeState.classList.add('hidden');
    modalInitialState.classList.remove('hidden');
    recoveryEmailInput.focus();
  });

  // Paso 2: Verificar el código de 6 dígitos
  codeVerificationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const enteredCode = recoveryCodeInput.value.trim();

    if (enteredCode !== generatedRecoveryCode) {
      codeError.innerText = 'El código de verificación es incorrecto. Inténtalo de nuevo.';
      codeError.classList.remove('hidden');
      return;
    }

    const verifyBtn = document.getElementById('verify-code-btn');
    verifyBtn.disabled = true;
    verifyBtn.innerText = 'Verificando...';

    setTimeout(() => {
      modalCodeState.classList.add('hidden');
      modalResetState.classList.remove('hidden');
      recoveryNewPwdInput.focus();
      lucide.createIcons();
    }, 800);
  });

  // Paso 3: Restablecer contraseña
  resetPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newPwd = recoveryNewPwdInput.value;
    const confirmPwd = recoveryConfirmPwdInput.value;

    if (newPwd !== confirmPwd) {
      resetError.innerText = 'Las contraseñas no coinciden.';
      resetError.classList.remove('hidden');
      return;
    }

    // Validar requisitos de la contraseña
    const hasUpper = /[A-Z]/.test(newPwd);
    const hasLower = /[a-z]/.test(newPwd);
    const hasNumber = /[0-9]/.test(newPwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(newPwd);
    const hasMinLen = newPwd.length >= 8;
    const isPasswordValid = hasUpper && hasLower && hasNumber && hasSpecial && hasMinLen;

    if (!isPasswordValid) {
      resetError.innerText = 'La contraseña no cumple con los requisitos de seguridad.';
      resetError.classList.remove('hidden');
      return;
    }

    const saveBtn = document.getElementById('save-new-pwd-btn');
    saveBtn.disabled = true;
    saveBtn.innerText = 'Guardando...';

    setTimeout(() => {
      // Guardar la nueva contraseña en localStorage
      localStorage.setItem(recoveringEmail + '_password', newPwd);

      modalResetState.classList.add('hidden');
      modalSuccessState.classList.remove('hidden');
      lucide.createIcons();
    }, 1000);
  });

  // --- CONTROL DE BLOQUEO (LOCKOUT) ---
  function startLockout(untilTimestamp) {
    lockoutTime = untilTimestamp;
    errorAlert.classList.add('hidden');
    lockoutBanner.classList.remove('hidden');
    loginForm.classList.add('hidden');
    submitBtn.disabled = true;

    if (countdownInterval) clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
      const now = Date.now();
      const diff = lockoutTime - now;

      if (diff <= 0) {
        clearInterval(countdownInterval);
        lockoutTime = null;
        failedAttempts = 0;
        localStorage.removeItem('yavirac_lockout_until');
        localStorage.setItem('yavirac_login_attempts', '0');
        lockoutBanner.classList.add('hidden');
        loginForm.classList.remove('hidden');
        submitBtn.disabled = false;
        resetCaptcha();
        errorAlert.classList.add('hidden');
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        lockoutTimer.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
    }, 1000);
  }

  // --- INICIO DE SESIÓN ---
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    errorAlert.classList.add('hidden');

    if (lockoutTime && lockoutTime > Date.now()) {
      errorAlert.innerText = 'El acceso está temporalmente bloqueado.';
      errorAlert.classList.remove('hidden');
      return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // 1. VALIDAR CORREO VÁLIDO
    if (!emailInput.checkValidity() || email.length === 0) {
      errorAlert.innerText = 'Por favor, ingresa un correo institucional válido.';
      errorAlert.classList.remove('hidden');
      return;
    }

    // 2. VALIDAR REQUISITOS CONTRASEÑA
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const hasMinLen = password.length >= 8;
    const isPasswordValid = hasUpper && hasLower && hasNumber && hasSpecial && hasMinLen;

    if (!isPasswordValid) {
      errorAlert.innerText = 'La contraseña ingresada no cumple con las políticas de seguridad requeridas.';
      errorAlert.classList.remove('hidden');
      return;
    }

    // 3. VALIDAR CAPTCHA
    if (!isCaptchaVerified) {
      errorAlert.innerText = 'Por favor, realiza la verificación de seguridad (Captcha) primero.';
      errorAlert.classList.remove('hidden');
      return;
    }

    // Si pasa todas las validaciones previas, simular petición
    submitBtn.disabled = true;
    submitBtn.innerText = 'Verificando...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerText = 'Iniciar Sesión';

      const studentPassword = localStorage.getItem('estudiante@test.com_password') || '12345@Ab';
      const teacherPassword = localStorage.getItem('docente@test.com_password') || '12345Ab@';

      if (email === 'estudiante@test.com' && password === studentPassword) {
        const loggedUser = { name: 'Carlos Pérez', email, role: 'Estudiante' };
        localStorage.setItem('yavirac_login_attempts', '0');
        showUserModal(loggedUser);
      } else if (email === 'docente@test.com' && password === teacherPassword) {
        const loggedUser = { name: 'Dra. María López', email, role: 'Docente' };
        localStorage.setItem('yavirac_login_attempts', '0');
        showUserModal(loggedUser);
      } else {
        // Credenciales incorrectas
        failedAttempts += 1;
        localStorage.setItem('yavirac_login_attempts', failedAttempts.toString());

        if (failedAttempts >= 3) {
          const until = Date.now() + 3600 * 1000; // 1 hora
          localStorage.setItem('yavirac_lockout_until', until.toString());
          startLockout(until);
        } else {
          errorAlert.innerText = `Credenciales incorrectas. Te quedan ${3 - failedAttempts} intentos.`;
          errorAlert.classList.remove('hidden');
          resetCaptcha();
        }
      }
    }, 1200);
  });

  // --- MOSTRAR MODAL EXITOSO ---
  function showUserModal(userObj) {
    successWelcomeMessage.innerHTML = `¡Bienvenido de vuelta,<br><strong style="color: #182f59; font-size: 1.05rem; display: inline-block; margin-top: 0.25rem; margin-bottom: 0.375rem;">${userObj.name}</strong>!<br><span style="font-size: 0.725rem; font-weight: 600; color: #f46c22; background: #fff7ed; padding: 0.125rem 0.5rem; border-radius: 9999px; border: 1px solid #ffedd5; display: inline-block; margin-top: 0.25rem;">${userObj.role}</span>`;

    // Mostrar el modal de éxito agregando soporte Lucide
    successModal.classList.remove('hidden');
    lucide.createIcons();
  }

  // --- ENTRAR AL PORTAL / RESET ---
  successDoneBtn.addEventListener('click', () => {
    successModal.classList.add('hidden');
    
    // Limpiar campos y captcha
    emailInput.value = '';
    passwordInput.value = '';
    passwordInput.dispatchEvent(new Event('input'));
    errorAlert.classList.add('hidden');
    resetCaptcha();
  });
});
