// Pause-Play.js
var PausePlay = pc.createScript('pausePlay');

// initialize code called once per entity
PausePlay.prototype.initialize = function() {
    this.paused = false;
    this.entity.element.on("mouseente",this.onEnter,this);
    this.entity.element.on("mousedown",this.onPress,this);
    this.entity.element.on("mouseup",this.onRelease,this);
    this.entity.element.on("mouseleave",this.onLeave,this);

    this.entity.element.on("touchstart",this.onPress,this);
    this.entity.element.on("touchend",this.onRelease,this);
};
// update code called every frame
PausePlay.prototype.update = function(dt) {

};


PausePlay.prototype.onPress = function(event) {

        var t = pc.app.root.findByName('play');
        var y = pc.app.root.findByName('paused');
        var a = pc.app.root.findByName('replay');
        this.sound = pc.app.root.findByName("Sound");
        window.famobi_analytics.trackEvent("EVENT_PAUSE");


            this.app.timeScale = 0;
            t.enabled = true;
            y.enabled = false;
            a.enabled =true;
            this.sound.enabled=true;

    this.paused = !this.paused;
};


// animatePosition.js

var AnimatePosition = pc.createScript('animatePosition');

// Example of creating curve attribute with multiple curves (in this case, x, y, z)
AnimatePosition.attributes.add("offsetCurve", {type: "curve", title: "Offset Curve", curves: [ 'x', 'y', 'z' ]});
AnimatePosition.attributes.add("duration", {type: "number", default: 3, title: "Duration (secs)"});


// initialize code called once per entity
AnimatePosition.prototype.initialize = function() {
    // Store the original position of the entity so we can offset from it
    this.startPosition = this.entity.getPosition().clone();

    // Keep track of the current position
    this.position = new pc.Vec3();

    this.time = 0;
};


// update code called every frame
AnimatePosition.prototype.update = function(dt) {
    this.time += dt;

    // Loop the animation forever
    if (this.time > this.duration) {
        this.time -= this.duration;
    }

    // Calculate how far in time we are for the animation
    var percent = this.time / this.duration;

    // Get curve values using current time relative to duration (percent)
    // The offsetCurve has 3 curves (x, y, z) so the returned value will be a set of
    // 3 values
    var curveValue = this.offsetCurve.value(percent);

    // Create our new position from the startPosition and curveValue
    this.position.copy(this.startPosition);
    this.position.x += curveValue[0];
    this.position.y += curveValue[1];
    this.position.z += curveValue[2];

    this.entity.setPosition(this.position);
};


// TileSpawner.js
var TileSpawner = pc.createScript('tileSpawner');
TileSpawner.attributes.add('Tile1', { type: 'entity' });
// initialize code called once per entity
TileSpawner.prototype.initialize = function () {
     this.sphere = this.app.root.findByName('Player');
     this.kontroll = 1;
     this.timer = 0;
     this.lastTile = new pc.Vec3(0, -0, 25, 0);

};

// update code called every frame
TileSpawner.prototype.update = function (dt) {

     this.timer += dt;
     var mid,position,rand;

     if(this.sphere.script.controller.speed>0 && this.sphere.script.controller.speed<=75){
     if (this.timer > 1.2) {
          //this.camera = this.camera || this.app.root.findByName('Camera');
          //var up = new pc.Vec3(0,50,0);
          mid = new pc.Vec3(-140, -100, 0);
          //var down = new pc.Vec3(-40,10,0);
          position = [/*up, down,*/mid/*,mid,mid,mid, mid*/];
          rand = position[Math.floor(Math.random() * position.length)];
          this.lastTile = this.lastTile.add(rand);
          this.spawn(this.lastTile);
          // Reset the timer
         // this.relax();
          this.timer = 0;
     }}



     if(this.sphere.script.controller.speed>75 && this.sphere.script.controller.speed<=100){
     if (this.timer > 0.8) {

          //this.camera = this.camera || this.app.root.findByName('Camera');
          //var up = new pc.Vec3(0,50,0);
          mid = new pc.Vec3(-140, -100, 0);
          //var down = new pc.Vec3(-40,10,0);
          position = [/*up, down,*/mid/*,mid,mid,mid, mid*/];
          rand = position[Math.floor(Math.random() * position.length)];
          this.lastTile = this.lastTile.add(rand);
          this.spawn(this.lastTile);
          // Reset the timer
         // this.relax();
          this.timer = 0;
     }}


     if(this.sphere.script.controller.speed>100){
     if (this.timer > 0.5) {
          //this.camera = this.camera || this.app.root.findByName('Camera');
          //var up = new pc.Vec3(0,50,0);
          mid = new pc.Vec3(-140, -100, 0);
          //var down = new pc.Vec3(-40,10,0);
          position = [/*up, down,*/mid/*,mid,mid,mid, mid*/];
          rand = position[Math.floor(Math.random() * position.length)];
          this.lastTile = this.lastTile.add(rand);
          this.spawn(this.lastTile);
          // Reset the timer
         // this.relax();
          this.timer = 0;
     }}
     //this.relax();

};

/* NEW SPAWN CODE */
TileSpawner.prototype.spawn = function (position) {
     var randomChildIndex = 0;
     /* remember the root to local variable - for better performance */
     this.root = this.root || this.app.root.findByName('Root');

     /* select random parkur index */
     if(this.kontroll < 11){
               randomChildIndex = Math.floor(Math.random()*10);
         this.kontroll++;
     }
     if(Math.floor(this.sphere.script.controller.metres) <= 250 && this.kontroll >= 11){
          randomChildIndex = Math.floor(Math.random()*22);
     }
     if(Math.floor(this.sphere.script.controller.metres) > 250     && this.kontroll >= 11){
          randomChildIndex = Math.floor(Math.random() * this.Tile1.children.length);
     }
    // const randomChildIndex = Math.floor(Math.random() * this.Tile1.children.length);

     /* select the child from the Tile1 by this random index and clone it*/
     const tile = this.Tile1.children[randomChildIndex].clone();

     /* disable the tile before changing position/rotation to prevent physics issues */
     tile.enabled = false;

     /* set name */
     tile.name = "newTilee";
     this.root.addChild(tile);

     /* set its position and angles */
     tile.setLocalEulerAngles(0, 0, 30);
     tile.setPosition(position);

     /* re-enable it after all the physics properties are set */
     tile.enabled = true;
};




// soundof.js
var Soundof = pc.createScript('soundof');

// initialize code called once per entity
Soundof.prototype.initialize = function () {
    this.entity.element.on("mouseente", this.onEnter, this);
    this.entity.element.on("mousedown", this.onPress, this);
    this.entity.element.on("mouseup", this.onRelease, this);
    this.entity.element.on("mouseleave", this.onLeave, this);

    this.entity.element.on("touchstart", this.onPress, this);
    this.entity.element.on("onStart", this.onPress, this);
    this.entity.element.on("touchend", this.onRelease, this);
    this.t = this.app.root.findByName('soundon');
    this.y = this.app.root.findByName('soundoff');
    this.startGame = this.app.root.findByName('StartCamera');
};

// update code called every frame
Soundof.prototype.update = function (dt) {
    if (window.famobi.localStorage.getItem('SoundCheck') == 1) {
        this.t.enabled = false;
        this.y.enabled = true;
        Apicontroller.setGameVolume(1);
    }
};

Soundof.prototype.onPress = function (event) {
    window.famobi.localStorage.setItem('SoundCheck', 1);
    if (this.t.enabled) {
        setTimeout(() => {
            this.t.enabled = false;
            this.y.enabled = true;
            Apicontroller.setGameVolume(1);
            window.famobi_analytics.trackEvent("EVENT_VOLUMECHANGE", { bgmVolume: 1, sfxVolume: 1 });
        }, 100);
    }
};

Soundof.prototype.onRelease = function () { };


// scenechange.js
var SahneDegisim = pc.createScript('sahneDegisim');

SahneDegisim.attributes.add("sceneId", { type: "string", default: "0", title: "Scene ID to Load" });

// initialize code called once per entity
SahneDegisim.prototype.initialize = function () {
    //this.entity.collision.on('collisionstart', this.onCollisionStart, this);
    this.entity.element.on("mouseenter", this.onEnter, this);
    this.entity.element.on("mousedown", this.onPress, this);
    this.entity.element.on("mouseup", this.onRelease, this);
    this.entity.element.on("mouseleave", this.onLeave, this);

    this.entity.element.on("touchstart", this.onPress, this);
    this.entity.element.on("touchend", this.onRelease, this);

};


SahneDegisim.prototype.onPress = function (event) {
        if (this.app.timeScale == 0) { this.app.timeScale = 1; }
        window.famobi_analytics.trackEvent("EVENT_LEVELSTART", { levelName: '' });

        var oldHierarchy = this.app.root.findByName('Root');
        setTimeout(() => {
            oldHierarchy.destroy();
            this.loadScene(this.sceneId, function () { });
        }, 0);
};



SahneDegisim.prototype.loadScene = function (id, callback) {
    var url = id + ".json";
    this.app.loadSceneHierarchy(url, function (err, parent) {
        if (!err)
            callback(parent);
        else
            console.error(err);
    });
};



// Controller.js
// Controller.js
var Controller = pc.createScript('controller');

Controller.attributes.add('speed', { type: 'number', default: 18 });
Controller.attributes.add('direction_speed', { type: 'number', default: 17 });
Controller.attributes.add('count', { type: 'number', default: 1 });
Controller.attributes.add('countText', { type: 'entity' });
Controller.attributes.add('anim', { type: 'entity' });
Controller.attributes.add("sceneId", { type: "string", default: "0", title: "Game Over" });
Controller.attributes.add("geriID", { type: "string", default: "0", title: "Geri" });
Controller.attributes.add('gold', { type: 'number', default: 0 });
Controller.attributes.add('goldText', { type: 'entity' });



// initialize code called once per entity
Controller.prototype.initialize = function () {
    this.entity.rigidbody.body.setCcdMotionThreshold(0.1);
    this.entity.rigidbody.body.setCcdSweptSphereRadius(0.1);
    this.yonlendir = this.app.root.findByName('yandiarayuz');

    this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
    this.entity.collision.on('collisionstart', this.onCollisionStart, this);
    /*this.app.off("rotator:point");
    this.app.on("rotator:point", this.onPoint, this);*/
    this.countText.element.text = "1";

    //this.app.root.findByName("Destroy").collision.on('triggerenter', this.onTriggerEnter, this);

    this.sagButton = this.app.root.findByName('SagButton');
    this.solButton = this.app.root.findByName('SolButtton');

    // buttons state
    this.isSagPressed = false;
    this.isSolPressed = false;

    // remove old event listenrs
    this.sagButton.element.off('mousedown');
    this.sagButton.element.off('mouseup');
    this.sagButton.element.off('touchstart');
    this.sagButton.element.off('touchend');


    this.solButton.element.off('mousedown');
    this.solButton.element.off('mouseup');
    this.solButton.element.off('touchstart');
    this.solButton.element.off('touchend');

    //add new event listeners
    this.sagButton.element.on('mousedown', this.onSagDown, this);
    this.sagButton.element.on('mouseup', this.onSagUp, this);
    this.sagButton.element.on('touchstart', this.onSagDown, this);
    this.sagButton.element.on('touchend', this.onSagUp, this);
    this.solButton.element.on('mousedown', this.onSolDown, this);
    this.solButton.element.on('mouseup', this.onSolUp, this);
    this.solButton.element.on('touchstart', this.onSolDown, this);
    this.solButton.element.on('touchend', this.onSolUp, this);
    this.count = 1;
    this.kontrol = 0;
    this.metres = 0;
    this.sure = 0;
    this.bigs = 0;
    this.magnetkontrol = 0;
    this.magtime = 0;
    this.barrast = 4;
    this.jump = 0;
    this.jumpspeed = 20;
    this.movevertkontrol = 0;
    this.moveVert = -1;
    this.boostcontrol = 0;
    this.animationcheck = 0;
    this.speedcontrol = 0;
    this.sphere = this.app.root.findByName('Player');
    this.t = pc.app.root.findByName('play');
    this.y = pc.app.root.findByName('paused');
    this.shieldd = this.app.root.findByName('Shield');
    this.progres = this.app.root.findByName('ProgressBar');
    this.part = this.app.root.findByName('boom');
    this.part.particlesystem.play();
    this.yoll = this.app.root.findByName('yol');
    this.gameov = this.app.root.findByName('gamov');
    this.yonlendir = this.app.root.findByName('yandiarayuz');
    this.timescore = this.app.root.findByName('scor');
    this.bigscore = this.app.root.findByName('enbuyuk');
    this.coin = this.app.root.findByName('coin');
    this.magtext = this.app.root.findByName('zamantext');
    this.magsayac = this.app.root.findByName('Sayac');
    this.boost = this.app.root.findByName('Boosts');
    this.helicop = this.app.root.findByName('helicopter');
    this.instructive = this.app.root.findByName('instructive');
    this.rep = this.app.root.findByName('rep');
    this.soundapi = this.app.root.findByName('soundapi');
    this.oldmetres = 0;

    this.playerReady=0;

    this.progressBarIncrease = true;
    this.progressBarProgress = 0;


    // report player is ready to play
    //setTimeout(() => {window.famobi.playerReady();}, 1000);

    //Button control
    if (window.famobi.localStorage.getItem('SoundCheck')) {
        this.soundcheck = window.famobi.localStorage.getItem('SoundCheck');
    } else {
        this.soundcheck = 1;
    }
    this.soundof = this.app.root.findByName('soundoff');
    this.soundon = this.app.root.findByName('soundon');
    if (this.soundcheck == 0) {
        this.soundof.enabled = false;
        this.soundon.enabled = true;
        this.app.systems.sound.volume = 0;
    } else if (this.soundcheck == 1) {
        this.soundof.enabled = true;
        this.soundon.enabled = false;
        this.app.systems.sound.volume = 1;
    }


    /* add restart game listener */
    this.app.on('famobi:restartGame', () => {
        window.famobi_analytics.trackEvent("EVENT_LEVELRESTART", {levelName: ''});
        if (this.app.timeScale == 0) { this.app.timeScale = 1; }
        var oldHierarchy = this.app.root.findByName('Root');
        var restartGameId = 1257975;
        if (oldHierarchy) {
            oldHierarchy.destroy();
            setTimeout(() => {
                this.loadScene(restartGameId, function () { });
            }, 0);
        }
    });


    /* skip_tutorial hide */
    if (famobi.hasFeature("skip_tutorial")) { this.instructive.enabled = false; }
    else this.instructive.enabled = true;

    this.playapi = pc.app.root.findByName('playapi');

    /* external_start  */
    if (famobi.hasFeature("external_start"))
    {
        this.y.enabled=false;
    }else{
        this.y.enabled=true;
    }


    /* external_pause  */
    this.pauseapi = pc.app.root.findByName('pauseapi');
    if (famobi.hasFeature("external_pause")) {
        this.pauseapi.enabled = false;
    }
    else {
        this.pauseapi.enabled = true;
    }

    /* external_mute  */
    if (famobi.hasFeature("external_mute")) { this.soundapi.enabled = false; }
    else this.soundapi.enabled = true;


    /* Forced Mode UI HİDE*/
    this.progresssBar = pc.app.root.findByName('ProgresssBar');
    if (isUIHidden('score')) {           this.yoll.enabled = false;    }
    if (isUIHidden('power_up')) {        this.progresssBar.enabled = false;    }

};
Controller.prototype.loadScene = function (id, callback) {
    var url = id + ".json";
    this.app.loadSceneHierarchy(url, function (err, parent) {
        if (!err)
            callback(parent);
        else
            console.error(err);
    });
};


Controller.prototype.onSagDown = function (event) { this.isSagPressed = true; };
Controller.prototype.onSagUp = function (event) { this.isSagPressed = false; };
Controller.prototype.onSolDown = function (event) { this.isSolPressed = true; };
Controller.prototype.onSolUp = function (event) { this.isSolPressed = false; };



Controller.prototype.onCollisionStart = function (result) {
    //ENGELE ÇARPMA ve Animasyon
    this.sds = this.sds || this.app.root.findByName('patlama');
    this.ust = this.ust || this.app.root.findByName('usttext');
    if (result.other.tags.has('gamesound')) {this.y.enabled=true;}

    this.part.particlesystem.play();
    this.sahneyol = this.app.root.findByName('yol');
    this.sahnebar = this.app.root.findByName('ProgressBar');

    if (result.other.tags.has('engel') ||  result.other.tags.has('yanma') )
    {
        this.gameOver();
    }


    if (result.other.tags.has('yeniparkurhiz')) {
        this.entity.sound.play('fast');
        this.part.particlesystem.reset();
        this.speed += 60;
        setTimeout(() => {
            this.speed -= 60;
        }, 1000);
    }

    // top hız noktası ayarı
    if (result.other.tags.has('hız') || result.other.tags.has('hiz')) {
        this.entity.sound.play('fast');
        this.part.particlesystem.reset();
        this.speed += 75;
        setTimeout(() => {
            this.speed -= 75;
        }, 1000);
    }
    if (result.other.tags.has('yeniparkurhiz')) {
        this.entity.sound.play('fast');
        this.part.particlesystem.reset();
        this.speed += 60;
        setTimeout(() => {
            this.speed -= 60;
        }, 1000);
    }

    // top hız noktası ayarı
    if (result.other.tags.has('hız') || result.other.tags.has('hiz')) {
        this.entity.sound.play('fast');
        this.part.particlesystem.reset();
        this.speed += 75;
        setTimeout(() => {
            this.speed -= 75;
        }, 1000);
    }
};

