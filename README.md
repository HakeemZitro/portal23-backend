# portal23-backend

Repositorio para el BackEnd de la aplicación de cursos online **Alquimia Digital** — plataforma para convertirte en maestro de Ceremonias Holísticas.

---

## 📋 Contenido

- [Tecnologías](#-tecnologías)
- [Requisitos previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Variables de entorno](#-variables-de-entorno)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Scripts disponibles](#-scripts-disponibles)
- [Referencia de la API](#-referencia-de-la-api)
  - [Autenticación](#autenticación)
  - [Usuarios](#usuarios)
  - [Assets (Contenido multimedia)](#assets-contenido-multimedia)
  - [Webhooks](#webhooks)
- [Modelos de datos](#-modelos-de-datos)
- [Manejo de errores](#-manejo-de-errores)

---

## 🛠 Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| Node.js | ≥ 18 | Entorno de ejecución |
| Express | ^5.2.1 | Framework HTTP |
| MongoDB + Mongoose | ^9.1.5 | Base de datos |
| JSON Web Token | ^9.0.3 | Autenticación |
| bcrypt | ^6.0.0 | Hash de contraseñas |
| Mux | ^12.8.1 | Streaming de video |
| celebrate / Joi | ^15.0.3 | Validación de datos |
| winston | ^3.19.0 | Registro de logs |
| dotenv | ^17.3.1 | Variables de entorno |
| cors | ^2.8.6 | Control de acceso HTTP |

---

## ✅ Requisitos previos

- **Node.js** v18 o superior
- **MongoDB** corriendo localmente o URI de conexión remota
- Cuenta en **[Mux](https://mux.com)** para el streaming de video (Token ID y Secret Key)

---

## 🚀 Instalación

```bash
# 1. Clona el repositorio
git clone https://github.com/HakeemZitro/portal23-backend.git
cd portal23-backend

# 2. Instala las dependencias
npm install

# 3. Configura las variables de entorno (ver sección siguiente)
cp .env.development .env.development.local

# 4. Inicia el servidor en modo desarrollo
npm run dev
```

El servidor estará disponible en `http://localhost:3000` (o el puerto definido en `PORT`).

---

## 🔐 Variables de entorno

Crea o edita el archivo `.env.development` en la raíz del proyecto con los siguientes valores:

```env
# Entorno
NODE_ENV=development

# Servidor
PORT=4000

# Base de datos
DB_URL=mongodb://localhost:27017/alquimia-digital

# Mux (streaming de video)
MUX_TokenID=tu_mux_token_id
MUX_SecretKEY=tu_mux_secret_key
MUX_WEBHOOK_SECRET=tu_mux_webhook_secret

# JWT
JWT_SECRET=tu_secreto_seguro
JWT_ACCESS_EXPIRES_IN=1d

# Bcrypt
BCRYPT_ROUNDS=10
```

> **⚠️ Importante:** Nunca subas tus claves reales a un repositorio público. Asegúrate de que `.env.*` esté en tu `.gitignore`.

---

## 📁 Estructura del proyecto

```
portal23-backend/
├── app.js                      # Punto de entrada, configuración de Express
├── seedAdmin.js                # Script para crear usuario administrador
├── controllers/
│   ├── users.controller.js     # Lógica de usuarios
│   ├── assets.controller.js    # Lógica de assets (Mux)
│   └── webhooks.controller.js  # Manejo de webhooks de Mux
├── routes/
│   ├── user.routes.js          # Rutas /users
│   └── asset.routes.js         # Rutas /assets
├── models/
│   ├── user.js                 # Esquema de Usuario (MongoDB)
│   └── asset.js                # Esquema de Asset (MongoDB)
├── middlewares/
│   ├── auth.js                 # Verificación de JWT y rol Admin
│   └── logger.js               # Middleware de logging (Winston)
├── validators/
│   ├── auth.validators.js      # Validaciones de signup/signin
│   ├── user.validators.js      # Validaciones de rutas de usuario
│   ├── asset.validators.js     # Validaciones de rutas de assets
│   └── common.js               # Validaciones reutilizables
├── errors/
│   ├── bad-request.error.js    # 400
│   ├── unauthorized.error.js   # 401
│   ├── forbidden.error.js      # 403
│   ├── not-found.error.js      # 404
│   └── conflict.error.js       # 409
├── .env.development            # Variables de entorno (desarrollo)
├── .env.production             # Variables de entorno (producción)
└── package.json
```

---

## 📜 Scripts disponibles

| Script | Comando | Descripción |
|---|---|---|
| Producción | `npm start` | Inicia el servidor con Node |
| Desarrollo | `npm run dev` | Inicia con Nodemon (recarga automática) |
| Lint | `npm run lint` | Analiza el código con ESLint (airbnb-base) |

---

## 📡 Referencia de la API

**URL Base (desarrollo):** `http://localhost:3000`

### Autenticación

Las rutas protegidas requieren el header:

```
Authorization: Bearer <token>
```

El token se obtiene al hacer `POST /signin`.

---

### Autenticación

#### `POST /signup` — Registrar nuevo usuario

Crea una cuenta nueva.

**Body (JSON):**
```json
{
  "name": "Nombre Usuario",
  "email": "usuario@email.com",
  "password": "contraseña123"
}
```

**Respuesta exitosa `201`:**
```json
{
  "name": "Nombre Usuario",
  "email": "usuario@email.com"
}
```

**Errores posibles:**
| Código | Descripción |
|---|---|
| `400` | Datos faltantes o inválidos |
| `409` | El email ya está registrado |

---

#### `POST /signin` — Iniciar sesión

**Body (JSON):**
```json
{
  "email": "usuario@email.com",
  "password": "contraseña123"
}
```

**Respuesta exitosa `200`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores posibles:**
| Código | Descripción |
|---|---|
| `401` | Email o contraseña incorrectos |

---

### Usuarios

#### `GET /users/me` — Obtener perfil del usuario actual

🔒 Requiere autenticación.

**Respuesta exitosa `200`:**
```json
{
  "_id": "64abc123...",
  "name": "Nombre Usuario",
  "email": "usuario@email.com",
  "avatar": "https://...",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

#### `PATCH /users/me` — Actualizar información del usuario

🔒 Requiere autenticación.

**Body (JSON):**
```json
{
  "name": "Nuevo Nombre"
}
```

**Respuesta exitosa `200`:** Objeto de usuario actualizado.

---

#### `PATCH /users/me/avatar` — Actualizar avatar del usuario

🔒 Requiere autenticación.

**Body (JSON):**
```json
{
  "avatar": "https://url-de-la-imagen.com/foto.webp"
}
```

**Respuesta exitosa `200`:** Objeto de usuario actualizado.

---

#### `GET /users` — Obtener todos los usuarios 🛡️ Admin

🔒 Requiere autenticación + rol admin.

**Respuesta exitosa `200`:**
```json
[
  {
    "_id": "64abc123...",
    "name": "Nombre Usuario",
    "email": "usuario@email.com",
    "avatar": "https://...",
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

---

#### `GET /users/:id` — Obtener usuario por ID 🛡️ Admin

🔒 Requiere autenticación + rol admin.

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | `string` | ID de MongoDB del usuario |

**Respuesta exitosa `200`:** Objeto de usuario.

**Errores posibles:**
| Código | Descripción |
|---|---|
| `404` | Usuario no encontrado |

---

### Assets (Contenido multimedia)

Los assets son videos alojados en **Mux** y referenciados en la base de datos.

#### `GET /assets` — Obtener todos los assets

🔒 Requiere autenticación.

**Respuesta exitosa `200`:**
```json
[
  {
    "id": "mux_asset_id_abc123",
    "status": "ready",
    "playback_ids": [{ "id": "mux_playback_id", "policy": "public" }],
    "duration": 3600.5,
    ...
  }
]
```

> La respuesta proviene directamente de la API de Mux.

---

#### `GET /assets/:id` — Obtener un asset por ID

🔒 Requiere autenticación.

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | `string` | ID de MongoDB del asset |

**Respuesta exitosa `200`:** Objeto del asset.

**Errores posibles:**
| Código | Descripción |
|---|---|
| `404` | Asset no encontrado |

---

#### `POST /assets/upload-url` — Generar URL de subida 🛡️ Admin

🔒 Requiere autenticación + rol admin.

Genera una URL firmada de Mux para subir un video directamente, y registra el asset en la base de datos.

**Respuesta exitosa `200`:**
```json
{
  "upload_url": "https://storage.googleapis.com/video-storage-gcs-uploads-us-east1-vop1/...",
  "upload_id": "mux_upload_id_abc123"
}
```

> Una vez subido el video a la `upload_url`, Mux procesará el video y enviará el estado via webhook a `POST /webhooks/mux`.

---

### Webhooks

#### `POST /webhooks/mux` — Recibir eventos de Mux

Endpoint sin autenticación JWT, utilizado por Mux para notificar cambios de estado de los assets (ej: `video.asset.ready`). Actualiza el documento del asset en la base de datos con el `asset_id`, `playback_id`, `status` y `duration`.

---

## 🗄 Modelos de datos

### User

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `name` | String | ✅ | Nombre (2–40 caracteres) |
| `email` | String | ✅ | Email único y válido |
| `password` | String | ✅ | Hash de la contraseña (no retornado en consultas) |
| `avatar` | String | ❌ | URL de imagen de perfil |
| `role` | String | ❌ | student (default) o admin |
| `createdAt` | Date | — | Generado automáticamente |
| `updatedAt` | Date | — | Generado automáticamente |

### Asset

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `upload_id` | String | ✅ | ID de la subida en Mux |
| `asset_id` | String | ❌ | ID del asset procesado en Mux (asignado por webhook) |
| `playback_id` | String | ❌ | ID de reproducción pública en Mux |
| `status` | String | ❌ | Estado del asset (`waiting`, `ready`, etc.) |
| `title` | String | ❌ | Título del contenido |
| `description` | String | ❌ | Descripción del contenido |
| `type` | String | ❌ | `"Video"` o `"Audio"` |
| `duration` | Number | ❌ | Duración en segundos |
| `module_id` | ObjectId | ❌ | Referencia al módulo al que pertenece |
| `order` | Number | ❌ | Orden dentro del módulo (default: 0) |

---

## ❌ Manejo de errores

Todos los endpoints retornan errores en el siguiente formato:

```json
{
  "message": "Descripción del error"
}
```

| Código HTTP | Clase de error | Descripción |
|---|---|---|
| `400` | `BadRequestError` | Datos inválidos o faltantes |
| `401` | `UnauthorizedError` | Sin token o token inválido |
| `403` | `ForbiddenError` | Sin permisos suficientes (no es admin) |
| `404` | `NotFoundError` | Recurso no encontrado |
| `409` | `ConflictError` | Conflicto de datos (email duplicado) |
| `500` | Error de servidor | Error interno inesperado |

---

## 👤 Autor

**Hakeem Ortiz** — [@HakeemZitro](https://github.com/HakeemZitro)

---

*© 2026 PORTAL23 — Todos los derechos reservados.*
*© 2026 Alquimia Digital — Todos los derechos reservados.*
