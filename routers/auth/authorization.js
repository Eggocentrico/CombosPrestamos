const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { Users } = require('../../functions/mongoose');
const { P_KEY } = process.env

const router = express.Router();

router.use(cookieParser());

// Frontend
router.get('/', async (req, res) => {
	res.render('auth.pug');
});

// Backend
router.post('/', async (req, res) => {
	const user = await Users.findOne({username: req.body.username});
	bcrypt.compare(req.body.password, user.password).then(result => {
		 if (result)
			jwt.sign({ user: user.username, email: user.email }, P_KEY, { expiresIn: '2h' }, (err, token) => {
				res.cookie('Authorization', token).redirect('/');
			});
		 else
			res.redirect('/auth');
	})
});

router.post('/signout', async (req, res) => {
	res.clearCookie('Authorization').redirect('/');
})

module.exports = router;
