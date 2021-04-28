

var ver10 = (version.indexOf('10') == 0);
var seg = 25;
var n = 2;
var paths = [];
getPathItemsInSelection(n, paths);


var window = createWindow();
window.show();

//main logic of the script
// it is called after UI is done
function logic(sub, r, g, b, x, y, z) {
    div(seg);
    //baseColor(sub, 1, r, g, b);
    baseColor(sub, 0, r, g, b, x, y, z);
    //hightlight();
    //texture();
    //transparency();
}

//creates UI
function createWindow() {
    var myWindow = new Window("dialog", "Form");
    // subdiv slider
    var subdivGroup = myWindow.add("group");
    subdivGroup.add("statictext", undefined, "Subdivisions:");
    var subdivText = subdivGroup.add("edittext", undefined, 3);
    subdivText.characters = 2;
    var subdivSlider = subdivGroup.add("slider", undefined, 3, 0, 10);
    subdivSlider.onChanging = function () {
        subdivText.text = Math.floor(subdivSlider.value);
    }

    myWindow.add("statictext", undefined, "Color (RGB):");

    // rgb
    var redGroup = myWindow.add("group");
    redGroup.add("statictext", undefined, "R:");
    var redGroupText = redGroup.add("edittext", undefined, 50);
    redGroupText.characters = 3;
    var redGroupSlider = redGroup.add("slider", undefined, 50, 0, 255);
    redGroupSlider.onChanging = function () {
        redGroupText.text = Math.floor(redGroupSlider.value);
    }
    var greenGroup = myWindow.add("group");
    greenGroup.add("statictext", undefined, "G:");
    var greenGroupText = greenGroup.add("edittext", undefined, 50);
    greenGroupText.characters = 3;
    var greenGroupSlider = greenGroup.add("slider", undefined, 50, 0, 255);
    greenGroupSlider.onChanging = function () {
        greenGroupText.text = Math.floor(greenGroupSlider.value);
    }
    var blueGroup = myWindow.add("group");
    blueGroup.add("statictext", undefined, "B:");
    var blueGroupText = blueGroup.add("edittext", undefined, 50);
    blueGroupText.characters = 3;
    var blueGroupSlider = blueGroup.add("slider", undefined, 50, 0, 255);
    blueGroupSlider.onChanging = function () {
        blueGroupText.text = Math.floor(blueGroupSlider.value);
    }

    // light direction 
    var lightGroup = myWindow.add("group");
    lightGroup.add("statictext", undefined, "Light Direction:");

    var lightGroupInputs = lightGroup.add("group");
    lightGroupInputs.orientation = "column";
    var lightGroupX = lightGroupInputs.add("group");
    var lightGroupXText = lightGroupX.add("edittext", undefined, 0);
    lightGroupXText.characters = 5;
    var lightGroupXSlider = lightGroupX.add("slider", undefined, 0, -1, 1);
    lightGroupXSlider.onChanging = function () {
        lightGroupXText.text = lightGroupXSlider.value.toFixed(3);
    }
    var lightGroupY = lightGroupInputs.add("group");
    var lightGroupYText = lightGroupY.add("edittext", undefined, 0);
    lightGroupYText.characters = 5;
    var lightGroupYSlider = lightGroupY.add("slider", undefined, 0, -1, 1);
    lightGroupYSlider.onChanging = function () {
        lightGroupYText.text = lightGroupYSlider.value.toFixed(3);
    }
    var lightGroupZ = lightGroupInputs.add("group");
    var lightGroupZText = lightGroupZ.add("edittext", undefined, 1);
    lightGroupZText.characters = 5;
    var lightGroupZSlider = lightGroupZ.add("slider", undefined, 1, -1, 1);
    lightGroupZSlider.onChanging = function () {
        lightGroupZText.text = lightGroupZSlider.value.toFixed(3);
    }

    // buttons 
    var myButtonGroup = myWindow.add("group");
    myButtonGroup.alignment = "right";
    var okay = myButtonGroup.add("button", undefined, "OK");
    okay.onClick = function () {
        n = parseInt(subdivText.text);
        r = parseInt(redGroupText.text);
        g = parseInt(greenGroupText.text);
        b = parseInt(blueGroupText.text);
        lightX = parseFloat(lightGroupXText.text);
        lightY = parseFloat(lightGroupYText.text);
        lightZ = parseFloat(lightGroupZText.text);
        div();
        logic(n, r, g, b, lightX, lightY, lightZ); // pass in arguments to logic, which used to be interpolate()
        myWindow.hide();
    }
    myButtonGroup.add("button", undefined, "Cancel");
    return myWindow;
}

//creates a highlight layer
function hightlight() {
    addLayer('highlight');
    var color = new RGBColor();
    color.red = 0;
    color.green = 0;
    color.blue = 255;
    var myDoc = app.activeDocument;
    var myLine = myDoc.pathItems.add();
    //set stroked to true so we can see the path
    myLine.stroked = true;
    myLine.strokeWidth = 50;
    myLine.filled = false;
    myLine.strokeColor = color;
    myLine.setEntirePath([[100, 200], [100, 300]]);
}

