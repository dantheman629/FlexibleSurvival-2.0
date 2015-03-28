
var data={turn:{type:"number", value:0}, time:{type:"time", day:0, hour:12, minute:0}, remaining:{day:0, hour:12, minute:0}, currentLocation:{type:"text", value:"entrance"}, exploreChance:{type:"number", value:0.5}, fightChance:{type:"number", value:0.5}, navLocs:["entrance", "north", "mall"], combatState:{name:"latexFox", maxHp:0, hp:0}, thing:{type:"thing"}};

var savableData=[{name:"turn", type:"number"}, {name:"currentLocation", type:"text"}, {name:"exploreChance", type:"number"}, {name:"fightChance", type:"number"}];

var otherwiseStates=[];

var waitingStates=[];

var defaultText=parseInput("");

        
var player={maxHp:{type:"number", value:100}, hp:{type:"number", value:100}, cunts:{type:"number", value:0}, cocks:{type:"number", value:1}, attack:10, feats:{type:"list", value:[]}};

player[""]={type:"text", value:defaultText};

player[""]={type:"number", value:0};

player["name"]={type:"text", value:defaultText};
player["Energy"]={type:"number", value:0};
player["MaxHP"]={type:"number", value:0};
player["Strength"]={type:"number", value:0};
player["Stamina"]={type:"number", value:0};
player["Charisma"]={type:"number", value:0};
player["Intelligence"]={type:"number", value:0};
player["Perception"]={type:"number", value:0};
player["Hunger"]={type:"number", value:0};
player["Morale"]={type:"number", value:0};
player["Humanity"]={type:"number", value:0};
player["Hunger"]={type:"number", value:0};
player["cocks"]={type:"number", value:0};
player["testes"]={type:"number", value:0};
player["breasts"]={type:"number", value:0};
player["cunts"]={type:"number", value:0};
player["Breast Size"]={type:"number", value:0};
player["Cock length"]={type:"number", value:0};
player["Cock Width"]={type:"number", value:0};
player["Cunt length"]={type:"number", value:0};
player["Cunt width"]={type:"number", value:0};
player["armor"]={type:"number", value:0};
player["capacity"]={type:"number", value:0};
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

data.player=player;

function isSubmissive(name){
    return name == "submissive";
}

var functions={submissive:isSubmissive};

var inlines={if:/^if /, otherwise:/^otherwise(?! if )/, otherwiseIf:/^otherwise if /, oneOf:/^one of/, or:/^or/, at:/^at |^stopping$|^purely at random$/, endIf:/^end if/};

var complete="yes done";