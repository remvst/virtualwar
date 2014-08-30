var raf = window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function(callback){
                window.setTimeout(callback,1000/60);
            };
})();

// bounce easing out
Math.easeOutBounce = function (t, b, c, d) {
	if ((t/=d) < (1/2.75)) {
		return c*(7.5625*t*t) + b;
	} else if (t < (2/2.75)) {
		return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
	} else if (t < (2.5/2.75)) {
		return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
	} else {
		return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
	}
};

var rnd = function(n){
	return ~~(n / P.maskSize) * P.maskSize;
};

var rts = function(ct,c,r,f){
	ct.fillStyle = c;
	var i = -1;
	while(r[++i]){
		if(f){
			ct.fRRect.apply(ct,r[i]);
		}else{
			ct.fillRect.apply(ct,r[i]);
		}
	}
};

CanvasRenderingContext2D.prototype.fRRect = function(x,y,w,h){
	this.fillRect(rnd(x),rnd(y),rnd(w) || 1,rnd(h) || 1);
};

var dt = function(ct,co,s,xb,y,lw,lh,ha){
	s = s.toString().toLowerCase();
	lw = lw || 56;
	lh = lh || 72;
	ha = ha || 'left';
	co = co || 'white';
	
	if(gp.it > 0){
		s = invert(s);
	}
	
	var x = xb;
	if(ha === 'center'){
		x = xb - s.length / 2 * lw;
	}else if(ha === 'right'){
		x = xb - s.length * lw;
	}
	
	var c;
	for(var i = 0 ; i < s.length ; i++, x += lw){
		c = s.charAt(i);
		if(chars[co][c]){
			ct.drawImage(chars[co][c],0,0,chars[co][c].width,chars[co][c].height,x,y,lw,lh);
		}
	}
};

var invert = function(s){
	var r = '';
	for(var i = s.length - 1 ; i >= 0 ; i--){
		r += s.charAt(i);
	}
	return r;
};
var P = {
	w : 960,
	h : 600,
	bottomY : 500,
	levels : 4,
	levelHeight : 80,
	maskSize : 4
};
var can,
	ctx,
	twopi = Math.PI * 2,
	noop = function(){},
	rd = Math.random,
	ua = navigator.userAgent.toLowerCase(),
	ios = ua.indexOf('ipod') >= 0 || ua.indexOf('ipad') >= 0 || ua.indexOf('iphone') >= 0,
	android = ua.indexOf('android') >= 0,
	ffos = ua.indexOf('firefox') >= 0 && ua.indexOf('mobile') >= 0,
	mobile = ios || android || ffos,
	tr = true,
	fl = false,
	ud = undefined
;
var gm = {
	lastFrame : Date.now(),
	init : function(){
		can = document.querySelector('#game');
		can.width = P.w;
		can.height = P.h;
		
		ctx = can.getContext('2d');
		
		gm.fc = 0;
		gm.fct = 0;
		gm.lfrc = 0;
		
		gm.setStage(gp);
		
		var b = document.body;
		
		gm.it = 'mouse';
		
		b.addEventListener('touchstart',gm.touchStart,false);
		b.addEventListener('touchmove',gm.touchMove,false);
		b.addEventListener('touchend',gm.touchEnd,false);
		b.addEventListener('mousedown',gm.mouseDown,false);
		b.addEventListener('mousemove',gm.mouseMove,false);
		b.addEventListener('mouseup',gm.mouseUp,false);
		window.addEventListener('keydown',gm.keyDown,false);
		window.addEventListener('resize',gm.resize,false);
		window.addEventListener('orientationchange',gm.resize,false);
		
		(function(){
			gm.cycle();
			raf(arguments.callee);
		})();
		
		setTimeout(gm.resize,1000);
		
		audio.init();
		audio.prepare( 'shoot', 10,
		  [
			//[1,ud,0.1862,ud,0.2309,0.778,0.2,-0.3277,ud,ud,ud,ud,ud,0.5545,-0.4327,ud,ud,ud,1,ud,ud,0.14,ud,0.515], // negative
			[0,ud,0.2271,0.0205,0.0806,0.6682,0.2,-0.2364,ud,ud,ud,ud,ud,0.6409,-0.4952,ud,ud,ud,1,ud,ud,ud,ud,0.515]
			//[1,ud,0.2398,0.022,0.0195,0.7039,0.3938,-0.3417,ud,ud,ud,ud,ud,0.3198,0.0361,ud,ud,ud,1,ud,ud,ud,ud,0.515]
		  ]
		);
		audio.prepare( 'hit', 4,
		  [
			[2,ud,0.0687,ud,0.1378,0.6465,ud,-0.6211,ud,ud,ud,ud,ud,ud,ud,ud,ud,ud,1,ud,ud,0.0378,ud,0.515],
			[3,ud,0.0645,ud,0.2429,0.2563,ud,-0.3578,ud,ud,ud,ud,ud,ud,ud,ud,ud,ud,1,ud,ud,ud,ud,0.515]
		  ]
		);
		audio.prepare( 'jump', 5,
		  [
			[0,ud,0.114,ud,0.1754,0.4324,ud,0.2749,ud,ud,ud,ud,ud,0.3392,ud,ud,ud,ud,0.8445,ud,ud,0.1981,ud,0.515],
			[0,ud,0.1781,ud,0.2884,0.4075,ud,0.1258,ud,ud,ud,ud,ud,0.2534,ud,ud,ud,ud,0.5698,ud,ud,ud,ud,0.515],
			[0,ud,0.1055,ud,0.2528,0.5678,ud,0.278,ud,ud,ud,ud,ud,0.2371,ud,ud,ud,ud,0.6015,ud,ud,0.2173,ud,0.515]
			  
		  ]
		);
		audio.prepare( 'explosion', 1,
		  [
			[3,ud,0.3334,0.6509,0.236,0.1692,ud,-0.2311,ud,ud,ud,ud,ud,ud,ud,ud,ud,ud,1,ud,ud,ud,ud,0.515],
			[3,ud,0.2784,0.7886,0.2524,0.0481,ud,-0.0112,ud,ud,ud,ud,ud,ud,ud,ud,ud,ud,1,ud,ud,ud,ud,0.515],
			[3,ud,0.3175,0.6186,0.3801,0.0705,ud,ud,ud,ud,ud,ud,ud,ud,ud,0.6661,-0.0958,-0.0444,1,ud,ud,ud,ud,0.515]
		  ]
		);
		audio.prepare( 'powerup', 1,
		  [
			[0,ud,0.2181,ud,0.3851,0.3984,ud,0.2509,ud,ud,ud,ud,ud,0.3054,ud,0.5857,ud,ud,1,ud,ud,ud,ud,0.515]
			//[1,ud,0.1658,ud,0.3515,0.4301,ud,0.2573,ud,ud,ud,ud,ud,ud,ud,0.4887,ud,ud,1,ud,ud,ud,ud,0.515]
			
		  ]
		);
		audio.prepare( 'malus', 1,
		  [
			[1,ud,0.0383,ud,0.476,0.2688,ud,0.2785,ud,ud,ud,ud,ud,ud,ud,0.7214,ud,ud,1,ud,ud,ud,ud,0.515]
			//[0,ud,0.3249,ud,0.4082,0.3263,ud,0.128,ud,ud,ud,ud,ud,0.2662,ud,0.4356,ud,ud,1,ud,ud,ud,ud,0.515]
			
		  ]
		);
		audio.prepare( 'die', 1,
		  [
			[3,ud,0.3925,0.4015,0.2302,0.8099,ud,ud,ud,ud,ud,-0.2542,0.7501,ud,ud,0.7392,ud,ud,1,ud,ud,ud,ud,0.515]
		  ]
		);
		audio.prepare( 'menu', 1,
		  [
			[1,ud,0.2834,0.1957,0.3865,0.6328,0.0769,-0.3951,ud,ud,ud,ud,ud,0.7064,-0.1373,ud,0.0873,-0.1027,1,ud,ud,0.0974,ud,0.5]
		  ]
		);
	},
	cycle : function(){
		var n = Date.now();
		var e = (n - gm.lastFrame) / 1000;
		gm.lastFrame = n;
		
		ctx.fillStyle = '#000';
		//ctx.fillRect(0,0,P.w,P.h);
		
		gm.stage.cycle(e);
		
		gm.fc++;
		gm.fct += e;
		if(gm.fc == 120){
			gm.fps = (gm.fc / gm.fct);
			gm.fct = 0;
			gm.fc = 0;
			
			if(gm.fps < 20){
				gm.lfrc++;
			}else{
				gm.lfrc = 0;
			}
			
			if(gm.lfrc >= 3 && !gm.half){
				can.width = P.w / 2;
				can.height = P.h / 2;
				ctx.scale(.5,.5);
				
				gm.half = true;
			}
		}
	},
	setStage : function(s){
		gm.stage = s;
		s.touchStart = s.touchStart || noop;
		s.touchMove = s.touchMove || noop;
		s.touchEnd = s.touchEnd || noop;
		
		s.init();
	},
	pos : function(e){
		var rect = can.getBoundingClientRect();
		
		e = e.touches ? e.touches[e.touches.length - 1] : e;
		return {
			x : (e.clientX - rect.left) / (rect.width / P.w),
			y : (e.clientY - rect.top) / (rect.height / P.h)
		};
	},
	touchStart : function(e,m){
		gm.touch = gm.touch || !m;
		var p = gm.pos(e);
		gm.lastPos = p;
		gm.stage.touchStart(p.x,p.y);
		
		window.scrollTo(0,1);
	},
	touchMove : function(e){
		e.preventDefault();
		if(gm.lastPos){
			var p = gm.pos(e);
			gm.lastPos = p;
			gm.stage.touchMove(p.x,p.y);
		}
	},
	touchEnd : function(e){
		e.preventDefault();
		if(gm.lastPos){
			gm.stage.touchEnd(gm.lastPos.x,gm.lastPos.y);
			gm.lastPos = null;
		}
	},
	keyDown : function(e){
		if(e.keyCode == 32 || e.keyCode == 40 || e.keyCode == 38) e.preventDefault();
		gm.stage.keyDown(e.keyCode);
	},
	mouseDown : function(e){
		if(!gm.touch){
			gm.touchStart(e,true);
		}
	},
	mouseMove : function(e){
		if(!gm.touch){
			gm.touchMove(e);
		}
	},
	mouseUp : function(e){
		if(!gm.touch){
			gm.touchEnd(e);
		}
	},
	launch : function(){
		gm.setStage(gp);
	},
	resize : function(){
		setTimeout(function(){
			var maxWidth = window.innerWidth;
			var maxHeight = window.innerHeight;

			var widht, height;

			var availableRatio = maxWidth / maxHeight;
			var baseRatio = P.w / P.h;
			var ratioDifference = Math.abs(availableRatio - baseRatio);

			var width, height;
			if(ratioDifference <= 0.17){
				width = maxWidth;
				height = maxHeight;
			}else if(availableRatio <= baseRatio){
				width = maxWidth;
				height = width / baseRatio;
			}else{
				height = maxHeight;
				width = height * baseRatio;
			}

			var c = document.getElementById('canvascontainer');
			c.style.width = width + 'px';
			c.style.height = height + 'px';
		},100);
	}
};

