
var curdisplay="";
var buttonNames=["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "b10", "b11", "b12", "b13", "b14", "b15"];

function getRandom(a,b){
    var r=a+Math.floor(Math.random()*(b+1-a));
    if(r>b)
        return b;
    return r;
}

function nowIs(name, value){
    var obj=findObject(name);
    if(obj.type == "text" || obj.type == "number"){
        obj.value=value;
    }
    else{
        obj[value].value=true;
        var others=obj[value].others;
        for(var key in others){
            obj[others[key]]=false;
        }
    }
}

function nowIsNot(name, value){
    var obj=findObject(name);
    obj[value].value=false;
}


function addTime(time){
    data.time.day=data.time.day+time.day;
    data.time.hour=data.time.hour+time.hour;
    data.time.minute=data.time.minute+time.minute;

    data.time.hour=data.time.hour+Math.floor(data.time.minute/60);
    data.time.minute=data.time.minute % 60;
    if(data.time.minute<0){
        data.time.hour=data.time.hour;
        data.time.minute=datat.time.minute+60;
    }

    data.time.day=data.time.day+Math.floor(data.time.hour/24);
    data.time.hour=data.time.hour % 24;
    if(data.time.hour<0){
        data.time.day=data.time.day;
        data.time.hour=data.time.hour+24;
    }
}

function addRemaining(time){
    data.remaining.day=data.remaining.day+time.day;
    data.remaining.hour=data.remaining.hour+time.hour;
    data.remaining.minute=data.remaining.minute+time.minute;
    data.remaining.hour=data.remaining.hour+Math.floor(data.remaining.minute/60);
    data.remaining.minute=data.remaining.minute % 60;
    if(data.remaining.minute<0){
        data.remaining.hour=data.remaining.hour;
        data.remaining.minute=data.remaining.minute+60;
    }

    data.remaining.day=data.remaining.day+Math.floor(data.remaining.hour/24);
    data.remaining.hour=data.remaining.hour % 24;
    if(data.remaining.hour<0){
        data.remaining.day=data.remaining.day;
        data.remaining.hour=data.remaining.hour+24;
    }
}

function finishTurn(time){
    data.turn.value=data.turn.value+1;
    addTime(time);
    time.day=time.day*-1;
    time.hour=time.hour*-1;
    time.minute=time.minute*-1;
    addRemaining(time);
    updateAll();
}

function updateAll(){
    updateHealth();
    updateTime();
    updateTurns();
    updateRemaining();
}

function addThing(loc, name, thing){
    data[loc].things[name]=thing;
}