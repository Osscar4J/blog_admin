export default () => {
	Date.prototype.Format = function(fmt){
	  var o = {   
	    "M+" : this.getMonth()+1,                 
	    "d+" : this.getDate(), 
	    "h+" : this.getHours(), 
	    "m+" : this.getMinutes(),  
	    "s+" : this.getSeconds(),    
	    "q+" : Math.floor((this.getMonth()+3)/3), 
	    "S"  : this.getMilliseconds() 
	  };   
	  if(/(y+)/.test(fmt))   
	    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
	  for(var k in o)   
	    if(new RegExp("("+ k +")").test(fmt))   
	  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
	  return fmt;
	}

	Date.prototype.toSimple = function() {
        var dateTimeStamp = this.getTime()

        var minute = 1000 * 60;
        var hour = minute * 60;
        var day = hour * 24;
        
        var month = day * 30;
        var year = month*12;
        var now = new Date().getTime();
        var diffValue = now - dateTimeStamp;
        var result = ""
        if (diffValue < 0) {
            return;
        }

        var monthC = diffValue / month;
        var weekC = diffValue / (7 * day);
        var dayC = diffValue / day;
        var hourC = diffValue / hour;
        var minC = diffValue / minute;
        var yearC = diffValue / year
        if (yearC >= 1){
            return  parseInt(yearC) + "年前";
        }
        if(monthC >= 1) {
            result = parseInt(monthC) + "月前";
        } else if(weekC >= 1) {
            result = parseInt(weekC) + "周前";
        } else if(dayC >= 1) {
            result = parseInt(dayC) + "天前";
        } else if(hourC >= 1) {
            result = parseInt(hourC) + "小时前";
        } else if(minC >= 1) {
            result = parseInt(minC) + "分钟前";
        } else{
            result = "刚刚";
        }
        
        return result;
	}

	if (!Math.uuid) {
		Math.uuid = function() { 
		    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) { 
		        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8); 
		        return v.toString(16); 
		    }).replace(/-/g, '');
		}
	}
}
