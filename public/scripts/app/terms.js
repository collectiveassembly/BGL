/*
JS ARRAY OF JSON Formatted Data of the terms
*/

var BGLTerms = [
{
	term : "term0"
},
{
	term : "term1"
},
{
	term : "term2"
}
]

//the node.js part
if (typeof module !== "undefined"){
	module.exports.terms = BGLTerms;
}