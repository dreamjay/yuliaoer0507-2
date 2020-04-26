
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
		
		setTimeout(() => {
			uni.setTabBarBadge({
				index: 1,
				text: '99+'
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
		
		// uni.$on('updateWs',(data)=>{
		// 	let token = JSON.parse(uni.getStorageSync('userInfo')).token
		// 	this.openWs(token)
		// })
		// 检测token
		
		if(!timer){
			timer = setInterval(()=>{
				if(!connectionStatus){
					this.resetConnection();
				}
				
			},5000)
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
				switch(JSON.parse(res.data).messageType){
					case 'CROWD':{
						uni.$emit('CROWD',JSON.parse(res.data))
						break
					}
				}
			  
			})
		},
		resetConnection(){
			// 如果已经连接，就直接关闭
			if(socketTask){
				socketTask.close();
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
