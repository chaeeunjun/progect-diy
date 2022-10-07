var screenSetting = {
  // canvasId: 'tm-canvas',
  // frameSpeed: 40,
  // column: 60,
  // row: 20,
  // backgroundColor: '#151617',
  // webFontJsPath: 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js',
  // fontColor: '#F5F7FA',
  // fontFamily: 'monospace',
  // fontSource: null,
  // fontSize: 30,
  // zoom: 0.5,
  column: 70,
  row: 23,
  fontFamily: 'Consolas',
};

var debugSetting = {
  // devMode: false,
  // outputDomId: 'tm-debug-output',
  devMode: true,
};

var TMS = new TM.ScreenManager(screenSetting),
    TMI = new TM.InputManager(screenSetting.canvasId,debugSetting.devMode),
    TMD = new TM.DebugManager(debugSetting);

var NUM_OF_ROW = 4;
var NUM_OF_COLUMN = 4;
var NUM_OF_INITIAL_BLOCK = 2;
var BOARD_HEIGHT = NUM_OF_ROW*3+2;
var BOARD_WIDTH = NUM_OF_COLUMN*6+2;
var SPEED = 50;
var FRAME_X = 6;
var FRAME_Y = 1;
var COLORSET = {
  BLOCKS: ['#5D9CEC', '#4FC1E9', '#48CFAD', '#A0D468',
         '#FFCE54', '#FC6E51', '#ED5565', '#AC92EC',
         '#EC87C0', '#4A89DC', '#3BAFDA', '#37BC9B',
         '#8CC152', '#F6BB42', '#E9573F', '#DA4453'],
  EMPTY_BLOCK: '#999',
};
var KEYSET = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  ESC: 27,
};

var boardData;
var score;
var biggestNumber;
var moveDir;
var isGameOver;
var isAutoMoving;

function resetBlockData(){
  var blockData = { value: 0, isMerged: false };
  return blockData;
}

function resetBoardData(){
  var boardData = [];
  for(var i=0; i<NUM_OF_ROW; i++){
    boardData[i] = [];
    for(var j=0; j<NUM_OF_COLUMN; j++){
      boardData[i][j] = resetBlockData();
    }
  }
  return boardData;
}

function putNewBlock(boardData){
  var emptySpots = [];
  for(var i=0; i<NUM_OF_ROW; i++){
    for(var j=0; j<NUM_OF_COLUMN; j++){
      if(boardData[i][j].value === 0){
        emptySpots.push(boardData[i][j]);
      }
    }
  }
  if(emptySpots.length){
    var randomEmptySpot = emptySpots[Math.floor(Math.random()*emptySpots.length)];
    randomEmptySpot.value = Math.ceil(Math.random()*2)*2;
  }
}

function getBlockColor(block_value){
  var blockColor;
  var colorOrder;
  for(colorOrder=0; Math.pow(2,colorOrder+1)<=block_value; colorOrder++)
  blockColor = COLORSET.BLOCKS[colorOrder%COLORSET.BLOCKS.length];
  return blockColor;
}

function alignTextCenter(length, text){
  var alignedText = '';
  var leftPadding = '';
  var leftPaddingLength = Math.ceil((length-text.length)/2);
  var RightPadding = '';
  var RightPaddingLength = length-leftPaddingLength-text.length;
  for(var i=0; i<leftPaddingLength; i++) leftPadding+=' ';
  for(var j=0; j<RightPaddingLength; j++) RightPadding+=' ';
  alignedText = leftPadding+text+RightPadding;
  return alignedText;
}

function drawFrame(){
  var x = FRAME_X+2;
  var y = FRAME_Y;

  TMS.cursor.move(x,y);
  TMS.insertText('──┐┌─┐│ │┌─┐\n');
  TMS.insertText('┌─┘│ │└─┤├─┤\n');
  TMS.insertText('└──└─┘  │└─┘\n');

  for(var i=0; i<BOARD_HEIGHT; i++){
    for(var j=0; j<BOARD_WIDTH; j++){
      TMS.cursor.move(FRAME_X+j,FRAME_Y+3+i);
      if(i==0&&j==0) TMS.insertText('┌');
      else if(i==0&&j==BOARD_WIDTH-1) TMS.insertText('┐');
      else if(i==BOARD_HEIGHT-1&&j==0) TMS.insertText('└');
      else if(i==BOARD_HEIGHT-1&&j==BOARD_WIDTH-1) TMS.insertText('┘');
      else if(i==0 || i==BOARD_HEIGHT-1) TMS.insertText('─');
      else if(j==0 || j==BOARD_WIDTH-1) TMS.insertText('|');
    }
  }

  x = FRAME_X+1+BOARD_WIDTH;
  y = FRAME_Y+5;
  TMS.cursor.move(x,y);
  TMS.insertText('Score:');

  x = FRAME_X+1;
  y = FRAME_Y+3+BOARD_HEIGHT;
  TMS.cursor.move(x,y);
  TMS.insertText('◇ ←, →, ↑, ↓ : Move\n');
  TMS.insertText('◇ ESC : Restart\n\n');
  TMS.insertText('www.A-MEAN-Blog.com\n');
}

function drawBoard(){
  for(var i=0; i<boardData.length; i++){
    for(var j=0; j<boardData[i].length; j++){
      TMS.cursor.move(FRAME_X+2+(j*6),FRAME_Y+4+(i*3));
      if(boardData[i][j].value){
        var color = getBlockColor(boardData[i][j].value);
        TMS.insertText('┌───┐\n', color);
        TMS.insertText(alignTextCenter(5,boardData[i][j].value.toString())+'\n', color);
        TMS.insertText('└───┘\n', color);
      }
      else {
        TMS.insertText('     \n',COLORSET.EMPTY_BLOCK);
        TMS.insertText('  +  \n',COLORSET.EMPTY_BLOCK);
        TMS.insertText('     \n',COLORSET.EMPTY_BLOCK);
      }
    }
  }
}

function drawScore(){
  var x = FRAME_X+1+BOARD_WIDTH+7;
  var y = FRAME_Y+5;
  TMS.cursor.move(x,y);
  TMS.insertText(score);
}

function drawGameOver(){
  var x = FRAME_X+1+BOARD_WIDTH;
  var y = FRAME_Y+12;
  TMS.cursor.move(x,y);
  TMS.insertText(' Game Over..  Your score : '+score+' \n',null,'gray');
  TMS.insertText(' Press <ESC> key to start new game ',null,'gray');
}

function drawWin(){
  var x = FRAME_X+1+BOARD_WIDTH;
  var y = FRAME_Y+8;
  TMS.cursor.move(x,y);
  TMS.insertText('Congratulations! You Made 2048!\n','#fff');
  TMS.insertText('Keep playing for high score :)','#fff');
}

function reset(){
  moveDir = null;
  isAutoMoving = false;
  isGameOver = false;
  biggestNumber = 0;
  score = 0;
  boardData = resetBoardData();
  for(var i=0; i<NUM_OF_INITIAL_BLOCK; i++) putNewBlock(boardData);

  TMS.cursor.hide();
  TMS.clearScreen();
  drawFrame();
  drawBoard();
  drawScore();
}

reset();

TMD.print('debug-data', {
  moveDir: moveDir,
  isAutoMoving: isAutoMoving,
  isGameOver: isGameOver,
  biggestNumber: biggestNumber,
});