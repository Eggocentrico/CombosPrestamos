const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const equipos = require('./items')

const log = console.log;

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/combos', {useNewUrlParser: true, useUnifiedTopology: true});

const Prestamos = mongoose.model('Prestamo', new mongoose.Schema({
	nombre: String,
	correo: String,
	fechain: String,
	fecha: Number,
	articulo: Number,
	aprobado: Boolean,
	entregado: Boolean
}))

const Users = mongoose.model('User', new mongoose.Schema({
	username: String,
	password: String,
	email: String,
	permcode: Number
}))

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'static')));
app.set('views', './pages');
app.set('view engine', 'pug');

const PORT = 80;
const P_KEY = '$2a$10$zywtA.tX4MH/YTl8UEzZtuUaEz//znBRyYBfNyYSLvbyrUQH2mH9.'

app.get('/', async (req, res) => {
	jwt.verify(req.cookies.Autorization, P_KEY, (err, decoded) => {
		Prestamos.find().then((prestamos) => {
			let equiposNew = [...equipos]
			for (let x = 0; x < prestamos.length; x++) {
				if (prestamos[x].entregado)
					continue;
				equiposNew[prestamos[x].articulo] = 'No disponible';
			}
			const admin = decoded ? true : false
			res.render('index.pug', {prestamos, equiposNew, equipos, admin});
		})
	})
	}
);

app.get('/auth', async (req, res) => {
	res.render('auth.pug');
});

app.post('/auth', async (req, res) => {
	const user = await Users.find({username: req.body.username});
	bcrypt.compare(req.body.password, user[0].password).then(result => {
		 if (result)
			jwt.sign({ user: 'jhonatan', email: 'jhonatandaar@gmail.com', password: user[0].password }, P_KEY, { expiresIn: '24h' }, (err, token) => {
			res.cookie('Autorization', token).redirect('/');
			});
		 else
			res.redirect('/');
	})
});

app.post('/submit', (req, res) => {
	log(req.body);
	const actual = new Date().getTime();
	const specified = new Date(req.body.fecha).getTime();
	const computed = Math.ceil((specified - actual) / (1000 * 60 * 60 * 24));

	if (!(computed <= -1)) {
		const prestamo = new Prestamos({
			nombre: req.body.nombre,
			correo: req.body.correo,
			fechain: new Date().toLocaleDateString(),
			fecha: computed,
			articulo: req.body.articulo,
			aprobado: false,
			entregado: false
		})
		prestamo.save().then(() => console.log('Saved successfully'))
	}
	res.redirect('/');
})

app.get('/aprove/:id', async (req, res) => {
	jwt.verify(req.cookies.Autorization, P_KEY, (err, decoded) => {
		if (decoded) {
			log(req.params.id)
			Prestamos.findOne({ _id: req.params.id }).then(doc => {
				doc.aprobado = !doc.aprobado;
				doc.save()
			})
		}
	})
	res.redirect('/');
})

app.get('/give/:id', async (req, res) => {
	jwt.verify(req.cookies.Autorization, P_KEY, (err, decoded) => {
		if (decoded) {
			Prestamos.findOne({ _id: req.params.id }).then(doc => {
				doc.entregado = !doc.entregado;
				doc.save()
			})
		}
	})
	res.redirect('/');
})

app.listen(PORT, () => {
	log(`Listening on port: ${PORT}`);
})
