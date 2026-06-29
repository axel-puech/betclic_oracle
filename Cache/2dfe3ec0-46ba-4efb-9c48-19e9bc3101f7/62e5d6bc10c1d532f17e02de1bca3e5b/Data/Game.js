//@input SceneObject parent
//@input Asset.Texture[] flavoursTextures
//@input SceneObject or
//@input int maxRound = 5
//@input float animDuration = 0.5
//@input float timeBetweenRounds = 1.0

//@ui {"widget":"separator"}
//@ui {"widget":"label", "label":"LEFT HEAD PANEL "}
//@input SceneObject parentLeft
//@input SceneObject flavourLeft
//@input SceneObject flareLeft
//@input Component.VFXComponent particlesLeft

//@ui {"widget":"separator"}
//@ui {"widget":"label", "label":"RIGHT HEAD PANEL "}
//@input SceneObject parentRight
//@input SceneObject flavourRight
//@input SceneObject flareRight
//@input Component.VFXComponent particlesRight
//@input Component.AudioComponent[] Sounds

//_________________________Director Setup_________________________//
script.subScene = new global.SubScene(script, script.parent);
script.subScene.OnStart = Start;
script.subScene.OnLateStart = OnLateStart;
script.subScene.OnStop = Stop;
script.subScene.SetUpdate(Update);

//__________________________Variables_____________________________//

////////////////////////////////////////////////////////////////////
// A LIRE POUR TOI VAL LE BOSS QUI VA SURREMENT REPRENDRE CE CODE //
////////////////////////////////////////////////////////////////////

// On donne une liste de textures, les cards au dessus de la tete, elles vont etre choisies au hasard
// Mais on veut qu'il y ait toujours parmis elles les deux nouveaux parfums
// Les deux premiers parfums de la liste de textures apparaissent toujours
// parmis les elements selectionné aléatoirement !

// A la fin du jeu, le nom du parfum gagant n'est pas le meme que celui de la card
// parce que la liste des parfums envoyé par manon n'est pas synchro avec la liste des noms des parfum
// a redemander

// Bon week end, a dans 3 semaines :)

// fais une liste de 2 a flavoursTextures.length - 1
var FlavourList = Array.from(Array(script.flavoursTextures.length - 2).keys()).map((i) => i + 2);
var selectedFlavours = [];
var currentRound = 1;

var headPanelLeft = null;
var headPanelRight = null;

let animToReset = [];
let selectedSide = null;
let notSelectedSide = null;
let winnerFlavour = null;

//________Caller________//
const activateTrackingCaller = script.subScene.CreateCaller("activateTrackingEvent", 0);
const gameEndCaller = script.subScene.CreateCaller("gameEndEvent", 0);

//________Listener________//
const IntroEndListener = script.subScene.CreateListener("IntroEndEvent", OnIntroEnd);
const headMoveListener = script.subScene.CreateListener("headMoveEvent", OnHeadMove);
const retryListener = script.subScene.CreateListener("retryEvent", OnRetry);

//________DelayEvent________//

const animDelay = script.subScene.CreateEvent("DelayedCallbackEvent", OnAnimDelay);
const roundDelay = script.subScene.CreateEvent("DelayedCallbackEvent", OnRoundDelay);
const lastRoundDelay = script.subScene.CreateEvent("DelayedCallbackEvent", OnLastRoundDelay);
const afterMixDelay = script.subScene.CreateEvent("DelayedCallbackEvent", OnAfterMixDelay);

//_________________________Director_Functions_____________________//
function Start() {
  GenerateRandomFlavour();
  Instantiation();
  fadeOr.GoTo(1);
}
function OnLateStart() {}
function Update() {}
function Stop() {
  fadeOr.Reset();

  // creation of [0, 1 ... flavoursTextures.length-1] array to shuffle
  FlavourList = Array.from(Array(script.flavoursTextures.length - 2).keys()).map((i) => i + 2);

  // list of the flavours that will be selected during the game, it will always contain the two new flavours (index 0 and 1)
  selectedFlavours = [];

  // store the rounds, start at 1 because at the start of the game the first two flavours are already selected
  currentRound = 1;

  // Reference to the head panels to easily reset the animations at the end of each round
  animToReset = [];

  // store the selected Side
  selectedSide = null;
  notSelectedSide = null;
  winnerFlavour = null;

  // GenerateRandomFlavour();
}

