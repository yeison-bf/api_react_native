const Category = require('../models/Category');
const Product = require('../models/Product');

// GET /api/categories
const getCategories = async (req, res) => {
  const categories = await Category.find().sort({ name: 1 }).lean();
  res.json({ success: true, total: categories.length, data: categories });
};

// GET /api/categories/:id
const getCategory = async (req, res) => {
  const category = await Category.findById(req.params.id).lean();
  if (!category) return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
  res.json({ success: true, data: category });
};

// POST /api/categories
const createCategory = async (req, res) => {
  const { name, description, image } = req.body;
  const category = await Category.create({ name, description, image });
  res.status(201).json({ success: true, message: 'Categoría creada', data: category });
};

// PUT /api/categories/:id
const updateCategory = async (req, res) => {
  const { name, description, image } = req.body;
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name, description, image },
    { returnDocument: 'after', runValidators: true }
  );
  if (!category) return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
  res.json({ success: true, message: 'Categoría actualizada', data: category });
};

// DELETE /api/categories/:id
const deleteCategory = async (req, res) => {
  const products = await Product.countDocuments({ category: req.params.id });
  if (products > 0) {
    return res.status(409).json({ success: false, message: `No se puede eliminar: tiene ${products} producto(s)` });
  }
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
  res.json({ success: true, message: 'Categoría eliminada' });
};

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };
