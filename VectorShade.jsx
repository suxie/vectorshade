﻿

var ver10 = (version.indexOf('10') == 0);
var seg = 15;
var n = 2;
var paths = [];
getPathItemsInSelection(n, paths);

var window = createWindow();

window.show();
// div(); //first, divide the path into even segments
// interpolate(); //second, interpolate


// OUR FUNCTIONS: ====================================================
function createWindow() {
    var myWindow = new Window ("dialog", "Form");
    // subdiv slider
    var subdivGroup = myWindow.add ("group");
    subdivGroup.add ("statictext", undefined, "Subdivisions:");
    var subdivText = subdivGroup.add ("edittext", undefined, 3);
    subdivText.characters = 2;
    var subdivSlider = subdivGroup.add ("slider", undefined, 3, 0, 10);
    subdivSlider.onChanging = function () {
        subdivText.text = Math.floor(subdivSlider.value);
    }

    myWindow.add("statictext", undefined, "Color (RGB):");
    
    // rgb
    var redGroup = myWindow.add("group");
    redGroup.add ("statictext", undefined, "R:");
    var redGroupText = redGroup.add ("edittext", undefined, 50);
    redGroupText.characters = 3;
    var redGroupSlider = redGroup.add ("slider", undefined, 50, 0, 255);
    redGroupSlider.onChanging = function () {
        redGroupText.text = Math.floor(redGroupSlider.value);
    }
    var greenGroup = myWindow.add("group");
    greenGroup.add ("statictext", undefined, "G:");
    var greenGroupText = greenGroup.add ("edittext", undefined, 50);
    greenGroupText.characters = 3;
    var greenGroupSlider = greenGroup.add ("slider", undefined, 50, 0, 255);
    greenGroupSlider.onChanging = function () {
        greenGroupText.text = Math.floor(greenGroupSlider.value);
    }
    var blueGroup = myWindow.add("group");
    blueGroup.add ("statictext", undefined, "B:");
    var blueGroupText = blueGroup.add ("edittext", undefined, 50);
    blueGroupText.characters = 3;
    var blueGroupSlider = blueGroup.add ("slider", undefined, 50, 0, 255);
    blueGroupSlider.onChanging = function () {
        blueGroupText.text = Math.floor(blueGroupSlider.value);
    }

    // light direction 
    var lightGroup = myWindow.add("group");
    lightGroup.add("statictext", undefined, "Light Direction:");
    
    var lightGroupInputs = lightGroup.add("group");
    lightGroupInputs.orientation = "column";
    var lightGroupX = lightGroupInputs.add("group");
    var lightGroupXText = lightGroupX.add("edittext", undefined, 0.5);
    lightGroupXText.characters = 5;
    var lightGroupXSlider = lightGroupX.add("slider", undefined, 0.5, 0, 1);
    lightGroupXSlider.onChanging = function() {
        lightGroupXText.text = lightGroupXSlider.value.toFixed(3);
    }
    var lightGroupY = lightGroupInputs.add("group");
    var lightGroupYText = lightGroupY.add("edittext", undefined, 0.5);
    lightGroupYText.characters = 5;
    var lightGroupYSlider = lightGroupY.add("slider", undefined, 0.5, 0, 1);
    lightGroupYSlider.onChanging = function() {
        lightGroupYText.text = lightGroupYSlider.value.toFixed(3);
    }
    var lightGroupZ = lightGroupInputs.add("group");
    var lightGroupZText = lightGroupZ.add("edittext", undefined, 0.5);
    lightGroupZText.characters = 5;
    var lightGroupZSlider = lightGroupZ.add("slider", undefined, 0.5, 0, 1);
    lightGroupZSlider.onChanging = function() {
        lightGroupZText.text = lightGroupZSlider.value.toFixed(3);
    }

    // normal direction 
    var normalGroup = myWindow.add("group");
    normalGroup.add("statictext", undefined, "Normal Direction:");
    
    var normalGroupInputs = normalGroup.add("group");
    normalGroupInputs.orientation = "column";
    var normalGroupX = normalGroupInputs.add("group");
    var normalGroupXText = normalGroupX.add("edittext", undefined, 0);
    normalGroupXText.characters = 5;
    var normalGroupXSlider = normalGroupX.add("slider", undefined, 0, 0, 1);
    normalGroupXSlider.onChanging = function() {
        normalGroupXText.text = normalGroupXSlider.value.toFixed(3);
    }
    var normalGroupY = normalGroupInputs.add("group");
    var normalGroupYText = normalGroupY.add("edittext", undefined, 0);
    normalGroupYText.characters = 5;
    var normalGroupYSlider = normalGroupY.add("slider", undefined, 0, 0, 1);
    normalGroupYSlider.onChanging = function() {
        normalGroupYText.text = normalGroupYSlider.value.toFixed(3);
    }
    var normalGroupZ = normalGroupInputs.add("group");
    var normalGroupZText = normalGroupZ.add("edittext", undefined, 1);
    normalGroupZText.characters = 5;
    var normalGroupZSlider = normalGroupZ.add("slider", undefined, 1, 0, 1);
    normalGroupZSlider.onChanging = function() {
        normalGroupZText.text = normalGroupZSlider.value.toFixed(3);
    }

    // buttons 
    var myButtonGroup = myWindow.add ("group");
    myButtonGroup.alignment = "right";
    var okay = myButtonGroup.add ("button", undefined, "OK");
    okay.onClick = function() {
        n = parseInt(subdivText.text);
        r = parseInt(redGroupText.text);
        g = parseInt(greenGroupText.text);
        b = parseInt(blueGroupText.text);
        lightX = parseFloat(lightGroupXText.text);
        lightY = parseFloat(lightGroupYText.text);
        lightZ = parseFloat(lightGroupZText.text);
        div();
        interpolate(n, r, g, b, lightX, lightY, lightZ); // pass in arguments to interpolate
        myWindow.hide();
    }
    myButtonGroup.add ("button", undefined, "Cancel");
    return myWindow;
}

