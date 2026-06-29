//@input SceneObject parent

//@input float animDuration = 0.5

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

const choiceLeftTexture = global.choiceLeftTexture;
const choiceRightTexture = global.choiceRightTexture;

const makeUpLeftTexture = global.makeUpLeftTexture;
const makeUpRightTexture = global.makeUpRightTexture;

//________Caller________//
//________Listener________//

const headMoveListener = script.subScene.CreateListener("headMoveEvent", OnHeadMove);

//________DelayEvent________//

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

function OnHeadMove(value) {
  if (value == 1) {
    // stop the tracking
    activateTrackingCaller.Call(0);
    LeftChoice();
  } else if (value == 2) {
    activateTrackingCaller.Call(0);
    RightChoice();
  } else {
    // pass;
  }
}

function LeftChoice() {
  script.Sounds[1].play(1);
  // if the user selected the Left side

  // Animate the left panel
  // Scale UP

  headPanelLeft.anims.scale_up.GoTo(1);
  animToReset.push(headPanelLeft.anims.scale_up);
  // fade in the flare
  headPanelLeft.anims.fade_flare.GoTo(1);
  animToReset.push(headPanelLeft.anims.fade_flare);
  // fade in the particles
  headPanelLeft.anims.fade_particles.GoTo(1);
  animToReset.push(headPanelLeft.anims.fade_particles);

  // Animate the right panel
  // Scale down
  headPanelRight.anims.scale_down.GoTo(1);
  animToReset.push(headPanelRight.anims.scale_down);
  // make it a bit transparent
  headPanelRight.anims.transparent.GoTo(1);
  animToReset.push(headPanelRight.anims.transparent);
}

function RightChoice() {
  script.Sounds[1].play(1);

  // if the user selected the Right side
  // Animate the left panel
  headPanelLeft.anims.scale_down.GoTo(1);
  // push all animations played to the list, for easy reverse later
  animToReset.push(headPanelLeft.anims.scale_down);

  headPanelLeft.anims.transparent.GoTo(1);
  animToReset.push(headPanelLeft.anims.transparent);

  // Animate the right panel
  headPanelRight.anims.scale_up.GoTo(1);
  animToReset.push(headPanelRight.anims.scale_up);

  headPanelRight.anims.fade_flare.GoTo(1);
  animToReset.push(headPanelRight.anims.fade_flare);

  headPanelRight.anims.fade_particles.GoTo(1);
  animToReset.push(headPanelRight.anims.fade_particles);
}

//___________________________Animations_________________________//

//__________________________Classes_____________________________//

class HeadPanel {
  constructor(parentObject, imageObject, texture) {
    print("HeadPanel constructor");
    this._parentObject = parentObject;
    this._imageObject = imageObject;
    this._texture = texture;

    this._parentTransform = this._parentObject.getTransform();
    this._image = this._imageObject.getComponent("Component.Image");

    this.anims = {
      fade: null,
      scale_up: null,
      scale_down: null,
      transparent: null,
    };

    this.setTexture();

    this.initAnimations();
    this.resetAnimations();
  }

  setTexture() {
    this._image.mainPass.baseTex = this._texture;
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

    // make the not selected panel a bit transparent
    this.anims.transparent = new Animation(script.getSceneObject(), script.animDuration, (ratio) => {
      this._image.mainPass.alphaRatio = 1 - ratio * 0.5;
    });
  }

  resetAnimations() {
    this.anims.fade.Reset();
    this.anims.scale_up.Reset();
    this.anims.scale_down.Reset();
    this.anims.transparent.Reset();
  }
}

function Instantiation() {
  headPanelLeft = new HeadPanel(script.parentLeft, script.choiceLeft, choiceLeftTexture);
  headPanelRight = new HeadPanel(script.parentRight, script.choiceRight, choiceRightTexture);
}
