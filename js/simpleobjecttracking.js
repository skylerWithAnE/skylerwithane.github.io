var World = {
    loaded: false,
    occluderCenterZ: -0.12,
    drawables: [],
    tX: 0.0,
    tY: 0.0,
    tZ: 0.0,
    rX: 0.0,
    rY: 0.0,
    rZ: 0.0,
    sX: 1.0,
    sY: 1.0,
    sZ: 1.0,

    init: function initFn() {
        
        var urlString = document.URL;
        var queryString = urlString ? urlString.split('?')[1] : window.location.search.slice(1);
        if (queryString) {
            queryString = queryString.split('#')[0];
            var args = queryString.split('&');
            World.tX = parseFloat(args[0].split("=")[1]);
            World.tY = parseFloat(args[1].split("=")[1]);
            World.tZ = parseFloat(args[2].split("=")[1]);
            World.rX = parseFloat(args[3].split("=")[1]);
            World.rY = parseFloat(args[4].split("=")[1]);
            World.rZ = parseFloat(args[5].split("=")[1]);
            World.sX = parseFloat(args[6].split("=")[1]);
            World.sY = parseFloat(args[7].split("=")[1]);
            World.sZ = parseFloat(args[8].split("=")[1]);
        }
        
        World.createOccluder();
        World.createCones();
        World.createTracker();

    },

    createOccluder: function createOccluderFn() {
        var occluderScale = 0.00;

        this.firetruckOccluder = new AR.Occluder("assets/firetruck_occluder.wt3", {
            onLoaded: this.loadingStep,
            scale: {
                x: occluderScale,
                y: occluderScale,
                z: occluderScale
            },
            translate: {
                x: -0.25,
                z: -0.3
            },
            rotate: {
                x: 180
            }
        });
        World.drawables.push(this.firetruckOccluder);
    },

    createCones: function createConesFn() {
        var coneDistance = 1.0;

//        var frontLeftCone = World.getCone(-coneDistance, 0.0, World.occluderCenterZ + coneDistance);
//        World.drawables.push(frontLeftCone);
//
//        var backLeftCone = World.getCone( coneDistance, 0.0, World.occluderCenterZ + coneDistance);
//        World.drawables.push(backLeftCone);

        var backRightCone = World.getCone( World.tX, World.tY, World.tZ);
        World.drawables.push(backRightCone);

//        var frontRightCone = World.getCone(-coneDistance, 0.0, World.occluderCenterZ - coneDistance);
//        World.drawables.push(frontRightCone);
    },

    getCone: function getConeFn(positionX, positionY, positionZ) {
        var coneScale = 0.01;

        return new AR.Model("assets/box5.wt3", {
            scale: {
                x: World.sX,
                y: World.sY,
                z: World.sZ
            },
            translate: {
                x: positionX,
                y: positionY,
                z: positionZ
            },
            rotate: {   
                x: World.rX,
                y: World.rY,
                z: World.rZ
            }
        });
    },

    createTracker: function createTrackerFn() {
        this.targetCollectionResource = new AR.TargetCollectionResource("assets/tracker3.wto", {
        });

        this.tracker = new AR.ObjectTracker(this.targetCollectionResource, {
            onError: function(errorMessage) {
                alert(errorMessage);
            }
        });
        
        this.objectTrackable = new AR.ObjectTrackable(this.tracker, "*", {
            drawables: {
                cam: World.drawables
            },
            onObjectRecognized: this.objectRecognized,
            onObjectLost: this.objectLost,
            onError: function(errorMessage) {
                alert(errorMessage);
            }
        });
    },

    objectRecognized: function objectRecognizedFn() {
        World.removeLoadingBar();
        World.setAugmentationsEnabled(true);
    },

    objectLost: function objectLostFn() {
        World.setAugmentationsEnabled(false);
    },

    setAugmentationsEnabled: function setAugmentationsEnabledFn(enabled) {
        for (var i = 0; i < World.drawables.length; i++) {
            World.drawables[i].enabled = enabled;
        }
    },

    removeLoadingBar: function removeLoadingBarFn() {
        if (!World.loaded && World.firetruckOccluder.isLoaded()) {
            var e = document.getElementById('loadingMessage');
            e.parentElement.removeChild(e);
            World.loaded = true;
        }
    },

    loadingStep: function loadingStepFn() {
        if (World.firetruckOccluder.isLoaded()) {
            var cssDivLeft = " style='display: table-cell;vertical-align: middle; text-align: right; width: 50%; padding-right: 15px;'";
            var cssDivRight = " style='display: table-cell;vertical-align: middle; text-align: left;'";
            var urlS = document.URL;
            document.getElementById('loadingMessage').innerHTML =
            "<div" + cssDivLeft + urlS
                // "<div" + cssDivLeft + ">Position: " + World.tX.toString(); ", " + World.tY.toString(); ", " + World.tZ.toString(); + 
                // "<br>Rotation: " + World.rX.toString(); ", " + World.rY.toString(); ", " + World.rZ.toString(); + 
                // "<br>Scale: "+ World.tX.toString(); ", " + World.tY.toString(); ", " + World.tZ.toString(); 
                + "</div>" +
                "<div" + cssDivRight + "><img src='assets/r2_thumb.png'></img></div>";
        }
    }
};

World.init();