//creates a texture layer
function texture() {
    addLayer('texture');
}

//creates a transparency layer
function transparency() {
    addLayer('transparency');
}

//add a new layer with given name
function addLayer(name) {
    var myDoc = app.activeDocument;
    var myLayer = myDoc.layers.add();
    myLayer.name = name;
}

//create color with given r, g, b, step
//will not be used in the future
function createColor(step, r, g, b) {
        var startColor = new RGBColor();
        startColor.red = r / (step + 1);
        startColor.green = g;
        startColor.blue = b;
        return startColor;
}

// lambertian reflectance model: surface color * dot product(surface normal, light direction)
function getColor(px, py, pz, r, g, b, n, x, y, z) {
    //n is the normal of format [x, y, z]
    //this method is called in baseColor(), which is called by logic()
    //logic is called when the UI is all set in createWindow()
    
    var lambertian = n[0] * x + n[1] * y + n[2] * z;
    var startColor = new RGBColor();
    
    // remap colors to range (0, 1)
    red = r / 255 * lambertian;
    green = g / 255 * lambertian;
    blue = b / 255 * lambertian;
    
    // ensure colors are within range (0, 255)
    red = Math.max(0, red * 255);
    green = Math.max(0,  green * 255);
    blue = Math.max(0, blue * 255);
    red = Math.min(red, 255);
    green = Math.min(green, 255);
    blue = Math.min(blue, 255);
    
    // return color
    startColor.red = red;
    startColor.green = green;
    startColor.blue = blue;
    return startColor;
}


//create gradient color, will be modified later with normals
//will not be used in the future
function createGradientColor(brightest, darkest, colors) {
    var startColor = new RGBColor();
    startColor.red = brightest[1].red;
    startColor.green = brightest[1].green;
    startColor.blue = brightest[1].blue;

    var endColor = new RGBColor();
    endColor.red = darkest[1].red;
    endColor.green = darkest[1].green;
    endColor.blue = darkest[1].blue;
    
    //alert(startColor.green);
    //alert(endColor.green);

    var newGradient = app.activeDocument.gradients.add();
    newGradient.name = "newgradient" + (app.activeDocument.gradients.length + 1);
    newGradient.type = GradientType.RADIAL;
    // Modify the first gradient stop
    newGradient.gradientStops[0].rampPoint = 0;
    newGradient.gradientStops[0].midPoint = 50;
    newGradient.gradientStops[0].color = startColor;

    // Modify the last gradient stop
    newGradient.gradientStops[1].rampPoint = 100;
    newGradient.gradientStops[1].color = endColor;

    var color = new GradientColor();
    color.gradient = newGradient;
        
    return [color, brightest[2]];
}

//will not be used in the future
function createWidth(step) {

    return 100 / (step + 1);
}

//divide the path into segments of given length
function div(seg) {

    if (paths.length < 1) return;

    // Settings ====================

    var n = 2; // default dividing number
    // =============================
    

    var i, j, k, p, q;
    var pnts, len, ar, redrawflg;

    for (var h = 0; h < paths.length; h++) {
        redrawflg = false;
        pnts = [];
        p = paths[h].pathPoints;

        for (i = 0; i < p.length; i++) {
            j = parseIdx(p, i + 1);
            if (j < 0) break;
            if (!sideSelection(p[i], p[j])) continue;

            ar = [i];
            q = [p[i].anchor, p[i].rightDirection,
                 p[j].leftDirection, p[j].anchor];

            len = getT4Len(q, 0); //length of entire segment

            n = Math.abs(len / seg); //find how many division is needed

            len = getT4Len(q, 0) / n; //find segment length of each division

            if (len <= 0) continue;

            redrawflg = true;

            for (k = 1; k < n - 1; k++) {
                ar.push(getT4Len(q, len * k));
            }
            pnts.push(ar);
        }
        if (redrawflg) addPnts(paths[h], pnts, false);
    }
    activeDocument.selection = paths;
}


