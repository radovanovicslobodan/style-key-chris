// Functions that translate from measurements to bone lengths.
// Bone lengths are set in the global variable boneLengthArray
// ( in /js/main.js ) which stores bone lengths indexed by bone name.

// Callbqack to be invoked  after measurements are processed by the basic deformer
var measurementsCallback = function() {
  // To know which model measurements have been modified by the user
  // just query measurements[id].dirty, e.g.:

  //for (var id in measurements) {
  //  if (measurements.hasOwnProperty(id)) {
  //    if ( measurements[id].dirty === true )
  //    console.log( 'measurements[' + id + '] = ' + measurements[id] );
  //  }
  //}
};

// @measurementId {String}
// @value {float}
var updateMeasurements = function( measurementId, value ) {
  if ( !measurementId || !value ) return;
  measurements[measurementId].value = parseFloat(value);
  measurements[measurementId].dirty = true;
  computeNewBoneLengths( measurementsCallback );
  // Deform the mesh using the skeleton information.
  deformMesh();
};

// Compute bone lengths from measurements
// Measurements is a global variable in js/main.js
var computeNewBoneLengths = function( callback ) {
  stretchArms( measurements['SleeveLength'], measurements['Forearm'], measurements['Bicep'] );
  stretchShoulder( measurements['Shoulder'] );
  stretchFoot( measurements['FootLength'] );
  verticalStretch( measurements['Height'], measurements['Inseam'], measurements['Outseam'],
    measurements['BustPoint'], measurements['WaistPoint'], measurements['Waistcoat'] );
  stretchRadial(
    measurements['Calf'], measurements['Wrist'], measurements['Neck'], measurements['Thigh'],
    measurements['Knee'], measurements['Hips'], measurements['Waist'], measurements['UnderBust'],
    measurements['Chest'], measurements['PantsWaistband']);
  resizeBust(measurements['Bust'], measurements['UnderBust']);

  callback();
};

var resizeBust = function( bust, underbust ) {
  if (thisModelGender !== 'female') return;
  if (!bust || !underbust) return;

  var UBust = boneLengthArray['UnderBust'];
  var BreastR = boneLengthArray['BreastR'];
  var BreastL = boneLengthArray['BreastL'];

  // Used for debug only
  var defaultRadiusTemp = BreastR.defaultRadius;

  // Set default values to useful quantities (bust size depends on underbust)
  // Make sure the bust is protruding over the underbust
  var breastDefaultRadius = Math.max(BreastR.defaultRadius - UBust.defaultRadius, 0);

  // Current measurements representing thebust radius as an extra over the underbust.
  var BreastRadius = Math.max(bust.value - underbust.value, 0) + UBust.defaultRadius;

  // Change the line below for the actual value
  BreastR.radius = BreastL.radius = BreastRadius;
}

var stretchRadial = function( calf, wrist, neck, thigh, knee, hips, waist, underbust, chest, pantsWaistband ) {

  if (!calf || !wrist || !neck || !thigh || !knee || !hips || !waist ) return;
  if ( thisModelGender === 'female' ) {
    if ( !underbust ) return;
  }

  if ( thisModelGender === 'male' ) {
    if ( !chest || !pantsWaistband ) return;
  }

  var HandL = boneLengthArray["HandL"];
  var HandR = boneLengthArray["HandR"];

  var LegL = boneLengthArray["LegL"];
  var LegR = boneLengthArray["LegR"];

  var ThighL = boneLengthArray["LowerThighL"];
  var ThighR = boneLengthArray["LowerThighR"];

  var Neck = boneLengthArray["Neck"];

  var KneeR = boneLengthArray["KneeR"];
  var KneeL = boneLengthArray["KneeL"];

  var Hip = boneLengthArray["Hip"];

  var Waist = boneLengthArray["WaistLine"];

  // Modify values in the skeleton

  Neck.radius = neck.value;

  LegL.radius = LegR.radius = calf.value;

  ThighL.radius = ThighR.radius = thigh.value;

  HandR.radius = HandL.radius = wrist.value;

  KneeR.radius = KneeL.radius = knee.value;

  Hip.radius = hips.value;

  // Waist
  var waistDiff = waist.value - waist.defaultValue;
  var waistRatioParamX = 0.7;
  var waistRatioParamZ = 1.1;
  Waist.radiusX = waist.defaultValue + waistDiff * waistRatioParamX;
  Waist.radiusZ = waist.defaultValue + waistDiff * waistRatioParamZ;

  // Female-only
  if ( thisModelGender === 'female' ) {

    var UnderBust = boneLengthArray["UnderBust"];
    UnderBust.radius = underbust.value;
  }

  // Male-only
  if (thisModelGender === 'male') {

    var Chest = boneLengthArray["ChestMeasurement"];
    Chest.radius = chest.value;

    var WBand = boneLengthArray["WaistPant"];
    WBand.radius = pantsWaistband.value;
  }
}

