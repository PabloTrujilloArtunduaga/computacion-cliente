
import { connectDB  } from './config/db.js';
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser'
import productRoutes from './routes/product.routes.js'
import categoryRoutes from './routes/categoria.route.js'
import userRoutes from './routes/usuario.routes.js'
import empleadoRoutes from './routes/empleado.routes.js'
import facturaRoutes from './routes/facture.routes.js'
import cors from 'cors';



const app = express()

// Middleware
app.use(cors())
app.use(express.json());
app.use(morgan('dev'))
// Admin
app.use("/admin", productRoutes);
app.use("/admin", categoryRoutes);
app.use("/admin", userRoutes);
app.use("/admin", empleadoRoutes);
app.use("/admin", facturaRoutes);

// Conectar base de datos
connectDB()

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000')
})