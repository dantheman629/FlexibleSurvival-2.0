
var data={turn:{type:"number", value:0}, time:{type:"time", day:0, hour:12, minute:0}, remaining:{day:0, hour:12, minute:0}, currentLocation:{type:"text", value:"entrance"}, exploreChance:{type:"number", value:0.5}, fightChance:{type:"number", value:0.5}, navLocs:["entrance", "north", "mall"], combatState:{name:"latexFox", maxHp:0, hp:0}, thing:{type:"thing"}};

var savableData=[{name:"turn", type:"number"}, {name:"currentLocation", type:"text"}, {name:"exploreChance", type:"number"}, {name:"fightChance", type:"number"}];

var otherwiseStates=[];

var waitingStates=[];

var defaultText=parseInput("");

var person={};


person["hp".toLowerCase()]={type:"number", value:0};
person["xp".toLowerCase()]={type:"number", value:0};
person["level".toLowerCase()]={type:"number", value:0};
person["dexterity".toLowerCase()]={type:"number", value:0};
person["thirst".toLowerCase()]={type:"number", value:0};
person["lust".toLowerCase()]={type:"number", value:0};
person["libido".toLowerCase()]={type:"number", value:0};
person["linkaction".toLowerCase()]={type:"text", value:defaultText};
person["Weapon damage".toLowerCase()]={type:"number", value:4};
person["conversation".toLowerCase()]={type:"list", ltype:"text", value:[]};
data.person=person;
data.monser={type:"number", value:0};

var player=clone(person);

player[""]={type:"text", value:defaultText};

player[""]={type:"number", value:0};

player["name".toLowerCase()]={type:"text", value:defaultText};
player["Energy".toLowerCase()]={type:"number", value:0};
player["maxHP".toLowerCase()]={type:"number", value:0};
player["Strength".toLowerCase()]={type:"number", value:0};
player["Stamina".toLowerCase()]={type:"number", value:0};
player["Charisma".toLowerCase()]={type:"number", value:0};
player["Intelligence".toLowerCase()]={type:"number", value:0};
player["Perception".toLowerCase()]={type:"number", value:0};
player["Hunger".toLowerCase()]={type:"number", value:0};
player["Morale".toLowerCase()]={type:"number", value:0};
player["Humanity".toLowerCase()]={type:"number", value:0};
player["Hunger".toLowerCase()]={type:"number", value:0};
player["cocks".toLowerCase()]={type:"number", value:1};
player["testes".toLowerCase()]={type:"number", value:0};
player["breasts".toLowerCase()]={type:"number", value:0};
player["cunts".toLowerCase()]={type:"number", value:0};
player["Breast Size".toLowerCase()]={type:"number", value:0};
player["Cock length".toLowerCase()]={type:"number", value:0};
player["Cock Width".toLowerCase()]={type:"number", value:0};
player["Cunt length".toLowerCase()]={type:"number", value:0};
player["Cunt width".toLowerCase()]={type:"number", value:0};
player["armor".toLowerCase()]={type:"number", value:0};
player["capacity".toLowerCase()]={type:"number", value:0};

player["skin".toLowerCase()]={type:"text", value:parseInput("smooth")};
player["cock".toLowerCase()]={type:"text", value:parseInput("[one of]normal[or]flesh-toned[or]uninfected[or]human[at random]")};
player["face".toLowerCase()]={type:"text", value:parseInput("charmingly human")};
player["tail".toLowerCase()]={type:"text", value:parseInput("")};
player["body".toLowerCase()]={type:"text", value:parseInput("body")};
player["bodyname".toLowerCase()]={type:"text", value:parseInput("human")};
player["facename".toLowerCase()]={type:"text", value:parseInput("human")};
player["cockname".toLowerCase()]={type:"text", value:parseInput("human")};
player["skinname".toLowerCase()]={type:"text", value:parseInput("human")};
player["Cock Size Desc".toLowerCase()]={type:"text", value:parseInput("")};
player["Cunt Size Desc".toLowerCase()]={type:"text", value:parseInput("")};
player["Breast Size Desc".toLowerCase()]={type:"text", value:parseInput("")};
player["Short Breast Size Desc".toLowerCase()]={type:"text", value:parseInput("")};
player["weapon".toLowerCase()]={type:"text", value:parseInput("[one of]your quick wit[or]your fists[or]a quick kick[or]your body[or]some impromptu wrestling[or]an unarmed strike[at random]")};
player["weapon type".toLowerCase()]={type:"text", value:parseInput("Melee")};

player["feats"]={type:"list", ltype:"text", value:[]};
data.player=player;


var definitions={};

var tables={};
tables["random critters"]={rows:[], types:{name:"text", attack:"text", defeated:"text", victory:"text", desc:"text", face:"text", body:"text", skin:"text", tail:"text", cock:"text", str:"number", dex:"number", sta:"number", per:"number", int:"number", cha:"number", sex:"text", hp:"number", lev:"number", wdam:"number", area:"text", cocks:"number", breasts:"number", cunts:"number", libido:"number", loot:"text", lootchance:"number", scale:"number", type:"entry", magic:"option", resbypass:"option", nocturnal:"option", altcombat:"text"}};

var currentTable="";

var playBegins=[];

tables["random critters"].types["face change"]="text";
tables["random critters"].types["body change"]="text";
tables["random critters"].types["skin change"]="text";
tables["random critters"].types["ass change"]="text";
tables["random critters"].types["cock change"]="text";
tables["random critters"].types["cock length"]="number";
tables["random critters"].types["cock width"]="number";
tables["random critters"].types["breast size"]="number";
tables["random critters"].types["male breast size"]="number";
tables["random critters"].types["cunt length"]="number";
tables["random critters"].types["cunt width"]="number";
tables["random critters"].types["body descriptor"]="number";
tables["random critters"].types["non-infectious"]="number";


function isSubmissive(name){
    return name == "submissive";
}

var functions={submissive:isSubmissive};

var inlines={if:/^if /, otherwise:/^otherwise(?! if )/, otherwiseIf:/^otherwise if /, oneOf:/^one of/, or:/^or/, at:/^at |^stopping$|^purely at random$/, endIf:/^end if/};

var complete="yes done";