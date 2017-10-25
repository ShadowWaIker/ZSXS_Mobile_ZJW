/*! code by rebeta at 20170629 */

/*! 排错*/

if("undefined" == typeof returnCitySN)returnCitySN = {cip: "0.0.0.0", cid: "140900", cname: "山西省忻州市"};

/*! 首页 */
function indexOnload() {
	document.title="欢迎报考忻州师范学院！";
	$('#zc').replaceWith('<div id="zc"></div>')
	$('#kx').replaceWith('<div id="kx"></div>')
	$.post('content.php', { type: 'zc' }, function(response){
		response = JSON.parse(response);
		$("#zc").append('<div class="card"><a href="./content.html?id='+response.content_id+'" class="link" external>'
							+'<div style="background:rgba(76, 217, 114, 0.37);color:black;" valign="bottom" class="card-header color-white no-border">'+response.title+'</div></a>'
							+'<div class="card-content">'
								+'<div class="card-content-inner">'
									+'<p class="color-gray">发布时间&nbsp;'+response.release_date+'&nbsp;&nbsp;&nbsp;&nbsp;阅读量&nbsp;'+response.views+'</p>'
									+'<p>'+(response.description == null ? '' : response.description)+'</p>'
								+'</div>'
							+'</div>'
							+'<div class="card-footer">'
								+'<a href="#" class="link like" id="'+response.content_id+'"><img src="./images/appreciate.png" height="50%"><span class="badge">'+response.content_like+'</span></a>'
								+'<a href="./content.html?id='+response.content_id+'" class="link" external>更多</a>'
							+'</div></div>');
    })
	$.post('content.php', { type: 'kx' }, function(response){
		response = JSON.parse(response);
		for (key in response){
				$("#kx").append('<div class="card"><a href="./content.html?id='+response[key].content_id+'" class="link" external>'
							+'<div style="background:#e7e7e7;color:black;" valign="bottom" class="card-header color-white no-border">'+response[key].title+'</div></a>'
							+'<div class="card-content">'
								+'<div class="card-content-inner">'
									+'<p class="color-gray">发布时间&nbsp;'+response[key].release_date+'&nbsp;&nbsp;&nbsp;&nbsp;阅读量&nbsp;'+response[key].views+'</p>'
									+'<p>'+(response[key].description == null ? '' : response[key].description)+'</p>'
								+'</div>'
							+'</div>'
							+'<div class="card-footer">'
								+'<a href="#" class="link like" id="'+response[key].content_id+'"><img src="./images/appreciate.png" height="50%"><span class="badge">'+response[key].content_like+'</span></a>'
								+'<a href="./content.html?id='+response[key].content_id+'" class="link" external>更多</a>'
							+'</div></div>');
			}
    })
}

$(document).on('click','.like', function (e) {
	var num = e.currentTarget.innerText;
	var id = e.currentTarget.id;
	$.post('content.php', { type: 'like',id: id }, function(response){
		response = JSON.parse(response);
		if(response.status == 'fail'){
			$.alert(response.res, '失败');
		}else{
			$("#"+id).replaceWith('<a href="#" class="link" id="'+id+'"><img src="./images/appreciated.png" height="50%"><span class="badge">'+(++num)+'</span></a>');
		}
    })
});

/*! 文章内容 */

function contentOnload() {
	var Request = new Object();
	Request = GetRequest();
	var id = Request['id'];
	$.post('content.php', { type: 'loadContent',id: id }, function(response){
		response = JSON.parse(response);
		if(response.status == 'fail'){
			$.alert(response.res, '失败');
		}else{
			$("#content-title").replaceWith(response.info.title);
			$("#content-time").replaceWith(response.info.release_date);
			$("#content-read").replaceWith(response.info.views);
			$("#content-like").replaceWith(response.info.content_like);
			$("#content-res").replaceWith(response.info.txt);
			document.title=response.info.title;
		}
    })
}

function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

/*! 录取进程 */
function progressOnload() {
	$.post('api.php', { type: 'progress' }, function(response){
		response ? response : response = '<h3 style="text-align:center;margin: 65% 0;">加载失败</h3>'
		$("#progress").replaceWith(response);
    })
}

/*! 历年分数 */
function scoreOnload() {
	$('#nf').replaceWith('<select id="nf"><option value="%">全部</option></select>')
	$.post('api.php', { type: 'scoreOnload' }, function(response){
		if(response){
			response = JSON.parse(response);
			for (key in response.nf){
				$('#nf').append('<option value="'+response.nf[key]+'">'+response.nf[key]+'</option>')
			}
			$('#nf').val(response.nf[0]);
			scoreLoadSF();
		} else {
			$.alert('加载失败,请稍后再试！');
			return ;
		}
    })
}