//___________________________Functions__________________________//

function OnAfterMixDelay() {
  // after mix the old texture with the new one
  // update the current texture to be the new one
  // reset the mix texture animation
  script.Sounds[0].play(1);
  const newTexture = notSelectedSide._newTexture;
  notSelectedSide.setTexture(newTexture);
  notSelectedSide.anims.mix_texture.Reset();
}

function OnRetry() {
  fadeOr.Reset();

  // Reset all the variables
  FlavourList = Array.from(Array(script.flavoursTextures.length - 2).keys()).map((i) => i + 2);
  selectedFlavours = [];
  currentRound = 1;
  animToReset = [];
  selectedSide = null;
  notSelectedSide = null;
  winnerFlavour = null;

  // regenerate the flavours
  GenerateRandomFlavour();
  headPanelLeft.resetAnimations();
  headPanelRight.resetAnimations();
  // reset the textures with the new flavours
  headPanelLeft.setTexture(script.flavoursTextures[selectedFlavours[0]]);
  headPanelRight.setTexture(script.flavoursTextures[selectedFlavours[1]]);

  headPanelLeft.flavourIndex = selectedFlavours[0];
  headPanelRight.flavourIndex = selectedFlavours[1];
  headPanelLeft.anims.fade.GoTo(1);
  headPanelRight.anims.fade.GoTo(1);
  fadeOr.GoTo(1);
  roundDelay.event.reset(script.timeBetweenRounds);
}

function OnLastRoundDelay() {
  //
  print("Last round delay ended");
  headPanelLeft.anims.fade.GoTo(0);
  headPanelRight.anims.fade.GoTo(0);
  fadeOr.GoTo(0);
  gameEndCaller.Call(winnerFlavour);
}

function OnRoundDelay() {
  // after delay, reactivate tracking
  print("Round delay ended, reactivate tracking");
  activateTrackingCaller.Call(1);
}

