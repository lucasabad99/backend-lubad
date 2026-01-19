import http from 'http';

const server = http.createServer((req,res) => {
//console.log(req.url);

if(req.url === '/'){
    res.end('hola mundo');
}
if(req.url === '/products'){
    res.end(JSON.stringify([{id: 1, name: 'producto 1'}, {id:2, name:'producto 2'}]));
}
})

server.listen(8080, () => console.log('Servidor escuchando al puerto 8080'));

