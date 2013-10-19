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
		densityMap : new sheetengine.DensityMap(5)
	};
	
	/**
	 * Set up the map and main character 
	 */
	MapOpenRPG.init = function(){
		MapOpenRPG.drawBaseSheet(OpenRPG.canvas.canvasElement, OpenRPG.canvas.size);
	};

	/**
	 * Draw a simply BaseSheet into the canvas area 
	 * given by parameter
 	 * @param {Object} Reference to the canvas element
	 * @param {Object} Domensions of the canvas element {w,h}
	 */
	MapOpenRPG.drawBaseSheet = function(canvasElement, size){
		sheetengine.scene.init(canvasElement, size);
		// Define some basesheets
		for (var x=-1; x<=1; x++) {
			for (var y=-1; y<=1; y++) {
				var basesheet = new sheetengine.BaseSheet({x:x*200,y:y*200,z:0}, {alphaD:90,betaD:0,gammaD:0}, {w:200,h:200});
				basesheet.color = '#5D7E36';
			}
		}
		
		MapOpenRPG.draw();
	};
	
	/**
	 * Draw scene 
	 */
	MapOpenRPG.draw = function(){
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


