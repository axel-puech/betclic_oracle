//@input SceneObject parent

//_________________________Director Setup_________________________//
script.subScene = new global.SubScene(script, script.parent);
script.subScene.OnStart = Start;
script.subScene.OnLateStart = OnLateStart;
script.subScene.OnStop = Stop;
script.subScene.SetUpdate(Update);
//__________________________Variables_____________________________//

//________Caller________//
//________Listener________//
//________DelayEvent________//

//_________________________Director_Functions_____________________//
function Start() {
  var currentDate = new Date();
  var closestDate = global.gameData[0].date;
  var nextGame = null;

  // print("current date: " + currentDate);
  // global.gameData.forEach((game, index) => {
  //   print("Game " + (index + 1) + ": " + game.gameName);
  //   print("Date: " + game.date);
  // });

  for (var i = 1; i < global.gameData.length; i++) {
    if (global.gameData[i].date > currentDate && global.gameData[i].date < closestDate) {
      closestDate = global.gameData[i].date;
      nextGame = i;
    }
  }

  if (nextGame !== null) {
  } else {
    print("No upcoming games found.");
    var lastDate = global.gameData[0].date;
    var lastGame = 0;
    for (var i = 1; i < global.gameData.length; i++) {
      if (global.gameData[i].date < currentDate && global.gameData[i].date > lastDate) {
        lastDate = global.gameData[i].date;
        lastGame = i;
      }
    }
    nextGame = lastGame;
    print("Last game: " + global.gameData[nextGame].gameName);
  }

  global.nextGame = global.gameData[nextGame];

  print("Next game: " + global.nextGame.gameName);
}

function OnLateStart() {}
function Update() {}
function Stop() {}
//___________________________Functions__________________________//

//___________________________Animations_________________________//
