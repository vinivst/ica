var MersenneTwister = require('mersenne-twister');
var generator = new MersenneTwister();
const fs = require('fs');

const obj = {
	arrays: []
};
let number = 0;

for (var j = 0; j < 10; j++) {
	let array2 = [];
	for (var i = 0; i < (Math.floor(generator.random()*1000000) + 190); i++) {
		number = Math.floor(generator.random()*4000000000);
		array2.push(number);
	}
	obj.arrays.push(array2);
}

//console.log(obj);

var json = JSON.stringify(obj);

fs.writeFile('arrays.json', json, (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});