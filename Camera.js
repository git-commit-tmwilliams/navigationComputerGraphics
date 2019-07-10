//Dakota + Marleigh Lab 4

/**
 * Contains all of the parameters needed for controlling the camera.
 * @return {Camera}
 */
function Camera() {

    this.fov = 60;           // Field-of-view in Y direction angle (in degrees)
    this.zNear = 0.1;        // camera's far plane
    this.zFar = 500;         // camera's near plane

// Camera *initial* location and orientation parameters
    this.eye_start = vec4([0, 4, 25, 1]); // initial camera location (needed for reseting)   
    this.VPN = vec4([0, 0, 1, 0]);  // used to initialize uvn
    this.VUP = vec4([0, 1, 0, 0]);  // used to initialize uvn  

// Current camera location and orientation parameters
    this.eye = vec4(this.eye_start);     // camera location
    this.viewRotation;  // rotational part of matrix that transforms between World and Camera coord   

    this.calcUVN();  // initializes viewRotation
}

/**
 * Reset the camera location and orientation
 * @return none
 */
Camera.prototype.reset = function () {
    this.eye = vec4(this.eye_start);
    this.calcUVN();
};

/**
 * Calculate the *initial* viewRotation matrix of camera
 * based on VPN and VUP
 * @return none
 */
Camera.prototype.calcUVN = function () {

    var n = vec4(normalize(this.VPN, true));
	
    var uc = cross(this.VUP,n);
	uc.push(0);
    var u = vec4(normalize(uc, true));
	
    var vc = cross(n,u);
	vc.push(0);
	var v = vec4(normalize(vc, true));
	
    this.viewRotation = [
		u,
		v,
		n,
		vec4(0,0,0,1)];
    this.viewRotation.matrix = true;
};

/**
 * Calculate the camera's view matrix given the 
 * current eye and viewRotation
 * @return view matrix (mat_npc)
 */
Camera.prototype.calcViewMat = function () {

    var eyeTranslate = translate(-this.eye[0],-this.eye[1],-this.eye[2]);
    var mv = mult(this.viewRotation,eyeTranslate);
    return mv;
};

/** 
 * Calculate the camera's projection matrix. Here we 
 * use a perspective projection.
 * @return the projection matrix
 */
Camera.prototype.calcProjectionMat = function () {
    aspect = canvas.width / canvas.height;
    return perspective(this.fov, aspect, this.zNear, this.zFar);
};

/**
 * Update the camera's eye and viewRotation matrices 
 * based on the user's mouse actions
 * @return none
 */
Camera.prototype.motion = function () {

    switch (mouseState.action) {
        case mouseState.actionChoice.TUMBLE:  // left mouse button
            // amount of rotation around axes 
            var dy = -0.05 * mouseState.delx;  // angle around y due to mouse drag along x
            var dx = -0.05 * mouseState.dely;  // angle around x due to mouse drag along y

            var ry = rotateY(10 * dy);  // rotation matrix around y
            var rx = rotateX(10 * dx);  // rotation matrix around x

            this.tumble(rx, ry);   // 
            mouseState.startx = mouseState.x;
            mouseState.starty = mouseState.y;
            break;
        case mouseState.actionChoice.TRACK:  // PAN   - right mouse button
            var dx = -0.05 * mouseState.delx; // amount to pan along x
            var dy = 0.05 * mouseState.dely;  // amount to pan along y
            
            //this.eye = vec4(this.eye[0]+dx,this.eye[1]+dy,this.eye[2],1);
			
			var x = scale(dx, this.viewRotation[0]);
			this.eye = add(x, this.eye);
			
			var y = scale(dy, this.viewRotation[1]);
			this.eye = add(y, this.eye);
			
			
            mouseState.startx = mouseState.x;
            mouseState.starty = mouseState.y;
            break;
        case mouseState.actionChoice.DOLLY:   // middle mouse button
            var dx = 0.05 * mouseState.delx;  // amount to move backward/forward
            var dy = 0.05 * mouseState.dely;
            
            var z = scale(dy, this.viewRotation[2]);
			this.eye = add(z, this.eye);
            mouseState.startx = mouseState.x;
            mouseState.starty = mouseState.y;
            break;
        default:
            console.log("unknown action: " + mouseState.action);
    }
    render();
};

