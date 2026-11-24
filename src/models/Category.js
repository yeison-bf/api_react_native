const { Schema, model } = require('mongoose');

const categorySchema = new Schema(
  {
    name: { type: String, required: [true, 'El nombre es obligatorio'], unique: true, trim: true },
    description: { type: String },
    image: { type: String },
  },
  { timestamps: true, versionKey: false }
);

module.exports = model('Category', categorySchema);
