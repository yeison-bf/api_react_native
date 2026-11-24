const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const userData = (user) => ({ _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role });

// POST /api/auth/register  (siempre crea un cliente)
const register = async (req, res) => {
  const { name, email, password, phone } = req.body;
  const user = await User.create({ name, email, password, phone, role: 'cliente' });

  res.status(201).json({ success: true, message: 'Usuario registrado', data: { token: generateToken(user), user: userData(user) } });
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email y contraseña son obligatorios' });
  }

  const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(String(password)))) {
    return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
  }

  res.json({ success: true, message: 'Bienvenido', data: { token: generateToken(user), user: userData(user) } });
};

// GET /api/auth/profile
const profile = async (req, res) => {
  // El perfil siempre necesita saber quién es el usuario, así que aquí el token sigue siendo obligatorio
  if (!req.user) return res.status(401).json({ success: false, message: 'Token requerido' });

  const user = await User.findById(req.user.id).lean();
  if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

  res.json({ success: true, data: user });
};

module.exports = { register, login, profile };
