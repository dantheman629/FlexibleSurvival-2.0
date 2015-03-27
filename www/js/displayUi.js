
function updateTime(){
    document.getElementById("time").innerHTML=displayTime();
}

function updateHealth(){
    document.getElementById("health").innerHTML=displayHealth();
}

function updateTurns(){
    document.getElementById("turns").innerHTML=displayTurns();
}

function updateRemaining(){
    document.getElementById("remaining").innerHTML=displayRemaining();
}

function addToDisplay(text) {
    var display = document.getElementById("display");
    curdisplay=curdisplay+text+"<br /><br />"; 
    display.innerHTML=curdisplay; 
    display.scrollTop = display.scrollHeight;
}

function appendToDisplay(text) {
    var display = document.getElementById("display");
    curdisplay=curdisplay+text; 
    display.innerHTML=curdisplay; 
    display.scrollTop = display.scrollHeight;
}

function displayHealth(){
    return "Health: "+data.player.hp.value+"/"+data.player.maxHp.value;
}

function displayEnemyHealth(){
    return "Health: "+data.combatState.hp+"/"+data.combatState.maxHp;
}
        
function displayTurns(){
    return "Turn: "+data.turn.value;
}

function addToDisplayNoLine(text){
    var display = document.getElementById("display");
    curdisplay=curdisplay+text+"<br />"; 
    display.innerHTML=curdisplay; 
    display.scrollTop = display.scrollHeight;
}

function clearDisplay() {
    curdisplay=""; 
    document.getElementById("display").innerHTML=curdisplay; 
}

function displaySmut(){
    var display = document.getElementById("display");
    curdisplay=curdisplay+'<img src="testpic.jpg">'+"<hr />";
    display.innerHTML=curdisplay; 
    display.scrollTop = display.scrollHeight;
}
        
function displayTime(){
    var half;
    var hour;
    var minute;
    if(data.time.hour<12){
        half="AM";
        hour=data.time.hour;
    }
    else{
        half="PM";
        hour=data.time.hour-12;
    }
    if(hour == 0)
        hour=12;
    if(hour<10){
        hour="0"+hour.toString();
    }
    else
        hour=hour.toString();
    minute="e";
    if(data.time.minute==0)
        minute="00";
    else if(data.time.minute<10)
        minute="0"+data.time.minute.toString();
    else
        minute=data.time.minute.toString();
    return "Current time: "+hour+":"+minute+" "+half;
}

function displayRemaining(){
    var days;
    var hour;
    var minute;
    days=data.remaining.day.toString();
    days=days+"d";
    hour=data.remaining.hour;
    if(hour<10){
        hour="0"+hour.toString();
    }
    else
        hour=hour.toString();
    hour=hour+"h";
    minute="e";
    if(data.remaining.minute==0)
        minute="00";
    else if(data.remaining.minute<10)
        minute="0"+data.remaining.minute.toString();
    else
        minute=data.remaining.minute.toString();
    minute=minute+"m";
    return "Time left: "+days+" "+hour+" "+minute;
}