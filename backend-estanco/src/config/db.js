import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/estanco");
    console.log("MongoDB conectado");
  } catch (error) {
    console.error("Error de conexión:", error);
    process.exit(1);
  }
};