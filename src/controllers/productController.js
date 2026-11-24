const Product = require('../models/Product');

const populate = [
  { path: 'country', select: 'name code flag' },
  { path: 'category', select: 'name' },
];

// GET /api/products?country=ID&category=ID&search=texto
const getProducts = async (req, res) => {
  const { country, category, search } = req.query;
  const filter = {};
  if (country) filter.country = String(country);
  if (category) filter.category = String(category);
  if (search) filter.name = { $regex: String(search), $options: 'i' };

  const products = await Product.find(filter).populate(populate).sort({ name: 1 }).lean();
  res.json({ success: true, total: products.length, data: products });
};

// GET /api/products/:id
const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).populate(populate).lean();
  if (!product) return res.status(404).json({ success: false, message: 'Producto no encontrado' });
  res.json({ success: true, data: product });
};

// POST /api/products
const createProduct = async (req, res) => {
  const { name, description, price, image, available, country, category } = req.body;
  const product = await Product.create({ name, description, price, image, available, country, category });
  await product.populate(populate);
  res.status(201).json({ success: true, message: 'Producto creado', data: product });
};

// PUT /api/products/:id
const updateProduct = async (req, res) => {
  const { name, description, price, image, available, country, category } = req.body;
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { name, description, price, image, available, country, category },
    { returnDocument: 'after', runValidators: true }
  ).populate(populate);
  if (!product) return res.status(404).json({ success: false, message: 'Producto no encontrado' });
  res.json({ success: true, message: 'Producto actualizado', data: product });
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Producto no encontrado' });
  res.json({ success: true, message: 'Producto eliminado' });
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
