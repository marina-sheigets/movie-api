const router = require('express').Router();
const AuthController = require('../controllers/authController');
const { body } = require('express-validator');

router.post(
	'/registration',
	body('email').isEmail(),
	body('password').isLength({ min: 3, max: 32 }),
	body('username').isLength({ min: 3, max: 32 }),
	AuthController.registration
);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/refresh', AuthController.refresh);

module.exports = router;
