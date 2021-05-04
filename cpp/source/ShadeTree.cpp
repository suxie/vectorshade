/**************************************************************************
* ADOBE SYSTEMS INCORPORATED
* Copyright 2007-2017 Adobe Systems Incorporated
* All Rights Reserved
*
* NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
* terms of the Adobe license agreement accompanying it.  If you have received this file from a
* source other than Adobe, then your use, modification, or distribution of it requires the prior
* written permission of Adobe.
**************************************************************************/

/**
 * \file ShadeTree.cpp
 * \brief The sample shows how to implement a basic external object and to extend the JavaScript DOM.
 *
 * The sample demonstrates how to pass simple data types back to JavaScript from the External Object
 * such as Strings, booleans, integers and scripts.
 * 
 * All of the exported functions that are available to JavaScript take 3 arguments:
 *
 * \li An array of variant data.
 * \li An argument count.
 * \li A variant data structure that takes the return value.
 * 
 * The variant data is of type TaggedData, which represents a JavaScript argument.  The
 * supported data types for TaggedData are:
 *
 * \li Undefinied
 * \li Boolean
 * \li Double
 * \li String
 * \li Script
 *
 * For information on how to call the individual methods then see the comments for each methods or
 * see the loadExternalObject.jsx script file that accompanies this sample.
 *
 * See SoSharedLibDefs.h for error codes and return types
 *
 * See \ref sampleprojects for information on how to build the library
 *
 * See \ref installing for information on how to install and use the library
 *
 */

#include "ShadeTree.h"
#include "SoSharedLibDefs.h"
#include <string>
#include "illustrator/AIGradient.h"
#include "ShadeNode.h"
#include <memory>

#if defined (_WINDOWS)
	#pragma warning(disable : 4996) // Turn off warning about deprecated strcpy on Win
#endif

/**
* \brief To allow string manipulation
*/
using namespace std;

std::unique_ptr<ShadeNode> root;


/**
* \brief Utility function to handle strings and memory clean up
*
* \param s - The referenced string
*/
static char* getNewBuffer(string& s)
{
	// Dynamically allocate memory buffer to hold the string 
	// to pass back to JavaScript
	char* buff = new char[1+s.length()];
	
	memset(buff, 0, s.length()+1);
	strncpy(buff, s.c_str(), 1+s.length());

	return buff;
}

/*
string printTree(ShadeNode* node, string s) {
  if (strlen(s.c_str()) > 1) {
    s.append(", ");
  }
  s.append(std::to_string(node->type));
  s.append("[2]");

  if (node->left != nullptr) {
    s.append(", ");
    s.append(printTree(node->left, s));
  }
  if (node->right != nullptr) {
    s.append(", ");
    s.append(printTree(node->right, s));
  }

  s.append("]");
  return s;
}
*/

string printTree(ShadeNode* node, string s) {
  s.append(std::to_string(node->type));
  s.append(", ");
  if (node->left != nullptr) {
    s.append(std::to_string(node->left->type));
  }
  else {
    s.append("0");
  }
  s.append(", ");
  if (node->right != nullptr) {
    s.append(std::to_string(node->right->type));
  }
  else {
    s.append("0");
  }
  if ((node->left != nullptr && node->left->hasChildren()) || 
      (node->right != nullptr && node->right->hasChildren())) {
    s.append(", ");
    s.append(printTree(node->left, s));
    s.append(", ");
    s.append(printTree(node->right, s));
  }
 
  return s;
}

extern "C" SHADETREE_API long buildTree(TaggedData* argv, long argc, TaggedData * retval) {

  // require at least 3 arguments
  if (argc <= 3)
  {
    return kESErrBadArgumentList;
  }
  
  if (argv[0].type != kTypeDouble || 
      argv[1].type != kTypeDouble ||
      argv[2].type != kTypeDouble)
  {
    return kESErrBadArgumentList;
  }

  root = std::make_unique<ShadeNode>((int)argv[0].data.fltval, nullptr, nullptr);
  
  std::unique_ptr<ShadeNode> left = std::make_unique<ShadeNode>((int) argv[1].data.fltval, nullptr, nullptr);
  std::unique_ptr<ShadeNode> right = std::make_unique<ShadeNode>((int) argv[2].data.fltval, nullptr, nullptr);
  left->parent = root.get();
  right->parent = root.get();

  root->left = left.get();
  root->right = right.get();

  // layer 2 
  if (argc > 3) {
    for (int i = 3; i < 7; i++) {

    }
  }
  
  // layer 3 
  if (argc > 7) {
    for (int i = 7; i < 14; i++) {

    }
  }
  

  // The returned value type
  retval->type = kTypeScript;

  string s("["); 
  s = printTree(root.get(), s);
  s.append("]");
  
  retval->data.string = getNewBuffer(s);

  return kESErrOK;
}

extern "C" SHADETREE_API long addChild(TaggedData* argv, long argc, TaggedData * retval) {

  // at least 1 argument
  if (argc < 1)
  {
    return kESErrBadArgumentList;
  }

  if (argv[0].type != kTypeDouble) {
    return kESErrBadArgumentList;
  }

  int type = (int) argv[0].data.fltval;

  ShadeNode* curr = root.get();

  for (int i = 1; i < argc - 1; i++) {
    if (argv[i].type != kTypeDouble) {
      return kESErrBadArgumentList;
    }
    if (argv[i].data.fltval == 0) {
      curr = curr->left;
    }
    else {
      curr = curr->right;
    }
  }

  std::unique_ptr<ShadeNode> node = std::make_unique<ShadeNode>(type, nullptr, nullptr);
  if (argv[argc - 1].data.fltval == 0) {
    curr->left = node.get();
  }
  else {
    curr->right = node.get();
  }

  // The returned value type
  retval->type = kTypeScript;

  string s("[");
  s = printTree(root.get(), s);
  s.append("]");

  retval->data.string = getNewBuffer(s);

  return kESErrOK;
}