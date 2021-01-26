const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/combos', {useNewUrlParser: true, useUnifiedTopology: true});

const Prestamos = mongoose.model('Prestamo', new mongoose.Schema({
	nombre: String,
	correo: String,
	fechain: String,
	fecha: String,
	articulo: Number,
	aprobado: Boolean,
	entregado: Boolean
}))

const Articulos = mongoose.model('Articulo', new mongoose.Schema({
	id: Number,
	marca: String,
	modelo: String,
	peticiones: Array,
	estado: String,
	disponible: Boolean,
	tipo: String,
	calificacion: Number
}))

const Users = mongoose.model('User', new mongoose.Schema({
	username: String,
	password: String,
	email: String,
	permcode: Number
}))

module.exports = {
	Prestamos,
	Articulos,
	Users
}