Controller.prototype.gameOver = function() {
    /* Something related to highscore */
    this.boost.enabled = false;
    if (window.famobi.localStorage.getItem('highScore')) {
        this.bigs = window.famobi.localStorage.getItem('highScore');
    } else {
        this.bigs = 0;
    }

    if (this.bigs < Math.floor(this.metres)) { if(isForcedMode()){window.famobi.localStorage.setItem('highScore', Math.floor(this.metres)); }}

    /* Disable some Scene stuff */
    this.anim.setPosition(this.entity.getPosition());
    //Potential hasFeature("result_effect")
    if(true){
        this.sds.particlesystem.play();
        this.sds.sound.play('patpat');
    }
    this.sphere.enabled = false;
    this.t.enabled = false;
    this.y.enabled = false;
    this.sahneyol.enabled = false;
    this.sahnebar.enabled = false;
    if (this.magtext) { this.magtext.enabled = false; }

    /* Levelend related functions */
    const hideFailButtons = function() {
        //hide buttons here
        this.rep.enabled = false;
    }.bind(this);

    const showFailButtons = function() {
        //show buttons here
        setTimeout(() => { this.rep.enabled = true; }, 100);
    }.bind(this);

    const onLevelFailed = function() {
        famobi.log('Level fail reported ');
        showFailButtons();
    }.bind(this);

    const showResultScreen = function() {
        this.yonlendir.enabled = true;
        this.gameov.enabled = false;
        this.app.timeScale = 0;
        this.ust.element.text = Math.floor(this.metres) + "m";
        if (this.bigs <= Math.floor(this.metres)) {
            this.bigs = Math.floor(this.metres);
            this.bigscore.element.text = this.bigs + "m";
        } else this.bigscore.element.text = this.bigs + "m";
    }.bind(this);

    /* Hide Restart Button */
    hideFailButtons();

    /* Call trackEvents */
    window.famobi_analytics.trackEvent("EVENT_CUSTOM", {
        eventName: "LEVELEND",
        result: "fail",
        score: Math.floor(this.metres),
    }).then(() => {
        if(!isForcedMode()) {
            showResultScreen();

            setTimeout(() => {
                Promise.all([
                    window.famobi_analytics.trackEvent("EVENT_LEVELFAIL", { levelName: '', reason: 'dead' }),
                    window.famobi_analytics.trackEvent("EVENT_TOTALSCORE", { totalScore: Math.floor(this.metres)})
                ]).then(showFailButtons);
            }, 2000);
        }
    },
    () => {});

    /*
    // :: USELESS UNUSED CODE :: //
        const hideSuccessButtons = () => {
            this.rep.enabled = false;
        };
        const showSuccessButtons = () => {
            setTimeout(() => {  this.rep.enabled = true;    }, 2500);
        };
        const onLevelCompleted = () => {
            showSuccessButtons();
        };
        const handleLevelCompleted = () => {
            this.gameoeveapi = this.app.root.findByName('yandiarayuz');
            if (isForcedMode()) {
                //make sure every UI element is hidden
                this.gameoeveapi.enabled = false;
                this.boost.enabled = false;
                this.y.enabled = false;
                this.soundapi.enabled = false;
                this.instructive.enabled = false;
            }
            hideSuccessButtons();
            setTimeout(() => {
                Promise.all([
                window.famobi_analytics.trackEvent(
                    "EVENT_TOTALSCORE ",
                    {
                        levelName: '',
                        totalScore: this.bigs
                    }
                ),
            ]).then(() => onLevelCompleted(), () => onLevelCompleted());}, 2000);
            window.famobi.showInterstitialAd();

        };

        famobi_analytics.trackEvent("EVENT_TOTALSCORE", { "totalScore": Math.floor(this.metres)});
        handleLevelCompleted();

        const submitLevelStats = () =>
        {
            const hideFailButtons = () => {
                //hide buttons here
                this.rep.enabled = false;
            };
            hideFailButtons();
            setTimeout(() => {
                Promise.all([
                window.famobi_analytics.trackEvent("EVENT_LEVELFAIL", { levelName: '', reason: 'dead' }),
                window.famobi_analytics.trackEvent("EVENT_TOTALSCORE", { totalScore: Math.floor(this.metres)})
            ]).then(() => onLevelFailed(), () => onLevelFailed());}, 2000);
            window.famobi.showInterstitialAd();
        };


        Apicontroller.handleLevelEndEvent("fail", Math.floor(this.metres), () => {
            if (isForcedMode()) {
                this.app.timeScale = 0;
            } else {
                submitLevelStats();
            }
        });
    */
};

Controller.prototype.barmission = function (rast) {
    switch(rast) {
        case 0:
            Apicontroller.trackStats("speed_powerup");
            this.animationcheck = 1;
            this.boost.children[2].enabled = true;
            this.entity.sound.play('fast');
            this.part.particlesystem.reset();
            this.speed += 100;
            this.speedcontrol = 1;
            break;
        case 1:
            Apicontroller.trackStats("invincible_powerup");
            this.boost.children[1].enabled = true;
            this.shieldd.enabled = true;
            this.kontrol = 1;
            break;
        case 2:
            Apicontroller.trackStats("flying_powerup");
            this.animationcheck = 2;
            this.boost.children[0].enabled = true;
            this.movevertkontrol = 1;
            this.jump = 70;
            this.moveVert = -7;
            setTimeout(() => { this.jump = 0; this.barrast = 4; }, 100);
            break;
        default:
            console.log("Invalid powerup id [" + rast + "]");
            break;
    }
};
Controller.prototype.booststop = function () {
    //ability to fly
    this.boost.children[0].enabled = false;
    this.moveVert = -1;
    this.movevertkontrol = 0;
    this.animationcheck = 0;

    //acceleration feature
    this.boost.children[2].enabled = false;
    if (this.speedcontrol == 1) {
        this.speed -= 100;
        this.speedcontrol = 0;
    }
    this.barrast = 4;
    this.animationcheck = 0;

    //shield feature
    this.boost.children[1].enabled = false;
    this.shieldd.enabled = false;
    this.kontrol = 0;
    this.barrast = 4;

};
// update code called every frame


Controller.prototype.update = function (dt) {
    if (this.animationcheck == 2) {
        this.helicop.enabled = true;
        this.helicop.setPosition(this.entity.getPosition());
    }

    var rb = this.entity.rigidbody;
    var direction_rb = this.entity.rigidbody;
    var moveHoriz = 0;
    var direction_moveHoriz = 0;
    var direction_moveVert = 0;
    this.magtime -= dt;
    this.colortime += dt;
    this.metres += (this.speed * dt) / 4;
    this.sure += dt;
    if (this.yoll) {
        this.yoll.element.text = Math.floor(this.metres) + "m";
        setTimeout(() => {
            if(Math.floor(this.metres) > Math.floor(this.oldmetres)){
            this.oldmetres = Math.floor(this.metres);
            famobi_analytics.trackEvent("EVENT_LIVESCORE", { "liveScore": Math.floor(this.metres)});
            }
         }, 0);
    }

    this.shieldd.setPosition(this.entity.getPosition());

    //if(this.barrast==2){Apicontroller.trackStats("flying_powerup");}

    if (this.progressBarIncrease) {
        if (this.progres.script.progressBar.progress >= 1) {
            //Bar is full
            this.boostcontrol = 1;
            setTimeout(() => { this.boostcontrol = 0; }, 1500);
            this.progressBarIncrease = false;

            if(isForcedMode() && getForcedModeProperties().override && getForcedModeProperties().override.availablePowerUps) {
                //Force Power Up
                let available = getForcedModeProperties().override.availablePowerUps;
                if(Array.isArray(available) && available.length > 0) {
                    let randomAvailablePowerUp = available[Math.floor(Math.random() * available.length)];

                    switch(randomAvailablePowerUp) {
                        case "speed": this.barrast = 0; break;
                        case "invincibility": this.barrast = 1; break;
                        case "flying": this.barrast = 2; break;
                        default: this.barrast = Math.floor(Math.random() * 3); break;
                    }
                } else {
                    this.barrast = -1;
                }
            } else {
                //Random Power Up
                this.barrast = Math.floor(Math.random() * 3);
            }

            //Activate Power Up
            this.barmission(this.barrast);
        }
    } else {
        this.progressBarProgress -= (dt/6);
    }

    //Update Progress Bar
    this.progres.script.progressBar.setProgress(this.progressBarProgress);

    if (this.progres.script.progressBar.progress <= 0) {
        //Reset Powerup
        this.booststop();
        this.progressBarIncrease = true;

        // this.magtext.enabled = false;
        // this.magnetkontrol = 0;
    }
    if (this.magtime > 0) {
        this.magsayac.element.text = Math.floor(this.magtime);
    }
    if (this.magtime <= 0) {
        this.magtext.enabled = false;
        this.magnetkontrol = 0;
    }

    // mobile or computer environment control
    if (pc.app.mouse) {
        if (this.app.keyboard.isPressed(pc.KEY_LEFT)) {
            direction_moveHoriz = 1; this.instructive.enabled = false;
            //if(this.playerReady==0){window.famobi.playerReady(); this.playerReady=1;}
        }
        if (this.app.keyboard.isPressed(pc.KEY_RIGHT)) {
            direction_moveHoriz = -1; this.instructive.enabled = false;
            //if(this.playerReady==0){window.famobi.playerReady(); this.playerReady=1;}
        }
        this.sagButton.enabled = false;
        this.solButton.enabled = false;
    }

    if (this.app.touch) {
        if (this.isSolPressed) { direction_moveHoriz = 1; this.instructive.enabled = false; }
        if (this.isSagPressed) { direction_moveHoriz = -1; this.instructive.enabled = false; }
        this.sagButton.enabled = true;
        this.solButton.enabled = true;
    }



    var moveVect = new pc.Vec3(this.moveVert, this.jump, moveHoriz);
    if (this.movevertkontrol == 0) {
        rb.applyForce(moveVect.scale(this.speed));
    } else if (this.movevertkontrol == 1) {
        rb.applyForce(moveVect.scale(this.jumpspeed));
    }
    var direction_moveVect = new pc.Vec3(direction_moveVert, 0, direction_moveHoriz);
    direction_rb.applyForce(direction_moveVect.scale(this.direction_speed));

};