//create base color (mode = 0) or translucency (mode >0)
function baseColor(sub, mode, r, g, b, x, y, z) {
    if (mode == 0) {
        addLayer('base');
    } else {
        addLayer('translucency');
    }
    
    for (var h = 0; h < paths.length; h++) {
        //first, find bounding box vertices
        var minX, minY, maxX, maxY;
        pnts = [];
        p = paths[h].pathPoints;
        normals = [];

        var firstAnchor = p[0].anchor;
        minX = firstAnchor[0];
        maxX = firstAnchor[0];
        minY = firstAnchor[1];
        maxY = firstAnchor[1];

        for (i = 0; i < p.length; i++) {
            var point = p[i].anchor;
            if (point[0] < minX) {
                minX = point[0];
            }
            if (point[0] > maxX) {
                maxX = point[0];
            }
            if (point[1] < minY) {
                minY = point[1];
            }
            if (point[1] > maxY) {
                maxY = point[1];
            }

            //calculate normal of each point
            var left_idx = i - 1;
            var right_idx = i + 1;
            if (i == 0) {
                left_idx = p.length - 1;
            }
            if (i == p.length - 1) {
                right_idx = 0;
            }

            var left_anchor = p[left_idx].anchor;
            var right_anchor = p[right_idx].anchor;
            var left_right = [left_anchor[0] - right_anchor[0], left_anchor[1] - right_anchor[1]];
            var normal_x = left_right[1];
            var normal_y = -1 * left_right[0];
            normal_x /= Math.sqrt(normal_x * normal_x + normal_y * normal_y);
            normal_y /= Math.sqrt(normal_x * normal_x + normal_y * normal_y);
            normal = [normal_x, normal_y, 0];
            normals.push(normal);
            //visualize normal
            /*
            var line = app.activeDocument.pathItems.add();
            line.stroked = true;
            line.setEntirePath([point, [point[0] + 10 * normal[0], point[1] + 10 * normal[1]]]);
            */
            
        }

        var d1, d2, d3, d4, centerX, centerY, index1, index2, index3, index4;
        d1 = Number.MAX_VALUE;
        d2 = Number.MAX_VALUE;
        d3 = Number.MAX_VALUE;
        d4 = Number.MAX_VALUE;

        centerX = (minX + maxX) / 2;
        centerY = (minY + maxY) / 2;

        // find the four points that is closest to the vertices of the bounding box
        // formula is d=√((x_2-x_1)²+(y_2-y_1)²)
        for (i = 0; i < p.length; i++) {
            var point = p[i].anchor; //each point, first find its quadrant, then see if index1, 2, 3, 4 needs to be updated with the index of this point
            if (point[0] <= centerX && point[1] <= centerY) { // bottom left quad: 1
                var d = ((point[0] - minX) * (point[0] - minX)) + ((point[1] - minY) * (point[1] - minY));
                if (d < d1) {
                    index1 = i;
                    d1 = d;
                }
            } else if (point[0] >= centerX && point[1] <= centerY) { // bottom right quad: 2
                var d = ((point[0] - maxX) * (point[0] - maxX)) + ((point[1] - minY) * (point[1] - minY));
                if (d < d2) {
                    index2 = i;
                    d2 = d;
                }
            } else if (point[0] >= centerX && point[1] >= centerY) { // top right quad: 3
                var d = ((point[0] - maxX) * (point[0] - maxX)) + ((point[1] - maxY) * (point[1] - maxY));
                if (d < d3) {
                    index3 = i;
                    d3 = d;
                }
            } else if (point[0] <= centerX && point[1] >= centerY) { // top left quad: 4
                var d = ((point[0] - minX) * (point[0] - minX)) + ((point[1] - maxY) * (point[1] - maxY));
                if (d < d4) {
                    index4 = i;
                    d4 = d;
                }
            }
        }
        layers = [];
        layer_normals = [];
        findMid(p, index1, index2, index3, index4, centerX, centerY, normals, layers, layer_normals);
        var px = 2 * point[0] / (maxX - minX) + minX - 1;
        var py = 2 * point[1] / (maxY - minY) + minY - 1; 
        var color = drawBaseColor(layers, layer_normals, mode, px, py, 0, r, g, b, x, y, z);
        var points = [color[1][0] - centerX, color[1][1] - centerY];
        newRect([[minX, minY], [minX, maxY], [maxX, maxY], [maxX, minY]], color[0], points);
    }
}

