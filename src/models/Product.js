const { Schema, model } = require('mongoose');

const productSchema = new Schema(
  {
    name: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
    description: { type: String },
    price: { type: Number, required: [true, 'El precio es obligatorio'], min: [0, 'El precio no puede ser negativo'] },
    image: { type: String },
    available: { type: Boolean, default: true },
    country: { type: Schema.Types.ObjectId, ref: 'Country', required: [true, 'El país es obligatorio'] },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: [true, 'La categoría es obligatoria'] },
  },
  { timestamps: true, versionKey: false }
);

module.exports = model('Product', productSchema);