// dat.gui.min.js
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.dat=t():e.dat=t()}(this,function(){return function(e){function t(o){if(n[o])return n[o].exports;var i=n[o]={exports:{},id:o,loaded:!1};return e[o].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}var i=n(1),r=o(i);e.exports=r["default"]},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}t.__esModule=!0;var i=n(2),r=o(i),a=n(6),l=o(a),s=n(3),u=o(s),d=n(7),c=o(d),f=n(8),_=o(f),p=n(10),h=o(p),m=n(11),b=o(m),g=n(12),v=o(g),y=n(13),w=o(y),x=n(14),E=o(x),C=n(15),A=o(C),S=n(16),k=o(S),O=n(9),T=o(O),R=n(17),L=o(R);t["default"]={color:{Color:r["default"],math:l["default"],interpret:u["default"]},controllers:{Controller:c["default"],BooleanController:_["default"],OptionController:h["default"],StringController:b["default"],NumberController:v["default"],NumberControllerBox:w["default"],NumberControllerSlider:E["default"],FunctionController:A["default"],ColorController:k["default"]},dom:{dom:T["default"]},gui:{GUI:L["default"]},GUI:L["default"]}},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t,n){Object.defineProperty(e,t,{get:function(){return"RGB"===this.__state.space?this.__state[t]:(h.recalculateRGB(this,t,n),this.__state[t])},set:function(e){"RGB"!==this.__state.space&&(h.recalculateRGB(this,t,n),this.__state.space="RGB"),this.__state[t]=e}})}function a(e,t){Object.defineProperty(e,t,{get:function(){return"HSV"===this.__state.space?this.__state[t]:(h.recalculateHSV(this),this.__state[t])},set:function(e){"HSV"!==this.__state.space&&(h.recalculateHSV(this),this.__state.space="HSV"),this.__state[t]=e}})}t.__esModule=!0;var l=n(3),s=o(l),u=n(6),d=o(u),c=n(4),f=o(c),_=n(5),p=o(_),h=function(){function e(){if(i(this,e),this.__state=s["default"].apply(this,arguments),this.__state===!1)throw new Error("Failed to interpret color arguments");this.__state.a=this.__state.a||1}return e.prototype.toString=function(){return(0,f["default"])(this)},e.prototype.toHexString=function(){return(0,f["default"])(this,!0)},e.prototype.toOriginal=function(){return this.__state.conversion.write(this)},e}();h.recalculateRGB=function(e,t,n){if("HEX"===e.__state.space)e.__state[t]=d["default"].component_from_hex(e.__state.hex,n);else{if("HSV"!==e.__state.space)throw new Error("Corrupted color state");p["default"].extend(e.__state,d["default"].hsv_to_rgb(e.__state.h,e.__state.s,e.__state.v))}},h.recalculateHSV=function(e){var t=d["default"].rgb_to_hsv(e.r,e.g,e.b);p["default"].extend(e.__state,{s:t.s,v:t.v}),p["default"].isNaN(t.h)?p["default"].isUndefined(e.__state.h)&&(e.__state.h=0):e.__state.h=t.h},h.COMPONENTS=["r","g","b","h","s","v","hex","a"],r(h.prototype,"r",2),r(h.prototype,"g",1),r(h.prototype,"b",0),a(h.prototype,"h"),a(h.prototype,"s"),a(h.prototype,"v"),Object.defineProperty(h.prototype,"a",{get:function(){return this.__state.a},set:function(e){this.__state.a=e}}),Object.defineProperty(h.prototype,"hex",{get:function(){return"HEX"!==!this.__state.space&&(this.__state.hex=d["default"].rgb_to_hex(this.r,this.g,this.b)),this.__state.hex},set:function(e){this.__state.space="HEX",this.__state.hex=e}}),t["default"]=h},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}t.__esModule=!0;var i=n(4),r=o(i),a=n(5),l=o(a),s=[{litmus:l["default"].isString,conversions:{THREE_CHAR_HEX:{read:function(e){var t=e.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);return null!==t&&{space:"HEX",hex:parseInt("0x"+t[1].toString()+t[1].toString()+t[2].toString()+t[2].toString()+t[3].toString()+t[3].toString(),0)}},write:r["default"]},SIX_CHAR_HEX:{read:function(e){var t=e.match(/^#([A-F0-9]{6})$/i);return null!==t&&{space:"HEX",hex:parseInt("0x"+t[1].toString(),0)}},write:r["default"]},CSS_RGB:{read:function(e){var t=e.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);return null!==t&&{space:"RGB",r:parseFloat(t[1]),g:parseFloat(t[2]),b:parseFloat(t[3])}},write:r["default"]},CSS_RGBA:{read:function(e){var t=e.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);return null!==t&&{space:"RGB",r:parseFloat(t[1]),g:parseFloat(t[2]),b:parseFloat(t[3]),a:parseFloat(t[4])}},write:r["default"]}}},{litmus:l["default"].isNumber,conversions:{HEX:{read:function(e){return{space:"HEX",hex:e,conversionName:"HEX"}},write:function(e){return e.hex}}}},{litmus:l["default"].isArray,conversions:{RGB_ARRAY:{read:function(e){return 3===e.length&&{space:"RGB",r:e[0],g:e[1],b:e[2]}},write:function(e){return[e.r,e.g,e.b]}},RGBA_ARRAY:{read:function(e){return 4===e.length&&{space:"RGB",r:e[0],g:e[1],b:e[2],a:e[3]}},write:function(e){return[e.r,e.g,e.b,e.a]}}}},{litmus:l["default"].isObject,conversions:{RGBA_OBJ:{read:function(e){return!!(l["default"].isNumber(e.r)&&l["default"].isNumber(e.g)&&l["default"].isNumber(e.b)&&l["default"].isNumber(e.a))&&{space:"RGB",r:e.r,g:e.g,b:e.b,a:e.a}},write:function(e){return{r:e.r,g:e.g,b:e.b,a:e.a}}},RGB_OBJ:{read:function(e){return!!(l["default"].isNumber(e.r)&&l["default"].isNumber(e.g)&&l["default"].isNumber(e.b))&&{space:"RGB",r:e.r,g:e.g,b:e.b}},write:function(e){return{r:e.r,g:e.g,b:e.b}}},HSVA_OBJ:{read:function(e){return!!(l["default"].isNumber(e.h)&&l["default"].isNumber(e.s)&&l["default"].isNumber(e.v)&&l["default"].isNumber(e.a))&&{space:"HSV",h:e.h,s:e.s,v:e.v,a:e.a}},write:function(e){return{h:e.h,s:e.s,v:e.v,a:e.a}}},HSV_OBJ:{read:function(e){return!!(l["default"].isNumber(e.h)&&l["default"].isNumber(e.s)&&l["default"].isNumber(e.v))&&{space:"HSV",h:e.h,s:e.s,v:e.v}},write:function(e){return{h:e.h,s:e.s,v:e.v}}}}}],u=void 0,d=void 0,c=function(){d=!1;var e=arguments.length>1?l["default"].toArray(arguments):arguments[0];return l["default"].each(s,function(t){if(t.litmus(e))return l["default"].each(t.conversions,function(t,n){if(u=t.read(e),d===!1&&u!==!1)return d=u,u.conversionName=n,u.conversion=t,l["default"].BREAK}),l["default"].BREAK}),d};t["default"]=c},function(e,t){"use strict";t.__esModule=!0,t["default"]=function(e,t){var n=e.__state.conversionName.toString(),o=Math.round(e.r),i=Math.round(e.g),r=Math.round(e.b),a=e.a,l=Math.round(e.h),s=e.s.toFixed(1),u=e.v.toFixed(1);if(t||"THREE_CHAR_HEX"===n||"SIX_CHAR_HEX"===n){for(var d=e.hex.toString(16);d.length<6;)d="0"+d;return"#"+d}return"CSS_RGB"===n?"rgb("+o+","+i+","+r+")":"CSS_RGBA"===n?"rgba("+o+","+i+","+r+","+a+")":"HEX"===n?"0x"+e.hex.toString(16):"RGB_ARRAY"===n?"["+o+","+i+","+r+"]":"RGBA_ARRAY"===n?"["+o+","+i+","+r+","+a+"]":"RGB_OBJ"===n?"{r:"+o+",g:"+i+",b:"+r+"}":"RGBA_OBJ"===n?"{r:"+o+",g:"+i+",b:"+r+",a:"+a+"}":"HSV_OBJ"===n?"{h:"+l+",s:"+s+",v:"+u+"}":"HSVA_OBJ"===n?"{h:"+l+",s:"+s+",v:"+u+",a:"+a+"}":"unknown format"}},function(e,t){"use strict";t.__esModule=!0;var n=Array.prototype.forEach,o=Array.prototype.slice,i={BREAK:{},extend:function(e){return this.each(o.call(arguments,1),function(t){var n=this.isObject(t)?Object.keys(t):[];n.forEach(function(n){this.isUndefined(t[n])||(e[n]=t[n])}.bind(this))},this),e},defaults:function(e){return this.each(o.call(arguments,1),function(t){var n=this.isObject(t)?Object.keys(t):[];n.forEach(function(n){this.isUndefined(e[n])&&(e[n]=t[n])}.bind(this))},this),e},compose:function(){var e=o.call(arguments);return function(){for(var t=o.call(arguments),n=e.length-1;n>=0;n--)t=[e[n].apply(this,t)];return t[0]}},each:function(e,t,o){if(e)if(n&&e.forEach&&e.forEach===n)e.forEach(t,o);else if(e.length===e.length+0){var i=void 0,r=void 0;for(i=0,r=e.length;i<r;i++)if(i in e&&t.call(o,e[i],i)===this.BREAK)return}else for(var a in e)if(t.call(o,e[a],a)===this.BREAK)return},defer:function(e){setTimeout(e,0)},debounce:function(e,t){var n=void 0;return function(){function o(){n=null}var i=this,r=arguments,a=!n;clearTimeout(n),n=setTimeout(o,t),a&&e.apply(i,r)}},toArray:function(e){return e.toArray?e.toArray():o.call(e)},isUndefined:function(e){return void 0===e},isNull:function(e){return null===e},isNaN:function(e){function t(t){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(e){return isNaN(e)}),isArray:Array.isArray||function(e){return e.constructor===Array},isObject:function(e){return e===Object(e)},isNumber:function(e){return e===e+0},isString:function(e){return e===e+""},isBoolean:function(e){return e===!1||e===!0},isFunction:function(e){return"[object Function]"===Object.prototype.toString.call(e)}};t["default"]=i},function(e,t){"use strict";t.__esModule=!0;var n=void 0,o={hsv_to_rgb:function(e,t,n){var o=Math.floor(e/60)%6,i=e/60-Math.floor(e/60),r=n*(1-t),a=n*(1-i*t),l=n*(1-(1-i)*t),s=[[n,l,r],[a,n,r],[r,n,l],[r,a,n],[l,r,n],[n,r,a]][o];return{r:255*s[0],g:255*s[1],b:255*s[2]}},rgb_to_hsv:function(e,t,n){var o=Math.min(e,t,n),i=Math.max(e,t,n),r=i-o,a=void 0,l=void 0;return 0===i?{h:NaN,s:0,v:0}:(l=r/i,a=e===i?(t-n)/r:t===i?2+(n-e)/r:4+(e-t)/r,a/=6,a<0&&(a+=1),{h:360*a,s:l,v:i/255})},rgb_to_hex:function(e,t,n){var o=this.hex_with_component(0,2,e);return o=this.hex_with_component(o,1,t),o=this.hex_with_component(o,0,n)},component_from_hex:function(e,t){return e>>8*t&255},hex_with_component:function(e,t,o){return o<<(n=8*t)|e&~(255<<n)}};t["default"]=o},function(e,t){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}t.__esModule=!0;var o=function(){function e(t,o){n(this,e),this.initialValue=t[o],this.domElement=document.createElement("div"),this.object=t,this.property=o,this.__onChange=void 0,this.__onFinishChange=void 0}return e.prototype.onChange=function(e){return this.__onChange=e,this},e.prototype.onFinishChange=function(e){return this.__onFinishChange=e,this},e.prototype.setValue=function(e){return this.object[this.property]=e,this.__onChange&&this.__onChange.call(this,e),this.updateDisplay(),this},e.prototype.getValue=function(){return this.object[this.property]},e.prototype.updateDisplay=function(){return this},e.prototype.isModified=function(){return this.initialValue!==this.getValue()},e}();t["default"]=o},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}t.__esModule=!0;var l=n(7),s=o(l),u=n(9),d=o(u),c=function(e){function t(n,o){function a(){s.setValue(!s.__prev)}i(this,t);var l=r(this,e.call(this,n,o)),s=l;return l.__prev=l.getValue(),l.__checkbox=document.createElement("input"),l.__checkbox.setAttribute("type","checkbox"),d["default"].bind(l.__checkbox,"change",a,!1),l.domElement.appendChild(l.__checkbox),l.updateDisplay(),l}return a(t,e),t.prototype.setValue=function(t){var n=e.prototype.setValue.call(this,t);return this.__onFinishChange&&this.__onFinishChange.call(this,this.getValue()),this.__prev=this.getValue(),n},t.prototype.updateDisplay=function(){return this.getValue()===!0?(this.__checkbox.setAttribute("checked","checked"),this.__checkbox.checked=!0):this.__checkbox.checked=!1,e.prototype.updateDisplay.call(this)},t}(s["default"]);t["default"]=c},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}function i(e){if("0"===e||a["default"].isUndefined(e))return 0;var t=e.match(u);return a["default"].isNull(t)?0:parseFloat(t[1])}t.__esModule=!0;var r=n(5),a=o(r),l={HTMLEvents:["change"],MouseEvents:["click","mousemove","mousedown","mouseup","mouseover"],KeyboardEvents:["keydown"]},s={};a["default"].each(l,function(e,t){a["default"].each(e,function(e){s[e]=t})});var u=/(\d+(\.\d+)?)px/,d={makeSelectable:function(e,t){void 0!==e&&void 0!==e.style&&(e.onselectstart=t?function(){return!1}:function(){},e.style.MozUserSelect=t?"auto":"none",e.style.KhtmlUserSelect=t?"auto":"none",e.unselectable=t?"on":"off")},makeFullscreen:function(e,t,n){var o=n,i=t;a["default"].isUndefined(i)&&(i=!0),a["default"].isUndefined(o)&&(o=!0),e.style.position="absolute",i&&(e.style.left=0,e.style.right=0),o&&(e.style.top=0,e.style.bottom=0)},fakeEvent:function(e,t,n,o){var i=n||{},r=s[t];if(!r)throw new Error("Event type "+t+" not supported.");var l=document.createEvent(r);switch(r){case"MouseEvents":var u=i.x||i.clientX||0,d=i.y||i.clientY||0;l.initMouseEvent(t,i.bubbles||!1,i.cancelable||!0,window,i.clickCount||1,0,0,u,d,!1,!1,!1,!1,0,null);break;case"KeyboardEvents":var c=l.initKeyboardEvent||l.initKeyEvent;a["default"].defaults(i,{cancelable:!0,ctrlKey:!1,altKey:!1,shiftKey:!1,metaKey:!1,keyCode:void 0,charCode:void 0}),c(t,i.bubbles||!1,i.cancelable,window,i.ctrlKey,i.altKey,i.shiftKey,i.metaKey,i.keyCode,i.charCode);break;default:l.initEvent(t,i.bubbles||!1,i.cancelable||!0)}a["default"].defaults(l,o),e.dispatchEvent(l)},bind:function(e,t,n,o){var i=o||!1;return e.addEventListener?e.addEventListener(t,n,i):e.attachEvent&&e.attachEvent("on"+t,n),d},unbind:function(e,t,n,o){var i=o||!1;return e.removeEventListener?e.removeEventListener(t,n,i):e.detachEvent&&e.detachEvent("on"+t,n),d},addClass:function(e,t){if(void 0===e.className)e.className=t;else if(e.className!==t){var n=e.className.split(/ +/);n.indexOf(t)===-1&&(n.push(t),e.className=n.join(" ").replace(/^\s+/,"").replace(/\s+$/,""))}return d},removeClass:function(e,t){if(t)if(e.className===t)e.removeAttribute("class");else{var n=e.className.split(/ +/),o=n.indexOf(t);o!==-1&&(n.splice(o,1),e.className=n.join(" "))}else e.className=void 0;return d},hasClass:function(e,t){return new RegExp("(?:^|\\s+)"+t+"(?:\\s+|$)").test(e.className)||!1},getWidth:function(e){var t=getComputedStyle(e);return i(t["border-left-width"])+i(t["border-right-width"])+i(t["padding-left"])+i(t["padding-right"])+i(t.width)},getHeight:function(e){var t=getComputedStyle(e);return i(t["border-top-width"])+i(t["border-bottom-width"])+i(t["padding-top"])+i(t["padding-bottom"])+i(t.height)},getOffset:function(e){var t=e,n={left:0,top:0};if(t.offsetParent)do n.left+=t.offsetLeft,n.top+=t.offsetTop,t=t.offsetParent;while(t);return n},isActive:function(e){return e===document.activeElement&&(e.type||e.href)}};t["default"]=d},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}t.__esModule=!0;var l=n(7),s=o(l),u=n(9),d=o(u),c=n(5),f=o(c),_=function(e){function t(n,o,a){i(this,t);var l=r(this,e.call(this,n,o)),s=a,u=l;return l.__select=document.createElement("select"),f["default"].isArray(s)&&!function(){var e={};f["default"].each(s,function(t){e[t]=t}),s=e}(),f["default"].each(s,function(e,t){var n=document.createElement("option");n.innerHTML=t,n.setAttribute("value",e),u.__select.appendChild(n)}),l.updateDisplay(),d["default"].bind(l.__select,"change",function(){var e=this.options[this.selectedIndex].value;u.setValue(e)}),l.domElement.appendChild(l.__select),l}return a(t,e),t.prototype.setValue=function(t){var n=e.prototype.setValue.call(this,t);return this.__onFinishChange&&this.__onFinishChange.call(this,this.getValue()),n},t.prototype.updateDisplay=function(){return d["default"].isActive(this.__select)?this:(this.__select.value=this.getValue(),e.prototype.updateDisplay.call(this))},t}(s["default"]);t["default"]=_},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}t.__esModule=!0;var l=n(7),s=o(l),u=n(9),d=o(u),c=function(e){function t(n,o){function a(){u.setValue(u.__input.value)}function l(){u.__onFinishChange&&u.__onFinishChange.call(u,u.getValue())}i(this,t);var s=r(this,e.call(this,n,o)),u=s;return s.__input=document.createElement("input"),s.__input.setAttribute("type","text"),d["default"].bind(s.__input,"keyup",a),d["default"].bind(s.__input,"change",a),d["default"].bind(s.__input,"blur",l),d["default"].bind(s.__input,"keydown",function(e){13===e.keyCode&&this.blur()}),s.updateDisplay(),s.domElement.appendChild(s.__input),s}return a(t,e),t.prototype.updateDisplay=function(){return d["default"].isActive(this.__input)||(this.__input.value=this.getValue()),e.prototype.updateDisplay.call(this)},t}(s["default"]);t["default"]=c},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function l(e){var t=e.toString();return t.indexOf(".")>-1?t.length-t.indexOf(".")-1:0}t.__esModule=!0;var s=n(7),u=o(s),d=n(5),c=o(d),f=function(e){function t(n,o,a){i(this,t);var s=r(this,e.call(this,n,o)),u=a||{};return s.__min=u.min,s.__max=u.max,s.__step=u.step,c["default"].isUndefined(s.__step)?0===s.initialValue?s.__impliedStep=1:s.__impliedStep=Math.pow(10,Math.floor(Math.log(Math.abs(s.initialValue))/Math.LN10))/10:s.__impliedStep=s.__step,s.__precision=l(s.__impliedStep),s}return a(t,e),t.prototype.setValue=function(t){var n=t;return void 0!==this.__min&&n<this.__min?n=this.__min:void 0!==this.__max&&n>this.__max&&(n=this.__max),void 0!==this.__step&&n%this.__step!==0&&(n=Math.round(n/this.__step)*this.__step),e.prototype.setValue.call(this,n)},t.prototype.min=function(e){return this.__min=e,this},t.prototype.max=function(e){return this.__max=e,this},t.prototype.step=function(e){return this.__step=e,this.__impliedStep=e,this.__precision=l(e),this},t}(u["default"]);t["default"]=f},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function l(e,t){var n=Math.pow(10,t);return Math.round(e*n)/n}t.__esModule=!0;var s=n(12),u=o(s),d=n(9),c=o(d),f=n(5),_=o(f),p=function(e){function t(n,o,a){function l(){var e=parseFloat(m.__input.value);_["default"].isNaN(e)||m.setValue(e)}function s(){m.__onFinishChange&&m.__onFinishChange.call(m,m.getValue())}function u(){s()}function d(e){var t=b-e.clientY;m.setValue(m.getValue()+t*m.__impliedStep),b=e.clientY}function f(){c["default"].unbind(window,"mousemove",d),c["default"].unbind(window,"mouseup",f),s()}function p(e){c["default"].bind(window,"mousemove",d),c["default"].bind(window,"mouseup",f),b=e.clientY}i(this,t);var h=r(this,e.call(this,n,o,a));h.__truncationSuspended=!1;var m=h,b=void 0;return h.__input=document.createElement("input"),h.__input.setAttribute("type","text"),c["default"].bind(h.__input,"change",l),c["default"].bind(h.__input,"blur",u),c["default"].bind(h.__input,"mousedown",p),c["default"].bind(h.__input,"keydown",function(e){13===e.keyCode&&(m.__truncationSuspended=!0,this.blur(),m.__truncationSuspended=!1,s())}),h.updateDisplay(),h.domElement.appendChild(h.__input),h}return a(t,e),t.prototype.updateDisplay=function(){return this.__input.value=this.__truncationSuspended?this.getValue():l(this.getValue(),this.__precision),e.prototype.updateDisplay.call(this)},t}(u["default"]);t["default"]=p},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function l(e,t,n,o,i){return o+(i-o)*((e-t)/(n-t))}t.__esModule=!0;var s=n(12),u=o(s),d=n(9),c=o(d),f=function(e){function t(n,o,a,s,u){function d(e){document.activeElement.blur(),c["default"].bind(window,"mousemove",f),c["default"].bind(window,"mouseup",_),f(e)}function f(e){e.preventDefault();var t=h.__background.getBoundingClientRect();return h.setValue(l(e.clientX,t.left,t.right,h.__min,h.__max)),!1}function _(){c["default"].unbind(window,"mousemove",f),c["default"].unbind(window,"mouseup",_),h.__onFinishChange&&h.__onFinishChange.call(h,h.getValue())}i(this,t);var p=r(this,e.call(this,n,o,{min:a,max:s,step:u})),h=p;return p.__background=document.createElement("div"),p.__foreground=document.createElement("div"),c["default"].bind(p.__background,"mousedown",d),c["default"].addClass(p.__background,"slider"),c["default"].addClass(p.__foreground,"slider-fg"),p.updateDisplay(),p.__background.appendChild(p.__foreground),p.domElement.appendChild(p.__background),p}return a(t,e),t.prototype.updateDisplay=function(){var t=(this.getValue()-this.__min)/(this.__max-this.__min);return this.__foreground.style.width=100*t+"%",e.prototype.updateDisplay.call(this)},t}(u["default"]);t["default"]=f},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}t.__esModule=!0;var l=n(7),s=o(l),u=n(9),d=o(u),c=function(e){function t(n,o,a){i(this,t);var l=r(this,e.call(this,n,o)),s=l;return l.__button=document.createElement("div"),l.__button.innerHTML=void 0===a?"Fire":a,d["default"].bind(l.__button,"click",function(e){return e.preventDefault(),s.fire(),!1}),d["default"].addClass(l.__button,"button"),l.domElement.appendChild(l.__button),l}return a(t,e),t.prototype.fire=function(){this.__onChange&&this.__onChange.call(this),this.getValue().call(this.object),this.__onFinishChange&&this.__onFinishChange.call(this,this.getValue())},t}(s["default"]);t["default"]=c},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function l(e,t,n,o){e.style.background="",g["default"].each(y,function(i){e.style.cssText+="background: "+i+"linear-gradient("+t+", "+n+" 0%, "+o+" 100%); "})}function s(e){e.style.background="",e.style.cssText+="background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);",e.style.cssText+="background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);",e.style.cssText+="background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);",e.style.cssText+="background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);",e.style.cssText+="background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);"}t.__esModule=!0;var u=n(7),d=o(u),c=n(9),f=o(c),_=n(2),p=o(_),h=n(3),m=o(h),b=n(5),g=o(b),v=function(e){function t(n,o){function a(e){h(e),f["default"].bind(window,"mousemove",h),f["default"].bind(window,"mouseup",u)}function u(){f["default"].unbind(window,"mousemove",h),f["default"].unbind(window,"mouseup",u),_()}function d(){var e=(0,m["default"])(this.value);e!==!1?(y.__color.__state=e,y.setValue(y.__color.toOriginal())):this.value=y.__color.toString()}function c(){f["default"].unbind(window,"mousemove",b),f["default"].unbind(window,"mouseup",c),_()}function _(){y.__onFinishChange&&y.__onFinishChange.call(y,y.__color.toOriginal())}function h(e){e.preventDefault();var t=y.__saturation_field.getBoundingClientRect(),n=(e.clientX-t.left)/(t.right-t.left),o=1-(e.clientY-t.top)/(t.bottom-t.top);return o>1?o=1:o<0&&(o=0),n>1?n=1:n<0&&(n=0),y.__color.v=o,y.__color.s=n,y.setValue(y.__color.toOriginal()),!1}function b(e){e.preventDefault();var t=y.__hue_field.getBoundingClientRect(),n=1-(e.clientY-t.top)/(t.bottom-t.top);return n>1?n=1:n<0&&(n=0),y.__color.h=360*n,y.setValue(y.__color.toOriginal()),!1}i(this,t);var v=r(this,e.call(this,n,o));v.__color=new p["default"](v.getValue()),v.__temp=new p["default"](0);var y=v;v.domElement=document.createElement("div"),f["default"].makeSelectable(v.domElement,!1),v.__selector=document.createElement("div"),v.__selector.className="selector",v.__saturation_field=document.createElement("div"),v.__saturation_field.className="saturation-field",v.__field_knob=document.createElement("div"),v.__field_knob.className="field-knob",v.__field_knob_border="2px solid ",v.__hue_knob=document.createElement("div"),v.__hue_knob.className="hue-knob",v.__hue_field=document.createElement("div"),v.__hue_field.className="hue-field",v.__input=document.createElement("input"),v.__input.type="text",v.__input_textShadow="0 1px 1px ",f["default"].bind(v.__input,"keydown",function(e){13===e.keyCode&&d.call(this)}),f["default"].bind(v.__input,"blur",d),f["default"].bind(v.__selector,"mousedown",function(){f["default"].addClass(this,"drag").bind(window,"mouseup",function(){f["default"].removeClass(y.__selector,"drag")})});var w=document.createElement("div");return g["default"].extend(v.__selector.style,{width:"122px",height:"102px",padding:"3px",backgroundColor:"#222",boxShadow:"0px 1px 3px rgba(0,0,0,0.3)"}),g["default"].extend(v.__field_knob.style,{position:"absolute",width:"12px",height:"12px",border:v.__field_knob_border+(v.__color.v<.5?"#fff":"#000"),boxShadow:"0px 1px 3px rgba(0,0,0,0.5)",borderRadius:"12px",zIndex:1}),g["default"].extend(v.__hue_knob.style,{position:"absolute",width:"15px",height:"2px",borderRight:"4px solid #fff",zIndex:1}),g["default"].extend(v.__saturation_field.style,{width:"100px",height:"100px",border:"1px solid #555",marginRight:"3px",display:"inline-block",cursor:"pointer"}),g["default"].extend(w.style,{width:"100%",height:"100%",background:"none"}),l(w,"top","rgba(0,0,0,0)","#000"),g["default"].extend(v.__hue_field.style,{width:"15px",height:"100px",border:"1px solid #555",cursor:"ns-resize",position:"absolute",top:"3px",right:"3px"}),s(v.__hue_field),g["default"].extend(v.__input.style,{outline:"none",textAlign:"center",color:"#fff",border:0,fontWeight:"bold",textShadow:v.__input_textShadow+"rgba(0,0,0,0.7)"}),f["default"].bind(v.__saturation_field,"mousedown",a),f["default"].bind(v.__field_knob,"mousedown",a),f["default"].bind(v.__hue_field,"mousedown",function(e){b(e),f["default"].bind(window,"mousemove",b),f["default"].bind(window,"mouseup",c)}),v.__saturation_field.appendChild(w),v.__selector.appendChild(v.__field_knob),v.__selector.appendChild(v.__saturation_field),v.__selector.appendChild(v.__hue_field),v.__hue_field.appendChild(v.__hue_knob),v.domElement.appendChild(v.__input),v.domElement.appendChild(v.__selector),v.updateDisplay(),v}return a(t,e),t.prototype.updateDisplay=function(){var e=(0,m["default"])(this.getValue());if(e!==!1){var t=!1;g["default"].each(p["default"].COMPONENTS,function(n){if(!g["default"].isUndefined(e[n])&&!g["default"].isUndefined(this.__color.__state[n])&&e[n]!==this.__color.__state[n])return t=!0,{}},this),t&&g["default"].extend(this.__color.__state,e)}g["default"].extend(this.__temp.__state,this.__color.__state),this.__temp.a=1;var n=this.__color.v<.5||this.__color.s>.5?255:0,o=255-n;g["default"].extend(this.__field_knob.style,{marginLeft:100*this.__color.s-7+"px",marginTop:100*(1-this.__color.v)-7+"px",backgroundColor:this.__temp.toHexString(),border:this.__field_knob_border+"rgb("+n+","+n+","+n+")"}),this.__hue_knob.style.marginTop=100*(1-this.__color.h/360)+"px",this.__temp.s=1,this.__temp.v=1,l(this.__saturation_field,"left","#fff",this.__temp.toHexString()),this.__input.value=this.__color.toString(),g["default"].extend(this.__input.style,{backgroundColor:this.__color.toHexString(),color:"rgb("+n+","+n+","+n+")",textShadow:this.__input_textShadow+"rgba("+o+","+o+","+o+",.7)"})},t}(d["default"]),y=["-moz-","-o-","-webkit-","-ms-",""];t["default"]=v},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}function i(e,t,n){var o=document.createElement("li");return t&&o.appendChild(t),n?e.__ul.insertBefore(o,n):e.__ul.appendChild(o),e.onResize(),o}function r(e,t){var n=e.__preset_select[e.__preset_select.selectedIndex];t?n.innerHTML=n.value+"*":n.innerHTML=n.value}function a(e,t,n){if(n.__li=t,n.__gui=e,U["default"].extend(n,{options:function(t){if(arguments.length>1){var o=n.__li.nextElementSibling;return n.remove(),s(e,n.object,n.property,{before:o,factoryArgs:[U["default"].toArray(arguments)]})}if(U["default"].isArray(t)||U["default"].isObject(t)){var i=n.__li.nextElementSibling;return n.remove(),s(e,n.object,n.property,{before:i,factoryArgs:[t]})}},name:function(e){return n.__li.firstElementChild.firstElementChild.innerHTML=e,n},listen:function(){return n.__gui.listen(n),n},remove:function(){
return n.__gui.remove(n),n}}),n instanceof B["default"])!function(){var e=new N["default"](n.object,n.property,{min:n.__min,max:n.__max,step:n.__step});U["default"].each(["updateDisplay","onChange","onFinishChange","step"],function(t){var o=n[t],i=e[t];n[t]=e[t]=function(){var t=Array.prototype.slice.call(arguments);return i.apply(e,t),o.apply(n,t)}}),z["default"].addClass(t,"has-slider"),n.domElement.insertBefore(e.domElement,n.domElement.firstElementChild)}();else if(n instanceof N["default"]){var o=function(t){if(U["default"].isNumber(n.__min)&&U["default"].isNumber(n.__max)){var o=n.__li.firstElementChild.firstElementChild.innerHTML,i=n.__gui.__listening.indexOf(n)>-1;n.remove();var r=s(e,n.object,n.property,{before:n.__li.nextElementSibling,factoryArgs:[n.__min,n.__max,n.__step]});return r.name(o),i&&r.listen(),r}return t};n.min=U["default"].compose(o,n.min),n.max=U["default"].compose(o,n.max)}else n instanceof O["default"]?(z["default"].bind(t,"click",function(){z["default"].fakeEvent(n.__checkbox,"click")}),z["default"].bind(n.__checkbox,"click",function(e){e.stopPropagation()})):n instanceof R["default"]?(z["default"].bind(t,"click",function(){z["default"].fakeEvent(n.__button,"click")}),z["default"].bind(t,"mouseover",function(){z["default"].addClass(n.__button,"hover")}),z["default"].bind(t,"mouseout",function(){z["default"].removeClass(n.__button,"hover")})):n instanceof j["default"]&&(z["default"].addClass(t,"color"),n.updateDisplay=U["default"].compose(function(e){return t.style.borderLeftColor=n.__color.toString(),e},n.updateDisplay),n.updateDisplay());n.setValue=U["default"].compose(function(t){return e.getRoot().__preset_select&&n.isModified()&&r(e.getRoot(),!0),t},n.setValue)}function l(e,t){var n=e.getRoot(),o=n.__rememberedObjects.indexOf(t.object);if(o!==-1){var i=n.__rememberedObjectIndecesToControllers[o];if(void 0===i&&(i={},n.__rememberedObjectIndecesToControllers[o]=i),i[t.property]=t,n.load&&n.load.remembered){var r=n.load.remembered,a=void 0;if(r[e.preset])a=r[e.preset];else{if(!r[Q])return;a=r[Q]}if(a[o]&&void 0!==a[o][t.property]){var l=a[o][t.property];t.initialValue=l,t.setValue(l)}}}}function s(e,t,n,o){if(void 0===t[n])throw new Error('Object "'+t+'" has no property "'+n+'"');var r=void 0;if(o.color)r=new j["default"](t,n);else{var s=[t,n].concat(o.factoryArgs);r=C["default"].apply(e,s)}o.before instanceof S["default"]&&(o.before=o.before.__li),l(e,r),z["default"].addClass(r.domElement,"c");var u=document.createElement("span");z["default"].addClass(u,"property-name"),u.innerHTML=r.property;var d=document.createElement("div");d.appendChild(u),d.appendChild(r.domElement);var c=i(e,d,o.before);return z["default"].addClass(c,oe.CLASS_CONTROLLER_ROW),r instanceof j["default"]?z["default"].addClass(c,"color"):z["default"].addClass(c,g(r.getValue())),a(e,c,r),e.__controllers.push(r),r}function u(e,t){return document.location.href+"."+t}function d(e,t,n){var o=document.createElement("option");o.innerHTML=t,o.value=t,e.__preset_select.appendChild(o),n&&(e.__preset_select.selectedIndex=e.__preset_select.length-1)}function c(e,t){t.style.display=e.useLocalStorage?"block":"none"}function f(e){var t=e.__save_row=document.createElement("li");z["default"].addClass(e.domElement,"has-save"),e.__ul.insertBefore(t,e.__ul.firstChild),z["default"].addClass(t,"save-row");var n=document.createElement("span");n.innerHTML="&nbsp;",z["default"].addClass(n,"button gears");var o=document.createElement("span");o.innerHTML="Save",z["default"].addClass(o,"button"),z["default"].addClass(o,"save");var i=document.createElement("span");i.innerHTML="New",z["default"].addClass(i,"button"),z["default"].addClass(i,"save-as");var r=document.createElement("span");r.innerHTML="Revert",z["default"].addClass(r,"button"),z["default"].addClass(r,"revert");var a=e.__preset_select=document.createElement("select");e.load&&e.load.remembered?U["default"].each(e.load.remembered,function(t,n){d(e,n,n===e.preset)}):d(e,Q,!1),z["default"].bind(a,"change",function(){for(var t=0;t<e.__preset_select.length;t++)e.__preset_select[t].innerHTML=e.__preset_select[t].value;e.preset=this.value}),t.appendChild(a),t.appendChild(n),t.appendChild(o),t.appendChild(i),t.appendChild(r),q&&!function(){var t=document.getElementById("dg-local-explain"),n=document.getElementById("dg-local-storage"),o=document.getElementById("dg-save-locally");o.style.display="block","true"===localStorage.getItem(u(e,"isLocal"))&&n.setAttribute("checked","checked"),c(e,t),z["default"].bind(n,"change",function(){e.useLocalStorage=!e.useLocalStorage,c(e,t)})}();var l=document.getElementById("dg-new-constructor");z["default"].bind(l,"keydown",function(e){!e.metaKey||67!==e.which&&67!==e.keyCode||Z.hide()}),z["default"].bind(n,"click",function(){l.innerHTML=JSON.stringify(e.getSaveObject(),void 0,2),Z.show(),l.focus(),l.select()}),z["default"].bind(o,"click",function(){e.save()}),z["default"].bind(i,"click",function(){var t=prompt("Enter a new preset name.");t&&e.saveAs(t)}),z["default"].bind(r,"click",function(){e.revert()})}function _(e){function t(t){return t.preventDefault(),e.width+=i-t.clientX,e.onResize(),i=t.clientX,!1}function n(){z["default"].removeClass(e.__closeButton,oe.CLASS_DRAG),z["default"].unbind(window,"mousemove",t),z["default"].unbind(window,"mouseup",n)}function o(o){return o.preventDefault(),i=o.clientX,z["default"].addClass(e.__closeButton,oe.CLASS_DRAG),z["default"].bind(window,"mousemove",t),z["default"].bind(window,"mouseup",n),!1}var i=void 0;e.__resize_handle=document.createElement("div"),U["default"].extend(e.__resize_handle.style,{width:"6px",marginLeft:"-3px",height:"200px",cursor:"ew-resize",position:"absolute"}),z["default"].bind(e.__resize_handle,"mousedown",o),z["default"].bind(e.__closeButton,"mousedown",o),e.domElement.insertBefore(e.__resize_handle,e.domElement.firstElementChild)}function p(e,t){e.domElement.style.width=t+"px",e.__save_row&&e.autoPlace&&(e.__save_row.style.width=t+"px"),e.__closeButton&&(e.__closeButton.style.width=t+"px")}function h(e,t){var n={};return U["default"].each(e.__rememberedObjects,function(o,i){var r={},a=e.__rememberedObjectIndecesToControllers[i];U["default"].each(a,function(e,n){r[n]=t?e.initialValue:e.getValue()}),n[i]=r}),n}function m(e){for(var t=0;t<e.__preset_select.length;t++)e.__preset_select[t].value===e.preset&&(e.__preset_select.selectedIndex=t)}function b(e){0!==e.length&&D["default"].call(window,function(){b(e)}),U["default"].each(e,function(e){e.updateDisplay()})}var g="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e},v=n(18),y=o(v),w=n(19),x=o(w),E=n(20),C=o(E),A=n(7),S=o(A),k=n(8),O=o(k),T=n(15),R=o(T),L=n(13),N=o(L),M=n(14),B=o(M),H=n(16),j=o(H),P=n(21),D=o(P),V=n(22),F=o(V),I=n(9),z=o(I),G=n(5),U=o(G),X=n(23),K=o(X);y["default"].inject(K["default"]);var Y="dg",J=72,W=20,Q="Default",q=function(){try{return"localStorage"in window&&null!==window.localStorage}catch(e){return!1}}(),Z=void 0,$=!0,ee=void 0,te=!1,ne=[],oe=function ie(e){function t(){var e=n.getRoot();e.width+=1,U["default"].defer(function(){e.width-=1})}var n=this,o=e||{};this.domElement=document.createElement("div"),this.__ul=document.createElement("ul"),this.domElement.appendChild(this.__ul),z["default"].addClass(this.domElement,Y),this.__folders={},this.__controllers=[],this.__rememberedObjects=[],this.__rememberedObjectIndecesToControllers=[],this.__listening=[],o=U["default"].defaults(o,{autoPlace:!0,width:ie.DEFAULT_WIDTH}),o=U["default"].defaults(o,{resizable:o.autoPlace,hideable:o.autoPlace}),U["default"].isUndefined(o.load)?o.load={preset:Q}:o.preset&&(o.load.preset=o.preset),U["default"].isUndefined(o.parent)&&o.hideable&&ne.push(this),o.resizable=U["default"].isUndefined(o.parent)&&o.resizable,o.autoPlace&&U["default"].isUndefined(o.scrollable)&&(o.scrollable=!0);var r=q&&"true"===localStorage.getItem(u(this,"isLocal")),a=void 0;if(Object.defineProperties(this,{parent:{get:function(){return o.parent}},scrollable:{get:function(){return o.scrollable}},autoPlace:{get:function(){return o.autoPlace}},preset:{get:function(){return n.parent?n.getRoot().preset:o.load.preset},set:function(e){n.parent?n.getRoot().preset=e:o.load.preset=e,m(this),n.revert()}},width:{get:function(){return o.width},set:function(e){o.width=e,p(n,e)}},name:{get:function(){return o.name},set:function(e){o.name=e,titleRowName&&(titleRowName.innerHTML=o.name)}},closed:{get:function(){return o.closed},set:function(e){o.closed=e,o.closed?z["default"].addClass(n.__ul,ie.CLASS_CLOSED):z["default"].removeClass(n.__ul,ie.CLASS_CLOSED),this.onResize(),n.__closeButton&&(n.__closeButton.innerHTML=e?ie.TEXT_OPEN:ie.TEXT_CLOSED)}},load:{get:function(){return o.load}},useLocalStorage:{get:function(){return r},set:function(e){q&&(r=e,e?z["default"].bind(window,"unload",a):z["default"].unbind(window,"unload",a),localStorage.setItem(u(n,"isLocal"),e))}}}),U["default"].isUndefined(o.parent)){if(o.closed=!1,z["default"].addClass(this.domElement,ie.CLASS_MAIN),z["default"].makeSelectable(this.domElement,!1),q&&r){n.useLocalStorage=!0;var l=localStorage.getItem(u(this,"gui"));l&&(o.load=JSON.parse(l))}this.__closeButton=document.createElement("div"),this.__closeButton.innerHTML=ie.TEXT_CLOSED,z["default"].addClass(this.__closeButton,ie.CLASS_CLOSE_BUTTON),this.domElement.appendChild(this.__closeButton),z["default"].bind(this.__closeButton,"click",function(){n.closed=!n.closed})}else{void 0===o.closed&&(o.closed=!0);var s=document.createTextNode(o.name);z["default"].addClass(s,"controller-name");var d=i(n,s),c=function(e){return e.preventDefault(),n.closed=!n.closed,!1};z["default"].addClass(this.__ul,ie.CLASS_CLOSED),z["default"].addClass(d,"title"),z["default"].bind(d,"click",c),o.closed||(this.closed=!1)}o.autoPlace&&(U["default"].isUndefined(o.parent)&&($&&(ee=document.createElement("div"),z["default"].addClass(ee,Y),z["default"].addClass(ee,ie.CLASS_AUTO_PLACE_CONTAINER),document.body.appendChild(ee),$=!1),ee.appendChild(this.domElement),z["default"].addClass(this.domElement,ie.CLASS_AUTO_PLACE)),this.parent||p(n,o.width)),this.__resizeHandler=function(){n.onResizeDebounced()},z["default"].bind(window,"resize",this.__resizeHandler),z["default"].bind(this.__ul,"webkitTransitionEnd",this.__resizeHandler),z["default"].bind(this.__ul,"transitionend",this.__resizeHandler),z["default"].bind(this.__ul,"oTransitionEnd",this.__resizeHandler),this.onResize(),o.resizable&&_(this),a=function(){q&&"true"===localStorage.getItem(u(n,"isLocal"))&&localStorage.setItem(u(n,"gui"),JSON.stringify(n.getSaveObject()))},this.saveToLocalStorageIfPossible=a,o.parent||t()};oe.toggleHide=function(){te=!te,U["default"].each(ne,function(e){e.domElement.style.display=te?"none":""})},oe.CLASS_AUTO_PLACE="a",oe.CLASS_AUTO_PLACE_CONTAINER="ac",oe.CLASS_MAIN="main",oe.CLASS_CONTROLLER_ROW="cr",oe.CLASS_TOO_TALL="taller-than-window",oe.CLASS_CLOSED="closed",oe.CLASS_CLOSE_BUTTON="close-button",oe.CLASS_DRAG="drag",oe.DEFAULT_WIDTH=245,oe.TEXT_CLOSED="Close Controls",oe.TEXT_OPEN="Open Controls",oe._keydownHandler=function(e){"text"===document.activeElement.type||e.which!==J&&e.keyCode!==J||oe.toggleHide()},z["default"].bind(window,"keydown",oe._keydownHandler,!1),U["default"].extend(oe.prototype,{add:function(e,t){return s(this,e,t,{factoryArgs:Array.prototype.slice.call(arguments,2)})},addColor:function(e,t){return s(this,e,t,{color:!0})},remove:function(e){this.__ul.removeChild(e.__li),this.__controllers.splice(this.__controllers.indexOf(e),1);var t=this;U["default"].defer(function(){t.onResize()})},destroy:function(){this.autoPlace&&ee.removeChild(this.domElement),z["default"].unbind(window,"keydown",oe._keydownHandler,!1),z["default"].unbind(window,"resize",this.__resizeHandler),this.saveToLocalStorageIfPossible&&z["default"].unbind(window,"unload",this.saveToLocalStorageIfPossible)},addFolder:function(e){if(void 0!==this.__folders[e])throw new Error('You already have a folder in this GUI by the name "'+e+'"');var t={name:e,parent:this};t.autoPlace=this.autoPlace,this.load&&this.load.folders&&this.load.folders[e]&&(t.closed=this.load.folders[e].closed,t.load=this.load.folders[e]);var n=new oe(t);this.__folders[e]=n;var o=i(this,n.domElement);return z["default"].addClass(o,"folder"),n},open:function(){this.closed=!1},close:function(){this.closed=!0},onResize:function(){var e=this.getRoot();if(e.scrollable){var t=z["default"].getOffset(e.__ul).top,n=0;U["default"].each(e.__ul.childNodes,function(t){e.autoPlace&&t===e.__save_row||(n+=z["default"].getHeight(t))}),window.innerHeight-t-W<n?(z["default"].addClass(e.domElement,oe.CLASS_TOO_TALL),e.__ul.style.height=window.innerHeight-t-W+"px"):(z["default"].removeClass(e.domElement,oe.CLASS_TOO_TALL),e.__ul.style.height="auto")}e.__resize_handle&&U["default"].defer(function(){e.__resize_handle.style.height=e.__ul.offsetHeight+"px"}),e.__closeButton&&(e.__closeButton.style.width=e.width+"px")},onResizeDebounced:U["default"].debounce(function(){this.onResize()},200),remember:function(){if(U["default"].isUndefined(Z)&&(Z=new F["default"],Z.domElement.innerHTML=x["default"]),this.parent)throw new Error("You can only call remember on a top level GUI.");var e=this;U["default"].each(Array.prototype.slice.call(arguments),function(t){0===e.__rememberedObjects.length&&f(e),e.__rememberedObjects.indexOf(t)===-1&&e.__rememberedObjects.push(t)}),this.autoPlace&&p(this,this.width)},getRoot:function(){for(var e=this;e.parent;)e=e.parent;return e},getSaveObject:function(){var e=this.load;return e.closed=this.closed,this.__rememberedObjects.length>0&&(e.preset=this.preset,e.remembered||(e.remembered={}),e.remembered[this.preset]=h(this)),e.folders={},U["default"].each(this.__folders,function(t,n){e.folders[n]=t.getSaveObject()}),e},save:function(){this.load.remembered||(this.load.remembered={}),this.load.remembered[this.preset]=h(this),r(this,!1),this.saveToLocalStorageIfPossible()},saveAs:function(e){this.load.remembered||(this.load.remembered={},this.load.remembered[Q]=h(this,!0)),this.load.remembered[e]=h(this),this.preset=e,d(this,e,!0),this.saveToLocalStorageIfPossible()},revert:function(e){U["default"].each(this.__controllers,function(t){this.getRoot().load.remembered?l(e||this.getRoot(),t):t.setValue(t.initialValue),t.__onFinishChange&&t.__onFinishChange.call(t,t.getValue())},this),U["default"].each(this.__folders,function(e){e.revert(e)}),e||r(this.getRoot(),!1)},listen:function(e){var t=0===this.__listening.length;this.__listening.push(e),t&&b(this.__listening)},updateDisplay:function(){U["default"].each(this.__controllers,function(e){e.updateDisplay()}),U["default"].each(this.__folders,function(e){e.updateDisplay()})}}),e.exports=oe},function(e,t){"use strict";e.exports={load:function(e,t){var n=t||document,o=n.createElement("link");o.type="text/css",o.rel="stylesheet",o.href=e,n.getElementsByTagName("head")[0].appendChild(o)},inject:function(e,t){var n=t||document,o=document.createElement("style");o.type="text/css",o.innerHTML=e;var i=n.getElementsByTagName("head")[0];try{i.appendChild(o)}catch(r){}}}},function(e,t){e.exports="<div id=dg-save class=\"dg dialogue\"> Here's the new load parameter for your <code>GUI</code>'s constructor: <textarea id=dg-new-constructor></textarea> <div id=dg-save-locally> <input id=dg-local-storage type=checkbox /> Automatically save values to <code>localStorage</code> on exit. <div id=dg-local-explain>The values saved to <code>localStorage</code> will override those passed to <code>dat.GUI</code>'s constructor. This makes it easier to work incrementally, but <code>localStorage</code> is fragile, and your friends may not see the same values you do. </div> </div> </div>"},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}t.__esModule=!0;var i=n(10),r=o(i),a=n(13),l=o(a),s=n(14),u=o(s),d=n(11),c=o(d),f=n(15),_=o(f),p=n(8),h=o(p),m=n(5),b=o(m),g=function(e,t){var n=e[t];return b["default"].isArray(arguments[2])||b["default"].isObject(arguments[2])?new r["default"](e,t,arguments[2]):b["default"].isNumber(n)?b["default"].isNumber(arguments[2])&&b["default"].isNumber(arguments[3])?b["default"].isNumber(arguments[4])?new u["default"](e,t,arguments[2],arguments[3],arguments[4]):new u["default"](e,t,arguments[2],arguments[3]):b["default"].isNumber(arguments[4])?new l["default"](e,t,{min:arguments[2],max:arguments[3],step:arguments[4]}):new l["default"](e,t,{min:arguments[2],max:arguments[3]}):b["default"].isString(n)?new c["default"](e,t):b["default"].isFunction(n)?new _["default"](e,t,""):b["default"].isBoolean(n)?new h["default"](e,t):null};t["default"]=g},function(e,t){"use strict";function n(e){setTimeout(e,1e3/60)}t.__esModule=!0,t["default"]=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||n},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}t.__esModule=!0;var r=n(9),a=o(r),l=n(5),s=o(l),u=function(){function e(){i(this,e),this.backgroundElement=document.createElement("div"),s["default"].extend(this.backgroundElement.style,{backgroundColor:"rgba(0,0,0,0.8)",top:0,left:0,display:"none",zIndex:"1000",opacity:0,WebkitTransition:"opacity 0.2s linear",transition:"opacity 0.2s linear"}),a["default"].makeFullscreen(this.backgroundElement),this.backgroundElement.style.position="fixed",this.domElement=document.createElement("div"),s["default"].extend(this.domElement.style,{position:"fixed",display:"none",zIndex:"1001",opacity:0,WebkitTransition:"-webkit-transform 0.2s ease-out, opacity 0.2s linear",transition:"transform 0.2s ease-out, opacity 0.2s linear"}),document.body.appendChild(this.backgroundElement),document.body.appendChild(this.domElement);var t=this;a["default"].bind(this.backgroundElement,"click",function(){t.hide()})}return e.prototype.show=function(){var e=this;this.backgroundElement.style.display="block",this.domElement.style.display="block",this.domElement.style.opacity=0,this.domElement.style.webkitTransform="scale(1.1)",this.layout(),s["default"].defer(function(){e.backgroundElement.style.opacity=1,e.domElement.style.opacity=1,e.domElement.style.webkitTransform="scale(1)"})},e.prototype.hide=function t(){var e=this,t=function n(){e.domElement.style.display="none",e.backgroundElement.style.display="none",a["default"].unbind(e.domElement,"webkitTransitionEnd",n),a["default"].unbind(e.domElement,"transitionend",n),a["default"].unbind(e.domElement,"oTransitionEnd",n)};a["default"].bind(this.domElement,"webkitTransitionEnd",t),a["default"].bind(this.domElement,"transitionend",t),a["default"].bind(this.domElement,"oTransitionEnd",t),this.backgroundElement.style.opacity=0,this.domElement.style.opacity=0,this.domElement.style.webkitTransform="scale(1.1)"},e.prototype.layout=function(){this.domElement.style.left=window.innerWidth/2-a["default"].getWidth(this.domElement)/2+"px",this.domElement.style.top=window.innerHeight/2-a["default"].getHeight(this.domElement)/2+"px"},e}();t["default"]=u},function(e,t,n){t=e.exports=n(24)(),t.push([e.id,".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity .1s linear;transition:opacity .1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1!important}.dg.main .close-button.drag,.dg.main:hover .close-button{opacity:1}.dg.main .close-button{-webkit-transition:opacity .1s linear;transition:opacity .1s linear;border:0;position:absolute;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-x:hidden}.dg.a.has-save>ul{margin-top:27px}.dg.a.has-save>ul.closed{margin-top:0}.dg.a .save-row{position:fixed;top:0;z-index:1002}.dg li{-webkit-transition:height .1s ease-out;transition:height .1s ease-out}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;overflow:hidden;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid transparent}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li>*{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:9px}.dg .c select{margin-top:5px}.dg .cr.boolean,.dg .cr.boolean *,.dg .cr.function,.dg .cr.function *,.dg .cr.function .property-name{cursor:pointer}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco,monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px Lucida Grande,sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid hsla(0,0%,100%,.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.color{border-left:3px solid}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2fa1d6}.dg .cr.number input[type=text]{color:#2fa1d6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.boolean:hover,.dg .cr.function:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2fa1d6;max-width:100%}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}",""])},function(e,t){e.exports=function(){var e=[];return e.toString=function(){for(var e=[],t=0;t<this.length;t++){var n=this[t];n[2]?e.push("@media "+n[2]+"{"+n[1]+"}"):e.push(n[1])}return e.join("")},e.i=function(t,n){"string"==typeof t&&(t=[[null,t,""]]);for(var o={},i=0;i<this.length;i++){var r=this[i][0];"number"==typeof r&&(o[r]=!0)}for(i=0;i<t.length;i++){var a=t[i];"number"==typeof a[0]&&o[a[0]]||(n&&!a[2]?a[2]=n:n&&(a[2]="("+a[2]+") and ("+n+")"),e.push(a))}},e}}])});

