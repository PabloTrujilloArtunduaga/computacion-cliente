import User from '../models/usuario.model.js'

// Buscar muchos usuarios
export const getUsers = async (req, res) => {
  const user = await User.find({ estado: true })
  console.log(user);
  res.json(user)
}

// Crear usuario
export const createUser = async (req, res) => {
  const { email } = req.body;
   const existe = await User.findOne({ email });

  if (existe) {
    return res.status(400).json({
      message: "El email ya existe"
    });
  }


  const user = new User(req.body)
  await user.save()
  res.json(user)
}

// Buscar un solo usuario
export const getUser = async (req, res) => {
    const user = await User.findById(req.params.id)
    if(!user) return res.status(404).json({ message: "User not found" })
    res.json(user)
}

// Borrar soft
export const deleteUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { estado: false },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: "User not found for deleted" });
  }

  res.json({ message: "User soft deleted", user });
};

// Actualizar usuario
export const updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: "user not found for update" });
  }

  res.json(user);
};
