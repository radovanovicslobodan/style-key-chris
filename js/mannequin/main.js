var poseModel = new THREE.Object3D();       // Pose model
var measurements = {};                      //  Modified model
var boneLengthArray = {};                   // Array of bone lengths
var meshParent = new THREE.Object3D();      // The mesh
var scene = new THREE.Scene();              // the scene
var skinInfo = [];                          // Skin information
var skeletonData = {};                      // Skeleton data
var refSkel;
var thisModelGender = gender;

var skeletonTranslation = new THREE.Vector3();
var stretcherTranslation = {};

var showSkeleton = false;
var wireframe = false;
var debugColoring = false;
var rotateScene = false;

var param;

//---------------------------------------------
// Extended Bone info!
//---------------------------------------------

var boneExtendedInfo = {
  "radius": {
    "Bicep": [ "UpperArmL", "UpperArmR", "BicepL", "BicepR" ],
    "Forearm": [ "ForeArmL", "ForeArmR" ],
    "Calf": [ "LegR", "LegL" ],
    "Thigh": [ "LowerThighR", "LowerThighL" ],
    "Wrist": [ "HandR", "HandL" ],
    "Knee": [ "KneeR", "KneeL" ],
    "Neck": [ "Neck" ],
    "Hips": [ "Hip" ],
    "UnderBust": [ "UnderBust" ],
    "Bust": [ "BreastR", "BreastL" ],
    "Chest": ["ChestMeasurement"],
    "PantsWaistband": ["WaistPant"]
  },
  "radiusX": {
    "Waist": [ "WaistLine" ],
    "Shoulder": ["Shoulder"]
  },
  "radiusZ": {
    "Waist": [ "WaistLine" ]
  }
};

var addRadiusData = function() {
  var defValues = {};
  return function(objName, prop, value) {
    var defProp = defValues[prop];
    if (defProp === undefined) {
      defProp = defValues[prop] = "default" + prop[0].toUpperCase() + prop.substr(1);
    }
    var curObj = boneLengthArray[objName];
    if (curObj) {
      curObj[prop] = curObj[defProp] = value;
    }
  };
}();


var addRadiusParseMap = function(map, prop) {
  for (var attr in map) {
    var info =  map[attr];

    // For attributes unique to female or male.
    if (!measurements[attr]) {
      continue;
    }

    var defValue = measurements[attr].defaultValue;
    if (info instanceof Array) {
      for (var i = 0; i < info.length; ++i) {
        addRadiusData(info[i], prop, defValue);
      }
    }
    else {
      addRadiusData(info, prop, defValue);
    }
  }
};
var addRadiusInformation = function() {
  for (var attr in boneExtendedInfo) {
    addRadiusParseMap(boneExtendedInfo[attr], attr);
  }
};

var loadingPromise = {
  skeletonLoaded: false,
  measurementsLoaded: false,
  reset: function() {
    this.skeletonLoaded = false;
    this.measurementsLoaded = false;
  },
  skeletonDone: function() {
    if (this.measurementsLoaded) {
      addRadiusInformation();
    }
    else {
      this.skeletonLoaded = true;
    }
  },
  measurementsDone: function() {
    if (this.skeletonLoaded) {
      addRadiusInformation();
    }
    else {
      this.measurementsLoaded = true;
    }
  },
};

//---------------------------------------------
// Helper functions
//---------------------------------------------

// @gender {String} 'female' or 'male'
var readPoseParameters = function( gender, scaleModel ) {
  if (!gender) return;

  var paramsFile = 'data/'+gender+'Params.json';

  // reset measurements
  measurements = {};

  $.getJSON( paramsFile, function( params ){
  	params.forEach( function (param) {
      var paramId = param.name.replace(/\s/g, "");
      param.id = paramId;
      measurements[paramId] =  {value: param.default/scaleModel, defaultValue: param.default/scaleModel, dirty: false };
  	});
  	
  	param = params;

  })
  .success( function() {
    // This will executed when done!
    loadingPromise.measurementsDone()
  })
  .fail( function(){
    console.log("Error can\'t read ", paramsFile);
  });
};

function updateChanges(gender, scaleModel) {
  var cm = 2.54;
  
  // Height Ratio
  var height1 = parseInt($("#Height1").val().replace(' ft',''));
  var height2 = parseInt($("#Height2").val().replace(' in',''));
  var default_height = param[0]["default"];
  var height_ratio;
    
  if (height1 != "1") {
    height_ratio = (((height1 * 12) + height2) * cm) / default_height;
    height_ratio = Math.round(height_ratio * 100) / 100;
  } else {
    height_ratio = 1;
  }
  
  // Bicep Ratio
  var bicep = $("#Bicep").val();
  var default_bicep = param[5]["default"];
  var bicep_ratio;
  
  if (bicep != "") {
    bicep_ratio = (parseInt(bicep) * cm) / default_bicep;
    bicep_ratio = Math.round(bicep_ratio * 100) / 100;
  } else {
    bicep_ratio = height_ratio;
  }
  
  // Thigh Ratio
  var thigh = $("#Thigh").val();
  var default_thigh = param[14]["default"];
  var thigh_ratio;
  
  if (thigh != "") {
    thigh_ratio = (parseInt(thigh) * cm) / default_thigh;
    thigh_ratio = Math.round(thigh_ratio * 100) / 100;
  } else {
    thigh_ratio = height_ratio;
  }
  
  // Calculate and apply measurements
  for (var i=0; i<param.length; i++) {
    var params = param[i];
    var default_value = params.default;
    var input = $("#" + params.name).val();
    var value = parseInt(input) * cm;
    var height = (((height1 * 12) + height2) * cm);
  
    if (i == 0) { // height
      if (height_ratio != '1') {
        updateMeasurements(params.name, height / scaleModel);
      } else {
        updateMeasurements(params.name, params.default / scaleModel);
      }  
    } else if (i == 6) { // forearm
      value = params.default * bicep_ratio;
      value = Math.round(value * 100) / 100;      
      
      updateMeasurements(params.name, value / scaleModel);
    } else if (i == 16) { // calf
      value = params.default * thigh_ratio;
      value = Math.round(value * 100) / 100;   
      
      updateMeasurements(params.name, value / scaleModel);
    } else {
    
      if (input != '') {
        updateMeasurements(params.name, value / scaleModel);
      } else {
        updateMeasurements(params.name, (params.default * height_ratio) / scaleModel);
      }
      
    }
  }
}


//---------------------------------------------
// Main function
//---------------------------------------------

(function() {

  var scaleModel = 10;  // This depends on the ratio of measurements to model size

  loadSceneData(gender);
  readPoseParameters(gender, scaleModel);
  displayScene();
  
  $("#savebtn").click(function(event) {
    updateChanges(gender, scaleModel);
  });

})();