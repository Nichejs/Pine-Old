/**
 * Drawing the Map
 * 
 * https://github.com/Open-RPG/open-rpg
 * 
 * License: GNU GENERAL PUBLIC LICENSE
 */

define(["main", "sheetengine"],function(Main, sheetengine){

	var Map = {
		// Config options
		densityMap : new sheetengine.DensityMap(5),
		drawFlag : true,
		redrawFlag : false,
		redrawInterval : null,
		zoomLevel : 1,
		staticQueue : []
	};
	
	/**
	 * Set up the map and main character 
	 */
	Map.init = function(){
		Map.setTime(12);
		
		Map.drawBaseSheet(Main.canvas.canvasElement, Main.canvas.size);
		
		// Now we set up the interval for the redraw method
		// Read the description of the redraw method for more info
		Map.redrawInterval = setInterval(function(){
			if(!Map.redrawFlag) return;
			// Flag was set to true, redraw and reset flag
			Map.redrawFlag = false;
			
			Map.drawChanges();
		}, 30);
		
		
	};

	/**
	 * Draw a simply BaseSheet into the canvas area 
	 * given by parameter
 	 * @param {Object} Reference to the canvas element
	 * @param {Object} Domensions of the canvas element {w,h}
	 */
	Map.drawBaseSheet = function(canvasElement, size){
		sheetengine.scene.init(canvasElement, size);
		var num = 3;
		// Define some basesheets
		for (var x=-3; x<=3; x++) {
			for (var y=-3; y<=3; y++) {
				var basesheet = new sheetengine.BaseSheet({x:x*200,y:y*200,z:0}, {alphaD:90,betaD:0,gammaD:0}, {w:200,h:200});
				// Generate random shades of green
				// Temporary fix just to make it look a little better
				var color = 'rgba('+Math.ceil(70+Math.random()*20)+',120,'+Math.ceil(30+Math.random()*25)+',1)';
				basesheet.color = color;
			}
		}
		
		Map.draw();
	};
	
	/**
	 * Transform a pair of real coordinates (i.e. mouse coordinates)
	 * into the game system coordinates (relative to the map center)
	 * @param {Object} Real life coordinates {x:_,y:_}
	 * @returns {Object} An object with the coordinates {x:_,y:_}
	 */
	Map.coordsRealToGame = function(coords){
		var pxy = sheetengine.transforms.inverseTransformPoint({u:coords.y+sheetengine.scene.center.u, v:coords.x+sheetengine.scene.center.v});
		pxy.x = (pxy.x - sheetengine.scene.center.x) / Map.zoomLevel + sheetengine.scene.center.x;
		pxy.y = (pxy.y - sheetengine.scene.center.y) / Map.zoomLevel + sheetengine.scene.center.y;
		return pxy;
	};
	
	/**
	 * Transform a point in the game to a canvas point. 
	 * @param {Object} A point in the game {x,y,z}
	 * @return {Object} A canvas coordinate object {u,v}
	 */
	Map.coordsGameToCanvas = function(point){
		return sheetengine.drawing.getPointuv(point);
	};
	
	/**
	 * sheetengine allows to draw directly on the canvas,
	 * but we have to redraw everything everytime sheetengine redraws.
	 * So to make it easier we use the staticQueue. It will be a list of functions
	 * that are executed everytime the canvas is redrawn.
	 * Each of those functions should draw something on the canvas.
	 * @param {Object} Array key, username for example
	 * @param {function} A function to be executed
	 */
	Map.addToStaticQueue = function(id, fn){
		Map.staticQueue[id] = fn;
	};
	
	/**
	 * Removes an element from the static queue
	 * @param {Object} Array key, username for example
	 */
	Map.removeFromStaticQueue = function(id){
		delete Map.staticQueue[id];
	};
	
	/**
	 * This executes the functions stored in the queue (if any)
	 * Should only be called from the draw functions. 
	 */
	Map.executeStaticQueue = function(){
		// Using for..in because indixes might not be numbers
		for(var index in Map.staticQueue) {
			Map.staticQueue[index]();
		}
	};
	
	/**
	 * Redraw changed sheets
	 * Redrawing is a very expensive operation, so it will be done on a fixed time.
	 * If the redraw function is called, it will set the redraw flag to true.
	 * An interval will check for the flag every fixed time and redraw if necessary,
	 * this way when many people move it will only draw every fixed time, improving 
	 * performance.
	 */
	Map.redraw = function(){
		Map.redrawFlag = true;
	};
	
	/**
	 * Only call after adding static stuff!
	 * This will redraw all the changed sheets again. 
	 */
	Map.drawChanges = function(){
		sheetengine.calc.calculateChangedSheets();
		sheetengine.drawing.drawScene(true);
		
		// Execute the static queue
		Map.executeStaticQueue();
	};
	
	/**
	 * Draw scene from scratch
	 */
	Map.draw = function(){
		// Check flag, this way we ensure it is only drawn once.
		if(!Map.drawFlag) return false;
		Map.drawFlag = false;
		sheetengine.calc.calculateAllSheets();
		sheetengine.drawing.drawScene(true);
	};
	
	/**
	 * Add sheets to the density map for collision detection 
	 * @param {Object} Sheets to be added
	 */
	Map.addToDensityMap = function(sheets){
		Map.densityMap.addSheets(sheets);
	};
	
	/**
	 * This will be kind of difficult to implement, it should define
	 * the direction of the light for each time of day and year.
	 * It has to define 3 vectors, one will be the direction of light, and then 2 perpendicular vectors.
	 * This will suppose that at 0h the sun is horizontal. And at 12h it is perpendicular to the ground.
	 * 
	 * It will also mange the night overlay, and it's opacity so it's realistic.
	 * At some point it would be amazing to be able to have lights... I think we could mimic lights
	 * using something like -webkit-mask-image
	 * 
	 * @param {ing} Hour of the day in 24h format, no minutes.
	 */
	Map.setTime = function(time){
		
		// During the night shadows are gone, and we overlay a div
		// to simulate the different lighting.
		if(time > 20 || time < 8){
			sheetengine.shadows.lightSource = { x: -1, y: 0, z: -1 };
		    sheetengine.shadows.lightSourcep1 = { x: 0, y: 1, z: 0 };
		    sheetengine.shadows.lightSourcep2 = { x: 1, y: 0, z: 0 };
			$('#overlay').css({'backgroundColor' : 'rgba(0,0,0,0.3)'}).show();
			sheetengine.shadows.shadowAlpha = 0.1;
			sheetengine.shadows.shadeAlpha = 0.7;
			return;
		}else if(time < 10 || time > 18){
			// Twilight
			$('#overlay').css({'backgroundColor' : 'rgba(255,219,77,0.06)'}).show();
		}
		
		var y = (time - 12)/5;
		
		if(y < -2) y = -2;
		if(y > 2) y = 2;
		
		var p = { x: -0.5, y: y, z: -0.5 };
		
 		if(Math.abs(p.y) > 0){
 			var p1 = {x: -0.5, y: (-0.5*p.x - 0.5*p.z) / p.y, z: -0.5};
 		}else{
 			var p1 = {x: 0, y: 0, z: 1};
 		}
 		
 		var p2 = {x: p.y*p1.z - p.z*p1.y, y: p.z*p1.x - p.x*p1.z, z: p.x*p1.y - p.y*p1.x};
	 	
	 	console.log("Light for "+time+"h: ",p,p1,p2);
	 	
		// adjust the light source
		sheetengine.shadows.lightSource = p;
		sheetengine.shadows.lightSourcep1 = p1;  // perpendicular to lightsource, scalar prod is 0 : 1x -1y -1z = 0
		sheetengine.shadows.lightSourcep2 = p2;  // perpendicular both to lightsource and p1 (ls x p1 = p2)
		sheetengine.shadows.shadowAlpha = 0.8;
		sheetengine.shadows.shadeAlpha = 0.6;
	};
	
	return Map;
});


