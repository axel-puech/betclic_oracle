//@input SceneObject parent
//@input Component.VFXComponent vfxConfettis

//_________________________Director Setup_________________________//
script.subScene = new global.SubScene(script, script.parent);
script.subScene.OnStart = Start;
script.subScene.OnLateStart = OnLateStart;
script.subScene.OnStop = Stop;
script.subScene.SetUpdate(Update);
//__________________________Variables_____________________________//
//________Caller________//
//________Listener________//
const onPronoDoneListener = script.subScene.CreateListener("pronoDoneEvent", OnProno);

//________DelayEvent________//

//_________________________Director_Functions_____________________//
function Start() {
  script.vfxConfettis.asset.properties["spawnAmount"] = 0;
  script.vfxConfettis.asset.properties["killParticles"] = 1;
}
function OnLateStart() {}
function Update() {}
function Stop() {
  script.vfxConfettis.asset.properties["spawnAmount"] = 0;
  script.vfxConfettis.asset.properties["killParticles"] = 1;
}
//___________________________Functions__________________________//
function OnProno(id) {
  script.vfxConfettis.asset.properties["killParticles"] = 0;
  script.vfxConfettis.asset.properties["spawnAmount"] = 0.5;
  if (id == 0) {
    script.vfxConfettis.asset.properties["colorA"] = global.nextGame.teamLeft.teamColor1;
    script.vfxConfettis.asset.properties["colorB"] = global.nextGame.teamLeft.teamColor2;
    script.vfxConfettis.asset.properties["colorC"] = global.nextGame.teamLeft.teamColor3;
  } else if (id == 1) {
    script.vfxConfettis.asset.properties["colorA"] = global.nextGame.teamRight.teamColor1;
    script.vfxConfettis.asset.properties["colorB"] = global.nextGame.teamRight.teamColor2;
    script.vfxConfettis.asset.properties["colorC"] = global.nextGame.teamRight.teamColor3;
  }
}
//___________________________Animations_________________________//
