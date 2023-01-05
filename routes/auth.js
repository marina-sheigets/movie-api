require('dotenv').config();
const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

// REGISTER
router.post('/register', async (req, res) => {
	const user = User.findOne({ email: req.body.email });
	if (user) {
		res.status(403).json('User already exists !');
	}

	const hashedPassword = CryptoJS.AES.encrypt(
		req.body.password,
		process.env.SECRET_KEY
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

//LOGIN

router.post('/login', async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			res.status(401).json('Wrong password or username !');
		}
		const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
		const initialPassword = bytes.toString(CryptoJS.enc.Utf8);
		if (initialPassword !== req.body.password) {
			res.status(401).json('Wrong password or username !');
		}
		const accessToken = jwt.sign(
			{ id: user._id, isAdmin: user.isAdmin },
			process.env.SECRET_KEY,
			{
				expiresIn: '1h',
			}
		);

		const { password, ...info } = user._doc;
		res.status(200).json({ ...info, accessToken });
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