// The bulk of the script is performed here. This function subdivides a shape and calls
// the other functions which implement the shade tree. 
// INPUTS: n = number of subdivisions
//                  r, g, b = RGB color values
//                  lightX, lightY, lightZ = vector indicating light direction
function interpolate(n, r, g, b, lightX, lightY, lightZ) {
    for (var h = 0; h < paths.length; h++) {
        //first, find bounding box vertices
        var minX, minY, maxX, maxY;
        pnts = [];
        p = paths[h].pathPoints;
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
                var d = Math.sqrt(((point[0] - minX) * (point[0] - minX)) + ((point[1] - minY) * (point[1] - minY)));
                if (d < d1) {
                    index1 = i;
                    d1 = d;
                }
            } else if (point[0] >= centerX && point[1] <= centerY) { // bottom right quad: 2
                var d = Math.sqrt(((point[0] - maxX) * (point[0] - maxX)) + ((point[1] - minY) * (point[1] - minY)));
                if (d < d2) {
                    index2 = i;
                    d2 = d;
                }
            } else if (point[0] >= centerX && point[1] >= centerY) { // top right quad: 3
                var d = Math.sqrt(((point[0] - maxX) * (point[0] - maxX)) + ((point[1] - maxY) * (point[1] - maxY)));
                if (d < d3) {
                    index3 = i;
                    d3 = d;
                }
            } else if (point[0] <= centerX && point[1] >= centerY) { // top left quad: 4
                var d = Math.sqrt(((point[0] - minX) * (point[0] - minX)) + ((point[1] - maxY) * (point[1] - maxY)));
                if (d < d4) {
                    index4 = i;
                    d4 = d;
                }
            } 
        }
        var h1, h2, v1, v2; // 4 sets of points: two horizontal edges, two vertical edges
        
        if (index1 > index2 && index1 > index3 && index1 > index4) { // index1 is largest index
            v2 = getEdgeNormal(index2, index3, p);
            h2 = getEdgeNormal(index3, index4, p);
            
            if (index4 > index2) { // final vertex is b/w 1 and 2
                v1 = getEdgeNormal(index4, index1, p);
                h1 = getEdgeSpecial(index1, index2, p);
            } else {
                h1 = getEdgeNormal(index1, index2, p);
                v1 = getEdgeSpecial(index1, index4, p);
            }
        } else if (index2 > index1 && index2 > index3 && index2 > index4) { // index2 is largest index
            h1 = getEdgeNormal(index3, index4, p);
            v1 = getEdgeNormal(index4, index1, p);
            
            if (index1 > index3) { // final vertex is b/w 2 and 3
                h2 = getEdgeNormal(index1, index2, p);
                v2 = getEdgeSpecial(index2, index3, p);
            } else {
                v2 = getEdgeNormal(index2, index3, p);
                h2 = getEdgeSpecial(index1, index2, p);
            }
        } else if (index3 > index1 && index3 > index2 && index3 > index4) { // index3 is largest index
            h1 = getEdgeNormal(index1, index2, p);
            v1 = getEdgeNormal(index4, index1, p);
            
            if (index2 > index4) { // final vertex is b/w 3 and 4
                v2 = getEdgeNormal(index2, index3, p);
                h2 = getEdgeSpecial(index4, index3, p);
            } else {
                h2 = getEdgeNormal(index3, index4, p);
                v2 = getEdgeSpecial(index3, index2, p);
            }
        } else { // index4 is largest index
            v2 = getEdgeNormal(index2, index3, p);
            h1 = getEdgeNormal(index1, index2, p);
            
            if (index3 > index1) { // final vertex is b/w 4 and 1
                h2 = getEdgeNormal(index3, index4, p);
                v1 = getEdgeSpecial(index4, index1, p);
            } else {
                v1 = getEdgeNormal(index1, index4, p);
                h2 = getEdgeSpecial(index4, index3, p);
            }
        }
    
        // CALCULATE NORMALS
        // 1. Calculate vector between the two points to the left and right of the current point
        // 2. Find perpendicular vector: for [x, y], this is [-y, x] or [y, -x]
        // 3. Make sure this vector is pointing away from shape instead of towards center -- 
        //          Test  whether [px, py] + [-y, x] or [px, py] + [y, -x] is farther from center 
        var normals = []
        normals.push([[centerX, centerY], [0, 0, 1]]);
        calculateNormals(h1, centerX, centerY, normals);
        calculateNormals(h2, centerX, centerY, normals);
        calculateNormals(v1, centerX, centerY, normals);
        calculateNormals(v2, centerX, centerY, normals);
    
        drawLine(h1, h2, 1, n);
        drawLine(h1, h2, 0, n);
        drawLine(v1, v2, 1, n);
        drawLine(v1, v2, 0, n);

        var doc = app.activeDocument;

        path = paths[h];
        
        // TODO: GRADIENT 
        
        var myColor = new RGBColor();
        myColor.red = Number(r);
        myColor.green = Number(g);
        myColor.blue = Number(b);

        doc.defaultFillColor = myColor;

        path.filled = true;
    }
}

