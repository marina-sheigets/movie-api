const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { PORT } = require('./constants');
require('dotenv').config();
const authRoute = require('./routes/auth');
//const usersRoute = require('./routes/users');
const app = express();

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', req.headers.origin);
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
	cors({
		credentials: true,
		origin: process.env.CLIENT_URL,
	})
);

//routes
//app.use('/todos', TodosRouter);
app.use('/auth', authRoute);

//connect to mongoDB
mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('MongoDB connected'))
	.catch((err) => console.log(err));

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}...`);
});
// const express = require('express');
// const { PORT } = require('./constants');
// require('dotenv').config();
// const mongoose = require('mongoose');
// const authRoute = require('./routes/auth');
// const usersRoute = require('./routes/users');
// const app = express();

// app.use(express.json());
// app.use('/api/auth', authRoute);
// app.use('/api/users', usersRoute);
// app.listen(PORT, () => {
// 	console.log(`Server is running on PORT=${PORT}`);
// });