// CameraController.js
var CameraController = pc.createScript('cameraController');

CameraController.attributes.add('Sphere', {
    type: 'entity'

});

CameraController.attributes.add('offset', {
    type: 'vec3'
});

CameraController.attributes.add('smootheningPower', {
    type: 'number',
    default: 0.97
});


CameraController.prototype.initialize = function () {
    if (this.Sphere) {
        this.offset = this.entity.getPosition().clone().sub(this.Sphere.getPosition());
    }
};

CameraController.prototype.postUpdate = function (dt) {
    // if (this.Sphere) {
    //     this.entity.setPosition(this.Sphere.getPosition().add(this.offset));
    // }
    if (this.Sphere) {
        const currentPosition = this.entity.getPosition();
        const targetPosition = this.Sphere.getPosition().clone().add(this.offset);
        currentPosition.lerp(currentPosition, targetPosition, 1 - Math.pow(1 - this.smootheningPower, dt));
        this.entity.setPosition(currentPosition);
    }
};

// update code called every frame
CameraController.prototype.update = function (dt) {
    if (window.famobi && window.famobi.localStorage.getItem('SoundCheck') == 1) {    Apicontroller.setGameVolume(1); }
    if (window.famobi && window.famobi.localStorage.getItem('SoundCheck') == 0) {    Apicontroller.setGameVolume(0); }
};


