// John Amanatides, Sept 2017
// interactive webGL program that plays with the camera position

/**
* @author(s)
* Edwin Gonzalez Dos Santos - edwin96 - 214158893
* Daniel Diep - dand96 - 213684667
*/

var canvas;
var gl;
var program;

window.onload = init;

var modelViewMatrix, eyeMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

var screenWidth, screenHeight, aspectRatio, oScreenWidth, oScreenHeight;
var middleX, middleY;

var gridSize = 10;

var vPosition;
var objectColor;
var isWireFrame;

function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    //  Configure WebGL
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height);
    gl.clearColor( 0.6, 0.6, 0.6, 1.6 );
	gl.enable(gl.DEPTH_TEST);
    

    screenWidth = canvas.width;
    screenHeight = canvas.height;
	oScreenWidth = screenWidth;
    oScreenHeight = screenHeight;
    middleX = screenWidth/2;
    middleY = screenHeight/2;
    aspectRatio = screenWidth/screenHeight;
    //  Load shaders 
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram(program);
    
    vPosition = gl.getAttribLocation(program, "vPosition");
    objectColor = gl.getUniformLocation(program, "objectColor");
    
     // configure matrices
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    
    // initialize model
    initGrid(gridSize);
    initScene();
    initCamera();

	// start listening to mouse	
	canvas.addEventListener('mousedown', function(evt) {
		var rect = canvas.getBoundingClientRect()
		var x = evt.clientX-rect.left;
		var y = evt.clientY-rect.top;
		isRightMouse = (evt.which == 3);
		mouseButtonDown(x,y);
	})
	canvas.addEventListener('mouseup', function(evt) {
		var rect = canvas.getBoundingClientRect()
		var x = evt.clientX-rect.left;
		var y = evt.clientY-rect.top;
		mouseButtonUp(x,y);
	})
	canvas.addEventListener('mousemove', function(evt) {
		var rect = canvas.getBoundingClientRect()
		var x = evt.clientX-rect.left;
		var y = evt.clientY-rect.top;
		mouseMove(x,y);
	})
	//listen to scrollwheel
	canvas.addEventListener('wheel', function(evt){
		if(evt.deltaY > 0)
		{
			scrollWheelZoom(true);
		}else
		{
			scrollWheelZoom(false);
		}
	})
	
	window.addEventListener('resize', resizeCanvas, false);
	function resizeCanvas(){
		if(window.innerWidth <= oScreenWidth){
			screenWidth = window.innerWidth;
		}
		if(window.innerHeight <= oScreenHeight){
			screenHeight = window.innerHeight;
			canvas.height = window.innerHeight;
		}
		if(window.innerWidth > oScreenWidth){
			screenWidth = oScreenWidth;
		}
		if(window.innerHeight > oScreenHeight){
			screenHeight = oScreenHeight;
			canvas.heigth = oScreenHeight;
		}
		middleX = screenWidth / 2;
		middleY = screenHeight / 2;
		aspectRatio = screenWidth / screenHeight; //starts at 1.5 or 9:6
		//console.log(aspectRatio);
	}

	canvas.addEventListener('contextmenu', event => event.preventDefault());
    render();
};

function render()
{
     gl.clear(gl.COLOR_BUFFER_BIT);  
     
	 computeCameraOrientation(); 
	 // size orthographic views
	 var range= gridSize*aspectRatio + 1;
     projectionMatrix = ortho(-gridSize*aspectRatio, gridSize*aspectRatio,
     					-gridSize, gridSize, -gridSize*aspectRatio, gridSize*aspectRatio);
	 
     // draw XY ortho in top-left quadrant
     gl.viewport(0, middleY, middleX, middleY);
     eyeMatrix = lookAt(vec3(0,0,0), vec3(0,0,-1), vec3(0, 1, 0));
     setMatricies();
     drawGrid('XY', range);
     drawCameraControls();
	 isWireFrame = true;
     drawScene(isWireFrame);

     
     // draw xz ortho in bottom left quadrant 
     gl.viewport(0, 0, middleX, middleY);
     eyeMatrix = lookAt(vec3(0, 0, 0), vec3(0, -1, 0), vec3(0, 0, -1));
     setMatricies();
     drawGrid('XZ', range);
     drawCameraControls();
	 gl.clear(gl.DEPTH_BUFFER_BIT);
	 isWireFrame = true;
     drawScene(isWireFrame);
     
     // draw yz ortho in bottom right quadrant 
     gl.viewport(middleX, 0, middleX, middleY);
     eyeMatrix = lookAt(vec3(0,0,0), vec3(-1,0,0), vec3(0, 1, 0));
     setMatricies();
     drawGrid('YZ', range);
     drawCameraControls();
	 isWireFrame = true;
     drawScene(isWireFrame);
     
     // draw perspective view in top right quadrant
     gl.viewport(middleX, middleY, middleX, middleY);
     projectionMatrix = perspective(fovY, aspectRatio, near, far);
     eyeMatrix = lookAt(cameraLookFrom, cameraLookAt, cameraLookUp);
	 setMatricies();
	 isWireFrame = false;
     drawScene(isWireFrame);
	 gl.clear(gl.DEPTH_BUFFER_BIT); //Resets the DEPTH_BUFFER_BIT so that the quadrants in the line will show
	 
     // draw quadrant boundaries
     gl.viewport(0, 0, screenWidth, screenHeight);
     projectionMatrix = ortho(-1, 1, -1, 1, -1, 1);
	 eyeMatrix = lookAt(vec3(0,0,0.5), vec3(0,0,0), vec3(0, 1, 0));
     setMatricies();
     drawQuadrantBoundaries();
     
    //document.getElementById("ScreenInfo").innerHTML = "you can print debugging info here";
     
    window.requestAnimationFrame(render);
}
function setMatricies() {
	modelViewMatrix = eyeMatrix;
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
}