// this is a helper function to get a list of point positions on an edge
// between two vertices for a basic case
function getEdgeNormal(v1, v2, p) {
    var side = [];
    start = Math.min(v1, v2);
    end = Math.max(v1, v2);
    for (i = start; i <= end; i++) {
        side.push(p[i].anchor);
    }
    return side;
}

// this is a helper function to get a list of point positions on an edge
// between two vertices for the special case where the edge contains 
// the last index in the array, aka you have to loop back to the beginning of
// the point array to get all the point values 
function getEdgeSpecial(v1, v2, p) {
    var side = [];
    start = Math.max(v1, v2);
    end = Math.min(v1, v2);
    for (i = start; i < p.length; i++) {
        side.push(p[i].anchor);
    }
    for (i = 0; i <= end; i++) {
        side.push(p[i].anchor);
    }
    return side;
}

// this is a helper function to calculate normals along most of the edge points and
// sets the normal of the center point to whatever the user specifies
function calculateNormals(points, centerX, centerY, normals) {
    for (i = 1; i < points.length - 1; i++) {
        var line = app.activeDocument.pathItems.add();
        line.stroked = true;
        
        var px = points[i][0];
        var py = points[i][1];
        var x = points[i + 1][0] - points[i - 1][0];
        var y = points[i + 1][1] - points[i - 1][1];
        
        x /= Math.sqrt(x * x + y * y + 1 * 1); // normalize
        y /= Math.sqrt(x * x + y * y + 1 * 1);
        var xNegDist = Math.sqrt(((px + y - centerX) * (px + y - centerX)) + 
                                              ((py - x - centerY) * (py - x - centerY)));
        var yNegDist = Math.sqrt(((px - y - centerX) * (px - y - centerX)) + 
                                               ((py + x - centerY) * (py + x - centerY)));
        if (xNegDist > yNegDist) {
            normals.push([[px, py], [y, -x, 1]]);
            // UNCOMMENT THIS TO VISUALIZE NORMALS
            line.setEntirePath([[px,py], [(px + 20 * y), (py - 20 * x)]]);  
        } else {
            normals.push([[px, py], [-y, x, 1]]);
            // UNCOMMENT THIS TO VISUALIZE NORMALS
            line.setEntirePath([[px,py], [(px - 20 * y), (py + 20 * x)]]); 
        }
    }
}


