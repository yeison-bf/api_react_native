const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.DB_NAME });
  console.log(`MongoDB conectado a la base: ${mongoose.connection.name}`);
};

module.exports = connectDB;
