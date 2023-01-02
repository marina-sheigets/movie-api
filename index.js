const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
const app = express();

mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('MongoDB connected'))
	.catch((err) => console.log(err));

app.use(express.json());
app.use('/api/auth', authRoute);

app.listen(8800, () => {
	console.log('Server is running ...');
});