window.addEventListener('load',gm.init,false);
var gp = {
	init : function(){
		gp.state = 'menu';
		gp.ended = false;
		
		// TODO initial spawn
		gp.pfs = [gp.base = pf.create(0,P.bottomY,P.w * 5)];
		gp.els = [];
		
		tk.init();
		
		// Spawning stuff
		gp.nextPfSpawn = 0;
		gp.nextEnemySpawn = P.w;
		gp.nextItemSpawn = P.w * 2;
		
		// Score stuff
		gp.score = 0;
		gp.best = parseInt(localStorage.getItem('best') || 0) || 0;
		gp.combo = 1;
		
		// Lava stuff
		gp.wx = 0;
		gp.wy = gp.twy = P.h - 50;
		gp.rw = false;
		gp.nrw = 20;
		
		// Edge colors
		gp.edge = 'white';
		gp.hitT = 0;
		
		// Message
		gp.ms = null;
		gp.mst = 0;
		
		gp.smt = 0; // slow motion
		gp.it = 0; // invert view
		
		// Power up
		gp.pur = null;
		gp.pun = null;
		gp.pup = true;
		
		gp.cameraX = 0;
		
		gp.shot = gp.jumped = false;
		
		gp.console = [];
	},
	cycle : function(e){
		gp.smt -= e;
		if(gp.smt > 0){
			e *= .5;
		}
		
		with(ctx){
			save();
			
			fillStyle = '#000';
			fillRect(0,0,P.w,P.h);
			
			if(gp.state !== 'menu'){
				tk.cycle(e);
				gp.cameraX = ~~tk.x - 100;
			}else{
				gp.cameraX += e * 200;
			}
			
			gp.comboT -= e;
			if(gp.comboT <= 0){
				gp.combo = 1;
			}
			
			gp.hitT -= e;
			if(gp.hitT <= 0){
				gp.edge = 'white';
			}
			
			gp.it -= e;
			if(gp.it > 0){
				translate(P.w,0);
				scale(-1,1)
			}

			// Sky
			save();
			translate(rnd(-gp.cameraX / 4),0);
			fillStyle = sky;
			fRRect(gp.cameraX / 4,0,P.w,P.h);
			restore();

			// Hills
			save();
			translate(rnd(-gp.cameraX / 2),0);
			fillStyle = hills;
			fRRect(gp.cameraX / 2,0,P.w,P.h);
			restore();
			
			// Water : background
			gp.wx += e * 30;
			var wx = gp.wx + gp.cameraX * 1.1; //+ (Date.now() % 1000 < 500 ? 25 : 0);

			/*save();
			translate(-rnd(wx * .8),rnd(gp.wy - 20));
			fillStyle = water;
			fillRect(rnd(wx * .8),0,P.w,200);
			restore();*/

			save();
			translate(-rnd(gp.cameraX),0);

			i = -1;

			var i = -1;
			while(gp.pfs[++i]){
				gp.pfs[i].render();
			}

			i = gp.els.length;
			while(gp.els[--i]){
				gp.els[i].cycle(e);
			}
			tk.render();

			if(gp.cameraX + P.w >= gp.base.x + gp.base.l){
				gp.pfs.push(gp.base = pf.create(gp.base.x + gp.base.l + 50 + rd() * 150,P.bottomY,200 + rd() * P.w*2));
			}
			
			if(gp.jumped && gp.shot || gp.state === 'menu'){
				if(gp.cameraX + 50 > gp.nextPfSpawn){
					gp.spawnPf();
				}
				if(gp.cameraX + 50 > gp.nextEnemySpawn){
					gp.spawnEnemy();
				}
				if(gp.cameraX + 50 > gp.nextItemSpawn){
					gp.spawnItem();
				}
			}

			restore();

			// Water rising
			if(gp.shot && gp.jumped){
				gp.nrw -= e;
				if(gp.nrw <= 0){
					gp.riseWater();
				}
			}
			
			if(gp.twy < gp.wy){
				gp.wy = Math.max(gp.twy,gp.wy - e * 50);
			}else{
				gp.wy = Math.min(gp.twy,gp.wy + e * 50);
			}

			save();
			translate(-rnd(wx),rnd(gp.wy));
			fillStyle = water;
			fillRect(rnd(wx),0,rnd(P.w),200);
			restore();

			// Water fg
			save();
			translate(rnd(-wx * 1.2),rnd(gp.wy + 20));
			fillStyle = water;
			fillRect(rnd(wx * 1.2),0,P.w,200);
			restore();
		
			if(gp.state == 'play'){
				// Score
				var s = gp.score.toString(),n;
				dt(ctx,'red',s,rnd(P.w - 20) + P.maskSize,rnd(10) + P.maskSize,0,0,'right');
				dt(ctx,'white',s,rnd(P.w - 20),rnd(10),0,0,'right');
				
				if(gp.combo > 1 && (gp.comboT > 1 || gp.comboT % .2 > .1)){
					dt(ctx,'red','X' + gp.combo,rnd(P.w - 20) + P.maskSize,rnd(80) + P.maskSize,28,36,'right');
					dt(ctx,'white','X' + gp.combo,rnd(P.w - 20),rnd(80),28,36,'right');
				}
				
				// Tutorial
				var txt;
				if(!gp.jumped){
					globalAlpha = .5;
					fillStyle = '#00ff00';
					fillRect(0,0,P.w / 2,P.h);
					
					if(mobile){
						txt = ['tap to','jump'];
					}else{
						txt = ['up to','jump'];
					}

					globalAlpha = 1;
					dt(ctx,'black',txt[0],P.w / 4 + P.maskSize,P.h/2 - 100 + P.maskSize,0,0,'center');
					dt(ctx,'white',txt[0],P.w / 4,P.h/2 - 100,0,0,'center');
					
					dt(ctx,'black',txt[1],P.w / 4 + P.maskSize,P.h/2 + P.maskSize,0,0,'center');
					dt(ctx,'white',txt[1],P.w / 4,P.h/2,0,0,'center');
				}
				if(!gp.shot){
					globalAlpha = .5;
					fillStyle = 'red';
					fillRect(P.w / 2,0,P.w / 2,P.h);
					
					if(mobile){
						txt = ['tap to','shoot'];
					}else{
						txt = ['space to','shoot'];
					}

					globalAlpha = 1;
					dt(ctx,'black',txt[0],P.w * .75 + P.maskSize,P.h / 2 - 100 + P.maskSize,0,0,'center');
					dt(ctx,'white',txt[0],P.w * .75,P.h/2 - 100,0,0,'center');
					
					dt(ctx,'black',txt[1],P.w * .75 + P.maskSize,P.h/2 + P.maskSize,0,0,'center');
					dt(ctx,'white',txt[1],P.w * .75,P.h/2,0,0,'center');
				}
				
				// Health
				if(gp.jumped && gp.shot && !tk.dead){
					for(var i = 0, x = 10 ; i < tk.hl ; i++, x+= 35){
						drawImage(character_1,0,0,80,72,rnd(x),rnd(10),40,36);
					}
				}
				
				// Initialize game (after instructions)
				// TODO
				
				// Message
				gp.mst -= e;
				if(gp.mst > 0){
					var d = .2,
						x = P.w / 2,
						a = 1;
					
					if(gp.mst < d){
						x = P.w / 2 + (d - gp.mst) / d * P.w / 8;
						a = gp.mst / d;
					}
					
					if(gp.mst > 3 - d){
						x = P.w / 2 - (1 - (3 - gp.mst) / d) * P.w / 8;
						a = (3 - gp.mst) / d;
					}
					
					globalAlpha = a;
					dt(ctx,'black',gp.ms,rnd(x + P.maskSize), rnd(P.h / 2 - 50 + P.maskSize),0,0,'center');
					dt(ctx,'white',gp.ms,rnd(x), rnd(P.h / 2 - 50),0,0,'center');
					globalAlpha = 1;
				}
				
				// Power up
				if(gp.pun){
					var w = 300,h = 10, r = gp.pur(),y = 35;
					
					if(r > 0){
						gp.put += e;
						
						save();
						translate(0,Math.min(-50 + gp.put * 400,0));
						
						dt(ctx,'white',gp.pun,rnd(P.w / 2), rnd(10),14,18,'center');

						fillStyle = 'white';
						fRRect((P.w - w) / 2 - P.maskSize,y - P.maskSize,w + 2 * P.maskSize,h + 2 * P.maskSize);

						fillStyle = gp.pup ? '#00ff00' : 'red';
						fRRect((P.w - w) / 2,y,w * r,h);
						
						restore();
					}
				}
				
			}else if(gp.state == 'menu'){
				// Menu
				drawImage(logo,rnd((P.w - logo.width) / 2),rnd(200));
				
				var t = mobile ? 'Tap to play' : 'Space to play';
				if(Date.now() % 1000 < 500){
					dt(ctx,'black',t,P.w / 2 + P.maskSize / 2 + P.maskSize,rnd(400) + P.maskSize,28,36,'center');
					dt(ctx,'white',t,P.w / 2 + P.maskSize / 2,rnd(400),28,36,'center');
				}
			}else if(gp.state == 'end'){
				var w = 600,h = 300;
				
				gp.got += e;
				
				save();
				translate(0,Math.min(0,-P.h + gp.got * 2 * P.h));
				
				//fillStyle = 'red';
				//fRRect((P.w - w) / 2 - 2 * P.maskSize,(P.h - h) / 2 - 2 * P.maskSize,w + 4 * P.maskSize,h + 4 * P.maskSize);
				
				fillStyle = '#000';
				//fillStyle = '#950000';
				fRRect((P.w - w) / 2 + P.maskSize,(P.h - h) / 2 + P.maskSize,w + 2 * P.maskSize,h + 2 * P.maskSize);
				
				fillStyle = '#ffb800';
				//fillStyle = '#950000';
				fRRect((P.w - w) / 2 - P.maskSize,(P.h - h) / 2 - P.maskSize,w + 2 * P.maskSize,h + 2 * P.maskSize);
				
				fillStyle = '#000';
				fRRect((P.w - w) / 2,(P.h - h) / 2,w,h);
				
				dt(ctx,'red','Game Over',P.w / 2 + P.maskSize,rnd(60) + P.maskSize,0,0,'center');
				dt(ctx,'white','Game Over',P.w / 2,rnd(60),0,0,'center');
				
				dt(ctx,'white','Score ',rnd(550),rnd(170),0,0,'right');
				dt(ctx,'white',gp.score,rnd(550),rnd(170),0,0,'left');
				
				dt(ctx,'white','Best  ',rnd(550),rnd(280),0,0,'right');
				dt(ctx,'white',gp.best,rnd(550),rnd(280),0,0,'left');
				
				var t = mobile ? 'Tap to play again' : 'Space to play again';
				if(Date.now() % 1000 < 500){
					dt(ctx,'white',t,P.w / 2 + P.maskSize / 2,rnd(400),28,36,'center');
				}
				
				restore();
			}
				
			if(Date.now() - tk.ld < 80){
				fillStyle = 'red';
				fillRect(0,0,P.w,P.h);
			}
			
			fillStyle = mask;
			fillRect(0,0,P.w,P.h);
			
			restore();
		}
	},
	spawnPf : function(){
		var lvl = ~~(rd() * P.levels);
		var y = P.bottomY - (lvl + 1) * P.levelHeight;
		var l = 300 + ~~(rd() * 10) * 20;
		
		gp.pfs.push(pf.create(gp.cameraX + P.w + 100,y,l));
		
		// Deleting old stuff
		var i = gp.pfs.length;
		while(gp.pfs[--i]){
			if(gp.pfs[i].x + gp.pfs[i].l < gp.cameraX){
				gp.pfs.splice(i,1);
			}
		}
		
		// Sorting based on Y, then on X
		gp.pfs.sort(function(a,b){
			if(a.y != b.y){
				return a.y - b.y;
			}else{
				return a.x - b.x;
			}
		});
		
		// Fusing platforms
		for(var i = gp.pfs.length - 1 ; i >= 1 ; i--){
			if(gp.pfs[i].y == gp.pfs[i-1].y
			  && gp.pfs[i].x <= gp.pfs[i-1].x + gp.pfs[i-1].l + 50){
				//console.log('fuse');
				gp.pfs[i-1].l = gp.pfs[i].x + gp.pfs[i].l - gp.pfs[i-1].x;
				
				window.p1 = gp.pfs[i-1];
				window.p2 = gp.pfs[i];
				gp.pfs.splice(i,1);
				
				//throw new Error();
		   	}
		}
		
		gp.nextPfSpawn += rd() * (l + 100);
	},
	spawnEnemy : function(){
		var x = gp.cameraX + P.w + 50;
		
		// Getting platforms that are out of the screen
		var pfs = [];
		for(var i in gp.pfs){
			if(gp.pfs[i].x + gp.pfs[i].l - 20 > x && gp.pfs[i].x + 20 < x){
				pfs.push(gp.pfs[i]);
			}
		}
		
		if(pfs.length > 0){
			// Picking one randomly
			var p = pfs[~~(rd() * pfs.length)];

			// Adding the mine
			var t,r = rd();
			if(r < .33){
				t = er;
			}else if(r < .66){
				t = et;
			}else{
				t = mi;
		 	}
			gp.add(t.create(x,p.y));

			gp.nextEnemySpawn += 100 + rd() * P.w;
		}
	},
	spawnItem : function(){
		var x = gp.cameraX + P.w + 50;
		
		// Getting platforms that are out of the screen
		var pfs = [];
		for(var i in gp.pfs){
			if(gp.pfs[i].x + gp.pfs[i].l - 20 > x && gp.pfs[i].x + 20 < x){
				pfs.push(gp.pfs[i]);
			}
		}
		
		if(pfs.length > 0){
			// Picking one randomly
			var p = pfs[~~(rd() * pfs.length)];

			// Adding the mine
			var a,r = rd(),po = true;
			
			var a = [
				{
					a : tk.shield,
					p : true
				},{
					a : tk.shield,
					p : true
				},{
					a : tk.machineGun,
					p : true
				},{
					a : gp.slowmo,
					p : true
				},{
					a : tk.heal,
					p : true
				},{
					a : tk.unlimitedJumps,
					p : true
				},{
					a : gp.riseWater
				},{
					a : gp.invert
				},{
					a : tk.noshot
				}
			];
			
			var c = a[~~(Math.random() * a.length)];
			
			gp.add(it.create(x,p.y,c.a,c.p));

			gp.nextItemSpawn += P.w * 4;
		}
	},
	touchStart : function(x,y){
		if(gp.state === 'play'){
			gp.motionStart = {
				x : x,
				y : y
			};
			if(x > P.w / 2){
				tk.shoot();
			}else{
				tk.jump();
			}
		}
	},
	touchMove : function(x,y){
		if(gp.motionStart && gp.state === 'play'){
			var dY = y - gp.motionStart.y;
			if(Math.abs(dY) < 10 || dY < 0){
				gp.motionStart = null;
			}else{
				tk.down();
			}
		}
	},
	touchEnd : function(x,y){
		if(gp.state === 'menu'){
			// Launching the game
			gp.init();
			gp.state = 'play';
			
			audio.play('menu');
		}
		if(gp.state === 'end'){
			gp.init();
			audio.play('menu');
		}
	},
	keyDown : function(k){
		if(gp.state == 'play'){
			if(k == 38){
				tk.jump();
			}else if(k == 32){
				tk.shoot();
			}else if(k == 40){
				tk.down();
			}
		}
		if(gp.state == 'end' && k == 32){
			gp.init();
			audio.play('menu');
		}
		if(gp.state == 'menu' && k == 32){
			gp.init();
			gp.state = 'play';
			audio.play('menu');
		}
	},
	add : function(e){
		gp.els.push(e);
	},
	rm : function(e){
		var i = gp.els.indexOf(e);
		if(i >= 0) gp.els.splice(i,1);
	},
	riseWater : function(){
		if(gp.rw){
			gp.rw = false;
			gp.twy = P.h - 50;
			gp.nrw = 20;
		}else{
			gp.nrw = 5;
			gp.rw = true;
			gp.twy = P.h - 160;
			gp.sm('Lava is rising');
		}
	},
	end : function(){
		if(!gp.ended){
			gp.ended = true;
			
			gp.got = 0;
			
			gp.best = Math.max(gp.best,gp.score);
			try{
				localStorage.setItem('best',gp.best);
			}catch(e){}

			setTimeout(function(){
				gp.state = 'end';
			},1500);
		}
	},
	killed : function(e,s){
		var tmp = gp.score;
		var b = s * gp.combo;
		
		gp.score += b;
		
		if(tmp <= gp.best && gp.score > gp.best){
			gp.sm('New highscore');
		}
		
		gp.add(be.create(e,b));
		
		gp.combo++;
		gp.hit();
	},
	hit : function(){
		gp.comboT = 3;
		
		gp.edge = '#00ff00';
		gp.hitT = .1;
	},
	slowmo : function(){
		gp.smt = 10;
		gp.sm('Slow motion');
		gp.powerUp('slow motion',function(){
			return gp.smt / 10;
		},true);
	},
	sm : function(m){
		gp.ms = m;
		gp.mst = 3;
	},
	invert : function(){
		gp.it = 5;
		gp.sm('invert');
		gp.powerUp('inverted view',function(){
			return gp.it / 5;
		},false);
	},
	powerUp : function(n,r,p){
		gp.pun = n;
		gp.pur = r;
		gp.pup = p;
		gp.put = 0;
	}
};
var tk = {
	type : 'player',
	init : function(){
		tk.x = 0;
		tk.y = P.bottomY-1; // TODO land on first
		tk.vX = 400;
		tk.vY = 0;
		tk.dead = false;
		
		tk.nextFrame = 0;
		tk.curFrame = 0;
		tk.frames = [character_1,character_2,character_3,character_4,character_5,character_5,character_4,character_3,character_2];
		
		tk.jct = 0; // Jump count
		tk.ujt = 0; // unlimited jumps time
		
		tk.hl = 5; // health
		tk.ld = 0; // last damage
		tk.st = 0; // shield time
		
		tk.ns = 0; // next shot
		tk.mt = 0; // machine gun time
		tk.nst = 0; // no shot time
	},
	cycle : function(e){
		if(!tk.dead){
			var r = 50;
			
			// Falling from current platform
			if(tk.pf && tk.x > tk.pf.x + tk.pf.l + 20){
				tk.pf = null;
				tk.vY = 0; // avoiding sudden falling
			}
			
			// Unlimited jumps
			tk.ujt -= e;

			// If jumping
			if(!tk.pf){
				var tmpY = tk.y;
				
				tk.curFrame = 0;
				tk.nextFrame = .1;

				tk.vY += e * 3000;

				tk.y += tk.vY * e;

				var i = -1,p;
				while(p = gp.pfs[++i]){
					if(p.x - 20 <= tk.x && p.x + p.l >= tk.x // is over the platform
					   && tmpY <= p.y && tk.y >= p.y// goes through it
					  ){
						tk.y = p.y;
						tk.pf = p;
						tk.jct = 0;
						//tk.puffs(10,r,'#e4b036');
						if(tmpY !== tk.y){
							tk.puffs(10,'#00ff00',r);
						}
					}
				}
				
				if(tk.y > gp.wy + 50){
					tk.damage('red',60,2);
				}
			}

			tk.x += tk.vX * e;
			
			tk.nextFrame -= e;
			if(tk.nextFrame <= 0){
				tk.curFrame = (tk.curFrame + 1) % tk.frames.length;
				tk.nextFrame = .02;
			}
			
			if(!tk.pf){
				gp.add(te.create(tk.x,tk.y,tk.frames[tk.curFrame]));
			}
			
			// Shield stuff
			tk.st -= e;
			
			// Shots
			tk.ns -= e;
			tk.mt -= e;
			tk.nst -= e;
			if(tk.ns && tk.mt >= 0){
				tk.shoot();
			}
		}
	},
	puffs : function(n,c,r){
		r = r || 30;
		c = c || '#00ff00';
		for(var i = 0 ; i < n ; i++){
			if(c){
				gp.add(puff.create(
					tk.x - r + rd() * r * 2,
					tk.y - rd() * 30,
					rd() * 15 + 5,
					c
				));
			}
		}
	},
	damage : function(c,r,full){
		var n = Date.now();
		if(!tk.dead && (tk.st < 0 || full == 2) && (n - tk.ld > 2000 || full)){
			tk.hl -= full ? tk.hl : 1;
			r = r || 30;
			tk.puffs(20,'red',r);
			tk.ld = n;
			
			if(tk.hl <= 0){
				tk.hl = 0;
				tk.vY = 0;
				tk.vX = 0;

				for(var j = 0 ; j < 20 ; j++){
					var x = tk.x - r + rd() * r * 2;
					var y = tk.y - 20 - rd() * 20;

					gp.add(pt.create('#00ff00',x,y,x,tk.y));
				}

				tk.dead = true;
				gp.end();
			}
				
			audio.play('hit');
		}
	},
	jump : function(){
		if(!tk.dead && (tk.pf || tk.jct < 2 || tk.ujt > 0)){
			//tk.puffs(10,tk.pf ? '#e4b036' : 'white',20);
			tk.puffs(10,'#00ff00',20);
			tk.pf = null;
			tk.vY = -1100;
			tk.jct++;
			gp.jumped = true;
			
			audio.play('jump');
		}
	},
	down : function(){
		if(tk.pf && tk.y < P.bottomY){
			tk.pf = null;
			tk.vY = 0; // avoiding sudden falling
			tk.y++;
		}
	},
	shoot : function(){
		if(tk.ns <= 0 && !tk.dead && tk.nst <= 0){
			gp.add(bl.create(tk.x + 50,tk.y - 40,tk.vX + 400,gp.els,'enemy'));
			gp.shot = true;
							
			gp.add(puff.create(
				this.x + 25,
				this.y - 40,
				10,
				'yellow'
			));
			
			tk.ns = .15;
			
			audio.play('shoot');
		}
	},
	render : function(){
		var n = Date.now();
		if(!tk.dead && (n - tk.ld > 2000 || n % 200 > 100)){
			with(ctx){
				var f = tk.frames[tk.curFrame];
				drawImage(f,rnd(tk.x - f.width / 2),rnd(tk.y - f.height));
				//fillRect(tk.x,tk.y,100,100);
				
				globalAlpha = .5;
				fillStyle = '#00ff00';
				beginPath();
				if(tk.st > 0){
					arc(tk.x,tk.y - 30,(.5 - (tk.st % .5)) * 120,0,twopi,true);
				}
				fill();
				globalAlpha = 1;
			}
		}
	},
	shield : function(){
		tk.st = 5;
		gp.sm('Shield');
		
		gp.powerUp('shield',function(){
			return tk.st / 5;
		},true);
	},
	machineGun : function(){
		tk.mt = 5;
		gp.sm('Machine gun');
		
		gp.powerUp('machine gun',function(){
			return tk.mt / 5;
		},true);
	},
	heal : function(){
		tk.hl++;
		gp.sm('Health++');
	},
	noshot : function(){
		tk.nst = 5;
		gp.sm('Weapon locked');
		
		gp.powerUp('no weapon',function(){
			return tk.nst / 5;
		},false);
	},
	unlimitedJumps : function(){
		tk.ujt = 5;
		gp.sm('Unlimited jumps');
		
		gp.powerUp('unlimited jumps',function(){
			return tk.ujt / 5;
		},true);
	}
};
var pf = {
	create : function(x,y,l){
		return {
			x : x,
			y : y,
			l : l,
			render : function(){
				var x = this.x,y = this.y,l = this.l;
				
				with(ctx){
					var diffX = x - gp.cameraX - P.w / 2;
					var offsetLeft = (diffX / P.w) * 50;
					offsetLeft = rnd(Math.max(-50,offsetLeft));
					
					var offsetRight = ((diffX + l) / P.w) * 50;
					offsetRight = rnd(Math.max(-50,offsetRight));
					
					
					var h = rnd(25);
					
					miterLimit = 'bevel';
					
					save();
					translate(offsetLeft / 2,h/2);
					
					fillStyle = '#0d1c90';
					
					if(offsetLeft > 0){
						fRRect(x - offsetLeft,y - h,offsetLeft + P.maskSize,P.h - y + h);
					}
					if(offsetRight < 0){
						fRRect(x + l + P.maskSize,y - h,-offsetRight,P.h - y + h);
					}
					
					
					fillStyle = '#1025ce';
					fRRect(x,y,l+P.maskSize,P.h - y);
					
					fillStyle = '#3e7fff';
					strokeStyle = gp.edge;
					lineWidth = P.maskSize;
					beginPath();
					moveTo(x - offsetLeft,y - h + P.maskSize / 2);
					lineTo(x - offsetRight + l,y - h + P.maskSize / 2);
					lineTo(x + l,y + P.maskSize / 2);
					lineTo(x,y + P.maskSize / 2);
					closePath();
					fill();
					stroke();
					
					fillStyle = gp.edge;
					fRRect(x,y,P.maskSize,P.h - y);
					fRRect(x + l,y,P.maskSize,P.h - y);
					
					if(offsetRight < 0){
						fRRect(x + l - offsetRight,y - h,P.maskSize,P.h - y);
					}
					if(offsetLeft > 0){
						fRRect(x - offsetLeft + P.maskSize,y - h,-P.maskSize,P.h - y);
					}

					fillStyle = '#3e7fff';
					//fRRect(x,y,l,8);
					
					/*fillStyle = 'red';
					if(offsetRight < 0){
						fRRect(x + l,y - h,-offsetRight,P.h - y + h);
					}*/
					
					restore();
				}
			}
		}
	}
};
var puff = {
	create : function(x,y,r,c){
		return {
			x : x,
			y : y,
			r : r,
			c : c || 'silver',
			t : rd(),
			cycle : function(e){
				this.y -= e * 200;
				this.r -= e * 20;
				
				if(this.r <= 0){
					gp.rm(this);
				}
					//ctx.fillStyle = this.c;
					//ctx.beginPath();
					//ctx.arc(this.x,this.y,this.r,0,twopi,true);
					//ctx.fill();
				
				ctx.fillStyle = this.c;
				ctx.fillRect(rnd(this.x - this.r / 2),rnd(this.y - this.r / 2),this.r,this.r);
			}
		}
	}
};
var nc = function(w,h,dc){
	var e = document.createElement('canvas');
	e.width = w;
	e.height = h;
	
	var c = e.getContext('2d');
	c.can = e;
	c.fillStyle = dc;
	
	return {
		can : e,
		ctx : c
	}
};

