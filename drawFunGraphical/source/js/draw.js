var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope){
	var camera, scene, light, renderer, width, height, line;
	var funcExpr = "";
	//区间默认值
	var minValue = -10;
	$scope.minValue = -10;
	var maxValue = 10;
	$scope.maxValue = 10;
	//精度默认值
	var accuracy = 0.05;
	$scope.accuracy = 0.05;
	//用来标识是否第一次画
	var index = 0;
	var timer;
	$scope.draw = function(){
		funcExpr = $scope.funcExp;
		minValue = eval($scope.minValue);
		maxValue = eval($scope.maxValue);
		accuracy = eval($scope.accuracy);
		//console.log(funcExpr);
		if(index == 0){
			initThree();
			initScene();
			initCamera();
			initLight();
		}else{
			//如果不是第一次，初始化场景
			initScene();
		}
		initObject();
		render();
		index++;
	}
	$scope.narrow = function(){
		//camera.position.x += 5;
		//camera.position.y += 5;
		camera.position.z += 20;
		//console.log(camera.position);
	}
	$scope.enlarge = function(){
		//camera.position.x -= 5;
		//camera.position.y -= 5;
		camera.position.z -= 20;
		//console.log(camera.position);
	}
	$scope.pause = function(){
		cancelAnimationFrame(timer);
	}
	$scope.resume = function(){
		render();
	}
	function initThree(){
		debugger;
		width = document.getElementById('canvas-frame').clientWidth;
		//console.log($(".canvas-frame"));
		height = document.getElementById('canvas-frame').clientHeight;
		renderer = new THREE.WebGLRenderer({antialias: true});
		renderer.setSize(width,height);
		document.getElementById('canvas-frame').appendChild(renderer.domElement);
		renderer.setClearColor(0xFFFFFF, 1.0);
	}
	function initCamera(){
		camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
		camera.position.x = 0;
		camera.position.y = 0;
		camera.position.z = 10;
		//camera.up.x = 0;
		//camera.up.y = 0;
		//camera.up.z = 5;
		//camera.lookAt(0,0,0);
	}
	function initScene(){
		scene = new THREE.Scene();
	}
	function initLight(){
		light = new THREE.DirectionalLight(0xFF0000, 1.0, 0);
		light.position.set(100, 100, 200);
		scene.add(light);
	}
	function initObject(){
		var geometry = new THREE.Geometry();
		var material = new THREE.LineBasicMaterial({color: 0x0000ff});
		var z = 0;
		parseExpr();
		if(!funcExpr.includes("x")){
			var x = 0;
			for(var y = minValue;y < maxValue;y = y + accuracy){
				z = eval(funcExpr.replaceAll("y", y));
				geometry.vertices.push(new THREE.Vector3(x,y,z));
			}
		}else if(!funcExpr.includes("y")){
			var y = 0;
			for(var x = minValue;x < maxValue;x = x + accuracy){
				z = eval(funcExpr.replaceAll("x", x));
				geometry.vertices.push(new THREE.Vector3(x,y,z));
			}
		}else{
			for(var x = minValue;x < maxValue;x = x + accuracy){
				for(var y = minValue;y < maxValue;y = y + accuracy){
					//把输入的表达式中的x和y用相应的数字替换掉
					//console.log(funcExpr.replaceAll("x", x).replaceAll("y", y));
					z = eval(funcExpr.replaceAll("x", x).replaceAll("y", y));
					geometry.vertices.push(new THREE.Vector3(x,y,z));
				}
			}
		}
			
		//坐标系
		var axesHelper =new THREE.AxesHelper(60);
		line = new THREE.Line(geometry, material, THREE.LineSegments);
		//console.log(line.position);
		//console.log(camera.position);
		scene.add(line);
		scene.add(axesHelper);
	}
	function parseExpr(){
		if(funcExpr.includes("sin")){
			funcExpr = funcExpr.replaceAll("sin", "Math.sin");
		}
		if(funcExpr.includes("cos")){
			funcExpr = funcExpr.replaceAll("cos", "Math.cos");
		}
		if(funcExpr.includes("tan")){
			funcExpr = funcExpr.replaceAll("tan", "Math.tan");
		}
		
	}
	function render(){
		renderer.clear();
		line.rotation.x += 0.01;
		line.rotation.y += 0.01;
		renderer.render(scene, camera);
		timer = requestAnimationFrame(render);
	}
});
