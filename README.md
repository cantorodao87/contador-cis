# 🌐 ContadorCIS

Bienvenido al repositorio de **ContadorCIS**, una aplicación web desarrollada con [Vite](https://vitejs.dev/) y desplegada en [Firebase Hosting](https://firebase.google.com/products/hosting). Este proyecto está preparado para integrarse fácilmente con GitHub Actions y desplegarse automáticamente en Firebase.

---

## 🚀 ¿Cómo clonar y ejecutar el proyecto localmente?

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/tu-usuario/contadorcis.git
   cd contadorcis
   ```

2. **Instala las dependencias:**

   ```bash
   npm ci
   ```

3. **Configura las variables de entorno:**

   Crea un archivo `.env` en la raíz del proyecto con tus claves de Firebase (si usas Vite):

   ```env
   VITE_FIREBASE_API_KEY=tu_api_key
   VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
   VITE_FIREBASE_PROJECT_ID=tu_project_id
   VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
   VITE_FIREBASE_APP_ID=tu_app_id
   ```

4. **Ejecuta el servidor local:**

   ```bash
   npm run dev
   ```

---

## 🔥 ¿Cómo desplegar en Firebase?

### ✅ Requisitos previos

- Tener una cuenta en [Firebase](https://firebase.google.com/)
- Tener instalado [Firebase CLI](https://firebase.google.com/docs/cli)
- Haber creado un proyecto en Firebase

### 🧪 Despliegue manual

1. **Autenticarse en Firebase:**

   ```bash
   firebase login
   ```

2. **Vincular el proyecto local con Firebase:**

   ```bash
   firebase use --add
   ```

3. **Construir el proyecto:**

   ```bash
   npm run build
   ```

4. **Desplegar:**

   ```bash
   firebase deploy
   ```

---

## 🤖 Despliegue automático con GitHub Actions

Este repositorio incluye dos workflows:

- `firebase-hosting-pull-request.yml`: crea una vista previa cuando se abre un Pull Request.
- `firebase-hosting-merge.yml`: despliega automáticamente a producción cuando se hace push a `main`.

### 🧵 ¿Cómo activar el despliegue automático?

1. Añade los siguientes secretos en la configuración del repositorio (`Settings > Secrets and variables > Actions`):

   - `FIREBASE_SERVICE_ACCOUNT_CONTADORCIS`: tu clave de servicio de Firebase en formato JSON
   - `GITHUB_TOKEN`: ya está disponible por defecto

2. Asegúrate de que tus commits van a la rama `main` para activar el despliegue.

3. También puedes ejecutar el workflow manualmente desde la pestaña **Actions** si has habilitado `workflow_dispatch`.

---

## 📦 Scripts disponibles

| Comando            | Descripción                             |
|--------------------|-----------------------------------------|
| `npm run dev`      | Ejecuta el servidor local de desarrollo |
| `npm run build`    | Compila la aplicación para producción    |
| `npm run preview`  | Previsualiza la build localmente         |

---

## 📬 ¿Preguntas o sugerencias?

Si tienes dudas, sugerencias o quieres contribuir, ¡no dudes en abrir un issue o un pull request!

---

## 📝 Licencia

Este proyecto está bajo la licencia MIT.