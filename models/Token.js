const { model, Schema } = require('mongoose');

const Token = new Schema({
	refreshToken: { type: String, required: true },
	user: { type: String, required: true },
});

module.exports = model('Token', Token);
