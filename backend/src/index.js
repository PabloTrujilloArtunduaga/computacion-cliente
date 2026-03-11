// Importar express para conectar el servidor
import express from 'express';
// Importar morgan
import morgan from 'morgan';
// Importar la conexion a la base de datos
import { connectDB  } from './db.js';
// Import authRoutes
import authRoutes from "./routes/auth.rout.js"
// Cookie
import cookeParser from 'cookie-parser'
// Crear una constante
// Se puede poner cualquier nombre: "app"
// Sera igual a lo que express traera
const app = express()
// Cookie
app.use(cookeParser())
// Mostrar peticiones
app.use(morgan('dev'))
// Usar los formatos json
app.use(express.json())

// Conectar a la base de datos
connectDB()
// Ruta
app.use('/api', authRoutes)
// Puerto a conectar, realiza la conexion
app.listen(4000)
// Revisar si hay problemas en el servidor
console.log('Run server', 4000)
// Ejecutar archivos en node src/index.js 