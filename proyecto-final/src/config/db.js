// Configuración inicial para conectar MongoDB usando Mongoose
const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/proyectoFinal';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Error al conectar MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
