# API Food Delivery 🍽️

API para una app de pedir comida, organizada por **países** y **categorías**.
Node.js + Express 5 + MongoDB (Mongoose) + JWT.

## Arrancar

```bash
npm install
cp .env.example .env   # y llenar los datos
npm run seed           # crea admin, cliente demo, países, categorías y platos
npm run dev            # http://localhost:3001
```

📘 **Documentación Swagger:** http://localhost:3001/api/docs
(haz login, copia el `token` y pégalo en el botón **Authorize**) 

Usuarios del seed:

| Rol | Email | Password |
|---|---|---|
| administrador | admin@fooddelivery.com | el de `ADMIN_PASSWORD` en `.env` |
| cliente | cliente@fooddelivery.com | Cliente123* |

> Desde el celular o el emulador no uses `localhost`: usa la IP del PC (ej. `http://192.168.1.10:3001`).
> En el emulador de Android puedes usar `http://10.0.2.2:3001`.

## Autenticación

Enviar el token en el header: `Authorization: Bearer <token>`

## Endpoints

🔓 = público · 🔑 = con token · 👑 = solo administrador

### Auth
| Método | Ruta | Body | |
|---|---|---|---|
| POST | `/api/auth/register` | `{ name, email, password, phone? }` | 🔓 crea un **cliente** |
| POST | `/api/auth/login` | `{ email, password }` | 🔓 devuelve `token` y `user` |
| GET | `/api/auth/profile` | | 🔑 |

### Usuarios y roles 👑
| Método | Ruta | Body |
|---|---|---|
| GET | `/api/users/roles` | |
| GET | `/api/users` | |
| GET | `/api/users/:id` | |
| POST | `/api/users` | `{ name, email, password, phone?, role? }` |
| PUT | `/api/users/:id` | cualquiera de los anteriores |
| DELETE | `/api/users/:id` | |

Roles: `cliente`, `administrador`.

### Países
| Método | Ruta | Body | |
|---|---|---|---|
| GET | `/api/countries` | | 🔓 |
| GET | `/api/countries/:id` | | 🔓 |
| GET | `/api/countries/:id/categories` | | 🔓 categorías con platos en ese país |
| POST | `/api/countries` | `{ name, code, flag?, image? }` | 👑 |
| PUT | `/api/countries/:id` | | 👑 |
| DELETE | `/api/countries/:id` | | 👑 (no deja si tiene productos) |

### Categorías
| Método | Ruta | Body | |
|---|---|---|---|
| GET | `/api/categories` | | 🔓 |
| GET | `/api/categories/:id` | | 🔓 |
| POST | `/api/categories` | `{ name, description?, image? }` | 👑 |
| PUT | `/api/categories/:id` | | 👑 |
| DELETE | `/api/categories/:id` | | 👑 (no deja si tiene productos) |

### Productos (platos)
| Método | Ruta | Body | |
|---|---|---|---|
| GET | `/api/products?country=ID&category=ID&search=texto` | | 🔓 filtros opcionales |
| GET | `/api/products/:id` | | 🔓 |
| POST | `/api/products` | `{ name, price, country, category, description?, image?, available? }` | 👑 |
| PUT | `/api/products/:id` | | 👑 |
| DELETE | `/api/products/:id` | | 👑 |

## Flujo sugerido en la app móvil

1. Login / registro → guardar el `token`.
2. Pantalla de países → `GET /api/countries`
3. Tocar un país → `GET /api/countries/:id/categories`
4. Tocar una categoría → `GET /api/products?country=ID&category=ID`
5. Detalle del plato → `GET /api/products/:id`

## Formato de respuesta

```json
{ "success": true, "message": "...", "total": 5, "data": [ ... ] }
```
Errores: `400` datos inválidos · `401` sin token / credenciales malas · `403` sin permiso · `404` no existe · `409` duplicado.
