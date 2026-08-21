export const ok = (res, data = null, message = 'Operación completada', status = 200) => res.status(status).json({ success: true, message, data });
export const fail = (res, message = 'Ocurrió un error', status = 400, errors) => res.status(status).json({ success: false, message, ...(errors ? { errors } : {}) });
export const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
export function sanitizeText(value, max = 5000) { return typeof value === 'string' ? value.replace(/[<>]/g, '').trim().slice(0, max) : value; }
