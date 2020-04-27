
<script>

let socketTask = null;	
let timer = null;
let connectionStatus = false;
export default {
	
	data(){
		return{
		}
	},
	
	onLaunch: function() {
		
		// 登录成功，重置连接
		uni.$on("loginSuccess",this.resetConnection)
		
		uni.$on("logout",this.logout)
		
	// uni.showTabBarRedDot({
	// 	index: 3
	// });
		
		// setInterval(()=>{
		// 	let arr = [
		// 		'上分/500',
		// 		'中雷/抢了100',
		// 		'@会飞的鱼儿'
		// 	]
		// 	let str = arr[Math.floor(Math.random() * 3)]
		// 	plus.push.createMessage( str,'',{cover:true});
			
		// },5000)
		
	
		// 检测token
		
		if(!timer){
			timer = setInterval(this.ping,5000)
		}
	},
	onShow: function() {
		console.log('App Show');
		this.checkToken();
	
		
	},
	onHide: function() {
		console.log('App Hide');
	},
	methods:{
		checkToken(){
			var token = uni.getStorageSync("token");
			if(!token){
				this.toLogin();
				return;
			}
			this.$http.httpPostToken('/user/checkToken',{},(res) => {
		
				this.connection();
			},false);
			
		},
		ping(){
			if(!connectionStatus){
				console.log("开始重新连接")
				this.resetConnection();
			}
			
		},
		connection(){
			
			if(socketTask){
				console.log("已连接")
				return;
			}
			var token = uni.getStorageSync("token");
			if(!token){
				return;
			}
			
			socketTask = uni.connectSocket({ //连接
			    url: 'ws://zc.vip3gz.idcfengye.com/yuliao?token='+token,
				fail(err){
					console.log(err)
				}
			});
			socketTask.onOpen(function (res) {
			  console.log('WebSocket连接已打开！');
			  connectionStatus = true;
			})
			
			socketTask.onClose(function(){
				  console.log('WebSocket连接已关闭！');
				   connectionStatus = false;
			})
			
			socketTask.onError(function(err){
				  console.log('WebSocket连接错误',err);
				    connectionStatus = false;
			})
					
			socketTask.onMessage(function (res) {
				console.log('收到服务器内容：' + res.data);
				
				if(!res.data){
					return
				}
				var obj = JSON.parse(res.data);
				if(obj.messageType == 'CROWD'){
					console.log("群消息来了")
					uni.$emit('CROWD',obj)
				}
				if(obj.messageType == 'SYSTEM'){
					console.log("系统消息来了")
					if(obj.body.eventType == 'JIAN_QUN_SUCCES'){
						var userInfo = uni.getStorageSync("userInfo");
						userInfo.showCrowd = 1;
						uni.setStorageSync("userInfo",userInfo);
					}
					uni.$emit('SYSTEM',obj)
				}
				if(obj.messageType == 'ALONE'){
					console.log("个人消息来了")
					uni.$emit('ALONE',obj)
				}
			  
			})
		},
		resetConnection(){
			console.log(socketTask)
			// 如果已经连接，就直接关闭
			if(socketTask){
				uni.closeSocket();
				socketTask = null;
			}
			this.connection();
		},
		toLogin(){
			uni.reLaunch({
				url: '/pages/login/login'
			});
		},
		// 退出
		logout(){
			uni.removeStorageSync("userInfo");
			uni.removeStorageSync("token");
			this.resetConnection();
			this.toLogin();
		}
	}
};
</script>

<style>
/*每个页面公共css */ 
/* ul,li{ padding:0;margin:0;list-style:none} */
@import 'common/pageCommon.css';
@import 'common/icon.css'
</style>