// @sleeve {Object} sleeve measurement
// @forearm {Object} forearm measurement
// @bicep {Object} bicep measurement
var stretchArms = function ( sleeve, forearm, bicep ) {
  if (!sleeve || !forearm || !bicep) return;

  var upperArmLength = sleeve.value - forearm.value;

  var UpperArmL = boneLengthArray["UpperArmL"];
  var UpperArmR = boneLengthArray["UpperArmR"];

  var ForeArmL = boneLengthArray["ForeArmL"];
  var ForeArmR = boneLengthArray["ForeArmR"];

  var BicepL = boneLengthArray["BicepL"];
  var BicepR = boneLengthArray["BicepR"];

  var ratio =  sleeve.value / sleeve.defaultValue;

  ForeArmL.length = ForeArmR.length = ForeArmL.defaultLength * ratio;
  UpperArmL.length = UpperArmR.length = UpperArmL.defaultLength * ratio;

  ForeArmL.radius = ForeArmR.radius = forearm.value;


  if ( thisModelGender ==='female' ) {
    UpperArmL.radius = UpperArmR.radius = bicep.value;
  }
  else {

    BicepL.radius = BicepR.radius = bicep.value;
  }
};

// @shoulder {Object} shoulder measurement
var stretchShoulder = function( shoulder ) {
  if ( !shoulder ) return;

  var shoulderL = boneLengthArray['ShoulderL'];
  var shoulderR = boneLengthArray['ShoulderR'];
  var shoulderBone = boneLengthArray['Shoulder'];

  var ratio = shoulder.value / shoulder.defaultValue;

  var newLeft = shoulderL.defaultLength * ratio;
  var newRight = shoulderR.defaultLength * ratio;

  shoulderL.length = newLeft;
  shoulderR.length = newRight;
  shoulderBone.radiusX = shoulder.value;
};

// @foot {Object} foot measurement
var stretchFoot = function( foot ) {
  if ( !foot ) return;

  var FootR = boneLengthArray['FootR'];
  var FootL = boneLengthArray['FootL'];

  var HeelL = boneLengthArray['HeelL'];
  var HeelR = boneLengthArray['HeelR'];

  FootR.length = foot.value - HeelR.defaultLength;
  FootL.length = foot.value - HeelL.defaultLength;
};

