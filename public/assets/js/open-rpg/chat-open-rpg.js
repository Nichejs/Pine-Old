/**
 * Chat-Open-RPG
 * Chat System for OpenRPG
 * https://github.com/Open-RPG/open-rpg
 * 
 * License: GNU GENERAL PUBLIC LICENSE
 */

 define(["jquery"],function($){
	
	console.log('Loaded ChatOpenRPG');
	
	var ChatOpenRPG = {
		OpenRPG : null
	};
	
	ChatOpenRPG.init = function(OpenR){
		ChatOpenRPG.OpenRPG = OpenR;
	};
	
	/**
	 * Receive new messages from the server and show them on-screen
 	 * @param {Object} textarea
 	 */
 	 ChatOpenRPG.incoming = function(textarea){
 	 	
 	 	ChatOpenRPG.OpenRPG.socket.on('connect', function () {
 	 		$(textarea).append('ChatSocket-> Connected');

 	 		ChatOpenRPG.OpenRPG.socket.on('message', function(data) {

 	 			if(data.message) {
 	 				$(textarea).append("\nClient-> "+data.message);
 	 			} else {
 	 				console.err("There is a problem:", data);
 	 			}

 	 		}).on('disconnect', function() {

 	 			$(textarea).append('ChatSocket-> Disconnected');

 	 		});
 	 	});
 	 };

	/**
	 * Get new messages from the user and send them to the server
	 * They are then broadcasted from the server to the other clients.
 	 * @param {Object} outgoingtext
 	 */
 	 ChatOpenRPG.outgoing = function(outgoingtext){
 	 	
 	 	$(outgoingtext).keypress(function(event) {
 	 		if(event.which == 13) {
 	 			event.preventDefault();
 	 			ChatOpenRPG.OpenRPG.socket.emit('send', { message: $(outgoingtext).val() });
 	 			$(outgoingtext).val('');
 	 		}
 	 	});
 	 };

 	 return ChatOpenRPG;
 });
