// Esto es para probar la coneccion a la base de datos mas rato se debe borrar

const mongoose = require('mongoose')
const connectDB = require('./config/db')
// const Usuario = require('./models/usuario.model')
// const Categoria = require('./models/categorias.model')
const Producto = require('./models/producto.model')

/* const crearUsuario = async () => {
  await connectDB()

  const usuario = await Usuario.create({
    nombre: 'Admin',
    email: 'admin@test.com',
    password: '123456'
  })

  console.log('Usuario creado:', usuario)
  process.exit()
}

crearUsuario() */

/* const crearCategoria = async () =>{
    await connectDB()
        const categoria = await Categoria.create({
            nombre: 'Test',
            descripcion: 'This is a test'
        })

        console.log('Categoria creada exitosamente', categoria)
        process.exit()
} */

//crearCategoria()



const crearProducto = async () =>{
    await connectDB()
        const producto = await Producto.create({
            nombre: 'Aguila Light',
            descripcion: 'Bebida energetica',
            precio: 10000,
            stock: 20,
            
        })

        console.log('Categoria creada exitosamente', categoria)
        process.exit()
} 