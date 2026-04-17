// Esto es para probar la coneccion a la base de datos mas rato se debe borrar

const mongoose = require('mongoose')
const connectDB = require('./config/db')
const Usuario = require('./models/usuario.model')
const Categoria = require('./models/categorias.model')
const Producto = require('./models/producto.model')
const Empleado = require('./models/empleado.model')
const Factura = require('./models/factura.model')
// Creacion de cliente
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

// Creacion de categoria
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


// Creacion de productos
/* const crearProducto = async () => {
  try {
    await connectDB()

    const producto = await Producto.create({
      nombre: 'Aguila Light',
      descripcion: 'Bebida refrescante',
      precio: 10000,
      stock: 20,
      categoria_id: new mongoose.Types.ObjectId('69bf71102ce41c2cd0b48ae2'), 
      codigo_barras: '123456789',
      imagen: 'https://www.occident.com/blog/assets/multimedia/2022/07/SB-SALUD-bebidas-refrescantes-verano.jpg'
      
    })

    console.log('Producto creado exitosamente:', producto)
    process.exit()

  } catch (error) {
    console.error('Error al crear producto:', error.message)
    process.exit(1)
  }
}


crearProducto() */


// Creacion de rol empleado
/* const crearUsuario = async () => {
  await connectDB()

  const usuario = await Usuario.create({
    nombre: 'Empleado',
    email: 'empleado@test.com',
    password: 'empleado',
    rol: 'empleado'
  })

  console.log('Usuario creado:', usuario)
  process.exit()
}

crearUsuario() */


/* const crearEmpleado = async () => {
  try {
    await connectDB()

    // Buscar usuario con rol empleado
    const usuario = await Usuario.findOne({ rol: 'empleado' })

    if (!usuario) {
      throw new Error('No existe un usuario con rol empleado')
    }

    const empleado = await Empleado.create({
      usuario_id: usuario._id,
      cargo: 'Vendedor',
      salario: 1500000,
      fecha_contratacion: new Date()
      // estado no es necesario (default true)
    })

    console.log('Empleado creado exitosamente:', empleado)
    process.exit()

  } catch (error) {
    console.error('Error al crear empleado:', error.message)
    process.exit(1)
  }
}

crearEmpleado()  */

// Crear cliente
/* const crearUsuario = async () => {
  await connectDB()

  const usuario = await Usuario.create({
    nombre: 'Cliente',
    email: 'cliente@test.com',
    password: 'cliente'
  })

  console.log('Usuario creado:', usuario)
  process.exit()
}

crearUsuario() */


// Creacion de factura 


const crearFactura = async () => {
  try {
    await connectDB()

    // Buscar cliente
    const cliente = await Usuario.findOne({ rol: 'cliente' })
    if (!cliente) throw new Error('No hay cliente')

    // Buscar empleado
    const empleado = await Empleado.findOne()
    if (!empleado) throw new Error('No hay empleado')

    // Buscar producto
    const producto = await Producto.findOne()
    if (!producto) throw new Error('No hay producto')

    // Crear detalle
    const cantidad = 2
    const precio = producto.precio
    const subtotal = cantidad * precio

    const factura = await Factura.create({
      cliente_id: cliente._id,
      empleado_id: empleado._id,
      productos: [
        {
          producto_id: producto._id,
          nombre: producto.nombre,
          cantidad: cantidad,
          precio_unitario: precio,
          subtotal: subtotal
        }
      ],
      total: subtotal,
      metodo_pago: 'efectivo',
      estado: 'pagada'
    })

    console.log('Factura creada exitosamente:', factura)
    process.exit()

  } catch (error) {
    console.error('Error al crear factura:', error.message)
    process.exit(1)
  }
}

crearFactura()