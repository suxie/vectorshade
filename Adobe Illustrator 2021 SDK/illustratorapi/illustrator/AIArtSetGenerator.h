/*************************************************************************
*
* ADOBE CONFIDENTIAL
* 
* Copyright 2017 Adobe
* 
* All Rights Reserved.
*
* NOTICE: Adobe permits you to use, modify, and distribute this file in
* accordance with the terms of the Adobe license agreement accompanying
* it. If you have received this file from a source other than Adobe,
* then your use, modification, or distribution of it requires the prior
* written permission of Adobe.
*
**************************************************************************/

#pragma once

#include "AIArtSet.h"
#include "AIArtboard.h"
#include "AIHeaderBegin.h"

/** @file AIArtSetGenerator.h */

/*******************************************************************************
 **
 **	Constants
 **
 **/

#define kAIArtSetGeneratorSuite				"AI Art Set Generator Suite"
#define kAIArtSetGeneratorSuiteVersion3		AIAPI_VERSION(3)
#define kAIArtSetGeneratorSuiteVersion		kAIArtSetGeneratorSuiteVersion3
#define kAIArtSetGeneratorVersion			kAIArtSetGeneratorSuiteVersion

/*******************************************************************************
 **
 **	Suite
 **
 **/


struct AIArtSetGeneratorSuite
{
	/** Each art in the output is a direct child of the layer group.
	*/
	AIAPI AIErr (*GenerateForAllLayers) ( AIArtSet outArtSet );

	/** Each art in the output is a direct child of the layer group of the
		specified layer.
	*/
	AIAPI AIErr (*GenerateForNthLayer) ( ai::int32 inLayerIndex,
											AIArtSet outArtSet );

	/** Each art in the output would is a direct child of the layer group of the
		specified layer.
	*/
	AIAPI AIErr (*GenerateForNamedLayer) ( const ai::UnicodeString& inLayerName,
											AIArtSet outArtSet );

	/** Each art in the output is a direct child of a layer group such that the
		art intersects with the artboard at the given index.
	*/
	AIAPI AIErr (*GenerateForNthArtboard) ( ai::ArtboardID inArtboardIndex,
											AIArtSet outArtSet, AIBoolean skipHiddenArts );

	/** Each art in the output is a direct child of a layer group such that the
		art intersects with the artboard of the given name.
	*/
	AIAPI AIErr (*GenerateForNamedArtboard) ( const ai::UnicodeString& inArtboardName,
												AIArtSet outArtSet, AIBoolean skipHiddenArts );

	/** Each art in the output is a top level layer in the current document.
		@param skipHiddenLayers [in] skip hidden layers
	*/
	AIAPI AIErr (*GenerateForTopLevelLayers) ( AIArtSet outArtSet, AIBoolean skipHiddenLayers );

	/** Each selected art in output would be a direct child of layer group.
	 	@param outArtSet [out] Art set to return selected top level objects in.
	 	@see \c #GenerateNSelectedAtTopLevel().
	*/
	AIAPI AIErr (*GenerateSelectedAtTopLevel) ( AIArtSet outArtSet );

	/** Each selected art in output would be a direct child of layer group.
		@param inMaxSelectedArtsToReturn [in] Maximum number of objects that should be returned.
		@param outArtSet [out] Art set to return selected top level objects in.
	 		The returned art set may have fewer objects than \c #inMaxSelectedArtsToReturn.
	 	@param outHasMoreSelectedArts [out] Boolean value indicating if more arts were available
	 		but not returned due to limit specified by \c #inMaxSelectedArtsToReturn.
			Can be \c NULL.
	*/
	AIAPI AIErr (*GenerateNSelectedAtTopLevel) ( size_t inMaxSelectedArtsToReturn,
													AIArtSet outArtSet,
													AIBoolean *outHasMoreSelectedArts );

    /** Each art in output would be a direct or a nested child of the art.
     */
    AIAPI AIErr (*GenerateForArt) (AIArtHandle inArt, AIArtSet outArtSet);

};

#include "AIHeaderEnd.h"
