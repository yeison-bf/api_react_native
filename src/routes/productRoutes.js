const { Router } = require('express');
const ctrl = require('../controllers/productController');
const { verifyToken, verifyRole } = require('../middlewares/auth');

const router = Router();
const admin = [verifyToken, verifyRole('administrador')];

// Públicas
router.get('/', ctrl.getProducts);
router.get('/:id', ctrl.getProduct);

// Solo administrador
router.post('/', admin, ctrl.createProduct);
router.put('/:id', admin, ctrl.updateProduct);
router.delete('/:id', admin, ctrl.deleteProduct);

module.exports = router;
