import mongoose from "mongoose";

// Creacion de la tabla de usuarios
const userScheme = new mongoose.Schema({
    // Se va a trabjar los campos de la tabla user
    // Campo username
    username: {
        type: String,
        required: true,
        // Borra los espacio en blancos
        trim: true
    },
    // Campo email
    email: {
        type: String,
        required: true,
        unique: true
    },
    // Campo contraseña
    password: {
        type: String,
        required: true
    }
}, 
{
        timestamps: true}
);


export default mongoose.model('User', userScheme)