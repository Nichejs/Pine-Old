/**
 * Chat-Open-RPG
 * Chat System for OpenRPG
 * https://github.com/Open-RPG/open-rpg
 * 
 * License: GNU GENERAL PUBLIC LICENSE
 */

 define(["jquery"],function($){
 	
 	var ChatOpenRPG = {},
 		OpenRPG;
	
	ChatOpenRPG.init = function(OpenR){
		OpenRPG = OpenR;
		
		// Connect to chat room
		OpenRPG.socket.emit('subscribe', 'chat');
	};
	
	/**
	 * Receive new messages from the server and show them on-screen
 	 * @param {Object} textarea
 	 */
 	 ChatOpenRPG.incoming = function(textarea){
 	 	
 	 	OpenRPG.socket.on('message', function (data) {
 	 		if(data.room = 'chat'){
 	 			if(data.message) {
	 				$(textarea).append(data.message+"<br />");
	 				$(textarea).scrollTop($(textarea)[0].scrollHeight);
	 			} else {
	 				console.error("Socket->No message:", data);
	 			}
 	 		}
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
 	 			OpenRPG.socket.emit('send', { room: 'chat', message: OpenRPG.user.name+": "+$(outgoingtext).val() });
 	 			$(outgoingtext).val('');
 	 		}
 	 	});
 	 };

 	 return ChatOpenRPG;
 });
