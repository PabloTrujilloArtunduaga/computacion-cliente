import 'dotenv/config';

/**
 * Configuración centralizada del backend.
 * Falla al arrancar si falta una variable crítica en producción.
 */

const env = process.env.NODE_ENV || 'development';
const isProduction = env === 'production';

const tokenSecret = process.env.TOKEN_SECRET || (isProduction ? null : 'dev_secret_solo_para_desarrollo');

if (!tokenSecret) {
  throw new Error('TOKEN_SECRET es obligatorio en producción');
}

export const config = {
  env,
  isProduction,
  port: Number(process.env.PORT) || 3000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/estanco',
  tokenSecret,
  tokenExpiresIn: process.env.TOKEN_EXPIRES_IN || '1d',
  clientOrigin: process.env.CLIENT_ORIGIN || null,
  allowedOrigins: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    ...(process.env.CLIENT_ORIGIN ? [process.env.CLIENT_ORIGIN] : []),
  ],
};

// Compatibilidad con imports existentes
export const TOKEN_SECRET = config.tokenSecret;
