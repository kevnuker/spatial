var turbineClass = function() {

    // public properties
    var scope = this;
    this.stop = false;
    this.state = 'off';
    this.time = 0;
    this.timerStart = 0;

    this.init = function() {
        // RENDERER
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;
        // SCENE AND CAMERA
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.set(190, 120, 340);

        // GIMBAL MOUSE CONTROL
        this.controls = new THREE.TrackballControls(this.camera);
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.2;
        this.controls.panSpeed = 0.8;
        this.controls.noZoom = false;
        this.controls.noPan = false;
        this.controls.staticMoving = true;
        this.controls.dynamicDampingFactor = 0.3;
        this.controls.addEventListener('change', this.renderOFF.bind(this, scope));

        // LIGHTS
        var ambient = new THREE.AmbientLight(0xffffff, 0.1);
        this.scene.add(ambient);
        this.scene.background = new THREE.Color(0x7ec0ee);

        //TURBINE
        var geometry1 = new THREE.BoxGeometry(5, 50, 5);
        var mesh1 = new THREE.Mesh(geometry1);
        mesh1.position.set(0, 20, 0);
        mesh1.castShadow = true;

        var geometry2 = new THREE.SphereGeometry(7, 7, 7);
        var mesh2 = new THREE.Mesh(geometry2);
        mesh2.position.set(0, 0, 0);
        mesh2.castShadow = true;

        var geometry3 = new THREE.BoxGeometry(5, 50, 5);
        var mesh3 = new THREE.Mesh(geometry3);
        mesh3.position.set(-25, -15, 0);
        mesh3.rotateZ(Math.PI / 1.5);
        mesh3.castShadow = true;

        var geometry4 = new THREE.BoxGeometry(5, 50, 5);
        var mesh4 = new THREE.Mesh(geometry4);
        mesh4.position.set(20, -10, 0);
        mesh4.rotateZ(-Math.PI / 1.5);
        mesh4.castShadow = true;

        var singleGeometry = new THREE.Geometry();
        mesh1.updateMatrix();
        singleGeometry.merge(mesh1.geometry, mesh1.matrix);

        mesh2.updateMatrix();
        singleGeometry.merge(mesh2.geometry, mesh2.matrix);

        mesh3.updateMatrix();
        singleGeometry.merge(mesh3.geometry, mesh3.matrix);

        mesh4.updateMatrix(); // as needed
        singleGeometry.merge(mesh4.geometry, mesh4.matrix);

        var material = new THREE.MeshPhongMaterial({
            color: 0xFF0000
        });
        this.mesh = new THREE.Mesh(singleGeometry, material);
        this.scene.add(this.mesh);

        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.renderOFF(scope);
    }

    this.onWindowResize = function() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.controls.handleResize();
        this.renderOFF(this);
    }

    this.animate = function() {
        requestAnimationFrame(this.animate.bind(this));
        this.controls.update();
    }

    this.renderOFF = function(scope) {
        this.mesh.rotation.z += 0;
        scope.renderer.render(scope.scene, scope.camera);
    }

    this.renderON = function(scope) {
        requestAnimationFrame(this.renderON.bind(this));
        if (!this.stop) {
            this.mesh.rotation.z += .01;
        }
        this.renderer.render(this.scene, this.camera);
    }

}

var turbine = new turbineClass();

turbine.init();
turbine.animate();

function callTurbineFrame(data) {

    if ('on' === data) {
        if (turbine.stop) {
            turbine.stop = false;
        }
        if (turbine.state === 'off') {
            turbine.renderON();
            turbine.state = 'on';
        }
        turbine.timerStart = new Date();
    }
    if ('off' === data) {
        turbine.stop = true;
        if (turbine.timerStart === 0) {
            return;
        }
        if (turbine.timerStart !== 0) {
            turbine.time = turbine.time + (new Date() - turbine.timerStart);
        }
        turbine.timerStart = 0;
        postMessage();
    }
}

function postMessage() {
    var switchFrame = this.parent.frames[0];
    switchFrame.callSwitchFrame(turbine.time);
}