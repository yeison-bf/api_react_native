const jwt = require('jsonwebtoken');

// ⚠️ MODO PRUEBA: el token y el rol NO se están exigiendo.
// Para reactivar la seguridad, descomenta las líneas marcadas con [AUTH] y borra las marcadas con [PRUEBA].

// Verifica el header: Authorization: Bearer <token>
const verifyToken = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    // [AUTH] return res.status(401).json({ success: false, message: 'Token requerido' });
    return next(); // [PRUEBA]
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // { id, role }
    next();
  } catch (error) {
    // [AUTH] return res.status(401).json({ success: false, message: 'Token inválido o expirado' });
    return next(); // [PRUEBA]
  }
};

// Uso: verifyRole('administrador')
const verifyRole = (...roles) => (req, res, next) => {
  // [AUTH] if (!req.user || !roles.includes(req.user.role)) {
  // [AUTH]   return res.status(403).json({ success: false, message: 'No tienes permiso para esta acción' });
  // [AUTH] }
  next();
};

module.exports = { verifyToken, verifyRole };