var mask = (function(){
	var c = nc(P.maskSize,P.maskSize,'rgba(128,128,128,.5)');
	with(c.ctx){
		fillRect(0,0,1,P.maskSize);
		fillRect(0,0,P.maskSize,1);
		return createPattern(c.can,'repeat');
	}
})();

var hills = (function(){
	var c = nc(P.w,P.h);
	rts(c.ctx,'purple',[
		[0, 100 + 134 * 2,105 * 2,P.h],
		[105 * 2,100 + 79 * 2,64 * 2,P.h],
		[169 * 2,100 + 169 * 2,50 * 2,P.h],
		[219 * 2,100 + 132 * 2,107 * 2,P.h],
		[326 * 2,100 + 168 * 2,64 * 2,P.h],
		[386 * 2,100 + 219 * 2,34 * 2,P.h],
		[416 * 2,100 + 99 * 2,64 * 2,P.h]
	]);

	return c.ctx.createPattern(c.can,'repeat');
})();

var water = (function(){
	var c = nc(50,200,'orange');
	with(c.ctx){
		fillRect(0,0,25,200);
		fillRect(0,5,50,200);

		fillStyle = '#950000';
		fillRect(0,0,25,5);
		fillRect(25,5,25,5);

		return createPattern(c.can,'repeat');
	}
})();

