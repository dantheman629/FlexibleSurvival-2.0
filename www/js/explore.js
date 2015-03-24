

function exploreRaped(){
    startExplore(data.currentLocation.value);
}

function getEvents(events){
    var usable=[];
    var event;
    for(var key in events){
        event=data[events[key]];
        if(eventUsable(event))
            usable.push(event.event);
    }
    return usable;
}

function startExplore(area){
    addToDisplay("you started exploring "+area+"...");
    if(Math.random()<data.exploreChance.value){
        var usable=getEvents(data[area].events);
        var indx=getRandom(0,usable.length-1);
        usable[indx]();
    }
    if(Math.random()<data.fightChance.value){
        var usable=getMonsters(data[area].monsters);
        var indx=getRandom(0,usable.length-1);
        fightMonster(usable[indx], finishExplore);
    }
    else
        finishExplore();
}

function finishExplore(){
    setButtonsTravel();
    addToDisplay("you returned to "+data.currentLocation.value+" after exploring");
    finishTurn({day:0, hour:2, minute:0});
}

function eventUsable(event){
    return event.unresolved.value;
}