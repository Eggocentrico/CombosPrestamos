const express = require('express');
const equipos = require('../items');
const { Prestamos } = require('../functions/mongoose');
const { jsonToCsv } = require('../functions/utilities');
const path = require('path');

const router = express.Router();

// FRONTEND
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

//RAW OR PARSED DATA
router.get('/api', async (req, res) => {
	Prestamos.find().then((prestamos) => {
		res.json(prestamos)
	})
})

router.get('/csv', async (req, res) => {
	Prestamos.find().then((prestamos) => {
		let curedData = new Array();
		for (let x = 0; x < prestamos.length; x++) {
			curedData.push({
				Nombre: prestamos[x].nombre,
				Correo: prestamos[x].correo == '' ? 'No proporcionado' : prestamos[x].correo,
				'Fecha de peticion': prestamos[x].fechain,
				'Fecha estimada de entrega': prestamos[x].fecha,
				Articulo: equipos[prestamos[x].articulo],
				Aprobado: prestamos[x].aprobado ? 'Si' : 'No',
				Entregado: prestamos[x].entregado ? 'Si' : 'No'
			})
		}
		const absPath = path.join(__dirname, '../static/temp/Registro_de_prestamos.xls')
		jsonToCsv(curedData, 'Registro_de_prestamos', true);
		res.sendFile(absPath, 'Registro de prestamos.xls');
	})
})


// BACKEND ACTIONS
router.post('/submit', (req, res) => {
	const actual = new Date().getTime();
	const specified = new Date(req.body.fecha).getTime();
	const computed = Math.ceil((specified - actual) / (1000 * 60 * 60 * 24));
	if (!(computed <= -1)) {
		const prestamo = new Prestamos({
			nombre: req.body.nombre,
			correo: req.body.correo,
			fechain: new Date().toLocaleDateString(),
			fecha: new Date(req.body.fecha).toLocaleDateString(),
			articulo: req.body.articulo,
			aprobado: true,
			entregado: false
		})
		prestamo.save();
	}
	setTimeout(() => res.redirect('/loan'), 1000)
})

router.get('/aprove/:id', async (req, res) => {
	if (req.Authenticated) {
		Prestamos.findOne({ _id: req.params.id }).then(doc => {
			doc.aprobado = !doc.aprobado;
			doc.save()
		})
	}
	setTimeout(() => res.redirect('/loan'), 1000)
})

router.get('/give/:id', async (req, res) => {
	if (req.Authenticated) {
		Prestamos.findOne({ _id: req.params.id }).then(doc => {
			doc.entregado = !doc.entregado;
			doc.save()
		})
	}
	setTimeout(() => res.redirect('/loan'), 1000)
})

module.exports = router