// triggerPlane.js
var TriggerPlane = pc.createScript('triggerPlane');

TriggerPlane.prototype.initialize = function () {
    this.entity.collision.on('triggerenter', this.onTriggerEnter, this);

    this.sphere = this.app.root.findByName('Player');

};

TriggerPlane.prototype.update = function (dt) {

};


TriggerPlane.prototype.onTriggerEnter = function (triggerEntity) {
    if(window.famobi.localStorage.getItem('highScore')){
        this.bigs = window.famobi.localStorage.getItem('highScore');
    }else{
        this.bigs = 0;
    }

    if (triggerEntity.tags.has('player')) {
        triggerEntity.script.controller.count++;
        triggerEntity.script.controller.countText.element.text = + triggerEntity.script.controller.count;

        if(triggerEntity.script.controller.speed<=100){
             triggerEntity.script.controller.speed+= 0.1;
        }
        setTimeout(() => {
            this.entity.destroy();
        }, 0);
    }
};

// triggerEngel.js
var TriggerEngel = pc.createScript('triggerEngel');

TriggerEngel.prototype.initialize = function () {
    this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
    this.anim = this.app.root.findByName('patlama');
    this.sphere = this.app.root.findByName('Player');
    this.yonlendir = this.app.root.findByName('yandiarayuz');
    this.t = pc.app.root.findByName('play');
    this.y = pc.app.root.findByName('paused');
    this.ust = this.app.root.findByName('usttext');
    this.bigscore = this.app.root.findByName('enbuyuk');
    this.sahneyol = this.app.root.findByName('yol');
    this.sahnebar = this.app.root.findByName('ProgressBar');
    this.boots = this.app.root.findByName('Boosts');
    this.bigs = 0;
    this.magtext = this.app.root.findByName('zamantext');
    this.rep = this.app.root.findByName('rep');

};

TriggerEngel.prototype.update = function (dt) {};



TriggerEngel.prototype.onTriggerEnter = function (triggerEntity) {
    if(this.sphere.script.controller.kontrol == 1){
        if (triggerEntity.tags.has('player')) {
            this.sphere.sound.play('blup');
        }}

    if(this.sphere.script.controller.kontrol == 0){
    //triggerEntity.script.controller.timescore.element.text = Math.round(triggerEntity.script.controller.count * triggerEntity.script.controller.sure);
    this.anim.setPosition(this.sphere.getPosition());
    this.anim.particlesystem.play();
    this.anim.sound.play('patpat');
    this.sahneyol.enabled=false;
    this.sahnebar.enabled=false;
    this.boots.enabled=false;
    this.rep.enabled=false;
    if(this.magtext){this.magtext.enabled = false;}
    if (triggerEntity.tags.has('player')) {
        this.sphere.script.controller.gameOver();
        this.app.timeScale = 0;
        Apicontroller.setGameVolume(0);
        //window.famobi.localStorage.setItem('SoundCheck',0);
        if(window.famobi.localStorage.getItem('highScore')){    this.bigs = window.famobi.localStorage.getItem('highScore');    }else{  this.bigs = 0;  }

        if(this.bigs < Math.floor(this.sphere.script.controller.metres)){
           if(isForcedMode()) {window.famobi.localStorage.setItem('highScore', Math.floor(this.sphere.script.controller.metres));}}

        this.t.enabled = false;
        this.y.enabled = false;

        this.ust.element.text = Math.floor(this.sphere.script.controller.metres) + "m";
        if(this.bigs <=  Math.floor(this.sphere.script.controller.metres)){
                this.bigs =  Math.floor(this.sphere.script.controller.metres);
                this.bigscore.element.text = this.bigs + "m";
            }else
            {this.bigscore.element.text = this.bigs + "m"; }
        this.yonlendir.enabled = true;
            setTimeout(() => {   this.rep.enabled=true;   }, 2000);

        /*famobi_analytics.trackEvent("EVENT_TOTALSCORE", { "totalScore": Math.floor(this.sphere.script.controller.metres) }),
        window.famobi_analytics.trackEvent("EVENT_LEVELFAIL",{levelName: '',reason: 'dead'}),
        window.famobi_analytics.trackEvent("EVENT_CUSTOM", {eventName: "LEVELEND", result: "fail", score: Math.floor(this.sphere.script.controller.metres)});*/
        window.famobi.showInterstitialAd();


        /*const onLevelFailed = () => {        famobi.log('Level fail reported ');};
        setTimeout(() => {Promise.all([
            window.famobi_analytics.trackEvent(
                "EVENT_LEVELFAIL",
                {
                    levelName: '',
                    reason: 'dead'
                }
            ),
            famobi_analytics.trackEvent("EVENT_TOTALSCORE", { "totalScore": Math.floor(this.metres) }),

        ]).then(() => onLevelFailed(), () => onLevelFailed());}, 2000);
        this.rep.enabled=false;
        setTimeout(() => {this.rep.enabled=true;}, 2500);
        window.famobi.showInterstitialAd();

        Apicontroller.handleLevelEndEvent("fail", 0, () => {
            if (isForcedMode()) {
                this.app.timeScale = 0;
            } else {
                submitLevelStats();
            }
        });*/

        this.entity.destroy();
    }} else if(this.sphere.script.controller.kontrol == 1){
        this.entity.destroy();
    }
};

// explode.js
var Explode = pc.createScript('explode');

// initialize code called once per entity
Explode.prototype.initialize = function() {
    // Find all the entity references we need for the effect as a whole
    this.light = this.entity.findByName("PointLight");
    this.mainVfx = this.entity.particlesystem;
    this.smokeVfx = this.entity.findByName("ExplosionSmoke").particlesystem;
    this.derbisVfx = this.entity.findByName("ExplosionDebris").particlesystem;

    this.timeSinceEnabled = 0;
    this.explosionInterval = 3;

    // For the demo, explode every 3.1 secs
    var self = this;
    setInterval(function () {
        self.explode();
    }, 3100);
};


// update code called every frame
Explode.prototype.update = function(dt) {
    this.timeSinceEnabled += dt;
    if (this.timeSinceEnabled > 0.5) {
        if (this.light.enabled) {
            this.light.enabled = false;
        }
    }
};


Explode.prototype.explode = function () {
    this.timeSinceEnabled = 0;
    this.light.enabled = true;

    this.mainVfx.reset();
    this.mainVfx.play();

    this.smokeVfx.reset();
    this.smokeVfx.play();

    this.derbisVfx.reset();
    this.derbisVfx.play();

    this.entity.sound.play('vfx');

    this.app.fire("camera:shake");
};

// first-person-movement.js
var FirstPersonMovement = pc.createScript('firstPersonMovement');

FirstPersonMovement.attributes.add('camera', {
    type: 'entity',
    description: 'Optional, assign a camera entity, otherwise one is created'
});

FirstPersonMovement.attributes.add('power', {
    type: 'number',
    default: 2500,
    description: 'Adjusts the speed of player movement'
});

FirstPersonMovement.attributes.add('lookSpeed', {
    type: 'number',
    default: 0.25,
    description: 'Adjusts the sensitivity of looking'
});

// initialize code called once per entity
FirstPersonMovement.prototype.initialize = function() {
    this.force = new pc.Vec3();
    this.eulers = new pc.Vec3();

    var app = this.app;

    // Listen for mouse move events
    app.mouse.on("mousemove", this._onMouseMove, this);

    // when the mouse is clicked hide the cursor
    app.mouse.on("mousedown", function () {
        app.mouse.enablePointerLock();
    }, this);

    // Check for required components
    if (!this.entity.collision) {
        console.error("First Person Movement script needs to have a 'collision' component");
    }

    if (!this.entity.rigidbody || this.entity.rigidbody.type !== pc.BODYTYPE_DYNAMIC) {
        console.error("First Person Movement script needs to have a DYNAMIC 'rigidbody' component");
    }
};

// update code called every frame
FirstPersonMovement.prototype.update = function(dt) {
    // If a camera isn't assigned from the Editor, create one
    if (!this.camera) {
        this._createCamera();
    }

    var force = this.force;
    var app = this.app;

    // Get camera directions to determine movement directions
    var forward = this.camera.forward;
    var right = this.camera.right;


    // movement
    var x = 0;
    var z = 0;

    // Use W-A-S-D keys to move player
    // Check for key presses
    if (app.keyboard.isPressed(pc.KEY_A) || app.keyboard.isPressed(pc.KEY_Q)) {
        x -= right.x;
        z -= right.z;
    }

    if (app.keyboard.isPressed(pc.KEY_D)) {
        x += right.x;
        z += right.z;
    }

    if (app.keyboard.isPressed(pc.KEY_W)) {
        x += forward.x;
        z += forward.z;
    }

    if (app.keyboard.isPressed(pc.KEY_S)) {
        x -= forward.x;
        z -= forward.z;
    }

    // use direction from keypresses to apply a force to the character
    if (x !== 0 && z !== 0) {
        force.set(x, 0, z).normalize().scale(this.power);
        this.entity.rigidbody.applyForce(force);
    }

    // update camera angle from mouse events
    this.camera.setLocalEulerAngles(this.eulers.y, this.eulers.x, 0);
};

FirstPersonMovement.prototype._onMouseMove = function (e) {
    // If pointer is disabled
    // If the left mouse button is down update the camera from mouse movement
    if (pc.Mouse.isPointerLocked() || e.buttons[0]) {
        this.eulers.x -= this.lookSpeed * e.dx;
        this.eulers.y -= this.lookSpeed * e.dy;
    }
};

FirstPersonMovement.prototype._createCamera = function () {
    // If user hasn't assigned a camera, create a new one
    this.camera = new pc.Entity();
    this.camera.setName("First Person Camera");
    this.camera.addComponent("camera");
    this.entity.addChild(this.camera);
    this.camera.translateLocal(0, 0.5, 0);
};

// triggerCoin.js
var TriggerCoin = pc.createScript('triggerCoin');

TriggerCoin.prototype.initialize = function () {
    this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
    this.sphere = pc.app.root.findByName('Player');
    this.progres = this.app.root.findByName('ProgressBar');

};

