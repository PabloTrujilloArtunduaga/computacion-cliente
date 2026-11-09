import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { config } from './config/config.js';

// ── RUTAS ─────────────────────────────────────────
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/categoria.routes.js';
import userRoutes from './routes/user.routes.js';
import usuarioRoutes from './routes/usuario.routes.js';
import empleadoRoutes from './routes/empleado.routes.js';
import facturaRoutes from './routes/factura.routes.js';

// ── MIDDLEWARES GLOBALES ──────────────────────────
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';
import { HttpError } from './utils/errors.js';

const app = express();

app.disable('x-powered-by');

// ── CORS ──────────────────────────────────────────
app.use(
  cors({
    origin: (origin, callback) => {
      // Peticiones sin Origin (Postman, curl, SSR) siempre permitidas.
      if (!origin) return callback(null, true);

      if (config.allowedOrigins.includes(origin)) return callback(null, true);

      return callback(new HttpError(403, `CORS: origen no permitido → ${origin}`));
    },
    credentials: true,
  })
);

// ── MIDDLEWARES ───────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

if (config.env !== 'test') {
  app.use(morgan(config.isProduction ? 'combined' : 'dev'));
}

// ── HEALTH CHECK ──────────────────────────────────
app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', timestamp: new Date() })
);

// ── RUTAS API ─────────────────────────────────────
app.use('/api/users', userRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/facturas', facturaRoutes);

// ── 404 + MANEJADOR DE ERRORES GLOBAL ─────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
