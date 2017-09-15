fs = require('fs');
readline = require('readline');
var myInterface = readline.createInterface({
	input: fs.createReadStream('ulice.xml')});
myInterface.on('line', function (line) {
	var reg = /<mua:nazwaGlownaCzesc>/;
	if(reg.test(line)){
		var start = line.indexOf('>') + 1;
		var stop = line.lastIndexOf('<');
		var res = line.substring(start, stop) + "\r\n";
		console.log(res);
		fs.appendFileSync('wroclaw_streets.txt', res);
	}
});
