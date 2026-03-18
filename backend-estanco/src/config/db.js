const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost/estanco')
    console.log('MongoDB conectado')
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}


module.exports = connectDB