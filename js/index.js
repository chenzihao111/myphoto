document.addEventListener('touchstart', function(e) {
	e.preventDefault();
});

(function(){
	var box = document.querySelector('#main');
	var inner = box.querySelector('#inner');
	var list = document.getElementById('contentBox');
	var oLoad = box.querySelector('#load');
	var lis = list.children;
	var oDialog = document.querySelector('#dialog');
	var oBigImgBox = document.querySelector('#bigImg');
	console.log(oBigImgBox)
	console.log(lis)
	var dataImg = [];
	//0-25
	for(var i=0; i<50; i++){
		dataImg.push("pics/" + (i%16+1) + ".jpg");
	}
	var isEnd = false;
	var start =0;
	var length = 8; //一次加载几张


	creatLi()
	function creatLi(){
		if(start>dataImg.length){
			oLoad.innerHTML = "NO Image";
			setTimeout(function(){
				oLoad.style.opacity = 0;
				MTween({
					el:inner,
					target:{translateY:-inner.offsetHeight+box.clientHeight},
					time:300,
					type:'easeBoth'
				})					
			},1000)
			return
		}
		var end = start + length;
		end = end<dataImg.length?end:dataImg.length;
		for(var i=start; i<end; i++){
			var li = document.createElement('li');		
			li.src =  dataImg[i]
			li.isload = true;	
			console.log(li)	
			li.addEventListener('touchstart',function(){
                  this.isMove = false; 
			},false)			
			li.addEventListener('touchmove',function(){
                  this.isMove = true; 
			},false)			
			li.addEventListener('touchend',function(){
				if(this.isMove)return;
				oDialog.style.transition = "1s";
				oDialog.style.transform = "scale(1,1)";
				console.log(oBigImgBox)
				console.log(this.children[0].src)
				oBigImgBox.src = this.children[0].src;
			},false)
			box.children[0].children[0].appendChild(li)
		}
		createImg();
		oLoad.style.opacity = 0;
	}
	/*判断li是否进入到box可视区*/	
	function createImg(){
	   var boxRect = box.getBoundingClientRect();
	   var boxBottom = boxRect.bottom;
       for(var i=0; i<lis.length; i++){
		   var liTop = lis[i]. getBoundingClientRect().top;
		   if(liTop<boxBottom && lis[i].isload){
			   lis[i].isload =false;
			   showImg(lis[i])
		   }  //当前Li进入box可视区
	   }
	}
	/*进入到后创建Li里面对应的图片*/
	function showImg(li){
		var img = new Image();
		img.src = li.src;
		img.onload = function(){
			li.appendChild(img);
			setTimeout(function(){
				img.style.opacity = 1;
			},30)
		}
		img.onerror = function(){
		}		
	}
	function setScroll(){
		/*添加contentBox的上下滑动效果*/
		mScroll({
			el:box,
			offBar: false,
			start : function(e){
				console.log('手指按下要执行的函数')
				var innerRect = Math.round(css(inner,"translateY"));
				var minTop = box.clientHeight - inner.offsetHeight
				if(innerRect-5 < minTop){
					oLoad.style.opacity = 1;
					isEnd = true;
				}else{
					oLoad.style.opacity = 0;
					isEnd = false;
				}
			},
			move : function(){
				createImg()
				console.log('滚动时发生的距离')
			},
			end : function(e){
				var innerRect = Math.round(css(inner,"translateY"));
				var minTop = box.clientHeight - inner.offsetHeight
				if(innerRect-5 <= minTop && isEnd){
					    start+=length;
					    creatLi()
						
                        clearInterval(inner.timer) // 清除回弹
				}
			}			
		})		 
	}
	setBigImg()
	setScroll()
})()
function setBigImg(){
	window.onload = function(){
		var oImg = document.querySelector('#bigImg');
		
		/*多指操作-图片旋转和缩放start*/
		var startRotate = 0;
		var startScale = 0;
		var maxScale = 1.5;
		var minScale = .5;	
		css(oImg,"translateZ",.1)
		setGesture({
			el:oImg,
			start:function(e){
				startScale = css(this,'scale')/100;		
				startRotate = css(this,'rotate');
			},
			change:function(e){
				var scale = startScale * e.scale;
				if(scale > maxScale){
					scale = maxScale;
				} else if(scale < minScale){
					scale = minScale;
				}				
				css(this,'scale',scale*100)
				css(this,'rotate',startRotate+e.rotation)
			},
			end:function(e){
				var deg = css(this,'rotate');
				deg = Math.round(deg/90);
				deg = deg*90;
				MTween({
					el:this,
					target:{rotate:deg},
					time: 300, 
					type: "easeBoth"
				}); 
			}
		})
		
		/*鼠标控制按钮-操作图片*/
		var oImgControl = document.querySelector('#imgControl');
		var oLi = oImgControl.querySelectorAll('li');
		var timer;
		
		//封装改变图片的方法
		var setImg = {
			imgMove:function(target,show){
				var currentDeg = css(target,'rotate')
				var currentScale = css(target,'scale')
				console.log(currentDeg)
				switch(show){
					case 'leftDeg': 
					   currentDeg = Math.round(currentDeg/90)-1;
					   currentDeg = currentDeg*90;
					   break;
					case 'rightDeg': 
					   currentDeg = Math.round(currentDeg/90)+1;
					   currentDeg = currentDeg*90;
					   break;
					case 'scale+': 
					   currentScale *= 1.1;
					   break;
					case 'scale-': 
					   currentScale *= .9;
					   break;				   				   				      
				}
				
				MTween({
					el:target,
					target:{rotate:currentDeg,scale:currentScale},
					time:300,
					type:'easeBoth'
				})				
			},
			setRotate : function(init){
				init.el.addEventListener('touchstart',function(){
					init.fn(init.target,init.show)
					timer = setInterval(function(){
						init.fn.call(init,init.target,init.show)
					},1000)
				},false)			
			},
			touchEnd: function(init){
				for(var i=0; i<init.el.length; i++){
					init.el[i].addEventListener('touchend',function(){
						clearInterval(timer)
					},false)				
				}			
			}	
		}
	
		//向左旋转90
		setImg.setRotate({
			el:oLi[0],
			target:oImg,
			fn:setImg.imgMove,
			show: 'leftDeg'
		})
		//向右旋转90
		setImg.setRotate({
			el:oLi[1],
			target:oImg,
			fn:setImg.imgMove,
			show: 'rightDeg'
		})
		//放大
		setImg.setRotate({
			el:oLi[2],
			target:oImg,
			fn:setImg.imgMove,
			show: 'scale+'
		})	
		//缩小
		setImg.setRotate({
			el:oLi[3],
			target:oImg,
			fn:setImg.imgMove,
			show: 'scale-'
		})	
		//清除定时器			
		setImg.touchEnd({
			el:[oLi[0],oLi[1],oLi[2],oLi[3]]
		})
		
		/*关闭dialog大图显示层*/	
		var oreturnBtn = document.querySelector('#returnBtn');
		oreturnBtn.addEventListener('touchend',function(){
			var oDialog = document.querySelector('#dialog');
			oDialog.style.transform = 'scale(0,0)'
		},false)	
	}
}
function mScroll(init){
	if(!init.el){
		return;
	}
	var wrap = init.el;
	var inner = init.el.children[0];
	var scrollBar = document.createElement("div");	
	var startPoint = 0;
	var startEl = 0;
	var lastY = 0;
	var lastDis = 0;
	var lastTime = 0;
	var lastTimeDis = 0;
	var back = document.documentElement.clientWidth/8;
	var maxTranslate = wrap.clientHeight - inner.offsetHeight;
	if(!init.offBar){
		var scale = wrap.clientHeight/inner.offsetHeight;
		inner.style.minHeight = "100%";
		scrollBar.style.cssText = "width:4px;background:rgba(0,0,0,.5);position:absolute;right:0;top:0;border-radius:2px;opacity:0;transition:.3s opacity;";
		wrap.appendChild(scrollBar);
	}
	css(inner,"translateZ",0.01);
	inner.addEventListener('touchstart', function(e) {
		maxTranslate = wrap.clientHeight - inner.offsetHeight;
		if(!init.offBar){
			if(maxTranslate >= 0) {
				scrollBar.style.display = "none";
			} else {
				scrollBar.style.display = "block";
			}
			scale = wrap.clientHeight/inner.offsetHeight;
			scrollBar.style.height = wrap.clientHeight * scale + "px";
		}
		clearInterval(inner.timer);
		startPoint = e.changedTouches[0].pageY;
		startEl = css(inner,"translateY");
		lastY = startEl;
		lastTime = new Date().getTime();
		lastTimeDis = lastDis = 0;
		(init.offBar)||(scrollBar.style.opacity = 1);
		init.start && init.start();
	});
	inner.addEventListener('touchmove', function(e) {
		var nowTime = new Date().getTime();
		var nowPoint = e.changedTouches[0].pageY;
		var dis = nowPoint - startPoint;
		var translateY = startEl + dis;
		if(translateY>back){
			translateY=back
		}else if(translateY < maxTranslate - back){
			translateY = maxTranslate - back;
		}
		css(inner,"translateY",translateY);
		(init.offBar)||css(scrollBar,"translateY",-translateY*scale);
		lastDis = translateY - lastY;
		lastY = translateY;
		lastTimeDis = nowTime - lastTime;
		lastTime = nowTime;
		init.move　&& init.move();
	});
	inner.addEventListener('touchend', function(e) {
		var type = "easeOut";
		var speed = Math.round(lastDis / lastTimeDis*10);
		speed = lastTimeDis <= 0?0 :speed;
		var target = Math.round(speed*30 + css(inner,"translateY"));
		
		if(target > 0){
			target = 0;
			type = "backOut";
		} else if(target < maxTranslate){
			target = maxTranslate;
			type = "backOut";
		}
		
		MTween({
			el:inner,
			target: {translateY:target},
			time: Math.round(Math.abs(target - css(inner,"translateY"))*1.8),
			type: type,
			callBack: function(){
				(init.offBar) || (scrollBar.style.opacity = 0);
			},
			callIn: function(){
				var translateY = css(inner,"translateY");
				init.offBar||css(scrollBar,"translateY",-translateY*scale);
				init.move　&& init.move();
			}
		});
		init.end　&& init.end();
	});
}

