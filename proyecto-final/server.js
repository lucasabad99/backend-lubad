// Archivo principal del servidor
const express = require('express');
const connectDB = require('./src/config/db');
const productsRouter = require('./src/routers/products.router');
const cartsRouter = require('./src/routers/carts.router');

const app = express();
app.use(express.json());

// Conexión a MongoDB
connectDB();

// Rutas
app.use('/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