//return a list of lists of interpolatde paths
function findMid(p, a, b, c, d, cx, cy, n, layers, normals) {
    //define all the points for the four lines divided by the four corner points
    line1a = [];
    line2a = [];
    line3a = [];
    line4a = [];

    line1n = [];
    line2n = [];
    line3n = [];
    line4n = [];

    //for line defined by a, b
    if (testDiv(p.length, a, b)) {
        for (i = Math.max(a, b) ; i < p.length; i++) {
            line1a.push(p[i].anchor);
            line1n.push(n[i]);
        }
        for (i = 0; i <= Math.min(a, b) ; i++) {
            line1a.push(p[i].anchor);
            line1n.push(n[i]);
        }
    } else {
        for (i = Math.min(a, b) ; i <= Math.max(a, b) ; i++) {
            line1a.push(p[i].anchor);
            line1n.push(n[i]);
        }
    }
    
    //for line defined by b, c
    if (testDiv(p.length, c, b)) {
        for (i = Math.max(c, b) ; i < p.length; i++) {
            line2a.push(p[i].anchor);
            line2n.push(n[i]);
        }
        for (i = 0; i <= Math.min(c, b) ; i++) {
            line2a.push(p[i].anchor);
            line2n.push(n[i]);
        }
    } else {
        for (i = Math.min(c, b) ; i <= Math.max(c, b) ; i++) {
            line2a.push(p[i].anchor);
            line2n.push(n[i]);
        }
    }

    //for line defined by c, d
    if (testDiv(p.length, c, d)) {
        
        for (i = Math.max(c, d) ; i < p.length; i++) {
            line3a.push(p[i].anchor);
            line3n.push(n[i]);
        }
        for (i = 0; i <= Math.min(c, d) ; i++) {
            line3a.push(p[i].anchor);
            line3n.push(n[i]);
        }
    } else {
        for (i = Math.min(c, d) ; i <= Math.max(c, d) ; i++) {
            line3a.push(p[i].anchor);
            line3n.push(n[i]);
        }
    }

    // for line defined by a, d
    if (testDiv(p.length, a, d)) {
        for (i = Math.max(a, d) ; i < p.length; i++) {
            line4a.push(p[i].anchor);
            line4n.push(n[i]);
        }
        for (i = 0; i <= Math.min(a, d) ; i++) {
            line4a.push(p[i].anchor);
            line4n.push(n[i]);
        }
        
    } else {
        for (i = Math.min(a, d) ; i <= Math.max(a, d) ; i++) {
            line4a.push(p[i].anchor);
            line4n.push(n[i]);
        }
    }
    
    //reverse 3 and 4
    line4a_rev = reverseList(line4a);
    line3a_rev = reverseList(line3a);
    line4n_rev = reverseList(line4n);
    line3n_rev = reverseList(line3n);

    layer1 = []
    layer2 = []
    layer3 = []
    layer4 = []

    norm1 = []
    norm2 = []
    norm3 = []
    norm4 = []

    maxStep = 10;

    layer1 = createMid(line2a, line4a_rev, maxStep, 0, 0, layer1);
    layer2 = createMid(line2a, line4a_rev, maxStep, 0, 1, layer2);
    layer3 = createMid(line1a, line3a_rev, maxStep, 0, 0, layer3);
    layer4 = createMid(line1a, line3a_rev, maxStep, 0, 1, layer4);
    layers.push(layer1);
    layers.push(layer2);
    layers.push(layer3);
    layers.push(layer4);

    norm1 = createMidNorm(line2n, line4n_rev, maxStep, 0, 0, norm1);
    norm2 = createMidNorm(line2n, line4n_rev, maxStep, 0, 1, norm2);
    norm3 = createMidNorm(line1n, line3n_rev, maxStep, 0, 0, norm3);
    norm4 = createMidNorm(line1n, line3n_rev, maxStep, 0, 1, norm4);
    normals.push(norm1);
    normals.push(norm2);
    normals.push(norm3);
    normals.push(norm4);

}

