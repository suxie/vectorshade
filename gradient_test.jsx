if (app.activeDocument.selection.length < 1) {
    var color = createGradientColor(3, 1, 100, 100, 30);
    linepoints = [[0, 100], [100, 100], [100, 0], [0, 0]];
    newRect(linepoints, color);
} 

else {
    alert(app.activeDocument.selection[0].fillColor.origin);
    app.activeDocument.selection[0].fillColor.origin = [0, 0];
    alert(app.activeDocument.selection[0].fillColor.length);
    alert(app.activeDocument.selection[0].fillColor.angle);
    app.activeDocument.selection[0].fillColor.angle = 25;
}


function createGradientColor(step, mode, r, g, b) {
    var startColor = new RGBColor();
    startColor.red = r / (step + 1);
    startColor.green = g;
    startColor.blue = b;

    var endColor = new RGBColor();
    endColor.red = 255;
    endColor.green = 255;
    endColor.blue = 255;

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
    var group = app.activeDocument.groupItems.add();
    var myLine = myDoc.pathItems.add();
    myLine.stroked = false;
    myLine.filled = false;
    myLine.fillColor = color;
    myLine.moveToBeginning(group);
    
    var clippingMask = myDoc.pathItems.add();
    clippingMask.filled = true;
    clippingMask.stroked = false;
    
    var num = linepoints.length;
    for (var i = 0; i < num; i++) {
        var newPoint = myLine.pathPoints.add();
        newPoint.anchor = linepoints[i];
        var newClipping = clippingMask.pathPoints.add();
        newClipping.anchor = linepoints[i];
        if (i == 0) {
            newPoint.leftDirection = newPoint.anchor;
            newPoint.rightDirection = linepoints[i + 1];
            newClipping.leftDirection = newPoint.anchor;
            newClipping.rightDirection = linepoints[i + 1];
        } else if (i == num - 1) {
            newPoint.leftDirection = linepoints[i - 1];
            newPoint.rightDirection = newPoint.anchor;
            newClipping.leftDirection = linepoints[i - 1];
            newClipping.rightDirection = newPoint.anchor;
        } else {
            newPoint.leftDirection = linepoints[i - 1];
            newPoint.rightDirection = linepoints[i + 1];
            newClipping.leftDirection = linepoints[i - 1];
            newClipping.rightDirection = linepoints[i + 1];
        }
        newPoint.pointType = PointType.CORNER;
        newClipping.pointType = PointType.CORNER;
    }

    var moveMatrix = app.getTranslationMatrix(20, 20);
    var scale_moveMatrix = app.concatenateScaleMatrix (moveMatrix, 120, 120);
    var move_scale_rotateMatrix = app.concatenateRotationMatrix (scale_moveMatrix, 0);
    alert(move_scale_rotateMatrix.mValueTX);
    alert(move_scale_rotateMatrix.mValueTY);
    myLine.transform(move_scale_rotateMatrix,true,false,true,false,0, Transformation.CENTER);
    clippingMask.clipping = true;
    clippingMask.moveToBeginning(group);
    group.clipped = true;
}


// function LoadBasicExternalObject() 
// {
	/**
	 The context in which this snippet can run.
	*/ 
	// this.requiredContext = "\tNeed to be running in context of Bridge and the external library needs to be available\n";	
// }

/*
LoadBasicExternalObject.prototype.getLibPath = function()
{

	var isWin = (File.fs == "Windows");
	var libFilename = (isWin) ? "ShadeTree.dll" : "ShadeTree.framework";
	Folder.current = File ($.fileName).parent.parent;
	
	var libPath;

	if(isWin)
	{
		// release
		libPath = Folder.current.fsName + "\\vectorshade\\cpp\\build\\x64\\Release\\" + libFilename;
		// Debug
		//libPath = Folder.current.fsName + "\\build\\basicexternalobject\\win\x64\\Debug\\" + libFilename;
	}
	else //  running on mac
	{
		// release
	    libPath = Folder.current.fsName + "/build/basicexternalobject/mac/Release/" + libFilename;
		// Debug
		//libPath = Folder.current.fsName + "/build/basicexternalobject/mac/Debug/" + libFilename;
	}

	return libPath;
}

LoadBasicExternalObject.prototype.run = function()
{
	
	var libPath = this.getLibPath();
    alert(libPath);
	var shadeTree = new ExternalObject("lib:" + libPath);
    
    alert(shadeTree.getAverage(10, 20, 55));

	// Create the menu element
	// var newMenu = MenuElement.create( "menu", "SDK External Object", "after Help", "myBEOMenu" );

	// Create the menu item
	// var eoCommand = MenuElement.create( "command", "Exercise Basic External Object", "at the end of myBEOMenu");

	// handler for menu item - Run External Object
	// eoCommand.onSelect = function () 
	// { 
		// The compute an average
		// $.writeln("LoadBasicExternalObject: Average: " + basiceo.getAverage(10, 20, 55)); // must pass in numbers
		
		// Append something onto our string
		// $.writeln("LoadBasicExternalObject: " + basiceo.appendString("My String"));

		// Get a script from the external object.  This will create a menu element.
		// basiceo.myScript();

		// Get an array
		// var arr = basiceo.makeArray(); 
		// for(i=0; i < arr.length; i++) 
		// {
			// $.writeln("LoadBasicExternalObject: arr[" + i + "] = " + arr[i]);
		// }

		// $.writeln("LoadBasicExternalObject: " + basiceo.acceptBoolean(true));

	// }
	
	// Handler to unload the the external object when Bridge closes down
	// onExitEvent = function(event)
	// {
	//	if(event.object instanceof App)
	//	{
	//		if(event.type == "close")
	//		{
	//			$.writeln("LoadBasicExternalObject: closing and unloading ExternalObject");
	//			basiceo.unload();
	//		}
	//	}
	//	return {handled: false};
	//}

	// register the handler
	app.eventHandlers.push({handler: onExitEvent});

	return true;
}
*/
// new LoadBasicExternalObject().run();