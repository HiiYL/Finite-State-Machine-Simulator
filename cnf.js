$(document).ready(function(){
	var currentReplace = 1;
	// $("#inputCFGtoCNF").val("S => ASA | aB \nA => B | S  \nB => b | e");
	$("#inputCFGtoCNF").val("S => aXbX \nX => aY | bY | e \nY => X | c");
	$("#inputCFGtoCNF").on('input',function(){
		checkInput(this.value);
		// a*(a|b*)(a|b|c|b|d)*
	})

	S => aXbX
	X => aY | bY | e
	Y => X | c
	function checkInput(inputStr) {
		currentReplace = 1;
		var cfg = CFGParse(inputStr);
		// console.log(getKeysByValue(cfg, 'S'));

		if(cfg !== undefined) {
			// console.log(cfg);
			if(getKeysByValue(cfg, 'S').length > 0) {
			  cfg = insertStartSymbol(cfg);
			}

			i = 0
			// while(getKeysByValue(cfg, 'e').length > 0) {
			//   if(i > 20) {
			//   	break
			//   }
		    removeEpsilons(cfg);

		    console.log(cfg);

		    removeEpsilons(cfg);

		    console.log(cfg);

			//   i++;
			// }

			// removeUnitRules(cfg);
			// console.log(cfg);

			// insertNewSymbols(cfg);
			// console.log(cfg);

			$("#outputCNF").html(display(cfg));
		}

	}
	function removeUnitRules(cfg) {
		for(var key in cfg) {
			newCFGValues = cfg[key]
			for(var i = 0 ; i < cfg[key].length; i++) {
				value = cfg[key][i];
				if(value.length == 1 && (value == value.toUpperCase())) {
					// console.log(newCFGValues);
					removeFromArrayAndReplace(newCFGValues, value, cfg[value]);
					newCFGValues = [].concat.apply([], newCFGValues); //flatten array
				}
			}
			cfg[key] = newCFGValues
		}
	}

	function insertNewSymbols(cfg) {
		auxDict = {}
		for(var key in cfg) {
			for(var i = 0 ; i < cfg[key].length; i++) {
				value = cfg[key][i];
				if(value.length > 2) {
					currKey = getKeysByValue(auxDict, value.slice(-2));
					if(currKey.length == 0 ) {
						newSymbol = getUnusedKey(cfg, auxDict);
						auxDict[newSymbol] = [value.slice(-2)];
						currKey = newSymbol;
					}
					value = value.replace(value.slice(-2), currKey)
					cfg[key][i] = value
				}else if(value.length == 2) {
					if (isUpperCase(value[0]) && isUpperCase(value[1])) {
						continue;
					}else if(!isUpperCase(value[0]) && isUpperCase(value[1])) {
						currKey = getKeysByValue(auxDict, value[0]);
						if(currKey.length == 0 ) {
							newSymbol = getUnusedKey(cfg, auxDict);
							auxDict[newSymbol] = [ value[0] ];
							currKey = newSymbol;
						}
						value = value.replace(value[0], currKey)
						cfg[key][i] = value
					}
				}
			}
		}
		for (var attrname in auxDict) { cfg[attrname] = auxDict[attrname]; }
	}
	function isUpperCase(char) {
		return (char == char.toUpperCase())
	}

	function getUnusedKey(cfg, auxDict = {}) {
		for (i = 65; i <= 90; i++) {
			currAlphabet = String.fromCharCode(i).toUpperCase();
			if (!(currAlphabet in cfg ) && !(currAlphabet in auxDict)) {
				return currAlphabet; 
			}
		}
		console.log("NO ALPHABETS LEFT!!!!");
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
						var right = split[1].split("|").map(function(obj) { return obj.trim(); }).filter(Boolean);
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
		cfg['S0'] = ['S']
		return cfg
	};

	String.prototype.count=function(s1) { 
	    return (this.length - this.replace(new RegExp(s1,"g"), '').length) / s1.length;
	}

	function locations(substring,string){
	  var a=[],i=-1;
	  while((i=string.indexOf(substring,i+1)) >= 0) a.push(i);
	  return a;
	}
	function spliceSlice(str, index, count) {
	  // We cannot pass negative indexes dirrectly to the 2nd slicing operation.
	  if (index < 0) {
	    index = str.length + index;
	    if (index < 0) {
	      index = 0;
	    }
	  }

	  return str.slice(0, index) + str.slice(index + count);
	}

	function removeEpsilons(cfg) {
		//console.log(cfg);
		var key = getKeysByValue(cfg, "e")[0];
		// console.log(key);
		removeFromArray(cfg[key], "e");

		tempToAdd = {}

		for(var currKey in cfg ) {
			if(currKey == key) 
				continue
			console.log(cfg[currKey]);
			for(var i = 0; i < cfg[currKey].length; i++) {
				value = cfg[currKey][i];
				console.log(value);
				keyLocations = locations(key, value);
				console.log(keyLocations);
				if(keyLocations.length > 0) {
					if(value.length > 1) {
						console.log("TEST " + value);
						locationsToIgnore = combine(keyLocations,1);
						for(var i = 0 ; i < locationsToIgnore.length ; i++) {
							temp = value;
							for(var j = 0 ; j < locationsToIgnore[i].length ; j++) {
								temp = spliceSlice(temp,locationsToIgnore[i][j] - j, 1,0);
							}
							if(tempToAdd[currKey])
								tempToAdd[currKey].push(temp);
							else
								tempToAdd[currKey] = [temp];
						}
					}
					else {
						if(tempToAdd[currKey])
							tempToAdd[currKey].push("e")
						else
							tempToAdd[currKey] = ["e"]
					}
				}
			}
		}
		for (var attrname in tempToAdd) { cfg[attrname] = cfg[attrname].concat(tempToAdd[attrname]); }

	}

	var combine = function(a, min) {
	    var fn = function(n, src, got, all) {
	        if (n == 0) {
	            if (got.length > 0) {
	                all[all.length] = got;
	            }
	            return;
	        }
	        for (var j = 0; j < src.length; j++) {
	            fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
	        }
	        return;
	    }
	    var all = [];
	    for (var i = min; i < a.length; i++) {
	        fn(i, a, [], all);
	    }
	    all.push(a);
	    return all;
	}

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

	function removeFromArrayAndReplace(object, value, array ) {
		return object.splice(object.indexOf(value), 1,array);
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