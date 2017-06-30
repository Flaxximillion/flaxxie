let currEnemy;
let gameText;
let player = {};
let enemies = 0;
let crazyCatLady1;
let crazyCatLady2;
let crazyCatLady3;


let setButtons = {
    "showAttacksHideEnemies": function(){
        $("#enemyButtons").css("visibility", "hidden");
        $("#attackButtons").css("visibility", "visible");
    },
    "hideRestartAttackShowEnemy": function(){
        $("#restartButton").css("visibility", "hidden");
        $("#enemyButtons").css("visibility", "visible");
        $("#attackButtons").css("visibility", "hidden");
    },
    "showEnemiesHideAttacks": function(){
        $("#enemyButtons").css("visibility", "visible");
        $("#attackButtons").css("visibility", "hidden");
    },
    "showRestartHideAttackEnemy":function(){
        $("#restartButton").css("visibility", "visible");
        $("#enemyButtons").css("visibility", "hidden");
        $("#attackButtons").css("visibility", "hidden");
    }
};

$(document).ready(function () {
    init();
});

function init(){
    player = {
        name: "You",
        ammo: 450,
        cats: 125,
    };
    enemies = 3;

    setButtons.hideRestartAttackShowEnemy();

    $("#cats").text(player.cats);
    $("#energy").text(player.ammo);

    gameText = $("#eventText");
    $(gameText).text("Oh no! All the crazy cat ladies in the neighborhood (including you!) have all gone crazy and are fighting over cats! Muster up what energy your feeble, old body can and gather what cats you can!");
    crazyCatLady1 = constructCatLady("Bertha", 100, 100, 1, [0, 2, 5]);
    crazyCatLady2 = constructCatLady("Gretchen", 150, 150, 2, [2, 3, 4]);
    crazyCatLady3 = constructCatLady("Dolores", 200, 200, 3, [1, 2, 3]);

    $("#restartButton").unbind("click").bind("click", (function () {
        init();
    }));

    $(".attack").unbind("click").bind("click", function () {
        gameText.text("");
        let playerAttack = Attacks[$(this).val()];
        let attack = enemyAttack(currEnemy.availableAttacks);

        player.ammo -= playerAttack.ammo;
        currEnemy.cats -= playerAttack.ammo;
        player.cats += playerAttack.ammo;

        currEnemy.ammo -= attack.ammo;
        player.cats -= attack.ammo;
        currEnemy.cats += attack.ammo;

        if (player.cats <= 0) {
            player.cats = 0;
            console.log("player lose 1");
            playerLose(1);
            return;
        } else if (currEnemy.cats <= 0) {
            player.cats -= currEnemy.cats;
            currEnemy.cats = 0;
            console.log("player win 1");
            playerWin(1);
            return;
        } else if(player.ammo <=0){
            player.ammo = 0;
            player.cats = 0;
            console.log("player lose 2");
            playerLose(2);
            return;
        } else if(currEnemy.ammo <= 0){
            currEnemy.ammo = 0;
            console.log("player win 2");
            playerWin(2);
            return;
        }

        setGameStats();

        let enemyCatText = attack.ammo + " cats " + attack.catText;
        let catText = playerAttack.ammo + " cats " + playerAttack.catText;

        if (playerAttack.ammo === 1) {
            catText = playerAttack.ammo + " cat " + playerAttack.catText;
        } else if (attack.ammo === 1) {
            enemyCatText = attack.ammo + " cat " + attack.catText;
        }

        let text = "You " + playerAttack.playerText;
        let enemyText = currEnemy.name + " " + attack.enemyText;

        $(gameText).html(text + "<br><br>" + catText + "<br><br>" + enemyText + "<br><br>" + enemyCatText);
    });


    $(".crazyCatLady").unbind("click").bind("click", (function(){
        currEnemy = $(this).data("object");
        setButtons.showAttacksHideEnemies();
        $("#enemyCats").text(currEnemy.cats);
        $("#enemyEnergy").text(currEnemy.ammo);
        $("#eventText").text("");
    }));
}

