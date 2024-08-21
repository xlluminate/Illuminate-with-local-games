var config = {
  type: Phaser.AUTO,
  width: 640,
  height: 480,
  parent: 'canvas',
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
  physics: {
    default: 'matter',
    matter: {
      gravity: {
        y: 1,
      },
      debug: false,
    },
  },
};

var game = new Phaser.Game(config);
var _scene;
function create() {
  _scene = this;
    width = game.config.width;
    height = game.config.height;
    this.cameras.main.setBackgroundColor(0x666666);
    let data = this.cache.json.get('levelData').levels;
    for (let index = 0; index < data.length; index++) {
      var level = {
        scoreTargets: [],
        polygons: [],
      };
      level.level = data[index][0];

      for (var i = 1; i < 5; i++) {
        level.scoreTargets.push(data[index][i]);
      }
      target = level.scoreTargets[0];

      for (var i = 5; i < data[index].length; i++) {
        var poly = {
          startX: data[index][i][0],
          startY: data[index][i][1],
          width: data[index][i][2],
          height: data[index][i][3],
          angle: data[index][i][4],
          dynamic: data[index][i][5],
          type: data[index][i][6],
          anchorX: data[index][i][7],
          anchorY: data[index][i][8],
          anchorZ: data[index][i][9],
          color: data[index][i][10],
          coordinates: data[index][i][11],
        };
        level.polygons.push(poly);
      }
      levelData.push(level);
    }
    buildMenu();
    levelOverPopup();
    //maxxdaddy = add.image(game.config.width * 0.9, game.config.height * 0.95, 'maxxdaddy');
  }

