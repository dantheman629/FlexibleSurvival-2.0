function parseFile(data){
    var lines=data.split("\n");
    var line;
    var lineObj;
    var obj;
    var indents=[{type:"file", inside:[], value:""}];
    for(var i=0;i<lines.length;i++){
        line=getIndent(lines[i]);
        obj=getLineObject(line.value);
        if(obj.type == "increase"){
            addToDisplay(line.value);
            addToDisplay(obj.name);
            addToDisplay(obj.value);
        }
        indents[line.indent-1].inside.push(obj);
        indents[line.indent]=obj;
    }
    addToDisplay("populating");
    //populateObjects(indents[0].inside,0);
}

function populateObjects(lines,i){
    if(lines.length==i)
        return;
    if(lines[i].type == "to say"){
        addToDisplay("to say");
        var value=lines[i].value;
        value=value.replace(/^to say /, "");
        value=value.replace(/:\s*$/, "");
        addToDisplay(value)
    }
    populateObjects(lines,i+1);
}

function evaluateLines(lines,i){
    
}

function getSay(line){
    line=line.replace(/^say *"/, "");
    line=line.replace(/".*/,"");
    return {type:"say", statement:line};
}

function getToSay(line){
    line=line.replace(/^to say */, "");
    line=line.replace(/:.*/,"");
    return {type:"to say", inside:[], statement:line};
}

function getLetBe(line){
    line=line.replace(/^let */, "");
    line=line.replace(/;.*/,"");
    var parts=line.split(" be ");
    return {type:"let", name:(parts.shift()), value:(parts.join(" be "))};
}

function getNowIs(line){
    line=line.replace(/^now */, "");
    line=line.replace(/;.*/,"");
    var parts=line.split(" is ");
    return {type:"now is", name:(parts.shift()), value:(parts.join(" is "))};
}

function getNowIsNot(line){
    line=line.replace(/^now */, "");
    line=line.replace(/;.*/,"");
    var parts=line.split(" is not ");
    return {type:"now is not", name:(parts.shift()), value:(parts.join(" is not "))};
}

function getIf(line){
    line=line.replace(/^if */, "");
    line=line.replace(/:.*/,"");
    return {type:"if", inside:[], condition:line};
}

function getOtherwiseIf(line){
    line=line.replace(/^otherwise if */, "");
    line=line.replace(/:.*/,"");
    return {type:"otherwise if", inside:[], condition:line};
}

function getOtherwise(line){
    return {type:"otherwise", inside:[]};
}

function getIfLine(line){
    line=line.replace(/^if */, "");
    line=line.replace(/;.*/,"");
    var parts=line.split(", ");
    return {type:"if line", condition:(parts.shift()), onTrue:(getLineObject(parts.join(", ")))};
}

function getIncrease(line){
    line=line.replace(/^increase */, "");
    line=line.replace(/;.*/,"");
    var parts=line.split(" by ");
    return {type:"increase", name:(parts.shift()), value:(parts.join(" by "))};
}

function getLineObject(line){
    var type="";
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