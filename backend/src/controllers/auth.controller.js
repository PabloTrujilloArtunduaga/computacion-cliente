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

export const login = async (req, res) => {
    const { email, password } = req.body
    
    try {
        // Buscar el usuario.
        // findOne() buscar por un solo dato.
        const userFound = await User.findOne({ email })
        if(!userFound) return res.status(400).json({ message: 'User not found' })
        const isMatch = await bycrypt.compare(password, userFound.password)
        if(!isMatch) return res.status(400).json({ message: 'Incorret password' })
        
        const token = await createAccessToken({id: userFound._id})
        res.cookie("token", token)
        res.json({
            id: userFound.id,
            username: userFound.username,
            email: userFound.email,
            createdAt: userFound.createdAt,
            updateAt: userFound.updateAt,
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
// res.send('login');

export const logout = (req, res) => {
    res.cookie("token", "", {
        expires: new Date(0),
    })
    res.status(200).json({ message: "logout successful" })
}

export const profile = async (req, res) => {
    const userFound = await User.findById(req.user.id)
    if(!userFound) return res.status(400).json({ message: "User not found" })
    res.json({
            id: userFound.id,
            username: userFound.username,
            email: userFound.email,
            createdAt: userFound.createdAt,
            updateAt: userFound.updateAt,
        })
        
}