function startDrawing() {
    if (slicesLeft == 0) {
      levelCompleted = true;
      removed >= target ? showPopup(true, true) : showPopup(false, true);
    } else
      isDrawing = true;
  }

  function   keepDrawing(pointer) {
    if (isDrawing) {
      lineGraphics.clear();
      lineGraphics.lineStyle(2, 0x00);
      lineGraphics.moveTo(pointer.downX, pointer.downY);
      lineGraphics.lineTo(pointer.x, pointer.y);
      lineGraphics.strokePath();
      lineGraphics.depth = 1;
    }
  }

  function  stopDrawing(pointer) {
    if (!isDrawing)
      return;
    lineGraphics.clear();
    isDrawing = false;
    let bodies = _scene.matter.world.localWorld.bodies;
    let toBeSliced = [];
    let toBeCreated = [];
    for (let i = 0; i < bodies.length; i++) {
      let body = bodies[i];
      if (!body.isStatic) {
        let vertices = body.parts[0].vertices;
        let pointsArray = [];
        vertices.forEach(function (vertex) {
          pointsArray.push(vertex.x, vertex.y);
        });
        let slicedPolygons = PolyK.Slice(
          pointsArray,
          pointer.downX,
          pointer.downY,
          pointer.upX,
          pointer.upY,
        );
        let bodyColor = body.gameObject.fillColor;
        if (slicedPolygons.length > 1) {
          toBeSliced.push(body);
          slicedPolygons.forEach(function (points) {
            toBeCreated.push(points.concat(bodyColor));
          });
        }
      }
    }
    if (toBeSliced.length > 0)
      slicesLeft--;
    toBeSliced.forEach(
      function (body) {
        body.gameObject.destroy();
        _scene.matter.world.remove(body);
      }.bind(this),
    );
    toBeCreated.forEach(
      function (points) {
        let polyObject = [];
        polyFill = points[points.length - 1];
        points.pop();
        for (let i = 0; i < points.length / 2; i++) {
          polyObject.push({
            x: points[i * 2],
            y: points[i * 2 + 1],
          });
        }

        let sliceCentre = Phaser.Physics.Matter.Matter.Vertices.centre(
          polyObject,
        );
        var verts = _scene.matter.verts.fromPath(points.join(' '));
        for (let i = 0; i < verts.length; i++) {
          (verts[i].x -= sliceCentre.x) * -1;
          (verts[i].y -= sliceCentre.y) * -1;
        }
        var poly = _scene.add.polygon(
          sliceCentre.x,
          sliceCentre.y,
          verts,
          polyFill,
        );
        poly.setStrokeStyle(2, 0x00);
        polyGroup.push(poly);
        _scene.matter.add
          .gameObject(poly, {
            shape: {
              type: 'fromVerts',
              verts,
              flagInternal: true,
            },
          })
          .setOrigin(0, 0);
        // console.log(body);
      }.bind(this),
    );
  }

  function   update() {
    // startGame = true;
    // currentLevel = 2;
    if (!startGame) {
      showMenu(true);
      return;
    }
    lvlText == null ? statusText() : updateStatus();
    if (!levelBuilt) {
      //matter.world.setBounds(10, 10, game.config.width - 20, game.config.height - 20);
      buildLevel(currentLevel);
    }
    if (levelCompleted)
      return;
    let bodies = _scene.matter.world.localWorld.bodies;
    const curLvl = levelData[currentLevel - 1];
    for (let i = 0; i < bodies.length; i++) {
      let body = bodies[i];
      const obj = body.gameObject;
      if (obj.fillColor == '0x0000ff') {
        body.force.y -= body.mass * 0.002;
      }
      if (obj.y > 800 || obj.y < -100) {
        if (obj.fillColor == "0xff0000" || obj.fillColor == '0x0000ff')
          removed += (body.mass / totalMass) * 100;
        body.destroy();
        if (removed >= 99)
          removed = 100;
        updateStatus(true);
      }
      //console.log(obj.fillColor,Math.floor(body.velocity.x),Math.floor(body.velocity.y));
      if (removed >= target) { // && allPiecesSleeping()){
        levelMarkerData[currentLevel - 1].percent = Math.floor(removed);
        levelMarkerData[currentLevel].unlocked = true;
        levelCompleted = true;
        showPopup(true, true);
      }
      // if (slicesLeft == 0 && removed < target){//  && allPiecesSleeping()){
      //     levelCompleted = true;
      //     showPopup(false, true);
      // }
    }
  }

  function allPiecesSleeping() {
    let retValue = true;
    let bodies = matter.world.localWorld.bodies;
    for (let i = 0; i < bodies.length; i++) {
      if (!bodies[i].isSleeping && !bodies[i].isStatic) {
        retValue = false;
      }
    }
    return retValue;
  }

  function  updateStatus() {
    lvlText.setText('Level:' + currentLevel);
    sliceText.setText('Slices Left:' + slicesLeft);
    targetText.setText('Target:' + target + '%');
    removedText.setText('Removed:' + Math.floor(removed) + '%');
  }

  function showStatus(onOff) {
    lvlText.visible = onOff;
    lvlText.depth = 1;
    sliceText.visible = onOff;
    sliceText.depth = 1;
    targetText.visible = onOff;
    targetText.depth = 1;
    removedText.visible = onOff;
    removedText.depth = 1;
  }

  function statusText() {
    lvlText = _scene.add.text(10, 10, 'Level:' + currentLevel, textFormat);

    sliceText = _scene.add.text(
      game.config.width - 120,
      10,
      'Slices Left:' + slicesLeft,
      textFormat,
    );

    targetText = _scene.add.text(
      10,
      game.config.height - 50,
      'Target:' + target + '%',
      textFormat,
    );

    removedText = _scene.add.text(
      game.config.width - 120,
      game.config.height - 50,
      'Removed:' + Math.floor(removed) + '%',
      textFormat,
    );
  }

  function levelSelected(x, y) {
    startGame = true;
    currentLevel = x + (y - 1) * 5;
    levelBuilt = false;
    showMenu(false);
  }

  function  getLevel(x, y) {
    return x + (y - 1) * 5;
  }

  function clearBodies() {
    for (let index = 0; index < polyGroup.length; index++) {
      polyGroup[index].visible = false;
    }
    let bodies = _scene.matter.world.localWorld.bodies;
    for (let index = 0; index < bodies.length; index++) {
      let body = bodies[index];
      body.gameObject.visible = false;
      //if (body.gameObject != null)
      body.gameObject.destroy();
      body.visible = false;
      _scene.matter.world.remove(body);
    }

    while (polyGroup.length > 0) {
      polyGroup.pop();
    }
    while (bodies.length > 0) {
      bodies.pop();
    }
  }

  function  buildLevel(currentLevel) {
   _scene.cameras.main.setBackgroundColor(0xcccccc);
    //matter.world.setBounds();
    const curLvl = levelData[currentLevel - 1];
    const curPolys = curLvl.polygons;
    for (let index = 0; index < curPolys.length; index++) {
      var path = curPolys[index].coordinates;

      var verts = _scene.matter.verts.fromPath(path);

      var poly = _scene.add.polygon(
        curPolys[index].startX,
        curPolys[index].startY,
        verts,
        colorSwitch(curPolys[index].color),
      );
      poly.setStrokeStyle(2, 0x00);
      polyGroup.push(poly);
      // console.log(poly);
      var body = _scene.matter.add
        .gameObject(poly, {
          shape: {
            type: 'fromVerts',
            verts,
            flagInternal: true,
            density: 5,
            friction: 1,
            frictionAir: 1,
            frictionStatic: 1,
            restitution: 0
          },
        })
        .setStatic(!curPolys[index].dynamic)

      var angle = Phaser.Math.RadToDeg(curPolys[index].angle);

      body.angle = angle;
      _scene.matter.world.update30Hz();
      lineGraphics = _scene.add.graphics();
      _scene.input.on('pointerdown', startDrawing, this);
      _scene.input.on('pointerup', stopDrawing, this);
      _scene.input.on('pointermove', keepDrawing, this);
      isDrawing = false;
      if (body.fillColor == '0xff0000' || body.fillColor == '0x0000ff')
        totalMass += body.body.mass;
    }
    target = curLvl.scoreTargets[0];
    showStatus(true);
    levelBuilt = true;
  }

  function   showMenu(onOff) {
   _scene.cameras.main.setBackgroundColor(0x666666);
    menu.visible = onOff;
    if (!onOff) {
      for (let index = 0; index < text.length; index++) {
        text[index].destroy();
      }
      textIsShowing = false;
      return;
    }
    if (textIsShowing)
      return;
    for (let y = 1; y <= 4; y++) {
      for (let x = 1; x <= 5; x++) {
        let offset = 0;
        let offset2 = 0;
        let i = getLevel(x, y) - 1;
        let val = levelMarkerData[i].level;
        if (val > 9)
          offset = -8;
        levelMarkerData[i].unlocked = true;
        if (levelMarkerData[i].unlocked) {
          var lvlText = _scene.add.text(
            levelMarkerData[i].x - 25 + offset,
            levelMarkerData[i].y - 30,
            levelMarkerData[i].level, {
              fontFamily: 'Arial',
              fontSize: 24,
              color: '#ffffff',
            },
          );
          val = levelMarkerData[i].percent;
          if (val > 9)
            offset2 = -8;
          if (val > 99)
            offset2 = -16;
          var lvlText2 = _scene.add.text(
            levelMarkerData[i].x - 25 + offset2,
            levelMarkerData[i].y,
            val + '%', {
              fontFamily: 'Arial',
              fontSize: 16,
              color: '#ffffff',
            },
          );
          text.push(lvlText);
          text.push(lvlText2);
        }
      }
    }
    textIsShowing = true;
  }

  function  levelOverPopup() {
    rect = new Phaser.Geom.Rectangle(width - 200, height / 2 - 100, 200, 200);
    var pfColor = 0x00CC05;

    rectGraphics = _scene.add.graphics({
      fillStyle: {
        color: pfColor
      }
    });

    rectGraphics.fillRectShape(rect).setVisible(false);

    popupTitle = _scene.add.text(rect.x + 20, rect.y + 30, 'LEVEL COMPLETED!', textFormat).setVisible(false);

    tryAgain = _scene.add.text(rect.x + 30, rect.y + 70, 'Retry', textFormat)
      .setInteractive()
      .on('pointerdown', () => retryLevel())
      .setVisible(false);
    tryNext = _scene.add.text(rect.x + 30, rect.y + 100, 'Next', textFormat)
      .setInteractive()
      .on('pointerdown', () => nextLevel())
      .setVisible(false);
    goToMenu = _scene.add.text(rect.x + 30, rect.y + 130, 'Go To Menu', textFormat)
      .setInteractive()
      .on('pointerdown', () => gotoMenu())
      .setVisible(false);
  }

  function  showPopup(passFail, isVisible) {
    var pfColor = passFail ? 0x00CC05 : 0xff0000;
    rectGraphics.clear();
    rectGraphics = _scene.add.graphics({
      fillStyle: {
        color: pfColor
      }
    });

    rectGraphics.fillRectShape(rect);
    rectGraphics.setVisible(isVisible);
    //rectGraphics.tint = pfColor;
    tryAgain.setVisible(isVisible);
    tryAgain.depth = 1;
    popupTitle.setVisible(isVisible);
    popupTitle.depth = 1;
    popupTitle.setText(passFail ? 'LEVEL COMPLETED!' : 'FAILED LEVEL');
    tryNext.setVisible(passFail ? isVisible : false);
    tryNext.depth = 1;
    goToMenu.setVisible(isVisible);
    goToMenu.depth = 1;
  }

  function retryLevel() {
    resetWorld();
    showPopup(true, false);
    buildLevel(currentLevel);
  }

  function nextLevel() {
    resetWorld();
    showPopup(true, false);
    currentLevel++;
    buildLevel(currentLevel);
  }

  function gotoMenu() {
    showStatus(false);
    resetWorld();
    showPopup(true, false);
    showMenu(true);
  }

  function resetWorld() {
    levelCompleted = false;
    slicesLeft = 3;
    removed = 0;
    totalMass = 0;
    clearBodies();
  }

  function buildMenu() {
    titleShadow = _scene.add
      .image(325, 55, 'titleShadow')
      .setScale(0.3)
      .setOrigin(0.5, 0.5);
    title = _scene.add
      .image(320, 50, 'title')
      .setScale(0.3)
      .setOrigin(0.5, 0.5);
    let i = 1;
    let lvlButtons = [];
    for (let y = 1; y <= 4; y++) {
      for (let x = 1; x <= 5; x++) {
        const lvlButton = _scene.add
          .image(x * 105, y * 100 + 30, 'level_marker')
          .setScale(0.4)
          .setOrigin(0.5, 0.5)
          .setInteractive()
          .on('pointerdown', () => levelSelected(x, y));
        lvlButtons.push(lvlButton);
        var levelMarker = {
          level: i,
          x: x * 105 + 20,
          y: y * 100 + 30,
          unlocked: false,
          percent: 0,
        };
        levelMarkerData.push(levelMarker);
        if (levelMarker.level < 2)
          levelMarker.unlocked = true;
        i++;
      }
    }
    menu = _scene.add.container(0, 0); //, [titleShadow, title, lvlButtons, levelMarkerData]);
    menu.add(titleShadow);
    menu.add(title);
    menu.add(lvlButtons);
    menu.visible = false;
  }
