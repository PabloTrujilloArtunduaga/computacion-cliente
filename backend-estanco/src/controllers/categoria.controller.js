import Categoria from '../models/categorias.model.js'


// Buscar categorias
export const getCategorias = async (req, res) => {
  const categorias = await Categoria.find()
  console.log(categorias);
  res.json(categorias)
}

// Buscar por una categoria
export const getCategoria = async (req, res) => {
    const categorias = await Categoria.findById(req.params.id)
    if(!categorias) return res.status(404).json({ message: "categoria not found" })
    res.json(categorias)
    console.log(categorias);
}

// Crear categoria
export const createCategoria = async (req, res) => {
  

  const categorias = new Categoria(req.body)
  await categorias.save()
  res.json(categorias)
}

// Soft borrar
export const deleteCategoria = async (req, res) => {
  const categorias = await Categoria.findByIdAndUpdate(
    req.params.id,
    { estado: true },
    { new: false }
  );
  if (!categorias) {
    console.log('categoria not found for deleted')
    return res.status(404).json({ message: "categoria not found for deleted" }); 
  }

  res.json({ message: "categoria soft deleted", categoria });
  console.log("categoria soft deleted")
};


// Actualizar
export const updateCategoria = async (req, res) => {
    const categoria = await Categoria.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    })
    if(!categoria) return res.status(404).json({ message: "categoria not found for update" })
    res.json(categoria)
}