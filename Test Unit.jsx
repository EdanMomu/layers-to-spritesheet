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
};

doc = app.activeDocument;
allLayers = [];
allLayers = collectAllLayers(doc, allLayers);

allLayers[0].translate(2, 2);