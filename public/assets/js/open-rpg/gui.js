/**
 * Pine GUI
 * All data layers presented on top of the game should be handled here.
 * Adding or removing content from them too.
 * 
 * https://github.com/Open-RPG/open-rpg
 * 
 * License: GNU GENERAL PUBLIC LICENSE
 */

define(["jquery", "open_rpg"], function($, OpenRPG){
	var GUI = {
		characterStatus: null,
		armorBar: null,
		healthBar: null
	};
	
	GUI.init = function(){
		GUI.characterStatus = $('<div id="characterStatus"></div>').appendTo(OpenRPG.container);
		// Extra things are hidden by default
		GUI.armorBar = $('<div class="bar" id="armorBar"></div>').appendTo(GUI.characterStatus);
		GUI.healthBar = $('<div class="bar" id="healthBar"></div>').appendTo(GUI.characterStatus).show();
		
		// Display character config button
		GUI.configScreen = $('<div id="configContainer"><div id="configIcons"><ul></ul></div><div id="configMain"></div></div>').appendTo(OpenRPG.container);
		
		// Add initial config menu entries
		GUI.addConfigMenu('Configuration', 'gear');
		GUI.addConfigMenu('Character', 'user');
		GUI.addConfigMenu('Log out', 'power-off');
		
		GUI.menu = $('<div id="context" class="menu">Menu</div>').appendTo('body').hide();
		
		// Replace canvases context menu
		$('canvas').bind("contextmenu", function(e) {
			e.preventDefault();
			console.log("Moving menu");
			$('#context').css({
		        top: e.pageY+'px',
		        left: e.pageX+'px'
		    }).show();
		});
		// Hide the menu
		$('#context').click(function() {
	        $('#context').hide();
	    });
	    $(document).click(function() {
	        $('#context').hide();
	    });
	};
	
	/**
	 * Add a new menu item to the configure screen
	 * @param {String} Name of the menu, it should be unique.
	 * @param {String} Font-awesome icon name 
	 */
	GUI.addConfigMenu = function(name, icon){
		$('#configIcons ul').append('<li><a href="#config" title="'+name+'"><i class="fa fa-'+icon+' fa-fw"></i></a></li>');
	};
	
	/**
	 * Set the health amount in the GUI display
 	 * @param {float} Health amount, any float in [0,100]
	 */
	GUI.setHealth = function(health){
		var width = Math.ceil(health*150/100); // It should be divided by the bar width
		GUI.healthBar.html('<div style="width:'+width+'px; background:red; height:4px;"></div>');
	};
	
	return GUI;
});