var sky = (function(){
	var e = nc(P.w,P.h,'#cccccc');
	with(e.ctx){
		var pts = [
			[80,190],
			[300,150],
			[450,40],
			[800,130],
			[650,70],
			[50,30]
		];

		for(var i in pts){
			fillRect(rnd(pts[i][0]),rnd(pts[i][1]),rnd(50),rnd(50));
		}

		var g = createLinearGradient(0,0,0,P.h);
		g.addColorStop(0,'rgba(255,255,255,0)');
		g.addColorStop(1,'rgba(255,255,255,.5)');

		fillStyle = g;
		fillRect(0,0,P.w,P.h);
	
		return createPattern(e.can,'repeat');
	}
})();

var character_1 = (function(){
	var c = nc(80,72,'#00ff00');
	with(c.ctx){		
		scale(8,8);
		var rects = [
			[4,1,2,2],
			[3,3,3,1],
			[2,4,1,1],
			[4,4,1,3],
			[6,4,1,1],
			[5,6,2,1],
			[6,7,1,1],
			[2,7,2,1]
		];

		for(var i in rects){
			fillRect.apply(c.ctx,rects[i]);
		}
		
		fillStyle = 'red';
		fillRect(7,3,3,1);
		fillRect(7,4,1,1);
	}
	
	return c.can;
})();


