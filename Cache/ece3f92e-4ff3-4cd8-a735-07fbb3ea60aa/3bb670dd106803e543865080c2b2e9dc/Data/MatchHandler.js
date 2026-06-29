//@input SceneObject parent
//@ui {"widget":"separator"}
//@ui {"widget":"label", "label":"LEFT HEAD PANEL "}
//@input Asset.Texture choiceLeftTexture
//@input Asset.Texture choiceLeftSelectedTexture
//@input Asset.Texture makeUpLeftTexture
//@ui {"widget":"separator"}
//@ui {"widget":"label", "label":"RIGHT HEAD PANEL "}
//@input Asset.Texture choiceRightTexture
//@input Asset.Texture choiceRightSelectedTexture
//@input Asset.Texture makeUpRightTexture

//_________________________Director Setup_________________________//
script.subScene = new global.SubScene(script, script.parent);
script.subScene.OnStart = Start;
script.subScene.OnLateStart = OnLateStart;
script.subScene.OnStop = Stop;
script.subScene.SetUpdate(Update);
//__________________________Variables_____________________________//

global.choiceLeftTexture = script.choiceLeftTexture;
global.choiceRightTexture = script.choiceRightTexture;

global.makeUpLeftTexture = script.makeUpLeftTexture;
global.makeUpRightTexture = script.makeUpRightTexture;

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
