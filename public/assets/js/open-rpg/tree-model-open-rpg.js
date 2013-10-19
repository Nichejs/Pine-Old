define(["sheetengine", "map", "open_rpg"],function(sheetengine, MapOpenRPG, OpenRPG){ //Module name

	var Tree = { };

	/**
	 * Draws a tree on the specified coordinates, of the specified size
	 * @param {int} X coordinate
	 * @param {int} y coordinate
	 * @param {int} z coordinate
	 */
	Tree.newTree = function(x,y,z) {
		var tree = {
			x_position : null,
			y_position : null,
			z_position : null
		};
		tree.x_position = x;
		tree.y_position = y;
		tree.z_position = z;
		
		Tree.drawPineTexture(tree);
	};
	
	/**
	 * This shouldn't be called directly, it draws the specified tree
	 * Always use newTree to configure the new tree's properties.
	 * @param {Object} tree
	 */
	Tree.drawPineTexture = function(tree){
		var scale_v = 80/900;
		var scale_h = 80/500;
		var size_adapted = {w:scale_v*OpenRPG.canvas.size.w,h:scale_h*OpenRPG.canvas.size.h};
		var sheet4 = new sheetengine.Sheet({x:tree.x_position,y:tree.y_position,z:tree.z_position}, {alphaD:0,betaD:0,gammaD:0}, size_adapted);
		var sheet5 = new sheetengine.Sheet({x:tree.x_position,y:tree.y_position,z:tree.z_position}, {alphaD:0,betaD:0,gammaD:90}, size_adapted);
		
		function drawStructure(context){
			context.fillStyle = '#BDFF70';
			context.beginPath();
			context.moveTo(40,0);
			context.lineTo(60,30);
			context.lineTo(50,30);
			context.lineTo(70,60);
			context.lineTo(10,60);
			context.lineTo(30,30);
			context.lineTo(20,30);
			context.fill();
			context.fillStyle = '#725538';
    		context.fillRect(35,60,10,20);
    	}
    		
    	drawStructure(sheet4.context);
    	drawStructure(sheet5.context);
		
		var treeSheets = [sheet4,sheet5];
		
		MapOpenRPG.addToDensityMap(treeSheets);
		
		MapOpenRPG.draw();
	};

	return Tree;
    
});