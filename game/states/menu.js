(function() {
	'use strict';
	function Menu() {}
	
	Menu.prototype = {
		preload: function() {

			// add our background sprite
			this.background = this.add.tileSprite(0,0,288,505,'background');

			// create a group to put our title assets in 
			// so they can be manipulated as a whole
			this.titleGroup = game.add.group();

			// add our title sprite to the stage and add it to the group
			this.title = this.add.sprite(0,100, 'title');
			this.titleGroup.add(this.title);

			// add our bird sprite to the stage and add it to the group
			this.bird = this.add.sprite(200,105,'bird');
			this.titleGroup.add(this.bird);
			
			// add all frames from the sprite sheet to our bird
			// and begin the animation
			this.bird.animations.add('flap');
			this.bird.animations.play('flap',12,true);

			//set the position of our title group
			this.titleGroup.x = 30;
			this.titleGroup.y = 0;

			// add a looping and yoyo tween effect to the title group
			// currently doesn't seem to work correctly
			game.add.tween(this.titleGroup).to({y:15 }, 350, Phaser.Easing.Linear.None).repeat(100).yoyo(true).start().loop();

			// add our start button with a callback
			this.startButton = game.add.button(30, 300, 'startButton', this.startClick, this);

			// add the ground sprite as a tile
			// and start scrolling in the negative x direction
			this.ground = game.add.tileSprite(0,400, 335,112,'ground');
			this.ground.autoScroll(-200,0);
			this.background.autoScroll(-25,0);
		},
		create: function() {
		},
		update: function() {

		},
		startClick: function() {
			// start button click handler
			// switch gamestate to "play" state
			game.state.start('play');
		}
	};
	MenuState = Menu;
}());