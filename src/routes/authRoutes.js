const { Router } = require('express');
const { register, login, profile } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/auth');

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', verifyToken, profile);

module.exports = router;