//draw base color
function drawBaseColor(layers, normals, mode, px, py, pz, r, g, b, x, y, z) {
    layer1 = layers[0];
    layer2 = layers[1];
    layer3 = layers[2];
    layer4 = layers[3];

    normal1 = normals[0];
    normal2 = normals[1];
    normal3 = normals[2];
    normal4 = normals[3];
    
    var colors = [];
    var brightest = [Number.MIN_VALUE, new RGBColor(), [px, py, px]];
    var darkest = [Number.MAX_VALUE, new RGBColor(), [px, py, pz]];
    
    for (i = 0; i < layer1.length - 1; i++) {
        
        for (j = 0; j < layer1[0].length - 1; j++) {
            ids = [];
            ids.push(layer1[i][j]);
            ids.push(layer1[i][j + 1]);
            ids.push(layer1[i + 1][j + 1]);
            ids.push(layer1[i + 1][j]);

            n = normal1[i][j] // normal of one of the 4 points, could be updated to an average of all the 4 normals
            color = getColor(px, py, pz, r, g, b, n, x, y, z);
            if (j == Math.floor(layer4[0].length / 2)) {
                colors.push([[px, py, pz], color]);
            }
            brightness = color.red + color.green + color.blue;
            if (brightness > brightest[0]) {
                brightest[0] = brightness;
                brightest[1] = color;
                brightest[2] = [px, py, pz];
            } 
            if (brightness < darkest[0]) {
                darkest[0] = brightness;
                darkest[1] = color;
                darkest[2] = [px, py, pz];
            }

            //normal visualization
            /*
            var line = app.activeDocument.pathItems.add();
            line.stroked = true;
            point = layer1[i][j];
            w = normal1[i][j][2] * 20 + 5;
            line.setEntirePath([point, [point[0] + w * normal1[i][j][0], point[1] + w * normal1[i][j][1]]]);
            */
        }
        
    
        for (j = 0; j < layer2[0].length - 1; j++) {
            ids = [];
            ids.push(layer2[i][j]);
            ids.push(layer2[i][j + 1]);
            ids.push(layer2[i + 1][j + 1]);
            ids.push(layer2[i + 1][j]);
            n = normal2[i][j] // normal of one of the 4 points, could be updated to an average of all the 4 normals
            color = getColor(px, py, pz, r, g, b, n, x, y, z);
            if (j == Math.floor(layer4[0].length / 2)) {
                colors.push([[px, py, pz], color]);
            }
            brightness = color.red + color.green + color.blue;
            if (brightness > brightest[0]) {
                brightest[0] = brightness;
                brightest[1] = color;
                brightest[2] = [px, py, pz];
            } 
            if (brightness < darkest[0]) {
                darkest[0] = brightness;
                darkest[1] = color;
                darkest[2] = [px, py, pz];
            }

            //normal visualization
            /*
            var line = app.activeDocument.pathItems.add();
            line.stroked = true;
            point = layer2[i][j];
            w = normal2[i][j][2] * 20 + 5;
            line.setEntirePath([point, [point[0] + w * normal2[i][j][0], point[1] + w * normal2[i][j][1]]]);
            */
        }
    
        for (j = 0; j < layer3[0].length - 1; j++) {
            ids = [];
            ids.push(layer3[i][j]);
            ids.push(layer3[i][j + 1]);
            ids.push(layer3[i + 1][j + 1]);
            ids.push(layer3[i + 1][j]);
            n = normal3[i][j] // normal of one of the 4 points, could be updated to an average of all the 4 normals
            color = getColor(px, py, pz, r, g, b, n, x, y, z);
            if (j == Math.floor(layer4[0].length / 2)) {
                colors.push([[px, py, pz], color]);
            }
            brightness = color.red + color.green + color.blue;
            if (brightness > brightest[0]) {
                brightest[0] = brightness;
                brightest[1] = color;
                brightest[2] = [px, py, pz];
            } 
            if (brightness < darkest[0]) {
                darkest[0] = brightness;
                darkest[1] = color;
                darkest[2] = [px, py, pz];
            }

            //normal visualization
            /*
            var line = app.activeDocument.pathItems.add();
            line.stroked = true;
            point = layer3[i][j];
            w = normal3[i][j][2] * 20 + 5;
            line.setEntirePath([point, [point[0] + w * normal3[i][j][0], point[1] + w * normal3[i][j][1]]]);
            */
        }

        for (j = 0; j < layer4[0].length - 1; j++) {
            ids = [];
            ids.push(layer4[i][j]);
            ids.push(layer4[i][j + 1]);
            ids.push(layer4[i + 1][j + 1]);
            ids.push(layer4[i + 1][j]);
            n = normal4[i][j] // normal of one of the 4 points, could be updated to an average of all the 4 normals
            color = getColor(px, py, pz, r, g, b, n, x, y, z);
            if (j == Math.floor(layer4[0].length / 2)) {
                colors.push([[px, py, pz], color]);
            }
            brightness = color.red + color.green + color.blue;
            if (brightness > brightest[0]) {
                brightest[0] = brightness;
                brightest[1] = color;
                brightest[2] = [px, py, pz];
            } 
            if (brightness < darkest[0]) {
                darkest[0] = brightness;
                darkest[1] = color;
                darkest[2] = [px, py, pz];
            }
        
            //normal visualization
            /*
            var line = app.activeDocument.pathItems.add();
            line.stroked = true;
            point = layer4[i][j];
            w = normal4[i][j][2] * 20 + 5;
            line.setEntirePath([point, [point[0] + w * normal4[i][j][0], point[1] + w * normal4[i][j][1]]]);
            */
        }
    }
    
    return createGradientColor(brightest, darkest, colors);
}

// rectangle
function newRect(linepoints, color, points) {
    var myDoc = app.activeDocument;
    var group = myDoc.groupItems.add();
    var myLine = myDoc.pathItems.add();
    var selection = myDoc.selection[0];
    myLine.stroked = false;
    myLine.filled = false;
    myLine.fillColor = color;
    myLine.moveToBeginning(group);
    
    selection.filled = true;
    selection.stroked = false;
   
    var num = linepoints.length;
    for (var i = 0; i < num; i++) {
        var newPoint = myLine.pathPoints.add();
        newPoint.anchor = linepoints[i];
        if (i == 0) {
            newPoint.leftDirection = newPoint.anchor;
            newPoint.rightDirection = linepoints[i + 1];
        } else if (i == num - 1) {
            newPoint.leftDirection = linepoints[i - 1];
            newPoint.rightDirection = newPoint.anchor;
        } else {
            newPoint.leftDirection = linepoints[i - 1];
            newPoint.rightDirection = linepoints[i + 1];
        }
        newPoint.pointType = PointType.CORNER;
    }
    
    var scaleX = linepoints[2][0] - linepoints[0][0];
    var scaleY = linepoints[2][1] - linepoints[0][1];  
    
    alert(points);
    
    var scaleMatrix = app.getScaleMatrix (scaleX, scaleY);
    var scale_moveMatrix = app.concatenateTranslationMatrix(scaleMatrix, -1 * points[0] / 2, -1 * points[1] / 2);
    
    var move_scale_rotateMatrix = app.concatenateRotationMatrix (scale_moveMatrix, 0);
    //alert(move_scale_rotateMatrix.mValueTX);
    //alert(move_scale_rotateMatrix.mValueTY);
    myLine.transform(move_scale_rotateMatrix,true,false,true,false,0, Transformation.CENTER);
    selection.clipping = true;
    selection.moveToBeginning(group);
    group.clipped = true;
}

