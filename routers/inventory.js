const express = require('express');
const equipos = require('../items');
const { Articulos } = require('../functions/mongoose');

const router = express.Router();

router.get('/', async (req, res) => {
	Articulos.find().then((articulos) => {
		res.render('inventory.pug', {articulos, admin: req.Authenticated, user: req.AuthenticatedUser});
	})
})


router.get('/api', async (req, res) => {
	Articulos.find().then((articulos) => {
		res.json(articulos);
	})
})

router.post('/submit', (req, res) => {
	const articulo = new Articulos({
		id: req.body.id,
		marca: req.body.marca,
		modelo: req.body.modelo,
		peticiones: [],
		estado: req.body.estado,
		disponible: true,
		tipo: req.body.tipo,
		calificacion: req.body.calificacion
	})
	articulo.save();
	setTimeout(() => res.redirect('/inventory'), 500);
})

module.exports = router
