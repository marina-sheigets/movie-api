const User = require('../models/User');
const bcrypt = require('bcryptjs');
const tokenService = require('./tokenService');
const UserDTO = require('../dtos/userDTO');
const ApiError = require('../exceptions/api-error');

class UserService {
	async registration(email, username, password) {
		const candidate = await User.findOne({ email });
		if (candidate) {
			throw ApiError.BadRequest(`User with ${email}  exists`);
		}
		const hashPassword = await bcrypt.hash(password, 4);
		const user = await User.create({ email, username, password: hashPassword });

		const userDTO = new UserDTO(user);
		const tokens = tokenService.generateTokens({ ...userDTO });
		await tokenService.saveToken(userDTO.id, tokens.refreshToken);

		return {
			...tokens,
			user: userDTO,
		};
	}

	async login(email, password) {
		const candidate = await User.findOne({ email });
		if (!candidate) {
			throw ApiError.BadRequest('User was not found');
		}
		const isPassEquals = await bcrypt.compare(password, candidate.password);
		if (!isPassEquals) {
			throw ApiError.BadRequest('Incorrect password');
		}

		const userDTO = new UserDTO(candidate);
		const tokens = tokenService.generateTokens({ ...userDTO });
		await tokenService.saveToken(userDTO.id, tokens['refreshToken']);

		return {
			...tokens,
			user: userDTO,
		};
	}

	async logout(refreshToken) {
		const token = await tokenService.removeToken(refreshToken);
		return token;
	}

	async refresh(refreshToken) {
		if (!refreshToken) {
			throw ApiError.UnathorizedError();
		}

		const foundToken = await tokenService.findToken(refreshToken);
		if (!foundToken) {
			throw ApiError.UnathorizedError();
		}
		const user = await User.findById(foundToken.user);
		const userDTO = new UserDTO(user);
		const tokens = tokenService.generateTokens({ ...userDTO });
		await tokenService.saveToken(userDTO.id, tokens['refreshToken']);

		return {
			...tokens,
			user: userDTO,
		};
	}
}

module.exports = new UserService();
