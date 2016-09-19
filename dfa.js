$(document).ready(function(){
	var example = {
	  "states": [
	    "1",
	    "2",
	    "3"
	  ],
	  "transitions": [
	    {
	      "symbol": ["a","b"],
	      "source": "1",
	      "target": "2"
	    },
	    {
	      "symbol": ["a","b"],
	      "source": "2",
	      "target": "3"
	    },
	   	{
	      "symbol": ["a","b"],
	      "source": "3",
	      "target": "1"
	    }
	  ],
	  "start": "1",
	  "accept": [
	    "1"
	  ]
	};

	var exampleMinimize = {
	  "states": [
	    "a",
	    "b",
	    "c",
	    "d",
	    "e",
	    "f"
	  ],
	  "transitions": [
	    {
	      "symbol": ["0"],
	      "source": "a",
	      "target": "b"
	    },
	    {
	      "symbol": ["1"],
	      "source": "a",
	      "target": "c"
	    },
	   	{
	      "symbol": ["1"],
	      "source": "b",
	      "target": "d"
	    },
	   	{
	      "symbol": ["0"],
	      "source": "b",
	      "target": "a"
	    },
	    {
	      "symbol": ["1"],
	      "source": "d",
	      "target": "f"
	    },
	    {
	      "symbol": ["0"],
	      "source": "d",
	      "target": "e"
	    },
	    {
	      "symbol": ["0","1"],
	      "source": "f",
	      "target": "f"
	    },
	    {
	      "symbol": ["0"],
	      "source": "e",
	      "target": "e"
	    },
	    {
	      "symbol": ["1"],
	      "source": "e",
	      "target": "f"
	    },
	    {
	      "symbol": ["0"],
	      "source": "c",
	      "target": "e"
	    },
	    {
	      "symbol": ["1"],
	      "source": "c",
	      "target": "f"
	    },

	  ],
	  "start": "a",
	  "accept": [
	    "c",
	    "d",
	    "e"
	  ]
	};

	var graph = new joint.dia.Graph();

	var paper = new joint.dia.Paper({
	    el: $('#myholder'),
	    width: 400,
	    height: 600,
	    gridSize: 1,
	    model: graph
	});

	var graphMinimization = new joint.dia.Graph();

	var paperMinimization = new joint.dia.Paper({
	    el: $('#dfaSimplificationHolder'),
	    width: 400,
	    height: 600,
	    gridSize: 1,
	    model: graphMinimization
	});

	var graphBeforeMinimization = new joint.dia.Graph();

	var paperBeforeMinimization = new joint.dia.Paper({
	    el: $('#dfaBeforeSimplificationHolder'),
	    width: 400,
	    height: 600,
	    gridSize: 1,
	    model: graphBeforeMinimization
	});

	
	console.log(exampleMinimize);
	$("#dfaInputJSON").val(JSON.stringify(example, null, 2));

	$("#dfaInputJSON").on('input', function() {
		checkInputDFAJSON(this.value);
	});
	$("#txtInputStr").on('input',function(){
		checkInputString(this.value);
	});
	$("#dfaSimplicationInputJSON").on('input', function() {
		// checkInputDFAJSON(this.value);
		// minimizeDFA(this.value);
		displayJSON(JSON.parse(this.value), graphBeforeMinimization);
	});
	$("#dfaMinimize").click(function() {
		minimizeDFA($("#dfaSimplicationInputJSON").val());
	});
	$("#dfaSimplicationInputJSON").val(JSON.stringify(exampleMinimize, null, 2));


	Array.prototype.contains = function(element){
	    return this.indexOf(element) > -1;
	};

	function checkInputDFAJSON(value) {
		try{
			var inputJSON = JSON.parse(value);
			// graph.clear();
			// paper.remove();
			displayJSON(inputJSON, graph);
		}catch(e) {
			return false;
		}
		return true;
	}

	function checkInputString(value) {

		var inputJSON = JSON.parse($("#dfaInputJSON").val());
    	var inputString = value;


    	

    	currentNode = inputJSON.start;

    	transitions = inputJSON.transitions

    	for(var i = 0 ; i < inputString.length; i++) {
    		currentInput = inputString[i];

    		foundTransition = false;
    		for(var j = 0 ; j < transitions.length; j++) {
    			transition = transitions[j]
    			if( transition.symbol.contains(currentInput)  && transition.source === currentNode ) {
    				currentNode = transition.target;
    				foundTransition = true;
    				break;
    			}
    		};
    		if(!foundTransition)
    			console.log("Missing Node at position " + i + " with value of " + currentNode + " !");
    	}
    	console.log(currentNode);

    	match = inputJSON.accept.contains(currentNode);
    	if(!match) {
	      $("#status-text").text("Not Match!");
	    }else{
	      $("#status-text").text("Match!");
	    }
	}

	function displayJSON(inputJSON, graph) {
		graph.clear();
		var stateArray = {}

		for(var i = 0 ; i < inputJSON.states.length ; i++) {
			currentState = inputJSON.states[i];
			stateArray[currentState] = state(180, 220, currentState,graph);
		}

		var start = new joint.shapes.fsa.StartState({ position: { x: 0, y: 530 } });
		link(start, stateArray[inputJSON.start],"start",graph);

		console.log("PLS3");

		for(var i = 0 ; i < inputJSON.transitions.length ; i++) {
			transition = inputJSON.transitions[i];
			from = stateArray[transition.source];
			to = stateArray[transition.target];
			console.log("PLS2");
			if(from !== to) {
				link(from,to,transition.symbol,graph);
			}else {
				link(from,to,transition.symbol,graph);
			}
		}
		joint.layout.DirectedGraph.layout(graph, { nodeSep: 250,rankDir: "TB",setLinkVertices: false });
	}



	function state(x, y, label, graph) {
	    
	    var cell = new joint.shapes.fsa.State({
	        position: { x: x, y: y },
	        size: { width: 60, height: 60 },
	        attrs: {
	            text : { text: label, fill: '#000000', 'font-weight': 'normal' },
	            'circle': {
	                fill: '#f6f6f6',
	                stroke: '#000000',
	                'stroke-width': 2
	            }
	        }
	    });
	    graph.addCell(cell);
	    return cell;
	}

	function link(source, target, label, graph,vertices) {
		console.log(label);
		console.log(target);
	    
	    var cell = new joint.shapes.fsa.Arrow({
	        source: { id: source.id },
	        target: { id: target.id },
	        labels: [{ position: 0.5, attrs: { text: { text: label || '', 'font-weight': 'bold' } } }],
	        vertices: vertices || []
	    });
	    graph.addCell(cell);
	    return cell;
	}
	Array.prototype.diff = function(a) {
	    return this.filter(function(i) {return a.indexOf(i) < 0;});
	};
	function minimizeDFA(value) {

		newStatesTransitionTable = {}
		var inputJSON = JSON.parse(value);

		// displayJSON(inputJSON, graph);

		

		var allStates = inputJSON.states;
		var nonfinal = inputJSON.states.diff(inputJSON.accept)
		var final = inputJSON.accept

		var tempNewGroups = [final, nonfinal]

		var newGroups = [final, nonfinal]

		var loneWolfs
		console.log("RUNNING!");

		for(var m = 0 ; m < tempNewGroups.length; m++) {
			group = tempNewGroups[m]
			loneWolfs = []
			for(var i = 0 ; i < group.length ; i++) {
				currState = group[i]
				for(var j = i; j < group.length; j++) {
					stateToCompare = group[j]
					cachedTransitions = {}
					// f - final
					// nf - non-final
					for(var k = 0; k < inputJSON.transitions.length; k++) {
						transition = inputJSON.transitions[k]
						if(transition.source === currState || transition.source === stateToCompare) {
							for(var l = 0 ; l < transition.symbol.length; l++) {
								symbol = transition.symbol[l]
								if(symbol in cachedTransitions) {
									if( (final.contains(transition.target) &&
									 cachedTransitions[symbol] === "nf") ||
										(nonfinal.contains(transition.target) && 
											cachedTransitions[symbol] === "f")) {
										if(!loneWolfs.contains(stateToCompare)) {
											loneWolfs.push(stateToCompare);
											console.log("BREAKUP IMMINNENT");
										}
									}
								}else {
									if(final.contains(transition.target))
										cachedTransitions[symbol] = "f";
									else
										cachedTransitions[symbol] = "nf";
								}
							}
						}

					}
				}
			}
			console.log(loneWolfs);
			newGroup = newGroups[m];
			for(var n = 0 ; n < loneWolfs.length; n++) {
				newGroup = removeFromArray(newGroup, loneWolfs[n]);
				newGroups.push([loneWolfs[n]]);
				if(loneWolfs[n] === inputJSON.start) {
					(newStatesTransitionTable.start || (newStatesTransitionTable.start = [])).push(loneWolfs[n]);
				}
				if(loneWolfs[n] in inputJSON.accept) {
					(newStatesTransitionTable.accept || (newStatesTransitionTable.accept = [])).push(loneWolfs[n]);
				}
			}
		}
		console.log(newGroups);



		for(var o = 0 ; o < newGroups.length; o++) {
			if("states" in newStatesTransitionTable) {
				newStatesTransitionTable.states.push(newGroups[o]);
			}else {
				newStatesTransitionTable["states"] = [newGroups[o]];
			}
		}
		console.log(newStatesTransitionTable);

		console.log(newStatesTransitionTable.states);

		for(var p = 0; p < newStatesTransitionTable.states.length; p++) {
			groupedStates = newStatesTransitionTable.states[p]
			currState = groupedStates[0]
			for(var q = 0 ; q < inputJSON.transitions.length; q++ ) {
				transition = inputJSON.transitions[q];
				for(var r = 0 ; r < newStatesTransitionTable.states.length; r++) {
					if(newStatesTransitionTable.states[r].contains(transition.target)) {
						targetGroupedStates = newStatesTransitionTable.states[r]
					}
				}
				if(transition.source === currState) {
					var newTransition = {
						symbol: transition.symbol,
						source: groupedStates.join(","),
						target: targetGroupedStates.join(",")
					}
					if("transitions" in newStatesTransitionTable) {
						newStatesTransitionTable.transitions.push(newTransition);
					}else {
						newStatesTransitionTable["transitions"] = [newTransition];
					}
				}
			}
		}
		for(var s = 0 ; s < newStatesTransitionTable.states.length; s++) {
			joinedStates = newStatesTransitionTable.states[s].join(",");
			if(final.contains(newStatesTransitionTable.states[s][0])){
				console.log(newStatesTransitionTable.states[s][0]);
				(newStatesTransitionTable.accept || (newStatesTransitionTable.accept = []))
				.push(joinedStates);
			}
			if(newStatesTransitionTable.states[s].contains(inputJSON.start)) {
				newStatesTransitionTable.start = joinedStates;
			}
			newStatesTransitionTable.states[s] = joinedStates;
		}
		console.log(newStatesTransitionTable);

		displayJSON(newStatesTransitionTable, graphMinimization);

	}

	function removeFromArray(object, value ) {
		return object.splice(object.indexOf(value), 1);
	}





});