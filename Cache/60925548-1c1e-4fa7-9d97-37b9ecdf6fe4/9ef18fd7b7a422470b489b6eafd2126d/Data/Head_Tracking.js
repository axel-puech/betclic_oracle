//@input SceneObject parent

//@input SceneObject head_Panel
//@input float rightLimit = -0.08
//@input float leftLimit = 0.08

//_________________________Director Setup_________________________//
script.subScene = new global.SubScene(script, script.parent);
script.subScene.OnStart = Start;
script.subScene.OnLateStart = OnLateStart;
script.subScene.OnStop = Stop;
script.subScene.SetUpdate(Update);
//__________________________Variables_____________________________//

var trackHead = true;

//________Caller________//
// POur le caller :
// 0 : centre
// 1 : gauche
// 2 : droite

const headMoveCaller = script.subScene.CreateCaller("headMoveEvent", 0);
//________Listener________//
const activateTrackingListener = script.subScene.CreateListener("activateTrackingEvent", OnActivateTracking);
//________DelayEvent________//

//_________________________Director_Functions_____________________//
function Start() {}
function OnLateStart() {}
function Update() {
  if (!trackHead) return;
  // var worldPos = script.head_Panel.getTransform().getWorldPosition();
  var worldRot = script.head_Panel.getTransform().getWorldRotation();

  if (worldRot.z < script.rightLimit) {
    headMoveCaller.Call(2);
  } else if (worldRot.z > script.leftLimit) {
    headMoveCaller.Call(1);
  } else {
    headMoveCaller.Call(0);
  }
}
function Stop() {
  trackHead = true;
}
//___________________________Functions__________________________//

function OnActivateTracking(value) {
  //print("OnActivateTracking : " + value);
  if (value == 1) {
    trackHead = true;
  } else {
    trackHead = false;
  }
}

//___________________________Animations_________________________//
