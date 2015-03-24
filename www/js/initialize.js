
var data={turn:{type:"number", value:0}, time:{day:0, hour:12, minute:0}, remaining:{day:0, hour:12, minute:0}, currentLocation:{type:"text", value:"entrance"}, exploreChance:{type:"number", value:0.5}, fightChance:{type:"number", value:0.5}, navLocs:["entrance", "north", "mall"], combatState:{name:"latexFox", maxHp:0, hp:0}};

var otherwiseStates=[];
        
var player={maxHp:100, hp:100, attack:10};

var definitions={};

data.player=player;

function isSubmissive(name){
    return name == "submissive";
}

var functions={submissive:isSubmissive};

var inlines={if:/^if /, otherwise:/^otherwise (?!if )/, otherwiseIf:/^otherwise if /, oneOf:/^one of/, or:/^or/, at:/^at /, endIf:/^end if/};

