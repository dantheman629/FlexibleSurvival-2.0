function disableAllButtons(){
    var i;
    for(i=0; i<buttonNames.length; i++){
        disableButton(document.getElementById(buttonNames[i]));
    }
}

function enableButton(b, n, f){
    b.innerHTML=n;
    b.disabled=false;
    b.onclick=f;
}

function disableButton(b){
    b.innerHTML="<br />";
    b.disabled=true;
}

function setButtonsActions(){
    disableAllButtons();
    var curLoc=data[data.currentLocation.value];
    var b1=document.getElementById("b1");
    if('huntable' in curLoc){
        enableButton(b1, "hunt", huntRaped);
    }

    var b2=document.getElementById("b2");
    if('explorable' in curLoc){
        enableButton(b2, "explore", exploreRaped);
    }

    var b3=document.getElementById("b3");
    if('scavengable' in curLoc){
        enableButton(b3, "scavenge", scavengeRaped);
    }

    var i=0;
    var things=curLoc.things;
    var thing;
    for(var key in things){
        thing=things[key];
        if(thing.type == "action"){
            enableButton(document.getElementById(buttonNames[5+i]), thing.name, thing.action);
        }
        else if(thing.type == "thing"){
            enableButton(document.getElementById(buttonNames[5+i]), thing.name, function (){lookAtThing(thing);});
        }
        i++;
    }

    enableButton(document.getElementById("b15"), "move", setButtonsTravel);
}

function displayActions(actions){
    disableAllButtons();
    var i=0;
    for(var key in actions){
        enableButton(document.getElementById(buttonNames[i]), actions[key].name, actions[key].action);
        i++;
    }
}

function lookAtThing(thing){
    addToDisplay(thing.description);
    displayActions(thing.actions);
    enableButton(document.getElementById("b15"), "back", setButtonsActions);
}

function setButtonsNavigate(){
    disableAllButtons();
    var test;
    var i;
    var j=0;
    for(i=0; i<data.navLocs.length;i++){
        if(data[data.navLocs[i]].known.value){
            enableButton(document.getElementById(buttonNames[j]), data[data.navLocs[i]].name, function(){startNav(this.getAttribute("data-loc"));});
            document.getElementById(buttonNames[j]).setAttribute("data-loc",data.navLocs[i]);
            j++;
        }
    }
}

function setButtonsCombat(){
    disableAllButtons();

    enableButton(document.getElementById("b1"), "attack", function(){combatTurn("attack")});

    enableButton(document.getElementById("b2"), "wait", function(){combatTurn("wait")});

    enableButton(document.getElementById("b3"), "submit", function(){combatTurn("submit")});

    enableButton(document.getElementById("b4"), "flee", function(){combatTurn("flee")});
}

function setButtonsSingle(name, action){
    disableAllButtons();
    enableButton(document.getElementById("b1"), name, action);
}
        
function setButtonsTravel(){
    var curLoc=data[data.currentLocation.value];
    disableAllButtons();
    var b1=document.getElementById("b1");
    if('northwest' in curLoc){
        enableButton(b1, "northwest", goNorthWest);
    }
    var b2=document.getElementById("b2");
    if('north' in curLoc){
        enableButton(b2, "north", goNorth);
    }
    var b3=document.getElementById("b3");
    if('northeast' in curLoc){
        enableButton(b3, "northeast", goNorthEast);
    }

    enableButton(document.getElementById("b4"), "speak", sayHello);

    enableButton(document.getElementById("b5"), "smut", displaySmut);

    var b6=document.getElementById("b6");
    if('west' in curLoc){
        enableButton(b6, "west", goWest);
    }

    enableButton(document.getElementById("b7"), "current", describeCurrentLocation);

    var b8=document.getElementById("b8");
    if('east' in curLoc){
        enableButton(b8, "east", goEast);
    }

    enableButton(document.getElementById("b9"), "clear", clearDisplay);

    enableButton(document.getElementById("b10"), "debug", debugTest);

    var b11=document.getElementById("b11");
    if('southwest' in curLoc){
        enableButton(b11, "southwest", goSouthWest);
    }
    var b12=document.getElementById("b12");
    if('south' in curLoc){
        enableButton(b12, "south", goSouth);
    }
    var b13=document.getElementById("b13");
    if('southeast' in curLoc){
        enableButton(b13, "southeast", goSouthEast);
    }

    var b14=document.getElementById("b14");
    if('navable' in curLoc && curLoc.navable){
        enableButton(b14, "navigate", navRaped);
    }

    enableButton(document.getElementById("b15"), "actions", setButtonsActions);
}