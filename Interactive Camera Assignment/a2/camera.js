/**
* @author(s)
* Edwin Gonzalez Dos Santos - edwin96 - 214158893
* Daniel Diep - dand96 - 213684667
*/

var cameraLookFrom = vec3(5, 3, 8);
var cameraLookAt = vec3(0, 0, 0);
var cameraLookUp = vec3(0, 2, 0);
var fovY = 50;
var near = .1;
var far = 100;

var cameraVerticies;
var cameraBufferID;

var isMouseClicked;
var isMouseClicked2;

var mouseStartingPosition;
var mouseCurrentPosition;
var mouseEndingPosition;
var isRightMouse;

var isLookAt = false;
var isLookFrom = false;
var isLookUp= false;
var isTopRight;
var xPoint;
var yPoint;
var zPoint;

function mouseButtonDown(x, y)
{
	isMouseClicked = true;
	isMouseClicked2 = true;
	mouseStartingPosition = vec2(x,y);
	//Top left quadrant
	if((mouseStartingPosition[0] < middleX) && (mouseStartingPosition[1] < middleY)) //XY plane, change xy top left
	{		
		//Look at
		xPoint = middleX/2 + (cameraLookAt[0] * 15) - mouseStartingPosition[0]; 
		yPoint = middleY/2 + (cameraLookAt[1] * -15) - mouseStartingPosition[1];
		if((Math.abs(xPoint) < 5) && ((Math.abs(yPoint) < 5)))
		{
			isLookAt = true;
			return;
		}
		//Look From
		xPoint = middleX/2 + (cameraLookFrom[0] * 15) - mouseStartingPosition[0];
		yPoint = middleY/2 + (cameraLookFrom[1] * -15) - mouseStartingPosition[1];
		if((Math.abs(xPoint) < 5) && ((Math.abs(yPoint) < 5)))
		{
			isLookFrom = true;
			return;
		}
		//Look up
		xPoint += (cameraLookUp[0] * 15);
		yPoint += (cameraLookUp[1] * -15);
		if((Math.abs(xPoint) < 5) && ((Math.abs(yPoint) < 5)))
		{
			isLookUp = true;
			return;
		}
		
	}
	//Bottom right quadrant
	if((mouseStartingPosition[0] > middleX) && (mouseStartingPosition[1] > middleY))
	{
		//Look at
		zPoint = middleX * 1.5 + (cameraLookAt[2] * -15) - mouseCurrentPosition[0];
		yPoint = middleY * 1.5 + (cameraLookAt[1] * -15) - mouseCurrentPosition[1];
		if((Math.abs(zPoint) < 5) && Math.abs(yPoint < 5))
		{
			isLookAt = true;
			return;
		}
		//Look From
		zPoint = middleX * 1.5 + (cameraLookFrom[2] * -15) - mouseCurrentPosition[0];
		yPoint = middleY * 1.5 + (cameraLookFrom[1] * -15) - mouseCurrentPosition[1];
		if((Math.abs(zPoint) < 5) && Math.abs(yPoint < 5))
		{
			isLookFrom = true;
			return;
		}
		//Look up
		zPoint += (cameraLookUp[2] * -15);
		yPoint += (cameraLookUp[1] * -15);
		if((Math.abs(zPoint) < 5) && Math.abs(yPoint < 5))
		{
			isLookUp = true; 
			return;
		}
	}
	
	//Bottom left
	if((mouseStartingPosition[0] < middleX) && (mouseStartingPosition[1] > middleY))
	{
	    //Look From
		xPoint = middleX/2 + (cameraLookFrom[0] * 15) - mouseStartingPosition[0];
		zPoint = middleY* 1.5 + (cameraLookFrom[2] * 15) - mouseStartingPosition[1];
		if((Math.abs(zPoint) < 5) && (Math.abs(xPoint < 5)))
		{
			isLookFrom = true;
			return;
		}
		//Look at
		xPoint = middleX/2 + (cameraLookAt[0] * 15) - mouseStartingPosition[0];
		zPoint = middleY * 1.5 + (cameraLookAt[2] * 15) - mouseStartingPosition[1];		
		if((Math.abs(zPoint) < 5) && (Math.abs(xPoint) < 5))
		{
			isLookAt = true;
			return;
		}
	}
}

function mouseButtonUp(x,y)
{
	isMouseClicked = false;
	isMouseClicked2 = false;
	isLookAt = false;
	isLookFrom = false
	isLookUp = false;

}

function mouseMove(x,y)
{
	mouseCurrentPosition = vec2(x,y);
	//Know how much to change
	var xChange = (mouseStartingPosition[0] - mouseCurrentPosition[0]);
	var yChange = (mouseStartingPosition[1] - mouseCurrentPosition[1]);
	//Controls panning along the x and y axes

	if(isMouseClicked && x >= (canvas.width * 1/2) && x < (canvas.width -1) && y >= 1 && y <= (canvas.height * 1/2))
	{
		if(isRightMouse)
		{
			//Zooming out
			cameraLookFrom[2] += yChange * 0.015;
		}else{
			
		xRotation = toRadians(xChange) * 0.01;
		yRotation = toRadians(yChange)* 0.01;
		var oldLookAt = vec3(cameraLookAt[0],cameraLookAt[1],cameraLookAt[2]);
		
		//Set look at to origin
		cameraLookAt[0] = 0;
		cameraLookAt[1] = 0;
		cameraLookAt[2] = 0;
		
		var oldLookFrom = vec3(cameraLookFrom[0],cameraLookFrom[1],cameraLookFrom[2]);
		cameraLookFrom[0] = oldLookFrom[0] * Math.cos(xRotation) - oldLookFrom[2] * Math.sin(xRotation);
		cameraLookFrom[2] = oldLookFrom[0] * Math.sin(xRotation) + oldLookFrom[2] * Math.cos(xRotation);
	
		var oldLookFrom2 = vec3(cameraLookFrom[0],cameraLookFrom[1],cameraLookFrom[2]);
		cameraLookFrom[1] = oldLookFrom2[1] * Math.cos(yRotation) - oldLookFrom2[2] * Math.sin(yRotation);
		cameraLookFrom[2] = oldLookFrom2[1] * Math.sin(yRotation) + oldLookFrom2[2] * Math.cos(yRotation);
		
		//Set camera to look at original point
		cameraLookAt[0] = oldLookAt[0];
		cameraLookAt[1] = oldLookAt[1];
		cameraLookAt[2] = oldLookAt[2];
		
		}
	}else
	{
		isMouseClicked = false;
	}
		document.getElementById("ScreenInfo").innerHTML = mouseCurrentPosition[0] + "," + mouseCurrentPosition[1];

}

