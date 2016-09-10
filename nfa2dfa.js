function initializeNFA(){
	var width = $('#DFA').innerWidth();
	var height = $('#DFA').innerHeight();

	DFAVisual = new ForceGraph('#DFA', width, height);
	DFAVisual.forceRenderSpeed = 100;
	DFAVisual.nodeRadius = 20;
	syncDFA();
}