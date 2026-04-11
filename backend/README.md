# Backend simple para `ProyectoDIFinal`

## Qué incluye

- Login con JWT.
- CRUD de usuarios.
- CRUD de cursos.
- Protección por token.
- Roles básicos:
  - `ADMIN`: gestiona usuarios y cursos.
  - `PROFESOR`: gestiona cursos.
  - `ESTUDIANTE`: solo acceso autenticado a lectura general.
- Persistencia sencilla en `data/db.json`.

## Tecnologías

- Node.js
- Express
- jsonwebtoken
- cors
- dotenv

## Instalación

```bash
cd backend
npm install
npm start
```

El backend quedará en:

```bash
http://localhost:3000
```

## Usuarios de prueba

- Admin
  - usuario: `admin`
  - clave: `admin123`
- Profesor
  - usuario: `profesor`
  - clave: `prof123`
- Estudiante
  - usuario: `estudiante`
  - clave: `estu123`

## Endpoints

### Auth

- `POST /api/auth/login`
- `GET /api/auth/me`

### Usuarios

- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

### Cursos

- `GET /api/courses`
- `GET /api/courses/:id`
- `POST /api/courses`
- `PUT /api/courses/:id`
- `DELETE /api/courses/:id`