//reverse a list
function reverseList(list) {
    newList = [];
    for (i = 0; i < list.length; i ++) {
        newList.push(list[list.length - i - 1]);
    }
    return newList;
}

//test if line is divided by the start of the path
function testDiv(n, a, b) {
    lenH = Math.max(a, b) - Math.min(a, b);
    lenA = Math.min(a, b) + (n - Math.max(a, b));
    if (lenH > lenA) return true;
    return false;
}


//draw a mid path
function createMid(line1, line2, maxStep, currStep, mode, layer) {
    if (currStep >= maxStep) {
        return layer;
    } else {
        num = Math.min(line1.length, line2.length);
        newLine = [];
        for (i = 0; i < num; i++) {
            pnt_x = (line1[i][0] + line2[i][0]) / 2.0;
            pnt_y = (line1[i][1] + line2[i][1]) / 2.0;
            pnt = [pnt_x, pnt_y];
            newLine.push(pnt);
        }
        layer.push(newLine);
        
        if (mode == 0) {
            return createMid(line1, newLine, maxStep, currStep + 1, 0, layer);
        } else {
            return createMid(newLine, line2, maxStep, currStep + 1, 1, layer);
        }
        
    }
}

//draw a mid path
function createMidNorm(line1, line2, maxStep, currStep, mode, layer) {
    if (currStep >= maxStep) {
        return layer;
    } else {
        num = Math.min(line1.length, line2.length);
        newLine = [];
        for (i = 0; i < num; i++) {
            pnt_x = (line1[i][0] + line2[i][0]) / 2.0;
            pnt_y = (line1[i][1] + line2[i][1]) / 2.0;
            pnt_z = (line1[i][2] + line2[i][2]) / 2.0;
            if (currStep == 0) {
                pnt_z = 1;
            }
            pnt = [pnt_x, pnt_y, pnt_z];
            newLine.push(pnt);
        }
        layer.push(newLine);

        if (mode == 0) {
            return createMidNorm(line1, newLine, maxStep, currStep + 1, 0, layer);
        } else {
            return createMidNorm(newLine, line2, maxStep, currStep + 1, 1, layer);
        }

    }
}


//draw a path from given anchor points
//used to debug corners
function newPath(linepoints, color, width) {
    var myDoc = app.activeDocument;
    var myLine = myDoc.pathItems.add();
    myLine.stroked = true;
    myLine.strokeWidth = width;
    myLine.filled = false;
    myLine.strokeColor = color;
    var num = linepoints.length;
    for (var i = 0; i < num; i++) {
        var newPoint = myLine.pathPoints.add();
        newPoint.anchor = linepoints[i];
        if (i == 0) {
            newPoint.leftDirection = newPoint.anchor;
            newPoint.rightDirection = linepoints[i + 1];
        } else if (i == num - 1) {
            newPoint.leftDirection = linepoints[i - 1];
            newPoint.rightDirection = newPoint.anchor;
        } else {
            newPoint.leftDirection = linepoints[i - 1];
            newPoint.rightDirection = linepoints[i + 1];
        }
        newPoint.pointType = PointType.CORNER;
    }
}

// ----------------------------------------------


// Copyright(c) 2006-2009 SATO Hiroyuki
// addPnts: adds anchors to pathitem "pi"
// an example of usage:
/* var pi=activeDocument.selection[0];
var pnts = [ [0,  0.3,0.8,0.5],
             [3,  0.5] ];  // [ [i, t,t,t,t...],[i, t,t..
addPnts(pi,pnts,true);
 */
