// CS445 LAB 2 Dakota Madden-Fong Anthony Ninthara

function Cylinder(n) {
    
    this.name = "cylinder";
    
    
    //4 triangles for every n (slice of top and bottom, 2 for side panel
    this.numVertices = 3*4*n;
    this.numTriangles = 4*n;
    
    this.vertices = [];
    this.colors = [];
    this.normals = [];
    this.texCoords = [];
    
    var vert_colors = [
        vec4(0.0, 0.0, 0.0, 1.0), // black   
        vec4(1.0, 0.0, 0.0, 1.0), // red     
        vec4(1.0, 1.0, 0.0, 1.0), // yellow  
        vec4(0.0, 1.0, 0.0, 1.0), // green   
        vec4(0.0, 0.0, 1.0, 1.0), // blue    
        vec4(1.0, 0.0, 1.0, 1.0), // magenta 
        vec4(1.0, 1.0, 1.0, 1.0), // white   
        vec4(0.0, 1.0, 1.0, 1.0)  // cyan    
    ];
    
    // Incremental change in angle from triangle to triangle
    var inc_angle = ((2 * Math.PI)/n);
    
    var norm = vec4(0,1,0,0);
    
    var self = this;//maintains proper scope for function pushvert
    
    function pushvert(vert,color){//Pushes a specific vertice with a specific color
        self.vertices.push(vert);
        self.colors.push(color);
        self.normals.push(norm);
    }
    
    for (var i = 0; i < n; i++){
        
        // Top Disk
        pushvert(vec4(0,1,0,1),vert_colors[1]);
        var angle = inc_angle*i;
        pushvert(vec4(Math.cos(angle),1,Math.sin(angle),1),vert_colors[7]);
        var angle2 = inc_angle*(i+1);
        pushvert(vec4(Math.cos(angle2),1,Math.sin(angle2),1),vert_colors[7]);
        
        //Bottom Disk
        pushvert(vec4(0,-1,0,1),vert_colors[1]);
        pushvert(vec4(Math.cos(angle),-1,Math.sin(angle),1),vert_colors[6]);
        pushvert(vec4(Math.cos(angle2),-1,Math.sin(angle2),1),vert_colors[6]);
        
        //Side Triangle, fatter at top
        pushvert(vec4(Math.cos(angle),1,Math.sin(angle),1),vert_colors[7]);
        pushvert(vec4(Math.cos(angle2),1,Math.sin(angle2),1),vert_colors[7]);
        pushvert(vec4(Math.cos(angle),-1,Math.sin(angle),1),vert_colors[6]);
        
        //Side Triangle, fatter at bottom
        pushvert(vec4(Math.cos(angle),-1,Math.sin(angle),1),vert_colors[6]);
        pushvert(vec4(Math.cos(angle2),-1,Math.sin(angle2),1),vert_colors[6]);
        pushvert(vec4(Math.cos(angle2),1,Math.sin(angle2),1),vert_colors[7]);
    }
}
