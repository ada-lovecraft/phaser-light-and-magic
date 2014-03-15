(function() {
	'use strict';
	function Preload() {
		console.debug('PreloadState constructor');
		this.asset = null;
		this.ready = false;

	}

	Preload.prototype = {
		preload: function() {
			console.debug('PreloadState preload');
			this.asset = this.add.sprite(800,800, 'preloader');
			this.asset.anchor.setTo(0.5, 0.5);

			this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
			this.load.setPreloadSprite(this.asset);
			this.load.spritesheet('bird', 'assets/bird.png', 34,24,3);
			this.load.tilemap('map', 'assets/maps/map.json', null, Phaser.Tilemap.TILED_JSON);
			this.load.image('tiles', 'assets/tiles2.png');

		},
		create: function() {
			console.debug('PreloadState Create');
			this.asset.cropEnabled = false;
		},
		update: function() {
			if(!!this.ready) {
				game.state.start('play');
			}
		},
		onLoadComplete: function() {
			console.debug('PreloadState OnLoadComplete');
			this.ready = true;
		}
	};

	PreloadState = Preload;
}());