function addPnts(pi, pnts, need2sort) { // target pathItem, list, need to sort the parameters
    // pnts = [ [index,  t,t,t,t...],[index,  t,t..
    // items must be ordered by index
    // an item without t ([index]) is acceptable.  an empty allay is not acceptable.
    // an index out of bounds is acceptable.  the range of t is 0 < t < 1.
    var p = pi.pathPoints;
    var pnts2 = [];
    var adjNextLDir = 0;
    var adjFirstLDir = 0;
    var idx = (pi.closed && pnts[pnts.length - 1][0] == p.length - 1) ? 0 : pnts[0][0];
    var ar = pnts.shift();
    var nidx = ar.shift();
    var j, pnt, q;
    for (var i = idx; i < p.length; i++) {
        pnts2.push(getDat(p[i]));
        if (adjNextLDir > 0) {
            pnts2[pnts2.length - 1][2] = adjHanP(p[i], 0, 1 - adjNextLDir);
        }
        if (nidx == i) {
            if (ar.length > 0) {
                if (need2sort) {
                    ar.sort();
                    ar = getUniq(ar);
                }
                if (i == p.length - 1 && idx == 0) {
                    adjFirstLDir = ar[ar.length - 1];
                }
                pnts2[pnts2.length - 1][1] = adjHanP(p[i], 1, ar[0]),
                ar.unshift(0);
                ar.push(1);
                nxi = parseIdx(p, i + 1);
                if (nxi < 0) break;
                q = [p[i].anchor, p[i].rightDirection,
                     p[nxi].leftDirection, p[nxi].anchor];
                if (arrEq(q[0], q[1]) && arrEq(q[2], q[3])) {
                    for (j = 1; j < ar.length - 1; j++) {
                        pnt = bezier(q, ar[j]);
                        pnts2.push([pnt, pnt, pnt, PointType.CORNER]);
                    }
                } else {
                    for (j = 1; j < ar.length - 1; j++) {
                        pnts2.push(getDivPnt(q, ar[j - 1], ar[j], ar[j + 1]));
                    }
                }
                adjNextLDir = ar[ar.length - 2];
            } else {
                adjNextLDir = 0;
            }
            if (pnts.length > 0) {
                ar = pnts.shift();
                nidx = ar.shift();
            }
        } else {
            adjNextLDir = 0;
        }
    }
    if (adjFirstLDir > 0) pnts2[0][2] = adjHanP(p[0], 0, 1 - adjFirstLDir);
    if (pnts2.length > 0) applyData2AfterIdx(p, pnts2, idx - 1);
}
// ----------------------------------------------
function getUniq(ar) { // Array (sorted)
    if (ar.length < 2) return ar;
    var ar2 = [ar[0]];
    var torelance = 0.01;
    for (var i = 1; i < ar.length; i++) {
        if (ar[i] - ar2[ar2.length - 1] > torelance) ar2[ar2.length] = ar[i];
    }
    return ar2;
}
// ----------------------------------------------
// returns an array for properties of a pathpoint
function getDat(p) { // pathPoint
    with (p) return [anchor, rightDirection, leftDirection, pointType];
}
// ----------------------------------------------
// magnifies a handle by m
function adjHanP(p, n, m) { // p=pathpoint, n=0:leftDir, n=1:rightDir, m=magnification rate
    with (p) {
        var d = (n == 1 ? rightDirection : leftDirection);
        return [anchor[0] + (d[0] - anchor[0]) * m,
                anchor[1] + (d[1] - anchor[1]) * m];
    }
}
// ----------------------------------------------
// returns an array for properties of a pathpoint
// that corresponds to the parameter "t1"
// q=4 points, t0-2=parameters, anc=coordinate of anchor
function getDivPnt(q, t0, t1, t2, anc) {
    if (!anc) anc = bezier(q, t1);
    var r = defDir(q, 1, t1, anc, (t2 - t1) / (1 - t1));
    var l = defDir(q, 0, t1, anc, (t1 - t0) / t1);
    return [anc, r, l, PointType.SMOOTH];
}
// ----------------------------------------------
// returns the [x, y] coordinate of the handle of the point on the bezier curve
// that corresponds to the parameter "t"
// q=4 points, t=paramter, anc=coordinate of anchor, m=magnification ratio
function defDir(q, n, t, anc, m) { // n=0:ldir, n=1:rdir
    var dir = [t * (t * (q[n][0] - 2 * q[n + 1][0] + q[n + 2][0]) + 2 * (q[n + 1][0] - q[n][0])) + q[n][0],
                t * (t * (q[n][1] - 2 * q[n + 1][1] + q[n + 2][1]) + 2 * (q[n + 1][1] - q[n][1])) + q[n][1]];
    return [anc[0] + (dir[0] - anc[0]) * m,
            anc[1] + (dir[1] - anc[1]) * m];
}
// ----------------------------------------------
// return the [x, y] coordinate on the bezier curve
// that corresponds to the paramter "t"
function bezier(q, t) {
    var u = 1 - t;
    return [u * u * u * q[0][0] + 3 * u * t * (u * q[1][0] + t * q[2][0]) + t * t * t * q[3][0],
            u * u * u * q[0][1] + 3 * u * t * (u * q[1][1] + t * q[2][1]) + t * t * t * q[3][1]];
}
// ----------------------------------------------
function applyData2Path(p, pnts) { // pathpoint, list
    // (format:[[ anchor, rightDirection, leftDirection, poinType ],...]
    if (pnts.length < 1) return;

    var pt;

    while (p.length > pnts.length) {
        p[p.length - 1].remove();
    }

    for (var i in pnts) {
        pt = i < p.length ? p[i] : p.add();
        with (pt) {
            anchor = pnts[i][0];
            rightDirection = pnts[i][1];
            leftDirection = pnts[i][2];
            pointType = pnts[i][3];
        }
    }
}
// ----------------------------------------------
function applyData2AfterIdx(p, pnts, idx) { // pathpoint, list, index
    if (idx == null || idx < 0) {
        applyData2Path(p, pnts);
        return;
    }
    var pt;

    while (p.length - 1 > idx) {
        p[p.length - 1].remove();
    }

    for (var i = 0; i < pnts.length; i++) {
        pt = p.add();
        with (pt) {
            anchor = pnts[i][0];
            rightDirection = pnts[i][1];
            leftDirection = pnts[i][2];
            pointType = pnts[i][3];
        }
    }
}

