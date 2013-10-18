/**
 * Chat-Open-RPG
 * Chat System for OpenRPG
 * https://github.com/Open-RPG/open-rpg
 * 
 * License: GNU GENERAL PUBLIC LICENSE
 */

 define(["jquery"],function($){
	
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
 	 		
 	 	}).on('chatMessage', function(data) {

 			if(data.message) {
 				$(textarea).append("<br />"+data.message);
 				$(textarea).scrollTop($(textarea)[0].scrollHeight);
 			} else {
 				console.error("Socket->No message:", data);
 			}
 		}).on('disconnect', function() {

 			$(textarea).append('ChatSocket-> Disconnected');

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
 	 			ChatOpenRPG.OpenRPG.socket.emit('chatEmit', { message: ChatOpenRPG.OpenRPG.user.name+": "+$(outgoingtext).val() });
 	 			$(outgoingtext).val('');
 	 		}
 	 	});
 	 };

 	 return ChatOpenRPG;
 });
