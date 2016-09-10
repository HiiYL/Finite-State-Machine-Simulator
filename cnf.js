$(document).ready(function(){
	var currentReplace = 1;
	$("#inputCFGtoCNF").val("S => ASA | aB \nA => B | S  \nB => b | e");
	$("#inputCFGtoCNF").on('input',function(){
		checkInput(this.value);
		// a*(a|b*)(a|b|c|b|d)*
	})
	function checkInput(inputStr) {
		var cfg = CFGParse(inputStr);
		cfg = insertStartSymbol(cfg);
		removeEpsilons(cfg);
		removeEpsilons(cfg);
		// removeFromArray(cfg['S'], 'S');
		cfg['S0'] = cfg['S']
		// console.log(cfg);
		replaceSymbol(cfg);
		// console.log(cfg);
		insertNewSymbols(cfg);
		console.log(cfg);
		replaceSymbolNewOnly(cfg);
		console.log(cfg);
		$("#outputCNF").html(display(cfg));

	}
	function display(cfg) {
		outputString = ""
		for(var key in cfg) {
			outputString += ( key + " => "  )
			for(var i = 0 ; i < cfg[key].length; i++) {
				outputString += ( cfg[key][i] + ((i != cfg[key].length - 1) ? " | " : "") )
			}
			outputString += "<br>"
		}
		return outputString
	}
	S => ASA | aB
	A => B | S 
	B => b | e
	function CFGParse(CFG) {
		var lines = CFG.split('\n');

		if(lines.length > 1) {
			var cfg = {}
			try{
				for(var i = 0;i < lines.length;i++){
					var split = lines[i].split("=>");
						var left = split[0].trim();
						var right = split[1].split("|").map(function(obj) { return obj.trim(); });
						//console.log(left + " " + right);
						cfg[left] = right;
				}
				//console.log(cfg);
				//console.log("-----------------");
				return cfg;
			}catch(err) {
				console.log("Invalid CFG")
			}
		}
	}
	function insertStartSymbol(cfg) {
		cfg['S0'] = 'S'
		return cfg
	};

	function replaceSymbolNewOnly(cfg) {
		var newKeys = filtered_keys(cfg, /A[0-9]/);
			// var keysContainingSymbol = getKeysByValue(cfg, key, exact=false);
		for(var i = 0 ; i < newKeys.length ; i ++) {
			var toMatch = cfg[newKeys[i]]
			for(var key in cfg) {
				for(var j = 0 ; j < cfg[key].length; j++) {
					if(cfg[key][j].length > 2) {
						console.log(cfg[key][j] + " " + toMatch + " " + newKeys[i]);
						cfg[key][j] = cfg[key][j].replace(toMatch,newKeys[i])
					}
				}
			}
		}
	}

	function replaceSymbol(cfg) {
		for(key in cfg) {
			// console.log(key);
			var keysContainingSymbol = getKeysByValue(cfg, key, exact=true);
			if(keysContainingSymbol.length > 0) {
				// console.log("Keys Containing Symbol: " + keysContainingSymbol);
				for(var i = 0 ; i < keysContainingSymbol.length; i++) {
					var foundKey = keysContainingSymbol[i];
					// console.log(foundKey);
					removeFromArray(cfg[foundKey], key);
					cfg[foundKey] = cfg[foundKey].concat(cfg[key]);
				}

			}else {
				// console.log("EMPTY!");
			}
		}
	}
			// 	for(var i = 0 ; i < listOfValues.length; i++) {
			// 	if(listOfValues[i].length > 2) {
			// 		newValue = [listOfValues[i].slice(-2)][0]
			// 		console.log(typeof(newValue))
			// 		if(searchStringInArray(newValue, addedSymbolsList, true) !== -5) {
			// 			cfg[ "A" + currentReplace ] = newValue
			// 			addedSymbolsList = addedSymbolsList.concat(newValue)
			// 			currentReplace = currentReplace + 1
			// 		}
			// 	}
			// }
	function insertNewSymbols(cfg) {
		addedSymbolsList = []
		for(var key in cfg) {
			console.log(cfg[key])
			listOfValues = cfg[key]
			for(var i = 0 ; i < listOfValues.length; i++) {
				if(listOfValues[i].length > 2) {
					newValue = [listOfValues[i].slice(-2)][0]
					if(searchStringInArray(newValue,addedSymbolsList, true) === -1) {
						// console.log("LENGTH GREATER THAN 2")
						cfg[ "A" + currentReplace ] = [ newValue ]
						addedSymbolsList.push(newValue)
						currentReplace = currentReplace + 1
					}
				}
			}
		}
	}

	function removeEpsilons(cfg) {
		//console.log(cfg);
		var key = getKeysByValue(cfg, "e")[0];
		// console.log(key);
		removeFromArray(cfg[key], "e");
		var toAdd = getKeysByValue(cfg, key);

		

		for(var i = 0 ; i < toAdd.length; i++) {
			cfg[toAdd[i]] = searchAllStringAndReplace(key,cfg[toAdd[i]], toAdd[i]);
		}
		// console.log(cfg);
		//var test = cfg.getKeyByValue("e");
	}
	// function searchAndReplace(str, strArray,cfg) {
	// 	for (var i=0; i<strArray.length; i++) {
	// 		if(strArray[i] == str) {
	// 			removeFromArray(strArray[i],str);
	// 			strArray[i].push(cfg[str]);
	// 		}
	// 	}
	// 	return strArray;
	// }

	//string permutation

	//====================================================
	function getPermutations(str){
	    //Enclosed data to be used by the internal recursive function permutate():
	    var permutations = [],  //generated permutations stored here
	        nextWord = [],      //next word builds up in here     
	        chars = []          //collection for each recursion level
	    ;
	    //---------------------
	    //split words or numbers into an array of characters
	    if (typeof str === 'string') chars = str.split(''); 
	    else if (typeof str === 'number') {
	      str = str + ""; //convert number to string
	      chars = str.split('');//convert string into char array
	    }
	    //============TWO Declaratives========
	    permutate(chars);
	    return permutations;
	    //===========UNDER THE HOOD===========
	    function permutate(chars){ //recursive: generates the permutations
	        if(chars.length === 0)permutations.push(nextWord.join(''));            
	        for (var i=0; i < chars.length; i++){
	            chars.push(chars.shift());  //rotate the characters
	            nextWord.push(chars[0]);    //use the first char in the array            
	            permutate(chars.slice(1));  //Recurse: array-less-one-char
	            nextWord.pop();             //clear for nextWord (multiple pops)
	        }
	    }
	    //--------------------------------
	}//==============END of getPermutations(str)=============

	function searchAllStringAndReplace(str, strArray, selfKey) {
		for (var i=0; i<strArray.length; i++) {
	        if (strArray[i].match(str)) {
	        	if(strArray[i] == str) {
	        		strArray.push("e");
	        	}else {
	        		// console.log(strArray[i]);
	        		filteredSymbol = strArray[i].replace(str,'');
	        		if(filteredSymbol.length > 1) {
	        			permutedSymbols = getPermutations(filteredSymbol);
	        			// console.log('----------------------');
	        			// console.log(strArray);
	        			// console.log(permutedSymbols);
	        			strArray = strArray.concat(permutedSymbols);
	        			// console.log(strArray);
	        			// console.log('----------------------');
	        		}else {
	        			if(filteredSymbol != selfKey)
	        				strArray.push(filteredSymbol);
	        		}
					
	        	}
	        }
	    }
	    return strArray;

	}
	function searchStringInArray (str, strArray,exact) {
		// console.log(exact);
	    for (var j=0; j<strArray.length; j++) {
	    	// console.log(strArray[j] + " " + str);
	        if (exact ? (strArray[j] === str ) : strArray[j].match(str)) return j;
	    }
	    return -1;
	}
	//object[key].indexOf(value) !== -1
	function getKeysByValue(object, value, exact=false){
		keys = []
		for (var key in object) {
			if(searchStringInArray(value, object[key],exact) !== -1) {
				keys.push(key);
			}
		}
		return keys;
		// return Object.keys(object).filter(function(key) { return (searchStringInArray(value, object[key]) !== -1); });
	}
	function removeFromArray(object, value ) {
		return object.splice(object.indexOf(value), 1);
	}

	var filtered_keys = function(obj, filter) {
	  var key, keys = [];
	  for (key in obj) {
	    if (obj.hasOwnProperty(key) && filter.test(key)) {
	      keys.push(key);
	    }
	  }
	  return keys;
	}

});