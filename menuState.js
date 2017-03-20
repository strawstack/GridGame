var menuState = {

    // menuState global properties
    gameHeight: 768,
    gameWidth: 1024,
    titleMusic: null,

    init: function(){
        //console.log("menu - init");
        this.scale.pageAlignHorizontally = true;
    },

    preload: function(){
        //console.log("menu - preload");

        // Audio
        this.load.audio('titleMusic', 'assets/sound/title.mp3');
        this.load.audio('levelMusic', 'assets/sound/level.mp3');
        this.load.audio('shootSound', 'assets/sound/shoot.mp3');
        this.load.audio('hitSound', 'assets/sound/hit.mp3');
        this.load.audio('goldSound', 'assets/sound/gold.mp3');

        // Sprite
        this.load.image('titleImage', 'assets/sprite/titleImage.png');
        this.load.image('player', 'assets/sprite/player.png');
        this.load.image('playerGlow', 'assets/sprite/playerGlow.png');
        this.load.image('gridMarker', 'assets/sprite/gridMarker.png');
        this.load.image('enemy', 'assets/sprite/enemy.png');
        this.load.image('bullet', 'assets/sprite/bullet.png');
        this.load.image('flash', 'assets/sprite/flash.png');

        // Start button
        this.load.spritesheet('startButton', 'assets/sprite/startButton.png', 342, 118);
    },

    create: function(){
        //console.log("menu - create");

        // Set background
        this.stage.backgroundColor = "#97bbce";

        // Play title music
        this.titleMusic = this.add.audio('titleMusic');
        this.titleMusic.loop = true;
        this.titleMusic.play();

        // Place title image
        var titleImage = this.add.sprite(this.gameWidth/2, this.gameHeight/3, 'titleImage');
            titleImage.anchor.x = 0.5; titleImage.anchor.y = 0.5;

        // Start button
        startButton = this.add.button(this.gameWidth/2, 3/4 * this.gameHeight, 'startButton', this.startAction, this, 1, 0, 2);
            startButton.anchor.x = 0.5; startButton.anchor.y = 0.5;
            startButton.onInputOver.add(function(){
                //console.log("btn - over");

            }, this);
            startButton.onInputOut.add(function(){
                //console.log("btn - out");

            }, this);

            //this.startAction();
    },

    startAction: function(){
        //console.log("menu - start");
        this.titleMusic.stop();
        this.state.start("gameState");
    }

};
