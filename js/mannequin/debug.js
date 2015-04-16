//-------------------------------------------------------
// Debug helper functions

// Removes all debug elements added to the node and its children.
// @node {Object} THREE.Object3D node
var debugClean = function (node) {
  var children = node.getDescendants();
  for (var i=0; i<children.length; i++) {
    var child = children[i];
    if (child.name === 'debug') {
      node.remove(child);
      delete child;
    }
  }
};

// Displays a vector in the node's local coordinate system.
// @position {Object} THREE.Vector3
// @direction {Object} THREE.Vector3
// @node {Object} THREE.Object3D node to which the vector is appended

var displayVector = function( position, direction, node ) {
  var start = position;
  var end = new THREE.Vector3();
  end.addVectors(position, direction);
  displayLine(start, end, node)
};

// Displays a line in the node's local coordinate system.
// @start {Object} THREE.Vector3
// @end {Object} THREE.Vector3
// @node {Object} THREE.Object3D node to which the vector is appended
// @color {Hex} hexadecimal representation of the line color

var displayLine = function( start, end, node, lineColor ) {
  var color = lineColor || 0x000000;
  var geometry = new THREE.Geometry();
  geometry.vertices.push(start);
  geometry.vertices.push(end);
  var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: color}));
  line.name = 'debug';
  node.add( line );
};

// Displays the node's local coordinate system (scaled by 10)
// @node {Object} THREE.Object3D node
// @color {Hex} hexadecimal representation of the line color
var displayLocalCoordinates = function (node, color) {
  var O = new THREE.Vector3(0,0,0);
  var X = new THREE.Vector3(10,0,0);
  var Y = new THREE.Vector3(0,10,0);
  var Z = new THREE.Vector3(0,0,10);

  displayLine( O, X, node, color );
  displayLine( O, Y, node, color );
  displayLine( O, Z, node, color );
};

// Adds a box at the center of the node's coordinate system for display
// @node {Object} THREE.Object3D node
var displayBox = function(position, node) {
  var mesh = new THREE.Mesh(new THREE.CubeGeometry(0.5, 0.5, 0.5), new THREE.MeshNormalMaterial());
  mesh.name = "debug";
  mesh.translateX(position.x); mesh.translateY(position.y); mesh.translateZ(position.z);
  node.add(mesh);
}

// Colors mesh vertices that are determined by skin data
// @skinInfoItem {Object} skin data item, as loaded in js/mesh.js#loadSkin
// @mesh {Object} THREE.Mesh the mesh to apply color
// @colorHex {hex} hexadecimal code for the color to be used in selected mesh parts (default: black)
var colorSkin = function( skinInfoItem, mesh, colorHex ) {

  if ( !skinInfoItem || !mesh ) return;

  var colorCode = colorHex || 0x000000;
  var color = new THREE.Color(colorCode);
  var vertexIndices = skinInfoItem.indices;
  var geometry = mesh.geometry;
  var faceIndices = [ 'a', 'b', 'c'];

  for ( var i = 0; i < geometry.faces.length; i ++ ) {
    var f = geometry.faces[ i ];

    for (var j=0; j<3; j++) {
      var vertexIndex = f[ faceIndices[ j ] ];
      if (vertexIndices.indexOf(vertexIndex) !== -1) {
        f.vertexColors[ j ] = color;
        mesh.geometry.colorsNeedUpdate = true;
      }
    }
  }
}


// @m {Object} Three.Matrix4
var getMatrixDecomposition = function( m )  {
  var quaternion = new THREE.Quaternion();
  var position = new THREE.Vector3();
  var scale = new THREE.Vector3();

  m.decompose(position, quaternion, scale);

  return {
    translation: position,
    rotation: quaternion,
    scale: scale
  };
}

var debugColorMesh = function() {

  if (!debugColoring) return;

  if (skinInfo) {

    var theMesh = meshParent.children[0];

    if ( skinInfo[0] ) {

      //colorSkin(skinInfo[0]['Bone_Chest'], theMesh, 0x00ee00);
      //colorSkin(skinInfo[0]['Bone_Belly'], theMesh, 0xaaaa00);

      //colorSkin(skinInfo[0]['Bone_Shoulder'], theMesh, 0xffcccc);
      //colorSkin(skinInfo[0]['Bone_UpperArmR'], theMesh, 0xee0000);
      //colorSkin(skinInfo[0]['Bone_UpperArmL'], theMesh, 0x00ee00);

      //colorSkin(skinInfo[0]['Bone_Head'], theMesh, 0xee0000)
      //colorSkin(skinInfo[0]['Bone_Shoulder'], theMesh, 0xee0000);
      //colorSkin(skinInfo[0]['Bone_NeckStretcher'], theMesh, 0x0000ee);

      //colorSkin(skinInfo[0]['Bone_Chest'], theMesh, 0x00ee00);
      //colorSkin(skinInfo[0]['Bone_Belly'], theMesh, 0xaaaa00);
      //colorSkin(skinInfo[0]['Bone_Waist'], theMesh, 0xee0000);
      //colorSkin(skinInfo[0]['Bone_Crotch'], theMesh, 0x0000ee);

      //colorSkin(skinInfo[0]['Bone_ThighR'], theMesh, 0xee00ee);
      //colorSkin(skinInfo[0]['Bone_ThighL'], theMesh, 0xee00ee);
      //colorSkin(skinInfo[0]['Bone_LegR'], theMesh, 0x00aaaa);
      //colorSkin(skinInfo[0]['Bone_LegL'], theMesh, 0x00aaaa);
      //colorSkin(skinInfo[0]['Bone_HeelR'], theMesh, 0x0000ee);
      //colorSkin(skinInfo[0]['Bone_HeelL'], theMesh, 0x0000ee);
      //colorSkin(skinInfo[0]['Bone_FootR'], theMesh, 0xee00ee);
      //colorSkin(skinInfo[0]['Bone_FootL'], theMesh, 0xee00ee);

      //colorSkin(skinInfo[0]['Bone_UpperArmR'], theMesh, 0xee00ee);
      //colorSkin(skinInfo[0]['Bone_UpperArmL'], theMesh, 0xee00ee);

      //colorSkin(skinInfo[0]['Bone_ForeArmR'], theMesh, 0x00ee00);
      //colorSkin(skinInfo[0]['Bone_ForeArmL'], theMesh, 0x00ee00);

      //colorSkin(skinInfo[0]['Bone_HandR'], theMesh, 0x0000ee);
      //colorSkin(skinInfo[0]['Bone_HandL'], theMesh, 0x0000ee);
    }
    if ( skinInfo[1] ) {
      //colorSkin(skinInfo[1]['Bone_UnderBust'], theMesh, 0xee0000);
      //colorSkin(skinInfo[1]['Bone_Hip'], theMesh, 0xee0000);
      //colorSkin(skinInfo[1]['Bone_WaistLine'], theMesh, 0x00ee00);
      //colorSkin(skinInfo[1]['Bone_Neck'], theMesh, 0x00ee00);
      //colorSkin(skinInfo[1]['Bone_BicepL'], theMesh, 0x00ee00);
      //colorSkin(skinInfo[1]['Bone_BicepR'], theMesh, 0x00ee00);
    }
  }
}