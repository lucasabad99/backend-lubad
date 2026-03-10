const { connect } = require('mongoose');

const MONGO_URL = 'mongodb://localhost:27017/proyectoFinal';

const initMongoDB = async () => {
  try {
    await connect(MONGO_URL);
    console.log('Connected to MongoDB ✓');
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = initMongoDB;
