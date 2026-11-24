// Documentación OpenAPI 3 de la API. Se ve en: http://localhost:3001/api/docs

const id = { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID de MongoDB' };
const auth = [{ bearerAuth: [] }];

// Helpers para no repetir las respuestas en cada ruta
const ok = (description, schema) => ({
  description,
  content: { 'application/json': { schema: schema || { $ref: '#/components/schemas/Message' } } },
});
const list = (ref) => ({
  type: 'object',
  properties: { success: { type: 'boolean' }, total: { type: 'integer' }, data: { type: 'array', items: { $ref: ref } } },
});
const one = (ref) => ({
  type: 'object',
  properties: { success: { type: 'boolean' }, message: { type: 'string' }, data: { $ref: ref } },
});
const body = (ref) => ({ required: true, content: { 'application/json': { schema: { $ref: ref } } } });

const err = {
  400: ok('Datos inválidos'),
  401: ok('Sin token o token inválido'),
  403: ok('No tienes permiso (solo administrador)'),
  404: ok('No encontrado'),
  409: ok('Registro duplicado o con productos asociados'),
};

// Genera las 5 rutas CRUD de un módulo (GET público, escritura solo admin)
const crud = ({ tag, path, ref, inputRef, publicRead = true }) => {
  const read = publicRead ? {} : { security: auth };
  return {
    [path]: {
      get: { tags: [tag], summary: `Listar ${tag.toLowerCase()}`, ...read, responses: { 200: ok('OK', list(ref)) } },
      post: {
        tags: [tag], summary: 'Crear (admin)', security: auth, requestBody: body(inputRef),
        responses: { 201: ok('Creado', one(ref)), 400: err[400], 401: err[401], 403: err[403], 409: err[409] },
      },
    },
    [`${path}/{id}`]: {
      get: { tags: [tag], summary: 'Obtener por ID', ...read, parameters: [id], responses: { 200: ok('OK', one(ref)), 404: err[404] } },
      put: {
        tags: [tag], summary: 'Actualizar (admin)', security: auth, parameters: [id], requestBody: body(inputRef),
        responses: { 200: ok('Actualizado', one(ref)), 400: err[400], 401: err[401], 403: err[403], 404: err[404] },
      },
      delete: {
        tags: [tag], summary: 'Eliminar (admin)', security: auth, parameters: [id],
        responses: { 200: ok('Eliminado'), 401: err[401], 403: err[403], 404: err[404], 409: err[409] },
      },
    },
  };
};

const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'API Food Delivery',
    version: '1.0.0',
    description:
      'API para una app de pedir comida por **países** y **categorías**.\n\n' +
      '1. Haz login en `POST /api/auth/login` (el admin es el definido en `ADMIN_EMAIL` / `ADMIN_PASSWORD` del `.env`).\n' +
      '2. Copia el `token` de la respuesta.\n' +
      '3. Dale al botón **Authorize** y pégalo (sin escribir "Bearer").',
  },
  servers: [{ url: '/', description: 'Este servidor' }],
  tags: [
    { name: 'Auth', description: 'Registro, login y perfil' },
    { name: 'Usuarios', description: 'Gestión de usuarios y roles (solo admin)' },
    { name: 'Países' },
    { name: 'Categorías' },
    { name: 'Productos', description: 'Platos de comida' },
  ],
  components: {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    schemas: {
      Message: {
        type: 'object',
        properties: { success: { type: 'boolean' }, message: { type: 'string' } },
      },
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string', example: 'Juan Pérez' },
          email: { type: 'string', example: 'juan@correo.com' },
          phone: { type: 'string', example: '3001234567' },
          role: { type: 'string', enum: ['cliente', 'administrador'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      UserInput: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Juan Pérez' },
          email: { type: 'string', example: 'juan@correo.com' },
          password: { type: 'string', example: '123456', minLength: 6 },
          phone: { type: 'string', example: '3001234567' },
          role: { type: 'string', enum: ['cliente', 'administrador'], example: 'cliente' },
        },
      },
      RegisterInput: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Juan Pérez' },
          email: { type: 'string', example: 'juan@correo.com' },
          password: { type: 'string', example: '123456', minLength: 6 },
          phone: { type: 'string', example: '3001234567' },
        },
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'admin@fooddelivery.com' },
          password: { type: 'string', example: '123456' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: {
            type: 'object',
            properties: { token: { type: 'string' }, user: { $ref: '#/components/schemas/User' } },
          },
        },
      },
      Country: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string', example: 'Colombia' },
          code: { type: 'string', example: 'CO' },
          flag: { type: 'string', example: '🇨🇴' },
          image: { type: 'string', example: 'https://...' },
        },
      },
      CountryInput: {
        type: 'object',
        required: ['name', 'code'],
        properties: {
          name: { type: 'string', example: 'Argentina' },
          code: { type: 'string', example: 'AR' },
          flag: { type: 'string', example: '🇦🇷' },
          image: { type: 'string', example: 'https://...' },
        },
      },
      Category: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string', example: 'Postres' },
          description: { type: 'string', example: 'Algo dulce' },
          image: { type: 'string', example: 'https://...' },
        },
      },
      CategoryInput: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', example: 'Desayunos' },
          description: { type: 'string', example: 'Para empezar el día' },
          image: { type: 'string', example: 'https://...' },
        },
      },
      Product: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string', example: 'Bandeja paisa' },
          description: { type: 'string', example: 'Frijoles, arroz, chicharrón...' },
          price: { type: 'number', example: 32000 },
          image: { type: 'string', example: 'https://...' },
          available: { type: 'boolean', example: true },
          country: {
            type: 'object',
            properties: { _id: { type: 'string' }, name: { type: 'string' }, code: { type: 'string' }, flag: { type: 'string' } },
          },
          category: { type: 'object', properties: { _id: { type: 'string' }, name: { type: 'string' } } },
        },
      },
      ProductInput: {
        type: 'object',
        required: ['name', 'price', 'country', 'category'],
        properties: {
          name: { type: 'string', example: 'Arepa de huevo' },
          description: { type: 'string', example: 'Arepa frita rellena de huevo' },
          price: { type: 'number', example: 7000 },
          image: { type: 'string', example: 'https://...' },
          available: { type: 'boolean', example: true },
          country: { type: 'string', description: 'ID del país' },
          category: { type: 'string', description: 'ID de la categoría' },
        },
      },
    },
  },
  paths: {
    // ---------- Auth ----------
    '/api/auth/register': {
      post: {
        tags: ['Auth'], summary: 'Registrarse (siempre como cliente)', requestBody: body('#/components/schemas/RegisterInput'),
        responses: { 201: ok('Registrado', { $ref: '#/components/schemas/AuthResponse' }), 400: err[400], 409: err[409] },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'], summary: 'Iniciar sesión', requestBody: body('#/components/schemas/LoginInput'),
        responses: { 200: ok('Login correcto', { $ref: '#/components/schemas/AuthResponse' }), 400: err[400], 401: err[401] },
      },
    },
    '/api/auth/profile': {
      get: {
        tags: ['Auth'], summary: 'Perfil del usuario logueado', security: auth,
        responses: { 200: ok('OK', one('#/components/schemas/User')), 401: err[401] },
      },
    },

    // ---------- Usuarios ----------
    '/api/users/roles': {
      get: {
        tags: ['Usuarios'], summary: 'Listar roles disponibles', security: auth,
        responses: {
          200: ok('OK', { type: 'object', properties: { success: { type: 'boolean' }, data: { type: 'array', items: { type: 'string' }, example: ['cliente', 'administrador'] } } }),
          401: err[401], 403: err[403],
        },
      },
    },
    ...crud({ tag: 'Usuarios', path: '/api/users', ref: '#/components/schemas/User', inputRef: '#/components/schemas/UserInput', publicRead: false }),

    // ---------- Países ----------
    ...crud({ tag: 'Países', path: '/api/countries', ref: '#/components/schemas/Country', inputRef: '#/components/schemas/CountryInput' }),
    '/api/countries/{id}/categories': {
      get: {
        tags: ['Países'], summary: 'Categorías que tienen platos en ese país', parameters: [id],
        responses: { 200: ok('OK', list('#/components/schemas/Category')) },
      },
    },

    // ---------- Categorías ----------
    ...crud({ tag: 'Categorías', path: '/api/categories', ref: '#/components/schemas/Category', inputRef: '#/components/schemas/CategoryInput' }),

    // ---------- Productos ----------
    ...crud({ tag: 'Productos', path: '/api/products', ref: '#/components/schemas/Product', inputRef: '#/components/schemas/ProductInput' }),
  },
};

// Filtros del listado de productos
swaggerSpec.paths['/api/products'].get.parameters = [
  { name: 'country', in: 'query', schema: { type: 'string' }, description: 'ID del país' },
  { name: 'category', in: 'query', schema: { type: 'string' }, description: 'ID de la categoría' },
  { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Buscar por nombre' },
];

module.exports = swaggerSpec;
