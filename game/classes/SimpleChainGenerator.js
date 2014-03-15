'use strict';
var SimpleChainGenerator = function(params) {
	params = params || {};
	this.points = [];
	this.imageSize = params.imageSize || 1000;
	this.centerPoint = new Phaser.Point(this.imageSize / 2, this.imageSize / 2);
	this.radius = (this.imageSize - 50) / 2;
};

SimpleChainGenerator.prototype.generateChain = function(numberOfPoints, arcAngle) {
	var angleStep = arcAngle / numberOfPoints;
	var angle;
	var i;
	for(i = 1; i <= numberOfPoints; i++) {
		angle = this.randAngle(angleStep, i);
		this.placePoint(angle);
	}
	return this.points;
};

SimpleChainGenerator.prototype.randAngle = function(angleStep, step) {
	return (step - 1) * angleStep + (Math.random() * angleStep);
};

SimpleChainGenerator.prototype.placePoint = function(angle) {
	var x,y;
	x = parseInt(this.centerPoint.x + (Math.random() * this.radius) * Math.cos(angle * Math.PI / 180));
	y = parseInt(this.centerPoint.y + (Math.random() * this.radius) * Math.sin(angle * Math.PI / 180));
	var point = new Phaser.Point(x,y);
	console.debug('point:', point);
	this.points.push(new Phaser.Point(x,y));
};