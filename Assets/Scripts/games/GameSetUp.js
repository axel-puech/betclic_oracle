//@ui {"widget":"label", "label":"____________________GAME DATE____________________"}

//@input int month {"widget":"combobox", "values":[{"label":"Janvier", "value":0}, {"label":"Février", "value":1}, {"label":"Mars", "value":2}, {"label":"Avril", "value":3}, {"label":"Mai", "value":4}, {"label":"Juin", "value":5}, {"label":"Juillet", "value":6}, {"label":"Août", "value":7}, {"label":"Septembre", "value":8}, {"label":"Octobre", "value":9}, {"label":"Novembre", "value":10}, {"label":"Décembre", "value":11}]}

//@input int day {"widget":"combobox", "values":[{"label":"01", "value":1}, {"label":"02", "value":2}, {"label":"03", "value":3}, {"label":"04", "value":4}, {"label":"05", "value":5}, {"label":"06", "value":6}, {"label":"07", "value":7}, {"label":"08", "value":8}, {"label":"09", "value":9}, {"label":"10", "value":10}, {"label":"11", "value":11}, {"label":"12", "value":12}, {"label":"13", "value":13}, {"label":"14", "value":14}, {"label":"15", "value":15}, {"label":"16", "value":16}, {"label":"17", "value":17}, {"label":"18", "value":18}, {"label":"19", "value":19}, {"label":"20", "value":20}, {"label":"21", "value":21}, {"label":"22", "value":22}, {"label":"23", "value":23}, {"label":"24", "value":24}, {"label":"25", "value":25}, {"label":"26", "value":26}, {"label":"27", "value":27}, {"label":"28", "value":28}, {"label":"29", "value":29}, {"label":"30", "value":30}, {"label":"31", "value":31}]}

//@input int year {"widget":"combobox", "values":[{"label":"2026", "value":2026}, {"label":"2027", "value":2027}, {"label":"2028", "value":2028}, {"label":"2029", "value":2029}, {"label":"2030", "value":2030}]}

//@input int hour {"widget":"combobox", "values":[{"label":"00", "value":0}, {"label":"01", "value":1}, {"label":"02", "value":2}, {"label":"03", "value":3}, {"label":"04", "value":4}, {"label":"05", "value":5}, {"label":"06", "value":6}, {"label":"07", "value":7}, {"label":"08", "value":8}, {"label":"09", "value":9}, {"label":"10", "value":10}, {"label":"11", "value":11}, {"label":"12", "value":12}, {"label":"13", "value":13}, {"label":"14", "value":14}, {"label":"15", "value":15}, {"label":"16", "value":16}, {"label":"17", "value":17}, {"label":"18", "value":18}, {"label":"19", "value":19}, {"label":"20", "value":20}, {"label":"21", "value":21}, {"label":"22", "value":22}, {"label":"23", "value":23}]}

//@input int minutes {"widget":"combobox", "values":[{"label":"00", "value":0}, {"label":"05", "value":5}, {"label":"10", "value":10}, {"label":"15", "value":15}, {"label":"20", "value":20}, {"label":"25", "value":25}, {"label":"30", "value":30}, {"label":"35", "value":35}, {"label":"40", "value":40}, {"label":"45", "value":45}, {"label":"50", "value":50}, {"label":"55", "value":55}]}

//@ui {"widget":"separator"}
//@ui {"widget":"label", "label":"OPPONENT LEFT"}
//@input string nameL
//@input Asset.Texture imageTeamL
//@input Asset.Texture makeUpL

//@input vec4 teamLeftColor1 {"widget":"color"}
//@input vec4 teamLeftColor2 {"widget":"color"}
//@input vec4 teamLeftColor3 {"widget":"color"}

//@ui {"widget":"separator"}
//@ui {"widget":"label", "label":"OPPONENT RIGHT"}
//@input string nameR
//@input Asset.Texture imageTeamR
//@input Asset.Texture makeUpR

//@input vec4 teamRightColor1 {"widget":"color"}
//@input vec4 teamRightColor2 {"widget":"color"}
//@input vec4 teamRightColor3 {"widget":"color"}

const gameName = script.nameL + " vs " + script.nameR;
const gameDate = new Date(script.year, script.month, script.day, script.hour, script.minutes);

const data = {
  gameName: gameName,
  date: gameDate,
  teamLeft: {
    nameL: script.nameL,
    imageTeamL: script.imageTeamL,
    makeUpL: script.makeUpL,
    teamLeftColor1: script.teamLeftColor1,
    teamLeftColor2: script.teamLeftColor2,
    teamLeftColor3: script.teamLeftColor3,
  },
  teamRight: {
    nameR: script.nameR,
    imageTeamR: script.imageTeamR,
    makeUpR: script.makeUpR,
    teamRightColor1: script.teamRightColor1,
    teamRightColor2: script.teamRightColor2,
    teamRightColor3: script.teamRightColor3,
  },
};

if (!global.gameData) {
  global.gameData = [];
}
global.gameData.push(data);
