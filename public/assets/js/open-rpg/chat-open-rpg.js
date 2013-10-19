/**
 * Chat-Open-RPG
 * Chat System for OpenRPG
 * https://github.com/Open-RPG/open-rpg
 * 
 * License: GNU GENERAL PUBLIC LICENSE
 */

define(["jquery", "open_rpg"],function($, OpenRPG){
 	
 	var ChatOpenRPG = {};
	
	/**
	 * Start the chat. It sends the server a subscribe message to the room "chat".
	 * By doing this it will start receiving chat messages.
	 * It also sets up the events for the incoming and outgoing messages.
	 * @param {Object} DOM element for incoming messages (textarea or div)
	 * @param {Object} DOM element for outgoing messages (A text input probably)
	 */
	ChatOpenRPG.init = function(incoming, outgoing){
		// Connect to chat room
		OpenRPG.socket.emit('subscribe', 'chat');
		
		ChatOpenRPG.incoming(incoming);
		ChatOpenRPG.outgoing(outgoing);
	};
	
	/**
	 * Receive new messages from the server and show them on-screen
 	 * @param {Object} DOM object where the chat messages should be appended
 	 */
 	 ChatOpenRPG.incoming = function(textarea){
 	 	
 	 	$(textarea).append('<span style="background:#ccc; color:#222"> &raquo; Conectado </span><br />');
 	 	
 	 	OpenRPG.socket.on('message', function (data) {
 	 		if(data.room = 'chat'){
 	 			if(data.message) {
 	 				if(data.type !== undefined){
 	 					data.message = '<span style="background:#ccc; color:#222"> &raquo; '+data.message+' </span>';
 	 				}
 	 				if(data.user !== undefined){
 	 					if(data.user == OpenRPG.user.name){
 	 						data.user = '[<span style="color:red">'+data.user+'</span>]';
 	 					}else{
 	 						data.user = '[<span style="color:green">'+data.user+'</span>]';
 	 					}
 	 					data.message = data.user+' '+data.message;
 	 				}
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
 	 * @param {Object} DOM object where the chat should listen for messages (On enter key)
 	 */
 	 ChatOpenRPG.outgoing = function(outgoingtext){
 	 	
 	 	$(outgoingtext).keypress(function(event) {
 	 		if(event.which == 13) {
 	 			event.preventDefault();
 	 			OpenRPG.socket.emit('send', { room: 'chat', message: $(outgoingtext).val() });
 	 			$(outgoingtext).val('');
 	 		}
 	 	});
 	 };

 	 return ChatOpenRPG;
 });
