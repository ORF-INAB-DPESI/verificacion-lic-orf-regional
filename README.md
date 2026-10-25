# 🌲 Guía Paso a Paso: Publicación en GitHub Pages y Conexión con Google Drive

**Sistema Digital de Verificación de ORF Regional · Dirección de Planificación Institucional**

---

## Parte 1: Conectar con tu Google Drive y Gmail (100% Gratis)

Para que la plataforma envíe los códigos de verificación (OTP), las notificaciones por correo y guarde automáticamente las carpetas de polígonos georreferenciados y las firmas digitales en tu **Google Drive**, sigue estos pasos:

### Paso 1: Crear el Script en tu cuenta de Google
1. Inicia sesión en tu cuenta de Google (la cuenta donde tienes tu Google Drive institucional o de proyecto).
2. Entra a **[https://script.google.com/](https://script.google.com/)**.
3. Haz clic en el botón **"Nuevo proyecto"** (arriba a la izquierda).
4. Ponle de nombre al proyecto: `Backend_Verificacion_ORF_Regional`.

### Paso 2: Pegar el código del conector
1. Abre el archivo [`google-apps-script/Code.gs`](./google-apps-script/Code.gs) de esta carpeta.
2. Borra el texto por defecto (`function myFunction() {}`) que aparece en la pantalla de Google Apps Script y **pega todo el contenido de `Code.gs`**.
3. Haz clic en el ícono de **Guardar** (💾) o presiona `Ctrl + S`.

### Paso 3: Publicar como Aplicación Web y obtener tu URL
1. Arriba a la derecha, haz clic en el botón azul **"Implementar"** → **"Nueva implementación"**.
2. Al lado de *"Selecciona el tipo"*, haz clic en el ícono de engranaje (⚙️) y marca **"Aplicación web"**.
3. Completa los 3 campos así:
   - **Descripción:** `Conector Drive y Correo ORF`
   - **Ejecutar como:** **`Yo (tu-correo@gmail.com)`** *(Esto permite que el script guarde archivos en tu Drive y envíe correos desde tu cuenta)*.
   - **Quién tiene acceso:** **`Cualquier persona`** *(Para que las sedes regionales y subregionales puedan enviar el formulario sin que les pida permisos de tu Drive)*.
4. Haz clic en **"Implementar"**.
5. Google te pedirá **"Autorizar acceso"**:
   - Selecciona tu cuenta de Google.
   - Si aparece el aviso *"Google no ha verificado esta aplicación"*, haz clic en **"Configuración avanzada"** (abajo a la izquierda) y luego en **"Ir a Backend_Verificacion_ORF_Regional (no seguro)"** → **"Permitir"**.
6. Copia la **URL de la aplicación web** que termina en `/exec` (ejemplo: `https://script.google.com/macros/s/AKfycb.../exec`).

### Paso 4: Vincular la URL en tu plataforma
- Para dejar la URL **fija para todos los usuarios** antes de subir a GitHub:
  1. Abre el archivo [`app.js`](./app.js).
  2. En la línea 119 verás:
     ```javascript
     cloudConfig: {
       gasWebhookUrl: '',
       adminNotifyEmail: 'planificacion.forestal@institucion.gob.gt'
     },
     ```
  3. Pega tu URL entre las comillas de `gasWebhookUrl` y coloca tu correo real en `adminNotifyEmail`:
     ```javascript
     cloudConfig: {
       gasWebhookUrl: 'https://script.google.com/macros/s/TU_CODIGO_AQUI/exec',
       adminNotifyEmail: 'tu-correo@gmail.com'
     },
     ```
- También puedes configurarla desde el navegador entrando al botón **`🔒 Administrador`** (clave: `admin2026`) → **`⚙️ Conexión Drive`**.

---

## Parte 2: Subir y Publicar tu Plataforma en GitHub Pages

### Paso 1: Crear el Repositorio en GitHub
1. Entra a **[https://github.com/](https://github.com/)** e inicia sesión.
2. Haz clic en el botón **`+`** (arriba a la derecha) → **"New repository"**.
3. Escribe el nombre del repositorio, por ejemplo: `verificacion-orf-regional`.
4. Selecciona **Public** y haz clic en **"Create repository"**.

### Paso 2: Subir los archivos del proyecto
Tienes dos formas de subirlos:

#### Opción A: Subida directa desde el navegador web de GitHub (Sin comandos)
1. Dentro de tu repositorio recién creado en GitHub, haz clic en el enlace **"uploading an existing file"**.
2. Arrastra desde tu carpeta los archivos principales:
   - `index.html`
   - `styles.css`
   - `app.js`
3. Haz clic en el botón verde **"Commit changes"**.

#### Opción B: Desde la terminal de este proyecto (Git)
Si deseas subirlo por comandos desde esta carpeta:
```powershell
git add index.html styles.css app.js google-apps-script/Code.gs README.md
git commit -m "Plataforma Sistema Digital de Verificacion de ORF Regional"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/verificacion-orf-regional.git
git push -u origin main
```

### Paso 3: Activar GitHub Pages (Tu enlace web público)
1. En tu repositorio de GitHub, haz clic en la pestaña **"Settings"** (⚙️ arriba).
2. En el menú lateral izquierdo, haz clic en **"Pages"**.
3. En la sección **"Build and deployment"** → **"Branch"**:
   - Cambia `None` por **`main`** y deja la carpeta **`/ (root)`**.
   - Haz clic en **"Save"**.
4. Espera entre **1 y 2 minutos** y recarga esa misma página. Arriba aparecerá tu enlace oficial listo para compartir con las sedes regionales y subregionales:
   > `https://tu-usuario.github.io/verificacion-orf-regional/`
