// Rendering helpers
var innerWidth = 470;
var innerHeight = 600;

var createRenderer = function() {
  var theCanvas = $('canvas')[0];
  //var renderer = new THREE.CanvasRenderer({ canvas: theCanvas, antialias:true });
  var renderer;

  // USe webgl. If not, fall back to canvas rendering.
  if ( Detector.webgl ) {
    renderer = new THREE.WebGLRenderer( {canvas: theCanvas, antialias:true} );
  }
  else {
    renderer = new THREE.CanvasRenderer( { canvas: theCanvas });
  }

  renderer.setSize(innerWidth, innerHeight);
  return renderer;
};

var createCamera = function( xPos, yPos, zPos, viewAngle) {
  var aspect = innerWidth / innerHeight;
  var near = 0.1;
  var far = 20000;
  var camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);
  camera.position.x = xPos;
  camera.position.y = yPos;
  camera.position.z = zPos;
  return camera;
};

var loadSceneData = function ( gender ) {
  loadMesh( gender, poseModel, wireframe, debugColoring );
  loadMesh( gender, meshParent, wireframe, debugColoring );
  loadSkin( gender );
  loadSkeleton( gender );
  skeletonTranslation = new THREE.Vector3();
};

var displayScene = function() {
  var renderer = createRenderer();

  var cameraX = -10;
  var cameraY = 5;
  var cameraZ = 29;
  var cameraAngle = 47;

  var camera = createCamera(cameraX, cameraY, cameraZ, cameraAngle);

  // add subtle ambient lighting
  var ambientLight = new THREE.AmbientLight(0x222222);
  scene.add(ambientLight);

  // Event
  //THREEx.WindowResize(renderer, camera);

  // Controls
  var controls = new THREE.OrbitControls( camera, renderer.domElement );

  // directional lighting
  var directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);

  var directionalLight2 = new THREE.DirectionalLight(0xffffff);
  directionalLight2.position.set(-1, 1, -1).normalize();
  scene.add(directionalLight2);

  var lastTime = 0;
  scene.add(meshParent);

  var animate = function() {
    controls.update();

    var angularSpeed = 0.03;
    var time = (new Date()).getTime();
    var timeDiff = time - lastTime;

    var angleChange = 0;
    if ( meshParent.children && meshParent.children[0] ) {
      angleChange = angularSpeed * timeDiff * 2 * Math.PI /1000;
    }
    lastTime = time;


    if (showSkeleton) {
      var skeleton = createSkeleton(skeletonData);
      if (skeleton) {
        scene.add(skeleton);
        displaySkeleton(skeleton);
      }
    }

    if (rotateScene) {
      meshParent.rotation.y += angleChange;
    }

    debugColorMesh();
    renderer.render(scene, camera);

    // Eventually delete (or comment) the lines below;
    // remove skeleton for rendering
    if (showSkeleton) {
      if (skeleton) {
        scene.remove(skeleton);
        skeleton = null;
      }
    }

    // Keep this line
    requestAnimationFrame(function(){ animate(); });
  };

  animate();
};
