import Product from '../models/producto.model.js'
import Category from '../models/categorias.model.js'
import { productoSchema } from '../schema/update/productosUpdate.schema.js'

// Buscar muchos productos
export const getProducts = async (req, res) => {
  const products = await Product.find({ estado: true })
    .populate("categoria_id");
  console.log(products);
  res.json(products)
}

// Crear
export const createProduct = async (req, res) => {
  const categoria = await Category.findById(req.body.categoria_id);

  if (!categoria) {
    return res.status(400).json({ message: "Categoria no existe" });
  }

   const { nombre } = req.body;
     const existe = await Product.findOne({ nombre });
  
    if (existe) {
      return res.status(400).json({
        message: "El producto ya existe"
      });
    }
  
  const product = new Product(req.body)
  await product.save()
  res.json(product)
}

// Buscar un solo producto
export const getProduct = async (req, res) => {
    const product = await Product.findById(req.params.id)
    if(!product) return res.status(404).json({ message: "Product not found" })
    res.json(product)
}

// Borrar soft
export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { estado: false },
    { new: true }
  );

  if (!product) {
    return res.status(404).json({ message: "product not found for deleted" });
  }

  res.json({ message: "Product soft deleted", product });
};

// Actualizar
export const updateProduct = async (req, res) => {
  try {
    // 🔴 VALIDAR CON ZOD
    const validatedData = productoSchema.parse(req.body);

    // ✅ SOLO SI PASA LA VALIDACIÓN
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(product);

  } catch (error) {
    // 🔴 SI FALLA ZOD
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Error de validación",
        errors: error.errors
      });
    }

    res.status(500).json({ message: "Error del servidor" });
  }
};