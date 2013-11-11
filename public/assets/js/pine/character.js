define(["sheetengine", "map", "main"],function(sheetengine, Map, Main){
	
	var Character = {};
	
	/**
	 * Create a new Character object
	 * @param {Object} Character properties {name : xxx ...} 
	 */
	Character.newCharacter = function(properties){
		var person = Character.defineCharacter(properties.position, properties.colors);
		person.name = properties.name;
		if(properties.movable)
			Character.move(person);
		// Insert a function to draw the player name
		Map.addToStaticQueue(properties.name, function(){
			var ctx = sheetengine.context;
			// Creating pos as follows will avoid referencing.
			var pos = {x: properties.position.x, y: properties.position.y, z: properties.position.z + 30};
			var p = Map.coordsGameToCanvas(pos);
			ctx.font="13px Helvetica, sans-serif";
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 1;
			ctx.strokeText(properties.name, p.u - properties.name.length*3, p.v, 200);
		});
		return person;
	};
	
	// function for creating a character with a body and 2 legs
	Character.defineCharacter = function(centerp, colors) {
		// character definition for animation with sheet motion
		var body = new sheetengine.Sheet({x:0,y:0,z:15}, {alphaD:0,betaD:0,gammaD:0}, {w:11,h:14});
		var backhead = new sheetengine.Sheet({x:0,y:-1,z:19}, {alphaD:0,betaD:0,gammaD:0}, {w:8,h:6});
		backhead.context.fillStyle = '#550';
		backhead.context.fillRect(0,0,8,6);
		// legs
		var leg1 = new sheetengine.Sheet({x:-3,y:0,z:4}, {alphaD:0,betaD:0,gammaD:0}, {w:5,h:8});
		var legColor = colors.legs;
		leg1.context.fillStyle = legColor;
		leg1.context.fillRect(0,0,5,10);
		var leg2 = new sheetengine.Sheet({x:3,y:0,z:4}, {alphaD:0,betaD:0,gammaD:0}, {w:5,h:8});
		leg2.context.fillStyle = legColor;
		leg2.context.fillRect(0,0,5,10);
		
		// define character object
		var character = new sheetengine.SheetObject(centerp, {alphaD:0,betaD:0,gammaD:90}, [body,backhead,leg1,leg2], {w:70, h:110, relu:10, relv:25});
		  
		character.leg1 = leg1;
		character.leg2 = leg2;
		
		var ctx = body.context;
		
		// head
		ctx.fillStyle = '#FFD296';
		ctx.fillRect(2,2,7,4);
		ctx.fillStyle = '#550';
		ctx.fillRect(2,0,7,2);
		ctx.fillRect(2,2,1,1);
		ctx.fillRect(8,2,1,1);
		
		// body
		ctx.fillStyle = colors.body;
		ctx.fillRect(0,6,11,7);
		  
		// hands
		ctx.fillStyle = '#FFD296';
		ctx.fillRect(0,11,1,2);
		ctx.fillRect(10,11,1,2);
		    
		character.animationState = 0;
		
		character.jumpspeed = 10;
		
		Map.redraw();
		
		character.changeColors = function(newColors){
			// Legs
			leg1.context.fillStyle = newColors.legs;
			leg1.context.fillRect(0,0,5,10);
			leg2.context.fillStyle = newColors.legs;
			leg2.context.fillRect(0,0,5,10);
			// Body
			body.context.fillStyle = newColors.body;
			body.context.fillRect(0,6,11,7);
			// Update
			leg1.canvasChanged();
			leg2.canvasChanged();
			body.canvasChanged();
			// Redraw
			Map.redraw();
		};
		
		/**
		 * Moves the character to specified position, takes care of orientation
		 * and animation alltogether.
		 * 
		 * This doesn't perform collision detection!
		 * @param {Object} Target position {x:,y:,z:}
		 */
		character.moveTo = function(position){
			// Determine orientation
			if(character.centerp.x - position.x !== 0){
				if(character.centerp.x - position.x > 0){
					character.setOrientation({alphaD:0,betaD:0,gammaD:270}); // Left
				}else{
					character.setOrientation({alphaD:0,betaD:0,gammaD:90}); // Right
				}
			}else if(character.centerp.y - position.y !== 0){
				if(character.centerp.y - position.y > 0){
					character.setOrientation({alphaD:0,betaD:0,gammaD:180}); // Up
				}else{
					character.setOrientation({alphaD:0,betaD:0,gammaD:0}); // Down
				}
			}
			
			character.setPosition(position);
			Character.animateCharacter(character);
			character.animationState++;
			
			Map.redraw();
		};
		
		/**
		 * Draws a circle around a character.
		 * Only one circle can be drawn for a certain character
		 * @param {int} Width in pixels of the arc
		 * @param {color} HTML color (Name, Hex, rgb, rgba...) 
		 */
		character.addCircle = function(width, color){
			// draw arc around user
			// Insert a function to draw the player name
			Map.addToStaticQueue(character.name+'_circle', function(){
				var ctx = sheetengine.context;
				ctx.save();
				ctx.scale(1, 0.5);
				ctx.lineWidth = width;
				ctx.strokeStyle = color;
				ctx.beginPath();
				var userp = Map.coordsGameToCanvas(character.centerp);
				ctx.arc(userp.u, userp.v*2, 15, 0, Math.PI*2);
				ctx.stroke();
				ctx.restore();
			});
		};
		
		/**
		 * Removes the circle around a user 
		 */
		character.removeCircle = function(){
			Map.removeFromStaticQueue(character.name+'_circle');
		};
		
		return character;
	};
	  
	/**
	 * Animating character's sheets
	 */
	Character.animateCharacter = function(character) {
		var state = Math.floor( (character.animationState % 8) / 2);
		var dir = (state == 0 || state == 3) ? 1 : -1;
		    
		character.rotateSheet(character.leg1, {x:0,y:0,z:8}, {x:1,y:0,z:0}, dir * Math.PI/8);
		character.rotateSheet(character.leg2, {x:0,y:0,z:8}, {x:1,y:0,z:0}, -dir * Math.PI/8);
	};
	
	/**
	 * Make the given character movable. It sets up the listeners for the keys
	 * and all other useful stuff. Movable as in controlled by the user. Other characters
	 * should be non movable. 
 	 * @param {Object} character
	 */
	Character.move = function(character){
		// keyboard events
		var keys = {u:0,d:0,l:0,r:0};
		var jumpspeed = 0;
		var jump = 0;
		
		character.moved = false;
		
		// Set the move timer
		setInterval(function(){
			if(!character.moved) return;
			// Stream position data
			Main.socket.emit('send', { room: 'position', position : character.centerp });
			character.moved = false;
		}, 15);
		
		function setKeys(event, val) {
			// If chat has focus, stop this
			if($('#chatIn').is(":focus")){
				keys = {u:0,d:0,l:0,r:0};
				return;
			};
			
			var keyProcessed = 0;
			      
			if (event.keyCode == '38' || event.keyCode == '87') {
				keys.u = val;
				keyProcessed = 1;
			}
			if (event.keyCode == '37' || event.keyCode == '65') {
				keys.l = val;
				keyProcessed = 1;
			}
			if (event.keyCode == '39' || event.keyCode == '68') {
				keys.r = val;
				keyProcessed = 1;
			}
			if (event.keyCode == '40' || event.keyCode == '83') {
				keys.d = val;
				keyProcessed = 1;
			}
			if (event.keyCode == '32') {
				if (jump == 0 && val == 1) {
					jump = 1;
					jumpspeed = character.jumpspeed;
				}
				keyProcessed = 1;
			}
			if (keyProcessed) event.preventDefault();
		}
		  
		window.onkeydown = function(event) { setKeys(event, 1); };
		window.onkeyup = function(event) { setKeys(event, 0); };
		
		function loop() {
			var dx = 0;
			var dy = 0;
			var speed = 5;
			if (keys.u) {
				dy = -speed;
				character.setOrientation({alphaD:0,betaD:0,gammaD:180});
			}
			if (keys.d) {
				dy = speed;
				character.setOrientation({alphaD:0,betaD:0,gammaD:0});
			}
			if (keys.l) {
				dx = -speed;
				character.setOrientation({alphaD:0,betaD:0,gammaD:270});
			}
			if (keys.r) {
				dx = speed;
				character.setOrientation({alphaD:0,betaD:0,gammaD:90});
			}
			if (dx != 0)
				dy = 0;
			    
			// character constantly falls
			jumpspeed -= 2;
			
			// get allowed target point. character's height is 20, and character can climb up to 10 pixels
			var targetInfo = Map.densityMap.getTargetPoint(character.centerp, {x:dx, y:dy, z:jumpspeed}, 20, 10);
			var allowMove = targetInfo.allowMove;
			var targetp = targetInfo.targetp;
			var stopFall = targetInfo.stopFall;
			
			// If character stops falling, reset jump info
			if (stopFall) {
				jumpspeed = 0;
				jump = 0;
			}
			
			var moved = targetp.x != character.centerp.x || targetp.y != character.centerp.y || targetp.z != character.centerp.z;
			if (moved && allowMove) {
				// Move character to target point
				character.setPosition(targetp);
				Character.animateCharacter(character);
				character.animationState++;
				
				// Set center on user
				//sheetengine.scene.setCenter({x:character.centerp.x, y:character.centerp.y, z:0});
				
				// Position is streamed only on draw
				character.moved = true;
				 
				// Calculate sheets and draw scene
				Map.redraw();
			}
		}
		
		setInterval(loop, 30);
	};
	
	return Character;
	
});
