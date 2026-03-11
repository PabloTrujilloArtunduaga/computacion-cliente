import jwt, { decode } from 'jsonwebtoken'
import { TOKEN_SECRET } from '../config.js'

// La palabras next no debe ir en el 1 o 2 posicion, debe tener un orden
// Next -> Va a ver saltos
export const authRequired = (req, res, next) => {
    const {token} = req.cookies

    if(!token) 
        return res.status(401).json({message: "No token, Autorizacion denegada"})

    jwt.verify(token, TOKEN_SECRET, (error, decode) => {
        if(error) return res.status(403).json({message: "Token no valido"})
            req.user = user;
            next()
    })
}