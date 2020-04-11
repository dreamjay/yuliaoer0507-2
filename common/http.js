import store from '../store/store.js'
const baseUrl = 'http://zcttt.vipgz5.idcfengye.com'; 
const basePushUrl = 'http://zc3t.vipgz5.idcfengye.com';
var count = 0
const httpRequest = (opts, data) => {


let httpDefaultOpts = {
	url: baseUrl+opts.url,
	data: data,
	method: opts.method,
	header: opts.method == 'get' ? {
		'X-Requested-With': 'XMLHttpRequest',
		"Accept": "application/json",
		"Content-Type": "application/json; charset=UTF-8"
	} : {
		'X-Requested-With': 'XMLHttpRequest',
		'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		// "Content-Type": "application/json"
	},
	dataType: 'json',
}
let promise = new Promise(function(resolve, reject) {
	store.commit('watchLoading',true)
	count++
	uni.request(httpDefaultOpts).then(
		(res) => {
		count--
		if(count >= 0) {
			store.commit('watchLoading',false)
		}
		resolve(res[1])
		
	}
	).catch(
		(response) => {
			count--
			if(count >= 0) {
				store.commit('watchLoading',false)
			}
			
			reject(response)
		}
	)
})
return promise
};
//带Token请求
const httpTokenRequest = (opts, data) => {
	let token = "";
	// uni.getStorage({
	// 	key: 'token',
	// 	success: function(ress) {
	// 		token = ress.data
	// 	}
	// });
	token = JSON.parse(uni.getStorageSync('userInfo')).token
	
	
	//此token是登录成功后后台返回保存在storage中的
	let httpDefaultOpts = {
		url: baseUrl+opts.url,
		data: data,
		method: opts.method,
		header: opts.method == 'get' ? {
			'Token': token,
			'X-Requested-With': 'XMLHttpRequest',
			"Accept": "application/json",
			"Content-Type": "application/json; charset=UTF-8"
		} : {
			'Token': token,
			'X-Requested-With': 'XMLHttpRequest',
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		},
		dataType: 'json',
		}
		
		let promise = new Promise(function(resolve, reject) {
			
			
			uni.request(httpDefaultOpts).then(
			(res) => {
				resolve(res[1])
			}
			).catch(
				(response) => {
					reject(response)
				}
			)
		})
		return promise
};


//带Token请求,消息推送
const httpPushTokenRequest = (opts, data) => {
	let token = "";
	// uni.getStorage({
	// 	key: 'token',
	// 	success: function(ress) {
	// 		token = ress.data
	// 	}
	// });
	token = JSON.parse(uni.getStorageSync('userInfo')).token
	
	
	//此token是登录成功后后台返回保存在storage中的
	let httpDefaultOpts = {
		url: basePushUrl+opts.url,
		data: data,
		method: opts.method,
		header: opts.method == 'get' ? {
			'Token': token,
			'X-Requested-With': 'XMLHttpRequest',
			"Accept": "application/json",
			"Content-Type": "application/json; charset=UTF-8"
		} : {
			'Token': token,
			'X-Requested-With': 'XMLHttpRequest',
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		},
		dataType: 'json',
		}
		
		let promise = new Promise(function(resolve, reject) {
			
			
			uni.request(httpDefaultOpts).then(
			(res) => {
				resolve(res[1])
			}
			).catch(
				(response) => {
					reject(response)
				}
			)
		})
		return promise
};

export default {
	baseUrl,
	httpRequest,
	httpTokenRequest,
	httpPushTokenRequest
}
