import express from 'express';
import { Manager } from './managers/user.manager.js';

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}));

app.get('/carrito/:id', async(req, res) => {
try {
    const { id } = req.params;
    const users = await Manager.getUsers();
    res.json(users);
} catch (error) {
    res.status(500).json({error: error.message})
}
});

app.post('/users', async(req, res) => {
try {
    console.log(req.body)
    const user = await Manager.register(req.body);
    res.json(user);
} catch (error) {
    res.status(500).json({error: error.message})
}
})

app.put('/users/:id', async(req, res) => {
try {
    const { id } = req.params;
    const users = await Manager.update(id, req.body);
    res.json(users);
} catch (error) {
    res.status(500).json({error: error.message})
}
});


app.delete('/users/:id', async(req, res) => {
try {
    const { id } = req.params;
    const users = await Manager.delete(id);
    res.json(users);
} catch (error) {
    res.status(500).json({error: error.message})
}
});

app.listen(8080, ()=> console.log('server running on port 8080'))