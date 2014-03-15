(function() {
	'use strict';

	function Boot() {
		console.debug('BootState constructor');
	}

	Boot.prototype = {
		preload: function() {
			console.debug('BootState preload');
			this.load.image('preloader', 'assets/preloader.gif');
		},
		create: function() {
			console.debug('BootState create');
			game.input.maxPointers = 1;
			game.state.start('preload');
		}
	};

	BootState = Boot;
}());