/**
 * Rotate about the world coordinate system about y (left/right mouse drag) and/or 
 * about a line parallel to the camera's x-axis and going through the WCS origin 
 * (up/down mouse drag).
 * @param {mat_npc} rx  rotation matrix around x
 * @param {mat_npc} ry  rotation matrix around y
 * @return none
 */
Camera.prototype.tumble = function (rx, ry) {
    // TO DO:  IMPLEMENT THIS FUNCTION
    // We want to rotate about the world coordinate system along a direction parallel to the
    // camera's x axis. We first determine the coordinates of the WCS origin expressed in the eye coordinates.
    // We then translate this point to the camera (origin in camera coordinates) and do a rotation about x.
    // We then translate back. The result is then composed with the view matrix to give a new view matrix.
    //  When done, should have new value for eye and viewRotation


    var view_old = this.calcViewMat();  
	
	var pc = vec4(0,0,0,1);
	var pc_p = mult(view_old, pc); 

	//var t_pc = translate (pc[0], pc[1], pc[2]);
	//var t_npc = translate (-pc[0], -pc[1], -pc[2]) ;
	
	var t_pc_p = translate(pc_p[0], pc_p[1], pc_p[2]);
	var t_npc_p = translate(-pc_p[0], -pc_p[1], -pc_p[2]);

	view_new = mult(view_old,ry);
	view_new = mult(t_npc_p, view_new);
	view_new = mult(rx, view_new);
	view_new = mult(t_pc_p, view_new);
	
	var rot_inverse = transpose(view_new); 
	rot_inverse[3] = vec4(0,0,0,1); 
	
	this.viewRotation = transpose(rot_inverse); 
	
	var eye_offset = mult(rot_inverse, view_new); 
	this.eye = vec4(-eye_offset[0][3], -eye_offset[1][3], -eye_offset[2][3], 1); 

   
   
};

Camera.prototype.keyAction = function (key) {
    var alpha = 1.0;  // used to control the amount of a turn during the flythrough 
	var speed = 5;
    switch (key) {     // different keys should be used because these do thing sin browser
        case 'W':  // turn right - this is implemented
            console.log("turn right");
            this.viewRotation = mult(rotateY(alpha), this.viewRotation);
            break;
        case 'E':   // turn left
            console.log("turn left");
            this.viewRotation = mult(rotateY(-alpha), this.viewRotation);
            break;
        case 'S':  // turn up   
            console.log(" turn up");
            this.viewRotation = mult(rotateX(alpha), this.viewRotation);
            break;
        case 'D':  // turn down
            console.log("turn down");
            this.viewRotation = mult(rotateX(-alpha), this.viewRotation);
            break;
        case 'X':  // bank right
            console.log("bank right");
            this.viewRotation = mult(rotateZ(alpha), this.viewRotation);
            break;
        case 'C':  // bank left
            console.log("bank left");
            this.viewRotation = mult(rotateZ(-alpha), this.viewRotation);
            break;
        case 'Q':  // move forward
            console.log("move forward");
			var z = scale(-alpha, this.viewRotation[2]);
			this.eye = add(z, this.eye);
			
            break;
        case 'A':  //  move backward
            console.log("move backward");
            var z = scale(alpha, this.viewRotation[2]);
			this.eye = add(z, this.eye);
            break;
        case 'R':  //  reset
            console.log("reset");
            this.reset();
            break;
		case 'M':  //  pedal forward
            console.log("pedal forward");
            thetaX -= speed;
            break;
		case 'N':  //  pedal backward
            console.log("pedal back");
            thetaX += speed;
            break;
    }
};