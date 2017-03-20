var rh = {
    /* Various helper functions */
    moving: false,
    glowing: false,

    move: function(game, _x, _y, obj){
        // tween the passed in obj by relative x and y

        if( !this.moving ){ // don't move again if already moving
            this.moving = true; // block until motion complete
            var move = game.add.tween(obj);
            move.to({ x: obj.x + _x, y: obj.y + _y }, 1000, Phaser.Easing.Sinusoidal.Out);
            var complete = function(){ this.moving = false; }; // callback on complete
            move.onComplete.add(complete.bind(this));
            move.start(); // start motion
        }
    },

    glow: function(game, obj){
        // tween the alpha value of the passed in object

        if(!this.glowing){
            this.glowing = true;
            var glow = game.add.tween(obj);
            glow.to({ alpha: 0.8 }, 750, Phaser.Easing.Sinusoidal.Out);
            var halfway = function(){

                var unglow = game.add.tween(obj);
                unglow.to({ alpha: 0.5 }, 250, Phaser.Easing.Sinusoidal.Out);
                var complete = function(){
                    this.glowing = false;
                };
                unglow.onComplete.add(complete.bind(this));
                unglow.start();

            };
            glow.onComplete.add(halfway.bind(this));
            glow.start();
        }
    },

    angle: function(x1, y1, x2, y2){
        // return angle between two points

        var orig = -1 * Math.atan2(y2 - y1, x2 - x1);
        if(orig < 0){
            orig = orig + 2 * Math.PI;
        }
        return orig;
    },

    makeEnemies: function(game, markers, queue){
        // makes enemies on a regular basis by making one
        // enemy and then pushing a callback of this
        // function to a queue, which is executed
        // on set intervals by the updateQueue function
        // in gameState

        var type = Math.floor(Math.random() * 2);
        var enemy;

        if(type == 0){ // row enemy
            var row = Math.floor(Math.random() * markers.length);
            enemy = game.add.sprite(markers[row][0].x, markers[row][0].y, 'enemy');
            game.physics.p2.enable(enemy, false);
            enemy.body.setCircle(12);
            enemy.body.data.shapes[0].sensor = true;
            enemy.body.velocity.x = 150;

        }else{
            var col = Math.floor(Math.random() * markers[0].length);
            enemy = game.add.sprite(markers[0][col].x, markers[0][col].y, 'enemy');
            game.physics.p2.enable(enemy, false);
            enemy.body.setCircle(12);
            enemy.body.data.shapes[0].sensor = true;
            enemy.body.velocity.y = 150;

        }
        enemy.body.onBeginContact.add(game.enemyHit, this);
        var callBack = function(){
            this.makeEnemies(game, markers, queue);
        };
        queue.push([callBack.bind(this), 3000]);
        //setTimeout(callBack.bind(this), 3000);
    },

    flash: function(game, x, y){
        // shows brief flash on enemy death

        var f = game.add.sprite(x, y, 'flash');
        f.anchor.set(0.5);
        var flash = game.add.tween(f);
        flash.to({ alpha: 0 }, 1000, Phaser.Easing.Sinusoidal.Out);
        var complete = function(){ // callback on complete
            this.destroy();
        };
        flash.onComplete.add(complete.bind(f));
        flash.start(); // start motion
    }
};
