import multer from 'multer';
export function notFound(req, res) { res.status(404).json({ success: false, message: 'Recurso no encontrado' }); }
export function errorHandler(err, req, res, next) {
  console.error(err);
  if (err instanceof multer.MulterError) return res.status(400).json({ success: false, message: `Archivo rechazado: ${err.message}` });
  if (err.message === 'Tipo de archivo no permitido') return res.status(400).json({ success: false, message: err.message });
  if (err.name === 'ValidationError') return res.status(422).json({ success: false, message: 'Datos inválidos', errors: Object.values(err.errors).map(e => e.message) });
  if (err.code === 11000) return res.status(409).json({ success: false, message: 'Ya existe un registro con esos datos' });
  res.status(err.status || 500).json({ success: false, message: err.status ? err.message : 'Error interno del servidor' });
}
