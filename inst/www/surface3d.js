window.onload = function(){

  var head = document.head,
      meta = document.createElement("meta");

  meta.setAttribute("name","viewport");
  meta.setAttribute("content","width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0");
  head.appendChild(meta);

  document.body.style = "margin:0;overflow:hidden;font-family:sans-serif;font-size:10px";

  var showPosition = document.createElement("div");
  showPosition.className = "showPosition";
  showPosition.style = "position:absolute;top:10px;left:10px;";

  var vp = viewport();
  var data = JSON.parse(document.getElementById("data").textContent);

  var container;
  var camera, light, controls, scene, renderer;
  var mesh, texture;
  var worldWidth = data.row,
      worldDepth = data.col;
  var clock = new THREE.Clock();
  var helper;
  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();
  init();
  animate();
  canvasExport();

  function getColor(d){
    if(typeof data.color == 'string')
      return new THREE.Color().setStyle(data.color);
    else{
      var step = (data.extent[1] - data.extent[0]) / (data.color.length-1);
      d = d-data.extent[0];
      var pos = Math.floor(d/step);
      return new THREE.Color().setStyle(data.color[pos]).lerp(new THREE.Color().setStyle(data.color[pos+1]),(d%step)/step);
    }
  }

  function v(x,y,z){ return new THREE.Vector3(x,y,z); }

  function addLine(axes,v1,v2){
        var lineGeo = new THREE.Geometry();
        lineGeo.vertices.push(v1, v2);
        var lineMat = new THREE.LineBasicMaterial({color: 0x808080, linewidth: 1});
        var line = new THREE.Line(lineGeo, lineMat);
        line.type = THREE.Lines;
        axes.add(line);
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
        mesh.scale.set(2, 2, 2);
        mesh.doubleSided = true;
        return mesh;
  }

  function init() {
      container = document.body;
      camera = new THREE.PerspectiveCamera( 45, vp.width / vp.height, 1, 10000 );
      scene = new THREE.Scene();
      controls = new THREE.OrbitControls(camera);
      controls.target.set(500,500,500);
      controls.userPanSpeed = 100;
      camera.position.set(2000,2000,2000);

      var axes = new THREE.Object3D();
      scene.add(axes);

      axes.position.set(0,0,0)

      addLine(axes,v(0, 0, 0),v(1000, 0, 0));
      addLine(axes,v(0, 0, 0),v(0, 1000, 0));
      addLine(axes,v(0, 0, 0),v(0, 0, 1000));

      var titleX = createText2D(data.xlab);
      titleX.position.x = 1050 + (data.xlab.length-1)*1.8;
      axes.add(titleX);

      var titleY = createText2D(data.ylab);
      titleY.position.z = 1050;
      axes.add(titleY);

      var titleZ = createText2D(data.zlab);
      titleZ.position.y = 1050;
      axes.add(titleZ);

      var geometry = new THREE.PlaneBufferGeometry( worldWidth, worldDepth, worldWidth - 1, worldDepth - 1 );
      geometry.rotateX( - Math.PI / 2 );
      var vertices = geometry.attributes.position.array;
      for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
      	vertices[ j + 1 ] = data.matrix[ i ];
      }
      geometry.computeFaceNormals();
      geometry.computeVertexNormals();
      texture = new THREE.CanvasTexture( generateTexture( data.matrix, worldWidth, worldDepth ) );
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial({ map: texture }) );
      mesh.material.side = THREE.DoubleSide;
      mesh.scale.x = 1000/worldWidth * (worldWidth / Math.max(worldWidth,worldDepth));
      mesh.scale.y = 1000/(data.extent[1]-data.extent[0]);
      mesh.scale.z = 1000/worldDepth * (worldDepth / Math.max(worldWidth,worldDepth));
      mesh.position.x = mesh.scale.x * worldWidth/2;
      mesh.position.y = - mesh.scale.y * data.extent[0];
      mesh.position.z = mesh.scale.z * worldDepth/2;
      scene.add( mesh );

      var geometry = new THREE.CylinderGeometry( 0, 10, 50, 3 );
      geometry.translate( 0, 25, 0 );
      geometry.rotateX( Math.PI / 2 );
      helper = new THREE.Mesh( geometry, new THREE.MeshNormalMaterial() );
      scene.add( helper );

      light = new THREE.PointLight( 0xFFFFFF );
      camera.add( light );

      scene.add( camera );

      renderer = new THREE.WebGLRenderer({
        preserveDrawingBuffer: true 
      });
      renderer.setClearColor( 0xFFFFFF );
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( vp.width, vp.height );
      container.innerHTML = "";
      container.appendChild( renderer.domElement );
      container.appendChild(showPosition);
      container.addEventListener( 'mousemove', onMouseMove, false );
      //
      window.addEventListener( 'resize', onWindowResize, false );
  }
  function onWindowResize() {
      vp = viewport();
      camera.aspect = vp.width / vp.height;
      camera.updateProjectionMatrix();
      renderer.setSize( vp.width, vp.height );
  }
  function generateTexture( data, width, height ) {
      var canvas, canvasScaled, context, image, imageData, color;
      canvas = document.createElement( 'canvas' );
      canvas.width = width;
      canvas.height = height;
      context = canvas.getContext( '2d' );
      context.fillStyle = '#000';
      context.fillRect( 0, 0, width, height );
      image = context.getImageData( 0, 0, canvas.width, canvas.height );
      imageData = image.data;
      for ( var i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {
        color = getColor(data[j]);
      	imageData[ i ] = color.r*255;
      	imageData[ i + 1 ] = color.g*255;
      	imageData[ i + 2 ] = color.b*255;
      }
      context.putImageData( image, 0, 0 );
      return canvas;
  }
  //
  function animate() {
      requestAnimationFrame( animate );
      render();
  }
  function render() {
      controls.update( clock.getDelta() );
      renderer.render( scene, camera );
  }
  function scaleLinearZ(x){
      var r = data.extent,
          d = [0,1000];
      return r[0] + ((r[1] - r[0]) * ((x - d[0]) / (d[1] - d[0])));
  }
  function onMouseMove( event ) {
      mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
      mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
      raycaster.setFromCamera( mouse, camera );
      // See if the ray from the camera into the world hits one of our meshes
      var intersects = raycaster.intersectObject( mesh );
      // Toggle rotation bool for meshes that we clicked
      if ( intersects.length > 0 ) {
      	helper.position.set( 0, 0, 0 );
      	helper.lookAt( intersects[ 0 ].face.normal );
      	helper.position.copy( intersects[ 0 ].point );
        showPosition.innerHTML = data.xlab+": "+formatter(helper.position.x / mesh.scale.x)+"<br/>"+
                                 data.ylab+": "+formatter(helper.position.z / mesh.scale.z)+"<br/>"+
                                 data.zlab+": "+formatter(scaleLinearZ(helper.position.y));
      }
  }
}
