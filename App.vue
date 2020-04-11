
<script>
	// import {WebSocket} from '@/common/stomp/websocket-uni.js'
	import {SockJS} from '@/common/stomp/sockjs.min.js' //手机不能用这个js
	import {Stomp} from '@/common/stomp/stomp.js'
	var stompClient=null
	var listenList=[]
export default {
	
	data(){
		return{
			
		}
	},
	
	onLaunch: function() {
		
		uni.$on('stomp_connect',this.stomp_connect);
		uni.$on('reset_connection',this.reset_connection);
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
		
		// 定时检测是否断线
		setInterval(()=>{
			uni.$emit('reset_connection');
		},3000)
		
	},
	onShow: function() {
		console.log('App Show');
		// 每次切换，判断是否需要重连
		uni.$emit('reset_connection');
		
	},
	onHide: function() {
		console.log('App Hide');
	},
	methods:{
		// 如果为null，则重连
		reset_connection(){
			if(stompClient){
				return ;
			}
			this.connect();
		},
		// 强制清空原来的连接
		stomp_connect(){
			this.close_connect();
			this.connect();
			
		},
		connect(){
			
			let userInfo = uni.getStorageSync('userInfo');
			
			var token = JSON.parse(userInfo).token;
			var that = this;
			var headers = {
			    token: token	
			}
			console.log('token',token)
			var socket = new SockJS('http://zc3t.vipgz5.idcfengye.com/endpointDefault?token=' + headers.token);
			stompClient = Stomp.over(socket);
			stompClient.connect({},function(frame) {
			    console.log('Connected:' + frame);
				this.start_listener();
			
			
			}.bind(this),function(frame){
				console.log('断开连接')
				stompClient = null;
			}.bind(this));
		},
		close_connect(){
			if(stompClient){
				// 已连接
				stompClient.disconnect(function(){
					console.log('断开连接')
				})
			
			}
		},
		start_listener(){
			this.$http.httpPushTokenRequest({
				url:'/push/getListenInfo',
				method:"post"
			}).then((res)=>{
				if(res.data.success){
					this.clearListen();
					var urls = res.data.data;
					for(var i=0;i<urls.length;i++){
						 var obj = stompClient.subscribe(urls[i],(response)=>{
							this.onMessage(response.body);
						});
						listenList.push(obj);
						
					}
					
				} else{
					uni.showToast({
						title:res.data.msg,
						icon:"none"
					})
				}
			},(err)=>{
				uni.showToast({
					icon:"none",
					title:"服务器忙...等会再试"
				})
			})
			
		},
		// 清空原来的监听
		 clearListen(){
			
			for(var i=0;i<listenList.length;i++){
				listenList[i].unsubscribe();
			}
			listenList = [];
		},
		onMessage(message) {
			console.log(message);
			uni.showToast({
				title:message.message
			})
		}
		
	}
};
</script>

<style>
/*每个页面公共css */ 
/* ul,li{ padding:0;margin:0;list-style:none} */
@import 'common/pageCommon.css';
</style>
