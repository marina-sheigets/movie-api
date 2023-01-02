const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
// REGISTER
router.post('/register', async (req, res) => {
	const hashedPassword = CryptoJS.AES.encrypt(
		req.body.password,
		proccess.env.SECRET_KEY
	).toString();
	const newUser = await new User({
		username: req.body.username,
		email: req.body.email,
		password: hashedPassword,
	});
	try {
		const user = await newUser.save();
		res.status(201).json(user);
	} catch (e) {
		res.status(500).json(e);
	}
});

module.exports = router;
