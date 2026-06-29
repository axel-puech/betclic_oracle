//@input SceneObject parent

//@input float animDuration = 0.5
//@input float delayBeforeFadeOut = 1.0

//@ui {"widget":"separator"}
//@ui {"widget":"label", "label":"LEFT HEAD PANEL "}
//@input SceneObject parentLeft
//@input SceneObject choiceLeft

//@ui {"widget":"separator"}
//@ui {"widget":"label", "label":"RIGHT HEAD PANEL "}
//@input SceneObject parentRight
//@input SceneObject choiceRight

//@input Component.AudioComponent[] Sounds

// prend deux textures de pays
// cree un un objet pour chaque

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

// Left Head Panel
const choiceLeftTexture = global.choiceLeftTexture;
const choiceLeftSelectedTexture = global.choiceLeftSelectedTexture;
const makeUpLeftTexture = global.makeUpLeftTexture;

// Right Head Panel
const choiceRightTexture = global.choiceRightTexture;
const choiceRightSelectedTexture = global.choiceRightSelectedTexture;
const makeUpRightTexture = global.makeUpRightTexture;

//________Caller________//
const activateTrackingCaller = script.subScene.CreateCaller("activateTrackingEvent", 0);

//________Listener________//
const headMoveListener = script.subScene.CreateListener("headMoveEvent", OnHeadMove);

//________DelayEvent________//
const fadeOutDelay = script.subScene.CreateEvent("DelayedCallbackEvent", OnFadeOutDelay);

//_________________________Director_Functions_____________________//
function Start() {}
function OnLateStart() {
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
    fadeOutDelay.Delay(script.delayBeforeFadeOut);
    LeftChoice();
  } else if (value == 2) {
    activateTrackingCaller.Call(0);
    fadeOutDelay.Delay(script.delayBeforeFadeOut);
    RightChoice();
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
  constructor(parentObject, imageObject, texture, selectedTexture) {
    print("HeadPanel constructor");
    this._parentObject = parentObject;
    this._imageObject = imageObject;

    this._texture = texture;
    this._selectedTexture = selectedTexture;

    this._parentTransform = this._parentObject.getTransform();
    this._image = this._imageObject.getComponent("Component.Image");

    this.anims = {
      fade: null,
      scale_up: null,
      scale_down: null,
      mix_texture: null,
      transparent: null,
    };

    this.setTexture();

    this.initAnimations();
    this.resetAnimations();
  }

  setTexture() {
    this._image.mainPass.textureNormal = this._texture;
    this._image.mainPass.textureSelected = this._selectedTexture;
  }

  initAnimations() {
    // Fade animation
    this.anims.fade = new Animation(script.getSceneObject(), script.animDuration, (ratio) => {
      this._image.mainPass.alphaRatio = ratio;
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
      this._image.mainPass.mixRatio = ratio;
    });

    // make the not selected panel a bit transparent
    this.anims.transparent = new Animation(script.getSceneObject(), script.animDuration, (ratio) => {
      this._image.mainPass.alphaRatio = 1 - ratio * 0.5;
    });
  }

  resetAnimations() {
    this.anims.fade.Reset();
    this.anims.scale_up.Reset();
    this.anims.scale_down.Reset();
    this.anims.mix_texture.Reset();
    this.anims.transparent.Reset();
  }
}

function Instantiation() {
  headPanelLeft = new HeadPanel(script.parentLeft, script.choiceLeft, choiceLeftTexture, choiceLeftSelectedTexture);
  headPanelRight = new HeadPanel(
    script.parentRight,
    script.choiceRight,
    choiceRightTexture,
    choiceRightSelectedTexture,
  );
}
