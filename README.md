# PromptWorks Local App

Sitio oficial de PromptWorks con portafolio dinámico, API REST, formulario de contacto y panel administrativo privado.

## Requisitos

- Node.js 20 o superior
- MongoDB Atlas o MongoDB local
- Una cuenta SMTP (opcional, para notificaciones por email)

## Instalación

1. Abre una terminal dentro del proyecto.
2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Copia `.env.example` como `.env` y completa al menos:

   ```env
   MONGODB_URI=mongodb+srv://Jorge:TU_PASSWORD_URL_ENCODED@atlascluster.ww6k8tb.mongodb.net/promptworks?retryWrites=true&w=majority&appName=AtlasCluster
   JWT_SECRET=un_secreto_aleatorio_de_32_caracteres_o_mas
   OWNER_EMAIL=tu_correo
   OWNER_PASSWORD=una_contraseña_segura
   ```

4. Crea o actualiza la cuenta owner:

   ```bash
   npm run seed:owner
   ```

5. Carga las categorías, servicios, proyectos, contenido editable y biblioteca multimedia iniciales:

   ```bash
   npm run seed:content
   ```

   Ejecuta este comando nuevamente después de actualizar desde una versión anterior para crear el contenido del CMS y vincular las portadas de los proyectos.

6. Inicia la aplicación:

   ```bash
   npm start
   ```

7. Abre `http://localhost:3000`. El acceso administrativo está en `http://localhost:3000/admin/login.html`.

## Correo

El formulario siempre guarda la solicitud en MongoDB. Para recibir además una notificación, configura `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` y opcionalmente `CONTACT_NOTIFICATION_EMAIL`.

## Funciones incluidas

- Sitio responsive en español con navegación móvil.
- Diseño tecnológico premium full-width: aprovecha monitores grandes, escala a tres columnas en el portafolio y se reorganiza en una sola columna para móviles.
- Hero visual, animaciones CSS discretas y cinco imágenes originales optimizadas en WebP; no utiliza Three.js.
- Aplicaciones, categorías, servicios, métricas y testimonios cargados desde MongoDB.
- Filtros funcionales y páginas individuales de proyectos.
- Formulario con validación, archivos, rate limiting y estados de carga/error/éxito.
- Panel privado con login seguro mediante cookie HTTP-only y JWT.
- Dashboard tecnológico con resumen de aplicaciones, solicitudes nuevas y recursos multimedia.
- Editor visual del Front Page para cambiar logo, marca, hero, llamadas a la acción y textos de cada sección sin editar código.
- Media Manager para subir, clasificar, buscar, reutilizar y eliminar imágenes o PDF.
- CRUD de aplicaciones, categorías, servicios y testimonios.
- Gestión de solicitudes, notas internas y estados.
- Subida restringida de imágenes/PDF (máximo 5 MB).
- Helmet, CORS, bcrypt, manejo centralizado de errores y variables de entorno.
- `npm run seed:owner`, `.env.example`, robots, sitemap, Open Graph y datos estructurados.

## Notas de seguridad

- Nunca subas `.env` al repositorio.
- Cambia `JWT_SECRET` por una cadena larga y aleatoria.
- Usa una contraseña de aplicación de Gmail si configuras Gmail SMTP.
- En producción, configura `NODE_ENV=production`, HTTPS y `CLIENT_ORIGIN` con el dominio real.

## Estructura principal

```text
config/       conexión a MongoDB
models/       esquemas Mongoose
controllers/  lógica HTTP
services/     correo
routes/       API pública, autenticación y administración
middleware/   seguridad, autenticación, uploads y errores
public/       interfaz pública y panel
scripts/      seeds y validación
uploads/      archivos subidos
```
