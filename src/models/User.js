const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const ROLES = ['cliente', 'administrador'];

const userSchema = new Schema(
  {
    name: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
    email: { type: String, required: [true, 'El email es obligatorio'], unique: true, lowercase: true, trim: true },
    password: { type: String, required: [true, 'La contraseña es obligatoria'], minlength: [6, 'Mínimo 6 caracteres'], select: false },
    phone: { type: String, trim: true },
    role: { type: String, enum: ROLES, default: 'cliente' },
  },
  { timestamps: true, versionKey: false }
);

userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = model('User', userSchema);
module.exports.ROLES = ROLES;
