// Loads a mesh into the given node.
// @gender {String}
// @container {Object} THREE.Object3D container for the polygonal mesh.
// @scaleFactor {float} uniform scaling factor for the scene.
// @showWireframe {boolean} if true, show just a wireframe
// @debugColor {boolean} use vertex colors for debug
var loadMesh = function ( gender, container, showWireframe, debugColor ) {
  if ( !gender || !container ) return;

  var wireframe = showWireframe || false;
  var vertexColor = debugColor || false;

  var fileName = "data/" + gender + "Mesh.json";

  // Clean container from previous meshes, if any
  if (container.children.length) {
    for (var i=0; i<container.children.length; i++) {
      var child = container.children[i];
      container.remove(child);
    }
  }

  var jsonLoader = new THREE.JSONLoader();
  jsonLoader.load( fileName , function( geometry, materials ) {
    var material;
    if (wireframe) {
      material = new THREE.MeshBasicMaterial( { color: 0xcccccc, wireframe: true } );
    }
    else {
      material = new THREE.MeshLambertMaterial({
        // light
        specular: '#aaaaaa',
        // intermediate
        color: '#999999',
        // dark
        emissive: '#444444',
        shininess: 100
      });
    };

    if (vertexColor) {
      material.vertexColors = THREE.VertexColors;
      var faceIndices = [ 'a', 'b', 'c'];
      for ( var i = 0; i < geometry.faces.length; i ++ ) {
        var f = geometry.faces[ i ];
        for (var j=0; j<3; j++) {
          var color = new THREE.Color( 0xcccccc );
          f.vertexColors[ j ] = color;
        }
      }
    }
    var mesh = new THREE.Mesh( geometry, material );
    container.add( mesh );
  });
};

// Loads skin information into the container
// @gender {String}
// @container {Object} container for the skin data (empty JSON object is fine)
var loadSkin = function( gender) {
  if (!gender ) return;

  skinInfo = null;
  skinInfo = [];

  var fileName = "data/" + gender + "Skin.json";
  $.getJSON( fileName, function( theData ) {
    for (var i=0; i<theData.length; i++) {
      var thisSkinInfo = {};
      var data = theData[i];
      for (var j=0; j<data.length; j++) {
        thisSkinInfo[data[j].name] = data[j];
      }
      skinInfo.push(thisSkinInfo);
    }
  })
  .fail(function(){
    console.log("Error can\'t read ", fileName);
  });
};


var deformMesh = function() {

  var skeleton = createSkeleton(skeletonData);
  skeleton.updateMatrix();
  skeleton.updateMatrixWorld();

  for (var key in stretcherTranslation) {
    if (stretcherTranslation.hasOwnProperty(key)) {
      stretcherTranslation[key] = new THREE.Matrix4();
    }
  }

  meshParent.remove(meshParent.children[0]);
  var origMesh = poseModel.children[0];
  var originalMeshClone = new THREE.Mesh( origMesh.geometry.clone(), origMesh.material.clone() );
  meshParent.add(originalMeshClone);

  meshParent.updateMatrix();
  meshParent.updateMatrixWorld();

  var theMesh = meshParent.children[0];

  // Different passes of each skin operator
  var pass = 1;
  skinInfo.forEach( function( theInfo ) {
    var boneTransforms = {};
    buildBoneMatrices( boneTransforms, skeleton, theInfo, pass );
    applyTransformToMesh(boneTransforms, theInfo, theMesh, skeleton);
    pass += 1;
  });

  debugColorMesh();
}

// Applies a mesh transformation to the area of the mesh that corresponds to the
// given stretcher.
// @boneTransforms: {Object} Object with bone transforms (each is a THREE.Matrix4 e.g. scale) indexed by stretcher name
// @mesh: {Object} THREE.Object3D The actual mesh node

var applyTransformToMesh = function( boneTransforms, currSkinInfo, mesh, skeleton ) {

  var vertices = mesh.geometry.vertices;
  var newVertices = [];
  var untouchedVertices = [];

  for (var i=0; i<vertices.length; i++) {
    newVertices[i] = new THREE.Vector3();
    untouchedVertices[i] = true;
  }

  if (!newVertices || !newVertices.length || !untouchedVertices || !untouchedVertices.length) return;

  for ( var stretcherName in boneTransforms ) {
    if (boneTransforms.hasOwnProperty(stretcherName)) {

      var stretcher = skeleton.getObjectByName(stretcherName, true);
      var skinData = currSkinInfo[stretcherName];       // skinInfo is global

      stretcher.updateMatrix;
      stretcher.updateMatrixWorld;

      if (!skinData) {
        console.log('Error: Could not retrieve skin information for ', stretcherName);
        return;
      }

      var boneToWorld = stretcher.matrixWorld;
      var worldToBone = new THREE.Matrix4().getInverse(boneToWorld);

      var localTransform = boneTransforms[stretcherName];

      var tempTransform = new THREE.Matrix4().multiplyMatrices( boneToWorld, localTransform );
      var finalTransform = new THREE.Matrix4().multiplyMatrices( tempTransform, worldToBone );

      var indices = skinData.indices;
      var weights = skinData.weights;
      var temp = new THREE.Vector3();

      for (var i=0; i<indices.length; i++) {
        var idx = indices[i];
        temp.copy( vertices[idx] );
        temp.applyMatrix4(finalTransform);
        temp.multiplyScalar(weights[i]);

        untouchedVertices[idx] = false;
        newVertices[idx].add(temp);
      }
    }
  }
  // Unmodified points
  for (var i=0; i<newVertices.length; i++) {
    if (untouchedVertices[i]) {
      newVertices[i] = vertices[i];
    }
  }
  mesh.geometry.vertices = newVertices;
  mesh.geometry.verticesNeedUpdate = true;
}