var character_2 = (function(){
	var c = nc(80,72,'#00ff00');
	with(c.ctx){		
		scale(8,8);
		var rects = [
			[4,1,2,2],
			[3,3,3,1],
			[2,4,1,1],
			[4,4,1,3],
			[6,4,1,1],
			[2,7,2,1],
			[5,6,1,2],
			[6,8,1,1]
		];

		for(var i in rects){
			fillRect.apply(c.ctx,rects[i]);
		}
		
		fillStyle = 'red';
		fillRect(7,3,3,1);
		fillRect(7,4,1,1);
	}
	
	return c.can;
})();

var character_3 = (function(){
	var c = nc(80,72,'#00ff00');
	with(c.ctx){		
		scale(8,8);
		var rects = [
			[4,1,2,2],
			[3,3,3,1],
			[2,4,1,1],
			[4,4,1,3],
			[6,4,1,1],
			[5,6,1,3],
			[3,7,1,1],
			[2,8,1,1]
		];

		for(var i in rects){
			fillRect.apply(c.ctx,rects[i]);
		}
		
		fillStyle = 'red';
		fillRect(7,3,3,1);
		fillRect(7,4,1,1);
	}
	
	return c.can;
})();

var character_4 = (function(){
	var c = nc(80,72,'#00ff00');
	with(c.ctx){		
		scale(8,8);
		var rects = [
			[4,1,2,2],
			[3,3,3,1],
			[2,4,1,1],
			[4,4,1,3],
			[6,4,1,1],
			[5,6,1,3],
			[3,7,1,2]
		];

		for(var i in rects){
			fillRect.apply(c.ctx,rects[i]);
		}
		
		fillStyle = 'red';
		fillRect(7,3,3,1);
		fillRect(7,4,1,1);
	}
	
	return c.can;
})();

var character_5 = (function(){
	var c = nc(80,72,'#00ff00');
	with(c.ctx){		
		scale(8,8);
		var rects = [
			[4,1,2,2],
			[3,3,3,1],
			[2,4,1,1],
			[4,4,1,3],
			[6,4,1,1],
			[3,7,2,2]
		];

		for(var i in rects){
			fillRect.apply(c.ctx,rects[i]);
		}
		
		fillStyle = 'red';
		fillRect(7,3,3,1);
		fillRect(7,4,1,1);
	}
	
	return c.can;
})();

var tank = (function(){
	var c = nc(136,56);
	with(c.ctx){
		scale(2,2);
		
		// Body
		fillStyle = 'red';
		fillRect(10,10,54,12);
		fillRect(6,12,62,8);
		
		// Top
		fillRect(28,0,22,10);
		
		// Cannon
		fillRect(0,2,28,2);
		
		// Wheels
		fillRect(12,22,50,4);
		fillRect(14,26,46,2);
		
		fillRect(14,22,10,2);
		fillRect(26,22,10,2);
		fillRect(38,22,10,2);
		fillRect(50,22,10,2);
		
		fillRect(16,24,6,2);
		fillRect(28,24,6,2);
		fillRect(40,24,6,2);
		fillRect(52,24,6,2);
		
		return can;
	}
})();

var tankw = (function(){
	var c = nc(tank.width,tank.height);
	with(c.ctx){
		drawImage(tank,0,0);
		globalCompositeOperation = 'source-atop';
		
		fillStyle = '#ffffff';
		fillRect(0,0,200,200);
		
		return c.can;
	}
})();

var rifler = (function(){
	var c = nc(56,72);
	with(c.ctx){
		translate(56,0);
		scale(-4,4);
		
		// Body
		fillStyle = 'red';
		fillRect(4,4,4,4);
		fillRect(4,8,2,6);
		fillRect(2,6,2,2);
		fillRect(0,8,2,4);
		fillRect(6,12,2,6);
		fillRect(2,14,2,4);
		fillRect(8,8,2,2);
		
		// Helmet 
		fillRect(4,0,4,4);
		fillRect(8,2,2,2);
		
		// Weapon
		fillRect(2,10,4,2);
		fillRect(0,12,2,2);
		
		fillRect(6,10,8,2);
	}
	
	return c.can;
})();

var crate = (function(){
	var c = nc(40,40);
	with(c.ctx){
		scale(.5,.5);
		
		fillStyle = '#006a00';
		fillRect(12,12,56,56);
		
		for(var i = 12, j = 68 ; i <= 68 ; i += 4, j -= 4){
			fillStyle = '#004d00';
			fillRect(j,i - 12,4,4);
			fillRect(j + 4,i,4,4);
			
			fillStyle = '#00d500';
			fillRect(j-4,i,4,4);
			fillRect(j,i,4,4);
			fillRect(j - 4,i-4,4,4);
		}
		
		for(var i = 12, j = 68 ; i <= 68 ; i += 4, j -= 4){
			fillStyle = '#008f00';
				fillRect(i + 8,i,4,4);
				fillRect(i,i + 8,4,4);
			
			fillStyle = '#00ff00';
			fillRect(i,i,4,4);
			fillRect(i+4,i,4,4);
			fillRect(i,i + 4,4,4);
		}
		
		rts(c.ctx,'#0ff00',[
			[0,8,8,64],
			[72,8,8,64],
			[8,0,64,8],
			[8,72,64,8]
		]);
			
		rts(c.ctx,'#008f00',[
			[8,8,4,64],
			[8,8,64,4],
			[68,8,4,64],
			[8,68,64,4]
		]);
	}
	
	return c.can;
})();

var crater = (function(){
	var c = nc(40,40);
	with(c.ctx){
		scale(.5,.5);
		
		fillStyle = '#5d0000';
		fillRect(12,12,56,56);
		
		for(var i = 12, j = 68 ; i <= 68 ; i += 4, j -= 4){
			fillStyle = '#950000';
			fillRect(j,i - 12,4,4);
			fillRect(j + 4,i,4,4);
			
			fillStyle = '#d50000';
			fillRect(j-4,i,4,4);
			fillRect(j,i,4,4);
			fillRect(j - 4,i-4,4,4);
		}
		
		for(var i = 12, j = 68 ; i <= 68 ; i += 4, j -= 4){
			fillStyle = '#800000';
				fillRect(i + 8,i,4,4);
				fillRect(i,i + 8,4,4);
			
			fillStyle = '#d50000';
			fillRect(i,i,4,4);
			fillRect(i+4,i,4,4);
			fillRect(i,i + 4,4,4);
		}
		
		rts(c.ctx,'red',[
			[0,8,8,64],
			[72,8,8,64],
			[8,0,64,8],
			[8,72,64,8]
		]);
			
		rts(c.ctx,'#800000',[
			[8,8,4,64],
			[8,8,64,4],
			[68,8,4,64],
			[8,68,64,4]
		]);
	}
	
	return c.can;
})();