// helper function for interpolating the normal at any point on the shape, 
// given the point and the list of known normals 
function interpolateNormal(normals, point) {
    // calculate weight of each normal
    var weights = [];
    var sum = 0;
    for (var i = 0; i < normals.length; i++) {
        var weight = Math.sqrt(((point[0] - normals[i][0][0]) * (point[0] - normals[i][0][0])) +
                                      ((point[1] - normals[i][0][1]) * (point[0] - normals[i][0][1])));
        weights.push(weight);
        sum += weight;
    }
    
    // compute normal based on normalized weights
    var normal = [0, 0, 0];
    for (var i = 0; i < normals.length; i++) {
        var weight = weight[i] / sum;
        normal[0] += weight * normals[i][1][0];
        normal[1] += weight * normals[i][1][1];
        normal[2] += weight * normals[i][1][2];
    }
    // normalize
    magnitude = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2]);
    normal[0] /= magnitude;
    normal[1] /= magnitude;
    normal[2] /= magnitude;
    
    return normal;
}

function drawLine(points1, points2, left, step) {
    var doc = app.activeDocument;
    
    if (step <= 0) {
        return;
    } else {
        var newline = [];
        //var endpoints = findSubdivEndpoints(mid, split, horizontal);
        //newline.push(endpoints[0]);
        var m = points1.length;
        var n = points2.length;
        if (m > n) {
            for (i = 0; i < m; i++) {
                var point1 = points1[i];
                var i2 = n - 1 - Math.floor(i * n / m);
                var point2 = points2[i2];
                newline.push([(point1[0] + point2[0]) / 2, (point1[1] + point2[1]) / 2]);
            }
        } else {
            for (i = 0; i < n; i++) {
                var point1 = points2[i];
                var i2 = m - 1 - Math.round(i * m / n);
                var point2 = points1[i2];
                newline.push([(point1[0] + point2[0]) / 2, (point1[1] + point2[1]) / 2]);
            }
        }
    
        //newline.push(endpoints[1]);

        // COMMENT THIS OUT TO HIDE GRADIENT LINES:
        var line = doc.pathItems.add();
        line.stroked = true;
        line.setEntirePath(newline); // not smooth path

        // TRIED TO GENERATE A SMOOTH PATH HERE AND FAILED lol
        // var pathPoints = [];
        // for (i = 0; i < newline.length; i++) {
        //   var pathPoint = line.pathPoints.add();
        //   pathPoint.anchor = newline[i];
        //   pathPoints.push(pathPoint);
        // }

        // line.pathPoints = pathPoints;

        if (left) {
            drawLine(points1, newline,  left, step - 1);
        } else {
            newlineFlipped = [];
            for (i = newline.length - 1; i >= 0; i--) {
                newlineFlipped.push(newline[i]);
            }
            drawLine(newlineFlipped, points2,  left, step - 1);
        }
    }
}

