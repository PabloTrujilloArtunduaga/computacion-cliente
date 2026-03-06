import jwt from 'jsonwebtoken'
import { TOKEN_SCRET } from '../config.js'

export function createAccessToken(payload){
    return new Promise((resolve, reject) => {
        jwt.sign(
        payload,
        // No se sube en produccion queda en interno para pruebas
        TOKEN_SCRET,
        {
            expresIn: "1d",
        },

        (err, token) => {
            if(err) reject(err)
                resolve(token)
            }
        )

    })
 
}