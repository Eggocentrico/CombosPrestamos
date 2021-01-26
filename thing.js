const things = require('./items');
for (let x = 0; x < things.length; x++) {
	const thing = {
		id: x+1,
		marca: things[x].split(' ')[0].replaceAll('-',' ') ,
		modelo: things[x].split(' ')[1].replaceAll('-', ' '),
		peticiones: [],
		estado: "Prestable",
		disponible: true,
		tipo: 'Portatil',
		calificacion: 11
	}
	console.log(thing)
}
