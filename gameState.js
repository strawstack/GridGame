var gameState = {

    //
    // TODO
    // - make better setTimeout system
    // probably subtract delta time in
    // update method until zero
    // then fire callback to avoid
    // window pause event
    //


    // gameState properties
    gameHeight: 768,
    gameWidth: 1024,
    levelMusic: null,
    shootSound: null,
    hitSound: null,
    goldSound: null,
    mouse: null,
    queue: [], // a queue to hold pending function calls
    currentTime: null, // the time the game started

    preload: function(){

    },

    create: function(){
        var d = new Date();
        this.currentTime = d.getTime();

        //  Enable p2 physics
        this.physics.startSystem(Phaser.Physics.P2JS);

        this.stage.backgroundColor = "#FFF0EB"; //  FFDCC3

        // Play level music
        this.levelMusic = this.add.audio('levelMusic');
        this.levelMusic.loop = true;
        this.levelMusic.play();

        // Prep sound effects
        this.shootSound = this.add.audio('shootSound');
        this.hitSound = this.add.audio('hitSound');
        this.goldSound = this.add.audio('goldSound');

        // Layout grid markers
        var markers = [];
        var rows = 6;
        var cols = 9;
        var topOffset = 50;
        var botOffset = 168;
        var vertical = this.gameHeight - topOffset - botOffset;
        var rowSpacing = vertical / (rows - 1);

        var leftOffset = 50;
        var rightOffset = 50;
        var horizontal = this.gameWidth - leftOffset - rightOffset;
        var colSpacing = horizontal / (cols - 1);

        for(var r=0; r<rows; r++){
            var temp = [];
            for(var c=0; c<cols; c++){
                temp.push(this.add.sprite(c * colSpacing + leftOffset, r * rowSpacing + topOffset, 'gridMarker'));
                temp[c].anchor.set(0.5);
                temp[c].alpha = 0.5;
            }
            markers.push(temp);
        }

        // Add player
        var player = this.add.sprite(markers[4][2].x, markers[4][2].y, 'player');
            player.anchor.set(0.5);

        // Make enemies
        rh.makeEnemies(this, markers, this.queue);

        //  Enable the physics bodies
        this.physics.p2.enable(player, false);

        // Set circle bodies
        player.body.setCircle(13);
        player.body.data.shapes[0].sensor = true;

        // Set contact callback
        //player.body.onBeginContact.add(this.hit, this);

        // Add playerGlow
        var playerGlow = this.add.sprite(0, 0, 'playerGlow');
            playerGlow.anchor.x = 0.5; playerGlow.anchor.y = 0.5;
            playerGlow.alpha = 0.5;
            player.addChild(playerGlow);

        // Player Controls
        var ctrls = [
            // dir: key to bind, x/y: movement in x and y
            { dir: Phaser.Keyboard.UP, x: 0, y: -rowSpacing },
            { dir: Phaser.Keyboard.DOWN, x: 0, y: rowSpacing },
            { dir: Phaser.Keyboard.LEFT, x: -colSpacing, y: 0},
            { dir: Phaser.Keyboard.RIGHT, x: colSpacing, y: 0},
            { dir: Phaser.Keyboard.W, x: 0, y: -rowSpacing },
            { dir: Phaser.Keyboard.S, x: 0, y: rowSpacing },
            { dir: Phaser.Keyboard.A, x: -colSpacing, y: 0},
            { dir: Phaser.Keyboard.D, x: colSpacing, y: 0}
        ];

        // assign controls from ctrls array
        for(var i=0; i<ctrls.length; i++){
            var ctrl = this.input.keyboard.addKey(ctrls[i]['dir']);
            var addCtrl = function(_ctrls, _player, _playerGlow){
                rh.move(this, _ctrls['x'], _ctrls['y'], _player.body);
                rh.glow(this, _playerGlow);
            };
            ctrl.onDown.add(addCtrl.bind(this, ctrls[i], player, playerGlow));
        }

        // Fire Controls
        this.input.onDown.add(function(){

            // Get points
            var bx = this.mouse.x;
            var by = this.mouse.y;
            var px = player.body.x;
            var py = player.body.y;

            // Get angle from player to bullet
            var angle = rh.angle(px, py, bx, by);

            // Make and fire bullet
            var bullet = this.add.sprite(px, py, 'bullet');
            bullet.anchor.set(0.5);
            this.physics.p2.enable(bullet, false);
            bullet.body.rotation = -1 * angle;

            var speed = 500;
            bullet.body.velocity.x = speed * Math.cos(-1 * angle);
            bullet.body.velocity.y = speed * Math.sin(-1 * angle);

            this.shootSound.play();

            bullet.body.onBeginContact.add(this.bulletHit, this);

            var killAfter = function(){
                this.destroy();
            };
            setTimeout(killAfter.bind(bullet), 5000);

        }, this);

    },

    bulletHit: function(body, bodyB, shapeA, shapeB, equation){

        if (body){
            if(body.sprite.key == "enemy"){
                rh.flash(this, body.x, body.y); // show flash on death
                body.sprite.destroy();
                body.destroy();
                this.hitSound.play(); // play hit sound

            }
        }

    },
    enemyHit: function(body, bodyB, shapeA, shapeB, equation){

        if (body){
            if(body.sprite.key == "bullet"){
                body.sprite.destroy();
                body.destroy();

            }
        }
    },

    update: function(){
        this.mouse = this.input.mousePointer;
        this.updateQueue();

    },

    updateQueue: function(){
        for(var i=0; i<this.queue.length; i++){
            this.queue[i][1] -= this.deltaTime();
            if(this.queue[i][1] <= 0){
                this.queue[i][0](); // call function
                this.queue.splice(i, 1); // remove from queue
            }
        }
    },

    deltaTime: function(){
        var d = new Date();
        var temp = this.currentTime;
        this.currentTime = d;
        return d - temp;
    },

    render: function(){

    }
};
