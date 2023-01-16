const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, unique: true , default: 'User' },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Role', RoleSchema);
