//prepare page
$(document).ready(function(){
    $("#redWins, #redLoses, #blueWins, #blueLoses").hide();//hide results text
    
    //choose character 1 as winner
    enableRedClick();
    
    //choose character 2 as winner
    enableBlueClick();
    
    //start a new battle
    $("#newBattle").click(function() {
        $("#redWins, #redLoses, #blueWins, #blueLoses").hide(); //hide results
        generateCharacters();
        disableClicks();
        enableRedClick();
        enableBlueClick();
    });
    
    generateCharacters();
});

//function to process requests to and from the server
var ajaxCounter = 0;
function makeRequest(action,table,field,amount,callback) {
    if (ajaxCounter !== null) {ajaxCounter++};
    var thisAction = action;
    $.ajax( {
        type: "POST",
        url: "js/process.php",
        async: true,
        data: {
            table: table,
            field: field,
            amount: Number(amount),
            action: action
        },
        success: callback
    })
}

//prepare character arrays
var character1 = [[],[],[]];
var character2 = [[],[],[]];

function enableRedClick() {
    //rebind character 1 click functions
    $("#character-1, #attribute-1-1, #attribute-2-1").click(function() {
        $("#redWins, #blueLoses").show();
        $("#character-1, #attribute-1-1, #attribute-2-1").effect("highlight",{color:"Gold"});
        $("#redWins").effect("bounce", { times:3 }, 300);
        results(1);//generate new ratings
        disableClicks();
    });
}

function enableBlueClick() {
    //rebind character 2 click functions
    $("#character-2, #attribute-1-2, #attribute-2-2").click(function() {
        $("#redLoses, #blueWins").show();
        $("#character-2, #attribute-1-2, #attribute-2-2").effect("highlight",{color:"Gold"});
        $("#blueWins").effect("bounce", { times:3 }, 300);
        results(2);//generate new ratings
        disableClicks();
    });
}

function disableClicks() {
    $("#character-1, #attribute-1-1, #attribute-2-1, #character-2, #attribute-1-2, #attribute-2-2").unbind('click');
}
            
function adjustHeights() {
    
    var redColumn = $("#character-1").height()+$("#attribute-1-1").height()+$("#attribute-2-1").height();
    var blueColumn = $("#character-2").height()+$("#attribute-1-2").height()+$("#attribute-2-2").height();
    var maxHeight = Math.max(redColumn,blueColumn);
    
    $("#character-1").animate({
        height: ($("#character-1").height()/redColumn)*maxHeight
    },1000);
    $("#attribute-1-1").animate({
        height: ($("#attribute-1-1").height()/redColumn)*maxHeight
    },1000);
    $("#attribute-2-1").animate({
        height: ($("#attribute-2-1").height()/redColumn)*maxHeight
    },1000);
    
    $("#character-2").animate({
        height: ($("#character-2").height()/blueColumn)*maxHeight
    },1000);
    $("#attribute-1-2").animate({
        height: ($("#attribute-1-2").height()/blueColumn)*maxHeight
    },1000);
    $("#attribute-2-2").animate({
        height: ($("#attribute-2-2").height()/blueColumn)*maxHeight
    },1000);
    
}

