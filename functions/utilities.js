const fs = require('fs');

const jsonToCsv = (JSONData, ReportTitle, ShowLabel) => {
	var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
	var CSV = '';
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
	const fileName = ReportTitle.replace(/ /g,"_");   
	
	fs.writeFileSync('./static/temp/' + fileName + '.xls', CSV, { mode: 0o755 });
}

module.exports = {
	jsonToCsv
}
