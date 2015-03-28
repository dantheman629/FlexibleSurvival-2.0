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
    return;
    //addToDisplay(functions["testThing"]());
}
function evaluateLines(lines, i, onDone){
    var continuef=function(){evaluateLines(lines, i+1, onDone);};
    if(lines.length <= i){
        onDone();
        return;
    }
    if(lines[i].type == "to say"){
        functions[lines[i].name.replace("\r", "")]={type:"function", value:(function (onDone){evaluateLines(lines[i].inside,0,onDone);})};
        continuef();
    }
    else if(lines[i].type == "when"){
        playBegins=playBegins.concat(lines[i].inside);
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
        addToDisplay("now is");
        if(!isNaN(lines[i].value)){
            nowIs(lines[i].name, lines[i].value);
        }
        else if(/ *"/.test(lines[i].value)){
            var value=lines[i].value.replace(/ *"/,"");
            value=value.replace(/".*$/,"");
            value=parseInput(value);
            nowIs(lines[i].name, value);
        }
        else if(lines[i].value == "true" || lines[i].value == "false"){
            nowIs(lines[i].name, lines[i].value == "true");
        }
        else{
            addToDisplay(lines[i].value);
            nowIs(lines[i].name, lines[i].value);
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
    else if(lines[i].type == "is a"){
        evaluateIsA(lines[i].lines, 0);
        continuef();
    }
    else if(lines[i].type == "choose blank"){
        var newRow={};
        currentTable=lines[i].table;
        var types=tables[currentTable].types;
        var value;
        var type;
        for(var key in types){
            value={};
            value.type="";
            type=types[key];
            if(type=="number"){
                value.value=0;
                value.type=type;
            }
            else if(type=="text"){
                value.value=parseInput("");
                value.type=type;
            }
            else if(type=="option"){
                type.value=false;
                type.type="option";
                type.others=[];
            }
            newRow[key.replace("\r","")]=value;
        }
        tables[currentTable].rows.push(newRow);
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
    line=line.replace(/^\s*say *"/i, "");
    line=line.replace(/";\s*.*/i,"");
    return {type:"say", statement:(parseInput(line)), newline:(/\.$|\?$|\!$/.test(line))};
}

function getToSay(line){
    line=line.replace(/^\s*to say */i, "");
    line=line.replace(/:.*/,"");
    return {type:"to say", inside:[], name:line};
}
    
function getLetBe(line){
    line=line.replace(/^\s*let *i/, "");
    line=line.replace(/;.*/,"");
    var parts=line.split(" be ");
    var name=parts.shift();
    var value=parts.join(" be ");
    return {type:"let", name:name, value:value};
}

function getNowIs(line){
    line=line.replace(/^\s*now */i, "");
    line=line.replace(/;.*/,"");
    var parts=line.split(" is ");
    var name=parts.shift();
    var value=parts.join(" is ");
    return {type:"now is", name:(name), value:value};
}

function getNowIsNot(line){
    line=line.replace(/^\s*now */i, "");
    line=line.replace(/;.*/,"");
    var parts=line.split(" is not ");
    return {type:"now is not", name:(parts.shift()), value:(parts.join(" is not "))};
}

function getIf(line){
    line=line.replace(/^\s*if */i, "");
    line=line.replace(/\:.*$/,"");
    return {type:"if", inside:[], onFalse:{type:"otherwise", inside:[]}, condition:line};
}

function getOtherwiseIf(line){
    line=line.replace(/^\s*otherwise if */i, "");
    line=line.replace(/:.*/,"");
    return {type:"otherwise if", inside:[], onFalse:{type:"otherwise", inside:[]}, condition:line};
}

function getOtherwise(line){
    return {type:"otherwise", inside:[]};
}

function getIfLine(line){
    line=line.replace(/^\s*if */i, "");
    line=line.replace(/;.*/,"");
    var parts=line.split(", ");
    return {type:"if", onFalse:{type:"otherwise", inside:[]}, condition:(parts.shift()), inside:[getLineObject(parts.join(", "))]};
}

function getIsA(line){
    var lines=line.split(".");
    for(var i=0; i<lines.length; i++)
        lines[i]=lines[i].trim();
    return {type:"is a", lines:lines};
}

function getIncrease(line){
    line=line.replace(/^\s*increase */i, "");
    line=line.replace(/;.*/,"");
    var parts=line.split(" by ");
    return {type:"increase", name:(parts.shift()), value:(parts.join(" by "))};
}

function evaluateIsA(lines, i){
    if(lines.length <= i){
        return;
    }
    lines[i]=lines[i].replace(/^a |^an |^the /i,"");
    lines[i]=lines[i].replace(/ the /gi," ");
    if(/ is a /.test(lines[i])){
        var line=lines[i].trim();
        var varies=/ that varies/.test(line);
        line=line.replace(" that varies", "");
        line=line.split(/ is a | is an /);
        var newVal={};
        if(line[1] == "number"){
            newVal.type="number";
            newVal.value=0;
        }
        else if(line[1] == "truth state"){
            newVal.type="option";
            newVal.value=false;
            newVal.others=[];
        }
        else if(line[1] == "text"){
            newVal.type="text";
            newVal.value=parseInput("");
        }
        else if(/list of/.test(line[i])){
            newVal.type="list";
            var type=line[i].replace("list of ", "");
            type=line[i].replace(/s$/, "");
            newVal.ltype=type;
            newVal.value=[];
        }
        else if(/kind of /.test(line[1])){
            line[1]=line[1].replace("kind of ", "");
            newVal=clone(findObject(line[1]));
        }
        data[line[0]]=newVal;
        if(varies)
            savableData.push({name:line[0], type:newVal.type});
    }
    else if(/ is usually| is /.test(lines[i])){
        var line=lines[i].trim();
        line=line.split(/ is usually | is (?!usually )/);
        var obj=findObject(line[0].trim());
        if(obj.type == "number")
            obj.value=parseInt(line[1].trim());
        else if(obj.type == "option")
            obj.value=line[1].value == "true";
        else if(obj.type == "text")
            obj.value=parseInput(line[1].trim().replace(/^"/,"").replace(/"$/,""));
        else if(obj.type == "list")
            obj.value=convertToList(line[1]);
        else{
            addToDisplay("usually option");
            nowIs(line[0], line[1]);
        }
    }
    else if(/ has /.test(lines[i])){
        var line=lines[i].trim();
        line=line.split(/ has | called /);
        var newVal={};
        if(line[1] == "number"){
            newVal.type="number";
            newVal.value=0;
        }
        else if(line[1] == "truth state"){
            newVal.type="option";
            newVal.value=false;
            newVal.others=[];
        }
        else if(line[1] == "text"){
            newVal.type="text";
            newVal.value=parseInput("");
        }
        data[line[0]][line[2]]=newVal;
        savableData.push({name:line[2]+" of "+line[0], type:newVal.type});
    }
    else if(/ can be /.test(lines[i])){
        var line=lines[i].trim();
        line=line.split(/ can be | or /);
        var newList;
        var newVal;
        for(var k=1; k<line.length; k++){
            newList=[];
            for(var j=1; j<line.length; j++){
                if(j!=k){
                    newList.push(line[j]);
                }
            }
            data[line[0]][line[k]]={type:"option", value:false, others:newList};
        savableData.push({name:line[k]+" of "+line[0], type:"option"});
        }
        data[line[0]][line[1]].value=true;
    }
    evaluateIsA(lines, i+1);
}

function getWhen(line){
    return {type:"when", inside:[]};
}

function getChooseBlank(line){
    line=line.replace("Choose a blank row from Table of ", "");
    line=line.replace(/;.*$/, "");
    return {type:"choose blank", table:line};
}

function getLineObject(line){
    var type="empty";
    line=line.replace(/\r/g, "");
    if(/^\s*to say .*:/i.test(line.toLowerCase()))
        return getToSay(line);
    else if(/^\s*say/i.test(line.toLowerCase()))
        return getSay(line);
    else if(/^\s*let .* be/i.test(line.toLowerCase()))
        return getLetBe(line);
    else if(/^\s*now .* is(?! not)/i.test(line.toLowerCase()))
        return getNowIs(line);
    else if(/^\s*now .* is not/i.test(line.toLowerCase()))
        return getNowIsNot(line);
    else if(/^\s*if .*;/i.test(line.toLowerCase()))
        return getIfLine(line);
    else if(/^\s*if .*:/i.test(line.toLowerCase()))
        return getIf(line);
    else if(/^\s*otherwise if .*:/i.test(line.toLowerCase()))
        return getOtherwiseIf(line);
    else if(/^\s*otherwise:/i.test(line.toLowerCase()))
        return getOtherwise(line);
    else if(/^\s*increase .* by/i.test(line.toLowerCase()))
        return getIncrease(line);
    else if(/^\s*$/.test(line.toLowerCase()))
        type="empty";
    else if(line.toLowerCase() == "when play begins:")
        return getWhen();
    else if(/^\s*blank out the /i.test(line.toLowerCase()))
        type="blank out";
    else if(/^\s*Choose a blank row from Table of /i.test(line))
        return getChooseBlank(line);
    else if(/^Section .*-/.test(line))
        type="section";
    else if(/^add .* to .* of/.test(line))
        type="add";
    else if(/ is .*\.\s*/.test(line.toLowerCase()))
        return getIsA(line);
    else{
        type="other";
    }
    return {type:type, inside:[], value:line};
}

function getIndent(line){
    var indent=line.match(/\t*/)[0].length+1;
    var value=line.replace(/\t*/, "");
    return {indent:indent, value:value};
}
    