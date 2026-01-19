import express from 'express';
import { products } from './data.js';

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/products', (req, res)=>{
    const {value} = req.query;
    if(value){
        const filteredProducts = products.filter(p => p.price >= parseInt(value));
        return res.json(filteredProducts)
    }
    return res.json(products)
})

app.get('/products/:id', (req, res)=>{
    const {id} = req.params;
    const product = products.find((p) => p.id === parseInt(id));
    if(!product)
        return res.status(404).json({error: 'producto no encontrado'});
        res.json(products)
    })

app.post('/', (req, res) => {
    //res.send('hola mundo desde express');
    //res.json(products)
    //res.json({data:products})
    //res.render('/')
    //res.redirect('/')
    //res.status(404).json({error: 'recurso no compartido'})
    console.log(req.body);

    const user = {
        ...req.body, 
        id:Math.floor(Math.random() * 1000)
    }
     //Registro de auditoria
     res.status(201).json({message: 'usuario creado', user});
})

app.listen(8080, ()=> console.log('server running on port 8080'))
