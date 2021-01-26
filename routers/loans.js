const express = require('express');
const equipos = require('../items');
const { Prestamos } = require('../functions/mongoose');

const router = express.Router();

router.get('/', async (req, res) => {
	Prestamos.find().then((prestamos) => {
		let equiposTemp = [...equipos]
		for (let x = 0; x < prestamos.length; x++) {
			if (prestamos[x].entregado)
				continue;
			equiposTemp[prestamos[x].articulo] = 'No disponible';
		}
		res.render('loan.pug', {prestamos, equiposTemp, equipos, admin: req.Authenticated, user: req.AuthenticatedUser});
	})
})

router.post('/submit', (req, res) => {
	const actual = new Date().getTime();
	const specified = new Date(req.body.fecha).getTime();
	const computed = Math.floor((specified - actual) / (1000 * 60 * 60 * 24));
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
		prestamo.save();
	}
	setTimeout(res.redirect, 1000, '/');
})

router.get('/aprove/:id', async (req, res) => {
	if (req.Authenticated) {
		Prestamos.findOne({ _id: req.params.id }).then(doc => {
			doc.aprobado = !doc.aprobado;
			doc.save()
		})
	}
	setTimeout(res.redirect, 1000, '/');
})

router.get('/give/:id', async (req, res) => {
	if (req.Authenticated) {
		Prestamos.findOne({ _id: req.params.id }).then(doc => {
			doc.entregado = !doc.entregado;
			doc.save()
		})
	}
	setTimeout(res.redirect, 1000, '/');
})

module.exports = router
