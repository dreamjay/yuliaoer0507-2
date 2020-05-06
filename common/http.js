import store from '../store/store.js'

// 本地映射
const baseUrl = 'http://z3t.vip3gz.idcfengye.com'
const baseUrlMeg = 'http://zc.vip3gz.idcfengye.com'
const wsUrl = 'ws://zc.vip3gz.idcfengye.com/yuliao?token=';

// 测试环境
// const baseUrl = 'http://101.132.76.92:6001'
// const baseUrlMeg = 'http://101.132.76.92:9001'
// const wsUrl = 'ws://101.132.76.92:9001/yuliao?token=';


var count = 0

const error = (res) => {
	console.log("error:",res)
	if(res.data){
		if( res.data.code === 'USER_NO_ACCOUNT'){
			uni.showToast({
				title:"请设置收款账户",
				icon:"none"
			})
			uni.hideKeyboard();
			setTimeout(function(){
				uni.navigateTo({
					url:'/pages/tabbar/tabbar-2/qunliao/shoukuanzhanghu/shoukuanzhanghu'
				})
			},1500)
			
		}else if(res.data.code == 'TOKEN_INVALID'){
			uni.$emit("logout");
		}else if(res.data.code == 'USER_NOT_EXISTS'){
			
			uni.showToast({
				title:"系统繁忙，稍后再试！",
				icon:"none"
			})
		}else{
			
			uni.showToast({
				title:res.msg,
				icon:"none"
			})
		}
		
	}else{
		if(res.msg){
			uni.showToast({
				title:res.msg,
				icon:"none"
			})
		}else{
			uni.showToast({
				title:"系统繁忙，稍后再试！",
				icon:"none"
			})
		}
	
	}
	

}


const httpPost = (url, data, success,isLoading ) => {
	
	if(isLoading){
		  uni.showLoading({
		  	title:"正在提交...",
			mask:true
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
				
				if(isLoading){
					 uni.hideLoading();
				}
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
				if(isLoading){
					uni.showToast({
						title:"提交成功",
						icon:"none"
					})
				}
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
			
		}
	});
	
	return requestTask;
};





const httpPostTokenPush = (url, data, success ,isLoading) => {
	if(isLoading){
		uni.showLoading({
			title:"正在提交..."
		})
	}
	var token = uni.getStorageSync("token");
	var requestTask = uni.request({
		url: baseUrlMeg + url,
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
				if(isLoading){
					uni.showToast({
						title:"提交成功",
						icon:"none"
					})
				}
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




export default {
	baseUrl,
	wsUrl,
	baseUrlMeg,
	httpPostTokenPush,
	httpGet,
	httpPost,
	httpGetToken,
	httpPostToken,
	error
}
