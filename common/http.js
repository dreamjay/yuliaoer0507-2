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
				
				// console.log('看看res',res[1].data)
				try{
					if(res[1].data.data && res[1].data.data.code == "TOKEN_INVALID"){
						store.commit('watchLoading',false)
						uni.showToast({
							title:'token失效请重新登录',
							icon:'none'
						})
						setTimeout(()=>{
							uni.hideToast()
							uni.reLaunch({
							    url: '/pages/login/login'
							});
						},1500)
					} else{
						resolve(res[1])
					}
				} catch(err){
					console.log('http.js解析token报错')
				}
				
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
	httpTokenRequest
}
