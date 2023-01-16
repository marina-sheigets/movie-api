const { scryptSync } = require('crypto');
const jwt = require('jsonwebtoken');
const Token = require('../models/Token');

class TokenService {
	generateTokens(payload) {
		const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
			expiresIn: '10s',
		});
		const refreshToken = scryptSync(process.env.JWT_REFRESH_SECRET, 'salt', 64).toString('hex');

		return {
			accessToken,
			refreshToken,
		};
	}

	async saveToken(userId, refreshToken) {
		const tokenData = await Token.findOne({ user: userId });
		if (tokenData) {
			tokenData.refreshToken = refreshToken;
			return tokenData.save();
		}

		const token = await Token.create({ user: userId, refreshToken });
		return token;
	}

	async removeToken(refreshToken) {
		const tokenData = await Token.deleteOne({ refreshToken });
		return tokenData;
	}

	async findToken(refreshToken) {
		const tokenData = await Token.findOne({ refreshToken });
		return tokenData;
	}

	validateAccessToken(token) {
		try {
			const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
			return userData;
		} catch (err) {
			return null;
		}
	}
}

module.exports = new TokenService();
