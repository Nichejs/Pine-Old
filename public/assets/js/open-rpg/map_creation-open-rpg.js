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
		redrawInterval : null
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
				basesheet.color = '#5D7E36';
			}
		}
		
		MapOpenRPG.draw();
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


