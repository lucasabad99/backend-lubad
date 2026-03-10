const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const initMongoDB = require('./src/config/db');
const productsRouter = require('./src/routers/products.router');
const cartsRouter = require('./src/routers/carts.router');
const viewsRouter = require('./src/routers/views.router');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use('/public', express.static(path.join(__dirname, 'public')));

initMongoDB()
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

app.use('/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
