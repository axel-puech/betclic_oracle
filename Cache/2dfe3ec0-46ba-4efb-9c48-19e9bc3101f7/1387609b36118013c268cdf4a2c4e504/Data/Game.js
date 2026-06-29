//@input SceneObject parent
//@input Asset.Texture[] choicesTextures
//@input int maxRound = 5
//@input float animDuration = 0.5
//@input float timeBetweenRounds = 1.0

//@ui {"widget":"separator"}
//@ui {"widget":"label", "label":"LEFT HEAD PANEL "}
//@input SceneObject parentLeft
//@input SceneObject flavourLeft

//@ui {"widget":"separator"}
//@ui {"widget":"label", "label":"RIGHT HEAD PANEL "}
//@input SceneObject parentRight
//@input SceneObject flavourRight

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
