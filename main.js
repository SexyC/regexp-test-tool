(function() {

	function RegExpMatch() {
		$('#matchText').val('');
		$('#matchGroupText').val('');
		$('#shareUrl').css('display', 'none');

		var text = $('#originText').val();
		var re = $('#regExp').val();
		try {
			re = eval(re);
			if(re instanceof RegExp) {
				console.log('js正则表达式格式正确');
			} else {
				console.log('js正则表达式格式错误');
				return;
			}
		} catch(e) {
			console.log('js正则表达式格式错误');
			return;
		}

		var result = null;
		var cnt = 0;
		var matchOutput = '';
		var groupOutput = '';

		if(!re.global) {

			result = re.exec(text);
			if(result) {
				matchOutput = '找到匹配\n';
				matchOutput += result[0] + '\n';

				for(var i = 1; ; ++i) {
					try {
						var groupContent = result[i];
						if(groupContent === undefined) { break; }
						if(i === 1) { groupOutput += '第' + 1 + '组匹配结果:\n'; }
						groupOutput += '$' + i + ': ' + groupContent + '\n';
					} catch(e) {
						break;
					}
				}
			} else {
				matchOutput = '未找到匹配';
			}
		} else {

			while((result = re.exec(text)) !== null) {
				++cnt;

				matchOutput += result[0] + '\n';

				for(var i = 1; ; ++i) {
					try {
						var groupContent = result[i];
						if(groupContent === undefined) { break; }
						if(i === 1) { groupOutput += '第' + cnt + '组匹配结果:\n'; }
						groupOutput += '$' + i + ': ' + groupContent + '\n';
					} catch(e) {
						break;
					}
				}
			}

			if(cnt > 0) {
				matchOutput = '共找到' + cnt + '组匹配\n' + matchOutput;
			} else {
				matchOutput = '未找到匹配';
			}
		}

		$('#matchText').val(matchOutput);
		$('#matchGroupText').val(groupOutput);
	}

	$('#regExp').on('keyup', function(e) {
		RegExpMatch();
	});

	$('#regExp').on('change', function(e) {
		RegExpMatch();
	});

	$('#originText').on('keyup', function(e) {
		RegExpMatch();
	});

	$('#originText').on('change', function(e) {
		RegExpMatch();
	});

	$('#regExp').val('');
	$('#originText').val('');
	$('#matchText').val('');
	$('#matchGroupText').val('');

	function GetRequest() { 
		var url = location.search; //获取url中"?"符后的字串 
		var theRequest = new Object(); 
		if (url.indexOf("?") != -1) { 
			var str = url.substr(1); 
			strs = str.split("&"); 
			for(var i = 0; i < strs.length; i ++) { 
				var pieces = strs[i].split("=");
				var key = pieces[0];
				var value = strs[i].substr(strs[i].indexOf('=') + 1);
				theRequest[key]=decodeURIComponent(value);
			} 
		} 
		return theRequest; 
	}

	function GetQueryString(name) {
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r!=null)return  decodeURIComponent(r[2]); return null;
	}

	function copyToClipBoard(s) {
		if (window.clipboardData) {
           window.clipboardData.setData("Text", s);
			                alert("已经复制到剪切板！"+ "\n" + s);
			            } else if (navigator.userAgent.indexOf("Opera") != -1) {
				                window.location = s;
				            } else if (window.netscape) {
					                try {
						                    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
						                } catch (e) {
							                    alert("被浏览器拒绝！\n请在浏览器地址栏输入'about:config'并回车\n然后将'signed.applets.codebase_principal_support'设置为'true'");
							                }
							                var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
							                if (!clip)
								                    return;
							                var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
							                if (!trans)
								                    return;
							                trans.addDataFlavor('text/unicode');
							                var str = new Object();
							                var len = new Object();
							                var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
							                var copytext = s;
							                str.data = copytext;
							                trans.setTransferData("text/unicode", str, copytext.length * 2);
							                var clipid = Components.interfaces.nsIClipboard;
							                if (!clip)
								                    return false;
							                clip.setData(trans, null, clipid.kGlobalClipboard);
							                alert("已经复制到剪切板！" + "\n" + s)
								            }
							        }

	var query = GetRequest();

	if(query.regExp) {
		$('#regExp').val(query.regExp);
	}

	if(query.originText) {
		$('#originText').val(query.originText);
	}

	$('#generateShareUrl').on('click', function(e) {
		var regExp = $('#regExp').val();
		var originText = $('#originText').val();

		var path = '?regExp=' + encodeURIComponent(regExp) + '&originText=' + encodeURIComponent(originText);
		$('#shareUrl').text(window.location.origin + window.location.pathname + path);
		$('#shareUrl').css('display', 'block');

		copyToClipBoard(window.location.origin + window.location.pathname + path);
	});

	RegExpMatch();

})();

