# Formulario de Registro Yavirac con Captcha Premium

Este proyecto contiene el diseño completo, estilos y lógica para un **Formulario de Registro Estudiantil** premium, destacando métricas de alta calidad, validaciones en tiempo real y un sistema antibots avanzado.

---

## 📈 Métricas de Calidad (Quality Metrics)

El proyecto ha sido desarrollado bajo estrictos estándares de calidad orientados a la experiencia de usuario (UX) y la robustez del código:

1. **Responsividad Extrema (Mobile-First y Adaptable):**
   - Garantía de adaptación a dispositivos ultra-pequeños (360px de ancho) hasta monitores Ultra-Wide.
   - Uso inteligente de `overflow-y` y `max-height` para prevenir el corte de información. Todo contenido superior al viewport permite scroll dinámico natural.
2. **Cero Dependencias Pesadas (Zero-Bloat):**
   - Construido **100% con Vanilla JS, HTML5 y CSS3**. No se utilizan frameworks pesados (como React, Angular o Bootstrap), garantizando un tiempo de carga instantáneo (Performance TTI mínimo).
   - Se emplea únicamente la librería liviana `Lucide` para la renderización de íconos vectoriales escalables.
3. **Feedback Inmediato (Micro-interacciones UX):**
   - Validación visual campo por campo sin esperar al evento "Submit".
   - Sistema de notificaciones estilo *Toasts Apilables* no invasivas.
   - Popovers flotantes que explican claramente el error exacto (ej: falta una mayúscula en la contraseña) en lugar de mensajes de error genéricos.
4. **Código Limpio (Clean Code):**
   - Separación estricta de responsabilidades: HTML (Estructura), CSS (Presentación y Animaciones), y JS (Eventos y Lógica de validación).
   - Variables globales obsoletas eliminadas.
   - Diseño modular preparado para escalar.

---

## ⚙️ Cómo Funciona Todo (Arquitectura y Flujo)

### 1. Motor de Validaciones (Vanilla JS)
Cada campo (`<input>`) posee escuchadores de eventos (`input`, `focus`, `blur`, `keypress`) que disparan funciones específicas:
- **Cédula Ecuatoriana (Algoritmo Módulo 10):**  
  La validación de la cédula no se limita a contar 10 números; ejecuta en tiempo real el algoritmo criptográfico oficial del Registro Civil de Ecuador. Funciona así:
  1. **Región:** Verifica que los primeros 2 dígitos correspondan a una provincia válida (01 a 24, o 30 para ecuatorianos en el exterior).
  2. **Tercer Dígito:** Para personas naturales, el tercer dígito debe ser estrictamente menor a 6 (0, 1, 2, 3, 4, o 5).
  3. **Multiplicación y Suma:** Se toman los primeros 9 dígitos y se multiplican alternadamente por los coeficientes `2` y `1`. Si el resultado de la multiplicación es igual o mayor a 10, se le resta 9. Todos los resultados se suman.
  4. **Dígito Verificador (Módulo 10):** Al total de la suma se le extrae el residuo para llegar a la decena superior (ej: si la suma es 34, faltan 6 para llegar a 40). Este número resultante (6) debe coincidir matemáticamente y de manera exacta con el décimo dígito ingresado por el usuario.
- **Contraseña:** Mientras se escribe, un analizador evalúa mediante Expresiones Regulares (RegEx) 5 parámetros: longitud, mayúsculas, minúsculas, números y símbolos. Solo si todos se cumplen, la barra de seguridad llega al 100%.

### 2. Sistema Captcha de Doble Fase
El mecanismo antibots está inspirado en *Cloudflare Turnstile* y *Google reCAPTCHA*:
- **Fase 1 (Check UI):** El usuario hace clic en el checkbox. Se lanza un *spinner* simulando un análisis de entorno y luego dispara la Fase 2.
- **Fase 2 (Challenge Visual):** 
  - Se extrae una "categoría objetivo" aleatoria (ej: *Gatos*).
  - El algoritmo JS baraja aleatoriamente (*Fisher-Yates Shuffle*) imágenes traídas de una base de datos local (URLs de Unsplash).
  - Renderiza **exactamente 3 imágenes correctas y 6 incorrectas** en una cuadrícula de 3x3.
  - El usuario debe marcar exactamente 3 imágenes. Si el algoritmo verifica que el atributo de categoría de las 3 imágenes coincide con el objetivo, se aprueba la validación y el estado global `captchaState` cambia a `'verified'`.

### 3. Flujo de Envío (Submit Flow)
1. Al hacer clic en **"Completar Registro"**, el formulario previene el envío normal (`e.preventDefault()`).
2. Realiza un barrido (re-check) de todos los campos para asegurarse de que ninguno haya sido evadido (incluyendo que el `captchaState` sea estrictamente `'verified'`).
3. Si hay errores, dispara animaciones rojas en los campos erróneos y lanza un *Toast* notificando al usuario.
4. Si todo es correcto, oculta la vista principal del formulario y muestra la **Pantalla de Éxito**, extrayendo dinámicamente el nombre y correo introducidos para personalizar el mensaje final.

---

## Estructura de Archivos

- `formulario.html`: Define la semántica, campos, modales (Captcha, Pantalla de Éxito, Redirección a Login) e incorpora los SVG básicos.
- `formulario.css`: Orquesta todo el comportamiento visual. Incluye CSS Flexbox/Grid, media queries extremas para responsividad, efectos "glassmorphism", y toda la librería de animaciones personalizadas (keyframes).
- `formulario.js`: Archivo central lógico. Administra el estado global, la creación de Toasts dinámicos en el DOM, los algoritmos de validación de texto y la lógica matemática/visual del Captcha.
