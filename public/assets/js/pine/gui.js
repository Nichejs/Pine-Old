/**
 * Pine GUI
 * All data layers presented on top of the game should be handled here.
 * Adding or removing content from them too.
 * 
 * https://github.com/Open-RPG/open-rpg
 * 
 * License: GNU GENERAL PUBLIC LICENSE
 */

define(["jquery", "main"], function($, Main){
	var GUI = {
		characterStatus: null,
		armorBar: null,
		healthBar: null,
		context: null,
		menu: [],
		bottomInfo: []
	};
	
	GUI.init = function(){
		GUI.characterStatus = $('<div id="characterStatus"></div>').appendTo(Main.container);
		// Extra things are hidden by default
		GUI.armorBar = $('<div class="bar" id="armorBar"></div>').appendTo(GUI.characterStatus);
		GUI.healthBar = $('<div class="bar" id="healthBar"></div>').appendTo(GUI.characterStatus).show();
		
		// Display character config button
		GUI.configScreen = $('<div id="configContainer"><div id="configIcons"><ul></ul></div><div id="configMain"><i id="configMenuArrow" class="arrow-right-small"></i></div></div>').appendTo(Main.container);
		
		// Add initial config menu entries
		GUI.addConfigMenu('Configuration', 'gear', 'text', function(){
			return $('<div class="menuPanel"><h3>Configuration</h3>No options available</div>').appendTo('#configMain').hide();
		});
		GUI.addConfigMenu('Character', 'user', 'text', function(){
			var colors = [
				'6A486B', 'AAA259', 'FBFFE6', 'FB8547', 'FDEC68', '253B57'
			];
			var obj = $('<div class="menuPanel"><h3>Character</h3><fieldset class="colorBoxes"><legend>Body color:</legend></fieldset><fieldset class="colorBoxes"><legend>Legs color:</legend></fieldset></div>').appendTo('#configMain').hide();
			
			// Insert color boxes
			$(obj).find('.colorBoxes').each(function(){
				for(var i=0; i<colors.length; i++){
					$(this).append('<a href="#changeColor" class="box-small" style="background:'+colors[i]+'"></a>');
				}
			});
			
			
			$('a[href=changeColors]').click(function(e){
				e.preventDefault();
				console.log("Changing colors");
				Main.character.changeColors({
					legs : Main.randColor(),
					body : Main.randColor()
				});
			});
			return obj;
		});
		GUI.addConfigMenu('Log out', 'power-off', 'exec', function(){
			window.location.reload();
		});
		
		
		
		GUI.context = $('<div id="context" class="menu">Menu</div>').appendTo('body').hide();
		
		// Replace canvases context menu
		$('canvas').bind("contextmenu", function(e) {
			e.preventDefault();
			console.log("Moving menu");
			$('#context').css({
		        top: e.pageY+'px',
		        left: e.pageX+'px'
		    }).show();
		});
		
	    $('canvas').click(function() {
	        $(GUI.context).hide();
	    });
	};
	
	/**
	 * Add a new menu item to the configure screen
	 * If you want to reference the name later, write it
	 * the same way you did when creating it.
	 * 
	 * @param {String} Name of the menu, it should be unique.
	 * @param {String} Font-awesome icon name
	 */
	GUI.addConfigMenu = function(name, icon, type, fn){
		// Display the button
		var button = $('<li><a href="#config" title="'+name+'"><i class="fa fa-'+icon+' fa-fw"></i></a></li>').appendTo('#configIcons ul');
		
		var menuElement = null;
		
		if(type == 'text'){
			menuElement = fn();
		}
		
		// Store a reference
		GUI.menu[name] = {
			button: button,
			content: menuElement
		};
		
		// Attach click event
		$(GUI.menu[name].button).find('a').click(function(e){
			e.preventDefault();
			e.stopPropagation();
			GUI.hideMenuPanels();
			if(type == 'text'){
				$(GUI.menu[name].content).show();
				$('#configMain').show().css({
					top: $(GUI.menu[name].button).offset().top - 145
				});	
			}else if(type=='exec'){
				fn();
			}
		});
		
		// Attach event to close menus
		$('canvas').click(function(){
			GUI.hideMenuPanels();
		});
	};
	
	/**
	 * Hides all panels in the menu.
	 */
	GUI.hideMenuPanels = function(){
		$('.menuPanel').hide();
		$('#configMain').hide();
	};
	
	/**
	 * Show the selected panel 
	 */
	GUI.showPanel = function(name){
		
	};
	
	/**
	 * Add a container box to the bottom row
	 * @param {String} Unique name for the info box
	 * @param {String} HTML initial content (Can be left blank)
	 */
	GUI.addBotomInfo = function(name, content){
		GUI.bottomInfo[name] = $('<span></span>').appendTo("#bottomInfo");
		if(content!==undefined){
			GUI.updateBottomInfo(name, content);
		}
	};
	
	/**
	 * Update the bottom container
	 * @param {String} Identifier, must exists
	 * @param {String} HTML content to insert
	 */
	GUI.updateBottomInfo = function(name, content){
		$(GUI.bottomInfo[name]).html(content);
	};
	
	/**
	 * Set the health amount in the GUI display
 	 * @param {float} Health amount, any float in [0,100]
	 */
	GUI.setHealth = function(health){
		var width = Math.ceil(health*150/100); // It should be divided by the bar width
		GUI.healthBar.html('<div style="width:'+width+'px; background:rgba(255,0,0,0.6); height:4px;"></div>');
	};
	
	return GUI;
});