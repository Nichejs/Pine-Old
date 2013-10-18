/**
 * Chat-Open-RPG
 * Chat System for OpenRPG
 * https://github.com/Open-RPG/open-rpg
 * 
 * License: GNU GENERAL PUBLIC LICENSE
 */

define(["open-rpg/tree-model-open-rpg","sheetengine"],function(Tree,sheetengine){

		var MapOpenRPG = {
			// Config options
		};
	
		

		/**
		 * Draw a simply BaseSheet into the canvas area 
		 * given by parameter
	 	 * @param {Object} canvasElement
		 * @param {dimensions of the canvas element} size
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

		};
		
		
		return MapOpenRPG;


});


