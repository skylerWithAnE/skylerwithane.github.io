var World = {
    loaded: false,
    occluderCenterZ: -0.12,
    drawables: [],

    init: function initFn() {
        World.createOccluder();
        World.createCones();
        World.createTracker();
    },

    createOccluder: function createOccluderFn() {
        var occluderScale = 10;

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
        var frontLeftCone = World.getCone(0.05, 0.1, 0.0);//(-0.04, -0.012, -2.5);
        World.drawables.push(frontLeftCone);

    },

    getCone: function getConeFn(positionX, positionY, positionZ) {
        var coneScale = .06;

        return new AR.Model("assets/box5.wt3", {
            scale: {
                x: .05,
                y: .3,
                z: .3
            },
            translate: {
//                x: -0.25,
//                z: -0.3
                x: positionX,
                y: positionY,
                z: positionZ
            },
            rotate: {
                x: 0,
                y: 0
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
                "<div" + cssDivLeft + ">Scan R2:</div>" +
                "<div" + cssDivRight + "><img src='assets/r2_thumb.png'></img></div>";
        }
    }
};

World.init();