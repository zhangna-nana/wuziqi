$(function(){
	var canvasS = 600;
	var row = 15;
	var blockS = canvasS/row;
	var ctx = $('#canvas').get(0).getContext('2d');
	$('#canvas').get(0).height = canvasS;
  $('#canvas').get(0).width = canvasS;

	var off = blockS/2+0.5;
	  var draw = function() {
      var beijing = new Image();
      beijing.src='bg.jpg';
      beijing.onload = function(){
        ctx.drawImage(beijing,0,0,600,600);
        ctx.save();
    		ctx.beginPath();
    		for(var i=0;i<15;i++){
    			if(i===0){
    				ctx.translate(off,off)
    			}else{
    				ctx.translate(0,blockS)
    			}
    			ctx.moveTo(0,0);
    			ctx.lineTo(canvasS-blockS,0);
    		}
    		ctx.stroke();
    		ctx.closePath();
    		ctx.restore();


    		ctx.save();
    		ctx.beginPath();
    		for(var i=0;i<15;i++){
    			if(i===0){
    				ctx.translate(off,off)
    			}else{
    				ctx.translate(blockS,0)
    			}
    			ctx.moveTo(0,0);
    			ctx.lineTo(0,canvasS-blockS);
    		}
    		ctx.stroke();
    		ctx.closePath();
    		ctx.restore();


    	// 五个小点儿
    		var points = [11.5*blockS+0.5,3.5*blockS+0.5];
    		for(var i=0;i<2;i++){
    			for(var j=0;j<2;j++){
    				var x = points[i];
    				var y = points[j];
    				ctx.save();
    				ctx.beginPath();
    				ctx.translate(x,y);
    				ctx.arc(0,0,3,0,(Math.PI/180)*360)
    				ctx.fill();
    				ctx.closePath();
    				ctx.restore();
    			}
    		}
    		ctx.save();
    		ctx.beginPath();
    		ctx.translate(7.5*blockS+0.5,7.5*blockS+0.5);
    		ctx.arc(0,0,3,0,(Math.PI/180)*360);
    		ctx.fill();
    		ctx.closePath();
    		ctx.restore();
      }
	}
	draw();

	/// 点击添加棋子
	var step = 1;
	var kaiguan = true;
	var All = {};
	var qiziRadius = blockS/2*0.8;
	var drop = function( qizi ){
		ctx.save();
		ctx.beginPath();
		ctx.translate((qizi.x+0.5)*blockS,(qizi.y+0.5)*blockS);
		ctx.arc(0,0,qiziRadius,0,(Math.PI/180)*360);
    var gradient= ctx.createRadialGradient(0,-8,1,0,0,qiziRadius);
    if(qizi.color==1){
      $('#heiqi').get(0).play();
       gradient.addColorStop(0,"#6C6C6C");
       gradient.addColorStop(1,"#010101");
    }else if(qizi.color==0){
      $('#baiqi').get(0).play();
      gradient.addColorStop(0,"#FDFDFD");
       gradient.addColorStop(1,"#C1C1C1");
    }
    ctx.fillStyle=gradient;
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}

	$('#canvas').on('click',function(e){
		var x = Math.floor( e.offsetX/blockS);
    	var y = Math.floor( e.offsetY/blockS);
    	if(All[x+'-'+y]){
    		return;
    	}
    	if(kaiguan){
    		kaiguan=false;
    		var qizi = {x:x,y:y,color:1,step:(step+1)};
    		drop(qizi);
    		if(panduan(qizi)){
          $('.shade').show()
          $('.tips').css({background:'url(bg1.jpg)'});
    			return;
    		}
    	}else{
    		kaiguan=true;
    		var qizi = {x:x,y:y,color:0,step:(step+1)};
    		drop(qizi);
    		if(panduan(qizi)){
          $('.shade').show()
          $('.tips').css({background:'url(bg2.jpg)'});
    			return;
    		}
    	}
    	All[x+'-'+y] = qizi;
	})
	// 游戏是否获胜
	var panduan = function(qizi){
		var shuju = {};
    	$.each(All,function(k,v){
    	  if( v.color === qizi.color ){
    	    shuju[k] = v;
    	  }
    	})
    	var shu = 1,hang=1,zuoxie=1,youxie=1;
    	var tx,ty;
	// 竖向规则
		tx = qizi.x; ty = qizi.y;
    	while ( shuju [ tx + '-' + (ty + 1) ]){
    	  shu ++;ty++;
    	}
    	tx = qizi.x; ty = qizi.y;
    	while ( shuju [ tx + '-' + (ty - 1) ]){
    	  shu ++; ty--;
    	}
    // 横向规则
    	tx = qizi.x ; ty = qizi.y;
    	while( shuju[ (tx+1) + '-' + ty ] ){
    	  hang++;tx++;
    	}
    	tx = qizi.x ; ty = qizi.y;
    	while( shuju[ (tx-1) + '-' + ty ] ){
    	  hang++;tx--;
    	}

    // 斜向规则
    	tx = qizi.x; ty = qizi.y;
    	while( shuju[ (tx-1) + '-' + (ty-1) ] ){
    	  zuoxie++;tx--;ty--;
    	}
    	tx = qizi.x ; ty = qizi.y;
    	while( shuju[ (tx+1) + '-' + (ty+1) ] ){
    	  zuoxie++;tx++;ty++;
    	}

    	tx = qizi.x ; ty = qizi.y;
    	while( shuju[ (tx+1) + '-' + (ty-1) ] ){
    	  youxie++;tx++;ty--;
    	}
    	tx = qizi.x ; ty = qizi.y;
    	while( shuju[ (tx-1) + '-' + (ty+1) ] ){
    	  youxie++;tx--;ty++;
    	}
    	if( shu >=5  || hang>=5 || zuoxie>=5 || youxie>=5){
      		return true;
    	}
	}
//弹出界面操作
  $('.tips').on('click',false);
  $('#close').on('click',function(){
    $('.shade').hide();
  })
  $('#restart').on('click',function(){
    ctx.clearRect(0,0,600,600);
    All={};
    draw();
    $('.shade').hide();

  })
  $('.shade').on('click',function(){
    $(this).hide();
  })
})
