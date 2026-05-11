/**
 * Obtiene el nombre de la categoría de un producto,
 * buscando primero en el objeto poblado y luego en el campo plano.
 */
export const getCatNombre = (producto) =>
  producto.categoria_id?.nombre || producto.categoria_nombre || '—';