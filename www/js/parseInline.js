function testSplit(test){
    addToDisplay("testing");
}

function parseInput(input){
    addToDisplay(input);
    var res = input.split(/\[|\]/);
    var items=[];
    var newkey;
    var isspecial=false;
    for(var key in res){
        if(isspecial){
            newkey={type:"special", value:res[key]};
            var foundMatch=false;
            for(key in inlines){
                addToDisplay(newkey.value);
                if(inlines[key].test(newkey.value)){
                    newkey.stype=key;
                    foundMatch=true;
                    newkey.value=newkey.value.replace(inlines[key], "");
                }
            }
                if(!foundMatch)
                    newkey.stype="other";
            addToDisplay(newkey.stype);
            isspecial=false;
        }
        else{
            newkey={type:"string", value:res[key]};
            isspecial=true;
        }
        if(newkey.value != "" || newkey.type == "special")
            items.push(newkey);
    }
    addToDisplay("test");
    return parseStatements(items);
}

function getValue(input){
    if(!isNaN(input)){
        return input;
    }
    if(/"/.test(input)){
        input=input.replace(/"/g, "");
        return input;
    }
    if(input in functions){
        return functions[input]();
    }
    var lookups=input.split(/ of /);
    var i;
    var found=data;
    for(i=lookups.length-1; i>=0; i--){
        found=found[lookups[i].trim()];
    }
    return found.value;
}

function findObject(input){
    var lookups=input.split(/ of /);
    var i;
    var found=data;
    for(i=lookups.length-1; i>=0; i--){
        found=found[lookups[i].trim()];
    }
    return found;
}

function evaluateIf(ifs){
    if(ifs.stype == "otherwise"){
        return ifs.onAlways;
    }
    if(parseParenInput(ifs.value) == "true"){
        return ifs.onTrue;
    }
    else{
        return evaluateIf(ifs.onFalse);
    }
}

function evaluateStatement(statement, i){
    if(statement.length == i)
        return "";
    var next=statement[i];
    var ret=evaluateStatement(statement, i+1);
    if(next.type == "string"){
        return next.value+ret;
    }
    if(next.stype == "if"){
        var ifeval=evaluateIf(next);
        ifeval=evaluateStatement(ifeval, 0);
        return ifeval+ret;
    }
    if(next.stype == "oneOf"){
        if(next.pickType == "random"){
            onePick=next.options[getRandom(0,next.options.length-1)].inside;
        }
        else if(next.pickType == "sticky random"){
            onePick=next.options[otherwiseStates[next.id]].inside;
        }
        else if(next.pickType == "decreasing"){
            var r=getRandom(1,((next.options.length+1)*(next.options.length))/2);
            var i;
            var pick=-1;
            for(i=next.options.length; i>0&&pick==-1; i--){
                if(r<=i)
                    pick=next.options.length-i;
                r=r-next.options.length;
            }
            onePick=next.options[pick].inside;
        }
        else if(next.pickType == "stopping"){
            var pick=otherwiseStates[next.id];
            onePick=next.options[pick].inside;
            if(pick<next.options.length-1){
                otherwiseStates[next.id]=pick+1;
            }
        }
        else if(next.pickType == "purely random"){
            if(otherwiseStates[next.id].free.length==0){
                otherwiseStates[next.id].free=otherwiseStates[next.id].used;
                otherwiseStates[next.id].used=[];
            }
            var r=getRandom(0, otherwiseStates[next.id].free.length-1);
            var i=otherwiseStates[next.id].free[r];
            onePick=next.options[i].inside;
            otherwiseStates[next.id].free.splice(r,1);
            otherwiseStates[next.id].used.push(i);
        }
        onePick=evaluateStatement(onePick,0);
        return onePick+ret;
    }
    if(next.stype == "other"){
        var ret=evaluateStatement(statement, i+1);
        return getValue(next.value)+ret;
    }
    addToDisplay("ERROR");
    return "";
}

function parseStatements(toParse){
    addToDisplay(toParse.length);
    if(toParse.length==0){
        return {type:"special", stype:"actions", inside:[]};
    }
    var next=toParse.shift();
    if(next.type == "string"){
        var nextRet=parseStatements(toParse);
        nextRet.inside.unshift(next);
        return nextRet;
    }
    else{
        if(next.stype == "endIf"){
            var ret={remaining:toParse, inside:[], found:next};
            return ret;
        }
        else if(next.stype == "otherwise"){
            var nextRet=parseStatements(toParse);
            next.onAlways=nextRet.inside;
            var ret={remaining:toParse, inside:[], found:next};
            return ret;
        }
        else if(next.stype == "otherwiseIf"){
            var nextRet=parseStatements(toParse);
            next.onTrue=nextRet.inside;
            if(nextRet.found.stype == "endIf")
                next.onFalse={type:"special", stype:"otherwise", value:"otherwise", onAlways:[]};
            else
                next.onFalse=nextRet.found;
            var ret={remaining:toParse, inside:[], found:next};
            return ret;
        }
        else if(next.stype == "if"){
            var nextRet=parseStatements(toParse);
            next.onTrue=nextRet.inside;
            if(nextRet.found.stype == "endIf"){
                next.onFalse={type:"special", stype:"otherwise", value:"otherwise", onAlways:[]};
            }
            else{
                next.onFalse=nextRet.found;
            }
            var ret=parseStatements(nextRet.remaining);
            ret.inside.unshift(next);
            return ret;
        }
        else if(next.stype == "at"){
            var ret={remaining:toParse, inside:[], found:next, options:[]}
            return ret;
        }
        else if(next.stype == "or"){
            var nextRet=parseStatements(toParse);
            next.inside=nextRet.inside;
            nextRet.inside=[];
            nextRet.options.unshift(next);
            return nextRet;
        }
        else if(next.stype == "oneOf"){
            var nextRet=parseStatements(toParse);
            next.options=nextRet.options;
            var newOr={type:"special", stype:"or", inside:nextRet.inside};
            next.options.unshift(newOr);
            next.pickType=nextRet.found.value;
            next.id=otherwiseStates.length;
            if(next.pickType=="random"){
                otherwiseStates.push({});
            }
            else if(next.pickType=="purely random"){
                var list=[];
                var i;
                for(i=0; i<next.options.length;i++){
                    list.push(i);
                }
                otherwiseStates.push({free:list, used:[]});
            }
            else if(next.pickType=="sticky random"){
                var stick=getRandom(0,next.options.length-1);
                otherwiseStates.push(stick);
            }
            else if(next.pickType=="stopping"){
                otherwiseStates.push(0);
            }
            else if(next.pickType=="decreasing"){
                otherwiseStates.push([]);
            }
            var ret=parseStatements(nextRet.remaining);
            ret.inside.unshift(next);
            return ret;
        }
        else{
            var nextRet=parseStatements(toParse);
            nextRet.inside.unshift(next);
            return nextRet;
        }
    }
    return [];
}