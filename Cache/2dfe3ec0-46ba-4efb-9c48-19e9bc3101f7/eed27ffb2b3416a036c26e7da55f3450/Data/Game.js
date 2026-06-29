//@input SceneObject parent

//@input float animDuration = 0.5
//@input float timeBetweenRounds = 1.0

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

const choiceLeftTexture = global.choiceLeftTexture;
const choiceRightTexture = global.choiceRightTexture;

const makeUpLeftTexture = global.makeUpLeftTexture;
const makeUpRightTexture = global.makeUpRightTexture;

//________Caller________//
//________Listener________//
//________DelayEvent________//

//_________________________Director_Functions_____________________//
function Start() {}
function OnLateStart() {}
function Update() {}
function Stop() {}
//___________________________Functions__________________________//

//___________________________Animations_________________________//

//__________________________Classes_____________________________//

class HeadPanel {
  constructor(parentObject, imageObject, texture) {
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

    this.initAnimations();
    this.resetAnimations();
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

  headPanelRight = new HeadPanel(
    script.parentRight,
    script.choiceRight,
    choiceRightTexture
  );

    
  );
  headPanelRight.setTexture(script.flavoursTextures[selectedFlavours[1]]);
  headPanelRight.anims.fade.GoTo(1);
}
