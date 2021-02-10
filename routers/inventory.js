const express = require('express');
const equipos = require('../items');
const { Articulos } = require('../functions/mongoose');
const { jsonToCsv } = require('../functions/utilities');
const path = require('path');

const router = express.Router();

// FRONTEND
router.get('/', async (req, res) => {
	Articulos.find().then((articulos) => {
		articulos.sort((a, b) => (a.id < b.id) ? -1 : (a.id == b.id ? 0 : 1))
		res.render('inventory.pug', {articulos, admin: req.Authenticated, user: req.AuthenticatedUser});
	})
})

// RAW OR PARSED DATA
router.get('/api', async (req, res) => {
	Articulos.find().then((articulos) => {
		res.json(articulos);
	})
})

router.get('/csv', async (req, res) => {
	Articulos.find().then((articulos) => {
		let curedData = new Array();
		for (let x = 0; x < articulos.length; x++) {
			curedData.push({
				Id: articulos[x].id,
				Marca: articulos[x].marca,
				Modelo: articulos[x].modelo,
				Peticiones: articulos[x].peticiones.length > 0 ? articulos[x].peticiones.map(x => `${x.nombre} - ${x.entregado ? 'Entregado' : 'No entregado'}`).join(", ") : 'Ninguna',
				Estado: articulos[x].estado,
				Disponible: articulos[x].disponible ? 'Si' : 'No',
				Tipo: articulos[x].tipo,
				Calificacion: articulos[x].calificacion
			})
		}
		curedData.sort((a, b) => (a.id < b.id) ? -1 : (a.id == b.id ? 0 : 1))
		const absPath = path.join(__dirname, '../static/temp/Inventario.xls')
		jsonToCsv(curedData, 'Inventario', true);
		res.sendFile(absPath)
	})
})

// BACKEND ACTIONS
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
