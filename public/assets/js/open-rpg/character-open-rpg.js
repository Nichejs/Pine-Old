
requirejs.config({
		baseUrl: 'assets/js/'
	});
	define(["sheetengine"],function(sheetengine){ //Module name

		function defineCharacter(centerp) {
        // character definition for animation with sheet motion
        var body = new sheetengine.Sheet({x:0,y:0,z:15}, {alphaD:0,betaD:0,gammaD:0}, {w:11,h:14});
        var backhead = new sheetengine.Sheet({x:0,y:-1,z:19}, {alphaD:0,betaD:0,gammaD:0}, {w:8,h:6});
        backhead.context.fillStyle = '#550';
        backhead.context.fillRect(0,0,8,6);
        // legs
        var leg1 = new sheetengine.Sheet({x:-3,y:0,z:4}, {alphaD:0,betaD:0,gammaD:0}, {w:5,h:8});
        leg1.context.fillStyle = '#00F';
        leg1.context.fillRect(0,0,5,10);
        var leg2 = new sheetengine.Sheet({x:3,y:0,z:4}, {alphaD:0,betaD:0,gammaD:0}, {w:5,h:8});
        leg2.context.fillStyle = '#00F';
        leg2.context.fillRect(0,0,5,10);

        // define character object
        var character = new sheetengine.SheetObject(centerp, {alphaD:0,betaD:0,gammaD:90}, [body,backhead,leg1,leg2], {w:70, h:110, relu:10, relv:25});
          
        character.leg1 = leg1;
        character.leg2 = leg2;
        
        var ctx = body.context;
        
        // head
        ctx.fillStyle = '#FF0';
        ctx.fillRect(2,2,7,4);
        ctx.fillStyle = '#550';
        ctx.fillRect(2,0,7,2);
        ctx.fillRect(2,2,1,1);
        ctx.fillRect(8,2,1,1);

        // body
        ctx.fillStyle = '#F0F';
        ctx.fillRect(0,6,11,7);
          
        // hands
        ctx.fillStyle = '#FF0';
        ctx.fillRect(0,11,1,2);
        ctx.fillRect(10,11,1,2);
        
        character.animationState = 0;
        return character;
      };


var character = {
};
character.init = function(){
	defineCharacter({x:110,y:0,z:0});
       sheetengine.scene.setCenter({x:character.centerp.x, y:character.centerp.y, z:0});
};
	
return character;
});

