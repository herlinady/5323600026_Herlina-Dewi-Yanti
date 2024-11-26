main();
function main() {
    /*========== Create a WebGL Context ==========*/
    const canvas = document.querySelector("#c");
    const gl = canvas.getContext('webgl');
    if (!gl) {
        console.log('WebGL unavailable');
    } else {
        console.log('WebGL is good to go');
    }

    /*========== Define and Store the Geometry==========*/
    const squares = [
        // Front face
        -0.3, -0.3, -0.3, // Titik 1
        0.3, -0.3, -0.3, // Titik 2
        0.3,  0.3, -0.3, // Titik 3
        -0.3, -0.3, -0.3, // Titik 4
        -0.3,  0.3, -0.3, // Titik 5
        0.3,  0.3, -0.3, // Titik 6

        // Back face
        -0.2, -0.2, 0.3, // Titik 1
        0.4, -0.2, 0.3, // Titik 2
        0.4,  0.4, 0.3, // Titik 3
        -0.2, -0.2, 0.3, // Titik 4
        -0.2,  0.4, 0.3, // Titik 5
        0.4,  0.4, 0.3, // Titik 6

        // Top face
        -0.3,  0.3, -0.3, // Titik 1
        0.3,  0.3, -0.3, // Titik 2
        -0.2,  0.4,  0.3, // Titik 3
        0.4,  0.4,  0.3, // Titik 4
        0.3,  0.3, -0.3, // Titik 5
        -0.2,  0.4,  0.3, // Titik 6

        // Bottom face
        -0.3, -0.3, -0.3, // Titik 1
        0.3, -0.3, -0.3, // Titik 2
        0.4, -0.2, 0.3, // Titik 3
        -0.3, -0.3, -0.3, // Titik 4
        -0.2, -0.2, 0.3, // Titik 5
        0.4, -0.2, 0.3, // Titik 6
    ];

    // buffer
    const origBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, origBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squares), gl.STATIC_DRAW);

    /*====== Define front-face vertices ======*/
    const squareColors = [
        1.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,

        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,

        1.0, 1.0, 0.0, 1.0,
        1.0, 1.0, 0.0, 1.0,
        1.0, 1.0, 0.0, 1.0,
        1.0, 1.0, 0.0, 1.0,
        1.0, 1.0, 0.0, 1.0,
        1.0, 1.0, 0.0, 1.0,
    ];

    /*====== Define front-face buffer ======*/
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareColors), gl.STATIC_DRAW);


    /*========== Shaders ==========*/
    const vsSource = `
    attribute vec4 aPosition;
    attribute vec4 aVertexColor;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying lowp vec4 vColor;
    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aPosition;
        vColor = aVertexColor;
    }`;
    const fsSource = `
    varying lowp vec4 vColor;
    void main() {
        gl_FragColor = vColor;
    }`;


    /*====== Define shader source ======*/



    /*====== Create shaders ======*/
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vertexShader, vsSource);
    gl.shaderSource(fragmentShader, fsSource);

    /*====== Compile shaders ======*/
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(vertexShader));
        gl.deleteShader(vertexShader);
        return null;
    }
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(fragmentShader));
        gl.deleteShader(fragmentShader);
        return null;
    }

    /*====== Create shader program ======*/
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    /*====== Link shader program ======*/
    gl.linkProgram(program);
    gl.useProgram(program);

    // Initialize the then variable to track the previous time
    let then = 0;
    let cubeRotation = 0;

    function render(now) {
        now *= 0.001; // Convert milliseconds to seconds

        // Calculate deltaTime
        let deltaTime = now - then;
        then = now;

        const fieldOfView = 45 * Math.PI / 180; // in radians
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = mat4.create();
        // note: glmatrix.js always has the first argument
        // as the destination to receive the result.
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

        /*====== Connect the attribute with the vertex shader=======*/
        const posAttribLocation = gl.getAttribLocation(program, "aPosition");
        gl.bindBuffer(gl.ARRAY_BUFFER, origBuffer);
        gl.vertexAttribPointer(posAttribLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(posAttribLocation);

        const colorAttribLocation = gl.getAttribLocation(program, "aVertexColor");
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(colorAttribLocation, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(colorAttribLocation);

        // Get the uniform locations
        const modelViewMatrix = mat4.create();
        mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -5.0]); // Move the cube back
        mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation, [0, 1, 0]); // Rotate around the Y-axis

        // Set the uniform variables
        const modelViewMatrixLocation = gl.getUniformLocation(program, "uModelViewMatrix");
        gl.uniformMatrix4fv(modelViewMatrixLocation, false, modelViewMatrix);

        const projectionMatrixLocation = gl.getUniformLocation(program, "uProjectionMatrix");
        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);

        // Clear the canvas and draw
        gl.clearColor(1.0, 1.0, 1.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, squares.length / 3);

        // Update the cube rotation based on deltaTime
        cubeRotation += deltaTime; // Adjust the rotation speed as needed

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}