// Express related imports
const express = require('express');
const cookieParser = require('cookie-parser');
const authentication = require('./routers/auth/authentication');
const authorization = require('./routers/auth/authorization');
const loans = require('./routers/loans');
require('dotenv').config();

// Utilities imports
const path = require('path');
const jwt = require('jsonwebtoken');
const equipos = require('./items');

const app = express();

// Parsers
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Views
app.use(express.static(path.join(__dirname, 'static')));
app.set('views', './pages');
app.set('view engine', 'pug');

// Landing page
app.get('/', (req, res) => {
	res.render('index.pug')
})

// Routers
app.use('/auth', authorization);
app.use(authentication);
app.use('/loan', loans);

// Constants
const PORT = 80;

// Listen to port ${PORT}
app.listen(PORT, () => {
	console.log(`Listening on port: ${PORT}`);
})
