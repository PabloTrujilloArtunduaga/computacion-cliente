import Product from "../models/producto.model.js";
import Category from "../models/categorias.model.js";
import { productoSchema } from "../schema/update/productosUpdate.schema.js";

/*
==========================================
GET PRODUCTS
==========================================
*/

export const getProducts = async (req, res) => {

  try {

    // SOLO PRODUCTOS NO ELIMINADOS
    const products = await Product.find({
      deleted: false
    })
    .populate("categoria_id");

    res.json(products);

  } catch (error) {

    res.status(500).json({
      message: "Error obteniendo productos"
    });
  }
};

/*
==========================================
CREATE PRODUCT
==========================================
*/

export const createProduct = async (req, res) => {

  try {

    const { categoria_id } = req.body;

    const categoria =
      await Category.findById(
        categoria_id
      );

    if (!categoria) {

      return res.status(400).json({
        message: "Categoría no existe"
      });
    }

    const existe =
      await Product.findOne({
        nombre: req.body.nombre,
        deleted: false
      });

    if (existe) {

      return res.status(400).json({
        message: "El producto ya existe"
      });
    }

    const product =
      new Product({

        ...req.body,

        categoria_id,

      });

    await product.save();

    res.json(product);

  } catch (error) {

    res.status(500).json({
      message: "Error creando producto"
    });
  }
};

/*
==========================================
GET ONE PRODUCT
==========================================
*/

export const getProduct = async (req, res) => {

  try {

    const product =
      await Product.findOne({

        _id: req.params.id,

        deleted: false

      });

    if (!product) {

      return res.status(404).json({
        message: "Producto no encontrado"
      });
    }

    res.json(product);

  } catch (error) {

    res.status(500).json({
      message: "Error obteniendo producto"
    });
  }
};

/*
==========================================
SOFT DELETE
==========================================
*/

export const deleteProduct = async (req, res) => {

  try {

    const product =
      await Product.findByIdAndUpdate(

        req.params.id,

        {
          deleted: true
        },

        {
          new: true
        }
      );

    if (!product) {

      return res.status(404).json({
        message:
          "Producto no encontrado"
      });
    }

    res.json({

      message:
        "Producto eliminado",

      product

    });

  } catch (error) {

    res.status(500).json({
      message:
        "Error eliminando producto"
    });
  }
};

/*
==========================================
UPDATE PRODUCT
==========================================
*/

export const updateProduct = async (req, res) => {

  try {

    // VALIDAR ZOD
    const validatedData =
      productoSchema.parse(
        req.body
      );

    const product =
      await Product.findByIdAndUpdate(

        req.params.id,

        validatedData,

        {
          new: true
        }
      );

    if (!product) {

      return res.status(404).json({
        message:
          "Producto no encontrado"
      });
    }

    res.json(product);

  } catch (error) {

    // ERROR ZOD
    if (
      error.name === "ZodError"
    ) {

      return res.status(400).json({

        message:
          "Error de validación",

        error:
          error.errors.map(
            (e) => ({
              field:
                e.path[0],

              message:
                e.message
            })
          )
      });
    }

    res.status(500).json({
      message:
        "Error del servidor"
    });
  }
};