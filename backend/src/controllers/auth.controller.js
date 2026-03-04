import User from "../models/user.model.js"
import bycrypt from 'bcryptjs'

export const register = async (req, res) =>{
    //res.send('register');
    // Enviar un cuerpo
    //console.log(req.body)
    //res.send('Register Person')
    //console.log(email, password, username);
    //res.send('Register')
    // Guardar en una bd, usar un try-catch para evitar errores
    const {email, password, username} = req.body;
    try {
        const passwordHash = await bycrypt.has(password, 10)
        const newUser = new User({
            username,
            email,
            password: passwordHash,
        });
        const userSaved = await newUser.save();
        res.json(userSaved);
    } catch (error) {
        console.log(error);
        
    }
};



export const login = (req, res) => res.send('login');
    
