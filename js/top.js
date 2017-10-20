//prepare page
$(document).ready(function(){
    topCharacters();
    topAttributes();
});

//function to process requests to and from the server
function makeRequest(action,table,field,amount,callback) {
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

function topCharacters () {
    makeRequest("TOP",'characters','name, skill',10, function(result) {
    var array = JSON.parse(result);
    for (var i=0;i<array.length;i++) {
        document.getElementById("characters").innerHTML += `<tr><td style="text-align:left;">${i+1}</td><td style="text-align:left;">${array[i].name.toTitleCase()}</td> <td style="text-align:right;">${Math.round(Number(array[i].skill))}</td></tr>`
    }
    });
}

function topAttributes () {
    makeRequest("TOP",'attributes','name, skill',10, function(result) {
    var array = JSON.parse(result);
    for (var i=0;i<array.length;i++) {
        document.getElementById("attributes").innerHTML += `<tr><td style="text-align:left;">${i+1}</td><td style="text-align:left;">${array[i].name.toTitleCase()}</td> <td style="text-align:right;">${Math.round(Number(array[i].skill))}</td></tr>`
    }
    });
    var ch = $("characters").height();
    var ch = $("attributes").height();
    var mh = Math.max(ch,ah);
    $("characters").height(mh);
    $("attributes").height(mh);
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