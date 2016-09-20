$(document).ready(function(){
	$("#inputCNFToCYK").val("S => AB \nA => CD | CF \nB => c | EB \nC => a\nD => b\nE => c\nF => AD");
	$("#CNFToCYKStringToTest").val("aaabbbcc");
	$("#inputCNFToCYK").on('input',function() {
		var cfg = CFGParse(this.value);
		var stringToTest = $("#CNFToCYKStringToTest").val();

		var table = [[0]];

		for (var i = 0; i < stringToTest.length; i++) {
			table[i] = []
			for(var j = i ; j < stringToTest.length; j++) {
				table[i].push("0");
			}
		}
		
		for(var i = 0 ; i < stringToTest.length ; i++) {
			table[0][i] = getKeysByValue(cfg, stringToTest[i],true).join("")
		}

		console.log(table)
		// table[1][1] = table[0][1][0]


		//LEGEND
		//j - row
		//k - item
		//l - levels to check
		for(var j = 1; j < stringToTest.length ; j++) {
			for(var k = 0 ; k < stringToTest.length - j; k++) {
				// console.log(j)
				for (var l = 1; l <= j; l++) {
					// console.log("HELLO")
					left = table[j-l][k]
					right = table[l-1][k-l+j+1]
					if(left !== "0" && right !== "0") {
						if(left !== right) {
							stringToSearch = right.concat(left);
						}
						else{
							stringToSearch = left;
						}
						// console.log(l-1)
						// console.log(k-l+j-1)
						// console.log(left + " " + right);
						// console.log(j + " " + k + " " + l);
						foundKeys = getKeysByValue(cfg, stringToSearch, true)
						if(foundKeys.length > 0) {
							table[j][k] = foundKeys[0]
							break
						}else if(stringToSearch.length > 1) {
							possiblePermutations = permutator(stringToSearch.split(""));
							console.log(possiblePermutations.join(""));
							console.log(j + " " + k + " " + l);
							found=false
							for (var i = 0; i < possiblePermutations.length; i++) {
								foundKeys = getKeysByValue(cfg,possiblePermutations[i].join(""), true);
								if(foundKeys.length > 0) {
									table[j][k] = foundKeys[0]
									found=true;
									break;
								}
							}
							if(found)
								break;
							// console.log("REVERSING")
							// foundKeys = getKeysByValue(cfg, reverse(stringToSearch), true)
							// if(foundKeys.length > 0) {
							// 	table[j][k] = foundKeys[0]
							// 	break
							// }
						}
					}
				}
			}
		}

		console.log(table);
		console.log(cfg);
	});

	function reverse(s){
	    return s.split("").reverse().join("");
	}

	function permutator(inputArr) {
	  var results = [];

	  function permute(arr, memo) {
	    var cur, memo = memo || [];

	    for (var i = 0; i < arr.length; i++) {
	      cur = arr.splice(i, 1);
	      if (arr.length === 0) {
	        results.push(memo.concat(cur));
	      }
	      permute(arr.slice(), memo.concat(cur));
	      arr.splice(i, 0, cur[0]);
	    }

	    return results;
	  }

	  return permute(inputArr);
	}

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
});