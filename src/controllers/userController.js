const User = require('../models/User');

const withoutPassword = (user) => {
  const data = user.toObject();
  delete data.password;
  return data;
};

// GET /api/users
const getUsers = async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).lean();
  res.json({ success: true, total: users.length, data: users });
};

// GET /api/users/:id
const getUser = async (req, res) => {
  const user = await User.findById(req.params.id).lean();
  if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
  res.json({ success: true, data: user });
};

// POST /api/users  (el admin puede crear clientes o administradores)
const createUser = async (req, res) => {
  const { name, email, password, phone, role } = req.body;
  const user = await User.create({ name, email, password, phone, role });
  res.status(201).json({ success: true, message: 'Usuario creado', data: withoutPassword(user) });
};

// PUT /api/users/:id
const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

  const { name, email, password, phone, role } = req.body;
  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (phone !== undefined) user.phone = phone;
  if (role !== undefined) user.role = role;
  if (password) user.password = password; // se encripta en el pre save del modelo

  await user.save();
  res.json({ success: true, message: 'Usuario actualizado', data: withoutPassword(user) });
};

// DELETE /api/users/:id
const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
  res.json({ success: true, message: 'Usuario eliminado' });
};

// GET /api/users/roles
const getRoles = (req, res) => {
  res.json({ success: true, data: User.ROLES });
};

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser, getRoles };
