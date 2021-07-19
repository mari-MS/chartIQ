export function	rangeClicked(id) {
	console.log('selectedspan',id);
	let showRange = document.querySelector("cq-show-range").children;
	for(let i = 0; i < showRange.length; i++){
		showRange[i].classList.remove('selected-range')
	};
	if (typeof(Storage) !== "undefined") {
		// Store
		localStorage.setItem("lastSelectedRange", id );
	} else {
		document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
	}
	if( showRange.length ){
		showRange.namedItem(id).classList.add('selected-range');	
	}	
}