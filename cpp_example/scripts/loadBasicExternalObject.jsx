////////////////////////////////////////////////////////////////////////////
// ADOBE SYSTEMS INCORPORATED
// Copyright 2008-2017 Adobe Systems Incorporated
// All Rights Reserved
//
// NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
// terms of the Adobe license agreement accompanying it.  If you have received this file from a
// source other than Adobe, then your use, modification, or distribution of it requires the prior
// written permission of Adobe.
/////////////////////////////////////////////////////////////////////////////

/** 
  @fileoverview Loads and executes a basic  external object, showing how to use the "direct" interface to an
  ExternalObject in a shared library written in C/C++
  
  @class Loads and executes a basic external object, showing how to use the "direct" interface to an
  ExternalObject in a shared library written in C/C++
  
  Usage:
	Display the sample in the ExtendScript Toolkit and select Bridge as the target (see readme.txt)
     <li> In the ExtendScript Toolkit run the sample.
	<li> In Bridge, select the menu item SDK External Object > Exercise Basic External Object. 
	<li> Inspect the JavaScript console in the ESTK, where the output from the above step should appear.
	<li> In Bridge, select the menu item Tools > Beo Menu > Beo Menu Item. You should see an alert.
 
  Description:
  The script loads an external library by using the ExternalObject constructor.  Once the library is loaded,
   some menu items are added to Bridge.  When one of the menu items is selected, functions in the library
   are called and the results are displayed in the JavaScript Console.
 
 */
function LoadBasicExternalObject() 
{
	/**
	 The context in which this snippet can run.
	*/
	this.requiredContext = "\tNeed to be running in context of Bridge and the external library needs to be available\n";	
}

/**
 Functional part of this snippet.
 @return True if the sample ran as expected, false if otherwise
 @type boolean
*/
LoadBasicExternalObject.prototype.run = function()
{
	
	if(!this.canRun()) 
	{
		return false;
	}
	
	var libPath = this.getLibPath();
	var basiceo = new ExternalObject("lib:" + libPath);

	// Create the menu element
	var newMenu = MenuElement.create( "menu", "SDK External Object", "after Help", "myBEOMenu" );

	// Create the menu item
	var eoCommand = MenuElement.create( "command", "Exercise Basic External Object", "at the end of myBEOMenu");

	// handler for menu item - Run External Object
	eoCommand.onSelect = function () 
	{ 
		// The compute an average
		$.writeln("LoadBasicExternalObject: Average: " + basiceo.getAverage(10, 20, 55)); // must pass in numbers
		
		// Append something onto our string
		$.writeln("LoadBasicExternalObject: " + basiceo.appendString("My String"));

		// Get a script from the external object.  This will create a menu element.
		basiceo.myScript();

		// Get an array
		var arr = basiceo.makeArray(); 
		for(i=0; i < arr.length; i++) 
		{
			$.writeln("LoadBasicExternalObject: arr[" + i + "] = " + arr[i]);
		}

		$.writeln("LoadBasicExternalObject: " + basiceo.acceptBoolean(true));

	}
	
	// Handler to unload the the external object when Bridge closes down
	onExitEvent = function(event)
	{
		if(event.object instanceof App)
		{
			if(event.type == "close")
			{
				$.writeln("LoadBasicExternalObject: closing and unloading ExternalObject");
				basiceo.unload();
			}
		}
		return {handled: false};
	}

	// register the handler
	app.eventHandlers.push({handler: onExitEvent});

	return true;
}

/**
 Returns the expected path to the library for this sample
 @return  Returns the path to the library file
 @type String
*/
LoadBasicExternalObject.prototype.getLibPath = function()
{

	var isWin = (File.fs == "Windows");
	var libFilename = (isWin) ? "BasicExternalObject.dll" : "BasicExternalObject.framework";
	Folder.current = File ($.fileName).parent.parent;
	
	var libPath;

	if(isWin)
	{
		// release
		libPath = Folder.current.fsName + "\\build\\basicexternalobject\\win\\x64\\Release\\" + libFilename;
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


/**
 Determines whether snippet can be run given current context.  The snippet will
 fail if these preconditions are not met: 
 <li> Bridge must be running
 <li> The library file must be available
 @return True is this snippet can run, false if otherwise
 @type boolean
*/
LoadBasicExternalObject.prototype.canRun = function()
{
	var libFile = new File(this.getLibPath());

	if(BridgeTalk.appName == "bridge" && libFile.exists) 
	{ 
		return true;
	}
	$.writeln("LoadBasicExternalObject: ERROR - loading library");
	$.writeln(this.requiredContext);
	return false;
}

/**
 "main program": construct an anonymous instance and run it
*/
new LoadBasicExternalObject().run();
