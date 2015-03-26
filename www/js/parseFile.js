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
        indents[line.indent-1].inside.push(obj);
        indents[line.indent]=obj;
    }
    addToDisplay("done");
}

function getLineObject(line){
    return {type:"line", inside:[], value:line};
}

function getIndent(line){
    var indent=line.match(/\t*/)[0].length+1;
    var value=line.replace(/\t*/);
    return {indent:indent, value:value};
}