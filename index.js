const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const app = express();

mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('MongoDB connected'))
	.catch((err) => console.log(err));
app.listen(8800, () => {
	console.log('Server is running ...');
});