function getDis(point1,point2){
	var x = point2.x - point1.x;
	var y = point2.y - point1.y;
	return Math.sqrt(x*x + y*y);
}
function getDeg(point1,point2){
	var x = point2.x - point1.x;
	var y = point2.y - point1.y;
	return Math.atan2(y,x)*180/Math.PI; 
}
function setGesture(init){
	var el = init.el;
	var isGestrue = false; 
	var startPoint = [];
	if(!el){
		return;
	}
	el.addEventListener('touchstart', function(e) {
		if(e.touches.length >= 2){
			isGestrue = true; //记录当前用户触发了gesture
			startPoint[0] = {x:e.touches[0].pageX,y:e.touches[0].pageY};
			startPoint[1] = {x:e.touches[1].pageX,y:e.touches[1].pageY}; 
			init.start&&init.start.call(el,e);
		}
	});
	el.addEventListener('touchmove', function(e) {
		if(isGestrue&&e.touches.length >= 2){
			var nowPoint = [];
			nowPoint[0] = {x:e.touches[0].pageX,y:e.touches[0].pageY};
			nowPoint[1] = {x:e.touches[1].pageX,y:e.touches[1].pageY};
			var startDis = getDis(startPoint[0],startPoint[1]);
			var nowDis = getDis(nowPoint[0],nowPoint[1]);
			var startDeg = getDeg(startPoint[0],startPoint[1]);
			var nowDeg = getDeg(nowPoint[0],nowPoint[1]);
			e.scale = nowDis/startDis;
			e.rotation = nowDeg - startDeg;
			init.change&&init.change.call(el,e);
		}
	});
	el.addEventListener('touchend', function(e) {
		if(isGestrue){
			if(e.touches.length < 2 || e.targetTouches.length < 1){
				isGestrue = false;
				init.end&&init.end.call(el,e);
			}
		}
	});
}