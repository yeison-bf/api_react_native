const { Router } = require('express');
const ctrl = require('../controllers/categoryController');
const { verifyToken, verifyRole } = require('../middlewares/auth');

const router = Router();
const admin = [verifyToken, verifyRole('administrador')];

// Públicas
router.get('/', ctrl.getCategories);
router.get('/:id', ctrl.getCategory);

// Solo administrador
router.post('/', admin, ctrl.createCategory);
router.put('/:id', admin, ctrl.updateCategory);
router.delete('/:id', admin, ctrl.deleteCategory);

module.exports = router;