const Attacks = {
    fancyFeast: {
        ammo: 10,
        playerButtonText: "Open up some Fancy Feast",
        playerText: "viciously tear open a can of Fancy Feast!",
        enemyText: "cranks open a can of Fancy Feast, visibly trembling with the effort!",
        catText: "race over at the sound!"
    },
    laserPointer: {
        ammo: 6,
        playerButtonText: "Activate laser pointer",
        playerText: "flail around with a laser pointer!",
        enemyText: "wildly fires off her laser pointer!",
        catText: "chase after the laser!"
    },
    string: {
        ammo: 3,
        playerButtonText: "Wiggle some string",
        playerText: "do a fancy ribbon dance with a length of twine!",
        enemyText: "attempts to seduce your felines with some fancy ribbon play!",
        catText: "are vaguely tempted and meander over lazily."
    },
    catnip: {
        ammo: 15,
        playerButtonText: "Cover yourself in catnip",
        playerText: "smother your body in catnip!",
        enemyText: "throws a whole container of catnip over her head!",
        catText: "instantly race over and begin rolling around!"
    },
    robotMouse: {
        ammo: 12,
        playerButtonText: "Zip a robotic mouse over",
        playerText: "send a robotic mouse to bait some kitties!",
        enemyText: "glares at you angrily as her robotic mouse zooms around your cats!",
        catText: "chase after it excitedly!"
    },
    dryFood: {
        ammo: 1,
        playerButtonText: "Throw some dry cat food",
        playerText: "dump some dry food ceremoniously on the ground.",
        enemyText: "throws some dry food up in the air as an offering!",
        catText: "slowly walks over and begins munching."
    },
};

const attackArray = Object.keys(Attacks);


function CrazyCatLady() {
}

function constructCatLady(catLadyName, catLadyAmmo, catLadyCats, index, attacks) {
    let crazyCatLady = new CrazyCatLady();
    crazyCatLady.id = "crazyCatLady" + index;
    let button = $("<button>").attr({
        id: crazyCatLady.id,
        class: "fancyButton crazyCatLady"
    }).text(crazyCatLady.name).appendTo("#enemyButtons");
    crazyCatLady.name = catLadyName;
    crazyCatLady.ammo = catLadyAmmo;
    crazyCatLady.cats = catLadyCats;
    crazyCatLady.availableAttacks = attacks;
    crazyCatLady.button = button;

    button.text(catLadyName);
    button.data("object", crazyCatLady);
    return crazyCatLady;
}

function enemyAttack(availableAttacks) {
    return Attacks[(attackArray[availableAttacks[Math.round(Math.random() * (availableAttacks.length - 1))]])];
}

function playerWin(winCondition) {
    setButtons.showEnemiesHideAttacks();
    $(currEnemy.button).remove();
    enemies--;
    if(enemies === 0) {
        gameText.text("Congratulations! All the neighborhood cats are yours!");
        setButtons.showRestartHideAttackEnemy();
        return;
    }
    if(winCondition === 1) {
        gameText.html("You got all of " + currEnemy.name + "'s cats! Congratulations! Now take her energy and go get some more.");
        player.ammo += currEnemy.ammo;
        setGameStats();
    } else if(winCondition === 2){
        gameText.html(currEnemy.name + " ran out of energy and collapsed! Nice! Now take her cats and go get some more.");
        player.cats += currEnemy.cats;
        setGameStats();
    }
}

function playerLose(lossCondition) {
    $("#enemyButtons").empty();
    if(lossCondition === 1){
        gameText.text("Oh no! All your cats are gone!");
        setButtons.showRestartHideAttackEnemy();
    } else if(lossCondition === 2){
        gameText.text("Oh no! You've run out of energy and all your cats got stolen!");
        setButtons.showRestartHideAttackEnemy();
    }
}

function setGameStats(){
    $("#cats").text(player.cats);
    $("#energy").text(player.ammo);

    $("#enemyCats").text(currEnemy.cats);
    $("#enemyEnergy").text(currEnemy.ammo);
}

