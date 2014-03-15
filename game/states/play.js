(function() {
  'use strict';
  function Segment() {
    this.start = {x:null, y:null};
    this.end = {x:null, y:null};
    this.direction = {x: null, y: null};
    this.magnitude = null;
    this.tile = null;
  }

  function Play() {
    console.debug('play state');
  }
  var ray, lines, map, layer, cursors, sprite, line, tileHits =[], plotting = false;
  Play.prototype = {
    create: function() {
      ray = new Phaser.Line();
      lines = [];
      for(var i = 0; i < 50; i++) {
        lines.push(new Phaser.Line());
      }
      map = game.add.tilemap('map');
      map.addTilesetImage('tiles');
      layer = map.createLayer('Tile Layer 1');
      layer.resizeWorld();
      map.setCollisionBetween(1,100);
      layer.debug = true;
      this.bmd = game.add.bitmapData(8,8);
      var ctx = this.bmd.ctx;
      ctx.fillStyle = "#dd3838";
      ctx.beginPath();
      ctx.arc(4, 4, 4, 0, 2*Math.PI, false);
      ctx.fill();

      this.dots = game.add.group();
      for(var i = 0; i < 50; i++) {
        this.dots.create(0,0,this.bmd);
      }
      this.dots.setAll('anchor.x', 0.5);
      this.dots.setAll('anchor.y', 0.5);
    

      layer.resizeWorld();

      /*
      game.input.onDown.add(this.startLine, this);
      game.input.onUp.add(this.raycast, this);
      /*
      var chainGenerator = new SimpleChainGenerator({imageSize: 400});
      var points = chainGenerator.generateChain(game.rnd.integerInRange(3,10),128);
      var bmd = game.add.bitmapData(128,128);

      
      var ctx = bmd.ctx;
      ctx.setStrokeColor('#999');
      ctx.rect(0,0,128,128);
      ctx.setLineWidth(2);
      ctx.stroke();

      
      
      
      this.poly = game.add.sprite(50,50, bmd);
      
      


      
      
      this.poly = new Phaser.Polygon(points);
      this.graphics = game.add.graphics(0,0);
      this.graphics.beginFill(0x000000);
      this.graphics.lineStyle(2, 0xffd900, 1);

      this.graphics.drawPolygon(this.poly);
      */
      
    },
    shootRays: function() {
      var intersections = [];
      for(var angle = 0; angle< Math.PI * 2; angle += (Math.PI*2) / lines.length) {
        var dx = Math.cos(angle);
        var dy = Math.sin(angle);
        ray.start.set(game.input.activePointer.x, game.input.activePointer.y);
        ray.end.set(game.width/2 + dx * game.width, game.height/2 + dy * game.height);
        var hits = layer.getRayCastTiles(ray,4, false,false);
        var intersection = this.getClosestIntersection(ray,hits);
        intersections.push(intersection);
      }
      return intersections;
    },
    drawLines: function(intersections) {
      intersections.forEach(function(intersection, index) {
        if(!!intersection) {
          lines[index].start.set(game.input.activePointer.x, game.input.activePointer.y);
          lines[index].end.set(intersection.x, intersection.y);
        }
      });

    },

    raycast: function() {
      tileHits = layer.getRayCastTiles(line,4, false,false);

      if(tileHits.length > 0) {
        for (var i = 0; i< tileHits.length; i++) {
          tileHits[i].debug = true;
        }

        layer.dirty = true;
      }

      plotting = false;
      return tileHits;
    },
    getClosestIntersection: function(ray,hits) {
      //determine which side to come from
      var intersection = null;
      var closestIntersection;
      var raySegment = this.createSegmentFromRay(ray);
      var segments = this.createSegmentsFromTiles(hits);
      var angles = [];
      segments.forEach(function(tileSegment) {


        if(raySegment.direction.x/raySegment.magnitude === tileSegment.direction.x/tileSegment.magnitude && raySegment.direction.y / raySegment.magnitude === tileSegment.direction.y/tileSegment.magnitude) {
          return null;
        }

          //Solve for T1 and T2
          
        var T2 = (raySegment.direction.x * (tileSegment.start.y - raySegment.start.y) + raySegment.direction.y * (raySegment.start.x - tileSegment.start.x))/(tileSegment.direction.x * raySegment.direction.y - tileSegment.direction.y*raySegment.direction.x);
        var T1 = (tileSegment.start.x + tileSegment.direction.x * T2 - raySegment.start.x) / raySegment.direction.x;

        if(T1 < 0) {
          return null;
        }
        if(T2 < 0 || T2 > 1) {
          return null;
        }
        
        intersection = {
          x: raySegment.start.x + raySegment.direction.x * T1,
          y: raySegment.start.y + raySegment.direction.y * T1,
          tile: tileSegment.tile
        };

        intersection.direction = {
          x: intersection.x - raySegment.start.x,
          y: intersection.y - raySegment.start.y,
        };

        intersection.magnitude = Math.sqrt(Math.pow(intersection.direction.x,2) + Math.pow(intersection.direction.y,2));
        
        if (!closestIntersection) {
          closestIntersection = intersection;
        } else if (closestIntersection.magnitude > intersection.magnitude) {
          closestIntersection = intersection;
        }
      },this);
      return closestIntersection;
    },

    createSegmentsFromTiles: function(tiles) {
      var segments = [], segment;
      tiles.forEach(function(tile) {
        if(!!tile.faceBottom) {
          segment = new Segment();
          segment.start.x = tile.left;
          segment.end.x = tile.right;
          segment.start.y = tile.bottom;
          segment.end.y = tile.bottom;
          segment.tile = tile;
          segments.push(this.calculateSegmentProperties(segment));
        }
        if(!!tile.faceTop) {
          segment = new Segment();
          segment.start.x = tile.left;
          segment.end.x = tile.right;
          segment.start.y = tile.top;
          segment.end.y = tile.top;
          segment.tile = tile;
          segments.push(this.calculateSegmentProperties(segment));
        }
        if(!!tile.faceLeft) {
          segment = new Segment();
          segment.start.x = tile.left;
          segment.end.x = tile.left;
          segment.start.y = tile.top;
          segment.end.y = tile.bottom;
          segment.tile = tile;
          segments.push(this.calculateSegmentProperties(segment));
        }
        if(!!tile.faceRight) {
          segment = new Segment();
          segment.start.x = tile.right;
          segment.end.x = tile.right;
          segment.start.y = tile.top;
          segment.end.y = tile.bottom;
          segment.tile = tile;
          segments.push(this.calculateSegmentProperties(segment));
        }
        return segments;
      }, this);
      
      return segments;
    },
    calculateSegmentProperties: function(segment) {
      segment.direction.x = segment.end.x - segment.start.x;
      segment.direction.y = segment.end.y - segment.start.y;
      segment.magnitude = Math.sqrt(Math.pow(segment.direction.x,2) + Math.pow(segment.direction.y,2));
      return segment;
    },
    createSegmentFromRay: function(ray) {
      var segment = new Segment();
      segment.start = ray.start;
      segment.end = ray.end;
      segment.direction.x = segment.end.x - segment.start.x;
      segment.direction.y = segment.end.y - segment.start.y;
      segment.magnitude = Math.sqrt(Math.pow(segment.direction.x,2) + Math.pow(segment.direction.y,2));
      return segment;
    },
    update: function() {
      game.physics.arcade.collide(sprite, layer);
      var intersections = this.shootRays();
      this.drawLines(intersections);
      intersections.forEach(function(intersection, index) {
        if(!!intersection) {
          var dot = this.dots.getAt(index);
          dot.x = intersection.x;
          dot.y = intersection.y;
          intersection.tile.alpha = 0;
        }
      }, this);
      
    },
    render: function() {
      lines.forEach(function(line) {
        game.debug.geom(line);  
      });
      
    }
  };
  PlayState = Play;
}());