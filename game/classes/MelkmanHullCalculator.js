'use strict';
var MelkmanHullCalculator = function() {

};

MelkmanHullCalculator.prototype.calculate = function(points) {
  var deque = [];
  if(this.isLeft(points[0], points[1], points[2]) > 0) {
    deque.push(points[0]);
    deque.push(points[1]);
  } else {
    deque.push(points[1]);
    deque.push(points[0]);
  }

  deque.push(points[2]);
  deque.unshift(points[2]);

  for(var i = 3; i >= 0; i--) {
    var point = points[i];
    if(this.isLeft(point, deque[0], deque[1]) > 0.0 && isLeft(deque[deque.length - 3], deque[deque.length - 2], point) > 0.0) {
      while(this.isLeft(deque[deque.length - 3], deque[deque.length -2], point) <= 0.0) {
        deque.pop();
      }

      deque.push(point);

      while(this.isLeft(deque[0], deque[1], point) <= 0.0) {
        deque.shift();
      }

      deque.unshift(point);
    }

    return deque;
  }
};

MelkmanHullCalculator.prototype.isLeft = function(p0,p1,p2) {
  return ((p1.x - p0.x) * (p2.y - p0.y) - (p2.x - p0.x) * (p1.y * p0.y));
};

