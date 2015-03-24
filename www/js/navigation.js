function startNav(area){
    addToDisplay("You start travelling to "+area+".");
    if(Math.random()<data.fightChance.value){
        var usable=getMonsters(data[data.currentLocation.value].monsters);
        var indx=getRandom(0,usable.length-1);
        fightMonster(usable[indx], function (){finishNav(area)});
    }
    else{
        finishNav(area);
    }
}

function finishNav(area){
    data.currentLocation.value=area;
    addToDisplay("You arrive at "+area+".");
    setButtonsTravel();
}

function describeLocation(locName){
    addToDisplayNoLine("<b>"+data[locName].name+"</b>");
    addToDisplay(data[locName].description);
}

function describeCurrentLocation(){
    addToDisplayNoLine("<b>"+data[data.currentLocation.value].name+":</b>");
    addToDisplay(data[data.currentLocation.value].description);
}

function goNorth(){
    nowIs(data[data.currentLocation.value].north, "known");
    setLocation(data[data.currentLocation.value].north);
}

function goSouth(){
    nowIs(data[data.currentLocation.value].south, "known");
    setLocation(data[data.currentLocation.value].south);
}
function goEast(){
    nowIs(data[data.currentLocation.value].north, "known");
    setLocation(data[data.currentLocation.value].east);
}

function goWest(){
    nowIs(data[data.currentLocation.value].north, "known");
    setLocation(data[data.currentLocation.value].west);
}

function goNorthEast(){
    nowIs(data[data.currentLocation.value].north, "known");
    setLocation(data[data.currentLocation.value].northeast);
}

function goSouthEast(){
    nowIs(data[data.currentLocation.value].north, "known");
    setLocation(data[data.currentLocation.value].southeast);
}
function goNorthWest(){
    nowIs(data[data.currentLocation.value].north, "known");
    setLocation(data[data.currentLocation.value].northwest);
}

function goSouthWest(){
    nowIs(data[data.currentLocation.value].north, "known");
    setLocation(data[data.currentLocation.value].southwest);
}

function setLocation(locName){
    data.currentLocation.value=locName;
    setButtonsTravel();
    describeCurrentLocation();
}

function navRaped(){
    setButtonsNavigate();
}