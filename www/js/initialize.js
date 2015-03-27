
var data={turn:{type:"number", value:0}, time:{type:"time", day:0, hour:12, minute:0}, remaining:{day:0, hour:12, minute:0}, currentLocation:{type:"text", value:"entrance"}, exploreChance:{type:"number", value:0.5}, fightChance:{type:"number", value:0.5}, navLocs:["entrance", "north", "mall"], combatState:{name:"latexFox", maxHp:0, hp:0}};

var savableData=[{name:"turn", type:"number"}, {name:"currentLocation", type:"text"}, {name:"exploreChance", type:"number"}, {name:"fightChance", type:"number"}];

var otherwiseStates=[];

var waitingStates=[];
        
var player={maxHp:{type:"number", value:100}, hp:{type:"number", value:100}, cunts:{type:"number", value:0}, cocks:{type:"number", value:1}, attack:10, feats:{type:"list", value:[]}};

player["cunt length"]={type:"number", value:30};
var definitions={};

data.player=player;

function isSubmissive(name){
    return name == "submissive";
}

var functions={submissive:isSubmissive};

var inlines={if:/^if /, otherwise:/^otherwise(?! if )/, otherwiseIf:/^otherwise if /, oneOf:/^one of/, or:/^or/, at:/^at /, endIf:/^end if/};

var complete="yes done";