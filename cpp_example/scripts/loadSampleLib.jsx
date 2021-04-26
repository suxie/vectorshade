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
  @fileoverview Loads and executes an external object, showing how to use the "indirect" (object-oriented)
    and "direct" interfaces to an
    ExternalObject, calling out to code in a shared library written in C/C++
  
  @class Loads and executes an external object, showing how to use the "indirect" (object-oriented)
    and "direct" interfaces to an
    ExternalObject, calling out to code in a shared library written in C/C++
  
  Usage:
	Load the JavaScript code in this file in the ExtendScript Toolkit and select Bridge CC 2018 as the target (see Readme.txt).
     <li> From ExtendScript Toolkit, run the sample.
	<li> In Bridge, select the menu item SDK Sample Lib > Exercise Sample Lib (Object Calls)
	<li> Inspect the JavaScript console in the ESTK
 	<li> In Bridge,  select the menu item Sample Lib > Exercise Sample Lib (Direct Calls)
	<li> Inspect the JavaScript console in the ESTK
  Description:
<p>The script loads an external library by using the ExternalObject constructor.  Once the library is loaded
   a new menu item named 'SDK SampleLib' with two sub menu items is added to Bridge.  There are menu
   items to exercise both the direct and indirect (object-oriented) interfaces to the external object. Once a
   menu item is invoked, the results are displayed in the JavaScript Console of the ESTK.
   
<p>When the menu item relating to the object-oriented interface is invoked, several instances
   of the class named SampleLibObject are created. Each instance
   has methods which can be called and properties which can be updated.  Each instance has a unique
   identifier which demonstrates each separate instance of the class SampleLibObject.  With the indirect 
   interface any number of classes can be created and each class can have any number of methods and
   properties.
   
<p>An event handler is also created to unload the External Object when Bridge is exiting.
 
 */
function LoadSampleLib() 
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
LoadSampleLib.prototype.run = function()
{
	
	if(!this.canRun()) 
	{
		return false;
	}
	
	var libPath = this.getLibPath();
	var sampleLib = new ExternalObject("lib:" + libPath);

	// Create the menu element
	var newMenu = MenuElement.create( "menu", "SDK SampleLib", "after Help", "SampleLibMenu" );

	// Create the menu item
	var slObjectMenu = MenuElement.create( "command", "Exercise SampleLib (Object calls)", "at the end of SampleLibMenu", "SampleLibObjectMenu");
	var slDirectMenu = MenuElement.create( "command", "Exercise SampleLib (Direct calls)", "at the end of SampleLibMenu", "SampleLibDirectMenu");

	// Menu handler for the direct interface of the ExternalObject
	// This will exercise the direct interfaces
	slDirectMenu.onSelect = function()
	{
		$.writeln("Created array: " + sampleLib.createArray("As", "many", "args", "as", "we", "want", "!"));
		$.writeln("Any param: " + sampleLib.paramAny("Anything"));
		$.writeln("Any param: " + sampleLib.paramAny(100));
		$.writeln("Any param: " + sampleLib.paramAny(0.98765));
		$.writeln("A boolean: " + sampleLib.paramBool(true));
		$.writeln("Unsigned Int: " + sampleLib.paramUInt32(99));
		$.writeln("Signed Int: " + sampleLib.paramInt32(-99));
		$.writeln("64 bit float: " + sampleLib.paramFloat64(0.987654321));
		$.writeln("A String: " + sampleLib.paramString("This is a string!!"));
		$.writeln("Built on: " + sampleLib.built() );
		
	}

	// Menu handler for the object interface of the ExternalObject
	// This create several objects and exercise their functions
	slObjectMenu.onSelect = function () 
	{ 

		// We can create as many instances of the class as we like
		// For each instance only properties a and b are writeable
		
		var sampObj1 = new SampleLibObject();
		sampObj1.a = "A value for a";
		$.writeln("sampObj1.a = " + sampObj1.a);
	
		sampObj1.b = "A value for b";
		$.writeln("sampObj1.b = " + sampObj1.b);
		$.writeln("sampObj1.pi = " + sampObj1.pi);
		$.writeln("sampObj1.sine(45) = " + sampObj1.sine(45));
		$.writeln("sampObj1.built = " + sampObj1.built);
		$.writeln("sampObj1.reverse('I love scripting') = " + sampObj1.reverse('I love scripting'));
		
		var sampObj2 = new SampleLibObject();
		sampObj2.a = "A different value";
		$.writeln("sampObj2.a = " + sampObj2.a);
		
		$.writeln("sampObj1.me = " + sampObj1.me);
		$.writeln("sampObj2.me = " + sampObj2.me);
		
		$.writeln("sampObj1.toString() = " + sampObj1.toString());
		$.writeln("sampObj2.toString() = " + sampObj2.toString());

	}
	
	// Handler to unload the the external object when Bridge closes down
	onExitEvent = function(event)
	{
		if(event.object instanceof App)
		{
			if(event.type == "close")
			{
				$.writeln("LoadSampleLib: closing and unloading ExternalObject");
				sampleLib.unload();
			}
		}
		return {handled: false};
	}

	// register the handler
	app.eventHandlers.push({handler: onExitEvent});
    $.writeln("LoadSampleLib:: to exercise the sample, see menu items created under SDK Sample Lib. Look for output in ESTK JavaScript Console");
	return true;
}

/**
 Returns the expected path to the library for this sample
 @return  Returns the path to the library file
 @type String
*/
LoadSampleLib.prototype.getLibPath = function()
{

	var isWin = (File.fs == "Windows");
	var libFilename = (isWin) ? "SampleLib.dll" : "SampleLib.framework";
	Folder.current = File ($.fileName).parent.parent;
	
	var libPath;

	if(isWin)
	{
		// release
		libPath = Folder.current.fsName + "\\build\\samplelib\\win\\x64\\Release\\" + libFilename;
		// Debug
		//libPath = Folder.current.fsName + "\\build\\samplelib\\win\\x64\\Debug\\" + libFilename;
	}
	else //  running on mac
	{
		// release
	    libPath = Folder.current.fsName + "/build/samplelib/mac/Release/" + libFilename;
		// Debug
		//libPath = Folder.current.fsName + "/build/samplelib/mac/Debug/" + libFilename;
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
LoadSampleLib.prototype.canRun = function()
{
	var libFile = new File(this.getLibPath());

	if(BridgeTalk.appName == "bridge" && libFile.exists) 
	{ 
		return true;
	}
	$.writeln("LoadSampleLib:: ERROR loading SampleLib shared library");
	$.writeln(this.requiredContext);
	return false;
}

/**
 "main program": construct an anonymous instance and run it
*/
new LoadSampleLib().run();
