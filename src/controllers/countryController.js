const Country = require('../models/Country');
const Category = require('../models/Category');
const Product = require('../models/Product');

// GET /api/countries
const getCountries = async (req, res) => {
  const countries = await Country.find().sort({ name: 1 }).lean();
  res.json({ success: true, total: countries.length, data: countries });
};

// GET /api/countries/:id
const getCountry = async (req, res) => {
  const country = await Country.findById(req.params.id).lean();
  if (!country) return res.status(404).json({ success: false, message: 'País no encontrado' });
  res.json({ success: true, data: country });
};

// GET /api/countries/:id/categories  -> solo las categorías que tienen platos en ese país
const getCountryCategories = async (req, res) => {
  const categoryIds = await Product.distinct('category', { country: req.params.id });
  const categories = await Category.find({ _id: { $in: categoryIds } }).sort({ name: 1 }).lean();
  res.json({ success: true, total: categories.length, data: categories });
};

// POST /api/countries
const createCountry = async (req, res) => {
  const { name, code, flag, image } = req.body;
  const country = await Country.create({ name, code, flag, image });
  res.status(201).json({ success: true, message: 'País creado', data: country });
};

// PUT /api/countries/:id
const updateCountry = async (req, res) => {
  const { name, code, flag, image } = req.body;
  const country = await Country.findByIdAndUpdate(
    req.params.id,
    { name, code, flag, image },
    { returnDocument: 'after', runValidators: true }
  );
  if (!country) return res.status(404).json({ success: false, message: 'País no encontrado' });
  res.json({ success: true, message: 'País actualizado', data: country });
};

// DELETE /api/countries/:id
const deleteCountry = async (req, res) => {
  const products = await Product.countDocuments({ country: req.params.id });
  if (products > 0) {
    return res.status(409).json({ success: false, message: `No se puede eliminar: tiene ${products} producto(s)` });
  }
  const country = await Country.findByIdAndDelete(req.params.id);
  if (!country) return res.status(404).json({ success: false, message: 'País no encontrado' });
  res.json({ success: true, message: 'País eliminado' });
};

module.exports = { getCountries, getCountry, getCountryCategories, createCountry, updateCountry, deleteCountry };
