'use strict';

const fs = require('fs');
// const deepClone = require('fast-deepclone');
var progressCount = 0;
var input = process.argv.slice(2)[0];
var stream = fs.createWriteStream(`${input}.txt`, {flags: 'a'});

fs.readFile('idiom_list', 'utf-8', function(err, contents) {
	contents = contents.toUpperCase();
	var wordList = contents.split('\n');

	wordList = wordList.map(function(word){
		return word.toUpperCase().trim();
	})
	if(!isNaN(parseInt(input))) {
		satorSearch(wordList, null, [], null, parseInt(input));
	} else {
		satorSearch(wordList, null, [], input);
	}
	stream.end();

})


function satorInit(wordList, word=null, wordLength=null){
	var stack = [];	
	if (word){
		wordLength = word.length;
		wordList.push(word);
		for (var i=0; i<wordLength; i+=1) {		
			var currentSolution = Array(wordLength).fill('');	
			currentSolution[i] = word;
			var validSelection = satorValidate(currentSolution, null, wordList);
			if(validSelection){
				stack.push({currentSolution, validSelection});
			}
		}
	} else {
		for (var j=0; j<wordList.length; j+=1) {
			var currentSolution = Array(wordLength).fill('');
			currentSolution[0] = wordList[j];
			var validSelection = satorValidate(currentSolution, null, wordList);
			if(validSelection){
				stack.push({currentSolution, validSelection});
			}
		}
	}
	return stack;
}

function satorSearch(wordList, stack=null, completed=[], word=null, wordLength=null){

	//pre-processing
	progressCount += 1;
	if(stack === null){
		if(word) wordLength = word.length;
		if(!word && !wordLength) throw 'Please provide a word or the width of the Sator Square';

		wordList = wordList.filter(function(word){
			return word.length === wordLength;
		});

		stack = satorInit(wordList, word, wordLength);
	} 

	//return list of results
	if(stack.length === 0) return completed;


	var contemplate = stack.pop();

	//get first undetermined 
	for(var i=0; i<contemplate.currentSolution.length; i+=1){
		if(!contemplate.currentSolution[i]) break;
	}

	//iterate through each possible next word
	for(var j=0; j<contemplate.validSelection[i].length; j+=1){

		//poor deepcopy; replace with lo-dash if used in browser && doesn't exceed stack limit
		var contemplateCopy = JSON.parse(JSON.stringify(contemplate));
		// var contemplateCopy = deepClone(contemplate);

		progressCount += 1;

		var currentSolution = contemplateCopy.currentSolution;
		currentSolution[i] = contemplateCopy.validSelection[i][j];

		var validSelection = satorValidate(currentSolution, contemplateCopy.validSelection, wordList);

		if (validSelection) {
			var progressCountDown = currentSolution.reduce(function(acc, val){
				return acc + (val === '')
			}, 0)
			if (progressCountDown === 0) {
				completed.push(currentSolution);
				stream.write(currentSolution.join('\n'));
				stream.write('\n\n');
			} else {
				stack.push({currentSolution, validSelection});
			}			
		}
	}
	return satorSearch(wordList, stack, completed);
}

function satorValidate(currentSolution, validSelection, wordList=[]){
	if(!validSelection) {
		validSelection = Array(currentSolution.length).fill(wordList);
	}

	// fill the i-th column of validSelection
	for(var i=0; i<validSelection.length; i+=1) {
		for(var j=0; j<currentSolution.length; j+=1) {
			if(!currentSolution[j]) continue;
			if(i===j) validSelection[i] = Array(currentSolution[j]);
			validSelection[i] = validSelection[i].filter(function(word){
				return word[j] === currentSolution[j][i];
			})
			// return false if a slot can't be filled
			if(validSelection[i].length === 0) return false;
		}
	}

	return validSelection;
}