function scoreLoadSF() {
	$('#sf').replaceWith('<select id="sf"><option value="%">全部</option></select>')
	$("#sf").change(function() { scoreLoadLB(); });
	$.post('api.php', { type: 'scoreLoadSF', nf: $('#nf').val()}, function(response){
		if(response){
			response = JSON.parse(response);
			for (key in response.sfres){
				$('#sf').append('<option value="'+response.sfres[key].sfdm+'">'+response.sfres[key].sf+'</option>')
			}
			$('#sf').val(returnCitySN["cid"].substring(0,2))
			scoreLoadLB();
		} else {
			$.alert('加载失败,请稍后再试！');
			return ;
		}
    })
}

function scoreLoadLB() {
	$('#lb').replaceWith('<select id="lb"><option value="%">全部</option></select>');
	$("#lb").change(function() { scoreLoadRes(); }); 
	$.post('api.php', { type: 'scoreLoadLB', nf: $('#nf').val(), sf: $('#sf').val() }, function(response){
		if(response){
			if(response == '[]'){
				$.alert('请选择省份！');
				return ;
			}
			response = JSON.parse(response);
			for (key in response){
				$('#lb').append('<option value="'+response[key]+'">'+response[key]+'</option>')
			}
			$('#lb').val('%');
			scoreLoadRes()
		} else {
			$.alert('加载失败,请稍后再试！');
			return ;
		}
	})
}

function scoreLoadRes() {
	$('#scoreres').replaceWith('<div id="scoreres"></div>');
	$.post('api.php', { type: 'scoreLoadRes', nf: $('#nf').val(), sf: $('#sf').val(), klmc: $('#lb').val() }, function(response){
		if(response){
			response = JSON.parse(response);
			var i = 1;
			for (key1 in response){
				$('#scoreres').append('<div class="content-block-title" style="margin: .75rem .75rem .5rem;">'+response[key1][0].kslx+'</div><div class="list-block"><ul id="scoreres'+response[key1][0].jhrs+'">')
				for (key2 in response[key1]){
					$('#scoreres'+response[key1][0].jhrs).append('<li class="item-content item-link"><div class="item-media"><i class="icon icon-f7"></i></div>'
									+'<div class="item-inner create-ScorePopup" id="'+response[key1][key2].nf+','+response[key1][key2].sfdm+','+response[key1][key2].lb+','+response[key1][key2].klmc+','+response[key1][key2].zymc+'">'
									+'<div class="item-title">'+response[key1][key2].zymc+'</div>'
									+'<div class="item-after">'+response[key1][key2].cj_min+'</div></div></li>')
				}
				$('#scoreres').append('</ul></div>')
			}
		} else {
			$.alert('加载失败,请稍后再试！');
			return ;
		}
	})
}

