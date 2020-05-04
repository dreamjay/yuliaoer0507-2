/**
 * 针对uniapp数据缓存优化,可控制数据缓存时间
 * 
 *
 */

const system = ['userInfo','isFirstUse'];

const postfix = 'storage'; // 缓存前缀

//图片保存到本地的文件夹
const saveDir="_doc/";

const storage = {
	postfix: postfix,
}


/**
 * 写入缓存
 * @param {String} key 指定的key
 * @param {Any} data 需要存储的内容，只支持原生类型、及能够通过 JSON.stringify 序列化的对象
 * @param {Number} time 保存的时间, 数字类型,单位秒 为空则永久有效.
 */
storage.put = function(key, data, time) {
	data=typeof data=="object"?JSON.stringify(data):data;
	uni.setStorageSync(key, data)
	var seconds = parseInt(time);
	if (seconds > 0) {
		var timestamp = Date.parse(new Date());
		timestamp = timestamp / 1000 + seconds;
		uni.setStorageSync(key + postfix, timestamp + "")
	} else {
		uni.removeStorageSync(key + postfix)
	}
}

/**
 * 获取本地缓存中内容
 * @param {String} key 指定的key
 * @param def 获取失败时的默认内容,不传则为false.
 */
storage.get = function(key, def) {
	/**
	 * 必须对系统变量进行加密操作
	 */
	var deadtime = parseInt(uni.getStorageSync(key + postfix))
	if (deadtime) {
		if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
			if (def) {
				return def;
			} else {
				uni.removeStorageSync(key + postfix)
				return false;
			}
		}
	}
	var res = uni.getStorageSync(key);
	if (res) {
		//对数据尝试进行类型转换
		try{
			return JSON.parse(res);
		}catch(e){
			//使用eval进行转换 
			return eval("("+res+")");
		}
		return res;
	} else {
		if (def == undefined || def == "") {
			def = false;
			uni.removeStorageSync(key)
		}
		return def;
	}
}

/**
 * 从本地缓存中同步移除指定 key。
 * @param {String} key 指定的key
 */
storage.remove = function(key) {
	uni.removeStorageSync(key);
	uni.removeStorageSync(key + postfix);
}

/**
 * 同步清理本地数据缓存。
 */
storage.clear = function() {
	// 取出系统变量，清楚后将系统变量再次存入
	var map = {};
	for (let i = 0; i <system.length; i++) {
		map[system[i]] = storage.get(system[i]);
	}
	// var user = storage.get("user_info"); 
	uni.clearStorageSync();

	for (let i = 0; i <system.length; i++) {
		storage.put(system[i], map[system[i]]);
	}
	// storage.put("user_info",user); // 等 其它的自行扩展.
}
/**
 * 清理本地所有数据缓存。
 */
storage.clearAll = function() {
	uni.clearStorageSync();
}

/**
 * 同步清理本地缓存的图片文件
 */
storage.clearImageAll = function(filePath) {
	filePath = filePath || saveDir;
	uni.removeSavedFile({
		filePath: saveDir
	})
}

//临时缓存，应用关闭时，缓存失效
var _temporary = {};
storage.temporary = {
	getAll:function(){
		return _temporary;
	},
	get: function(key) {
		return _temporary[key];
	},
	put: function(key, val) {
		_temporary[key] = val;
	},
	remove: function(key) {
		delete _temporary[key];
		// _temporary[key]=val;
	},
	clear: function() {
		_temporary = {};
	}
}

// export default storage

module.exports = {
	put: storage.put,
	get: storage.get,
	remove: storage.remove,
	clear: storage.clear,
	clearAll: storage.clearAll,
	clearImageAll:storage.clearImageAll,
	temporary: storage.temporary
}
