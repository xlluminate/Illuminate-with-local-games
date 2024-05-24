let levelData = [];
let polygon;
let polygons = [];
let startGame = false;
var menu;
let maxxdaddy;
let title;
let titleShadow;
let levelMarkerData = [];
let text = [];
let currentLevel = 0;
let levelBuilt = false;
let polys = [];
let target = 0;
let completed = 0;
let textIsShowing = false;
let lvlText;
let sliceText;
let targetText;
let removedText;
let slicesLeft = 3;
let totalMass = 0;
let removed = 0;
let popup;
let rectGraphics;
let popupTitle;
let tryAgain;
let tryNext;
let levelCompleted = false;
let width = 0;
let height = 0;
let rect;
let polyFill;
let polyGroup = [];
const colorSwitch = color =>
  ({
    red: '0xff0000',
    blue: '0x0000ff',
    white: '0xffffff',
    black: '0x000000',
  } [color]);
const textFormat = {
  fontFamily: 'Arial',
  fontStyle: 'Bold',
  fontSize: 16,
  color: '#ffffff',
  stroke: '#000000',
  strokeThickness: 6,
};
