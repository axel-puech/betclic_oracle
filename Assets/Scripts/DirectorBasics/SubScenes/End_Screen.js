//@input SceneObject parent
//@input Component.Image[] bannerImages
//@input float durationFade = 1.0
//@input float delayBeforeAppear = 1.0

//_________________________Director Setup_________________________//
script.subScene = new global.SubScene(script, script.parent);
script.subScene.OnStart = Start;
script.subScene.OnLateStart = OnLateStart;
script.subScene.OnStop = Stop;
script.subScene.SetUpdate(Update);
//__________________________Variables_____________________________//
var bannerAnims = [];

//________Caller________//
//________Listener________//
const onPronoDoneListener = script.subScene.CreateListener("pronoDoneEvent", OnProno);
//________DelayEvent________//
const delayBeforeAppear = script.subScene.CreateEvent("DelayedCallbackEvent", OnDelayBeforeAppear);

//_________________________Director_Functions_____________________//
function Start() {
  // Banner fade anims
  for (var i = 0; i < script.bannerImages.length; i++) {
    (function (index) {
      var anim = new Animation(script.getSceneObject(), script.durationFade, function (ratio) {
        if (!script.bannerImages[index]) return;
        script.bannerImages[index].mainPass.baseColor = new vec4(1, 1, 1, ratio);
      });
      anim.Easing = QuadraticInOut;
      bannerAnims.push(anim);
    })(i);
  }
  ResetAll();
}

function OnLateStart() {}
function Update() {}
function Stop() {
  ResetAll();

  // for (var i = 0; i < bannerAnims.length; i++) bannerAnims[i].Reset();
}
//___________________________Functions__________________________//

function OnDelayBeforeAppear() {
  print("prono");
  ResetAll();
  for (var i = 0; i < bannerAnims.length; i++) bannerAnims[i].Start(1);
}

function OnDelayBeforeOverlay() {
  fadeBlackOverlay.GoTo(1);
}

function ResetAll() {
  for (var i = 0; i < bannerAnims.length; i++) bannerAnims[i].Reset();
  // for (var i = 0; i < bannerAnims.length; i++) bannerAnims[i].JumpTo(0);
}

function OnProno() {
  delayBeforeAppear.event.reset(script.delayBeforeAppear);
}

//___________________________Animations_________________________//
