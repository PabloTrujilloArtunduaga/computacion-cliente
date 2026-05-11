const express = require('express')
const router = express.Router()

const {
  crearFacturaFisica,
  crearFacturaVirtual,
  listarFacturas,
  listarFacturasPendientes,
  actualizarEstadoFactura,
  eliminarFactura
} = require('../controllers/factura.controller')

const {
  verificarToken,
  verificarRol
} = require('../middlewares/auth.middleware')


router.post(
  '/virtual',
  verificarToken,
  verificarRol('cliente', 'admin'),
  crearFacturaVirtual
)


router.post(
  '/fisica',
  verificarToken,
  verificarRol('empleado', 'admin'),
  crearFacturaFisica
)


router.get(
  '/',
  verificarToken,
  verificarRol('empleado', 'admin'),
  listarFacturas
)


router.get(
  '/pendientes',
  verificarToken,
  verificarRol('empleado', 'admin'),
  listarFacturasPendientes
)


router.put(
  '/:id/estado',
  verificarToken,
  verificarRol('empleado', 'admin'),
  actualizarEstadoFactura
)


router.delete(
  '/:id',
  verificarToken,
  verificarRol('empleado', 'admin'),
  eliminarFactura
)

module.exports = router