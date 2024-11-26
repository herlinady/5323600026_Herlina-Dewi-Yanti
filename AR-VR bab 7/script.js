import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r118/three.module.min.js";

// global scene values
let btn, gl, glCanvas, camera, scene, renderer, cube;

// global xr value
let xrSession = null;

function loadScene() {
    // setup the WebGL context and the components of a Three.js scene
    glCanvas = document.createElement('canvas');
    gl = glCanvas.getContext('webgl2', { antialias: true });

    if (!gl) {
        console.error("WebGL2 not supported in this browser.");
        return;
    }

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
    camera.position.set(0, 0, 1);
    scene = new THREE.Scene();

    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const material = new THREE.MeshPhongMaterial({ color: 0x89CFF0 });
    cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, -0.5);
    scene.add(cube);

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set(0.5, 1, 0.25);
    scene.add(light);

    renderer = new THREE.WebGLRenderer({
        canvas: glCanvas,
        context: gl
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.setReferenceSpaceType('local');
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);
}

function init() {
    // kickoff the execution of the script
    navigator.xr.isSessionSupported('immersive-ar')
        .then((supported) => {
            if (supported) {
                // create button element to advertise XR
                btn = document.createElement("button");
                btn.innerHTML = "Enter XR";
                btn.style.position = "absolute";
                btn.style.top = "20px";
                btn.style.zIndex = "999";

                // add 'click' event listener to button
                btn.addEventListener('click', onRequestSession);
                document.body.appendChild(btn);
            } else {
                console.log('Immersive AR not supported');
            }
        })
        .catch((reason) => {
            console.log('WebXR not supported: ' + reason);
        });
}

function onRequestSession() {
    // handle the XR session request
    console.log('Requesting session');
    navigator.xr.requestSession('immersive-ar', { requiredFeatures: ['viewer', 'local'] })
        .then(onSessionStarted)
        .catch(reason => console.log('Request failed: ' + reason.message));
}

function onSessionStarted(session) {
    // handle the XR session once it has been created
    console.log('Starting session');

    btn.removeEventListener('click', onRequestSession);
    btn.addEventListener('click', endXRSession);
    btn.innerHTML = "STOP AR";
    xrSession = session;

    setupWebGLLayer()
        .then(() => {
            renderer.xr.setSession(xrSession);
            animate();
        })
        .catch(reason => console.error('Failed to set up WebGL Layer: ' + reason));
}

function setupWebGLLayer() {
    // connect the WebGL context to the XR session
    return gl.makeXRCompatible().then(() => {
        xrSession.updateRenderState({ baseLayer: new XRWebGLLayer(xrSession, gl) });
    });
}

function animate() {
    // begin the animation loop
    renderer.setAnimationLoop(render);
}

function render(time) {
    // issue the draw command to the GPU
    renderer.render(scene, camera);
}

function endXRSession() {
    // terminate the XR session
    if (xrSession) {
        console.log('Ending session...');
        xrSession.end().then(onSessionEnd);
    }
}

function onSessionEnd() {
    // handle the 'end' event of the XR session
    xrSession = null;
    console.log('Session ended');
    btn.innerHTML = "START AR";
    btn.removeEventListener('click', endXRSession);
    btn.addEventListener('click', onRequestSession);
}

window.onload = () => {
    loadScene();
    init();
};