var chars = (function(){
	var rects = {
		a : [
			[10,10,50,10],
			[10,40,50,10],
			[10,10,10,70],
			[50,10,10,70]
		],
		b : [
			[10,10,50,10],
			[10,40,40,10],
			[10,70,50,10],
			[10,10,10,70],
			[50,10,10,30],
			[50,50,10,30]
		],
		c : [
			[10,10,50,10],
			[10,70,50,10],
			[10,10,10,70],
			[50,10,10,20],
			[50,60,10,20]
		],
		d : [
			[10,10,40,10],
			[10,70,40,10],
			[10,10,10,70],
			[50,20,10,50]
		],
		e : [
			[10,10,50,10],
			[10,40,40,10],
			[10,70,50,10],
			[10,10,10,70]
		],
		f : [
			[10,10,50,10],
			[10,40,40,10],
			[10,10,10,70]
		],
		g : [
			[10,10,50,10],
			[10,70,50,10],
			[10,10,10,70],
			[50,10,10,20],
			[50,60,10,20],
			[40,50,20,10]
		],
		h : [
			[10,40,50,10],
			[10,10,10,70],
			[50,10,10,70]
		],
		i : [
			[30,10,10,70],
			[20,10,30,10],
			[20,70,30,10]
		],
		j : [
			[40,10,10,70],
			[30,10,30,10],
			[20,70,30,10]
		],
		k : [
			[10,40,40,10],
			[10,10,10,70],
			[50,10,10,30],
			[50,50,10,30]
		],
		l : [
			[10,10,10,70],
			[10,70,40,10]
		],
		m : [
			[10,10,10,70],
			[50,10,10,70],
			[20,10,10,10],
			[40,10,10,10],
			[30,20,10,10]
		],
		n : [
			[10,10,10,70],
			[50,20,10,60],
			[20,20,10,10],
			[30,10,20,10]
			//[50,30,10,50]
		],
		o : [
			[10,10,50,10],
			[10,70,50,10],
			[10,20,10,50],
			[50,20,10,50]
		],
		p : [
			[10,10,50,10],
			[10,40,50,10],
			[10,10,10,70],
			[50,10,10,30]
		],
		q : [
			[10,10,50,10],
			[10,40,50,10],
			[10,10,10,30],
			[50,10,10,70]
		],
		r : [
			[10,10,50,10],
			[10,40,40,10],
			[10,10,10,70],
			[50,10,10,30],
			[50,50,10,30]
		],
		s : [
			[10,10,50,10],
			[10,70,50,10],
			[10,40,50,10],
			[50,50,10,20],
			[10,20,10,20]
		],
		t : [
			[30,10,10,70],
			[10,10,50,10]
		],
		u : [
			[10,70,50,10],
			[10,10,10,70],
			[50,10,10,70]
		],
		v : [
			[20,70,30,10],
			[10,10,10,60],
			[50,10,10,60]
		],
		w : [
			[20,70,10,10],
			[40,70,10,10],
			[10,10,10,60],
			[50,10,10,60],
			[30,20,10,50]
		],
		x : [
			//[10,70,50,10],
			[10,10,10,20],
			[50,10,10,20],
			[10,60,10,20],
			[50,60,10,20],
			
			[30,40,10,10],
			
			[20,30,10,10],
			[40,30,10,10],
			[40,50,10,10],
			[20,50,10,10]
		],
		y : [
			//[10,70,50,10],
			[10,10,10,20],
			[50,10,10,20],
			
			[30,40,10,40],
			
			[20,30,10,10],
			[40,30,10,10]
		],
		z : [
			//[10,70,50,10],
			[10,10,40,10],
			[10,70,50,10],
			[50,10,10,20],
			[10,60,10,20],
			
			[30,40,10,10],
			
			[40,30,10,10],
			[20,50,10,10]
		],
		'0' : [
			[10,10,50,10],
			[10,70,50,10],
			[10,10,10,70],
			[50,10,10,70]
		],
		'1' : [
			[50,10,10,70]
		],
		'2' : [
			[10,10,50,10],
			[10,70,50,10],
			[10,40,50,10],
			[50,20,10,20],
			[10,50,10,20]
		],
		'3' : [
			[10,10,50,10],
			[10,40,50,10],
			[10,70,50,10],
			[50,10,10,70]
		],
		'4' : [
			[10,10,10,60],
			[10,60,50,10],
			[40,50,10,30]
		],
		'5' : [
			[10,10,50,10],
			[10,70,50,10],
			[10,40,50,10],
			[50,50,10,20],
			[10,20,10,20]
		],
		'6' : [
			[10,10,50,10],
			[10,70,50,10],
			[10,10,10,70],
			[50,40,10,40],
			[10,40,50,10]
		],
		'7' : [
			[10,10,50,10],
			[50,10,10,70]
		],
		'8' : [
			[10,10,50,10],
			[10,70,50,10],
			[10,10,10,70],
			[50,10,10,70],
			[10,40,50,10]
		],
		'9' : [
			[10,10,50,10],
			[10,70,50,10],
			[10,10,10,40],
			[50,10,10,70],
			[10,40,50,10]
		],
		'+' : [
			[10,40,50,10],
			[30,20,10,50]
			//[10,70,50,10]
		]
	};


	var c,t = {},cs = ['white','red','purple','black'];
	for(var i in cs){
		t[cs[i]] = {};
		for(var j in rects){
			c = nc(70 * .8,90 * .8);
			c.ctx.scale(.8,.8);
			rts(c.ctx,cs[i],rects[j],false);

			t[cs[i]][j] = c.can;
		}
	}

	return t;
})();

var logo = (function(){
	var c = nc(620,70);
	
	dt(c.ctx,'black','Virtual War',P.maskSize * 3,P.maskSize * 3,0,0,'left');
	dt(c.ctx,'red','Virtual War',P.maskSize * 2,P.maskSize * 2,0,0,'left');
	dt(c.ctx,'purple','Virtual War',P.maskSize,P.maskSize,0,0,'left');
	dt(c.ctx,'white','Virtual War',0,0,0,0,'left');
	
	return c.can;
})();

var hexa = (function(){
	var c,a = [],t,i = 6;
	while(--i){
		c = nc(8 * 14 + P.maskSize / 2,18 + P.maskSize / 2);
		
		t = '0x' + (~~(0x100000 + rd() * 0xeeeeee)).toString(16);
		dt(c.ctx,'black',t,0,0,14,18,'left');
		dt(c.ctx,'red',t,P.maskSize / 2,P.maskSize / 2,14,18,'left');
		
		a.push(c.can);
	}
	
	return function(){
		return a[~~(rd() * a.length)];
	}
	
	var t = '0x' + (~~(0x100000 + rd() * 0xeeeeee)).toString(16);
	dt(ctx,'black',t,this.x,this.y - 100,14,18,'center');
	dt(ctx,'red',t,this.x + P.maskSize / 2,this.y - 100 + P.maskSize / 2,14,18,'center');
})();
var mi = {
	create : function(x,y){
		return {
			x : x,
			y : y,
			cycle : function(e){
				if(x < gp.cameraX - 20){
					gp.rm(this);
				}else if(Math.abs(tk.x - x) < 20 && Math.abs(tk.y - y) < 20){
					gp.rm(this);
					tk.damage('yellow',null,1);
					
					audio.play('explosion');
				}else{
					with(ctx){
						fillStyle = '#707070';
						fillStyle = 'red';
						fillRect(rnd(x - 30),rnd(y - 8),rnd(60),rnd(8));
						
						fillStyle = (Date.now() % 300) < 150 ? '#ffffff' : '#ff0000';
						fillRect(rnd(x - 8),rnd(y - 16),rnd(16),rnd(8));
					}
				}
			}
		};
	}
};
var et = {
	create : function(x,y){
		return {
			type : 'enemy',
			x : x,
			y : y,
			shootTimer : .5 + rd() * 1.1,
			l : 1,
			ld : 0,
			cycle : function(e){
				if(x < gp.cameraX - 50){
					gp.rm(this);
				}else{
					if(this.shootTimer > 0){
						this.shootTimer -= e;
						if(this.shootTimer <= 0){
							gp.add(bl.create(this.x - 70,this.y - 50,-400,[tk],'player',2));
							this.shootTimer = .7 + rd() * .7;
							
							
							gp.add(puff.create(
								this.x - 70,
								this.y - 50,
								20,
								'yellow'
							));
						}
					}
					
					
					var h = hexa();
					ctx.drawImage(h,this.x - h.width / 2,this.y - 100);
					
					ctx.drawImage(Date.now() - this.ld > 50 ? tank : tankw,this.x - tank.width / 2,this.y - tank.height);
				}
			},
			damage : function(){
				this.l -= .4;
				this.ld = Date.now();
				
				var r = 40;
				var particles = false;
				if(this.l <= 0){
					gp.rm(this);
					particles = true;
					gp.killed(this,30);
					audio.play('explosion');
				}else{
					gp.hit();
					audio.play('hit');
				}
				
				for(var j = 0 ; j < 20 ; j++){
					gp.add(puff.create(
						this.x - r + rd() * r * 2,
						this.y - rd() * 30,
						rd() * 15 + 5,
						'red'
					));

					if(particles){
						var x = this.x - r + rd() * r * 2;
						var y = this.y - 20 - rd() * 20;

						gp.add(pt.create('red',x,y,x,this.y));
					}
				}
			}
		};
	}
};
var er = {
	create : function(x,y){
		return {
			type : 'enemy',
			x : x,
			y : y,
			shootTimer : .5 + rd() * .5,
			cycle : function(e){
				if(x < gp.cameraX - 50){
					gp.rm(this);
				}else{
					if(this.shootTimer > 0){
						this.shootTimer -= e;
						if(this.shootTimer <= 0){
							gp.add(bl.create(this.x - 40,this.y - 25,-400,[tk],'player'));
							this.shootTimer = .8 + rd() * .6;
							
							gp.add(puff.create(
								this.x - 40,
								this.y - 25,
								10,
								'yellow'
							));
						}
					}
					
					var h = hexa();
					ctx.drawImage(h,this.x - h.width / 2,this.y - 100);
					ctx.drawImage(rifler,rnd(this.x - rifler.width / 2),rnd(this.y - rifler.height));
				}
			},
			damage : function(){
				var r = 30;
				for(var j = 0 ; j < 20 ; j++){
					gp.add(puff.create(
						this.x - r + rd() * r * 2,
						this.y - rd() * 30,
						rd() * 15 + 5,
						'red'
					));
					
					var x = this.x - r + rd() * r * 2;
					var y = this.y - 20 - rd() * 20;
					
					gp.add(pt.create('red',x,y,x,this.y));
				}
				gp.rm(this);
				
				gp.killed(this,10);
				
				audio.play('hit');
			}
		};
	}
};
var bl = {
	create : function(x,y,vX,ts,tt,s){
		return {
			x : x,
			y : y,
			vX : vX,
			ts : ts,
			tt : tt,
			s : s || 1,
			cycle : function(e){
				var bX = this.x;
				this.x += vX * e;
				
				if(this.x < gp.cameraX || this.y > gp.cameraX + P.w){
					gp.rm(this);
				}else{
					var a = this.ts;
					for(var i in a){
						var k1 = bX - a[i].x;
						var k2 = this.x - a[i].x;
						if(a[i].type == tt 
						   	&& (k1 >= 0 && k2 <= 0 || k1 <= 0 && k2 >= 0 || Math.abs(a[i].x - this.x) < 20)
							&& Math.abs(this.y + 30 - a[i].y) < 30 
						   	&& !a[i].dead
						  ){
							a[i].damage(this.s > 1 ? '#ffff00' : null);
							gp.rm(this);
							break;
						}
					}

					with(ctx){
						save();
						//translate(rnd(this.x),rnd(this.y));
						//scale(this.vX > 0 ? this.s : -this.s,this.s);
						
						//fillStyle = '#ff0000';
						//fillRect(-3,-3,6,6);
					
						fillStyle = '#ffffff';
						fillStyle = '#ff0000';
						fillRect(rnd(this.x - 10),rnd(this.y - 5),rnd(20),rnd(10));
						
						globalAlpha = .5;
						fillRect(this.vX > 0 ? rnd(this.x - 30):rnd(this.x + 10),rnd(this.y - 5),rnd(20),rnd(10));
						
						restore();
					//ctx.fillRect(this.x - 5,this.y - 10,10,5);
					}
				}
			}
		};
	}
};
var pt = {
	create : function(color,x,y,toX,toY){
		return {
			color : color,
			startX : x,
			startY : y,
			toX : toX,
			toY : toY,
			e : 0,
			d : rd() * .5 + .5,
			cycle : function(e){
				this.e += e;
				var r = 8;
				
				if(this.e > this.d){
					gp.rm(this);
				}
				
				var x = (this.toX  - this.startX) * (this.e / this.d) + this.startX;
				var y = Math.easeOutBounce(this.e,this.startY,this.toY - this.startY,this.d);
				
				ctx.fillStyle = this.color;
				ctx.fillRect(rnd(x - r/2),rnd(y - r/ 2),rnd(r),rnd(r));
			}
		}
	}
};
var be = {
	create : function(e,b){
		return {
			// Coords are applied on canvas (not camera)
			startX : e.x - gp.cameraX,
			startY : e.y,
			toX : P.w - 150,
			toY : 50,
			e : 0,
			d : .5,
			b : b,
			cycle : function(e){
				this.e += e;
				
				if(this.e > this.d){
					gp.rm(this);
				}
				
				var x = (this.toX  - this.startX) * (this.e / this.d) + this.startX;
				var y = (this.toY  - this.startY) * (this.e / this.d) + this.startY;
				
				with(ctx){
					save();
					translate(gp.cameraX,0);
					
					fillStyle = 'white';
					//fillRect(x,y,50,50);
					
					dt(ctx,'white','+'+this.b,x,y,20,30,'center');
					restore();
				}
			}
		}
	}
};
var te = {
	create : function(x,y,f){
		return {
			a : .5,
			cycle : function(e){
				this.a -= e * 2;
				if(this.a <= 0 || this.x < gp.cameraX - 20){
					gp.rm(this);
				}else{
					ctx.globalAlpha = this.a;
					ctx.drawImage(f,x-f.width / 2,y-f.height);
					ctx.globalAlpha = 1;
				}
			}
		}
	}
};
var it = {
	create : function(x,y,a,p){
		return {
			type : 'enemy',
			x : x,
			y : y,
			cycle : function(e){
				if(Math.abs(this.x - tk.x) < 20 && Math.abs(this.y - tk.y) < 20){
					this.damage();
				}
				
				ctx.drawImage(p ? crate : crater,rnd(x - crate.width / 2),rnd(y - crate.height));
			},
			damage : function(){
				var r = 30;
				for(var j = 0 ; j < 20 ; j++){
					gp.add(puff.create(
						this.x - r + rd() * r * 2,
						this.y - rd() * 30,
						rd() * 15 + 5,
						p ? '#00ff00' : 'red'
					));
					
					var x = this.x - r + rd() * r * 2;
					var y = this.y - 20 - rd() * 20;
					
					gp.add(pt.create(p ? '#00ff00' : 'red',x,y,x,this.y));
				}
				gp.rm(this);
				gp.hit(); // for combo
				
				a();
		
				audio.play(p ? 'powerup' : 'malus');
			}
		}
	}
};
/**
 * SfxrParams
 *
 * Copyright 2010 Thomas Vian
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author Thomas Vian
 */