$(document).on('click','.create-ScorePopup', function (e) {
	var info = e.currentTarget.id.split(",");
	$.post('api.php', { type: 'scorePopup', nf: info[0], sfdm: info[1], lb: info[2], klmc: info[3], zymc: info[4] }, function(response){
		if(response){
			response = JSON.parse(response);
			var popupHTML = '<div class="popup">'+
                    '<div class="content-block">'+
						                      '<p style="width:95%;text-align:right;"><a href="#" class="close-popup">关闭</a></p>'+
											  '<H1 style="text-align:center;">'+response.zymc+'('+response.lbmc+')</H1>'+
											  '<h3 style="text-align:center;margin-top:-1rem;">录取人数&nbsp;'+response.jhrs+'</h3>'+
	'<div class="content-block-title">录取信息</div>'+
  '<div class="list-block">'+
    '<ul>'+
      '<li class="item-content">'+
        '<div class="item-inner">'+
          '<div class="item-title">年份</div>'+
          '<div class="item-after">'+response.nf+'年</div>'+
        '</div>'+
      '</li>'+
      '<li class="item-content">'+
        '<div class="item-inner">'+
          '<div class="item-title">省份</div>'+
          '<div class="item-after">'+response.sf+'</div>'+
        '</div>'+
      '</li>'+
	  '<li class="item-content">'+
        '<div class="item-inner">'+
          '<div class="item-title">类型</div>'+
          '<div class="item-after">'+response.kslx+'</div>'+
        '</div>'+
      '</li>'+
	  '<li class="item-content">'+
        '<div class="item-inner">'+
          '<div class="item-title">类别</div>'+
          '<div class="item-after">'+response.lb+'['+response.klmc+']</div>'+
        '</div>'+
      '</li>'+
    '</ul>'+
  '</div>'+
  '<div class="content-block-title">文化成绩</div>'+
  '<div class="list-block">'+
    '<ul>'+
      '<li class="item-content">'+
        '<div class="item-inner">'+
          '<div class="item-title">最高分</div>'+
          '<div class="item-after">'+response.cj_max+'</div>'+
        '</div>'+
      '</li>'+
      '<li class="item-content">'+
        '<div class="item-inner">'+
          '<div class="item-title">最低分</div>'+
          '<div class="item-after">'+response.cj_min+'</div>'+
        '</div>'+
      '</li>'+
	  '<li class="item-content">'+
        '<div class="item-inner">'+
          '<div class="item-title">平均分</div>'+
          '<div class="item-after">'+response.cj_avg+'</div>'+
        '</div>'+
      '</li>'+
    '</ul>'+
  '</div>'
  if(response.zycj_min > 0){
	 var popupHTML = popupHTML+'<div class="content-block-title">专业成绩</div>'+
  '<div class="list-block">'+
    '<ul>'+
      '<li class="item-content">'+
        '<div class="item-inner">'+
          '<div class="item-title">最高分</div>'+
          '<div class="item-after">'+response.zycj_max+'</div>'+
        '</div>'+
      '</li>'+
      '<li class="item-content">'+
        '<div class="item-inner">'+
          '<div class="item-title">最低分</div>'+
          '<div class="item-after">'+response.zycj_min+'</div>'+
        '</div>'+
      '</li>'+
	  '<li class="item-content">'+
        '<div class="item-inner">'+
          '<div class="item-title">平均分</div>'+
          '<div class="item-after">'+response.zycj_avg+'</div>'+
        '</div>'+
      '</li>'+
    '</ul>'+
  '</div>'+
                    '</div>'+
                  '</div>'
  }
  
				  	$.popup(popupHTML);
		} else {
			$.alert('加载失败,请稍后再试！');
			return ;
		}
	})
});

/*! 招生计划 */
function planOnload() {
	$('#nf').replaceWith('<select id="nf"></select>')
	$('#sf').replaceWith('<select id="sf"><option value="%">全部</option></select>')
	$.post('api.php', { type: 'planOnload' }, function(response){
		if(response){
			response = JSON.parse(response);
			for (key in response.nf){
				$('#nf').append('<option value="'+response.nf[key]+'">'+response.nf[key]+'</option>')
			}
			for (key in response.sfres){
				$('#sf').append('<option value="'+response.sfres[key].SYSSDM+'">'+response.sfres[key].SYSSMC+'</option>')
			}
			$('#nf').val(response.nf[0]);
			$('#sf').val(returnCitySN["cid"].substring(0,2))
			planLoadLB();
		} else {
			$.alert('加载失败,请稍后再试！');
			return ;
		}
    })
}

function planLoadLB() {
	$('#lb').replaceWith('<select id="lb"><option value="%">全部</option></select>');
	$("#lb").change(function() { planLoadRes(); }); 
	$.post('api.php', { type: 'planLoadLB', nf: $('#nf').val(), sf: $('#sf').val() }, function(response){
		if(response){
			if(response == '[]'){
				$.alert('请选择省份！');
				return ;
			}
			response = JSON.parse(response);
			for (key in response){
				$('#lb').append('<option value="'+response[key].kldm+'">'+response[key].klmc+'</option>')
			}
			$('#lb').val('%');
			planLoadRes()
		} else {
			$.alert('加载失败,请稍后再试！');
			return ;
		}
	})
}

function planLoadRes() {
	$('#planres').replaceWith('<div id="planres"></div>');
	$.post('api.php', { type: 'planLoadRes', nf: $('#nf').val(), sf: $('#sf').val(), kldm: $('#lb').val() }, function(response){
		if(response){
			response = JSON.parse(response);
			for (key1 in response){
				$('#planres').append('<div class="content-block-title" style="margin: .75rem .75rem .5rem;">'+response[key1][0].PCMC+'</div><div class="list-block"><ul id="planResUl'+response[key1][0].PCDM+'">')
				for (key2 in response[key1]){
					$('#planResUl'+response[key1][0].PCDM).append('<li class="item-content item-link"><div class="item-media"><i class="icon icon-f7"></i></div>'
									+'<div class="item-inner create-PlanPopup" id="'+response[key1][key2].JHID+'">'
									+'<div class="item-title">'+response[key1][key2].ZSZYMC+((response[key1][key2].ZYLBMC=='师范类') ? '<span class="badge">师</span>' : '')+((response[key1][key2].JHXZMC=='非西藏生定藏就业') ? '<span class="badge">藏</span>' : '')+'</div>'
									+'<div class="item-after">'+response[key1][key2].ZSJHS+'&nbsp人</div></div></li>')
				}
				$('#planres').append('</ul></div>')
			}
		} else {
			$.alert('加载失败,请稍后再试！');
			return ;
		}
	})
}

