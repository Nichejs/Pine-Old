/**
 * Drawing the Map
 * 
 * https://github.com/Open-RPG/open-rpg
 * 
 * License: GNU GENERAL PUBLIC LICENSE
 */

define(["tree","sheetengine"],function(Tree,sheetengine){

		var MapOpenRPG = {
			// Config options
		};

		/**
		 * Draw a simply BaseSheet into the canvas area 
		 * given by parameter
	 	 * @param {Object} Reference to the canvas element
		 * @param {Object} Domensions of the canvas element {w,h}
		 */
		MapOpenRPG.drawBaseSheet = function(canvasElement, size){
			sheetengine.scene.init(canvasElement, size);
			console.log("Drawing basesheets");
			 // define some basesheets
			for (var x=-1; x<=1; x++) {
				for (var y=-1; y<=1; y++) {
				var basesheet = new sheetengine.BaseSheet({x:x*200,y:y*200,z:0}, {alphaD:90,betaD:0,gammaD:0}, {w:200,h:200});
				basesheet.color = '#5D7E36';
				}

			}
			Tree.init(-150,-120,40,size);
			Tree.drawPineTexture();
			
			sheetengine.calc.calculateChangedSheets();
			sheetengine.drawing.drawScene(true);
		};
		
		return MapOpenRPG;
});


