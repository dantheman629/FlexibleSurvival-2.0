function parseFile(data){
    addToDisplay("parsing");
    var lines=data.split("\n");
    var line;
    var lineObj;
    var obj;
    var indents=[{type:"file", inside:[], value:""}];
    for(var i=0;i<lines.length;i++){
        line=getIndent(lines[i]);
        obj=getLineObject(line.value);
        if(obj.type == "otherwise" || obj.type == "otherwise if"){
            indents[line.indent].onFalse=obj;
            indents[line.indent]=obj;
        }
        else{
            indents[line.indent-1].inside.push(obj);
            indents[line.indent]=obj;
        }
    }
    addToDisplay("populating");
    evaluateLines(indents[0].inside,0,function(){});
    addToDisplay("populated");
    //addToDisplay(functions["testThing"]());
}
function evaluateLines(lines, i, onDone){
    var continuef=function(){evaluateLines(lines, i+1, onDone);};
    if(lines.length == i){
        onDone();
        return;
    }
    if(lines[i].type == "to say"){
        functions[lines[i].name.replace("\r", "")]={type:"function", value:(function (onDone){evaluateLines(lines[i].inside,0,onDone);})};
        continuef();
    }
    else if(lines[i].type == "say"){
        evaluateStatement(lines[i].statement.inside,0,function(){ if(lines[i].newline) addToDisplay(""); continuef();});
    }
    else if(lines[i].type == "let"){
        var newVal={};
        if(!isNaN(lines[i].value)){
            newVal.value=parseInt(lines[i].value);
            newVal.type="number";
        }
        else if(/ *"/.test(lines[i].value)){
            var value=lines[i].value.replace(/ *"/,"");
            value=value.replace(/".*$/,"");
            value=parseInput(value);
            newVal.value=value;
            newVal.type="text";
        }
        else{
            lines[i].value=getValue(lines[i].value);
            lines[i].type=findObject(lines[i].value).type;
        }
        data[lines[i].name]=newVal;
        continuef();
    }
    else if(lines[i].type == "now is"){
        if(!isNaN(lines[i].value)){
            nowIs(lines[i].name, lines[i].value);
        }
        else if(/ *"/.test(lines[i].value)){
            var value=lines[i].value.replace(/ *"/,"");
            value=value.replace(/".*$/,"");
            value=parseInput(value);
            nowIs(lines[i].name, value);
        }
        else{
            var value=getValue(lines[i].value);
            nowIs(lines[i].name, value);
        }
        continuef();
    }
    else if(lines[i].type == "if line"){
        evalFileIf(lines[i], continuef);
    }
    else if(lines[i].type == "if"){
        evalFileIf(lines[i], continuef);
    }
    else if(lines[i].type == "increase"){
        var curObj=findObject(lines[i].name);
        curObj.value=parseInt(curObj.value)+parseInt(lines[i].value);
        continuef();
    }
    else
        continuef();
}

function evalFileIf(ifState, onDone){
    if(ifState.type == "otherwise")
        evaluateLines(ifState.inside,0,onDone);
    else if(ifState.condition == "the player consents")
        playerConsents(function(){evaluateLines(ifState.inside,0,onDone);}, function(){evalFileIf(ifState.onFalse, onDone);});
    else{
        var result=parseParenInput(ifState.condition);
        if(result){
            evaluateLines(ifState.inside,0,onDone);
        }
        else{
            evalFileIf(ifState.onFalse, onDone);
        }
    }
}

function playerConsents(onTrue, onFalse){
    addToDisplay("Do you want to?");
    setButtonsConsent(onTrue, onFalse);
}
    
function getSay(line){
    line=line.replace(/^say *"/, "");
    line=line.replace(/".*/,"");
    return {type:"say", statement:(parseInput(line)), newline:(/\.$|\?$|\!$/.test(line))};
}

function getToSay(line){
    line=line.replace(/^to say */, "");
    line=line.replace(/:.*/,"");
    return {type:"to say", inside:[], name:line};
}
    
function getLetBe(line){
    line=line.replace(/^let */, "");
    line=line.replace(/;.*/,"");
    var parts=line.split(" be ");
    var name=parts.shift();
    var value=parts.join(" be ");
    return {type:"let", name:name, value:value};
}

function getNowIs(line){
    line=line.replace(/^now */, "");
    line=line.replace(/;.*/,"");
    var parts=line.split(" is ");
    var name=parts.shift();
    var value=parts.join(" is ");
    return {type:"now is", name:(name), value:value};
}

function getNowIsNot(line){
    line=line.replace(/^now */, "");
    line=line.replace(/;.*/,"");
    var parts=line.split(" is not ");
    return {type:"now is not", name:(parts.shift()), value:(parts.join(" is not "))};
}

function getIf(line){
    line=line.replace(/^if */, "");
    line=line.replace(/\:.*$/,"");
    return {type:"if", inside:[], onFalse:{type:"otherwise", inside:[]}, condition:line};
}

function getOtherwiseIf(line){
    line=line.replace(/^otherwise if */, "");
    line=line.replace(/:.*/,"");
    return {type:"otherwise if", inside:[], onFalse:{type:"otherwise", inside:[]}, condition:line};
}

function getOtherwise(line){
    return {type:"otherwise", inside:[]};
}

function getIfLine(line){
    line=line.replace(/^if */, "");
    line=line.replace(/;.*/,"");
    var parts=line.split(", ");
    return {type:"if", onFalse:{type:"otherwise", inside:[]}, condition:(parts.shift()), inside:[getLineObject(parts.join(", "))]};
}

function getIncrease(line){
    line=line.replace(/^increase */, "");
    line=line.replace(/;.*/,"");
    var parts=line.split(" by ");
    return {type:"increase", name:(parts.shift()), value:(parts.join(" by "))};
}

function getLineObject(line){
    var type="";
    line=line.replace(/\r/g, "");
    if(/^to say .*:/.test(line))
        return getToSay(line);
    else if(/^say/.test(line))
        return getSay(line);
    else if(/^let .* be/.test(line))
        return getLetBe(line);
    else if(/^now .* is(?! not)/.test(line))
        return getNowIs(line);
    else if(/^now .* is not/.test(line))
        return getNowIsNot(line);
    else if(/^if .*;/.test(line))
        return getIfLine(line);
    else if(/^if .*:/.test(line))
        return getIf(line);
    else if(/^otherwise if .*:/.test(line))
        return getOtherwiseIf(line);
    else if(/^otherwise:/.test(line))
        return getOtherwise(line);
    else if(/^increase .* by/.test(line))
        return getIncrease(line);
    else if(/^\s*$/.test(line))
        type="empty";
    else if(/^when /.test(line))
        type="when";
    else if(/^When /.test(line))
        type="when";
    else if(/^blank out the /.test(line))
        type="blank out";
    else if(/^Choose a .* from/.test(line))
        type="choose";
    else if(/^Section .*-/.test(line))
        type="section";
    else if(/^add .* to .* of/.test(line))
        type="add";
    else if(/^.* is a .* that varies/.test(line))
        type="is a";
    else
        type="other";
    return {type:type, inside:[], value:line};
}

function getIndent(line){
    var indent=line.match(/\t*/)[0].length+1;
    var value=line.replace(/\t*/, "");
    return {indent:indent, value:value};
}
    