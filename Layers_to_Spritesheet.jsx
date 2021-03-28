//First prompt the user to input a number to represent the number of
//columns the final image will have.
//
var inputColumns = prompt("This value will be the maximum number of sprites what will fit in a single row before breaking and going to the next line."
                        ,"Sprites per row"
                        ,"Please input the number of sprites per row");

var skip = prompt("This is how many background layers you have at the bottom of the picture, these won't be moved."
                    , "Skip these many layers"
                    , "Please indicate how many layers to skip.");

//Take the input string and turn it into an integer.
columns = Math.abs(parseInt(inputColumns));

//Check if columns is a valid input.
if (isNaN(columns)) {
    alert('Not a number, please try again.');
}
else {
    //get a reference to the current open document
    doc = app.activeDocument;

    //catch if columns is 0 or lower, because we'll use it as a divisor
    if (columns < 0) {columns = 1};
    if (isNaN(skip) || (skip < 0)) {
        alert("Invalid number of skiped frames, won't skip any.")
        skip = 0;
        }

    //get the current height and width of the active document
    initHeight = doc.height;
    initWidth = doc.width;

    //get the number of sprites on the document.
    allLayers = [];
    allLayers = collectAllLayers(doc, allLayers);
    numberOfSprites = allLayers.length;

    //resize the canvas to its necesary width.
    newWidth = initWidth * columns;
    rows = Math.ceil(numberOfSprites / columns);
    newHeigth = initHeight * rows;
    doc.resizeCanvas(newWidth, newHeigth, AnchorPosition.TOPLEFT);

    //Hide all layers to start working our way from top to bottom.
    hideAllLayers(allLayers);

    //Create a nested loop to move every layer to the desired desition.
    //start from the bottom and go up to make sure they are aligned properly.
    for(a = 0; a < numberOfSprites; a++) {
        //get the modulo and quotient in order to determine the offset to move every layers in place.
        //get variable b, b is the 'complement' of a an will be used to determine modulo and quotient.
        //b is necesary to invert the order of sprites and get them from bottom to top, which is more desirable.
            var vModulo, vQuotient, b;

            b = ((numberOfSprites-1) - a);
            vModulo = b % columns;
            vQuotient = Math.floor(b / columns);
        
        //move every layer by turning the layers visible and then moving them based on it's offset.
        if (allLayers[a].isBackgroundLayer == false) {
            allLayers[a].visible = true;
            //alert(allLayers[a]);
            allLayers[a].translate(initWidth * vModulo, initHeight * vQuotient);
            }
        //make a distintion and exception for the background layer if there's one present.
        else {
            allLayers[a].isBackgroundLayer = false;
            allLayers[a].visible = true;
            allLayers[a].translate(initWidth * vModulo, initHeight * vQuotient);
            allLayers[a].isBackgroundLayer = true;
            }
        }
}

function collectAllLayers (doc, allLayers){  //(document path, array to populate with layers.)
    //returns array containing all posible layers.
    for (var m = 0; m < doc.layers.length; m++){
        var theLayer = doc.layers[m];
        if (theLayer.typename === "ArtLayer"){
            allLayers.push(theLayer);
        }else{
            collectAllLayers(theLayer, allLayers);
        }
    }
    return allLayers;
}

function hideAllLayers(layersToHide) { //(array containing all layers)
    for(i = 0; i < layersToHide.length; i++) {
        layersToHide[i].visible = false;
    }
}