function checkAjax() {
    if (ajaxCounter !== null) {
        ajaxCounter--;
        if (ajaxCounter == 0) {
            adjustHeights();
        }
    }
}
//function to fetch characters and attributes from the server
function generateCharacters() {
    //get characters
    makeRequest("GET","characters","name, skill", 2, function(json) {
        var results = JSON.parse(json);//parse json returned by server
        //move parsed results into arrays
        //character-1
        character1[0].name = results[0].name;
        character1[0].skill = Number(results[0].skill);
        //character-2
        character2[0].name = results[1].name;
        character2[0].skill = Number(results[1].skill);
        //apply results to page elements
        $("#character-1-name").text(character1[0].name.toTitleCase());
        $("#character-1-rating").text("Rating: " + String(Math.round(character1[0].skill)));
        $("#character-2-name").text(character2[0].name.toTitleCase());
        $("#character-2-rating").text("Rating: " + String(Math.round(character2[0].skill)));
        checkAjax();
    });
    
    //get attributes
    makeRequest("GET","attributes","name, skill", 4, function(json) {
        var results = JSON.parse(json); //parse json returned by server
        //move results into arrays
        //attribute1-1
        character1[1].name = results[0].name;
        character1[1].skill = results[0].skill;
        //attribute1-2
        character1[2].name = results[1].name;
        character1[2].skill = results[1].skill;
        //attribute2-1
        character2[1].name = results[2].name;
        character2[1].skill = results[2].skill;
        //attribute2-2
        character2[2].name = results[3].name;
        character2[2].skill = results[3].skill;
        
        //replace item wild card in attributes
        function replaceWildcard(str) {
            if (str.includes("&&",0)) {
                makeRequest("GET","items","name",1,function(json) {
                    results = JSON.parse(json);
                    var string = str.replace("&&",results[0].name);
                    switch (str) {
                        case character1[1].name:
                            $("#attribute-1-1-name").text(string.toTitleCase());
                            $("#attribute-1-1-rating").text("Rating: " + String(Math.round(character1[1].skill)));
                            break;
                        case character1[2].name:
                            $("#attribute-2-1-name").text(string.toTitleCase());
                            $("#attribute-2-1-rating").text("Rating: " + String(Math.round(character1[2].skill)));
                            break;
                        case character2[1].name:
                            $("#attribute-1-2-name").text(string.toTitleCase());
                            $("#attribute-1-2-rating").text("Rating: " + String(Math.round(character2[1].skill)));
                            break;
                        case character2[2].name:
                            $("#attribute-2-2-name").text(string.toTitleCase());
                            $("#attribute-2-2-rating").text("Rating: " + String(Math.round(character2[2].skill)));
                            break;
                    }
                    checkAjax();
                })
            }else if (str.includes("**",0)) {
                makeRequest("GET","characters","name",1,function(json) {
                    results = JSON.parse(json);
                    var string = str.replace("**",results[0].name);
                    switch (str) {
                        case character1[1].name:
                            $("#attribute-1-1-name").text(string.toTitleCase());
                            $("#attribute-1-1-rating").text("Rating: " + String(Math.round(character1[1].skill)));
                            break;
                        case character1[2].name:
                            $("#attribute-2-1-name").text(string.toTitleCase());
                            $("#attribute-2-1-rating").text("Rating: " + String(Math.round(character1[2].skill)));
                            break;
                        case character2[1].name:
                            $("#attribute-1-2-name").text(string.toTitleCase());
                            $("#attribute-1-2-rating").text("Rating: " + String(Math.round(character2[1].skill)));
                            break;
                        case character2[2].name:
                            $("#attribute-2-2-name").text(string.toTitleCase());
                            $("#attribute-2-2-rating").text("Rating: " + String(Math.round(character2[2].skill)));
                            break;
                    }
                    checkAjax();
                })
            } else {
                $("#attribute-1-1-name").text(character1[1].name.toTitleCase());
                $("#attribute-1-1-rating").text("Rating: " + String(Math.round(character1[1].skill)));
                $("#attribute-2-1-name").text(character1[2].name.toTitleCase());
                $("#attribute-2-1-rating").text("Rating: " + String(Math.round(character1[2].skill)));
                
                $("#attribute-1-2-name").text(character2[1].name.toTitleCase());
                $("#attribute-1-2-rating").text("Rating: " + String(Math.round(character2[1].skill)));
                $("#attribute-2-2-name").text(character2[2].name.toTitleCase());
                $("#attribute-2-2-rating").text("Rating: " + String(Math.round(character2[2].skill)));
            }
        }
        replaceWildcard(character1[1].name);
        replaceWildcard(character1[2].name);
        replaceWildcard(character2[1].name);
        replaceWildcard(character2[2].name);
    });
}

