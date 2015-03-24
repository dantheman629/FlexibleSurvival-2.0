

function combatTurn(action){
    if(action == "flee"){
        addToDisplay("You run away");
        setButtonsSingle("continue", data.combatState.afterCombat);
        return;
    }
    if(action == "submit"){
        data.combatState.monster.submitScene();
        setButtonsSingle("continue", data.combatState.afterCombat);
        return;
    }
    if(action == "attack")
        playerAttack();
    updateEnemyCombat();
    if(data.combatState.hp<=0){
        data.combatState.monster.victoryScene();
        setButtonsSingle("continue", data.combatState.afterCombat);
        return;
    }
    monsterAttack();
    updatePlayerCombat();
    updateHealth();
    if(data.player.hp<=0){
        data.combatState.monster.defeatSceneScene();
        setButtonsSingle("continue", data.combatState.afterCombat);
        return;
    }
}

function playerAttack(){
    data.combatState.hp-=data.player.attack;
}

function monsterAttack(){
    data.player.hp-=data.combatState.monster.attack;
}

function attack(){
    addToDisplay("you attacked the enemy");
}

function wait(){
    addToDisplay("you waited...for some reason");
}

function submit(){
    addToDisplay("you submited you horny fuck");
}

function flee(){
    addToDisplay("you ran away, coward");
}

function getMonsters(monsters){
    var usable=[];
    var monster;
    for(var key in monsters){
        monster=data[monsters[key]];
        if(monsterUsable(monster))
            usable.push(monster);
    }
    return usable;
}

function fightMonster(monster, afterCombat){
    setCombat(monster, afterCombat);
}

function updatePlayerCombat(){
    var disp="";
    disp+="Player:<br />";
    disp+=displayHealth();
    document.getElementById("combatPlayer").innerHTML=disp;
}

function updateEnemyCombat(){
    var disp="";
    disp+="Enemy:<br />";
    disp+=displayEnemyHealth();
    document.getElementById("combatEnemy").innerHTML=disp;
}

function startCombat(){
    clearDisplay();
    setButtonsCombat();
    document.getElementById("display").innerHTML="<div id=\"combatPlayer\">PLAYER</div><div id=\"combatEnemy\">ENEMY</div>";
    updateEnemyCombat();
    updatePlayerCombat();
}

function setCombat(monster, afterCombat){
    data.combatState.monster=monster;
    monster.description();
    data.combatState.afterCombat=afterCombat;
    data.combatState.maxHp=monster.maxHp;
    data.combatState.hp=monster.maxHp;
    setButtonsSingle("FIGHT!", startCombat);
}

function monsterUsable(monster){
    return true;
}