
<script>
	
export default {
	
	data(){
		return{
			
		}
	},
	
	onLaunch: function() {
		
		
		setTimeout(() => {
			uni.setTabBarBadge({
				index: 1,
				text: '31'
			});
			uni.showTabBarRedDot({
				index: 3
			});
		}, 1000);
		
		// setInterval(()=>{
		// 	let arr = [
		// 		'上分/500',
		// 		'中雷/抢了100',
		// 		'@会飞的鱼儿'
		// 	]
		// 	let str = arr[Math.floor(Math.random() * 3)]
		// 	plus.push.createMessage( str,'',{cover:true});
			
		// },5000)
		if(!uni.getStorageSync('userInfo')){
			
			uni.reLaunch({
				url: '/pages/login/login'
			});
		
		}else{
			let token = JSON.parse(uni.getStorageSync('userInfo')).token
			// this.openWs(token)
		}
		
		uni.$on('updateWs',(data)=>{
			let token = JSON.parse(uni.getStorageSync('userInfo')).token
			this.openWs(token)
		})
	},
	onShow: function() {
		console.log('App Show');
		
	},
	onHide: function() {
		console.log('App Hide');
	},
	methods:{
		openWs(token){
			
			uni.connectSocket({ //连接
			    url: 'ws://zc3t.vipgz5.idcfengye.com/yuliao?token='+token+'',
				fail(err){
					console.log(err)
				}
			});
			uni.onSocketOpen(function (res) { //连成功
			  console.log('WebSocket连接已打开！');
			});
			uni.onSocketError(function (res) { //连失败
				console.log('WebSocket连接打开失败，请检查！');
				setTimeout(()=>{
					uni.getNetworkType({
					    success: function (res1) {
							// uni.showToast({
							// 		title:res1.networkType
							// 	})
					        if(res1.networkType == 'none'){
								
								uni.showModal({
									title:'提示',
									content:"请检查网络是否打开",
									showCancel:false,
									success(confirm) {
										if(confirm){
											// #ifdef APP-PLUS
												plus.runtime.quit();  
												return
											// #endif
											console.log('不是app环境')
										}
										
									}
								})
							} else{
								uni.closeSocket({})
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
							}
					    }
					});
				},1000)
			});
			uni.onSocketMessage(function (res) {
			  console.log('收到服务器内容：' + res.data);
			  
			});
		}
	}
};
</script>

<style>
/*每个页面公共css */ 
/* ul,li{ padding:0;margin:0;list-style:none} */
@import 'common/pageCommon.css';
</style>
