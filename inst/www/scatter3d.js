window.onload = function(){

      document.body.style = "margin:0;overflow:hidden;font-family:sans-serif;font-size:10px";

      var showPosition = document.createElement("div");
      showPosition.className = "showPosition";
      showPosition.style = "position:absolute;top:10px;left:10px;";

      var vp = viewport();
      var data = JSON.parse(document.getElementById("data").textContent);

      var colorScale = new ColorScale();
      var scaleX = new scaleLinear(data.a);
      var scaleY = new scaleLinear(data.b);
      var scaleZ = new scaleLinear(data.c);

      var container = document.body;
      var raycaster = new THREE.Raycaster();
      var mouse = new THREE.Vector2();

      var renderer = new THREE.WebGLRenderer({
        preserveDrawingBuffer: true,
        antialias: true
      });
      var w = vp.width;
      var h = vp.height;
      renderer.setSize(w, h);
      container.appendChild(renderer.domElement);
      container.addEventListener( 'mousemove', onMouseMove, false );
      container.appendChild(showPosition);

      renderer.setClearColor(0xFFFFFF, 1.0);

      var camera = new THREE.PerspectiveCamera( 45, w/h, 1, 10000 );
      camera.position.set(100,100,150);

      var controls = new THREE.OrbitControls(camera);
      controls.target.set(0,0,0);
      controls.userPanSpeed = 100;

      var scene = new THREE.Scene();

      var scatterPlot = new THREE.Object3D();
      scene.add(scatterPlot);

      var zero = v(-55,-55,-55);
      addLine(scatterPlot,zero,v(55, zero.y, zero.z));
      addLine(scatterPlot,zero,v(zero.x, 55, zero.z));
      addLine(scatterPlot,zero,v(zero.x, zero.y, 55));

      var titleX = createText2D(data.xlab);
      titleX.position.x = 60+(data.xlab.length-1)*1.8;
      titleX.position.y = zero.y;
      titleX.position.z = zero.z;
      scatterPlot.add(titleX);

      var titleX = createText2D(data.ylab);
      titleX.position.x = zero.x;
      titleX.position.y = 60;
      titleX.position.z = zero.z;
      scatterPlot.add(titleX);

      var titleX = createText2D(data.zlab);
      titleX.position.x = zero.x;
      titleX.position.y = zero.y;
      titleX.position.z = 60;
      scatterPlot.add(titleX);

      var pointGeo = new THREE.Geometry();
      for(var i=0; i<data.len; i++){
        var x = scaleX.get(data.x[i]);
        var y = scaleY.get(data.y[i]);
        var z = scaleZ.get(data.z[i]);
        var color = typeof data.color == "string" ? data.color : data.color[i];
        color = colorScale.get(color);
        pointGeo.vertices.push(v(x,y,z));
        pointGeo.colors.push(new THREE.Color().setStyle(color));
      }
      var mat = new THREE.PointsMaterial({vertexColors: true, size: 1.5});
      var points = new THREE.Points(pointGeo, mat);
      scatterPlot.add(points);
      scene.add(scatterPlot);

      renderer.render(scene, camera);

      animate(new Date().getTime());

      canvasExport();

      function animate(t) {
        window.requestAnimationFrame(animate, renderer.domElement);
        controls.update( t );
        renderer.render(scene, camera);
      }

      function scaleLinear(domain){
        this.r = [-50,50];
        this.d = domain;
        this.get = function(x){
          var r = this.r,
              d = this.d;
          return r[0] + ((r[1] - r[0]) * ((x - d[0]) / (d[1] - d[0])));
        }
        this.invert = function(x){
          var r = this.d,
              d = this.r;
          return r[0] + ((r[1] - r[0]) * ((x - d[0]) / (d[1] - d[0])));
        }
      }

      function ColorScale(){
        this.palette = ["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf"];
        this.domain = [];
        this.valid = function(col){
          if (!col) { return false; }
          if (col === "") { return false; }
          if (col === "inherit") { return false; }
          if (col === "transparent") { return false; }
    
          var image = document.createElement("img");
          image.style.color = "transparent";
          image.style.color = col;
          return image.style.color !== "transparent";
        };
        this.get = function(x){
          if(this.valid(x)){
            return x;
          }else{
            if(this.domain.indexOf(x)==-1)
              this.domain.push(x);
            return this.palette[this.domain.indexOf(x)%this.palette.length];
          }
        };
      }

      function v(x,y,z){ return new THREE.Vector3(x,y,z); }

      function addLine(scatterPlot,v1,v2){
        var lineGeo = new THREE.Geometry();
        lineGeo.vertices.push(v1, v2);
        var lineMat = new THREE.LineBasicMaterial({color: 0x808080, linewidth: 1});
        var line = new THREE.Line(lineGeo, lineMat);
        line.type = THREE.Lines;
        scatterPlot.add(line);
      }

      function createTextCanvas(text, color, font, size) {
        size = size || 24;
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var fontStr = (size + 'px ') + (font || 'sans-serif');
        ctx.font = fontStr;
        var w = ctx.measureText(text).width;
        var h = Math.ceil(size);
        canvas.width = w;
        canvas.height = h;
        ctx.font = fontStr;
        ctx.fillStyle = color || 'black';
        ctx.fillText(text, 0, Math.ceil(size*0.8));
        return canvas;
      }

      function createText2D(text, color, font, size, segW, segH) {
        var canvas = createTextCanvas(text, color, font, size);
        var plane = new THREE.PlaneBufferGeometry(canvas.width, canvas.height, segW, segH);
        var tex = new THREE.Texture(canvas);
        tex.needsUpdate = true;
        var planeMat = new THREE.MeshBasicMaterial({
          map: tex, color: 0xffffff, transparent: true
        });
        var mesh = new THREE.Mesh(plane, planeMat);
        mesh.scale.set(0.25, 0.25, 0.25);
        mesh.doubleSided = true;
        return mesh;
      }

    function onMouseMove( event ) {
      mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
      mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
      raycaster.setFromCamera( mouse, camera );
      // See if the ray from the camera into the scatter hits one of our points
      var intersects = raycaster.intersectObject( points );
      // Toggle rotation bool for points that we clicked
      if ( intersects.length > 0 && intersects[ 0 ].distanceToRay < 0.5 ) {
        var pos = intersects[ 0 ].point;
        showPosition.innerHTML = data.xlab+": "+formatter(scaleX.invert(Math.round(pos.x)))+"<br/>"+
                                 data.ylab+": "+formatter(scaleY.invert(Math.round(pos.y)))+"<br/>"+
                                 data.zlab+": "+formatter(scaleZ.invert(Math.round(pos.z)));
      }
    }
}