function results(winner) {
    
    //declare general variables
    var s1 = 0;
    var s2 = 0;
    var k = 32;
    
    //determine s value based on winning team
    if (winner == 1) {
        s1=1;
        s2=0;
    } else {
        s1=0;
        s2=1;
    }
    
    //grab initial ratings
    var c1_c_r1 = Number(character1[0].skill); //character1 character skill
    var c1_a1_r1 = Number(character1[1].skill); //character1 attribute1 skill
    var c1_a2_r1 = Number(character1[2].skill); //character1 attribute2 skill
    
    var c2_c_r1 = Number(character2[0].skill); //character2 character skill
    var c2_a1_r1 = Number(character2[1].skill); //character2 attribute1 skill
    var c2_a2_r1 = Number(character2[2].skill); //character2 attribute2 skill
    
    //transform ratings
    var c1_c_R1 = Math.pow(10,c1_c_r1/400);
    var c1_a1_R1 = Math.pow(10,c1_a1_r1/400);
    var c1_a2_R1 = Math.pow(10,c1_a2_r1/400);
    
    var c2_c_R1 = Math.pow(10,c2_c_r1/400);
    var c2_a1_R1 = Math.pow(10,c2_a1_r1/400);
    var c2_a2_R1 = Math.pow(10,c2_a2_r1/400);
    
    //individual 'matches'
    //c1_c vs c2_c
    var c1_c_e11 = c1_c_R1/(c1_c_R1+c2_c_R1);
    var c2_c_e11 = c2_c_R1/(c1_c_R1+c2_c_R1);
    var c1_c_r1n1 = c1_c_r1 + k * (s1-c1_c_e11);
    var c2_c_r1n1 = c2_c_r1 + k * (s2-c2_c_e11);
    
    //c1_c vs c2_a1
    var c1_c_e12 = c1_c_R1/(c1_c_R1+c2_a1_R1);
    var c2_a1_e11 = c2_a1_R1/(c1_c_R1+c2_a1_R1);
    var c1_c_r1n2 = c1_c_r1 + k * (s1-c1_c_e12);
    var c2_a1_r1n1 = c2_a1_r1 + k * (s2-c2_a1_e11);
    
    //c1_c vs c2_a2
    var c1_c_e13 = c1_c_R1/(c1_c_R1+c2_a2_R1);
    var c2_a2_e11 = c2_a1_R1/(c1_c_R1+c2_a2_R1);
    var c1_c_r1n3 = c1_c_r1 + k * (s1-c1_c_e13);
    var c2_a2_r1n1 = c2_a1_r1 + k * (s2-c2_a2_e11);
    
    //c1_a1 vs c2_c
    var c1_a1_e11 = c1_a1_R1/(c1_a1_R1+c2_c_R1);
    var c2_c_e12 = c2_c_R1/(c1_a1_R1+c2_c_R1);
    var c1_a1_r1n1 = c1_a1_r1 + k * (s1-c1_a1_e11);
    var c2_c_r1n2 = c2_c_r1 + k * (s2-c2_c_e12);
    
    //c1_a1 vs c2_a1
    var c1_a1_e12 = c1_a1_R1/(c1_a1_R1+c2_a1_R1);
    var c2_a1_e12 = c2_a1_R1/(c1_a1_R1+c2_a1_R1);
    var c1_a1_r1n2 = c1_a1_r1 + k * (s1-c1_a1_e12);
    var c2_a1_r1n2 = c2_a1_r1 + k * (s2-c2_a1_e12);
    
    //c1_a1 vs c2_a2
    var c1_a1_e13 = c1_a1_R1/(c1_a1_R1+c2_a2_R1);
    var c2_a2_e12 = c2_a2_R1/(c1_a1_R1+c2_a2_R1);
    var c1_a1_r1n3 = c1_a1_r1 + k * (s1-c1_a1_e13);
    var c2_a2_r1n2 = c2_a2_r1 + k * (s2-c2_a2_e12);
    
    //c1_a2 vs c2_c
    var c1_a2_e11 = c1_a2_R1/(c1_a2_R1+c2_c_R1);
    var c2_c_e13 = c2_c_R1/(c1_a2_R1+c2_c_R1);
    var c1_a2_r1n1 = c1_a2_r1 + k * (s1-c1_a2_e11);
    var c2_c_r1n3 = c2_c_r1 + k * (s2-c2_c_e13);
    
    //c1_a2 vs c2_a1
    var c1_a2_e12 = c1_a2_R1/(c1_a2_R1+c2_a1_R1);
    var c2_a1_e13 = c2_a1_R1/(c1_a2_R1+c2_a1_R1);
    var c1_a2_r1n2 = c1_a2_r1 + k * (s1-c1_a1_e12);
    var c2_a1_r1n3 = c2_a1_r1 + k * (s2-c2_a1_e13);
    
    //c1_a2 vs c2_a2
    var c1_a2_e13 = c1_a2_R1/(c1_a2_R1+c2_a2_R1);
    var c2_a2_e13 = c2_a2_R1/(c1_a2_R1+c2_a2_R1);
    var c1_a2_r1n3 = c1_a2_r1 + k * (s1-c1_a2_e13);
    var c2_a2_r1n3 = c2_a2_r1 + k * (s2-c2_a2_e12);
    
    //final ratings calculations
    var c1_c_r1n = (c1_c_r1n1+c1_c_r1n2+c1_c_r1n3)/3;
    var c1_a1_r1n = (c1_a1_r1n1+c1_a1_r1n2+c1_a1_r1n3)/3;
    var c1_a2_r1n = (c1_a2_r1n1+c1_a2_r1n2+c1_a2_r1n3)/3;
    
    var c2_c_r1n = (c2_c_r1n1+c2_c_r1n2+c2_c_r1n3)/3;
    var c2_a1_r1n = (c2_a1_r1n1+c2_a1_r1n2+c2_a1_r1n3)/3;
    var c2_a2_r1n = (c2_a2_r1n1+c2_a2_r1n2+c2_a2_r1n3)/3;
    
    //apply changes to elements
    //character 1
    $("#character-1-rating").text("Rating: " + Math.round(c1_c_r1n));//character-1
    $("#attribute-1-1-rating").text("Rating: " + Math.round(c1_a1_r1n));//attribute-1-1
    $("#attribute-1-2-rating").text("Rating: " + Math.round(c1_a2_r1n));//attribute-1-2
    //character 2
    $("#character-2-rating").text("Rating: " + Math.round(c2_c_r1n));//character-2
    $("#attribute-2-1-rating").text("Rating: " + Math.round(c2_a1_r1n));//attribute-2-1
    $("#attribute-2-2-rating").text("Rating: " + Math.round(c2_a2_r1n));//attribute-2-2
    
    //send new ratings to server
    //character 1
    makeRequest("POST","characters",character1[0].name,c1_c_r1n,function() {
    });
    makeRequest("POST","attributes",character1[1].name,c1_a1_r1n,function() {
    });
    makeRequest("POST","attributes",character1[2].name,c1_a2_r1n,function() {
    });
    //character 2
    makeRequest("POST","characters",character2[0].name,c2_c_r1n,function() {
    });
    makeRequest("POST","attributes",character2[1].name,c2_a1_r1n,function() {
    });
    makeRequest("POST","attributes",character2[2].name,c2_a2_r1n,function() {
    });
}

//convert strings to title case
String.prototype.toTitleCase = function(){
  var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;

  return this.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title){
    if (index > 0 && index + match.length !== title.length &&
      match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
      (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
      title.charAt(index - 1).search(/[^\s-]/) < 0) {
      return match.toLowerCase();
    }

    if (match.substr(1).search(/[A-Z]|\../) > -1) {
      return match;
    }

    return match.charAt(0).toUpperCase() + match.substr(1);
  });
};