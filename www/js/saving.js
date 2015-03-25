function getListOfVariables(){
    var keys=[];
    for(var key in savableData){
        ret.keys.push(savableData[key].name);
    }
    return keys;
}

function restoreSaveWebStorage(storage){
    var keys=getListOfVariables();
    var value;
    for(key in keys){
        value=localStorage.getItem(storage+"|"+keys[key]);
        restoreValue(keys[key], value);
    }
}

function restoreValue(key,value){
    var realValue=convertToValue(value);
    findObject(key).value=realValue;
}

function convertToValue(input){
    var parts=input.split("|");
    if(parts[0] == "boolean"){
        return parts[1] == "true";
    }
    else if(parts[0] == "number")
        return parseInt(parts[1]);
    else
        return parts[1];
}