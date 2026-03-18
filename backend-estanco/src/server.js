const app = require('./app')
const connectDB = require('./config/db')

// Conectar base de datos
connectDB()

// Levantar servidor
app.listen(3000, () => {
  console.log('🚀 Servidor corriendo en http://localhost:3000')
})