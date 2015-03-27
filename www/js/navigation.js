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
    setLocation(data[data.currentLocation.value].north);
}

function goSouth(){
    setLocation(data[data.currentLocation.value].south);
}
function goEast(){
    addToDisplay("go east");
    setLocation(data[data.currentLocation.value].east);
}

function goWest(){
    setLocation(data[data.currentLocation.value].west);
}

function goNorthEast(){
    setLocation(data[data.currentLocation.value].northeast);
}

function goSouthEast(){
    addToDisplay("go south east");
    setLocation(data[data.currentLocation.value].southeast);
}
function goNorthWest(){
    setLocation(data[data.currentLocation.value].northwest);
}

function goSouthWest(){
    setLocation(data[data.currentLocation.value].southwest);
}

function setLocation(locName){
    addToDisplay("test1");
    data.currentLocation.value=locName;
    addToDisplay("test2");
    nowIs(data.currentLocation.value, "known");
    addToDisplay("test3");
    setButtonsTravel();
    addToDisplay("test4");
    describeCurrentLocation();
}

function navRaped(){
    setButtonsNavigate();
}