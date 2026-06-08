# Yavirac - Sistema de Login Académico Seguro

Este proyecto es un sistema de inicio de sesión académico seguro y premium diseñado para el Instituto Superior YAVIRAC, desarrollado utilizando únicamente tecnologías web nativas: **Vanilla HTML5, CSS3 y JavaScript**.

---

## Características Principales

### 1. Interfaz de Usuario Premium y Ultra-Compacta
* **Diseño Split-Screen:** Una sección izquierda para formularios interactivos y una derecha para la identidad visual de la institución.
* **Paleta de Colores Institucional:** Uso del **Azul Marino Yavirac** (`#182f59`) para elementos principales de marca y **Naranja Yavirac** (`#f46c22`) para focos de acción y botones.
* **Tipografía de Alto Impacto:** Integración de Google Fonts con **Outfit** (para títulos principales con peso `800`) e **Inter** (para textos de lectura, labels e inputs), garantizando una excelente legibilidad.
* **Cero Desplazamiento (Scroll Lock):** El layout está optimizado milimétricamente para ocupar exactamente el alto de la pantalla visual (`100vh`), adaptándose de forma fluida a dispositivos móviles y de escritorio sin generar scroll innecesario.

### 2. Control de Intentos Fallidos (Lockout de 1 Hora)
* Para prevenir ataques de fuerza bruta, el sistema cuenta con un contador de intentos.
* Al acumular **3 intentos erróneos**, el formulario se bloquea por completo.
* Se despliega un banner de seguridad con un **temporizador de cuenta regresiva de 01:00:00 (1 hora)**.
* El estado del temporizador y de intentos se guarda en `localStorage`, por lo que el bloqueo **persiste aun si el usuario recarga la página o cierra el navegador**.

### 3. Validación Fuerte de Contraseña en Tiempo Real
* **Indicador de Requisitos Flotante:** Al hacer clic en el campo de contraseña, aparece un popover flotante absoluto que verifica en tiempo real las reglas de complejidad:
  * Mínimo 8 caracteres.
  * Al menos una letra mayúscula.
  * Al menos una letra minúscula.
  * Al menos un número.
  * Al menos un carácter especial (ej. `@`, `#`, `$`, etc.).
* **Barra de Fuerza Dinámica:** Un indicador visual de 3px de alto justo debajo del input que cambia su color y longitud en tiempo real (Rojo = Débil, Naranja = Medio, Verde = Seguro).
* **Botones de Mostrar/Ocultar Clave:** Botón con iconos integrados para revelar y ocultar la contraseña, evitando errores de tipeo.

### 4. Captcha de Verificación de Imágenes (Estilo reCAPTCHA)
* **Checkbox Turnstile Integrado:** El usuario interactúa con un checkbox de verificación ("No soy un robot") con animación de carga de seguridad.
* **Modal Flotante de Selección:** Abre un modal con una categoría aleatoria de verificación (ej. "Selecciona exactamente las 3 imágenes de: Automóvil").
* **Base de Imágenes Dinámica:** Genera una cuadrícula de 9 fotos aleatorias usando Unsplash. El botón de verificación se habilita únicamente cuando el usuario elige exactamente 3 imágenes.
* El sistema confirma si la selección coincide con la categoría objetivo de forma interactiva y cierra el modal automáticamente al completarlo con éxito.

### 5. Flujo Completo de Recuperación de Contraseña (Multipaso)
* **Paso 1 (Identificación):** Permite ingresar el correo electrónico. Valida si pertenece a un usuario registrado (`estudiante@test.com` o `docente@test.com`).
* **Paso 2 (Código de 6 Dígitos):** Envía un código dinámico simulado al correo institucional del usuario. Se incluye un banner del simulador en pantalla que refleja el código recibido para la validación.
* **Paso 3 (Nueva Contraseña):** Un formulario completo con el mismo validador interactivo de complejidad, barra de fuerza visual y botones de visualización de contraseña.
* **Paso 4 (Confirmación):** Almacena la nueva contraseña en `localStorage` de forma asociada al correo, habilitando el inicio de sesión con las nuevas credenciales de inmediato.

### 6. Chips de Demostración Inteligentes
* Incluye botones rápidos para probar los accesos de **Estudiante** y **Docente**.
* Los chips leen dinámicamente el almacenamiento local, autocompletando el campo de login con la contraseña por defecto o la nueva contraseña restablecida en tiempo real.

---

## Guía de Prueba: Flujo de Recuperar Contraseña

Para validar paso a paso el funcionamiento de la recuperación de contraseña:

1. **Hacer clic en "¿Olvidaste tu contraseña?":** Ubicado debajo del campo de contraseña en el formulario de login.
2. **Ingresar correo registrado (Paso 1):** Digita `estudiante@test.com` o `docente@test.com`. Si ingresas un correo incorrecto, el sistema te mostrará una alerta de error. Presiona **"Enviar código"**.
3. **Verificar Código (Paso 2):** Verás un banner de color azul en el modal simulando la llegada del código a tu bandeja de entrada (`[Simulador] Código recibido: XXXXXX`). Digita este código de 6 dígitos en el campo de texto y haz clic en **"Verificar código"** (también puedes regresar usando el botón "Atrás").
4. **Restablecer Contraseña (Paso 3):**
   - Escribe tu nueva clave y observa cómo interactúa el popover de requisitos dinámicos en tiempo real y cómo cambia de color la barra de fuerza.
   - Digita la misma contraseña en el campo de confirmación.
   - Si lo deseas, presiona los iconos de "ojo" a la derecha de los inputs para verificar visualmente los caracteres.
   - Haz clic en **"Restablecer contraseña"**.
5. **Éxito (Paso 4):** Se desplegará la pantalla de confirmación. Haz clic en **"Iniciar Sesión"** para cerrar el modal.
6. **Autocompletado Dinámico (Prueba):** Haz clic en el botón de demostración (**Estudiante** o **Docente**) correspondiente al correo que recuperaste. Notarás que el formulario ahora se completa de manera automática utilizando tu **nueva contraseña** guardada en `localStorage`.
7. **Verificar Ingreso:** Resuelve el Captcha de imágenes y presiona **"Iniciar Sesión"** para verificar el ingreso exitoso.

## Métricas de Calidad del Software
* **Usabilidad:** Diseño intuitivo con popovers flotantes absolutos que previenen la sobrecarga de información y evitan la necesidad de scroll vertical.
* **Seguridad:** Protección contra fuerza bruta con persistencia en cliente (`localStorage`) y validación de seguridad robusta de contraseñas.
* **Eficiencia:** Carga inmediata al pesar menos de 70 KB en total y cargar dependencias ligeras como Lucide Icons desde CDN de forma asíncrona.
