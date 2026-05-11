const express = require('express')
const app = express()

app.use(express.json())

const userRoutes = require('./routes/user.routes')
const facturaRoutes = require('./routes/factura.routes')

app.use('/api/users', userRoutes)
app.use('/api/facturas', facturaRoutes)

module.exports = app