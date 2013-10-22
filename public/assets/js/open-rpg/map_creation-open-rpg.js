/**
 * Drawing the Map
 * 
 * https://github.com/Open-RPG/open-rpg
 * 
 * License: GNU GENERAL PUBLIC LICENSE
 */

define(["open_rpg", "sheetengine"],function(OpenRPG, sheetengine){

	var MapOpenRPG = {
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
	MapOpenRPG.init = function(){
		//MapOpenRPG.setTime(18);
		
		// Light test
	 	$('.light').change(function(){
	 		var p = { x: $('#light_x').val(), y: $('#light_y').val(), z: $('#light_z').val() };
	 		var p1 = {x: 1, y: -1, z: (-p.x + p.y) / p.z};
	 		//		 [a[1]*b[2] - a[2]*b[1], a[2]*b[0] - a[0]*b[2], a[0]*b[1] - a[1]*b[0]]
	 		var p2 = {x: p.y*p1.z - p.z*p1.y, y: p.z*p1.x - p.x*p1.z, z: p.x*p1.y - p.y*p1.x};
	 		
	 		sheetengine.shadows.lightSource = p;
			sheetengine.shadows.lightSourcep1 = p1;  // perpendicular to lightsource, scalar prod is 0 : 1x -1y -1z = 0
			sheetengine.shadows.lightSourcep2 = p2;  // perpendicular both to lightsource and p1 (ls x p1 = p2)
			sheetengine.shadows.shadowAlpha = 0.8;
			sheetengine.shadows.shadeAlpha = 0.6;
		
			MapOpenRPG.draw();
	 	});
		
		MapOpenRPG.drawBaseSheet(OpenRPG.canvas.canvasElement, OpenRPG.canvas.size);
		
		// Now we set up the interval for the redraw method
		// Read the description of the redraw method for more info
		MapOpenRPG.redrawInterval = setInterval(function(){
			if(!MapOpenRPG.redrawFlag) return;
			// Flag was set to true, redraw and reset flag
			MapOpenRPG.redrawFlag = false;
			
			sheetengine.calc.calculateChangedSheets();
			sheetengine.drawing.drawScene(true);
			
			// Execute the static queue
			MapOpenRPG.executeStaticQueue();
		}, 30);
		
		
	};

	/**
	 * Draw a simply BaseSheet into the canvas area 
	 * given by parameter
 	 * @param {Object} Reference to the canvas element
	 * @param {Object} Domensions of the canvas element {w,h}
	 */
	MapOpenRPG.drawBaseSheet = function(canvasElement, size){
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
		
		// Image test
		var testSheet = new sheetengine.Sheet({x:150,y:-150,z:59}, {alphaD:0,betaD:0,gammaD:0}, {w:352,h:118});
		var img = new Image();
		img.src = '/assets/img/logo.png';
		img.onload = function() {
			testSheet.context.drawImage(img, 0,0);
			testSheet.canvasChanged();
		};
			
		
		MapOpenRPG.draw();
	};
	
	/**
	 * Transform a pair of real coordinates (i.e. mouse coordinates)
	 * into the game system coordinates (relative to the map center)
	 * @param {Object} Real life coordinates {x:_,y:_}
	 * @returns {Object} An object with the coordinates {x:_,y:_}
	 */
	MapOpenRPG.coordsRealToGame = function(coords){
		var pxy = sheetengine.transforms.inverseTransformPoint({u:coords.y+sheetengine.scene.center.u, v:coords.x+sheetengine.scene.center.v});
		pxy.x = (pxy.x - sheetengine.scene.center.x) / MapOpenRPG.zoomLevel + sheetengine.scene.center.x;
		pxy.y = (pxy.y - sheetengine.scene.center.y) / MapOpenRPG.zoomLevel + sheetengine.scene.center.y;
		return pxy;
	};
	
	/**
	 * Transform a point in the game to a canvas point. 
	 * @param {Object} A point in the game {x,y,z}
	 * @return {Object} A canvas coordinate object {u,v}
	 */
	MapOpenRPG.coordsGameToCanvas = function(point){
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
	MapOpenRPG.addToStaticQueue = function(id, fn){
		MapOpenRPG.staticQueue[id] = fn;
	};
	
	/**
	 * Removes an element from the static queue
	 * @param {Object} Array key, username for example
	 */
	MapOpenRPG.removeFromStaticQueue = function(id){
		delete MapOpenRPG.staticQueue[id];
	};
	
	/**
	 * This executes the functions stored in the queue (if any)
	 * Should only be called from the draw functions. 
	 */
	MapOpenRPG.executeStaticQueue = function(){
		// Using for..in because indixes might not be numbers
		for(var index in MapOpenRPG.staticQueue) {
			MapOpenRPG.staticQueue[index]();
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
	MapOpenRPG.redraw = function(){
		MapOpenRPG.redrawFlag = true;
	};
	
	/**
	 * Draw scene from scratch
	 */
	MapOpenRPG.draw = function(){
		// Check flag, this way we ensure it is only drawn once.
		if(!MapOpenRPG.drawFlag) return false;
		MapOpenRPG.drawFlag = false;
		sheetengine.calc.calculateAllSheets();
		sheetengine.drawing.drawScene(true);
	};
	
	/**
	 * Add sheets to the density map for collision detection 
	 * @param {Object} Sheets to be added
	 */
	MapOpenRPG.addToDensityMap = function(sheets){
		MapOpenRPG.densityMap.addSheets(sheets);
	};
	
	/**
	 * This will be kind of difficult to implement, it should define
	 * the direction of the light for each time of day and year.
	 * It has to define 3 vectors, one will be the direction of light, and then 2 perpendicular vectors.
	 * This will suppose that at 0h the sun is horizontal. And at 12h it is perpendicular to the ground. 
	 */
	MapOpenRPG.setTime = function(time){
		
		/*
		 * function crossProduct(a, b) {
				// Check lengths
			  if (a.length != 3 || b.length != 3) {
			     return;
			  }
			 
			  return [a[1]*b[2] - a[2]*b[1],
			          a[2]*b[0] - a[0]*b[2],
			          a[0]*b[1] - a[1]*b[0]];
			 
			}
		 */
		
		// After some testing, I still have no idea how to get this right
		
		var p = { x: $('#light_x').val(), y: $('#light_y').val(), z: $('#light_z').val() };
 		var p1 = {x: 1, y: -1, z: (-p.x + p.y) / p.z};
 		var p2 = {x: p.y*p1.z - p.z*p1.y, y: p.z*p1.x - p.x*p1.z, z: p.x*p1.y - p.y*p1.x};
	 		
		// adjust the light source
		sheetengine.shadows.lightSource = { x: -1, y: time, z: 1 };
		sheetengine.shadows.lightSourcep1 = { x: -1, y: -time, z: -1 };  // perpendicular to lightsource, scalar prod is 0 : 1x -1y -1z = 0
		sheetengine.shadows.lightSourcep2 = { x: 1, y: 0, z: 0 };  // perpendicular both to lightsource and p1 (ls x p1 = p2)
		sheetengine.shadows.shadowAlpha = 0.8;
		sheetengine.shadows.shadeAlpha = 0.6;
	};
	
	return MapOpenRPG;
});


