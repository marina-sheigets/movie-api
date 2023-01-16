const userService = require('../services/userService');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error');
const dayjs = require('dayjs');
const { REFRESH_TOKEN } = require('../constants');

class AuthController {
	async registration(req, res, next) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json('Data must have minimum 3 characters. Try again');
			}
			const { email, username, password } = req.body;
			const userData = await userService.registration(email, username, password);
			res.cookie(REFRESH_TOKEN, userData.refreshToken, {
				expires: dayjs().add(30, 'days').toDate(),
				httpOnly: true,
			});
			return res.json(userData);
		} catch (err) {
			next(err);
			res.status(400).json(err.message);
		}
	}

	async login(req, res, next) {
		try {
			const { email, password } = req.body;
			const userData = await userService.login(email, password);
			res.cookie(REFRESH_TOKEN, userData.refreshToken, {
				expires: dayjs().add(30, 'days').toDate(),
				httpOnly: true,
			});
			return res.json(userData);
		} catch (err) {
			next(err);
		}
	}

	async logout(req, res, next) {
		try {
			const { refreshToken } = req.cookies;
			res.clearCookie('refreshToken');
			await userService.logout(refreshToken);
			return res.status(200).json('User is logged out');
		} catch (err) {
			next(err);
		}
	}

	async refresh(req, res, next) {
		try {
			const { refreshToken } = req.cookies;
			const userData = await userService.refresh(refreshToken);

			if (userData == 401) throw ApiError.UnathorizedError();

			res.cookie(REFRESH_TOKEN, userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: false,
			});
			return res.json(userData);
		} catch (err) {
			return res.json(err);
		}
	}
}

module.exports = new AuthController();
