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

	$("#txtInputStr").on('input',function(){
		checkJSONInput();
	});

	Array.prototype.contains = function(element){
	    return this.indexOf(element) > -1;
	};

	function checkJSONInput() {
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



});