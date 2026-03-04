// Importar mongoose
import mongoose from "mongoose";

export const connectDB = async () => {

    try {
        await mongoose.connect('mongodb://localhost/menrmiercoles16')
        console.log("Succesfully conection")
    } catch (error) {
        console.log(error)
    }
    
}