// finds the endpoints for each subdivision line 
// on the original shape path
// THIS IS NO LONGER BEING USED. too many bugs and not needed
function findSubdivEndpoints(mid, split, horizontal) {
for (var h = 0; h < paths.length; h++) {
        p = paths[h].pathPoints;
        
        var d1, d2, index1, index2;
        d1 = Number.MAX_VALUE;
        d2 = Number.MAX_VALUE;

        // alert(horizontal);

        for (i = 0; i < p.length; i++) {
            if (horizontal) {
                if (p[i].anchor[0] < split) {
                    var d = Math.abs(p[i].anchor[1] - mid);
                    if (d < d2) {
                        d2 = d;
                        index2 = i;
                    }
                } else {
                    var d = Math.abs(p[i].anchor[1] - mid);
                    if (d < d1) {
                        d1 = d;
                        index1 = i;
                    }
                }
            } else {
                if (p[i].anchor[1] < split) {
                    var d = Math.abs(p[i].anchor[0] - mid);
                        if (d < d1) {
                            d1 = d;
                            index1 = i;
                        }
                } else {
                    var d = Math.abs(p[i].anchor[0] - mid);
                    if (d < d2) {
                        d2 = d;
                        index2 = i;
                    }
                }
            }
        }
        // alert(index1 + ", " + index2);
        return [p[index1].anchor, p[index2].anchor];
    }
}
// CODE THAT WE GOT FROM ONLINE ===================================

// Divide (length)
// Copyright(c) 2006-2009 SATO Hiroyuki
// http://park12.wakwak.com/~shp/lc/et/en_aics_script.html
function div() {
 
  if (paths.length < 1) return;

  // Settings ====================

  var n = 2; // default dividing number
   // =============================
  // not ver.10 : input a number with a prompt box
  
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

          for (k = 1; k < n; k++) {
              ar.push(getT4Len(q, len * k));
          }
          pnts.push(ar);
      }
      if (redrawflg) addPnts(paths[h], pnts, false);
  }
  activeDocument.selection = paths;
}

// ----------------------------------------------
// addPnts: adds anchors to pathitem "pi"
// an example of usage:
/* var pi=activeDocument.selection[0];
var pnts = [ [0,  0.3,0.8,0.5],
             [3,  0.5] ];  // [ [i, t,t,t,t...],[i, t,t..
addPnts(pi,pnts,true);
 */
