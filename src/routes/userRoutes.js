const { Router } = require('express');
const ctrl = require('../controllers/userController');
const { verifyToken, verifyRole } = require('../middlewares/auth');

const router = Router();

// Todo el módulo de usuarios es solo para administradores
router.use(verifyToken, verifyRole('administrador'));

router.get('/roles', ctrl.getRoles);
router.get('/', ctrl.getUsers);
router.get('/:id', ctrl.getUser);
router.post('/', ctrl.createUser);
router.put('/:id', ctrl.updateUser);
router.delete('/:id', ctrl.deleteUser);

module.exports = router;
