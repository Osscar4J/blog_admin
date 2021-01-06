const map = {}

export default {
	//倒计时
	//params: {
	//	el: 原生dom元素，显示倒计时的
	//	time: 倒计时的数字，不能小于0，默认60
	//	callback: 倒计时结束后的回调
	//	step: 间隔，单位：毫秒 ，默认为1000,
	//	text: 数字后面显示的文本内容
	//}
	go: function(params) {
		if (typeof params.time != 'number' || params.time <= 0)
			params.time = 60;
		params.time = params.time || 60;
		typeof params.beforeStart == 'function' && params.beforeStart();
		this.stop(params.el.accesskey);
		params.el.innerText = params.time + (params.text||'');
		map[params.el.accesskey] = setInterval(function(){
			if (params.time > 0) {
				params.time --;
				params.el.innerText = params.time + (params.text||'');
			} else {
				params.el.innerText = ''
				clearInterval(map[params.el.accesskey]);
				try {
					typeof params.callback == 'function' && params.callback();
				} catch (e){}
			}
		}, params.step || 1000);
	},
	
	//停止某个计时器
	//key: 元素的选择器
	stop: function(key) {
		clearInterval(map[key]);
	},
	
	//停止所有的计时器
	clear: function() {
		for (let k of map) {
			clearInterval(map[k])
		}
	}
}