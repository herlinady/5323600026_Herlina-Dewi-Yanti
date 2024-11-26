import * as THREE from './modules/three.module.js';

main();

function main() {
    const textureLoader = new THREE.TextureLoader();
    // create context
    const canvas = document.querySelector("#c");
    const gl = new THREE.WebGLRenderer({
        canvas,
        antialias: true
    });

    // create camera
    const angleOfView = 60;
    const aspectRatio = canvas.clientWidth / canvas.clientHeight;
    const nearPlane = 0.5;
    const farPlane = 1000;
    const camera = new THREE.PerspectiveCamera(
        angleOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );
    camera.position.set(0, 8, 30);

    // create the scene
    const scene = new THREE.Scene();
    scene.background = new textureLoader.load("textures/pebbies_gray.png");
    const fog = new THREE.Fog("silver", 1,90);
    scene.fog = fog;

    // GEOMETRY
    // create the cube
    const cubeSize = 5;
    const cubeGeometry = new THREE.BoxGeometry(
        cubeSize,
        cubeSize,
        cubeSize
    );  

    // Create the Sphere
    const sphereRadius = 4;
    const sphereWidthSegments = 33;
    const sphereHeightSegments = 20;
    const sphereGeometry = new THREE.SphereGeometry(
        sphereRadius,
        sphereWidthSegments,
        sphereHeightSegments
    );

    // Create the upright plane
    const planeWidth = 380;
    const planeHeight =  128;
    const planeGeometry = new THREE.PlaneGeometry(
        planeWidth,
        planeHeight
    );

    // MATERIALS

    const cubeNormalMap = textureLoader.load('textures/rubik.webp');
    //const cubeTextureMap= textureLoader.load ('textures/TilesMosaicYubi003_GLOSS_2K.png');
    cubeNormalMap.wrapS = THREE.RepeatWrapping;
    cubeNormalMap.wrapT = THREE.RepeatWrapping;
    const  cubeMaterial = new THREE.MeshStandardMaterial({
        color: 'gold',
        //map:cubeTextureMap,
        normalMap: cubeNormalMap
    });

    const sphereNormalMap = textureLoader.load('textures/TilesMosaicYubi003_NRM_2K.png');
    const sphereTextureMap= textureLoader.load ('textures/TilesMosaicYubi003_COL_2K.png');
    sphereNormalMap.wrapS = THREE.RepeatWrapping;
    sphereNormalMap.wrapT = THREE.RepeatWrapping;
    const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 'tan',
        map:sphereTextureMap,
        normalMap: sphereNormalMap
    });

    
    const planeTextureMap = textureLoader.load('textures/nh.webp');
    planeTextureMap.wrapS = THREE.RepeatWrapping;
    planeTextureMap.wrapT = THREE.RepeatWrapping;
    planeTextureMap.repeat.set(12, 16);
    //planeTextureMap.magFilter = THREE.NearestFilter;
    planeTextureMap.minFilter = THREE.NearestFilter;
    planeTextureMap.anisotropy = gl.getMaxAnisotropy();
    const planeNorm = textureLoader.load('textures/pebbles_normal.png');
    planeNorm.wrapS = THREE.RepeatWrapping;
    planeNorm.wrapT = THREE.RepeatWrapping;
    planeNorm.minFilter = THREE.NearestFilter;
    planeNorm.repeat.set(16, 16);
    const planeMaterial = new THREE.MeshStandardMaterial({
        map: planeTextureMap,
        side: THREE.DoubleSide,
        normalMap: planeNorm 
    });

    // MESHES
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(cubeSize + 1, cubeSize + 1, 0);
    scene.add(cube);

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
    scene.add(sphere);

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2;
    //scene.add(plane);

    //LIGHTS
    const color = 0xffffff;
    const intensity = .7;
    const light = new THREE.DirectionalLight(color, intensity);
    light.target = plane;
    light.position.set(0, 80, 30);
    scene.add(light);
    scene.add(light.target);

    const ambientColor = 0xffffff;
    const ambientIntensity = 0.2;
    const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
    scene.add(ambientLight);

    // DRAW
    function draw(time){
        time *= 0.001;

        if (resizeGLToDisplaySize(gl)) {
            const canvas = gl.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        
        cube.rotation.x += 0.02;
        cube.rotation.y += 0.02;
        cube.rotation.z += 0.02;

        sphere.rotation.x -= 0.02;
        sphere.rotation.y -= 0.02;
        sphere.rotation.y -= 0.021;

        light.position.x = 1000*Math.cos(time);
        light.position.y = 1000*Math.sin(time);
        gl.render(scene, camera);
        requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
}

// UPDATE RESIZE
function resizeGLToDisplaySize(gl) {
    const canvas = gl.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width != width || canvas.height != height;
    if (needResize) {
        gl.setSize(width, height, false);
    }
    return needResize;
}