function parseFile(data){
    addToDisplay("starting");
    var lines=data.split("\n");
    var line;
    var lineObj;
    var obj;
    var indents=[{type:"line", inside:[], value:""}];
    for(var i=0;i<lines.length;i++){
        line=getIndent(lines[i]);
        obj=getLineObject(line.value);
        if(obj.type == "other")
            addToDisplay(obj.type+"|"+obj.value);
        indents[line.indent-1].inside.push(obj);
        indents[line.indent]=obj;
    }
    addToDisplay("done");
}

function getLineObject(line){
    var type="";
    if(/^to say .*:/.test(line))
        type="to say";
    else if(/^say/.test(line))
        type="say";
    else if(/^let .* be/.test(line))
        type="let";
    else if(/^now .* is(?! not)/.test(line))
        type="now is";
    else if(/^now .* is not/.test(line))
        type="now is not";
    else if(/^if .*;/.test(line))
        type="if line";
    else if(/^if .*:/.test(line))
        type="if";
    else if(/^otherwise if .*:/.test(line))
        type="otherwise if";
    else if(/^otherwise:/.test(line))
        type="otherwise";
    else if(/^increase .* by/.test(line))
        type="increase";
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