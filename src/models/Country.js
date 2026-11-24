const { Schema, model } = require('mongoose');

const countrySchema = new Schema(
  {
    name: { type: String, required: [true, 'El nombre es obligatorio'], unique: true, trim: true },
    code: { type: String, required: [true, 'El código es obligatorio'], unique: true, uppercase: true, trim: true }, // ej: CO, MX
    flag: { type: String }, // emoji o URL de la bandera
    image: { type: String },
  },
  { timestamps: true, versionKey: false }
);

module.exports = model('Country', countrySchema);
