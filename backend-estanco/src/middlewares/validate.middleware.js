// Este sirve para validar los esquemas de datos para validar que cumplan con lo pedido
import { ZodError } from "zod";

export const validateSchema = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const formattedErrors = result.error.issues.map((err) => ({
      field: err.path.length ? err.path[0] : "body",
      message: err.message,
    }));

    return res.status(400).json({
      message: "Error de validación",
      error: formattedErrors,
    });
  }

  req.body = result.data;
  next();
};