function OnHeadMove(value) {
  if (value == 1) {
    currentRound += 1;

    // stop the tracking
    activateTrackingCaller.Call(0);
    LeftChoice();
    // Wait before resetting animations and updating texture
    animDelay.event.reset(script.timeBetweenRounds);
    selectedSide = headPanelLeft;
    notSelectedSide = headPanelRight;
  } else if (value == 2) {
    currentRound += 1;
    activateTrackingCaller.Call(0);
    RightChoice();
    // Wait before resetting animations and updating texture
    animDelay.event.reset(script.timeBetweenRounds);
    selectedSide = headPanelRight;
    notSelectedSide = headPanelLeft;
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

function OnAnimDelay() {
  // after the anim of selection played
  // reverse the anims
  animToReset.forEach((anim) => {
    anim.GoTo(0);
  });

  animToReset = [];

  // update the flavour of the non selected side
  // update the flavour ID
  notSelectedSide.flavourIndex = selectedFlavours[currentRound];
  if (currentRound === script.maxRound) {
    print("Game End");
    winnerFlavour = selectedSide.flavourIndex;
    print("Winner flavour index: " + winnerFlavour);
    lastRoundDelay.event.reset(script.timeBetweenRounds);
  } else {
    // Update the texture of the non selected side
    // Mix the texture of the left panel

    notSelectedSide.setNewTexture(script.flavoursTextures[selectedFlavours[currentRound]]);
    notSelectedSide.anims.mix_texture.GoTo(1);

    // After mix, set the new texture as the current texture
    // reset the mix animation
    afterMixDelay.event.reset(script.animDuration);

    // after delay, reactivate tracking
    roundDelay.event.reset(script.timeBetweenRounds);
  }
}

function OnIntroEnd() {
  // On the intro, tracking not activated, activate after intro
  print("Intro End received ");
  activateTrackingCaller.Call(1);
}

function GenerateRandomFlavour() {
  // create a ramdom list
  for (let i = FlavourList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [FlavourList[i], FlavourList[j]] = [FlavourList[j], FlavourList[i]];
  }
  // Extract maxRound number of elements from the shuffled list
  selectedFlavours = FlavourList.slice(0, script.maxRound);

  // extract 2 random indexes from the selected flavours list
  var index1 = Math.floor(Math.random() * selectedFlavours.length);
  var index2;
  do {
    index2 = Math.floor(Math.random() * selectedFlavours.length);
  } while (index2 === index1);

  // put the two first flavours in in the list at random position
  selectedFlavours[index1] = 0;
  selectedFlavours[index2] = 1;
  print("Selected flavours after setting: " + selectedFlavours);
}

//___________________________Animations_________________________//

const fadeOr = new Animation(script.getSceneObject(), 0.5, (ratio) => {
  script.or.getComponent("Component.Image").mainPass.baseColor = new vec4(1, 1, 1, ratio);
});

//__________________________Classes_____________________________//

class HeadPanel {
  constructor(parentObject, imageObject, particleEmitter, flareObject, isLeft, flavourIndex = 0) {
    this._parentObject = parentObject;
    this._imageObject = imageObject;
    this._particleEmitter = particleEmitter;
    this._flareObject = flareObject;
    this._isLeft = isLeft;
    this.flavourIndex = flavourIndex;

    this._currentTexture = null;
    this._newTexture = null;

    // Parent object
    this._parentTransform = this._parentObject.getTransform();

    // Image object
    this._image = this._imageObject.getComponent("Component.Image");

    // Flare object
    this._flareImage = this._flareObject.getComponent("Component.Image");

    this.anims = {
      fade: null,
      scale_up: null,
      scale_down: null,
      fade_flare: null,
      fade_particles: null,
      mix_texture: null,
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
    // Fade flare animation
    this.anims.fade_flare = new Animation(script.getSceneObject(), script.animDuration, (ratio) => {
      this._flareImage.mainPass.baseColor = new vec4(1, 1, 1, ratio);
    });
    this.anims.fade_particles = new Animation(script.getSceneObject(), 1, (ratio) => {
      this._particleEmitter.asset.properties["alphaRatio"] = ratio;
    });
    this.anims.mix_texture = new Animation(script.getSceneObject(), script.animDuration, (ratio) => {
      this._image.mainPass.mixRatio = ratio;
    });

    // make the not selected panel a bit transparent
    this.anims.transparent = new Animation(script.getSceneObject(), script.animDuration, (ratio) => {
      this._image.mainPass.alphaRatio = 1 - ratio * 0.5;
    });
  }

  setTexture(currentTexture) {
    this._currentTexture = currentTexture;
    this._image.mainPass.currentTexture = currentTexture;
  }
  setNewTexture(newTexture) {
    this._newTexture = newTexture;
    this._image.mainPass.newTexture = newTexture;
  }

  resetAnimations() {
    this.anims.fade.Reset();
    this.anims.scale_up.Reset();
    this.anims.scale_down.Reset();
    this.anims.fade_flare.Reset();
    this.anims.fade_particles.Reset();
    this.anims.mix_texture.Reset();
    this.anims.transparent.Reset();
  }
}

function Instantiation() {
  headPanelLeft = new HeadPanel(
    script.parentLeft,
    script.flavourLeft,
    script.particlesLeft,
    script.flareLeft,
    true,
    selectedFlavours[0],
  );
  headPanelLeft.setTexture(script.flavoursTextures[selectedFlavours[0]]);
  headPanelLeft.anims.fade.GoTo(1);

  headPanelRight = new HeadPanel(
    script.parentRight,
    script.flavourRight,
    script.particlesRight,
    script.flareRight,
    false,
    selectedFlavours[1],
  );
  headPanelRight.setTexture(script.flavoursTextures[selectedFlavours[1]]);
  headPanelRight.anims.fade.GoTo(1);
}
