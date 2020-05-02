
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
			var that = this;
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
					that.addCrowd(obj);
					uni.$emit('CROWD',obj)
					
					that.createMessage(obj);
					
					
				}
				if(obj.messageType == 'SYSTEM'){
					console.log("系统消息来了")
					if(obj.body.eventType == 'JIAN_QUN_SUCCES'){
						var userInfo = uni.getStorageSync("userInfo");
						userInfo.showCrowd = 1;
						uni.setStorageSync("userInfo",userInfo);
					}
					uni.$emit('SYSTEM',obj)
	
					that.createMessage(obj);
				}
				if(obj.messageType == 'ALONE'){
					console.log("个人消息来了")
					that.addAlone(obj);
					uni.$emit('ALONE',obj)
					that.createMessage(obj);
					var aloneList = uni.getStorageSync("aloneList");
					if(!aloneList){
						aloneList = new Array();
					}
					aloneList.push(obj);
					uni.setStorageSync("aloneList",aloneList);
				}
			  
			})
		},
		createMessage(data){
			var content = this.formtContent(data.body);
			
			//#ifdef APP-PLUS  
			plus.push.createMessage( content,'',{cover:true});
			//#endif
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
		},
		addAlone(data){
		
			this.refreshMessageList();
		
			var sendUser = data.sendUser;
			if(sendUser && sendUser.userId){
				
				var index = this.isExits("ALONE_"+sendUser.userId);
				console.log(index);
				if(index == -1){
					var obj = {
						id:sendUser.userId,
						key:"ALONE_"+sendUser.userId,
						headUrl:sendUser.headUrl,
						title:sendUser.nickName,
						text: this.formtContent(data.body),
						time: this.calcTime(data.sendTime),
						type:"ALONE",
						num:1
					}
					this.addItem(obj);
				}else{
					this.messageList[index].time =this.calcTime(data.sendTime);
					this.messageList[index].text = this.formtContent(data.body);
					this.messageList[index].num++;
					uni.setStorageSync(this.messageListKey,this.messageList);
					
					uni.$emit('UPDATE_MSG')
				}
			}
		},
		addCrowd(data){
			
			this.refreshMessageList();
			
			if(data.crowdId){
					
				var index = this.isExits("CROWD_"+data.crowdId);
				
				console.log(this.messageList);
				if(index == -1){
					var obj = {
						id:data.crowdId,
						key:"CROWD_"+data.crowdId,
						imgs:[],
						title:"",
						text: this.formtContent(data.body),
						time: this.calcTime(data.sendTime),
						type:"CROWD",
						num:1
					}
					this.$http.httpGetToken('/crowd/getById',{
						crowdId: data.crowdId
					},(res) =>{
						obj.title = res.data.name;
						this.$http.httpGetToken('/crowd/listUserHeadByCrowdId',{
							crowdId:data.crowdId
						},(res) => {
							obj.imgs = res.data;
							console.log("添加群消息")
							this.addItem(obj);
						},false)
					},false);
					
					
				}else{
					this.messageList[index].time =this.calcTime(data.sendTime);
					this.messageList[index].text = this.formtContent(data.body);
					this.messageList[index].num++;
					uni.setStorageSync(this.messageListKey,this.messageList);
					uni.$emit('UPDATE_MSG')
				}
			}
		},
		isExits(key){
			var indexx = -1;
			this.messageList.find((m,index)=>{
				
				if(m.key == key){
					indexx = index;
				}
				
			})
			return indexx;
		},
		refreshMessageList(){
			
			this.userInfo = uni.getStorageSync("userInfo");
			this.messageListKey = "MESSAGE"+this.userInfo.id;
			var messageList = uni.getStorageSync(this.messageListKey);
			if(String(typeof(messageList)) != 'object'){
				messageList = [];
			}
			this.messageList = messageList?messageList:[];
		},
		addItem(obj){
			console.log("添加群关系")
			this.messageList = this.messageList.concat(obj);
			uni.setStorageSync(this.messageListKey,this.messageList);
			uni.$emit('UPDATE_MSG')
			
		},
		calcTime(time){
			var date = new Date();  
			date.setTime(time);
			
			var minute = date.getMinutes();
			if(minute < 10){
				minute = "0"+minute;
			}
			var h =  date.getHours();
			return h + ":" + minute;
		},
		formtContent(body){
			if(body.bodyType == 'TEXT'){
				return body.text;
			}else if(body.bodyType == 'IMG'){
				return "[图片]";
			}else if(body.bodyType == 'AUDIO'){
				return '[语音]';
			}else if(body.bodyType == 'RED_PACKET'){
				return body.title;
			}
		},
	}
};
</script>

<style>
/*每个页面公共css */ 
/* ul,li{ padding:0;margin:0;list-style:none} */
@import 'common/pageCommon.css';
@import 'common/icon.css'
</style>
