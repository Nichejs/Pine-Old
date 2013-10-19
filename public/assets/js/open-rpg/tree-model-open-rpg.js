define(["sheetengine"],function(sheetengine){ //Module name

	var Tree = {
		x_position : null,
		y_position : null,
		z_position : null,
		size_canvas : {w:0,h:0}
	};

	Tree.init =function (x,y,z,size) {
		Tree.x_position = x;
		Tree.y_position = y;
		Tree.z_position = z;
		Tree.size_canvas = size;
	};
	
	Tree.drawPineTexture = function() {
		var scale_v = 80/900;
		var scale_h = 80/500;
		var size_adapted = {w:scale_v*Tree.size_canvas.w,h:scale_h*Tree.size_canvas.h};
		var sheet4 = new sheetengine.Sheet({x:Tree.x_position,y:Tree.y_position,z:Tree.z_position}, {alphaD:0,betaD:0,gammaD:0}, size_adapted);
		var sheet5 = new sheetengine.Sheet({x:Tree.x_position,y:Tree.y_position,z:Tree.z_position}, {alphaD:0,betaD:0,gammaD:90}, size_adapted);
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
    		};
    		
    		drawStructure(sheet4.context);
    		drawStructure(sheet5.context);
		var treeSheets = [sheet4,sheet5];
		var densityMap = new sheetengine.DensityMap(10);	
		densityMap.addSheets(treeSheets);
			
	};

	return Tree;
    
});