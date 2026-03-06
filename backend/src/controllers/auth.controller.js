import User from "../models/user.model.js"
import bycrypt from 'bcryptjs'
import { createAccessToken } from '../libs/jwt.js';

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
        const passwordHash = await bycrypt.hash(password, 10)
        const newUser = new User({
            username,
            email,
            password: passwordHash,
        });

        const userSaved = await newUser.save();
        const token = await createAccesToken({id: userSaved._id})
        res.cookie("token", token);
        res.json({
            message: "User create",
        })

        res.json({
            id: userSaved.id,
            username: userSaved.username,
            createdAt: userSaved.createdAt,
            updateAt: userSaved.updateOne
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message})
        
    }
};

export const login = (req, res) => res.send('login');
