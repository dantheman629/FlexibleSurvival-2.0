function parseParenInput(input){
    var res=input.split(/(?=\()|\)/);
    var i;
    for(i=1; i<res.length;i++){
        if(!(/^\(/.test(res[i]))){
            res[i]=")"+res[i];
        }
    }
    var ret=[];
    for(i=0; i<res.length; i++){
        if(/^\(/.test(res[i])){
            ret.push("(");
            var rest=res[i].replace("(","");
            if(/\w/.test(rest))
                ret.push(rest);
        }
        else if(/^\)/.test(res[i])){
            ret.push(")");
            var rest=res[i].replace(")","");
            if(/\w/.test(rest))
                ret.push(rest);
        }
        else{
            ret.push(res[i]);
        }
    }
    var paren=parseParen(ret);
    var simp=evaluateExpression(paren.inside);
    return simp;
}

function parseSimpleExpression(exp){
    var res=exp.split(/(?=and |or )/);
    var ret=[];
    var i;
    for(i=0; i<res.length; i++){
        if(/^and /.test(res[i])){
            ret.push("and");
            var rest=res[i].replace("and ","");
            if(/\w/.test(rest))
                ret.push(rest.trim());
        }
        else if(/^or /.test(res[i])){
            ret.push("or");
            var rest=res[i].replace("or ","");
            if(/\w/.test(rest))
                ret.push(rest.trim());
        }
        else{
            ret.push(res[i].trim());
        }
    }
    for(i=0; i<ret.length; i=i+2){
        ret[i]=evaluateBoolean(ret[i]);
    }
    var simp= evaluateSimpleExpression(ret);
    return simp;
}

function evaluateSimpleExpression(exp){
    if(exp.length==1)
        return exp[0];
    var first=exp.shift();
    var op=exp.shift();
    var ret=evaluateSimpleExpression(exp);
    if(op == "or")
        return first || ret;
    return first && ret;
}

function lessThan(strings){
    strings[0]=strings[0].trim();
    strings[1]=strings[1].trim();
    return parseInt(getValue(strings[0])) < parseInt(getValue(strings[1]));
}

function lessThanEqualTo(strings){
    strings[0]=strings[0].trim();
    strings[1]=strings[1].trim();
    return parseInt(getValue(strings[0])) <= parseInt(getValue(strings[1]));
}

function greaterThanEqualTo(strings){
    strings[0]=strings[0].trim();
    strings[1]=strings[1].trim();
    return parseInt(getValue(strings[0])) >= parseInt(getValue(strings[1]));
}

function greaterThan(strings){
    strings[0]=strings[0].trim();
    strings[1]=strings[1].trim();
    return parseInt(getValue(strings[0])) > parseInt(getValue(strings[1]));
}

function is(strings){
    strings[0]=strings[0].trim();
    strings[1]=strings[1].trim();
    var obj=findObject(strings[0]);
    if(strings[1] in definitions)
        return definitions[strings[1]](strings[0]);
    if(obj.type == "text" || obj.type == "number" || obj.type =="option"){
        return getValue(strings[0]) == getValue(strings[1]);
    }
    return obj[strings[1]].value == true;
}

function isNot(strings){
    return !is(strings);
}

function evaluateExpression(exp){
    var i;
    for(i=0; i<exp.length; i++){
        if(exp[i].type == "paren"){
            exp[i]=" "+evaluateExpression(exp[i].inside)+" ";
        }
    }
    var total="";
    for(i=0; i<exp.length; i++){
        total=total+exp[i];
    }
    return parseSimpleExpression(total);
}

function parseParen(toParse){
    if(toParse.length==0){
        return {type:"expression", inside:[]};
    }
    var next=toParse.shift();
    if(next=="("){
        var nextRet=parseParen(toParse);
        var newParen={type:"paren", inside:nextRet.inside};
        var ret=parseParen(nextRet.remaining);
        ret.inside.unshift(newParen);
        return ret;
    }
    else if(next==")"){
        var ret={inside:[], remaining:toParse};
        return ret;
    }
    else{
        var nextRet=parseParen(toParse);
        nextRet.inside.unshift(next);
        return nextRet;
    }
}

function listedIn(input){
    input[0]=input[0].trim();
    input[1]=input[1].trim();
    input[0]=input[0].replace(/^"/,"");
    input[0]=input[0].replace(/"$/,"");
    return -1 != getValue(input[1]).indexOf(input[0]);
}

function randomChance(input){
    var strings=input.split(" in ");
    strings[0]=parseInt(getValue(strings[0].trim()));
    strings[1]=parseInt(getValue(strings[1].trim()));
    var rand=getRandom(1, strings[1]);
    return strings[0] >= rand;
}

function evaluateBoolean(statement){
    if(statement == "true")
        return true;
    if(/ is listed in /.test(statement)){
        return listedIn(statement.split(" is listed in "));
    }
    if(statement == "false")
        return false;
    if(/<(?!=)/.test(statement)){
        return lessThan(statement.split("<"));
    }
    if(/<=/.test(statement)){
        return lessThanEqualTo(statement.split("<="));
    }
    if(/\>(?!=)/.test(statement)){
        return greaterThan(statement.split(">"));
    }
    if(/\>=/.test(statement)){
        return greaterThanEqualTo(statement.split(">="));
    }
    if(/ is not /.test(statement)){
        return isNot(statement.split(" is not "));
    }
    if(/ is /.test(statement)){
        return is(statement.split(" is "));
    }
    if(/a random chance of/.test(statement)){
        return randomChance(statement.replace("a random chance of ", "").replace(" succeeds", ""));
    }
}

