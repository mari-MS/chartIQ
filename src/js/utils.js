class Utils {	

	constructor(){
		
		this.rangeClicked = this.rangeClicked.bind(this);
	}

	rangeClicked(span) {
		console.log('selectedspan',span);
		let showRange = document.querySelector("cq-show-range").children;
		console.log("showRange", showRange)
		for(let i = 0; i < showRange.length; i++){
			showRange[i].classList.remove('selected-range')
		};
		if (typeof(Storage) !== "undefined") {
		  // Store
		  localStorage.setItem("lastSelectedRange", span );
		} else {
		  document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
		}
		if( showRange.length ){
			document.getElementById(span+"_range").classList.add('selected-range');	
		}
	    
	}

}

export default Utils;