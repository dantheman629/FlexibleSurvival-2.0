function testSplit(test){
    addToDisplay("testing");
}

var test="hello";

function parseInput(input){
    var res = input.split(/\[|\]/);
    var items=[];
    var newkey;
    var isspecial=false;
    for(var key in res){
        if(isspecial){
            newkey={type:"special", value:res[key]};
            var foundMatch=false;
            for(key in inlines){
                if(inlines[key].test(newkey.value)){
                    newkey.stype=key;
                    foundMatch=true;
                    if(key!="at")
                        newkey.value=newkey.value.replace(inlines[key], "");
                    else
                        newkey.value=newkey.value.replace("at ", "");
                }
            }
                if(!foundMatch)
                    newkey.stype="other";
            isspecial=false;
        }
        else{
            newkey={type:"string", value:res[key]};
            isspecial=true;
        }
        if(newkey.value != "" || newkey.type == "special")
            items.push(newkey);
    }
    var statement=parseStatements(items);
    statement.original=input;
    return {inside:statement.inside, original:input};
}

function getValue(input){
    input=input.replace("the ", "");
    if(!isNaN(input)){
        return input;
    }
    if(/"/.test(input)){
        input=input.replace(/"/g, "");
        return parseInput(input);
    }
    if(/\{/.test(input)){
        return convertToList(input);
    }
    if(input in functions){
        return functions[input]();
    }
    var lookups=input.split(/ of /);
    var i;
    var found=data;
    for(i=lookups.length-1; i>=0; i--){
        found=found[lookups[i].trim()];
        if(!found)
            error("ERROR: Unkown object "+input);
    }
    return found.value;
}

function findObject(input){
    input=input.replace("the ", "");
    if(input in functions){
        return functions[input];
    }
    var lookups=input.split(/ of /);
    var i;
    var found=data;
    for(i=lookups.length-1; i>=0; i--){
        found=found[lookups[i].trim()];
        if(!found)
            error("ERROR: Unkown object "+input);
    }
    return found;
}

function evaluateIf(ifs){
    if(ifs.stype == "otherwise"){
        return ifs.onAlways;
    }
    else if(parseParenInput(ifs.value)){
        return ifs.onTrue;
    }
    else
        return evaluateIf(ifs.onFalse);
}

function evaluateStatement(statement, i, onDone){
    if(statement.length == i){
        onDone();
    }
    else{
        var next=statement[i];
        if(next.type == "string"){
            appendToDisplay(next.value);
            evaluateStatement(statement, i+1, onDone);
        }
        else if(next.stype == "if"){
            var ifEval=evaluateIf(next);
            evaluateStatement(ifEval, 0, function(){evaluateStatement(statement, i+1, onDone);});
        }
        else if(next.stype == "oneOf"){
            var onePick;
            if(next.pickType == "random"){
                onePick=next.options[getRandom(0,next.options.length-1)].inside;
            }
            else if(next.pickType == "sticky random"){
                onePick=next.options[otherwiseStates[next.id]].inside;
            }
            else if(next.pickType == "decreasing"){
                var r=getRandom(1,((next.options.length+1)*(next.options.length))/2);
                var j;
                var pick=-1;
                for(j=next.options.length; j>0&&pick==-1; j--){
                    if(r<=i)
                        pick=next.options.length-j;
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
                var j=otherwiseStates[next.id].free[r];
                onePick=next.options[j].inside;
                otherwiseStates[next.id].free.splice(r,1);
                otherwiseStates[next.id].used.push(j);
            }
            evaluateStatement(onePick,0, function(){evaluateStatement(statement, i+1, onDone)});
        }
        else if(next.stype == "other"){
            var ret=findObject(next.value);
            if(ret.type == "number"){
                appendToDisplay(ret.value);
                evaluateStatement(statement, i+1, onDone);
            }
            else if(ret.type == "text"){
                evaluateStatement(ret.value.inside,0, function(){evaluateStatement(statement, i+1, onDone)});
            }
            else if(ret.type == "function"){
                ret.value(function(){evaluateStatement(statement, i+1, onDone)});
            }
            else
                addToDisplay("ERROR");
        }
    }
}

function parseStatements(toParse){
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