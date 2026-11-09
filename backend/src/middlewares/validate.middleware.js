/**
 * Valida el body contra un esquema Zod y reemplaza req.body
 * por los datos saneados (sin campos desconocidos).
 */
export const validateSchema = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: 'Error de validación',
      error: result.error.issues.map((issue) => ({
        field: issue.path.join('.') || 'body',
        message: issue.message,
      })),
    });
  }

  req.body = result.data;
  next();
};
