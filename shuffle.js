//shuffles the terms


var fs = require('fs');
var terms = require("./public/assets/scripts/app/shuffledTerms").terms;

/*// sourced from http://snippets.dzone.com/posts/show/849
function shuffleArray(arr) {
	var o = arr.slice(0);
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

var shuffled = shuffleArray(terms);

var shuffledString = JSON.stringify(shuffled, null, 4)

fs.writeFile("./public/assets/scripts/app/shuffledTerms.js", shuffledString, function (err) {
  if (err) throw err;
  console.log('It\'s saved!');
});*/

var termNumbers = [];

function getNumbers (){
	for (var i = 0; i < terms.length; i++){
		termNumbers.push(terms[i].number);
	}
}

getNumbers();

console.log(termNumbers);