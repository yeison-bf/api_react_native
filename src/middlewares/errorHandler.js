// Captura cualquier error lanzado en los controllers (Express 5 pasa los errores async aquí)
const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((e) => e.message).join(', ');
    return res.status(400).json({ success: false, message });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'ID inválido' });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(', ');
    return res.status(409).json({ success: false, message: `Ya existe un registro con ese ${field}` });
  }

  console.error(err);
  res.status(500).json({ success: false, message: 'Error interno del servidor' });
};

module.exports = errorHandler;
