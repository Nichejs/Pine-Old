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
	
	return MapOpenRPG;
});


