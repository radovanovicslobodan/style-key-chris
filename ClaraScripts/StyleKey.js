// Exporter script for a Clara.io custom-made scene.

// Script goes here
exo.api.definePlugin('StyleKey', { version: '0.0.1' }, function(app) {

  app.defineCommand({

    name: 'ExportMarkers',

    execute: function(ctx, options) {

      var rootNode = getHierarchyRoot( ctx );
      var tree = buildMarkerHierarchy( rootNode, ctx );
      tree.root = true;
      var theMesh = getMeshGenderByName('Mesh', ctx);
      var fileName = theMesh.gender + 'Markers.json';
      exportToFileJSON(fileName, tree, ctx);
    }
  });

  app.defineCommand({

    name: 'ExportBones',

    execute: function(ctx, options) {

      var rootNode = getHierarchyRoot( ctx );
      var tree = buildBoneHierarchy( rootNode, ctx );
      tree.root = true;
      var theMesh = getMeshGenderByName('Mesh', ctx);
      var fileName = theMesh.gender + 'Bones.json';
      exportToFileJSON(fileName, tree, ctx);
    }
  });

  app.defineCommand({
    name: 'ExportSkinning',

    execute: function(ctx, options) {
      var theMesh = getMeshGenderByName('Mesh', ctx);
      var skinData = buildSkinInfo(theMesh.mesh, ctx);
      var fileName = theMesh.gender + 'Skin.json';
      exportToFileJSON(fileName, skinData, ctx);
    }
  });

  // --------- Basic helper functions ---------

  var exportToFileJSON = function( filename, data, ctx ) {
    var dataJSON = JSON.stringify(data, null, '  ');
    var blob = new Blob([dataJSON], {type: 'application/octet-stream;charset=' + document.characterSet});
    saveAs(blob, filename);
  }

  var getHierarchyRoot = function( ctx ) {
    return ctx('Pelvis').at(0);
  };

  var getSceneNode = function( ctx ) {
    return ctx('%Scene').at(0);
  }

  var getMeshGenderByName = function( name, ctx ) {
    var theMesh = ctx(name).at(0);
    var genData = ctx(name+'#Properties[key=gender]');
    var theGender = genData.at(0)? genData.at(0).get('value') : 'unknown';
    return { mesh: theMesh, gender: theGender };
  }

  // ------------- Node data --------------------

  var getNodeData = function( node, ctx ) {
    if (!node) return;

    var nodeName = node.get( 'name' );

      //Custom-made bone markers
    var translation = ctx(nodeName+'#Transform[translation]').get('translation');
    var rotation = ctx(nodeName).first().transform.getRotation();

    var boneData = ctx(nodeName+'#Properties[key=bone]');
    var bone = boneData.at(0)? boneData.get('value'): false;

    var circData = ctx(nodeName+'#Properties[key=circumference]');
    var circ = circData.at(0)?  circData.get('value') : false;

    var stretchData = ctx(nodeName+'#Properties[key=stretcher]');
    var stretcher = stretchData.at(0)?  stretchData.get('value') : false;

    var stretcherData = {};
    if (stretcher) {

      var boneData = {
        boneLength : ctx(nodeName+'#Bone[boneLength]').get('boneLength'),
        capSizeStart : ctx(nodeName+'#Bone[capSizeStart]').get('capSizeStart'),
        capSizeEnd : ctx(nodeName+'#Bone[capSizeEnd]').get('capSizeEnd'),
        falloff : ctx(nodeName+'#Bone[falloff]').get('falloff'),
        boneDirection : ctx(nodeName+'#Bone[boneDirection]').get('boneDirection')
      };

      var boneTransform = {
        preRotation : ctx(nodeName).first().transform.preRotation,
        rotateAxis : ctx(nodeName).first().transform.rotateAxis,
        scale : ctx(nodeName).first().transform.getScale(),
        rotationOffset : ctx(nodeName).first().transform.rotationOffset
      };


      stretcherData = {
        boneData : boneData,
        boneTransform: boneTransform,
        boneNode: node
      };

      bone = true;
    }

    return {
      'name' : nodeName,
      'translation' : translation,
      'rotation' : rotation,
      'bone': bone,
      'circumference': circ,
      'stretcher': stretcher,
      'stretcherData' : stretcherData
    };
  };

  // ------------- Marker hierarchy -------------

  var buildMarkerHierarchy = function( node, ctx ) {
    if (!node) return;

    var nodeData = getNodeData( node, ctx );
    var children = node.nodes;
    var childrenData = [];

    for (var i=0; i<children.length; i++) {
      var child = children.at(i);
      childData = buildMarkerHierarchy(child, ctx);
      childrenData.push(childData);
    }

    nodeData.children = childrenData;
    return nodeData;
  };

  // ------------- Bone hierarchy -------------

  var buildBoneHierarchy = function( node, ctx ) {
    if (!node) return;

    var nodeData = getNodeData( node, ctx );
    if (!nodeData.bone) return;
    var children = node.nodes;

    var childrenData = [];

    for (var i=0; i<children.length; i++) {
      var child = children.at(i);
      childData = buildBoneHierarchy(child, ctx);
      if(childData) childrenData.push(childData);
    }
    nodeData.children = childrenData;
    return nodeData;
  }

  var buildSkinInfo = function( mesh, ctx ) {

    var getTransforms = function( matrix ) {
      var translation = new THREE.Vector3().getPositionFromMatrix( matrix );
      var rotation = exo.math.radianToDegree( new THREE.Vector3().setEulerFromRotationMatrix( matrix, "ZYX" ) );
      var scale = new THREE.Vector3().getScaleFromMatrix( matrix );

      return {
        translation: translation,
        rotation: rotation,
        scale: scale
      };
    };

    var scene = getSceneNode(ctx);
    var operators = mesh.PolyMesh.operators;

    var allSkinInfo = [];
    operators.each( function(operator) {
      if ( operator.get('name') === 'Skin' ) {

        var skinInfo = [];

        var boneDataList = operator.get('boneDataList');

        if ( !boneDataList ) {
          alert('Error: no bone data available');
          return;
        }

        for ( var i = 0; i < boneDataList.length ; i++ ) {
          var boneData = boneDataList[i];
          var boneNode = scene.find( function(m) { return m.id === boneData.uuid; });

          if ( boneNode ) {
            var skinData = {
              name: boneNode.get('name'),
              indices : boneData.vertexIndices,
              weights: boneData.vertexWeights,
              transform: getTransforms(operator.get('poseSkinToWorldTransform')), // Global transform matrix of mesh in bind pose
              transformLink: getTransforms(boneData.poseBoneToWorldTransform)     // Global transform matrix of bones in bind pose
            };
            skinInfo.push(skinData);
          }
          else {
            alert('Error: No bone found for skin data.');
            return;
          }
        }
        allSkinInfo.push(skinInfo);
      }
    });
    return allSkinInfo;
  }
});

/* Call from Script section of editor screen
ctx.exec('StyleKey', 'ExportMarkers', {});
ctx.exec('StyleKey', 'ExportSkinning', {});
ctx.exec('StyleKey', 'ExportBones', {});
*/