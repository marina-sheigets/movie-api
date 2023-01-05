const jwt = require('jsonwebtoken');

function verify(req, res, next) {
	let authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.status(401).json('You are not authenticated !');
	}
	const accessToken = authHeader.split(' ')[1];
	jwt.verify(accessToken, process.env.SECRET_KEY, (err, user) => {
		if (err) {
			res.status(403).json('Token is not valid !');
		}
		req.user = user;
		next();
	});
}

module.exports = verify;
