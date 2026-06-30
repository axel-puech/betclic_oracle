//@input SceneObject parent

//@input float animDuration = 0.5
//@input float delayBeforeFadeOut = 1.0

//@ui {"widget":"separator"}
//@ui {"widget":"label", "label":"LEFT HEAD PANEL "}
//@input SceneObject parentLeft
//@input SceneObject containerLeft
//@input SceneObject teamLeft

//@ui {"widget":"separator"}
//@ui {"widget":"label", "label":"RIGHT HEAD PANEL "}
//@input SceneObject parentRight
//@input SceneObject containerRight
//@input SceneObject teamRight

//@input Component.AudioComponent[] Sounds

//@input SceneObject parent
//_________________________Director Setup_________________________//
script.subScene = new global.SubScene(script, script.parent);
script.subScene.OnStart = Start;
script.subScene.OnLateStart = OnLateStart;
script.subScene.OnStop = Stop;
script.subScene.SetUpdate(Update);

//__________________________Variables_____________________________//

let headPanelLeft = null;
let headPanelRight = null;

let choiceLeftTexture = null;
let choiceLeftSelectedTexture = null;
let makeUpLeftTexture = null;
let choiceRightTexture = null;
let choiceRightSelectedTexture = null;
let makeUpRightTexture = null;

//________Caller________//
const activateTrackingCaller = script.subScene.CreateCaller("activateTrackingEvent", 0);
const pronoDone = script.subScene.CreateCaller("pronoDoneEvent", 0);

//________Listener________//
const headMoveListener = script.subScene.CreateListener("headMoveEvent", OnHeadMove);

//________DelayEvent________//
const fadeOutDelay = script.subScene.CreateEvent("DelayedCallbackEvent", OnFadeOutDelay);

//_________________________Director_Functions_____________________//
function Start() {}

function OnLateStart() {
  // Left Head Panel
  teamLeftTexture = global.nextGame.teamLeft.imageTeam;
  makeUpLeftTexture = global.nextGame.teamLeft.makeUp;

  // Right Head Panel
  teamRightTexture = global.nextGame.teamRight.imageTeam;
  makeUpRightTexture = global.nextGame.teamRight.makeUp;

  Instantiation();
  headPanelLeft.anims.fade.GoTo(1);
  headPanelRight.anims.fade.GoTo(1);
}

function Update() {}
function Stop() {}
//___________________________Functions__________________________//

function OnFadeOutDelay() {
  headPanelLeft.anims.fade.GoTo(0);
  headPanelRight.anims.fade.GoTo(0);
}

function OnHeadMove(value) {
  if (value == 1) {
    // stop the tracking
    activateTrackingCaller.Call(0);
    fadeOutDelay.event.reset(script.delayBeforeFadeOut);
    LeftChoice();
    pronoDone.Call(0);
  } else if (value == 2) {
    activateTrackingCaller.Call(0);
    fadeOutDelay.event.reset(script.delayBeforeFadeOut);
    RightChoice();
    pronoDone.Call(1);
  } else {
    // pass;
  }
}

function LeftChoice() {
  print("LeftChoice");
  // play the sound
  // scale up the left panel
  headPanelLeft.anims.scale_up.GoTo(1);
  // mix the texture of the left panel
  headPanelLeft.anims.mix_texture.GoTo(1);
  // fade out the right panel
  headPanelRight.anims.fade.GoTo(0.5);
}

function RightChoice() {
  print("RightChoice");
  // play the sound
  // scale up the right panel
  headPanelRight.anims.scale_up.GoTo(1);
  // mix the texture of the right panel
  headPanelRight.anims.mix_texture.GoTo(1);
  // fade out the left panel
  headPanelLeft.anims.fade.GoTo(0.5);
}

//___________________________Animations_________________________//

//__________________________Classes_____________________________//

class HeadPanel {
  constructor(parentObject, containerObject, teamObject, teamTexture) {
    // parent is for the scale, rotation and movements
    this._parentObject = parentObject;
    this._parentTransform = this._parentObject.getTransform();

    // container object is for the mix, the scale, the fade
    this._containerObject = containerObject;
    this._containerImage = this._containerObject.getComponent("Component.Image");

    this._teamObject = teamObject;
    this._teamImage = this._teamObject.getComponent("Component.Image");
    this._teamTexture = teamTexture;

    this.anims = {
      fade: null,
      scale_up: null,
      scale_down: null,
      mix_texture: null,
    };

    // set the texture of the teamObject to the texture
    this.setTexture();

    this.initAnimations();
    this.resetAnimations();
  }

  setTexture() {
    this._teamImage.mainPass.baseTex = this._teamTexture;
  }

  initAnimations() {
    // Fade animation: fade the container and the team
    this.anims.fade = new Animation(script.getSceneObject(), script.animDuration, (ratio) => {
      this._containerImage.mainPass.alphaRatio = ratio;
      this._teamImage.mainPass.alphaRatio = ratio;
    });

    // Scale up animation
    this.anims.scale_up = new Animation(script.getSceneObject(), script.animDuration, (ratio) => {
      var scale = 1 + ratio * 0.3;
      this._parentTransform.setLocalScale(new vec3(scale, scale, scale));
    });
    this.anims.scale_up.Easing = QuadraticInOut;

    // Scale down animation
    this.anims.scale_down = new Animation(script.getSceneObject(), script.animDuration, (ratio) => {
      var scale = 1 - ratio * 0.2;
      this._parentTransform.setLocalScale(new vec3(scale, scale, scale));
    });
    this.anims.scale_down.Easing = QuadraticInOut;

    this.anims.mix_texture = new Animation(script.getSceneObject(), script.animDuration, (ratio) => {
      this._containerImage.mainPass.mixRatio = ratio;
    });
  }

  resetAnimations() {
    this.anims.fade.Reset();
    this.anims.scale_up.Reset();
    this.anims.scale_down.Reset();
    this.anims.mix_texture.Reset();
  }
}

function Instantiation() {
  headPanelLeft = new HeadPanel(script.parentLeft, script.containerLeft, script.teamLeft, teamLeftTexture);
  headPanelRight = new HeadPanel(script.parentRight, script.containerRight, script.teamRight, teamRightTexture);
}