/** @constructor */
function SfxrParams() {
  //--------------------------------------------------------------------------
  //
  //  Settings String Methods
  //
  //--------------------------------------------------------------------------

  /**
   * Parses a settings array into the parameters
   * @param array Array of the settings values, where elements 0 - 23 are
   *                a: waveType
   *                b: attackTime
   *                c: sustainTime
   *                d: sustainPunch
   *                e: decayTime
   *                f: startFrequency
   *                g: minFrequency
   *                h: slide
   *                i: deltaSlide
   *                j: vibratoDepth
   *                k: vibratoSpeed
   *                l: changeAmount
   *                m: changeSpeed
   *                n: squareDuty
   *                o: dutySweep
   *                p: repeatSpeed
   *                q: phaserOffset
   *                r: phaserSweep
   *                s: lpFilterCutoff
   *                t: lpFilterCutoffSweep
   *                u: lpFilterResonance
   *                v: hpFilterCutoff
   *                w: hpFilterCutoffSweep
   *                x: masterVolume
   * @return If the string successfully parsed
   */
  this.setSettings = function(values)
  {
    for ( var i = 0; i < 24; i++ )
    {
      this[String.fromCharCode( 97 + i )] = values[i] || 0;
    }

    // I moved this here from the reset(true) function
    if (this['c'] < .01) {
      this['c'] = .01;
    }

    var totalTime = this['b'] + this['c'] + this['e'];
    if (totalTime < .18) {
      var multiplier = .18 / totalTime;
      this['b']  *= multiplier;
      this['c'] *= multiplier;
      this['e']   *= multiplier;
    }
  }
}

/**
 * SfxrSynth
 *
 * Copyright 2010 Thomas Vian
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author Thomas Vian
 */
