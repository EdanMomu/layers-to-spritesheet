//First prompt the user to input a number to represent the number of
//columns the final image will have.
//
var inputColumns = prompt("This value will be the maximum number of sprites what will fit in a single row before breaking and going to the next line."
                        ,"Sprites per row"
                        ,"Please input the number of sprites per row");

//Take the input string and turn it into an integer.
columns = parseInt(inputColumns);

//Check if columns is a valid input.
if (isNaN(columns)) {
    alert('Not a number!');
}
else {
    //get a reference to the current open document
    doc = app.activeDocument;

    //catch if columns is 0, because we'll have to divide by it later
    if (columns == 0) {columns = 1};

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

    //Hide all layers to start working your way from top to bottom.
    hideAllLayers(allLayers);

    //Create a nested loop to move every layer to the desired desition.
    for(a = 0; a < numberOfSprites; a++) {
        //get the modulo and dividend in order to determine the offset to move every layers in place.
            var vModulo, vDividend;

            vModulo = a % columns;
            vDividend = Math.floor(a / columns);
        
        //move every layer by turning the layers visible and then moving them based on it's offset.
        if (allLayers[a].isBackgroundLayer == false) {
            allLayers[a].visible = true;
            allLayers[a].translate(initWidth * vModulo, initHeight * vDividend);
            }
        //make a distintion and exception for the background layer if there's one present.
        else {
            allLayers[a].isBackgroundLayer = false;
            allLayers[a].visible = true;
            allLayers[a].translate(initWidth * vModulo, initHeight * vDividend);
            allLayers[a].isBackgroundLayer = true;
            }
        }
}

function collectAllLayers (doc, allLayers){
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

function hideAllLayers(layersToHide) {
    for(i = 0; i < layersToHide.length; i++) {
        layersToHide[i].visible = false;
    }
}