$(document).on('click','.create-PlanPopup', function (e) {
	var info = e.currentTarget.id;
	$.post('api.php', { type: 'planPopup', JHID: info }, function(response){
		if(response){
			response = JSON.parse(response);
			var popupHTML = '<div class="popup">'+
                    '<div class="content-block">'+
						                      '<p style="width:95%;text-align:right;"><a href="#" class="close-popup">关闭</a></p>'+
											  '<H1 style="text-align:center;">'+response.ZSZYMC+'</H1>'+
											  '<h3 style="text-align:center;margin-top:-1rem;">招生计划&nbsp;'+response.ZSJHS+'人</h3>'+
                      '<div class="content-block-title">详细信息</div>'+
  '<div class="list-block">'+
		'<ul>'+
		'<li class="item-content">'+
        '<div class="item-inner">'+
          '<div class="item-title">层次</div>'+
          '<div class="item-after">'+response.CCMC+'</div>'+
        '</div>'+
      '</li>'+
		'<li class="item-content">'+
        '<div class="item-inner">'+
          '<div class="item-title">批次</div>'+
          '<div class="item-after">'+response.PCMC+'</div>'+
        '</div>'+
      '</li>'+
	  '<li class="item-content">'+
        '<div class="item-inner">'+
          '<div class="item-title">科类</div>'+
          '<div class="item-after">'+response.KLMC+'</div>'+
        '</div>'+
      '</li>'+
	  '<li class="item-content">'+
        '<div class="item-inner">'+
          '<div class="item-title">师范类别</div>'+
          '<div class="item-after">'+((response.ZYLBMC=='师范类') ? response.ZYLBMC : '非师范类')+'</div>'+
        '</div>'+
      '</li>'+
		'<li class="item-content">'+
        '<div class="item-inner">'+
          '<div class="item-title">是否口试</div>'+
          '<div class="item-after">'+response.SFKS+'</div>'+
        '</div>'+
      '</li>'+
	  '</li>'+
		'<li class="item-content">'+
        '<div class="item-inner">'+
          '<div class="item-title">计划类别</div>'+
          '<div class="item-after">'+response.JHLBMC+'</div>'+
        '</div>'+
      '</li>'+
	  '</li>'+
		'<li class="item-content">'+
        '<div class="item-inner">'+
          '<div class="item-title">计划性质</div>'+
          '<div class="item-after">'+response.JHXZMC+'</div>'+
        '</div>'+
      '</li>'+
      '<li class="item-content">'+
        '<div class="item-inner">'+
          '<div class="item-title">办学校区</div>'+
          '<div class="item-after">'+response.BXDD+'</div>'+
        '</div>'+
      '</li>'+
	  '<li class="item-content">'+
        '<div class="item-inner">'+
          '<div class="item-title">办学地点</div>'+
          '<div class="item-after">'+response.BXDDSSMC+response.BXDDDJSMC+response.BXDDQXMC+'</div>'+
        '</div>'+
      '</li>'+
      '<li class="item-content">'+
        '<div class="item-inner">'+
          '<div class="item-title">所在系</div>'+
          '<div class="item-after">'+response.YXBMMC+'</div>'+
        '</div>'+
      '</li>'+
	  '<li class="item-content">'+
        '<div class="item-inner">'+
          '<div class="item-title">学制</div>'+
          '<div class="item-after">'+response.XZMC+'</div>'+
        '</div>'+
      '</li>'+
	  '<li class="item-content">'+
        '<div class="item-inner">'+
          '<div class="item-title">学费</div>'+
          '<div class="item-after">'+response.SFBZ+'</div>'+
        '</div>'+
      '</li>'+
    '</ul>'+
  '</div>'+
                    '</div>'+
                  '</div>'
				  	$.popup(popupHTML);
		} else {
			$.alert('加载失败,请稍后再试！');
			return ;
		}
	})
});