TriggerCoin.prototype.postUpdate = function (dt) {
    this.player = this.player || this.app.root.findByName('Player');
    this.tempPosition = this.tempPosition || new pc.Vec3();
    this.tempPosition.copy(this.entity.getPosition());
    const playerPosition = this.player.getPosition();
    const distance = this.tempPosition.distance(playerPosition);

    if(this.sphere.script.controller.magnetkontrol == 1){
    if (distance < 20) {
        this.tempPosition.lerp(this.tempPosition, playerPosition,0.4);
        this.entity.setPosition(this.tempPosition);
        if (playerPosition.x < this.tempPosition.x && distance < 6) { //coin is behind player - so we just collect it
            this.onTriggerEnter(this.player);
        }
    }}
};

TriggerCoin.prototype.onTriggerEnter = function (triggerEntity) {

    if (triggerEntity.tags.has('player')) {
        //if (this.progres.script.progressBar.increase == true) {
            if(this.sphere.script.controller.progressBarProgress <= 1 && this.sphere.script.controller.boostcontrol == 0){
                this.sphere.script.controller.progressBarProgress += 0.02;
                //this.progres.script.progressBar.setProgress(this.progres.script.progressBar.progress + 0.02);
            }

        //}
        this.sphere.sound.play('goldsound');
        //triggerEntity.script.controller.gold++;
        //triggerEntity.script.controller.goldText.element.text = triggerEntity.script.controller.gold;
        this.entity.destroy();
        Apicontroller.trackStats("coin_collected");
    }
};

// triggerhiz.js
var Triggerhiz = pc.createScript('triggerhiz');

Triggerhiz.prototype.initialize = function () {
    this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
    this.sphere = this.app.root.findByName('Player');

};

Triggerhiz.prototype.update = function (dt) {

};


Triggerhiz.prototype.onTriggerEnter = function (triggerEntity) {

    if (triggerEntity.tags.has('player')) {
        this.sphere.sound.play('fast');
        this.sphere.script.controller.part.particlesystem.reset();
        triggerEntity.script.controller.speed+= 70;
        setTimeout(() => {
            triggerEntity.script.controller.speed-= 70;
        }, 1000);
        //this.entity.destroy();
    }
};

// rotate.js
var Rotate = pc.createScript('rotate');

// initialize code called once per entity
Rotate.prototype.initialize = function() {

};

// update code called every frame
Rotate.prototype.update = function(dt) {
    this.entity.rotate(new pc.Vec3(0,180,0).scale(dt));
};


// advertising.js
var Gamegame = pc.createScript('gamegame');

// initialize code called once per entity
Gamegame.prototype.initialize = function() {
     this.sphere = this.app.root.findByName('Player');
     this.entity.element.on("mouseente",this.onEnter,this);
    this.entity.element.on("mousedown",this.onPress,this);
    this.entity.element.on("mouseup",this.onRelease,this);
    this.entity.element.on("mouseleave",this.onLeave,this);


    this.entity.element.on("touchstart",this.onPress,this);
    this.entity.element.on("touchend",this.onRelease,this);


};

// update code called every frame
Gamegame.prototype.update = function(dt) {

};
Gamegame.prototype.onPress = function(event) {

};

// rotategold.js
var Rotategold = pc.createScript('rotategold');

Rotategold.prototype.initialize = function() {

};

// update code called every frame
Rotategold.prototype.update = function(dt) {
    this.entity.rotate(new pc.Vec3(0,360,0).scale(dt));
};


// soundon.js
var Soundon = pc.createScript('soundon');

// initialize code called once per entity
Soundon.prototype.initialize = function () {
    this.entity.element.on("mouseente", this.onEnter, this);
    this.entity.element.on("mousedown", this.onPress, this);
    this.entity.element.on("mouseup", this.onRelease, this);
    this.entity.element.on("mouseleave", this.onLeave, this);

    this.entity.element.on("touchstart", this.onPress, this);
    this.entity.element.on("onStart", this.onPress, this);
    this.entity.element.on("touchend", this.onRelease, this);
    this.t = this.app.root.findByName('soundon');
    this.y = this.app.root.findByName('soundoff');

};

// update code called every frame
Soundon.prototype.update = function (dt) {
    if (window.famobi.localStorage.getItem('SoundCheck') == 0) {
        this.t.enabled = true;
        this.y.enabled = false;
        Apicontroller.setGameVolume(0);
    }
};

Soundon.prototype.onPress = function (event) {
    this.soundcheck = window.famobi.localStorage.setItem('SoundCheck', 0);
    if (this.y.enabled) {
        setTimeout(() => {
            this.t.enabled = true;
            this.y.enabled = false;
            Apicontroller.setGameVolume(0);
            window.famobi_analytics.trackEvent("EVENT_VOLUMECHANGE", { bgmVolume: 0, sfxVolume: 0 });
        }, 100);
    }
};

Soundon.prototype.onRelease = function () { };


// progress-bar.js
var ProgressBar = pc.createScript('progressBar');

// The entity that shows the fill image
ProgressBar.attributes.add('progressImage', {type: 'entity'});
// The maximum width of the fill image
ProgressBar.attributes.add('progressImageMaxWidth', {type: 'number'});

ProgressBar.prototype.initialize = function() {
    this.sphere = this.app.root.findByName('Player');


    // initialize progress to 0
    this.setProgress(0);
    // if true the progress bar will increase
    // otherwise it will decrease in update
    this.increase = true;
};

// Set progress - value is between 0 and 1
ProgressBar.prototype.setProgress = function (value) {
    // clamp value between 0 and 1
    value = pc.math.clamp(value, 0, 1);

    this.progress = value;

    // find the desired width of our progress fill image
    var width = pc.math.lerp(0, this.progressImageMaxWidth, value);
    // set the width of the fill image element
    this.progressImage.element.width = width;

    // Set the width of the element's rect (rect.z) to be the same
    // value as our 0-1 progress.
    // This is so that the fill image will only show the portion
    // of the texture that is visible
    this.progressImage.element.rect.z = value;
    // force rect update
    this.progressImage.element.rect = this.progressImage.element.rect;
};

// Increase or decrease the progress automatically
ProgressBar.prototype.update = function(dt) {

    if (this.progress >= 1){    this.increase = false;  }
};


// pdestroy.js
var Pdestroy = pc.createScript('pdestroy');

// initialize code called once per entity
Pdestroy.prototype.initialize = function() {
     this.entity.collision.on('triggerenter', this.onTriggerEnter, this);

};

// update code called every frame
Pdestroy.prototype.update = function(dt) {

};
Pdestroy.prototype.onTriggerEnter = function (triggerEntity) {
    if (triggerEntity.tags.has('player')) {
        setTimeout(() => {
            this.entity.destroy();
        }, 0);
    }
};


// MagnetSphere.js
var MagnetSphere = pc.createScript('magnetSphere');

// initialize code called once per entity
MagnetSphere.prototype.initialize = function() {
    this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
    this.sphere = this.app.root.findByName('Player');
    this.progres = this.app.root.findByName('ProgressBar');
    this.sayac = this.app.root.findByName('zamantext');

};
MagnetSphere.prototype.onTriggerEnter = function (triggerEntity) {

    if (triggerEntity.tags.has('player')) {
       // if(this.progres.script.progressBar.increase == true){
            this.sphere.script.controller.magtime = 5;
            this.sphere.script.controller.magnetkontrol = 1;
            this.sayac.enabled = true;
       // }
        this.entity.destroy();
        Apicontroller.trackStats("magnet_collected");
    }
};

// switching-materials.js
// More information about materials: http://developer.playcanvas.com/en/tutorials/beginner/basic-materials/
var SwitchingMaterials = pc.createScript('switchingMaterials');

// Create an array of materials to cycle the model through
SwitchingMaterials.attributes.add("materials", {type: "asset", assetType: "material", array: true, title: "Materials"});

// initialize code called once per entity
SwitchingMaterials.prototype.initialize = function() {
    var self = this;
    this.sphere = this.app.root.findByName('Player');
    this.materialIndex = 0;

    // Change materials every second
    var handle = setInterval(function () {
        self.changeToNextMaterial();
    }, 1);

    this.on('destroy', function() {
        clearInterval(handle);
    }, this);
};


SwitchingMaterials.prototype.changeToNextMaterial = function(dt) {
    var i = 0;

    // Get the next material asset in the array
    if(this.sphere.script.controller.metres > 0 && this.sphere.script.controller.metres <= 400){
       this.materialIndex = 0;
    }else if (this.sphere.script.controller.metres > 400 && this.sphere.script.controller.metres <= 800){
       this.materialIndex = 1;
    }else if (this.sphere.script.controller.metres > 800 && this.sphere.script.controller.metres < 1200){
       this.materialIndex = 2;
    }else if (this.sphere.script.controller.metres > 1200 && this.sphere.script.controller.metres < 1400){
       this.materialIndex = 0;
    }else if (this.sphere.script.controller.metres > 1400 && this.sphere.script.controller.metres < 1800){
       this.materialIndex = 1;
    }else if (this.sphere.script.controller.metres > 1800 && this.sphere.script.controller.metres < 2200){
       this.materialIndex = 2;
    }else if (this.sphere.script.controller.metres > 2200 && this.sphere.script.controller.metres < 2600){
       this.materialIndex = 0;
    }else if (this.sphere.script.controller.metres > 2600 && this.sphere.script.controller.metres < 3000){
       this.materialIndex = 1;
    }else if (this.sphere.script.controller.metres > 3200 && this.sphere.script.controller.metres < 3600){
       this.materialIndex = 2;
    }else if (this.sphere.script.controller.metres > 3600 && this.sphere.script.controller.metres < 4000){
       this.materialIndex = 0;
    }else if (this.sphere.script.controller.metres > 4000 && this.sphere.script.controller.metres < 4400){
       this.materialIndex = 1;
    }else if (this.sphere.script.controller.metres > 4400 && this.sphere.script.controller.metres < 4800){
       this.materialIndex = 2;
    }else if (this.sphere.script.controller.metres > 4800 && this.sphere.script.controller.metres < 5200){
       this.materialIndex = 0;
    }else if (this.sphere.script.controller.metres > 5200 && this.sphere.script.controller.metres < 5600){
       this.materialIndex = 1;
    }else if (this.sphere.script.controller.metres > 5600 && this.sphere.script.controller.metres < 6000){
       this.materialIndex = 2;
    }else{
         this.materialIndex = 1;
    }

    var material = this.materials[this.materialIndex];

    // Assign the material to all the mesh instances in the model
    var allMeshInstances = [];
    var renders = this.entity.findComponents('render');

    for (i = 0; i < renders.length; ++i) {
        var meshInstances = renders[i].meshInstances;
        for (var j = 0; j < meshInstances.length; j++) {
            allMeshInstances.push(meshInstances[j]);
        }
    }
    for (i = 0; i < allMeshInstances.length; ++i) {
        var mesh = allMeshInstances[i];
        mesh.material = material.resource;
    }
};


// magnetscript.js
var Magnetscript = pc.createScript('magnetscript');

// initialize code called once per entity
Magnetscript.prototype.initialize = function() {

};

// update code called every frame
Magnetscript.prototype.update = function(dt) {
    this.entity.rotate(new pc.Vec3(90   ,0,45).scale(dt));
};


// rotatae.js
var Rotatae = pc.createScript('rotatae');
// initialize code called once per entity
Rotatae.prototype.initialize = function() {

};

// update code called every frame
Rotatae.prototype.update = function(dt) {
    this.entity.rotate(new pc.Vec3(0,360,0).scale(dt));
};


// Play.js
var Play = pc.createScript('play');

Play.prototype.initialize = function() {
    this.entity.element.on("mouseente",this.onEnter,this);
    this.entity.element.on("mousedown",this.onPress,this);
    this.entity.element.on("mouseup",this.onRelease,this);
    this.entity.element.on("mouseleave",this.onLeave,this);

    this.entity.element.on("touchstart",this.onPress,this);
    this.entity.element.on("onStart",this.onPress,this);
    this.entity.element.on("touchend",this.onRelease,this);
};


// update code called every frame
PausePlay.prototype.update = function(dt) {

};
// update code called every frame
Play.prototype.update = function(dt) {

};

Play.prototype.onPress = function(event) {
        var t = pc.app.root.findByName('play');
        var y = pc.app.root.findByName('paused');
        var replay = pc.app.root.findByName('replay');
        var soundonoff = pc.app.root.findByName('Sound');
        window.famobi_analytics.trackEvent("EVENT_RESUME");


            this.app.timeScale = 1;
            t.enabled = false;
            replay.enabled=false;
            soundonoff.enabled=false;
            y.enabled=true;
};

// basicButtonon.js
var BasicButtonon = pc.createScript('basicButtonon');


BasicButtonon.attributes.add('applyScalingTween', {
    title: "Apply scaling tween",
    type: 'boolean',
    default: true
});

BasicButtonon.attributes.add('defaultScale', {
    title: "Default scale",
    type: 'number',
    default: 1,
    min: 0.5,
    max: 1.5
});

BasicButtonon.attributes.add('hoverScale', {
    title: "Hover scale",
    type: 'number',
    default: 1.1,
    min: 0.5,
    max: 1.5
});

BasicButtonon.attributes.add('pressedScale', {
    title: "Pressed scale",
    type: 'number',
    default: 0.97,
    min: 0.5,
    max: 1.5
});

BasicButtonon.attributes.add('upScaleDuration', {
    title: "Tween duration",
    type: 'number',
    default: 0.085,
    min: 0.005,
    max: 1
});

BasicButtonon.attributes.add('clickSound', {
    title: "Play sound",
    type: 'boolean',
    default: true
});

BasicButtonon.prototype.initialize = function() {


    // Whether the element is currently hovered or not
    this.hovered = false;

    if(pc.platform.mobile && this.app.touch) {
        this.entity.element.on('touchstart', this.onPress, this);
        this.entity.element.on('touchend', this.onRelease, this);
    } else {
        this.entity.element.on('mouseenter', this.onEnter, this);
        this.entity.element.on('mousedown', this.onPress, this);
        this.entity.element.on('mouseup', this.onRelease, this);
        this.entity.element.on('mouseleave', this.onLeave, this);
    }
};


// When the cursor enters the element assign the hovered texture
BasicButtonon.prototype.onEnter = function (event) {
    this.hovered = true;

    if(this.applyScalingTween) {
        event.element.entity.tween(event.element.entity.getLocalScale())
            .to(new pc.Vec3(this.defaultScale * this.hoverScale, this.defaultScale * this.hoverScale, this.defaultScale * this.hoverScale), this.upScaleDuration, pc.Linear)
            .start();
    }
    document.body.style.cursor = 'pointer';
};

BasicButtonon.prototype.onLeave = function (event) {
    this.hovered = false;

    if(this.applyScalingTween) {
         event.element.entity.tween(event.element.entity.getLocalScale())
            .to(new pc.Vec3(this.defaultScale, this.defaultScale, this.defaultScale), this.upScaleDuration, pc.Linear)
            .start();
    }


    document.body.style.cursor = 'default';
};

// When we press the element assign the active texture
BasicButtonon.prototype.onPress = function (event) {
    this.app.systems.sound.volume = 0;

    event.stopPropagation();

    if(this.applyScalingTween) {
        event.element.entity.tween(event.element.entity.getLocalScale())
            .to(new pc.Vec3(this.defaultScale * this.pressedScale, this.defaultScale * this.pressedScale, this.defaultScale * this.pressedScale), this.upScaleDuration * 0.5, pc.SineOut)
            .start();
    }
 };

BasicButtonon.prototype.onRelease = function (event) {
    if(this.applyScalingTween) {
         if(this.hovered) {
         event.element.entity.tween(event.element.entity.getLocalScale())
            .to(new pc.Vec3(this.defaultScale * this.hoverScale, this.defaultScale * this.hoverScale, this.defaultScale * this.hoverScale), this.upScaleDuration * 0.5, pc.Linear)
            .start();
        } else {
            event.element.entity.tween(event.element.entity.getLocalScale())
                .to(new pc.Vec3(this.defaultScale, this.defaultScale, this.defaultScale), this.upScaleDuration * 0.5, pc.Linear)
                .start();
        }
    }
};

