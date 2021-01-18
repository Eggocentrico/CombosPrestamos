const express = require('express');
const path = require('path');
const log = console.log;

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/combos', {useNewUrlParser: true, useUnifiedTopology: true});

const Prestamos = mongoose.model('Prestamo', new mongoose.Schema({
	nombre: String,
	correo: String,
	fechain: String,
	fecha: Number,
	articulo: Number,
	aprobado: Boolean
}))

const equipos = [
	'Portatil-1',
	'Portatil-2',
	'Portatil-3',
	'Portatil-4',
	'Portatil-5',
	'Portatil-6'
];

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'static')));
app.set('views', './pages');
app.set('view engine', 'pug');

const PORT = 80;

app.get('/', async (req, res) => {
	const prestamos = await Prestamos.find();
	let equiposNew = [...equipos]
	for (let x = 0; x < prestamos.length; x++) {
		equiposNew[prestamos[x].articulo] = 'No disponible';
	}
	res.render('index.pug', {prestamos, equiposNew, equipos});
});

app.post('/submit', (req, res) => {
	log(req.body);
	const actual = new Date().getTime();
	const specified = new Date(req.body.fecha).getTime();
	const computed = Math.ceil((specified - actual) / (1000 * 60 * 60 * 24));

	if (computed <= -1) {
		log('invalid')
	} else {
		const prestamo = new Prestamos({
			nombre: req.body.nombre,
			correo: req.body.correo,
			fechain: new Date().toLocaleDateString(),
			fecha: computed,
			articulo: req.body.articulo,
			aprobado: false
		})
		prestamo.save().then(() => console.log('Saved successfully'))
	}
	res.redirect('/');
})

app.listen(PORT, () => {
	log(`Listening on port: ${PORT}`);
})
