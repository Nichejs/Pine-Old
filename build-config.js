require.config({
	baseUrl: 'assets/js/',
    paths: {
    	'app' : 'app',
    	'socket': "socket.io",
        'jquery': "jquery-2.0.3.min",
        'open_rpg': "open-rpg/open-rpg-1",
        'chat' : 'open-rpg/chat-open-rpg',
        'map' : 'open-rpg/map_creation-open-rpg',
        'tree' : 'open-rpg/tree-model-open-rpg',
        'character' : 'open-rpg/character-open-rpg',
        'sheetengine': "sheetengine-src-1.2.0"
    },
    shim: {
    	'sheetengine': {
			'exports': 'sheetengine'
		},
    }
});