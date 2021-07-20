export function	rangeClicked(id) {
	console.log('selectedspan',id);
	// let showRange = document.querySelector("cq-show-range").children;
	// for(let i = 0; i < showRange.length; i++){
	// 	showRange[i].classList.remove('selected-range')
	// };
	// if (typeof(Storage) !== "undefined") {
	// 	// Store
	// 	localStorage.setItem("lastSelectedRange", id );
	// } else {
	// 	document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
	// }
	// if( showRange.length ){
	// 	showRange.namedItem(id).classList.add('selected-range');	
	// }	
}

export function setBackground(value){
	if(document.getElementsByClassName("selected-range").length){
		document.getElementsByClassName("selected-range")[0].classList.remove('selected-range');	
	}
	

	let id = "";

	switch(value) {
		case "1today":
			id = "1D";
			break;
		case "5day":
			id = "5D";
			break;
		case "1month":
			id = "1M";
			break;
		case "3month":
			id = "3M";
			break;
		case "6month":
			id = "6M";
			break;
		case "1YTD":
			id = "YTD";
			break;
		case "1year":
			id = "1Y";
			break;
		case "5year":
			id = "5Y";
			break;
		case "1all":
			id = "All";
			break;
	}
	// console.log("idddd", document.getElementById(id));
	document.getElementById(id).classList.add('selected-range');
}

function checkLocalStorage(){
	if (typeof(Storage) !== "undefined") {
		return true;
	} else {
		document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
		return false;
	}
}

export function setInLocalStorage(value) {
	if(checkLocalStorage()) {
		localStorage.setItem("lastSpanRange", JSON.stringify(value));
	}
}

export function getFromLocalStorage(key) {
	if(checkLocalStorage()) {
		return JSON.parse(localStorage.getItem(key));
	}
}