import { connectDB } from './config/db.js';
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// RUTAS
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/categoria.route.js';
import userRoutes from './routes/user.routes.js';
import usuarioRoutes from './routes/usuario.routes.js';
import empleadoRoutes from './routes/empleado.routes.js';
import facturaRoutes from './routes/facture.routes.js';

const app = express();

// MIDDLEWARES
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

/* =========================
   🔐 AUTH (LOGIN / REGISTER)
========================= */
app.use('/api/users', userRoutes);

/* =========================
   👤 CRUD USUARIOS
========================= */
app.use('/api/usuarios', usuarioRoutes);

/* =========================
   📦 PRODUCTOS
========================= */
app.use('/api/products', productRoutes);

/* =========================
   🏷️ CATEGORÍAS
========================= */
app.use('/api/categories', categoryRoutes);

/* =========================
   👷 EMPLEADOS
========================= */
app.use('/api/empleados', empleadoRoutes);

/* =========================
   🧾 FACTURAS (ADMIN)
========================= */
app.use('/api/facturas', facturaRoutes);

/* =========================
   DB
========================= */
connectDB();

/* =========================
   SERVER
========================= */
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});