// @height {Object} height measurement
// @inseam {Object} inseam measurement
// @outseam {Object} outseam measurement
var verticalStretch = function( height, inseam, outseam, bustPoint, waistPoint, waistcoat ) {
  if ( !height || !inseam || !outseam ) return;
  if ( thisModelGender === 'female' && ( !bustPoint || !waistPoint )) return;
  if ( thisModelGender === 'male' && !waistcoat ) return;

  var upperchest = boneLengthArray["UpperChest"];
  var chest = boneLengthArray["Chest"];
  var waist = boneLengthArray["Waist"];

  var legR = boneLengthArray['LegR'];
  var legL = boneLengthArray['LegL'];
  var upperThighR = boneLengthArray['UpperThighR'];
  var upperThighL = boneLengthArray['UpperThighL'];
  var lowerThighR = boneLengthArray['LowerThighR'];
  var lowerThighL = boneLengthArray['LowerThighL'];
  var waist = boneLengthArray['Waist'];
  var chest = boneLengthArray['Chest'];
  var crotch = boneLengthArray['Crotch'];
  var head = boneLengthArray['Head'];
  var neck = boneLengthArray['Neck'];

  // Reset any global skeleton transformation
  skeletonTranslation = new THREE.Vector3();

  var currChestHeight = legR.length
                   + upperThighR.length
                   + lowerThighR.length
                   + waist.length
                   + chest.length;

  if (inseam.value >= outseam.value) {
    inseam.value = outseam.value - 0.1;
  }

  if ( outseam.value >= currChestHeight ) {
    outseam.value = currChestHeight - 0.1;
  }

  // Adjust outseam
  var pelvisHeight = legR.defaultLength
                   + upperThighR.defaultLength
                   + lowerThighR.defaultLength;

  var waistHeight  = pelvisHeight + waist.defaultLength;

  var waistToCrotch = outseam.defaultValue - inseam.defaultValue;
  var waistPelvisProp = waist.defaultLength / waistToCrotch;
  var crotchPelvisProp = crotch.defaultLength / waistToCrotch;

  var newWaistToCrotch = outseam.value - inseam.value;
  var newWaistLength = waistPelvisProp * newWaistToCrotch;
  var newCrotchLength = crotchPelvisProp * newWaistToCrotch;

  var newPelvisHeight = inseam.value + newCrotchLength;

  // Adjust new pelvis position
  var diffPelvis = newPelvisHeight - pelvisHeight;
  skeletonTranslation.y = diffPelvis;

  var diffWaist = outseam.value - outseam.defaultValue;

  // Adjust upper body
  // Waistcoat and points.
  waist.length = Math.max(newWaistLength, 0);
  crotch.length = Math.max(newCrotchLength);

  //chest.length = Math.max(chest.defaultLength - diffWaist, 0);

  // Add bust point, waist point and waistcoat information below
  if (thisModelGender === 'male') {
    var ratio = waistcoat.value / waistcoat.defaultValue;
    upperchest.length = upperchest.defaultLength * ratio;
    chest.length = chest.defaultLength * ratio;
  }
  else {  // female model

    var bust = boneLengthArray['BustApexLevel'];
    var sternum = boneLengthArray['Sternum'];
    var navel = boneLengthArray['Navel'];

    // Auxiliary skeleton
    var skeleton = refSkel;
    skeleton.updateMatrix();
    skeleton.updateMatrixWorld();

    var theSternum = skeleton.getObjectByName( 'Sternum', true);
    var neckPos = new THREE.Vector3().getPositionFromMatrix( theSternum.matrixWorld );

    var bustApexLevel = skeleton.getObjectByName( 'BustApexLevel', true);
    var bustApexLevelPos = new THREE.Vector3().getPositionFromMatrix( bustApexLevel.matrixWorld );

    var theNavel = skeleton.getObjectByName( 'Navel', true);
    var navelPos = new THREE.Vector3().getPositionFromMatrix( theNavel.matrixWorld );

    var bustPointVec = new THREE.Vector3().subVectors( neckPos, bustApexLevelPos );
    var bustToWaistVec = new THREE.Vector3().subVectors( bustApexLevelPos, navelPos );

    // data to get measurements of the working sections (that are going to be deformed)
    var workingBustPointModel = bustPointVec.length();
    var bustToWaist = bustToWaistVec.length();    

    // Assuming same geometry, find the total torso length

    var waistPointRatio = waistPoint.value / waistPoint.defaultValue;

    workingBustPointModel = workingBustPointModel * waistPointRatio;
    
    //bustToWaist = bustToWaist * waistPointRatio;   

    var bustOverChest = bust.length - sternum.length;    

    // To avoid undefined sqrt when projecting.
    var tempBustPoint = Math.max( workingBustPointModel, bustOverChest );
    var tempBustToWaist = Math.max( bustToWaist, bustOverChest );

    // Project
    var tempUpProj = Math.sqrt( (tempBustPoint * tempBustPoint) - (bustOverChest * bustOverChest) );
    var projRatio = tempUpProj /upperchest.defaultLength;
    var tempDownProj = chest.defaultLength * projRatio;

    var tempTorsoLength = tempUpProj + tempDownProj;

    var defaultTorsoLength = upperchest.defaultLength + chest.defaultLength;

    var upperTorsoProp = upperchest.defaultLength / defaultTorsoLength;
    var lowerTorsoProp = chest.defaultLength / defaultTorsoLength;

    upperchest.length = tempUpProj; //tempTorsoLength * upperTorsoProp;
    chest.length = tempDownProj; //tempTorsoLength * lowerTorsoProp;   

    // Now use the bustpoint to correct the upper body
    
    var currentUpperBodyLength = upperchest.length + chest.length;

    var bustPointRatio = bustPoint.value / bustPoint.defaultValue;

    workingBustPointModel = workingBustPointModel * bustPointRatio;
        
    // To avoid undefined sqrt when projecting.
    workingBustPointModel = Math.max(workingBustPointModel, bustOverChest);

    // Project new distances on the Y axis (parallel to the back)
    var upProj = Math.sqrt( (workingBustPointModel * workingBustPointModel) - (bustOverChest * bustOverChest) );
    var downProj = currentUpperBodyLength - upProj;

    // Update values for upper and lower chest
    upperchest.length = upProj;
    chest.length = downProj;
    //*/    
  }

  // Before adding waistcoat, bustpoint and waistpoint measurements (stretches lower chest)
  //var heightDiff = height.value - height.defaultValue;
  //chest.length = Math.max(chest.defaultLength + heightDiff - diffWaist,0);

  // Adjust legs
  var thighProp = (upperThighR.defaultLength + lowerThighR.defaultLength )/ pelvisHeight;
  var legProp = legR.defaultLength / pelvisHeight;

  upperThighR.length = upperThighL.length = Math.max(newCrotchLength,0);

  var crotchDiff = crotch.length - crotch.defaultLength;

  lowerThighR.length = Math.max(lowerThighR.defaultLength + diffPelvis * thighProp - crotchDiff, 0);
  lowerThighL.length = Math.max(lowerThighL.defaultLength + diffPelvis * thighProp - crotchDiff,0);

  legR.length = Math.max(legR.defaultLength + diffPelvis * legProp,0);
  legL.length = Math.max(legL.defaultLength + diffPelvis * legProp,0);

  // Once all other measurements are taken care of, solve the height

  var currHeightNoHead = legR.length
                       + lowerThighR.length
                       + upperThighR.length
                       + waist.length
                       + chest.length
                       + upperchest.length
                       + neck.length;

  var newHead = height.value - currHeightNoHead;
  head.length = Math.max(newHead, 0);
};