/** @constructor */
function SfxrSynth() {
  // All variables are kept alive through function closures

  //--------------------------------------------------------------------------
  //
  //  Sound Parameters
  //
  //--------------------------------------------------------------------------

  this._params = new SfxrParams();  // Params instance

  //--------------------------------------------------------------------------
  //
  //  Synth Variables
  //
  //--------------------------------------------------------------------------

  var _envelopeLength0, // Length of the attack stage
      _envelopeLength1, // Length of the sustain stage
      _envelopeLength2, // Length of the decay stage

      _period,          // Period of the wave
      _maxPeriod,       // Maximum period before sound stops (from minFrequency)

      _slide,           // Note slide
      _deltaSlide,      // Change in slide

      _changeAmount,    // Amount to change the note by
      _changeTime,      // Counter for the note change
      _changeLimit,     // Once the time reaches this limit, the note changes

      _squareDuty,      // Offset of center switching point in the square wave
      _dutySweep;       // Amount to change the duty by

  //--------------------------------------------------------------------------
  //
  //  Synth Methods
  //
  //--------------------------------------------------------------------------

  /**
   * Resets the runing variables from the params
   * Used once at the start (total reset) and for the repeat effect (partial reset)
   */
  this.reset = function() {
    // Shorter reference
    var p = this._params;

    _period       = 100 / (p['f'] * p['f'] + .001);
    _maxPeriod    = 100 / (p['g']   * p['g']   + .001);

    _slide        = 1 - p['h'] * p['h'] * p['h'] * .01;
    _deltaSlide   = -p['i'] * p['i'] * p['i'] * .000001;

    if (!p['a']) {
      _squareDuty = .5 - p['n'] / 2;
      _dutySweep  = -p['o'] * .00005;
    }

    _changeAmount =  1 + p['l'] * p['l'] * (p['l'] > 0 ? -.9 : 10);
    _changeTime   = 0;
    _changeLimit  = p['m'] == 1 ? 0 : (1 - p['m']) * (1 - p['m']) * 20000 + 32;
  }

  // I split the reset() function into two functions for better readability
  this.totalReset = function() {
    this.reset();

    // Shorter reference
    var p = this._params;

    // Calculating the length is all that remained here, everything else moved somewhere
    _envelopeLength0 = p['b']  * p['b']  * 100000;
    _envelopeLength1 = p['c'] * p['c'] * 100000;
    _envelopeLength2 = p['e']   * p['e']   * 100000 + 12;
    // Full length of the volume envelop (and therefore sound)
    // Make sure the length can be divided by 3 so we will not need the padding "==" after base64 encode
    return ((_envelopeLength0 + _envelopeLength1 + _envelopeLength2) / 3 | 0) * 3;
  }

  /**
   * Writes the wave to the supplied buffer ByteArray
   * @param buffer A ByteArray to write the wave to
   * @return If the wave is finished
   */
  this.synthWave = function(buffer, length) {
    // Shorter reference
    var p = this._params;

    // If the filters are active
    var _filters = p['s'] != 1 || p['v'],
        // Cutoff multiplier which adjusts the amount the wave position can move
        _hpFilterCutoff = p['v'] * p['v'] * .1,
        // Speed of the high-pass cutoff multiplier
        _hpFilterDeltaCutoff = 1 + p['w'] * .0003,
        // Cutoff multiplier which adjusts the amount the wave position can move
        _lpFilterCutoff = p['s'] * p['s'] * p['s'] * .1,
        // Speed of the low-pass cutoff multiplier
        _lpFilterDeltaCutoff = 1 + p['t'] * .0001,
        // If the low pass filter is active
        _lpFilterOn = p['s'] != 1,
        // masterVolume * masterVolume (for quick calculations)
        _masterVolume = p['x'] * p['x'],
        // Minimum frequency before stopping
        _minFreqency = p['g'],
        // If the phaser is active
        _phaser = p['q'] || p['r'],
        // Change in phase offset
        _phaserDeltaOffset = p['r'] * p['r'] * p['r'] * .2,
        // Phase offset for phaser effect
        _phaserOffset = p['q'] * p['q'] * (p['q'] < 0 ? -1020 : 1020),
        // Once the time reaches this limit, some of the    iables are reset
        _repeatLimit = p['p'] ? ((1 - p['p']) * (1 - p['p']) * 20000 | 0) + 32 : 0,
        // The punch factor (louder at begining of sustain)
        _sustainPunch = p['d'],
        // Amount to change the period of the wave by at the peak of the vibrato wave
        _vibratoAmplitude = p['j'] / 2,
        // Speed at which the vibrato phase moves
        _vibratoSpeed = p['k'] * p['k'] * .01,
        // The type of wave to generate
        _waveType = p['a'];

    var _envelopeLength      = _envelopeLength0,     // Length of the current envelope stage
        _envelopeOverLength0 = 1 / _envelopeLength0, // (for quick calculations)
        _envelopeOverLength1 = 1 / _envelopeLength1, // (for quick calculations)
        _envelopeOverLength2 = 1 / _envelopeLength2; // (for quick calculations)

    // Damping muliplier which restricts how fast the wave position can move
    var _lpFilterDamping = 5 / (1 + p['u'] * p['u'] * 20) * (.01 + _lpFilterCutoff);
    if (_lpFilterDamping > .8) {
      _lpFilterDamping = .8;
    }
    _lpFilterDamping = 1 - _lpFilterDamping;

    var _finished = false,     // If the sound has finished
        _envelopeStage    = 0, // Current stage of the envelope (attack, sustain, decay, end)
        _envelopeTime     = 0, // Current time through current enelope stage
        _envelopeVolume   = 0, // Current volume of the envelope
        _hpFilterPos      = 0, // Adjusted wave position after high-pass filter
        _lpFilterDeltaPos = 0, // Change in low-pass wave position, as allowed by the cutoff and damping
        _lpFilterOldPos,       // Previous low-pass wave position
        _lpFilterPos      = 0, // Adjusted wave position after low-pass filter
        _periodTemp,           // Period modified by vibrato
        _phase            = 0, // Phase through the wave
        _phaserInt,            // Integer phaser offset, for bit maths
        _phaserPos        = 0, // Position through the phaser buffer
        _pos,                  // Phase expresed as a Number from 0-1, used for fast sin approx
        _repeatTime       = 0, // Counter for the repeats
        _sample,               // Sub-sample calculated 8 times per actual sample, averaged out to get the super sample
        _superSample,          // Actual sample writen to the wave
        _vibratoPhase     = 0; // Phase through the vibrato sine wave

    // Buffer of wave values used to create the out of phase second wave
    var _phaserBuffer = new Array(1024),
        // Buffer of random values used to generate noise
        _noiseBuffer  = new Array(32);
    for (var i = _phaserBuffer.length; i--; ) {
      _phaserBuffer[i] = 0;
    }
    for (var i = _noiseBuffer.length; i--; ) {
      _noiseBuffer[i] = Math.random() * 2 - 1;
    }

    for (var i = 0; i < length; i++) {
      if (_finished) {
        return i;
      }

      // Repeats every _repeatLimit times, partially resetting the sound parameters
      if (_repeatLimit) {
        if (++_repeatTime >= _repeatLimit) {
          _repeatTime = 0;
          this.reset();
        }
      }

      // If _changeLimit is reached, shifts the pitch
      if (_changeLimit) {
        if (++_changeTime >= _changeLimit) {
          _changeLimit = 0;
          _period *= _changeAmount;
        }
      }

      // Acccelerate and apply slide
      _slide += _deltaSlide;
      _period *= _slide;

      // Checks for frequency getting too low, and stops the sound if a minFrequency was set
      if (_period > _maxPeriod) {
        _period = _maxPeriod;
        if (_minFreqency > 0) {
          _finished = true;
        }
      }

      _periodTemp = _period;

      // Applies the vibrato effect
      if (_vibratoAmplitude > 0) {
        _vibratoPhase += _vibratoSpeed;
        _periodTemp *= 1 + Math.sin(_vibratoPhase) * _vibratoAmplitude;
      }

      _periodTemp |= 0;
      if (_periodTemp < 8) {
        _periodTemp = 8;
      }

      // Sweeps the square duty
      if (!_waveType) {
        _squareDuty += _dutySweep;
        if (_squareDuty < 0) {
          _squareDuty = 0;
        } else if (_squareDuty > .5) {
          _squareDuty = .5;
        }
      }

      // Moves through the different stages of the volume envelope
      if (++_envelopeTime > _envelopeLength) {
        _envelopeTime = 0;

        switch (++_envelopeStage)  {
          case 1:
            _envelopeLength = _envelopeLength1;
            break;
          case 2:
            _envelopeLength = _envelopeLength2;
        }
      }

      // Sets the volume based on the position in the envelope
      switch (_envelopeStage) {
        case 0:
          _envelopeVolume = _envelopeTime * _envelopeOverLength0;
          break;
        case 1:
          _envelopeVolume = 1 + (1 - _envelopeTime * _envelopeOverLength1) * 2 * _sustainPunch;
          break;
        case 2:
          _envelopeVolume = 1 - _envelopeTime * _envelopeOverLength2;
          break;
        case 3:
          _envelopeVolume = 0;
          _finished = true;
      }

      // Moves the phaser offset
      if (_phaser) {
        _phaserOffset += _phaserDeltaOffset;
        _phaserInt = _phaserOffset | 0;
        if (_phaserInt < 0) {
          _phaserInt = -_phaserInt;
        } else if (_phaserInt > 1023) {
          _phaserInt = 1023;
        }
      }

      // Moves the high-pass filter cutoff
      if (_filters && _hpFilterDeltaCutoff) {
        _hpFilterCutoff *= _hpFilterDeltaCutoff;
        if (_hpFilterCutoff < .00001) {
          _hpFilterCutoff = .00001;
        } else if (_hpFilterCutoff > .1) {
          _hpFilterCutoff = .1;
        }
      }

      _superSample = 0;
      for (var j = 8; j--; ) {
        // Cycles through the period
        _phase++;
        if (_phase >= _periodTemp) {
          _phase %= _periodTemp;

          // Generates new random noise for this period
          if (_waveType == 3) {
            for (var n = _noiseBuffer.length; n--; ) {
              _noiseBuffer[n] = Math.random() * 2 - 1;
            }
          }
        }

        // Gets the sample from the oscillator
        switch (_waveType) {
          case 0: // Square wave
            _sample = ((_phase / _periodTemp) < _squareDuty) ? .5 : -.5;
            break;
          case 1: // Saw wave
            _sample = 1 - _phase / _periodTemp * 2;
            break;
          case 2: // Sine wave (fast and accurate approx)
            _pos = _phase / _periodTemp;
            _pos = (_pos > .5 ? _pos - 1 : _pos) * 6.28318531;
            _sample = 1.27323954 * _pos + .405284735 * _pos * _pos * (_pos < 0 ? 1 : -1);
            _sample = .225 * ((_sample < 0 ? -1 : 1) * _sample * _sample  - _sample) + _sample;
            break;
          case 3: // Noise
            _sample = _noiseBuffer[Math.abs(_phase * 32 / _periodTemp | 0)];
        }

        // Applies the low and high pass filters
        if (_filters) {
          _lpFilterOldPos = _lpFilterPos;
          _lpFilterCutoff *= _lpFilterDeltaCutoff;
          if (_lpFilterCutoff < 0) {
            _lpFilterCutoff = 0;
          } else if (_lpFilterCutoff > .1) {
            _lpFilterCutoff = .1;
          }

          if (_lpFilterOn) {
            _lpFilterDeltaPos += (_sample - _lpFilterPos) * _lpFilterCutoff;
            _lpFilterDeltaPos *= _lpFilterDamping;
          } else {
            _lpFilterPos = _sample;
            _lpFilterDeltaPos = 0;
          }

          _lpFilterPos += _lpFilterDeltaPos;

          _hpFilterPos += _lpFilterPos - _lpFilterOldPos;
          _hpFilterPos *= 1 - _hpFilterCutoff;
          _sample = _hpFilterPos;
        }

        // Applies the phaser effect
        if (_phaser) {
          _phaserBuffer[_phaserPos % 1024] = _sample;
          _sample += _phaserBuffer[(_phaserPos - _phaserInt + 1024) % 1024];
          _phaserPos++;
        }

        _superSample += _sample;
      }

      // Averages out the super samples and applies volumes
      _superSample *= .125 * _envelopeVolume * _masterVolume;

      // Clipping if too loud
      buffer[i] = _superSample >= 1 ? 32767 : _superSample <= -1 ? -32768 : _superSample * 32767 | 0;
    }

    return length;
  }
}

// Adapted from http://codebase.es/riffwave/
var synth = new SfxrSynth();
// Export for the Closure Compiler
window['jsfxr'] = function(settings) {
  // Initialize SfxrParams
  synth._params.setSettings(settings);
  // Synthesize Wave
  var envelopeFullLength = synth.totalReset();
  var data = new Uint8Array(((envelopeFullLength + 1) / 2 | 0) * 4 + 44);
  var used = synth.synthWave(new Uint16Array(data.buffer, 44), envelopeFullLength) * 2;
  var dv = new Uint32Array(data.buffer, 0, 44);
  // Initialize header
  dv[0] = 0x46464952; // "RIFF"
  dv[1] = used + 36;  // put total size here
  dv[2] = 0x45564157; // "WAVE"
  dv[3] = 0x20746D66; // "fmt "
  dv[4] = 0x00000010; // size of the following
  dv[5] = 0x00010001; // Mono: 1 channel, PCM format
  dv[6] = 0x0000AC44; // 44,100 samples per second
  dv[7] = 0x00015888; // byte rate: two bytes per sample
  dv[8] = 0x00100002; // 16 bits per sample, aligned on every two bytes
  dv[9] = 0x61746164; // "data"
  dv[10] = used;      // put number of samples here

  // Base64 encoding written by me, @maettig
  used += 44;
  var i = 0,
      base64Characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
      output = 'data:audio/wav;base64,';
  for (; i < used; i += 3)
  {
    var a = data[i] << 16 | data[i + 1] << 8 | data[i + 2];
    output += base64Characters[a >> 18] + base64Characters[a >> 12 & 63] + base64Characters[a >> 6 & 63] + base64Characters[a & 63];
  }
  return output;
}

var audio = {
	init : function(){
		audio.map = {};
	},
	prepare : function(soundId,count,settings){
		if(!mobile){
			audio.map[soundId] = [];

			for(var i = 0 ; i < settings.length ; i++){
				audio.map[soundId].push({
					sounds : [],
					currentIndex : 0
				});

				for(var k = 0 ; k < count ; k++){
					var a = new Audio();
					a.src = jsfxr(settings[i]);

					audio.map[soundId][i].sounds.push(a);
				}
			}
		}
	},
	play : function(sid){
		if(!mobile){
			var s = audio.map[sid];

			// Random sound "tone"
			var iid = ~~(rd() * s.length);

			// Incrementing the current index
			s[iid].currentIndex = (s[iid].currentIndex + 1) % s[iid].sounds.length;

			// Playing
			s[iid].sounds[s[iid].currentIndex].play();
		}
	}
};
