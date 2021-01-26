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

module.exports = {
	Prestamos,
	Users
}
