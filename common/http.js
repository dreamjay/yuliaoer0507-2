import store from '../store/store.js'

const baseUrl = 'http://z3t.vip3gz.idcfengye.com'
const baseUrlMeg = 'http://zc.vip3gz.idcfengye.com'
var count = 0

const error = (res) => {
	console.log(res);
	
	
	uni.showToast({
		title:res.msg,
		icon:"none"
	})
}


const httpPost = (url, data, success,isLoading ) => {
	
	if(isLoading){
		  uni.showLoading({
		  	title:"正在提交..."
		  })
	}
  
	var requestTask = uni.request({
		url: baseUrl + url,
		data: data,
		method: 'POST',
		header: {
			'X-Requested-With': 'XMLHttpRequest',
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		},
		dataType: 'json',
		sslVerify: false,
		success: function(res){
			if(res.data.success){
				success(res.data)
			}else{
				error(res.data);
			}
		},
		fail: function(err) {
			uni.showToast({
				icon:"none",
				title:"服务器繁忙，稍后再试！"
			})
		},
		complete: function() {
			if(isLoading){
				uni.hideLoading();
			}
		}
	});
	
	return requestTask;
};



const httpPostToken = (url, data, success ,isLoading) => {
	if(isLoading){
		uni.showLoading({
			title:"正在提交..."
		})
	}
	var token = uni.getStorageSync("token");
	var requestTask = uni.request({
		url: baseUrl + url,
		data: data,
		method: 'POST',
		header: {
			'Token': token,
			'X-Requested-With': 'XMLHttpRequest',
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		},
		dataType: 'json',
		sslVerify: false,
		success: function(res){
			if(res.data.success){
				success(res.data)
			}else{
				error(res.data);
			}
		},
		fail: function(err) {
			uni.showToast({
				icon:"none",
				title:"服务器繁忙，稍后再试！"
			})
		},
		complete: function() {
			if(isLoading){
				uni.hideLoading();
			}
		}
	});
	
	return requestTask;
};






const httpGet = (url, data, success,isLoading  ) => {
	if(isLoading){
		uni.showLoading({
		})
	}
	
	var requestTask = uni.request({
		url: baseUrl + url,
		data: data,
		method: 'GET',
		header: {
			'X-Requested-With': 'XMLHttpRequest',
			"Accept": "application/json",
			"Content-Type": "application/json; charset=UTF-8"
		},
		dataType: 'json',
		sslVerify: false,
		success: function(res){
			if(res.data.success){
				success(res.data)
			}else{
				error(res.data);
			}
		},
		fail: function(err) {
			uni.showToast({
				icon:"none",
				title:"服务器繁忙，稍后再试！"
			})
		},
		complete: function() {
			if(isLoading){
				uni.hideLoading();
			}
		}
	});
	
	return requestTask;
};



const httpGetToken = (url, data, success,isLoading ) => {
	if(isLoading){
		uni.showLoading({
		})
	}

	var token = uni.getStorageSync("token");
	var requestTask = uni.request({
		url: baseUrl + url,
		data: data,
		method: 'GET',
		header: {
			'Token': token,
			'X-Requested-With': 'XMLHttpRequest',
			"Accept": "application/json",
			"Content-Type": "application/json; charset=UTF-8"
		},
		dataType: 'json',
		sslVerify: false,
		success: function(res){
			if(res.data.success){
				success(res.data)
			}else{
				error(res.data);
			}
		},
		fail: function(err) {
			uni.showToast({
				icon:"none",
				title:"服务器繁忙，稍后再试！"
			})
		},
		complete: function() {
			if(isLoading){
				uni.hideLoading()
			}
		}
	});
	
	return requestTask;
};


// const httpRequest = (opts, data) => {
// 	let httpDefaultOpts = {
// 		url: baseUrl + opts.url,
// 		data: data,
// 		method: opts.method,
// 		header: opts.method == 'get' ? {
// 			'X-Requested-With': 'XMLHttpRequest',
// 			"Accept": "application/json",
// 			"Content-Type": "application/json; charset=UTF-8"
// 		} : {
// 			'X-Requested-With': 'XMLHttpRequest',
// 			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
// 		},
// 		dataType: 'json',
// 	}
// 	let promise = new Promise(function(resolve, reject) {
// 		store.commit('watchLoading', true)
// 		count++
// 		uni.request(httpDefaultOpts).then(
// 			(res) => {
// 				count--
// 				if (count >= 0) {
// 					store.commit('watchLoading', false)
// 				}
// 				resolve(res[1])

// 			}
// 		).catch(
// 			(response) => {
// 				count--
// 				if (count >= 0) {
// 					store.commit('watchLoading', false)
// 				}

// 				reject(response)
// 			}
// 		)
// 	})
// 	return promise
// };
//带Token请求
// const httpTokenRequest = (opts, data) => {
// 	let token = "";
// 	token = JSON.parse(uni.getStorageSync('userInfo')).token

// 	//此token是登录成功后后台返回保存在storage中的
// 	let httpDefaultOpts = {
// 		url: (data.msg ? baseUrlMeg : baseUrl) + opts.url,
// 		data: data,
// 		method: opts.method,
// 		header: opts.method == 'get' ? {
// 			'Token': token,
// 			'X-Requested-With': 'XMLHttpRequest',
// 			"Accept": "application/json",
// 			"Content-Type": "application/json; charset=UTF-8"
// 		} : {
// 			'Token': token,
// 			'X-Requested-With': 'XMLHttpRequest',
// 			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
// 		},
// 		dataType: 'json',
// 	}

// 	let promise = new Promise(function(resolve, reject) {

// 		uni.request(httpDefaultOpts).then(
// 			(res) => {

// 				// console.log('看看res',res[1].data)
// 				try {
// 					if (res[1].data.data && res[1].data.data.code == "TOKEN_INVALID") {
// 						store.commit('watchLoading', false)
// 						uni.showToast({
// 							title: 'token失效请重新登录',
// 							icon: 'none'
// 						})
// 						try {
// 							uni.removeStorageSync('userInfo') //清空token
// 							uni.$off('redUpdate')
// 							uni.$off('updateInfo')
// 							uni.$off('updateUserInfo')
// 							uni.$off('update')
// 							uni.$off('updateWs')
// 							uni.$off('fahongbao')
// 						} catch (err) {
// 							console.log('处理退出时出错', err)
// 						}

// 						setTimeout(() => {
// 							uni.hideToast()
// 							uni.reLaunch({
// 								url: '/pages/login/login'
// 							});
// 						}, 1500)
// 					} else {
// 						resolve(res[1])
// 					}
// 				} catch (err) {
// 					console.log('http.js解析token报错')
// 				}

// 			}
// 		).catch(
// 			(response) => {
// 				console.log("response", response)
// 				reject(response)
// 			}
// 		)
// 	})
// 	return promise
// };


export default {
	baseUrl,
	// httpRequest,
	// httpTokenRequest,
	httpGet,
	httpPost,
	httpGetToken,
	httpPostToken,
	error
}
