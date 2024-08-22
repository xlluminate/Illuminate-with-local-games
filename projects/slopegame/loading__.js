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
            "    background-image: url('data:image/png;base64,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');",
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