// famobiLoadingScreen.js
pc.script.createLoadingScreen(function (app) {
    var ctx, offset, gradient, animation = undefined;
    var canvas = document.createElement('canvas');
    var progress = 0;

    var showSplash = function () {
        // splash wrapper
        var wrapper = document.createElement('div');
        wrapper.id = 'application-splash-wrapper';
        document.body.appendChild(wrapper);

        // splash
        var splash = document.createElement('div');
        splash.id = 'application-splash';
        wrapper.appendChild(splash);
        splash.style.display = 'block';

        var logo = document.createElement('img');
        logo.src = 'slopetext.png';
        logo.id = 'logo';
        splash.appendChild(logo);

        var loaderBack = document.createElement('div');
        loaderBack.id = 'loaderBack';
        splash.appendChild(loaderBack);

        var loaderBar = document.createElement('div');
        loaderBar.id = 'loaderBar';
        splash.querySelector('#loaderBack').appendChild(loaderBar);

        var loadingText = document.createElement('span');
        loadingText.innerHTML = '0%';
        loadingText.id = 'loadingText';
        splash.querySelector('#loaderBack').appendChild(loadingText);
    };



    var hideSplash = function () {
        var splash = document.getElementById('application-splash-wrapper');
        splash.parentElement.removeChild(splash);
    };

    var getCoordinate = function (pAngle) {
        pAngle -= 90;
        var x = (canvas.width / 2 - offset) * Math.cos(pAngle * Math.PI / 180) + canvas.width / 2;
        var y = (canvas.width / 2 - offset) * Math.sin(pAngle * Math.PI / 180) + canvas.width / 2;

        return { x: x, y: y };
    };

    var drawProgress = function (pProgress) {
        if (!ctx) return;
        if (animation) clearInterval(animation);
        let step = (pProgress - progress) / 10;
        animation = setInterval(() => {
            if (progress < pProgress) progress += step;
            else clearInterval(animation);
            var angle = 360 / 100 * progress;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();

            ctx.lineWidth = 10;

            var startPoint = getCoordinate(0);
            ctx.moveTo(startPoint.x, startPoint.y);
            ctx.strokeStyle = gradient;
            for (var i = 0; i < angle; i++) {
                var nextPoint = getCoordinate(i);
                ctx.lineTo(nextPoint.x, nextPoint.y);
            }
            ctx.stroke();
            ctx.beginPath();
            ctx.strokeStyle = "#c9c9c9";
            for (var j = angle; j < 360; j++) {
                var whitePoint = getCoordinate(j);
                ctx.lineTo(whitePoint.x, whitePoint.y);
            }
            ctx.stroke();
        }, 50);
    };

    var setProgress = function (value) {
        var bar = document.getElementById('loaderBar');
        var loadingText = document.getElementById('loadingText');
        if (bar) {
            value = Math.min(1, Math.max(0, value));
            const displayValue = value;
            bar.style.width = displayValue * 99 + '%';
            loadingText.innerHTML = Math.round(displayValue * 99) + '%';
            // if (window && window.famobi && window.famobi.setPreloadProgress) {
            //     if (value === 1) {
            //         window.famobi.gameReady();
            //     }
            // }
        }
        const loadingProgressValue = value * 99;
        if (typeof famobi !== "undefined" && famobi.setPreloadProgress) {
            famobi.setPreloadProgress(Math.floor(loadingProgressValue));
        }
    };



    var createCss = function () {
        var css = [
            'body {',
            '    background-color: #222222;',
            '}',

            '.hide {',
            '   opacity: 0 !important;',
            '   transition: opacity 0.35s;',
            '}',

            '#logo {',
            '   position: absolute;',
            '   top: calc(0% - 150px);',
            '   left: calc(0% - 160px);',
            '}',

            '#application-splash-wrapper {',
            '    position: absolute;',
            '    top: 0;',
            '    left: 0;',
            '    height: 100%;',
            '    width: 100%;',
            '    background-color: #1d292c;',
            '}',

            '#application-splash {',
            '    position: absolute;',
            '    width: 300px;',
            '    top: calc(50% + 15px);',
            '    left: calc(50% - 150px);',
            '}',

            '#application-splash img {',
            '    width: 200%;',
            '}',

            '#loaderBack {',
            '    height: 48px;',
            '    width: 100%;',
            '    position: absolute;',
            "    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAhsAAABXCAYAAACtIoeDAAAJ+klEQVR4nO3dPU8U7R7H8f81j4CcG86anENDYiKFCYUhYmWMmhhfgqXvgMZXQGsr78CS0oZETdDCGKMWdCaWJBQnt97Ifesu83gKuNZhdmZ252l3we8nIbs7zNPS/H/855prRAAAAAAAAAAAAAAAAAAAAAAAAAAAAICpoCZ9AiWcp3MFAKAt8aRPoKxJFHBCAwAA4zexkDKOwj/qMQghAADUN2qoGFv4aKvA5+23jeMRUgAAF1XTgSBvf60Gj3EU/6xjEBAAABifrDCRXtZa4Giy6Kuc93nHaerYBBcAwEXVRAAoGzQaDx1WQ/vJChpF4SNvWd1jAwCAcmI5qaU6ZKjE8kY0ETbS4WIgbGxsbJj37993/vjjD3NhYcE2TVN1u10lIuI4jum67tDzOD4+JlQAAH57rusODQFBEETdbtcXEZmdnY1FRL59++YdHR2Fr1698ra2tsKCzRvvbNQt4LlBY3Nz03jw4MH84uKiG8exndyobHAgaAAA8MsogaNofaWUf3h4ePzixYt/Njc3I/kVMPJea6lTxLOChrp79648efJk4fLly3M6JKTDgu/7RvKzYRiZ5+F5HiEDAIACjuNkBoIois4st2070u91+HBdN/769evPnZ2dvxOho/HAUbWYZwaN7e1t+/r1650gCEyRk5ChlFJhGJpKKZUXKkQIFgAANCEvfIicBJA4jmPTNMM4jmMdOizLCg8ODr7fu3evJy0EjioFPjNo7O7uziwvL/9bdzHCMLR83zeyAsaowcL3fQIIAAAFbNseKQhkhRDTNMMgCELXdWPXdePDw8Oj9fX1H9Jw4KgbNgaCRhAEpmVZZjpQpD+XDRIEDwAARg8XeeunQ4fjOHEQBKFlWaHruvH+/v5fqQ5H7bBhllw/HTTk6dOn1traWsf3fSOKIjsMQzMMw34w8DxPhWGofN9XURT1f9Kfh/1U/YIAAFwkZWqnrp/pz2EYKtM8iQBhGKo4jg2llBFFUdTpdGZWVla6Ozs7kQyfxmIkZTcc6Grs7e11LMuaiaLINgxD6Q6Gfk13JPI6FEEQECgAAKjJsqzMDkS6w6E/606H4zhxFEWxYRi+iHirq6t/SkPdDWP4KgP6XY3t7W370qVLrm3bVlHQ8H1f6R+9kyAIVPKnyskDAICz8upruhbr12TtNgxD2bZtua5r7+7uzpxu2q/7VZWZ1GtgCvKVlZV53/fNKIqMoqCR3KhqsGDMBgAA5cds6Lqb7Hj4vq9s2471q+d5ynGc+LSGG4ZhmJ1OZ05E9NgNTUmF7kaZMRvJZKM2NzfNmzdvLiqlrCiKlB6nocdn6C+T/LJ5Yy9GGb9R9osBAHARjTJOQ4/HyNrOMIz+Z9M0+696G9M0xbIscV1XdTqdn69fv05PY15alenKlYiotbU1N6+rIfIraBR1MuhWAADQPF1fs7ogyU5HssMhcjJuI9ndWFtbc0Wke7pp5btRRh2zMRAKlpaWHNM0B7YfNUAQNAAAaNcotTZvHdM0jaWlJSfjV6Xrd5UBoiIiMj8/byulztziqt8XdTXSA0UBAEB78upuVo1O1nKllJqfn7fT61RRdYCoMgxjxvM8lRUy8hAyAACYjKJLK/r3+ne6thuGMSODj58vfTmlbGejP0g02dVIn6zIYGIiaAAAMF10rc6r0YlaX+v218qXUYoeqgYAAM6/pmp95bCR19nIQlcDAIDpUKYmK6XUjRs3ah+zyq2vpTQVNJhlFACA/OnIy0iOzxjm06dPdQ83UmdjYkWe6cwBADir6cd9pPeRfkr7xsZGVlYoddzKnY3knSie5w0896TqfgkWAACMLms68qqy7kjZ2tqK6u636piNVgIBQQMAgGparKG191t5gGiWOuMzCBoAANRTp5a2eTNHo2GjKoIGAADNmMaaOvGwMY1/FAAAzrNpq60TDxsAAOBiazVsDLv+M23JCwCAi2JYja0xRqO1p74SCgAAQCUTu4xCVwMAgHZNS61lzAYAAGjVqGGj9qxkAADgQiidCVrtbBQ95KWJaVUBAEC+olo76oPYmsBlFAAA0KqJhg26GwAAtGOaaiydDQAA0KqqYSN2HGcgMVW5/jNNyQsAgIugSm3NquGntb52na7V2UgGjjoDTQgcAAA0o05NTdbyrKZCVY1cRkmfUJUvSuAAAKCeJupvkyGjf4wR1ollTNOV6y88LTOeAQBwHkzgH/ZSx2t9gGjVcRx0OgAAKFa1Xo5zjg2R0TobE5P+A9LxAAD8zs7rP+Jlw4b+kqrX63mGYbijbGTbdlzjUbZ95/WPDADAtCjT1ej1et7p21p3pZS5jHLmIGEYRlkr6S9BMAAAYLrpWp0XQDJqfaXaXnmejePj457jOP35NhzHiYvS0rivDwEAgLOG1elkTXccJz4+Pu7JJOfZODo6CvJ+l9fdsG27MJAAAIDmZdXfYV0NkeJaX0blR8w/f/68l7Vi3pcpWgcAALQjq+ZmNQOyts2p9aVreJlBmyqxvhIR9fnz5/+YpjnreZ7yPE+JiHiep/Rg0OSg0KI7SZoYPAoAAE4U/VOfDBp6vaxLKGEYdq9du/Y/OTs4tNJA0Sp3o/SDwf7+/o8rV67MJlfQJ+v7vkrehWJZVpwXOEbtdBBKAAC/s7pXBoYFjaT9/f0fqUWVj122eCtJdTi+fPmyJCJusrshkt/hSGLeDAAA2pN3Z2he0NBdDcMw/KtXrx7IYEejUuCoMqlXf64NEZF37979defOnf/qX+rAkZWS0qEj749ACAEAYHSjTjeRDBkiZ2u1DhqO48Rv3rz5mtis9pNfq3Q29Gv//cePHxcXFhYWkuM29Ab6fV53g0sjAAA0L++SS17Q0K/fv3//vr6+fijZ4zQqhY4qhT4zcOzt7XXm5ub+JXISMJKBQy9LfiZkAADQvnToSF95SM6Z5Xnej9XV1T+lwaAhUv1pruk7U0RE1Pv37xc6nc6iyK9wkQ4ZecsAAEA7soY2JLsZIiI5HQ39OtbLKOntBrocz549c2/dunU5iiJbpDh0AACA8UqHDMMw/Ldv33599OjR8ekqWd2MiYSN5LaZwePly5dzy8vLl0zTnBUZDBuEDwAA2pd12UTkJGQcHBz8ffv27X+kOGDUnoizbsEvChwiImpjY8N4+PDh3Ozs7IzrutbMzIwjQtgAAGAcEvNfBT9//vS63W7vw4cPvcePHwcyPGA0MuN3EwU/HTCGLWv6+AAAIFtWWIgz3g9bVovZ0H6GhQoAADB+o4aNove1NRkM0vsa9rmt8wAAAPmBIb182Ofa2ijyZS6XEDIAAGjPqIGjaN3a2iz2dDIAAJgORUGitZChjavoEy4AAJgerQeMpEmGAAIIAADtG2uwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHDe/B9Clw6PRcHjWwAAAABJRU5ErkJggg==');",
            '    background-repeat: no-repeat;',
            '    background-position: left center;',
            '    background-size: 300px 100%;',
            '}',

            '#loaderBar {',
            '    width: 0%;',
            '    height: 100%;',
            '    position: absolute;',
            "    background-image: url('data:image/png;base64,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');",
            "    background-repeat: no-repeat;",
            "    background-position: 4px 4px;",
            "    background-size: 292px calc(100% - 7px);",
            '}',

            '#loadingText {',
            '    color: white;',
            '    font-size: 25px;',
            '    font-weight: bold;',
            '    line-height: 48px;',
            '    left: 0;',
            '    right: 0;',
            '    top: 0;',
            '    bottom: 0;',
            '    margin: auto;',
            '    position: absolute;',
            '    text-align: center;',
            '    z-index: 100;',
            '}',

            '@media (max-width: 480px) {',
            '   #application-splash {',
            '   width: 180px;',
            '   left: calc(50% - 90px);',
            '   top: calc(50% - 15px);',
            '}',

            '#loaderBack {',
            '    margin: 20px auto 0 auto;',
            '    height: 30px;',
            '    background-size: 180px 100%;',
            '}',

            '#loaderBar {',
            "    background-position: 2px center;",
            "    background-size: 176px calc(100% - 4px);",
            '}',

            '#loadingText {',
            '    font-size: 16px;',
            '    line-height: 30px;',
            '    top: 0;',
            '}',

            '#logo {',
            '   position: absolute;',
            '   top: calc(80% - 90px);',
            '   left: calc(80% - 230px);',
            '}',
            '}'
        ].join("\n");

        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        document.head.appendChild(style);
    };


    /* API helpers */
    var injectForcedModeProperties = function () {
        //console.warn('Injecting forced mode properties...');
        //const forcedModePproperties = getForcedModeProperties();

        // if(forcedModePproperties.state.level) {
        //     GameplayController.currentLevel = +forcedModePproperties.state.level;
        // }

        // if(forcedModePproperties.state.sublevel) {
        //      GameplayController.currentStage = +forcedModePproperties.state.sublevel;
        // }
    };

    var doAPIHandshake = function (startGameCallback) {
        /*
        if (isExternalStart()) {
            app.timeScale = 0;
            famobi.onRequest("startGame", function () {
                app.timeScale = 1.0;
                //game.inputAllowed = true;
                if (startGameCallback) startGameCallback();
            });
        } else {
           // game.inputAllowed = true;
            if (startGameCallback) startGameCallback();
        }

        //game ready report
        famobi.gameReady();
        */
    };


    var startLevelDirectly = function () {

        setTimeout(() => doAPIHandshake(() => {
            if(window.famobi) window.famobi.log('Handshake completed, skip_title mode, start the level directly here');
        }), 0);

    };

    /* API helpers end */

    createCss();
    showSplash();

    app.on('preload:end', function () {
        app.off('preload:progress');
    });
    app.on('preload:progress', setProgress);
    // app.on('start', hideSplash);

    app.on('start', function () {
        if (window.famobi)  window.famobi.log('application is starting...');
    });

    app.on('postinitialize', function () {

        /* set global volume */
        //console.log(famobi.getVolume);
        //app.systems.sound.volume = famobi.getVolume();

        /* add global listeners */
        if(window.famobi) {
            window.famobi.onRequest("restartGame", () => {
                console.log('restartGame requseted');
                app.fire("game:restartGame");
            });

            window.famobi.onRequest("pauseGameplay", function () {
                app.timeScale = 0;
            });

            window.famobi.onRequest("resumeGameplay", function () {
                app.timeScale = 1;
            });

            /* game is loaded, send final progress to Famobi API. */
            famobi.setPreloadProgress(100);
        }

        /* inject forced mode properties if needed */
        if (isForcedMode()) {
            injectForcedModeProperties();
        }

        /* hide preloader */
        hideSplash();

        /* if running into MonkeyGames container, start the gameplay/level screen directly */
        if (skipTitleScreen()) {
            startLevelDirectly();
        } else {
            /* timeout is a must to let the game properly initialize a level */
            setTimeout(() => doAPIHandshake(() => {
                app.fire('startGameRequested');
                if(window.famobi) window.famobi.log('Handshake completed in normal gameplay mode');

                // window.famobi.playerReady(); // <<< copy that line to the point where each level is starting
            }), 0);
        }
    });
});

// Apicontroller.js
/* jshint esversion: 6 */
var Apicontroller = pc.createScript('apicontroller');
var game, isPageVisible, adIsShowing, isExternalPaused,
    isExternalMute, skipTutorial, useAutoQuality,
    isCopyrightEnabled, isEndlessMode, getForcedModeProperties, isUIHidden, isBombPowerupEnabled;
    Apicontroller._gameVolume = 1;
    Apicontroller._volumeMultiplier = 1;

    Apicontroller.setGameVolume = function (value) {
    Apicontroller._gameVolume = value;
    if (game) game.systems.sound.volume = Apicontroller._gameVolume * Apicontroller._volumeMultiplier;
    };

    Apicontroller.setVolumeMultiplier = function (value) {
    Apicontroller._volumeMultiplier = value;
    if (game) game.systems.sound.volume = Apicontroller._gameVolume * Apicontroller._volumeMultiplier;
    };

Apicontroller.prototype.initialize = function () {
    let setupGlobalVars = () => {
        Apicontroller.injectFamobiMockObject();

        if(window.famobi){ window.famobi.log('Global variables initialized');}

        isPageVisible = true;
        adIsShowing = false;

        isExternalPaused = function () {
            return typeof famobi !== "undefined" && famobi.hasFeature("external_pause");
        };

        isExternalMute = function () {
            return typeof famobi !== "undefined" && famobi.hasFeature("external_mute");
        };


        skipTutorial = function () {
            return typeof famobi !== "undefined" && famobi.hasFeature("skip_tutorial");
        };

        useAutoQuality = function () {
            return typeof famobi !== "undefined" && famobi.hasFeature("auto_quality");
        };

        isCopyrightEnabled = function () {
            return typeof famobi !== "undefined" && famobi.hasFeature("copyright");
        };

        isEndlessMode = function () {
            return isForcedMode() && getForcedModeProperties().state.endless_mode;
        };

        getForcedModeProperties = function () {
            if (!famobi || typeof famobi === "undefined") return undefined;
            window._cachedForcedModeProperties = window._cachedForcedModeProperties || famobi.getFeatureProperties("forced_mode");
            return window._cachedForcedModeProperties;
        };

        isUIHidden = function (uiKey) {
            return isForcedMode() && getForcedModeProperties() && getForcedModeProperties().override && getForcedModeProperties().override.hide_ui && getForcedModeProperties().override.hide_ui.indexOf(uiKey) !== -1;
        };

        isBombPowerupEnabled = function () {
            return !isForcedMode() || getForcedModeProperties().state.powerup_bomb;
        };


        //famobi pause/resume requests
        window.famobi_onPauseRequested = function () {
            console.warn('famobi_onPauseRequested');
            adIsShowing = true;
            if (game) {
                game.pauseGame();
            }
        };

        window.famobi_onResumeRequested = function () {
            console.warn('famobi_onResumeRequested');
            adIsShowing = false;
            if (game) {
                //game.unpauseGame();
            }
        };

        //Monkey App handlers
        if (window.famobi) {
            window.famobi.onRequest("pauseGameplay", function () {
                if (game) {
                    game.pauseGame(true);
                }
            });

            window.famobi.onRequest("resumeGameplay", function () {
                if (game) {
                    game.unpauseGame();
                }
            });


            window.famobi.onRequest("restartGame", function () {
                if (game) {
                    game.fire("famobi:restartGame");
                }
            });

            window.famobi.onRequest("enableAudio", function () {
                if (game) {
                    game.fire("famobi:enableAudio");
                    window.famobi.localStorage.setItem('SoundCheck', 1);
                    Apicontroller.setVolumeMultiplier(famobi.getVolume());
                    Apicontroller.setVolumeMultiplier(1);
                }
            });

            window.famobi.onRequest("disableAudio", function () {
                if (game) {
                    game.fire("famobi:disableAudio");
                    Apicontroller.setVolumeMultiplier(0);
                    window.famobi.localStorage.setItem('SoundCheck', 0);
                }
            });

            window.famobi.onRequest("changeVolume", function (volume) {
                if (game) {
                    Apicontroller.setVolumeMultiplier(volume);
                }
            });
        }



        //visiblity
        var hidden, visibilityChange;
        if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
            hidden = "hidden";
            visibilityChange = "visibilitychange";
        } else if (typeof document["msHidden"] !== "undefined") {
            hidden = "msHidden";
            visibilityChange = "msvisibilitychange";
        } else if (typeof document["webkitHidden"] !== "undefined") {
            hidden = "webkitHidden";
            visibilityChange = "webkitvisibilitychange";
        }

        function handleVisibilityChange() {
            if (document[hidden]) {
                isPageVisible = false;
                // if (game && !adIsShowing) game.pauseGame();
            } else {
                isPageVisible = true;
                if (game && !adIsShowing && game.applicationPaused && !game.applicationFinished && !game.ignoreVisibilityAPI) game.unpauseGame();
            }
        }

        // Warn if the browser doesn't support addEventListener or the Page Visibility API
        if (typeof document.addEventListener === "undefined" || typeof document[hidden] === "undefined") {
            console.log("Browser doesn't support the Page Visibility API.");
        } else {
            // Handle page visibility change
            document.addEventListener(visibilityChange, handleVisibilityChange, false);
        }

        if(window.famobi) window.famobi.log("Window VisibilityAPI connected");
    };

    setupGlobalVars();

    if(window.famobi) window.famobi.log('API controller initialized');
    game = this.app;

    Apicontroller.initTracking();
};

Apicontroller.prototype.update = function (dt) {

};

Apicontroller.isRewardedVideoFeatureEnabled = function () {
    return true;
};

