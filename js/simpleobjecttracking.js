var World = {
    loaded: false,
    occluderCenterZ: -0.12,
    drawables: [],

    init: function initFn() {
        var urlString = Document.URL;
        var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
        var tX = 0;
        var tY = 0;
        var tZ = 0;
        var rX = 0;
        var rY = 0;
        var rZ = 0;
        var sX = 1;
        var sY = 1;
        var sZ = 1;
        // if (queryString) {
        //     queryString = queryString.split('#')[0];
        //     var args = queryString.split('&');
        //     tX = parseInt(args[0].split("=")[1]);
        //     tY = parseInt(args[1].split("=")[1]);
        //     tZ = parseInt(args[2].split("=")[1]);
        //     rX = parseInt(args[3].split("=")[1]);
        //     rY = parseInt(args[4].split("=")[1]);
        //     rZ = parseInt(args[5].split("=")[1]);
        //     sX = parseInt(args[6].split("=")[1]);
        //     sY = parseInt(args[7].split("=")[1]);
        //     sZ = parseInt(args[8].split("=")[1]);
        // }
        
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
            document.getElementById('loadingMessage').innerHTML =
                "<div" + cssDivLeft + ">Scan R2(web: 2):</div>" +
                "<div" + cssDivRight + "><img src='assets/r2_thumb.png'></img></div>";
        }
    }
};

World.init();