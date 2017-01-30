var canvas = document.getElementById("canvas"),
	ctx = canvas.getContext('2d'),
	pic = new Image(),
	s_path = "screens/",
	m_path = "maps/",
	resolutions = ["1024_768","1152_864","1280_1024","1280_600","1280_720","1280_768","1280_800","1280_960","1360_768","1366_768","1400_1050","1400_900","1600_900","1680_1050","1920_1080","640_480","800_600"],
	cur_res = prompt(resolutions.join(),"1024_768" ),
	curHeroBlock = document.getElementById("cur"),
	heroesIterator = 0,
	results = [],
	allHeroes = getAllHeroes(heroes);

if (resImgExists(cur_res)){
	loadImage(() => {
		ctx.canvas.width = pic.width;
		ctx.canvas.height = pic.height; 
		ctx.drawImage(pic, 0, 0);

		if (resMapExists(cur_res)){
			setText("Map exists");
			loadMap();
		}else{
			addDrawer();
		}
	});
}else{
	setText("No image");
}



function loadImage(func){
	pic.src    = s_path+cur_res+".png";
	pic.onload = func
}

function loadMap(){
	readTextFile(m_path+cur_res+".json", function(text){
	    var map = JSON.parse(text);
	    map.forEach(function(item, i, arr) {
	    	drawHero(item.x,item.y)
		});
	});
}


function getAllHeroes(heroesByStat){
	var {str,agi,int,etc} = heroesByStat;
	return str.concat(agi,int,etc);
}

function addDrawer(){
	setText(allHeroes[heroesIterator])
	canvas.onclick = function(e){
		//теперь нам достаточно щелкать в левый верхний угол каждого героя
		selectHero(e.offsetX,e.offsetY);
		if (heroesIterator < allHeroes.length){
			nextPick();			
		}
		if (heroesIterator == allHeroes.length){
			download();
			setText("Done");
		}
	}
}


function selectHero(x,y){
	drawHero(x,y);
	results[heroesIterator] = {hero: allHeroes[heroesIterator],x: x, y: y}
}

function drawHero(x,y){
	ctx.beginPath();
	ctx.strokeStyle = '#ffffff';
	ctx.lineWidth = 2;
	ctx.arc(x, y, 5, 0, 2 * Math.PI, false);
	ctx.stroke();
	return 1;
}


function setText(text){
	curHeroBlock.innerText = text;
}

function nextPick(){
	heroesIterator++;
	setText(allHeroes[heroesIterator])
}

function download() {
    var data = results;
	var json = JSON.stringify(data);
	var blob = new Blob([json], {type: "application/json"});
	var url  = URL.createObjectURL(blob);
	var a = document.createElement('a');
	a.download    = cur_res+".json";
	a.href        = url;
	a.textContent = "Download backup.json";
	a.click();
}

function resMapExists(res){
    var http = new XMLHttpRequest();
    http.open('HEAD', m_path+res+".json", false);
    http.send();
    return http.status!=404;
}

function resImgExists(res){
	var http = new XMLHttpRequest();
    http.open('HEAD', s_path+res+".png", false);
    http.send();
    return http.status!=404;
}

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

