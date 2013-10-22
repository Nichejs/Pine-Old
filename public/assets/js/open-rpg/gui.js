/**
 * Pine GUI
 * All data layers presented on top of the game should be handled here
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
	};
	
	/**
	 * Set the health amount in the GUI display
 	 * @param {int} health, 0 - 100
	 */
	GUI.setHealth = function(health){
		var width = health*150/100; // It should be divided by the bar width
		GUI.healthBar.html('<div style="width:'+width+'px; background:red; height:4px;"></div>');
	};
	
	return GUI;
});