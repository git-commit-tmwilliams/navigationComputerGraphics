//by Elizabeth and Dakota, using Dakota's primitives
function Unicycle(){    
    this.name = "Unicycle";
    this.wheelRad = 5; //wheel radius
    this.wheelThick = 0.5; //wheel thickness
    this.seatWidth = 3; //seat width
    this.rodDepth = 1;
    this.topColor = vec4(1.0, 0.0, 0.0, 1.0); //red
    this.wheelColor = vec4(0.0, 1.0, 0.0, 1.0); //green
    this.pedalColor = vec4(0.0, 0.0, 1.0, 1.0); //blue
}

Unicycle.prototype.drawSeat = function(){
    stack.push();
    stack.multiply(translate(0,15.5,0));
    stack.multiply(scalem(this.seatWidth,1,2));
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    gl.uniform4fv(uColor, this.topColor);
    Shapes.drawPrimitive(Shapes.cube); 
    stack.pop();
}
Unicycle.prototype.drawRods = function(){
     //Rod from seat
    stack.push();
    stack.multiply(translate(0,13.5,0));
    stack.multiply(scalem(1,3,1));
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    gl.uniform4fv(uColor, this.topColor);
    Shapes.drawPrimitive(Shapes.cube); 
    stack.pop();
    
    //middle rod
    stack.push();
    stack.multiply(translate(0,11.5,0));
    stack.multiply(scalem(3,1,1));
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    gl.uniform4fv(uColor, this.topColor);
    Shapes.drawPrimitive(Shapes.cube); 
    stack.pop();
    
    
    //side connecting rods
    stack.push();
    stack.multiply(translate(0,8.25,0));
    stack.push();
    stack.multiply(translate(2,0,0));
    stack.multiply(scalem(1,7.5,1));
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    gl.uniform4fv(uColor, this.topColor);
    Shapes.drawPrimitive(Shapes.cube);
    stack.pop();
    stack.multiply(translate(-2,0,0));
    stack.multiply(scalem(1,7.5,1));
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    gl.uniform4fv(uColor, this.topColor);
    Shapes.drawPrimitive(Shapes.cube);
    stack.pop();
}
Unicycle.prototype.connect = function(){
    //Beginning of rotation section
    stack.push();
    stack.multiply(translate(0,5,0));
    stack.multiply(rotateX(thetaX));
}
Unicycle.prototype.drawWheel = function(){
     //Wheel
    stack.push();
    stack.multiply(rotateZ(90));
    stack.multiply(scalem(this.wheelRad,this.wheelThick,this.wheelRad));
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    gl.uniform4fv(uColor, this.wheelColor);
    Shapes.drawPrimitive(Shapes.cylinder);
    stack.pop();
}
Unicycle.prototype.drawAxel = function(){
     //Axle
    stack.push();
    stack.multiply(rotateZ(90));
    stack.multiply(scalem(0.5,2,0.5));
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    gl.uniform4fv(uColor, this.wheelColor);
    Shapes.drawPrimitive(Shapes.cylinder);
    stack.pop();
}
Unicycle.prototype.addPedalSpokes = function(){
    //right pedal spoke
    stack.push();
    stack.multiply(translate(3,1,0));
    stack.multiply(scalem(1,3,1));
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    gl.uniform4fv(uColor, this.pedalColor);
    Shapes.drawPrimitive(Shapes.cube);
    stack.pop();

     //left pedal spoke
    stack.push();
    stack.multiply(translate(-3,-1,0));
    stack.multiply(scalem(1,3,1));
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    gl.uniform4fv(uColor, this.pedalColor);
    Shapes.drawPrimitive(Shapes.cube);
    stack.pop();
}
Unicycle.prototype.addPedals = function(){
     //right pedal
    stack.push();
    stack.multiply(translate(4,2,0));
    stack.multiply(scalem(1.5,0.75,0.75));
    stack.multiply(rotateZ(90));
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    gl.uniform4fv(uColor, this.pedalColor);
    Shapes.drawPrimitive(Shapes.cylinder);
    stack.pop();
    
    //left pedal
//    stack.push();
    stack.multiply(translate(-4,-2,0));
    stack.multiply(scalem(1.5,0.75,0.75));
    stack.multiply(rotateZ(90));
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    gl.uniform4fv(uColor, this.pedalColor);
    Shapes.drawPrimitive(Shapes.cylinder);
    stack.pop();
}
Unicycle.prototype.drawUnicycle = function(){ //put it all together
    stack.push();
    this.drawSeat();
    this.drawRods();
    this.drawRods();
    this.connect();
    this.drawWheel();
    this.drawAxel();
    this.addPedalSpokes();
    this.addPedals();
    stack.pop();
}