function addPnts(pi, pnts, need2sort){ // target pathItem, list, need to sort the parameters
  // pnts = [ [index,  t,t,t,t...],[index,  t,t..
  // items must be ordered by index
  // an item without t ([index]) is acceptable.  an empty allay is not acceptable.
  // an index out of bounds is acceptable.  the range of t is 0 < t < 1.
  var p = pi.pathPoints;
  var pnts2 = [];
  var adjNextLDir  = 0;
  var adjFirstLDir = 0;
  var idx = (pi.closed && pnts[pnts.length-1][0] == p.length - 1) ? 0 : pnts[0][0];
  var ar = pnts.shift();
  var nidx = ar.shift();
  var j, pnt, q;
  for(var i = idx; i < p.length; i++){
    pnts2.push( getDat(p[i]) );
    if(adjNextLDir > 0){
      pnts2[pnts2.length-1][2] = adjHanP(p[i],0,1-adjNextLDir);
    }
    if(nidx == i){
      if(ar.length > 0){
        if(need2sort){
          ar.sort();
          ar = getUniq(ar);
        }
        if(i == p.length - 1 && idx == 0){
          adjFirstLDir = ar[ar.length-1];
        }
        pnts2[pnts2.length - 1][1] = adjHanP(p[i], 1, ar[0]),
        ar.unshift(0);
        ar.push(1);
        nxi = parseIdx(p,i + 1);
        if(nxi < 0) break;
        q = [p[i].anchor, p[i].rightDirection,
             p[nxi].leftDirection, p[nxi].anchor];
        if(arrEq(q[0], q[1]) && arrEq(q[2], q[3])){
          for(j = 1; j < ar.length - 1; j++){
            pnt = bezier(q, ar[j]);
            pnts2.push( [pnt, pnt, pnt, PointType.CORNER] );
          }
        } else {
          for(j = 1; j < ar.length - 1; j++){
            pnts2.push( getDivPnt(q, ar[j-1], ar[j], ar[j+1]) );
          }
        }
         adjNextLDir = ar[ar.length - 2];
      } else {
        adjNextLDir = 0;
      }
      if(pnts.length > 0){
        ar = pnts.shift();
        nidx = ar.shift();
      }
    } else {
      adjNextLDir = 0;
    }
  }
  if(adjFirstLDir > 0) pnts2[0][2] = adjHanP(p[0], 0, 1 - adjFirstLDir);
  if(pnts2.length > 0) applyData2AfterIdx(p, pnts2, idx - 1);
}
// ----------------------------------------------
function getUniq(ar){ // Array (sorted)
  if(ar.length < 2) return ar;
  var ar2 = [ ar[0] ];
  var torelance = 0.01;
  for(var i = 1; i < ar.length; i++){
    if(ar[i] - ar2[ ar2.length - 1 ] > torelance) ar2[ar2.length] = ar[i];
  }
  return ar2;
}
// ----------------------------------------------
// returns an array for properties of a pathpoint
function getDat(p){ // pathPoint
  with(p) return [anchor, rightDirection, leftDirection, pointType];
}
// ----------------------------------------------
// magnifies a handle by m
function adjHanP(p, n, m){ // p=pathpoint, n=0:leftDir, n=1:rightDir, m=magnification rate
  with(p){
    var d = (n == 1 ? rightDirection : leftDirection);
    return [anchor[0] + (d[0] - anchor[0]) * m,
            anchor[1] + (d[1] - anchor[1]) * m];
  }
}
// ----------------------------------------------
// returns an array for properties of a pathpoint
// that corresponds to the parameter "t1"
// q=4 points, t0-2=parameters, anc=coordinate of anchor
function getDivPnt(q, t0, t1, t2, anc){
  if(!anc) anc = bezier(q, t1);
  var r = defDir(q,1, t1, anc, (t2 - t1) / (1 - t1));
  var l = defDir(q,0, t1, anc, (t1 - t0) / t1);
  return [ anc, r, l, PointType.SMOOTH ];
}
// ----------------------------------------------
// returns the [x, y] coordinate of the handle of the point on the bezier curve
// that corresponds to the parameter "t"
// q=4 points, t=paramter, anc=coordinate of anchor, m=magnification ratio
function defDir(q, n, t, anc, m){ // n=0:ldir, n=1:rdir
  var dir = [ t * (t * (q[n][0] - 2 * q[n+1][0] + q[n+2][0]) + 2 * (q[n+1][0] - q[n][0])) + q[n][0],
              t * (t * (q[n][1] - 2 * q[n+1][1] + q[n+2][1]) + 2 * (q[n+1][1] - q[n][1])) + q[n][1]];
  return [anc[0] + (dir[0] - anc[0]) * m,
          anc[1] + (dir[1] - anc[1]) * m];
}
// ----------------------------------------------
// return the [x, y] coordinate on the bezier curve
// that corresponds to the paramter "t"
function bezier(q, t) {
  var u = 1 - t;
  return [u*u*u * q[0][0] + 3*u*t*(u* q[1][0] + t* q[2][0]) + t*t*t * q[3][0],
          u*u*u * q[0][1] + 3*u*t*(u* q[1][1] + t* q[2][1]) + t*t*t * q[3][1]];
}
// ----------------------------------------------
function applyData2Path(p, pnts){ // pathpoint, list
// (format:[[ anchor, rightDirection, leftDirection, poinType ],...]
  if(pnts.length<1) return;

  var pt;

  while(p.length > pnts.length){
    p[ p.length - 1 ].remove();
  }
  
  for(var i in pnts){
    pt = i < p.length ? p[i] : p.add();
    with(pt){
      anchor         = pnts[i][0];
      rightDirection = pnts[i][1];
      leftDirection  = pnts[i][2];
      pointType      = pnts[i][3];
    }
  }
}
// ----------------------------------------------
function applyData2AfterIdx(p, pnts, idx){ // pathpoint, list, index
  if(idx == null || idx < 0){
    applyData2Path(p, pnts);
    return;
  }
  var pt;

  while(p.length-1 > idx){
    p[p.length-1].remove();
  }

  for(var i = 0; i < pnts.length; i++){
    pt = p.add();
    with(pt){
      anchor         = pnts[i][0];
      rightDirection = pnts[i][1];
      leftDirection  = pnts[i][2];
      pointType      = pnts[i][3];
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
  for(var i in arr1){
    if (arr1[i] != arr2[i]){
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
function getT4Len(q, len){
  var m = [q[3][0] - q[0][0] + 3 * (q[1][0] - q[2][0]),
           q[0][0] - 2 * q[1][0] + q[2][0],
           q[1][0] - q[0][0]];
  var n = [q[3][1] - q[0][1] + 3 * (q[1][1] - q[2][1]),
           q[0][1] - 2 * q[1][1] + q[2][1],
           q[1][1] - q[0][1]];
  var k = [ m[0] * m[0] + n[0] * n[0],
            4 * (m[0] * m[1] + n[0] * n[1]),
            2 * ((m[0] * m[2] + n[0] * n[2]) + 2 * (m[1] * m[1] + n[1] * n[1])),
            4 * (m[1] * m[2] + n[1] * n[2]),
            m[2] * m[2] + n[2] * n[2]];
  
   var fullLen = getLength(k, 1);

  if(len == 0){
    return fullLen;
    
  } else if(len < 0){
    len += fullLen;
    if(len < 0) return 0;
    
  } else if(len > fullLen){
    return 1;
  }
  
  var t, d;
  var t0 = 0;
  var t1 = 1;
  var torelance = 0.001;
  
  for(var h = 1; h < 30; h++){
    t = t0 + (t1 - t0) / 2;
    d = len - getLength(k, t);
    
    if(Math.abs(d) < torelance) break;
    else if(d < 0) t1 = t;
    else t0 = t;
  }
  
  return t;
}

// ------------------------------------------------
// return the length of bezier curve segment
// in range of parameter from 0 to "t"
// "m" and "n" are coefficients.
function getLength(k, t){
  var h = t / 128;
  var hh = h * 2;
  
  var fc = function(t, k){
    return Math.sqrt(t * (t * (t * (t * k[0] + k[1]) + k[2]) + k[3]) + k[4]) || 0 };
  
  var total = (fc(0, k) - fc(t, k)) / 2;
  
  for(var i = h; i < t; i += hh){
    total += 2 * fc(i, k) + fc(i + h, k);
  }
  
  return total * hh;
}

// ------------------------------------------------
// extract PathItems from the selection which length of PathPoints
// is greater than "n"
function getPathItemsInSelection(n, paths){
  if(documents.length < 1) return;
  
  var s = activeDocument.selection;
  
  if (!(s instanceof Array) || s.length < 1) return;

  extractPaths(s, n, paths);
}

// --------------------------------------
// extract PathItems from "s" (Array of PageItems -- ex. selection),
// and put them into an Array "paths".  If "pp_length_limit" is specified,
// this function extracts PathItems which PathPoints length is greater
// than this number.
function extractPaths(s, pp_length_limit, paths){
  for(var i = 0; i < s.length; i++){
    if(s[i].typename == "PathItem"){
      if(pp_length_limit
         && s[i].pathPoints.length <= pp_length_limit){
        continue;
      }
      paths.push(s[i]);
      
    } else if(s[i].typename == "GroupItem"){
      // search for PathItems in GroupItem, recursively
      extractPaths(s[i].pageItems, pp_length_limit, paths);
      
    } else if(s[i].typename == "CompoundPathItem"){
      // searches for pathitems in CompoundPathItem, recursively
      // ( ### Grouped PathItems in CompoundPathItem are ignored ### )
      extractPaths(s[i].pathItems, pp_length_limit , paths);
    }
  }
}

// ----------------------------------------------
// return pathpoint's index. when the argument is out of bounds,
// fixes it if the path is closed (ex. next of last index is 0),
// or return -1 if the path is not closed.
function parseIdx(p, n){ // PathPoints, number for index
  var len = p.length;
  if(p.parent.closed){
    return n >= 0 ? n % len : len - Math.abs(n % len);
  } else {
    return (n < 0 || n > len-1) ? -1 : n;
  }
}
