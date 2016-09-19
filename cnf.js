$(document).ready(function(){
	// $("#inputCFGtoCNF").val("S => ASA | aB \nA => B | S  \nB => b | e");
	$("#inputCFGtoCNF").val("S => aXbX \nX => aY | bY | e \nY => X | c");
	$("#inputCFGtoCNF").on('input',function(){
		checkInput(this.value);
	})

	S => aXbX
	X => aY | bY | e
	Y => X | c

	var removedKeys = []
	function checkInput(inputStr) {
		var cfg = CFGParse(inputStr);

		//Keeps track of symbols which have had epsilon removed
		removedKeys = []
		if(cfg !== undefined) {
			// console.log(cfg);
			if(getKeysByValue(cfg, 'S').length > 0) {
			  cfg = insertStartSymbol(cfg);
			}

			i = 0
			while(getKeysByValue(cfg, 'e').length > 0) {
			  if(i > 20) {
			  	break
			  }
		      removeEpsilons(cfg);
			  i++;
			}
			// console.log(cfg);
			$("#outputCNFStep1").html(display(cfg));

			removeUnitRules(cfg);
			console.log(cfg);

			insertNewSymbols(cfg);
			$("#outputCNFStep2").html(display(cfg));

			$("#outputCNF").html(display(cfg));
		}

	}
	function insertStartSymbol(cfg) {
		cfg['S0'] = ['S']
		return cfg
	};
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

	function removeEpsilons(cfg) {
		//console.log(cfg);
		var key = getKeysByValue(cfg, "e")[0];
		// console.log(key);
		removeFromArray(cfg[key], "e");

		removedKeys.push(key);

		tempToAdd = {}

		for(var currKey in cfg ) {
			if(currKey == key) 
				continue
			// console.log(cfg[currKey]);
			for(var i = 0; i < cfg[currKey].length; i++) {
				value = cfg[currKey][i];
				// console.log(value);
				keyLocations = locations(key, value);
				// console.log(keyLocations);
				if(keyLocations.length > 0) {
					if(value.length > 1) {
						// console.log("TEST " + value);
						locationsToIgnore = combine(keyLocations,1);
						for(var j = 0 ; j < locationsToIgnore.length ; j++) {
							temp = value;
							for(var k = 0 ; k < locationsToIgnore[j].length ; k++) {
								temp = spliceSlice(temp,locationsToIgnore[j][k] - k, 1,0);
							}
							if(tempToAdd[currKey])
								tempToAdd[currKey].push(temp);
							else
								tempToAdd[currKey] = [temp];
						}
					}
					else {
						if(!(currKey in removedKeys)) {
							if(tempToAdd[currKey])
								tempToAdd[currKey].push("e")
							else
								tempToAdd[currKey] = ["e"]
						}
					}
				}
			}
		}
		for (var attrname in tempToAdd) { cfg[attrname] = cfg[attrname].concat(tempToAdd[attrname]); }
	}
	function removeUnitRules(cfg) {
		for(var key in cfg) {
			newCFGValues = cfg[key]
			for(var i = 0 ; i < cfg[key].length; i++) {
				value = cfg[key][i];
				if(value == key) {
					removeFromArray(newCFGValues, value);
				}else
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
				if(value.length > 1) 
				{
					value = value.split("");
					for(var j = 0 ; j < value.length; j++) 
					{
						if(value[j] == value[j].toLowerCase()) 
						{
							// console.log("lower case!");
							upperCaseRepresentation = value[j].toUpperCase()
							if(cfg[upperCaseRepresentation]) 
							{
								// console.log("Has CFG representation!");

								if(cfg[upperCaseRepresentation].length == 1 && cfg[upperCaseRepresentation][0] == value[j] ) 
								{
									// console.log("Correct CFG value");
									value[j] = value[j].toUpperCase()
								}
								else
								{
									currKey = getKeysByValue(auxDict, value[j], exact=true);
									if(currKey.length == 0 ) {
										newSymbol = getUnusedKey(cfg, auxDict);
										auxDict[newSymbol] = [ value[j] ];
										currKey = newSymbol;
									}
									value[j] = currKey;
								}
							}
							else 
							{
								cfg[upperCaseRepresentation] = [ value[j] ]
								value[j] = value[j].toUpperCase()
								console.log(value)
							}
						}
					}
					value = value.join("");
					cfg[key][i] = value;
				}
			}
		}
		for (var attrname in auxDict) { cfg[attrname] = auxDict[attrname]; }

		var done = false;
		while(!done) {
			done = true
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
						done = false
					}
				}
			}

			for (var attrname in auxDict) { cfg[attrname] = auxDict[attrname]; }
		}
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
	}
	function removeFromArray(object, value ) {
		return object.splice(object.indexOf(value), 1);
	}

	function removeFromArrayAndReplace(object, value, array ) {
		return object.splice(object.indexOf(value), 1,array);
	}

});