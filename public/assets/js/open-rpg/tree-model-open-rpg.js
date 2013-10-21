define(["sheetengine", "map", "open_rpg"],function(sheetengine, MapOpenRPG, OpenRPG){ //Module name

	var Tree = {};

	/**
	 * Draws a tree on the specified coordinates, of the specified size
	 * @param {int} X coordinate
	 * @param {int} y coordinate
	 * @param {int} z coordinate
	 */
	Tree.newTree = function(x,y,z,size) {
		var tree = {
			x_position : null,
			y_position : null,
			z_position : null,
			size : null
		};
		tree.x_position = x;
		tree.y_position = y;
		tree.z_position = z+size/2; // Fix for height*80
		tree.size = {w: size, h: size}; // For some reason it doesn't work if h != w
		
		Tree.drawPineTexture(tree);
	};
	
	/**
	 * This shouldn't be called directly, it draws the specified tree
	 * Always use newTree to configure the new tree's properties.
	 * @param {Object} tree
	 */
	Tree.drawPineTexture = function(tree){
		var sheet4 = new sheetengine.Sheet({x:tree.x_position,y:tree.y_position,z:tree.z_position}, {alphaD:0,betaD:0,gammaD:0}, tree.size);
		var sheet5 = new sheetengine.Sheet({x:tree.x_position,y:tree.y_position,z:tree.z_position}, {alphaD:0,betaD:0,gammaD:90}, tree.size);
		
		function drawStructure(context){
			// Pine shape
			// Only one color, shading does the rest
			context.fillStyle = '#BDFF70';
			context.beginPath();
			// All relative to height
			context.moveTo(tree.size.h*0.5,0);
			context.lineTo(tree.size.h*0.75, tree.size.w*0.375);
			context.lineTo(tree.size.h*0.625,tree.size.w*0.375);
			context.lineTo(tree.size.h*0.875,tree.size.w*0.75);
			context.lineTo(tree.size.h*0.125,tree.size.w*0.75);
			context.lineTo(tree.size.h*0.375,tree.size.w*0.375);
			context.lineTo(tree.size.h*0.25, tree.size.w*0.375);
			context.fill();
			// Log
			context.fillStyle = '#725538';
			var x = Math.ceil(tree.size.w*0.4375),
				y = Math.ceil(tree.size.h*0.75),
				w = Math.ceil(tree.size.w*0.125),
				h = Math.ceil(tree.size.h*0.25);
			context.fillRect(x,y,w,h);
    	}
    		
    	drawStructure(sheet4.context);
    	drawStructure(sheet5.context);
		
		var treeSheets = [sheet4,sheet5];
		
		MapOpenRPG.addToDensityMap(treeSheets);
		
		MapOpenRPG.redraw();
	};

	return Tree;
    
});