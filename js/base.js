function getByID(id,id2){
	document.getElementById(id).innerHTML = id2;
}

function addByID(id,id2){
	document.getElementById(id).innerHTML += id2;
}

function insertByID(id,id2){
	document.getElementById(id).innerHTML = id2 + document.getElementById(id).innerHTML;
}

function Close(id){
	if(document.getElementById(id)!==null){
		document.getElementById(id).style.display = 'none'
	}
}

function Open(id,id2=''){
	if(document.getElementById(id)!==null){
    	document.getElementById(id).style.display = id2
	}
}

function addedCss(id,id2){
	document.getElementById(id).classList.add(id2)
}

function removeCss(id,id2){
	document.getElementById(id).classList.remove(id2)
}