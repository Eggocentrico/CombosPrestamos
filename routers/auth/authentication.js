const jwt = require('jsonwebtoken');
require('dotenv').config();

const { P_KEY } = process.env

module.exports = (req, res, next) => {
	jwt.verify(req.cookies.Authorization, P_KEY, (err, decoded) => {
		req.Authenticated = decoded ? true : false
		if (decoded) {
			req.AuthenticatedUser = decoded.user
			req.AuthenticatedEmail = decoded.email
		}
		next();
	})
}

