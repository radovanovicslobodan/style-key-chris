// BoneMatrix.js: Here the transformation matrices to deform the mesh
// are constructed from the values in the skeleton.

// Search in the skeleton data structure (JSON objcect)
// @name {String}
// @node {Object} Skeleton data node (skeletonData) global variable in /js/main.js
var getBoneDataByName = function( name, node ) {
  if ( !name ) return;
  var theNode = node || skeletonData
  if ( theNode.name === name ) return theNode;

  for ( var i = 0; i < theNode.children.length; i ++ ) {
  	var child = theNode.children[i];
  	if ( child.name === name ) {
  	  return child;
  	}
  	child  = getBoneDataByName(name, child);
  	if (child) {
  	  return (child);
  	}
  }
  return;
}

var isPivot = function( bone ) {
  return  bone.name.match(/Pivot$/);
}

// Returns the stretcher node associated with a bone joint.
// @node {Object} THREE.Object3D the bone joint we want the stretcher
var getStretcherNode = function ( node ) {
  if (!node) return;

  var pivot = isPivot( node )? node: getBoneDataByName( node.name + 'Pivot' );
  if (!pivot) return;

  // get the stretcher node from the pivot
  // it is assumed there is one stretcher per pivot
  for (var i=0; i<pivot.children.length; i++) {
  	if (pivot.children[i].stretcher) {
  		return pivot.children[i];
  	}
  }
  return;
}

// Uses global array of bone lengths to calculate the bone
// transformations.
var buildBoneMatrices = function( boneTransformations, boneNode, currentSkinInfo, pass ) {

  if (!refSkel) return;

  // Use skeleton for hierarchical transformations
  var stretcher;
  var theBone;

  if (isPivot(boneNode)) {
  	// see if there is a stretcher for this node
  	for ( var i=0; i<boneNode.children.length; i++ ) {
  	  if ( boneNode.children[i].userData.stretcher ) {
        if ( currentSkinInfo[boneNode.children[i].name] ) {
  	  	  stretcher = boneNode.children[i];
        }
  	  }
  	  else {
  	  	theBone = boneNode.children[i];
  	  }
  	}
  }

  // If there a stretcher and an associated bone was found
  if ( stretcher ) {
  	var offset = stretcher.position.y;

    var scaleX = 1.0;
   	var scaleY = 1.0;
    var scaleZ = 1.0;

   	if ( theBone ) {
      //var boneName = theBone.name;
      var curBoneInfo = boneLengthArray[theBone.name];
      scaleY = Math.max((curBoneInfo.length - offset) / (curBoneInfo.defaultLength - offset), 0);

      if (curBoneInfo.radius !== undefined) {
        scaleX = scaleZ = curBoneInfo.radius / curBoneInfo.defaultRadius;
      }
      else {
        if (curBoneInfo.radiusX !== undefined) {
          scaleX = curBoneInfo.radiusX / curBoneInfo.defaultRadiusX;
        }
        if ( curBoneInfo.radiusZ !== undefined) {
          scaleZ = curBoneInfo.radiusZ / curBoneInfo.defaultRadiusZ;
        }
      }
   	}
   	var scaleMatrix = new THREE.Matrix4().makeScale( scaleX, scaleY, scaleZ );
    var translation = new THREE.Matrix4();

    // Manage end point translation only once: on the first (length-stretching) pass.
    if ( pass === 1 ) translation = getEndEffectorTranslation( stretcher );

    boneTransformations[ stretcher.name ] = new THREE.Matrix4().multiplyMatrices( scaleMatrix, translation );
  }

  for (var i=0; i<boneNode.children.length; i++) {
    buildBoneMatrices( boneTransformations, boneNode.children[i], currentSkinInfo, pass );
  }
};

var getEndEffectorTranslation = function( stretcher ) {
  var refBone = refSkel.getObjectByName(stretcher.name, true);
  var refPos = new THREE.Vector3().getPositionFromMatrix( refBone.matrixWorld );
  var thisPos = new THREE.Vector3().getPositionFromMatrix( stretcher.matrixWorld );
  var trans = new THREE.Vector3().subVectors( thisPos, refPos );
  // Convert to bone coordinates
  var worldToLocal1 = new THREE.Matrix4().getInverse( stretcher.matrixWorld );
  var worldToLocal = new THREE.Matrix4().extractRotation( worldToLocal1 );
  var transBone = trans.clone().applyMatrix4(worldToLocal);
  return new THREE.Matrix4().makeTranslation(transBone.x, transBone.y, transBone.z);
}
