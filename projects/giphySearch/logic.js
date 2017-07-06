const categories = ["Cats", "Cakes", "Cookies", "Corvettes", "Corgis", "Coffee", "Corn", "Cornucopias",
"Corks", "Camouflage", "Carpets", "Creeks", "Cards", "Carols", "Christmas"];
const buttonHolder = $("#buttonHolder");
const gifHolder = $("#gifHolder");

function genButtons(categories){
    categories.forEach(function(category){
        $("<button>").addClass("btn btn--md btn--blue")
            .text(category)
            .val(category)
            .prependTo(buttonHolder)
            .click(e=> {
                $(gifHolder).children().remove();
                getGiphy($(e.currentTarget).val(), 10);
            });
    });
}

function getGiphy(search, limit){
    let url = "https://api.giphy.com/v1/gifs/search";
    let parameters ={
        "q": search,
        "api_key": "1f8ff565529d4b1086779febdb9eb7cf",
        "limit": limit
    };

    url += "?" + $.param(parameters);

    axios.get(url)
        .then(function(response){
            displayGifs(response.data.data);
        })
        .catch(function(error){
            console.log(error);
        });
}

function displayGifs(gifData){
    gifData.forEach(function(gif){
        $(gifHolder).append($("<div>")
            .append($("<img>")
                .attr({
                    "src": gif.images["fixed_height_small_still"].url,
                    "alt": "gif of" + gif.slug,
                    "class": "gif",
                    "data-switch": gif.images["fixed_height_downsampled"].url
                }),
                $("<div>").text(gif.rating)));
    });
}

$(document).ready(function(){
    genButtons(categories);
    $("#resetButton").click(e=>{
        $(gifHolder).children().remove();
    });
});

$(document).on("click", ".gif", function(){
    let switchState = $(this).attr("src");
    this.src = $(this).attr("data-switch");
    $(this).attr("data-switch", switchState);
});

$(document).on("click", "#submitButton", function(){
    $(gifHolder).children().remove();
    let userInput = $("#userInput").val().trim();
    getGiphy(userInput, 10);
});