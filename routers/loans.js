const express = require('express');
const fs = require('fs');
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

router.get('/api', async (req, res) => {
	Prestamos.find().then((prestamos) => {
		res.json(prestamos)
	})
})


const jsonToCsv = (JSONData, ReportTitle, ShowLabel) => {
	var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
	var CSV = 'sep=,' + '\r\n\n';
	if (ShowLabel) {
		var row = "";
	for (var index in arrData[0]) {
		row += index + ',';
	}
	row = row.slice(0, -1);
	CSV += row + '\r\n';
	}
	for (var i = 0; i < arrData.length; i++) {
		var row = "";
		for (var index in arrData[i]) {
			row += '"' + arrData[i][index] + '",';
		}
		row.slice(0, row.length - 1);
		CSV += row + '\r\n';
	}
	var fileName = "MyReport_";
	fileName += ReportTitle.replace(/ /g,"_");   
	
	fs.writeFile('./static/temp/' + fileName, CSV, function (err) {
	  if (err) return console.log(err);
	  console.log('saved!');
	});
}

router.get('/csv', async (req, res) => {
	Prestamos.find().then((prestamos) => {
		let curedData = new Array();
		for (let x = 0; x < prestamos.length; x++) {
			curedData.push({
				nombre: prestamos[x].nombre,
				correo: prestamos[x].correo,
				fechain: prestamos[x].fechain,
				fecha: prestamos[x].fecha,
				articulo: prestamos[x].articulo,
				aprobado: prestamos[x].aprobado,
				entregado: prestamos[x].entregado
			})
		}
		console.log(curedData);
		const data = jsonToCsv(curedData, 'Registro_de_prestamos', true);
		res.send(data).end();
	})
})

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
			aprobado: false,
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
