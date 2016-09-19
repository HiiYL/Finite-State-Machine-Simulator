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
	console.log(example);
	$("#dfaInputJSON").val(JSON.stringify(example, null, 2));

	$("#dfaInputJSON").on('input', function() {
		checkInputDFAJSON();
	});

	$("#txtInputStr").on('input',function(){
		checkInputString();
	});

	Array.prototype.contains = function(element){
	    return this.indexOf(element) > -1;
	};

	function checkInputDFAJSON() {
		try{
			var inputJSON = JSON.parse($("#dfaInputJSON").val());
			graph.clear();
			// paper.remove();
			displayJSON(inputJSON);
		}catch(e) {
			return false;
		}
		return true;
	}

	function checkInputString() {
		var inputJSON = JSON.parse($("#dfaInputJSON").val());
    	var inputString = $("#txtInputStr").val();


    	

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

	function displayJSON(inputJSON) {
		// var code  = state(180, 390, 'code');
		// var slash = state(340, 220, 'slash');
		// var star  = state(600, 400, 'star');
		// var line  = state(190, 100, 'line');
		// var block = state(560, 140, 'block');

		var stateArray = {}

		for(var i = 0 ; i < inputJSON.states.length ; i++) {
			currentState = inputJSON.states[i];
			stateArray[currentState] = state(180 + (i * 150), 220, currentState);
		}

		console.log(stateArray["1"]);

		var start = new joint.shapes.fsa.StartState({ position: { x: 0, y: 530 } });
		link(start, stateArray[inputJSON.start]);
		// graph.addCell(start);

		for(var i = 0 ; i < inputJSON.transitions.length ; i++) {
			transition = inputJSON.transitions[i];
			from = stateArray[transition.source];
			to = stateArray[transition.target];
			console.log(to.attributes.position);
			link(from,to,transition.symbol);
		}
		joint.layout.DirectedGraph.layout(graph, { setLinkVertices: false });
	}

	var graph = new joint.dia.Graph();

	var paper = new joint.dia.Paper({
	    el: $('#myholder'),
	    width: 800,
	    height: 600,
	    gridSize: 1,
	    model: graph
	});

	function state(x, y, label) {
	    
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

	function link(source, target, label, vertices) {
	    
	    var cell = new joint.shapes.fsa.Arrow({
	        source: { id: source.id },
	        target: { id: target.id },
	        labels: [{ position: 0.5, attrs: { text: { text: label || '', 'font-weight': 'bold' } } }],
	        vertices: vertices || []
	    });
	    graph.addCell(cell);
	    return cell;
	}





});