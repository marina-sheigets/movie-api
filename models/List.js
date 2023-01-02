const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String },
		img: { type: String },
		trailer: { type: String },
		imgTitle: { type: String },
		imgSmall: { type: String },
		video: { type: String },
		year: { type: String },
		limit: { type: Number },
		genre: { type: String },
		isSeries: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.export = mongoose.model('User', UserSchema);
