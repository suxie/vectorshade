if (app.activeDocument.selection.length < 1) {
    var color = createGradientColor(3, 1, 100, 100, 30);
    linepoints = [[0, 100], [100, 100], [100, 0], [0, 0]];
    newRect(linepoints, color);
} else {
    alert(app.activeDocument.selection[0].typename);
}

function createGradientColor(step, mode, r, g, b) {
    var startColor = new RGBColor();
    startColor.red = r / (step + 1);
    startColor.green = g;
    startColor.blue = b;

    var endColor = new RGBColor();
    endColor.red = 0;
    endColor.green = 0;
    endColor.blue = 0;

    var newGradient = app.activeDocument.gradients.add();
    newGradient.name = "newgradient" + (app.activeDocument.gradients.length + 1);
    newGradient.type = GradientType.RADIAL;
    // Modify the first gradient stop
    newGradient.gradientStops[0].rampPoint = 0;
    newGradient.gradientStops[0].midPoint = 30;
    newGradient.gradientStops[0].color = startColor;
    if (mode != 0) {
        newGradient.gradientStops[0].color = endColor;
    }

    // Modify the last gradient stop
    newGradient.gradientStops[1].rampPoint = 80;
    newGradient.gradientStops[1].color = endColor;
    if (mode != 0) {
        newGradient.gradientStops[1].color = startColor;
    }

    var color = new GradientColor();
    color.gradient = newGradient;
    
    return color;
}

function newRect(linepoints, color) {
    var myDoc = app.activeDocument;
    var myLine = myDoc.pathItems.add();
    myLine.stroked = false;
    myLine.filled = true;
    myLine.fillColor = color;
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