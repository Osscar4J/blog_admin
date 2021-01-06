const ls = window.localStorage
const ss = window.sessionStorage

export default {
	/**
	 * 从sessionStorage中获取一个对象，默认从sessionStorage
	 * @param  {[type]} key 保存的对象名称
	 * @param  {[type]} ss 如果为true则从localStorage中获取
	 * @return {[type]}     js对象
	 */
	getItem(key, inLocal) {
	    try {
	    	if (inLocal) {
	    		return JSON.parse(ls.getItem(key))
	    	}
	      	return JSON.parse(ss.getItem(key))
	    } catch (err) {
	      return null
	    }
	},
	/**
	 * 保存对象到sessionStorage中，键值对
	 * @param {[type]} key 键
	 * @param {[type]} val js对象
	 * @param {[type]} inLocal 如果传true则保存到localStorage中
	 */
	setItem(key, val, inLocal) {
		inLocal ? ls.setItem(key, JSON.stringify(val)) : ss.setItem(key, JSON.stringify(val))
	},
	/**
	 * 清空sessionStorage
	 * @param {[type]} inLocal 如果传true则清空localStorage
	 */
	clear(inLocal) {
	    if (typeof inLocal === 'undefined') {
	    	ls.clear()
	    	ss.clear()
	    } else {
	    	inLocal ? ls.clear() : ss.clear()
	    }
	},
	/**
	 * 获取sessionStorage中保存的所有数据
	 * @param {[type]} inLocal 如果传true则从localStorage中获取
	 */
	getAll(inLocal) {
		if (inLocal) {
			return ls.valueOf()
		}
	    return ss.valueOf()
	},
	/**
	 * 从sessionStorage中删除一个数据
	 * @param  {[type]} key 键
	 * @param {[type]} inLocal 如果传true则从localStorage中删除
	 */
	removeItem(key, inLocal) {
	    inLocal ? ls.removeItem(key) : ss.removeItem(key)
	}
}
