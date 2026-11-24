const { Router } = require('express');
const ctrl = require('../controllers/countryController');
const { verifyToken, verifyRole } = require('../middlewares/auth');

const router = Router();
const admin = [verifyToken, verifyRole('administrador')];

// Públicas
router.get('/', ctrl.getCountries);
router.get('/:id', ctrl.getCountry);
router.get('/:id/categories', ctrl.getCountryCategories);

// Solo administrador
router.post('/', admin, ctrl.createCountry);
router.put('/:id', admin, ctrl.updateCountry);
router.delete('/:id', admin, ctrl.deleteCountry);

module.exports = router;
