import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

/** Firma un token de acceso con el payload indicado. */
export function createAccessToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      config.tokenSecret,
      { expiresIn: config.tokenExpiresIn },
      (err, token) => {
        if (err) return reject(err);
        resolve(token);
      }
    );
  });
}

/** Verifica un token y devuelve su payload. */
export function verifyAccessToken(token) {
  return jwt.verify(token, config.tokenSecret);
}