Apicontroller.hasRewardedVideo = function () {
    if (Apicontroller.isRewardedVideoFeatureEnabled() && window.famobi && window.famobi.hasRewardedAd)
        return window.famobi.hasRewardedAd();
    else
        return false;
};


Apicontroller.showRewardedVideo = function (callback) {
    if (window.famobi && Apicontroller.hasRewardedVideo()) {
        window.famobi.rewardedAd(callback);
    } else {
        callback({ rewardGranted: false });
    }
};


Apicontroller.initTracking = function () {
    if (!window.famobi_tracking) {
        console.warn("Tracking API is not defined");
        return;
    }
    window.famobi_tracking.init('Ramp', null, 100, true, true);
};

Apicontroller.trackLevelStart = function (eventParams) {
    if (!window.famobi_tracking) {
        console.warn("TrackLevelStart: Tracking API is not defined");
        return;
    }
    window.famobi_tracking.trackEvent(famobi_tracking.EVENTS.LEVEL_START, eventParams);
};


Apicontroller.trackLevelEnd = function (eventParams) {
    if (!window.famobi_tracking) {
        console.warn("TrackLevelEnd: Tracking API is not defined");
        return;
    }
    window.famobi_tracking.trackEvent(window.famobi_tracking.EVENTS.LEVEL_END, eventParams);
};

Apicontroller.handleLevelEndEvent = function (result, score, resolveCallback) {
    if (!window.famobi) {
        resolveCallback();
        return;
    }

    game.timeScale = 0.00001;

    window.famobi_analytics.trackEvent("EVENT_CUSTOM", {
        eventName: "LEVELEND",
        result: result,
        score: score
    }).then(
        () => {
            game.timeScale = 1.0;
            resolveCallback();
        },
        () => { }
    );
};


/* Tracking stats */
Apicontroller.trackStats = function (...args) {
    if (window.famobi && window.famobi.hasFeature("trackstats") && window.famobi_analytics && window.famobi_analytics.trackStats) {
        window.famobi_analytics.trackStats(...args);
    }
};


/* Live score */
Apicontroller._sendLiveScore = function (liveScore) {
    this.lastLiveScoreReportTimestamp = new Date().getTime();
    window.famobi_analytics.trackEvent(
        "EVENT_LIVESCORE",
        {
            liveScore: liveScore
        }
    );
};

Apicontroller.reportLiveScore = function (score) {
    const currentTimestamp = new Date().getTime();
    this.lastLiveScoreReportTimestamp = this.lastLiveScoreReportTimestamp || 0;

    if (currentTimestamp - this.lastLiveScoreReportTimestamp >= 1000) {
        Apicontroller._sendLiveScore(score);
    } else {
        this._lastLiveScore = score;
        if (!this._nextReportTimeout) {
            this._nextReportTimeout = setTimeout(() => {
                if (this._lastLiveScore !== undefined) {
                    Apicontroller._sendLiveScore(this._lastLiveScore);
                    this._lastLiveScore = undefined;
                }
                this._nextReportTimeout = undefined;
            }, 1000 - (currentTimestamp - this.lastLiveScoreReportTimestamp));
        }
    }

};

/* Famobi API mock */
Apicontroller.injectFamobiMockObject = function () {
    if (typeof famobi !== "undefined" || window.famobi) return; /* famobi is already defined */
    const log = (message, color = '#bada55', backgroundColor = '#222') => console.log('%c ' + message, `background: ${backgroundColor}; color: ${color}`);
    console.warn('Injecting famobi mock object...');
    famobi = window.famobi = {};
    famobi.setPreloadProgress = value => log(`Progress ${value}%`, '#880000', '#FFEEEE');
    famobi.log = (...args) => console.log(...args);
    famobi.gameReady = function (value) {
        log("'Game ready to start' reported", "#FFFFFF", "#880000");
    };
    famobi.localStorage = window.localStorage;
    famobi.onRequest = function (param, callback) {
        log(`famobi.onRequest(${param})`, "#FFFFDD", "#5533FF");
        famobi.requests = famobi.requests || {};
        famobi.requests[param] = callback;

        if (param === 'startGame') {
            setTimeout(() => callback(), 500);
        }
    };

    famobi.triggerRequest = function (param, ...args) {
        log(`famobi->request(${param})`, "#FFFFDD", "#5533FF");
        if (famobi.requests && famobi.requests[param]) {
            famobi.requests[param](...args);
        }
    };

    famobi.getVolume = function () {
        return ;
    };

    famobi.playerReady = function () {
        log('playerReady() reported', '#00FF66', '#000');
    };

    famobi.hasFeature = function (key) {
        const options = {
            trackstats: false,
            external_start: false,
            external_pause: false,
            skip_title: false,
            skip_tutorial: false,
            forced_mode: false,
            auto_quality: false,
            external_mute: false,
            copyright: false
        };

        return options[key] || false;
    };

    famobi.getFeatureProperties = function (key) {
        if (key === 'forced_mode') {
            return {
                "state": { },
                "override": {
                    "hide_ui": ["score","power_up"],
                }
            };
        } else {
            return {};
        }
    };

    famobi.showInterstitialAd = () => new Promise((resolve, reject) => resolve());

    famobi.getMoreGamesButtonImage = famobi.getBrandingButtonImage = () => "https://games.cdn.famobi.com/portal/4638e320-4444-4514-81c4-d80a8c662371/more-games-button/600x253/5a6895c0f28fb.png";

    famobi.moreGamesLink = famobi.openBrandingLink = () => log('More games link');

    famobi_analytics = window.famobi_analytics = {
        trackEvent: (key, obj) => {
            return new Promise((resolve, reject) => {
                log("famobi_analytics.trackEvent(" + key + ', ' + JSON.stringify(obj) + ")");
                if (key === "EVENT_LEVELSTART" || key === "EVENT_LEVELRESTART") {
                    setTimeout(() => resolve(), 2000);
                } else {
                    resolve();
                }
            });
        },

        trackStats: (key, options, amount) => {
            log("[trackStats] " + key + (amount > 1 ? ` x${amount}` : '') + " " + JSON.stringify(options || ""), "#FFFFFF", "#000000");
        },
    };
};

/* Pause/resume handling */

pc.Application.prototype.pauseGame = function (ignoreVisibilityAPI) { //
    famobi.log('pause game');
    /*if (ignoreVisibilityAPI) this.ignoreVisibilityAPI = true;
    this.applicationPaused = true;
    this.soundVolumeBeforePaused = this.systems.sound.volume;
    this.systems.sound.volume = 0;
    this.fire('audio:setMasterVolume', 0);
    this.timeScale = 0;
    famobi.log("Application:paused");*/
};

pc.Application.prototype.unpauseGame = function (forced) {
    famobi.log('resume game');
    /*if (isPageVisible && (!adIsShowing || forced)) {
        console.log('resume game');
        this.applicationPaused = false;
        this.ignoreVisibilityAPI = false;
        this.systems.sound.volume = this.soundVolumeBeforePaused || 0;
        this.timeScale = 1;
        famobi.log("Application:resumed");
    } else {
        famobi.log('resuming game is not allowed now because ads are displaying or page isn\'t visible...');
    }*/
};


var skipTitleScreen = function () {
    return typeof famobi !== "undefined" && famobi.hasFeature("skip_title");
};
var isForcedMode = function () {
    return typeof famobi !== "undefined" && famobi.hasFeature("forced_mode");
};

var isExternalStart = function () {
    return typeof famobi !== "undefined" && famobi.hasFeature("external_start");
};

// brandingImage.js
var BrandingImage = pc.createScript('brandingImage');


BrandingImage.prototype.initialize = function() {

    this.entity.element.opacity = 0.0;

    if(window.famobi) {

        var self = this;
        this.app.loader.getHandler("texture").crossOrigin = "anonymous";

        var asset = new pc.Asset("brandingImage", "texture", {
            url: window.famobi.getBrandingButtonImage()
        });

        this.app.assets.add(asset);

        asset.on("error", function (message) {
            famobi.log("Branding image loading failed: ", message);
        });

        asset.on("load", function (asset) {
            var material = self.entity.element.texture = asset.resource;
            self.entity.element.opacity = 1;
            self.assignAction(self.entity, self.brandingPressed, self);
        });

        this.app.assets.load(asset);
    }
};

BrandingImage.prototype.assignAction = function(button, handler, handlerContext) {
     if(this.app.touch) {
         button.element.on('touchstart', handler, handlerContext);
     }
     if(this.app.mouse) {
          button.element.on('mousedown', handler, handlerContext);
     }
};

BrandingImage.prototype.update = function(dt) {

};

BrandingImage.prototype.brandingPressed = function() {
    console.error('Branding!!!');
    if(window.famobi) {
        window.famobi.openBrandingLink();
    }
};


// initScene.js
var InitScene = pc.createScript('initScene');

// initialize code called once per entity
InitScene.prototype.initialize = function () {
    var startGame = function()
    {
        const nextSceneId = skipTitleScreen() ? 1257975 : 1259384; //if skipTitleScreen is true, load the level directly. Else load the main menu
        const oldHierarchy = this.app.root.findByName('Root');

        setTimeout(() => {
        oldHierarchy.destroy();
        famobi.log('Loading next scene ', nextSceneId);
        this.loadScene(nextSceneId, function () {
            famobi.log('Next scene loaded');
        });}, 0);
    }.bind(this);

    if(!window.famobi.hasFeature("external_start"))
    {
        startGame();
    }else{
        window.famobi.onRequest("startGame",startGame);
    }
    if(window.famobi) window.famobi.gameReady();
};

InitScene.prototype.loadScene = function (id, callback) {
    if(!id) {
        console.log("No id given for load Scene");
        return;
    }
    var url = id + ".json";
    this.app.loadSceneHierarchy(url, function (err, parent) {
        if (!err) {
            if(window.famobi) window.famobi.playerReady();

            let shouldSoundBeOn = (window.famobi.localStorage.getItem('SoundCheck') == 1);

            this.t = this.app.root.findByName('soundon');
            this.y = this.app.root.findByName('soundoff');

            this.t.enabled = !shouldSoundBeOn;
            this.y.enabled = shouldSoundBeOn;
            Apicontroller.setGameVolume(shouldSoundBeOn ? 1 : 0);

            callback(parent);
        }
        else {
            famobi.error(err);
        }
    });
};


// MainMenu.js
var MainMenu = pc.createScript('mainMenu');


MainMenu.attributes.add("sceneId", { type: "string", default: "0", title: "Scene ID to Load" });



// initialize code called once per entity
MainMenu.prototype.initialize = function () {
    //this.entity.collision.on('collisionstart', this.onCollisionStart, this);
    this.entity.element.on("mouseenter", this.onEnter, this);
    this.entity.element.on("mousedown", this.onPress, this);
    this.entity.element.on("mouseup", this.onRelease, this);
    this.entity.element.on("mouseleave", this.onLeave, this);

    this.entity.element.on("touchstart", this.onPress, this);
    this.entity.element.on("touchend", this.onRelease, this);


    /* external_mute  */
    if (famobi.hasFeature("external_mute")) { this.soundapi.enabled = false; }
    else this.soundapi.enabled = true;

};

MainMenu.prototype.onPress = function(event) {
    if(this.app.timeScale == 0){    this.app.timeScale = 1;}
    var oldHierarchy = this.app.root.findByName('Root');
    setTimeout(() => {
        oldHierarchy.destroy();
        this.loadScene(this.sceneId,function(){
    });},0);
};

MainMenu.prototype.loadScene = function(id,callback) {
    var url=id+".json";
    this.app.loadSceneHierarchy(url,function(err,parent){
        if(!err)
            callback(parent);
        else
            console.error(err);
    });
};

// copyrightText.js
var CopyrightText = pc.createScript('copyrightText');

CopyrightText.prototype.initialize = function() {
    this.entity.enabled = isCopyrightEnabled();
};

CopyrightText.prototype.update = function(dt) {

};


// common.js
var Common = pc.createScript('common');

// initialize code called once per entity
Common.prototype.initialize = function() {

};

// update code called every frame
Common.prototype.update = function(dt) {

};

// swap method called for script hot-reloading
// inherit your script state here
// Common.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// forcedmode.js
var Forcedmode = pc.createScript('forcedmode');

// initialize code called once per entity
Forcedmode.prototype.initialize = function() {
    if(isForcedMode()){level = getForcedModeProperties().state.level;
    if(level){    this.forcedmodelevelload();     }}
    this.apiid=1257975;


    this.soundapi = this.app.root.findByName('soundapi');
    /* external_mute  */
    if(window.famobi && window.famobi.hasFeature("external_mute")) { this.soundapi.enabled = false; }
    else this.soundapi.enabled = true;
};

Forcedmode.prototype.forcedmodelevelload = function(event) {
    var oldHierarchy = this.app.root.findByName('Root');
    setTimeout(() => {
        oldHierarchy.destroy();
        this.loadScene(this.sceneId,function(){
    });},0);
};

Forcedmode.prototype.loadScene = function(id,callback) {
    var url=id+".json";
    this.app.loadSceneHierarchy(url,function(err,parent){
        if(!err)
            callback(parent);
        else
            console.error(err);
    });
};

// replayscene.js
var Replayscene = pc.createScript('replayscene');


Replayscene.attributes.add("sceneId", {type: "string", default: "0", title: "Scene ID to Load"});



// initialize code called once per entity
Replayscene.prototype.initialize = function()
{
    //this.entity.collision.on('collisionstart', this.onCollisionStart, this);
    this.entity.element.on("mouseenter",this.onEnter,this);
    this.entity.element.on("mousedown",this.onPress,this);
    this.entity.element.on("mouseup",this.onRelease,this);
    this.entity.element.on("mouseleave",this.onLeave,this);

    this.entity.element.on("touchstart",this.onPress,this);
    this.entity.element.on("touchend",this.onRelease,this);

};


Replayscene.prototype.onPress = function(event) {
    if(this.app.timeScale == 0){    this.app.timeScale = 1;}
    window.famobi_analytics.trackEvent("EVENT_LEVELRESTART", {levelName: ''});

    var oldHierarchy = this.app.root.findByName('Root');
    setTimeout(() => {
        oldHierarchy.destroy();
        this.loadScene(this.sceneId,function(){});
        },0);
};


Replayscene.prototype.loadScene = function(id,callback) {
    var url=id+".json";
    this.app.loadSceneHierarchy(url,function(err,parent){
        if(!err)
            callback(parent);
        else
            console.error(err);
    });
};


// loadingMod.js
/*
    FAMOBI LOADING MODDER
    ____DO NOT CHANGE____
    ++++
    Except: famobi_config object (Line 26 and below)
    ++++

    Purpose: This script changes the document body object
    of the page, removes all script tags it can find and adds them
    to the famobi_gameJS array but most importantly, it injects the
    famobi api snippet into the document body, which allows you to
    use it for testing. This script will only run while you're on
    playcanvas therefore its very IMPORTANT that you follow the
    steps at https://famobi.atlassian.net/wiki/spaces/FAMAPI
    especially BASICS-001 and BASICS-003 as this script
    bridges these functions while you're testing.

    >> To test game features or configurations change the
    famobi_config object below it replaces the famobi.json
    file while you still develop your game. Feel free to
    copy paste this object into your actual famobi.json
    file later on, the syntax should be identical

    >> This script contains no famobi api references <<
*/

if(window.location.hostname === "launch.playcanvas.com") {
  window.famobi_config = {
    "features":
    {
      "highscores": 0,
      "rewarded": 0,
      "forced_mode": 1,
      "skip_title": 0,
      "external_start": 0,
      "external_mute": 0,
      "ads": 1,
      "trackstats": 1,
      "forced_mode": {
            "state": {},
            "override": {
                "availablePowerUps": ["flying"],
                "hide_ui": ["score", "power_up"]
            }
        },
    },
    "game_i18n" : {
        "default": {
            "filename.png"  : "fg_i18n/en/images/filename.png"
        }
    },
    "game_info": {
        "client_version": "1.0.0",
        "api_version": "2.3",
        "forced_mode": {
            "state": {
                "level": {
                    "description": "Current level number",
                    "type": "number",
                }
            },
            "override": {
                "hide_ui": {
              "description": "What UI elements should be hidden?",
          "type": "array",
          "values": ["level_number", "button_pause"]
        }
            }
        },
        "track_stats":
        {
            "magnet_collected" : {
            "description": "The player received a magnet."
            },
            "speed_powerup" : {
            "description": "The player has filled the bar and her invincible power has been activated."
            },
            "invincible_powerup" : {
            "description": "Player invincible mode opened."
            },
            "flying_powerup" : {
            "description": "Flying power has been activated."
            },
            "coin_collected" : {
            "description": "A gold was taken"
            }
        },
        "orientation": {
            "phone": {
                "portrait": "green",
                "landscape": "green"
            },
            "tablet": {
                "portrait": "green",
                "landscape": "green"
            }
        }
    }
  };

  window.famobi_gameID = "{FAMOBI_GAMEID}";
  window.famobi_gameJS = [
      function() {
          // start the game

      }
  ];

  (function (document, url, fgJS, firstJS) {
      fgJS = document.createElement('script');
      firstJS = document.getElementsByTagName('script')[0];
      fgJS.src = url + encodeURIComponent(document.location.href);
      firstJS.parentNode.insertBefore(fgJS, firstJS);
  })(document, 'https://games.cdn.famobi.com/html5games/gameapi/v1.js?e=');
} else {
  console.warn(window.location.hostname);
}

// famobiRedirectScript.js
/*
    FAMOBI REDIRECT SCRIPT
    ____DO NOT CHANGE____

    Purpose: This script will redirect your game to our staging environment,
    where we equip its url with some special url parameters that are needed
    for our api. You will then be automatically redirected back here and can
    test your game as usual.
    The redirect will only take place the first time you launch your game in
    a new tab and only while you are on playcanvas.
    Its important that you don't alter this behaviour to for example always
    redirect, as this would cause severe problems in your exported game
    once its uploaded to our servers.

    >> This script contains no famobi api references <<
*/

if(window.location.hostname === "launch.playcanvas.com") {
    let originalUrl = window.location.href;
    if(!originalUrl.includes('play.staging.gc.famobi.com'))
        window.location.href = `https://play.staging.gc.famobi.com/playcanvas/?overwrite_html5_link=${originalUrl}/A-PLAYCANVAS-DEV&aid=A-PLAYCANVAS-DEV`;
}

// playMusic.js
var PlayMusic = pc.createScript('playMusic');

// initialize code called once per entity
PlayMusic.prototype.initialize = function () {
    const savedVolume = window.famobi ? (window.famobi.localStorage.getItem('SoundCheck') || 0.0) : 0.0;
    this.entity.sound.slot('GameSound').volume = savedVolume;
};

// update code called every frame
PlayMusic.prototype.update = function (dt) {

};

// swap method called for script hot-reloading
// inherit your script state here
// PlayMusic.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/


