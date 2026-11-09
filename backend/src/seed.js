/**
 * Script de datos de prueba.
 * Ejecutar con: npm run seed
 */
import bcrypt from 'bcrypt';
import { pathToFileURL } from 'node:url';
import { connectDB, disconnectDB } from './config/db.js';
import Usuario from './models/usuario.model.js';
import Categoria from './models/categorias.model.js';
import Producto from './models/producto.model.js';
import Empleado from './models/empleado.model.js';
import Factura from './models/factura.model.js';

const SALT_ROUNDS = 10;

const upsertUsuario = async ({ nombre, email, password, rol }) => {
  const existe = await Usuario.findOne({ nombre });

  if (existe) return existe;

  return Usuario.create({
    nombre,
    email,
    password: await bcrypt.hash(password, SALT_ROUNDS),
    rol,
  });
};

export const seed = async () => {
  await connectDB();

  const admin = await upsertUsuario({
    nombre: 'Admin',
    email: 'admin@test.com',
    password: 'Admin123!',
    rol: 'admin',
  });

  const cliente = await upsertUsuario({
    nombre: 'Cliente',
    email: 'cliente@test.com',
    password: 'Cliente123!',
    rol: 'cliente',
  });

  const usuarioEmpleado = await upsertUsuario({
    nombre: 'Empleado',
    email: 'empleado@test.com',
    password: 'Empleado123!',
    rol: 'empleado',
  });

  let empleado = await Empleado.findOne({ usuario_id: usuarioEmpleado._id });
  if (!empleado) {
    empleado = await Empleado.create({
      usuario_id: usuarioEmpleado._id,
      cargo: 'Vendedor',
      salario: 1500000,
      fecha_contratacion: new Date(),
    });
  }

  let categoria = await Categoria.findOne({ nombre: 'cervezas' });
  if (!categoria) {
    categoria = await Categoria.create({
      nombre: 'cervezas',
      descripcion: 'Cervezas nacionales e importadas',
    });
  }

  let producto = await Producto.findOne({ nombre: 'Aguila Light' });
  if (!producto) {
    producto = await Producto.create({
      nombre: 'Aguila Light',
      descripcion: 'Bebida refrescante',
      precio: 10000,
      stock: 20,
      categoria_id: categoria._id,
      codigo_barras: '123456789',
      imagen: 'https://via.placeholder.com/300',
    });
  }

  const facturaExistente = await Factura.findOne({ cliente_id: cliente._id });
  if (!facturaExistente) {
    const cantidad = 2;
    const precio = producto.precio;

    await Factura.create({
      cliente_id: cliente._id,
      empleado_id: empleado._id,
      productos: [
        {
          producto_id: producto._id,
          nombre: producto.nombre,
          cantidad,
          precio_unitario: precio,
          subtotal: cantidad * precio,
        },
      ],
      metodo_pago: 'Efectivo',
      estado: 'pagada',
    });
  }

  console.log('✅ Datos de prueba creados');
  console.log(`   Admin: ${admin.email} / Admin123!`);
};

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  seed()
    .catch((error) => {
      console.error('❌ Error ejecutando seed:', error.message);
      process.exitCode = 1;
    })
    .finally(async () => {
      await disconnectDB();
    });
}