function initCamera()
{
	// your code goes here
	cameraBufferID = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cameraBufferID);
	gl.bufferData(gl.ARRAY_BUFFER, 16*64, gl.STATIC_DRAW);
}

function computeCameraOrientation() //1 unit on eye matrix = 15 pixels
{
	// your code goes here
	if(isMouseClicked2)
	{
		if((mouseCurrentPosition[0] < middleX) && (mouseCurrentPosition[1] < middleY)) //XY plane, change xy
		{	
			if(isLookAt){
				positionDeltaX = mouseCurrentPosition[0] - mouseStartingPosition[0];
				positionDeltaY = mouseCurrentPosition[1] - mouseStartingPosition[1];
				cameraLookAt = add(cameraLookAt,vec3(positionDeltaX * .0019,positionDeltaY * -.0015, 0));				
			}else if(isLookUp){
				positionDeltaX = mouseCurrentPosition[0] - mouseStartingPosition[0]; 
				positionDeltaY = mouseCurrentPosition[1] - mouseStartingPosition[1]; 
				cameraLookUp = add(cameraLookUp,vec3(positionDeltaX * .0015,positionDeltaY * -.0015, 0));
			}else if(isLookFrom){
				positionDeltaX = mouseCurrentPosition[0] - mouseStartingPosition[0];
				positionDeltaY = mouseCurrentPosition[1] - mouseStartingPosition[1];
				cameraLookFrom = add(cameraLookFrom,vec3(positionDeltaX * .0019,positionDeltaY * -.0019, 0));
			}
		}
		
		else if((mouseCurrentPosition[0] > middleX) && (mouseCurrentPosition[1] < middleY)) 
		{
			//Handled seperately
		}
		
		else if((mouseCurrentPosition[0] < middleX) && (mouseCurrentPosition[1] > middleY)) //ZX plane, change zx
		{
			
			if(isLookFrom){
				//console.log("Bottom left: " + mouseCurrentPosition);
				positionDeltaX = mouseCurrentPosition[0] - mouseStartingPosition[0];
				positionDeltaZ = mouseCurrentPosition[1] - mouseStartingPosition[1];
				cameraLookFrom = add(cameraLookFrom,vec3(positionDeltaX * .0019, 0, positionDeltaZ * .0015,));
			}else if(isLookAt){
				//console.log("Bottom left: " + mouseCurrentPosition);
				positionDeltaX = mouseCurrentPosition[0] - mouseStartingPosition[0];
				positionDeltaZ = mouseCurrentPosition[1] - mouseStartingPosition[1];
				cameraLookAt = add(cameraLookAt,vec3(positionDeltaX * .0019, 0, positionDeltaZ * .0015,));
			}
		}
		
		else if((mouseCurrentPosition[0] > middleX) && (mouseCurrentPosition[1] > middleY)) //YZ plane, change yz (note: going left of plane = +z)
		{
			if(isLookAt){
				positionDeltaY = mouseCurrentPosition[1] - mouseStartingPosition[1];
				positionDeltaZ = mouseCurrentPosition[0] - mouseStartingPosition[0];
				cameraLookAt = add(cameraLookAt,vec3(0, positionDeltaY * -.0019 , positionDeltaZ * -.0015,));
			}else if(isLookFrom){
				positionDeltaY = mouseCurrentPosition[1] - mouseStartingPosition[1];
				positionDeltaZ = mouseCurrentPosition[0] - mouseStartingPosition[0];
				cameraLookFrom = add(cameraLookFrom,vec3(0, positionDeltaY * -.0019 , positionDeltaZ * -.0015,));
			}else if(isLookUp){
				positionDeltaY = mouseCurrentPosition[1] - mouseStartingPosition[1];
				positionDeltaZ = mouseCurrentPosition[0] - mouseStartingPosition[0];
				cameraLookUp = add(cameraLookUp,vec3(0, positionDeltaY * -.0019 , positionDeltaZ * -.0015,));
			}
			
		}
		else
		{
			//console.log("Unknown");
		}
	}
}

function drawCameraControls()
{
	// your code goes here
	cameraVerticies = [];
	gl.uniform4fv(objectColor, white);
	cameraVerticies.push(vec4(cameraLookAt));
	cameraVerticies.push(vec4(cameraLookFrom)); //test for changes to lookFrom
	cameraVerticies.push(vec4(add(cameraLookUp,cameraLookFrom)));
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(cameraVerticies));
	gl.drawArrays(gl.LINE_STRIP, 0, cameraVerticies.length);
}

function scrollWheelZoom(isZoomUp){
	if(fovY <= 10) isZoomUp = true;
	if(fovY >= 170) isZoomUp = false; 
	((isZoomUp)? fovY += 5 : fovY -= 5);
}