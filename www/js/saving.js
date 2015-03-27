function restoreSaveWebStorage(storage){
    var i;
    var value;
    for(i=0; i<savableData.length; i++){
        value=localStorage.getItem(storage+" "+savableData[i].name);
        restoreValue(savableData[i], value);
    }
    addToDisplay("done");
    updateAll();
    //restoreOtherValues(storage);
}

function storeSaveWebStorage(storage){
    addToDisplay("starting");
    var i;
    var value;
    for(i=0; i<savableData.length; i++){
        value=getValue(savableData[i].name);
        localStorage.setItem(storage+" "+savableData[i].name, value);
    }
    localStorage.setItem(storage+" exists", "true");
    addToDisplay("done");
}

function saveWebStorage(storage){
    var keys=getListOfVariables();
}

function restoreValue(key,value){
    var realValue;
    if(/list/.test(key.type)){
        realValue=convertToListValue(key.type.replace(" list",""), value);
    }
    else{
        realValue=convertToValue(key.type, value);
    }
    findObject(key.name).value=realValue;
}

function convertToValue(type, value){
    if(type == "boolean"){
        return value == "true";
    }
    else if(type == "number")
        return parseInt(value);
    else
        return value;
}

function convertToListValue(type, input){
    var newList=[];
    var value;
    input=input.split(",");
    for(var key in input){
        value=convertToValue(type, input[key]);
        newList.push(value);
    }
    return newList;
}
var compiled="compiled";