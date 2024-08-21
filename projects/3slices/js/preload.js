function preload() {
  showLoader(this);
  this.load.json('levelData', 'assets/json/map2.json');
  this.load.image('do_over', 'assets/images/do_over.png');
  this.load.image('go_back', 'assets/images/go_back.png');
  this.load.image('level_marker', 'assets/images/level_marker.png');
  this.load.image('play_button', 'assets/images/play_button.png');
  this.load.image('title', 'assets/images/title2.png');
  this.load.image('titleShadow', 'assets/images/titleShadow2.png');
  this.load.image('maxxdaddy', 'assets/images/maxxdaddy.gif');
}

function showLoader(game) {
  var width = game.cameras.main.width;
  var height = game.cameras.main.height;
  var progressBar = game.add.graphics();
  var progressBox = game.add.graphics();
  progressBox.fillStyle(0x222222, 0.8);
  progressBox.fillRect(width / 2 - 160, 270, 320, 50);
  game.load.on('progress', function (value) {});

  game.load.on('fileprogress', function (file) {});

  game.load.on('complete', function () {
    progressBar.destroy();
    progressBox.destroy();
    loadingText.destroy();
    percentText.destroy();
  });
  game.load.on('progress', function (value) {
    progressBar.clear();
    progressBar.fillStyle(0xff4500, 1);
    progressBar.fillRect(width / 2 - 150, 280, 300 * value, 30);
    percentText.setText(parseInt(value * 100) + '%');
  });

  var loadingText = game.make.text({
    x: width / 2,
    y: height / 2 - 50,
    text: 'Loading...',
    style: {
      font: '20px monospace',
      fill: '#ffffff'
    }
  });
  loadingText.setOrigin(0.5, 0.5);

  var percentText = game.make.text({
    x: width / 2,
    y: height / 2 - 5,
    text: '0%',
    style: {
      font: '18px monospace',
      fill: '#ffffff'
    }
  });
  percentText.setOrigin(0.5, 0.5);
}