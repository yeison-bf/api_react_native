// Carga datos de prueba: admin, cliente, países, categorías y platos.
// Uso: npm run seed   (borra países, categorías y productos y los vuelve a crear)
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Country = require('../models/Country');
const Category = require('../models/Category');
const Product = require('../models/Product');

const countries = [
  { name: 'Colombia', code: 'CO', flag: '🇨🇴' },
  { name: 'México', code: 'MX', flag: '🇲🇽' },
  { name: 'Italia', code: 'IT', flag: '🇮🇹' },
  { name: 'Japón', code: 'JP', flag: '🇯🇵' },
  { name: 'Perú', code: 'PE', flag: '🇵🇪' },
];

const categories = [
  { name: 'Entradas', description: 'Para abrir el apetito' },
  { name: 'Platos fuertes', description: 'Platos principales' },
  { name: 'Sopas', description: 'Sopas y caldos' },
  { name: 'Postres', description: 'Algo dulce' },
  { name: 'Bebidas', description: 'Bebidas típicas' },
];

// [país, categoría, nombre, precio, descripción]
const products = [
  ['CO', 'Platos fuertes', 'Bandeja paisa', 32000, 'Frijoles, arroz, chicharrón, carne molida, huevo, arepa y aguacate'],
  ['CO', 'Sopas', 'Ajiaco santafereño', 28000, 'Sopa de papas con pollo, mazorca y guascas'],
  ['CO', 'Entradas', 'Empanadas', 9000, 'Empanadas de maíz rellenas de papa y carne'],
  ['CO', 'Bebidas', 'Limonada de coco', 10000, 'Limonada cremosa con coco'],
  ['MX', 'Platos fuertes', 'Tacos al pastor', 25000, 'Tortillas de maíz con cerdo adobado y piña'],
  ['MX', 'Entradas', 'Guacamole con totopos', 15000, 'Aguacate, tomate, cebolla y cilantro'],
  ['MX', 'Sopas', 'Pozole rojo', 27000, 'Caldo de maíz pozolero con cerdo'],
  ['MX', 'Postres', 'Churros', 12000, 'Churros con azúcar y canela'],
  ['IT', 'Platos fuertes', 'Lasaña boloñesa', 34000, 'Capas de pasta, salsa boloñesa y bechamel'],
  ['IT', 'Platos fuertes', 'Pizza margarita', 30000, 'Tomate, mozzarella y albahaca'],
  ['IT', 'Postres', 'Tiramisú', 16000, 'Postre de café, mascarpone y cacao'],
  ['JP', 'Platos fuertes', 'Ramen tonkotsu', 36000, 'Fideos en caldo de cerdo con huevo y chashu'],
  ['JP', 'Entradas', 'Gyozas', 18000, 'Empanaditas japonesas a la plancha'],
  ['JP', 'Bebidas', 'Té matcha', 9000, 'Té verde japonés'],
  ['PE', 'Platos fuertes', 'Lomo saltado', 35000, 'Lomo de res salteado con cebolla, tomate y papas'],
  ['PE', 'Entradas', 'Ceviche', 30000, 'Pescado marinado en limón con ají y cebolla'],
  ['PE', 'Bebidas', 'Chicha morada', 8000, 'Bebida de maíz morado'],
];

const upsertUser = async (data) => {
  let user = await User.findOne({ email: data.email });
  if (!user) user = new User(data);
  else Object.assign(user, data);
  await user.save();
  console.log(`Usuario ${data.role}: ${data.email}`);
};

const seed = async () => {
  await connectDB();

  await upsertUser({
    name: process.env.ADMIN_NAME || 'Administrador',
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    role: 'administrador',
  });
  await upsertUser({ name: 'Cliente Demo', email: 'cliente@fooddelivery.com', password: 'Cliente123*', role: 'cliente' });

  await Product.deleteMany();
  await Country.deleteMany();
  await Category.deleteMany();

  const createdCountries = await Country.insertMany(countries);
  const createdCategories = await Category.insertMany(categories);

  const countryByCode = Object.fromEntries(createdCountries.map((c) => [c.code, c._id]));
  const categoryByName = Object.fromEntries(createdCategories.map((c) => [c.name, c._id]));

  await Product.insertMany(
    products.map(([code, category, name, price, description]) => ({
      name,
      price,
      description,
      country: countryByCode[code],
      category: categoryByName[category],
    }))
  );

  console.log(`${createdCountries.length} países, ${createdCategories.length} categorías, ${products.length} productos creados`);
};

seed()
  .catch((error) => {
    console.error('Error en el seed:', error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
