const express = require('express');
const session = require('express-session')

const MongoStore = require('connect-mongo')
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }

const ContenedorProductos = require('./src/class/Products')
const ContenedorMensajes = require('./src/class/Messages')

const routerProductos = require('./src/routes/productos')


/* --- Instancias  ---- */

const controllerProductos = new ContenedorProductos()
const controllerMensajes = new ContenedorMensajes()


/* ------ Socket.io ------ */

const { Server: HttpServer } = require('http')
const { Server: Socket } = require('socket.io')

const app = express();

app.use(session({ 
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://lautarxtomas:lautaro123@cluster0.xpais9l.mongodb.net/ecommerce?retryWrites=true&w=majority' || 'mongodb://localhost/ecommerce',
        mongoOptions: advancedOptions
    }),
    secret: 'secretovich',
    resave: false,
    saveUnitialized: false
}))

const httpServer = new HttpServer(app)
const io = new Socket(httpServer)



io.on('connection', async socket => {

    console.log('Se conectó un nuevo cliente');

    // Productos
    socket.emit('productos', await controllerProductos.getRandom());

    // Mensajes
    socket.emit('mensajes', await controllerMensajes.getAll());

    socket.on('new-message', async mensaje => {

        await controllerMensajes.save(mensaje)
        io.sockets.emit('mensajes', await controllerMensajes.getAll());
    })
});



/* -------  App  -------- */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));



/* -------  Rutas  -------- */

app.use('/api/productos-test', routerProductos) // --> esta ruta trae 5 productos random de faker js. Despues se fetchea en el index.js y se renderizan los productos.



/* -------  Server  -------- */

const PORT = process.env.PORT || 8080;

const server = httpServer.listen(PORT, () => console.log(`Servidor http escuchando en el puerto ${server.address().port}`));
server.on('error', error => console.log(`Error en servidor ${error}`));