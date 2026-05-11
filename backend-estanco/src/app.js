const express = require('express')
const app = express()

app.use(express.json())

const userRoutes = require('./routes/user.routes')
const facturaRoutes = require('./routes/factura.routes')
const productoRoutes = require('./routes/product.routes')
const usuarioRoutes = require('./routes/usuario.routes')

app.use('/api/users', userRoutes)
app.use('/api/facturas', facturaRoutes)
app.use('/api/productos', productoRoutes)
app.use('/api/usuarios', usuarioRoutes)

module.exports = app