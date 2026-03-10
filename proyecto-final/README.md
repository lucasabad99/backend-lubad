# Proyecto Final - Backend 1

API REST con Express + MongoDB (Mongoose), con vistas renderizadas en Handlebars.

## Stack

- Node.js
- Express
- MongoDB + Mongoose
- mongoose-paginate-v2
- express-handlebars

## Estructura del proyecto

text
proyecto-final/
├─ server.js
├─ package.json
├─ public/
│  └─ styles.css
└─ src/
   ├─ config/
   │  └─ db.js
   ├─ controllers/
   │  ├─ product-controller.js
   │  └─ cart-controller.js
   ├─ models/
   │  ├─ Product.js
   │  └─ Cart.js
   ├─ repositories/
   │  ├─ product-repository.js
   │  └─ cart-repository.js
   ├─ routers/
   │  ├─ products.router.js
   │  ├─ carts.router.js
   │  └─ views.router.js
   ├─ views/
   │  ├─ index.handlebars
   │  ├─ productDetails.handlebars
   │  ├─ cart.handlebars
   │  └─ layouts/
   │     └─ main.handlebars
   └─ utils/
      └─ custom-error.js


## Configuración

- Conexión a Mongo fija en `src/config/db.js`: `mongodb://localhost:27017/proyectoFinal`
- Puerto del server en `server.js`: `8080`
- El proyecto no usa `dotenv`

## Instalación y arranque

Desde la carpeta `proyecto-final`:

bash
npm install
npm start


Base URL:

text
http://localhost:8080


## MongoDB: ¿hay que crear DB/colecciones?

- No hace falta crear la DB manualmente.
- No hace falta crear colecciones manualmente.
- Mongo crea `proyectoFinal`, `products` y `carts` al primer insert.

## Endpoints API (Postman)

### Productos

- `GET /products`
- `GET /products/:pid`
- `DELETE /products/:pid`

### Query params en `GET /products`

- `limit` (default: `10`)
- `page` (default: `1`)
- `sort=asc|desc` (ordena por `price`)
- `category=<valor>` (filtra por categoría)
- `status=true|false` (filtra por estado)
- `query=<valor>` (compatibilidad: categoría o booleano)

Ejemplos:

- `GET /products?category=escultura`
- `GET /products?status=false`
- `GET /products?category=escultura&limit=5&page=1&sort=asc`

### Carritos

- `GET /api/carts/:cid`
- `PUT /api/carts/:cid`
- `PUT /api/carts/:cid/products/:pid`
- `DELETE /api/carts/:cid/products/:pid`
- `DELETE /api/carts/:cid`

Body ejemplo para `PUT /api/carts/:cid`:

json
{
  "products": [
    { "product": "PRODUCT_ID", "quantity": 2 }
  ]
}


Body ejemplo para `PUT /api/carts/:cid/products/:pid`:

json
{
  "quantity": 3
}


## Rutas de vistas (Handlebars)

- `GET /`
- `GET /products/:pid/view`
- `GET /carts/:cid/view`

## Carga de datos de ejemplo (mongosh)

javascript
use proyectoFinal

db.products.insertMany([
  {
    title: "Yerba 1kg",
    description: "Yerba mate tradicional",
    price: 4500,
    category: "almacen",
    status: true,
    stock: 30,
    thumbnails: []
  },
  {
    title: "Mate de madera",
    description: "Mate algarrobo",
    price: 9800,
    category: "accesorios",
    status: true,
    stock: 12,
    thumbnails: []
  }
])

const p1 = db.products.findOne({}, { _id: 1 })
db.carts.insertOne({ products: [{ product: p1._id, quantity: 2 }] })


## Estado de funcionamiento

- Conexión a MongoDB operativa.
- Endpoints de productos y carritos funcionando.
- Filtros por `category` y `status` funcionando.
- Vistas Handlebars renderizando en navegador.
