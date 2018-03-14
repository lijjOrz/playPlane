var canvas = document.getElementById('canvas');
var Height = canvas.height = window.innerHeight;
var Width = canvas.width = window.innerWidth;
var ctx = canvas.getContext('2d');


var DJ = [];
var ZD = [];
var ME = {};
var count = 0;
var requestId;


function initMe(){
	ME.r = 30;
	ME.x = 0.5*Width;
	ME.y = Height - ME.r;
	ME.color = "#00f";
	ME.vx = 5;
	ME.vy = 5;
}

function initDJ(){
	var obj = {}
	obj.r = 15;
	obj.x = Math.floor(Math.random()*(Width - 2*obj.r) + obj.r);
	obj.y = -obj.r;
	obj.vy = Math.floor(Math.random()*3+2);
	obj.color = Math.floor(Math.random()*360);
	DJ.push(obj)
}

function initZD(){
	var obj = {}
	obj.w = 2;
	obj.h = 5;
	obj.x = ME.x - 1,
	obj.y = ME.y - ME.r - 10;
	obj.vy = 6;
	// obj.vy = Math.floor(Math.random()*5+4);
	obj.color = Math.floor(Math.random()*360);
	ZD.push(obj)
}

//画自己
function DrawME(){
	ctx.beginPath();
	ctx.arc(ME.x,ME.y,ME.r,0,2*Math.PI);
	ctx.closePath();
	ctx.fillStyle=ME.color;
	ctx.fill();
}

//画子弹

function DrawZD(){
	for(var i = 0; i < ZD.length; i++){
		// ctx.beginPath();
		ctx.fillRect(ZD[i].x,ZD[i].y,ZD[i].w,ZD[i].h);
		// ctx.closePath();
		// ctx.stroke();
		// ctx.fillStyle='hsl('+ZD[i].color+',100%,50%)';
		// ctx.fill();
	}
}


//更新子弹
function updateZD(){
	for(var i = 0; i < ZD.length; i++){
		ZD[i].y -= ZD[i].vy;
	}
}

//检测子弹
function testZD(){
	for(var i = 0; i < ZD.length; i++){
		if(ZD[i].y < 10){
			ZD.splice(i,1);
			i--;
		}
	}
}

//画敌机

function DrawDJ(){
	for(var i = 0; i < DJ.length; i++){
		ctx.beginPath();
		ctx.arc(DJ[i].x,DJ[i].y,DJ[i].r,0,2*Math.PI);
		ctx.closePath();
		ctx.fillStyle='hsl('+DJ[i].color+',100%,50%)';
		ctx.fill();
	}
}



//更新敌机
function updateDJ(){
	for(var i = 0; i < DJ.length; i++){
		DJ[i].y += DJ[i].vy;
	}

}
//检测敌机
function testDJ(){
	for(var i = 0; i < DJ.length; i++){
		if(DJ[i].y > Height + DJ[i].r){
			DJ.splice(i,1);
			i--;
		}
	}
}

//我方与敌机碰撞检测
function testDie(){
	for(var i = 0; i < DJ.length; i++){
		var dx = ME.x - DJ[i].x;
		var dy = ME.y - DJ[i].y;
		var dr = ME.r + DJ[i].r;
		if(dx*dx + dy*dy <= dr*dr){
			alert("游戏结束")
			window.cancelRequestAnimationFrame(requestId);
  			// requestId = undefined;
		}
	}
}


//检测子弹与敌机碰撞检测
function testBang(){
	for(var i= 0; i < DJ.length; i++){
		for(var j = 0; j < ZD.length; j++){
			var dx = ZD[j].x - DJ[i].x;
			var dy = ZD[j].y - DJ[i].y;
			if(dx*dx + dy*dy <= DJ[i].r*DJ[i].r){
				DJ.splice(i,1);
				ZD.splice(j,1);
				i--;
				break;
			}
		}
	}
}



function addEvent(){
	document.onkeydown = function(event){
		switch(event.keyCode){
			case 37:
				if(ME.x < ME.r ) return;
				ME.x -= ME.vx;
				break;
			case 38:
				if(ME.y < ME.r) return;
				ME.y -= ME.vy;
				break;
			case 39:
				if(ME.x > Width-ME.r) return;
				ME.x += ME.vx;
				break;
			case 40:
				if(ME.y >Height-ME.r) return;
				ME.y += ME.vy;
			default:
				return;
		}

	}
	document.onmousedown = function A(event){
		console.log(event)
		var dx = event.x - ME.x
		var dy = event.y - ME.y
		var status = true;

		function B(event){
			console.log(status);
			if(status){
				ME.x = event.x;
				ME.y = event.y;
			}
		}
		if(dx*dx + dy*dy <= ME.r*ME.r){
			// if(status){
				document.addEventListener('mousemove',B)
			// }
		}
		document.onmouseup = function C(event){
			document.removeEventListener('mousemove',B)
			status = false;
		}
	}
}

function loop(){
//清除画布
	ctx.clearRect(0,0,Width,Height)


//我方与敌机碰撞检测
	testDie();
//子弹与敌机碰撞检测
	testBang();


	count++;
//画飞机
	DrawME();

//画子弹

	if(count % 10 == 0){
		initZD();
	}
	DrawZD();


//画敌机
	if(count % 20 == 0){
		initDJ();
	}
	DrawDJ();





//更新子弹
	updateZD();


//检查子弹
	testZD();
	// console.log(ZD)


//更新敌机
	updateDJ();

//检测敌机
	testDJ();
	



	requestId = window.requestAnimationFrame(loop)
}


initMe()
addEvent()
alert("是否开始")
loop()