// ------------------------------------------------
// returns true, if a segment between pathpoints ps1 and ps2 is selected
function sideSelection(ps1, ps2) {
    return (ps1.selected != PathPointSelection.NOSELECTION
        && ps1.selected != PathPointSelection.LEFTDIRECTION
        && ps2.selected != PathPointSelection.NOSELECTION
        && ps2.selected != PathPointSelection.RIGHTDIRECTION);
}
// ------------------------------------------------
// if the contents of both arrays are equal, return true (lengthes must be same)
function arrEq(arr1, arr2) {
    for (var i in arr1) {
        if (arr1[i] != arr2[i]) {
            return false;
        }
    }
    return true;
}

// ------------------------------------------------
// return the bezier curve parameter "t"
// at the point which the length of the bezier curve segment
// (from the point start drawing) is "len"
// when "len" is 0, return the length of whole this segment.
function getT4Len(q, len) {
    var m = [q[3][0] - q[0][0] + 3 * (q[1][0] - q[2][0]),
             q[0][0] - 2 * q[1][0] + q[2][0],
             q[1][0] - q[0][0]];
    var n = [q[3][1] - q[0][1] + 3 * (q[1][1] - q[2][1]),
             q[0][1] - 2 * q[1][1] + q[2][1],
             q[1][1] - q[0][1]];
    var k = [m[0] * m[0] + n[0] * n[0],
              4 * (m[0] * m[1] + n[0] * n[1]),
              2 * ((m[0] * m[2] + n[0] * n[2]) + 2 * (m[1] * m[1] + n[1] * n[1])),
              4 * (m[1] * m[2] + n[1] * n[2]),
              m[2] * m[2] + n[2] * n[2]];

    var fullLen = getLength(k, 1);

    if (len == 0) {
        return fullLen;

    } else if (len < 0) {
        len += fullLen;
        if (len < 0) return 0;

    } else if (len > fullLen) {
        return 1;
    }

    var t, d;
    var t0 = 0;
    var t1 = 1;
    var torelance = 0.001;

    for (var h = 1; h < 30; h++) {
        t = t0 + (t1 - t0) / 2;
        d = len - getLength(k, t);

        if (Math.abs(d) < torelance) break;
        else if (d < 0) t1 = t;
        else t0 = t;
    }

    return t;
}

// ------------------------------------------------
// return the length of bezier curve segment
// in range of parameter from 0 to "t"
// "m" and "n" are coefficients.
function getLength(k, t) {
    var h = t / 128;
    var hh = h * 2;

    var fc = function (t, k) {
        return Math.sqrt(t * (t * (t * (t * k[0] + k[1]) + k[2]) + k[3]) + k[4]) || 0
    };

    var total = (fc(0, k) - fc(t, k)) / 2;

    for (var i = h; i < t; i += hh) {
        total += 2 * fc(i, k) + fc(i + h, k);
    }

    return total * hh;
}

// ------------------------------------------------
// extract PathItems from the selection which length of PathPoints
// is greater than "n"
function getPathItemsInSelection(n, paths) {
    if (documents.length < 1) return;

    var s = activeDocument.selection;

    if (!(s instanceof Array) || s.length < 1) return;

    extractPaths(s, n, paths);
}

// --------------------------------------
// extract PathItems from "s" (Array of PageItems -- ex. selection),
// and put them into an Array "paths".  If "pp_length_limit" is specified,
// this function extracts PathItems which PathPoints length is greater
// than this number.
function extractPaths(s, pp_length_limit, paths) {
    for (var i = 0; i < s.length; i++) {
        if (s[i].typename == "PathItem") {
            if (pp_length_limit
               && s[i].pathPoints.length <= pp_length_limit) {
                continue;
            }
            paths.push(s[i]);

        } else if (s[i].typename == "GroupItem") {
            // search for PathItems in GroupItem, recursively
            extractPaths(s[i].pageItems, pp_length_limit, paths);

        } else if (s[i].typename == "CompoundPathItem") {
            // searches for pathitems in CompoundPathItem, recursively
            // ( ### Grouped PathItems in CompoundPathItem are ignored ### )
            extractPaths(s[i].pathItems, pp_length_limit, paths);
        }
    }
}

// ----------------------------------------------
// return pathpoint's index. when the argument is out of bounds,
// fixes it if the path is closed (ex. next of last index is 0),
// or return -1 if the path is not closed.
function parseIdx(p, n) { // PathPoints, number for index
    var len = p.length;
    if (p.parent.closed) {
        return n >= 0 ? n % len : len - Math.abs(n % len);
    } else {
        return (n < 0 || n > len - 1) ? -1 : n;
    }
}
