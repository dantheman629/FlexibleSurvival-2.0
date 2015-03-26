data.simpletest={type:"text", value:"hi"};

data.simple={type:"thing", test1:{type:"text", value:"hi"}, test2:{type:"number", value:42}, testOp:{type:"option", value:false, others:["testOp1", "testOp2"]}, testOp1:{type:"option", value:true, others:["testOp", "testOp2"]}, testOp2:{type:"option", value:true, others:["testOp1", "testOp"]}};

data.testE1={type:"event", event:testEvent1, resolved:{type:"option", value:false, others:["unresolved"]}, unresolved:{type:"option", value:true, others:["resolved"]}};

data.testE2={type:"event", event:testEvent2, resolved:{type:"option", value:false, others:["unresolved"]}, unresolved:{type:"option", value:true, others:["resolved"]}};

data.latexFox={type:"monster", name:"latex fox", description:function (){addToDisplay("There's a latex fox infront of you.  It's a fox that appears to be made of latex.")}, submitScene:function (){addToDisplay("You submit and get fucked by a latex fox")}, defeatScene:function (){addToDisplay("You are beat up by a latex fox and get fucked.")}, victoryScene:function (){addToDisplay("You beat up a latex fox and fuck it.")}, maxHp:50, attack:10};

data.huskyBitch={type:"monster", name:"husky bitch", description:function (){addToDisplay("There's a husky bitch infront of you.  She's also husky looking and all slutty and shit.")}, submitScene:function (){addToDisplay("You submit and get fucked by a husky")}, defeatScene:function (){addToDisplay("You are beat up by a husky and get fucked.")}, victoryScene:function (){addToDisplay("You beat up a husky and fuck it.")}, maxHp:100, attack:5};

data.testBoolArray={type:"boolean list", value:[false, false, false]};
savableData.push({name:"testBoolArray", type:"boolean list"});
data.testText={type:"text", value:"hello there"};
savableData.push({name:"testText", type:"text"});

function testEvent1(){
    addToDisplay("While exploring something happened that invloved you getting raped");
}

function testEvent2(){
    addToDisplay("While exploring something happened that invloved you getting raped twice.  Oh and you found the mall on your way back");
    nowIs("testE2", "resolved");
    nowIs("mall", "known");
}

function testEventF(){
    addToDisplay("I'm a test event function");
}

function doFSAction(){
    addToDisplay("Something happened, but what?");
}

function sayHello(){
    addToDisplay("Hello");
}

function scavengeRaped(){
    addToDisplay("Yay you scavenged something and got raped");   
}

function huntRaped(){
    addToDisplay("Yay you hunted something and got raped");   
}

function testf(){
    return "testf";
}

var entrance={type:"location", name:'entrance', description:'whole lotta nothing except for a thing and the ability to do an action. should be able to nav,explore,scavange, and hunt', things:[], navable:true, explorable:true, scavengable:true, huntable:true, north:"north", northwest:"northwest", west:"west", southwest:"southwest", south:"south", southeast:"southeast", east:"east", northeast:"northeast", events:[], monsters:[], known:{type:"option", value:true, others:[]}};

var south={type:"location", name:'south', description:'whole lotta nothing but in the south. should be able to explore', explorable:true, north:"entrance", northwest:"west", west:"southwest", east:"southeast", northeast:"east", things:[], events:[], monsters:[], known:{type:"option", value:false, others:[]}};

var southeast={type:"location", name:'southeast', description:'whole lotta nothing but in the southeast', north:"east", northwest:"entrance", west:"south", things:[], events:[], monsters:[]};

var east={type:"location", name:'east', description:'whole lotta nothing but in the east', north:"northeast", northwest:"north", west:"entrance", southwest:"south", south:"southeast", things:[], events:[], monsters:[], known:{type:"option", value:false, others:[]}};

var northeast={type:"location", name:'northeast', description:'whole lotta nothing but in the northeast', south:"east", southwest:"entrance", west:"north", things:[], events:[], monsters:[], known:{type:"option", value:false, others:[]}};

var north={type:"location", name:'north', description:'whole lotta nothing but in the north. should be able to nav', navable:true, west:"northwest", southwest:"west", south:"entrance", southeast:"east", east:"northeast", things:[], events:[], monsters:[], known:{type:"option", value:false, others:[]}};

var northwest={type:"location", name:'northwest', description:'whole lotta nothing but in the northwest', south:"west", southeast:"entrance", east:"north", things:[], events:[], monsters:[], known:{type:"option", value:false, others:[]}};

var west={type:"location", name:'west', description:'whole lotta nothing but in the west', north:"northwest", south:"southwest", southeast:"south", east:"entrance", northeast:"north", things:[], events:[], monsters:[], known:{type:"option", value:false, others:[]}};

var southwest={type:"location", name:'southwest', description:'whole lotta nothing but in the southwest', north:"west", northeast:"entrance", east:"south", things:[], events:[], monsters:[], known:{type:"option", value:false, others:[]}};
var mall={type:"location", name:'Smith Haven Mall', navable:true, description:'hey you\'re at the mall, congratulations.  Unfortunatley it looks like there\'s nothing here yet', navable:true, things:[], events:[], monsters:[], known:{type:"option", value:false, others:[]}};

var doSomething={type:"action", name:"action", action:doFSAction};
entrance.things.something=doSomething;


data.entrance=entrance;
data.north=north;
data.northwest=northwest;
data.northeast=northeast;
data.west=west;
data.east=east;
data.south=south;
data.southwest=southwest;
data.southeast=southeast;
data.mall=mall;
data.entrance.events.push("testE1");
data.entrance.events.push("testE2");
data.entrance.monsters.push("latexFox");
data.entrance.monsters.push("huskyBitch");
data.mall.monsters.push("latexFox");
data.mall.monsters.push("huskyBitch");
data.north.monsters.push("latexFox");
data.north.monsters.push("huskyBitch");

var aThing={type:"thing", name:"thing", description:"Its a thing alrgiht.", actions:[], data:{}}
var fuck={type:"action", name:"fuck", action:function (){ addToDisplay("Wow you would fuck a thing?");}};
aThing.actions.fuck=fuck;
var talk={type:"action", name:"talk", action:function (){addToDisplay("Its a thing it doesn't talk.");}};
aThing.actions.talk=talk;
addThing("entrance", "thing", aThing);

function debugTest(){
    readFile("inform/Giraffe for FS.i7x");
}