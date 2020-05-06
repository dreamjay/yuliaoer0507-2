
<script>


export default {
	
	data(){
		return{
			connectionStatus:false,
			isPush:true,
			offSwith:true,
			socketTask:null
		}
	},
	
	onLaunch: function() {
		
		// 登录成功，重置连接
		uni.$on("loginSuccess",this.loginSuccess)
		
		uni.$on("logout",this.logout)
		
		uni.$on("isPush",this.pushData)
		
		uni.$on("pushStatus",this.pushStatus)
		
		uni.$on("ping",this.ping)
		
		uni.$on("MESSAGE",this.messageDetail)
		
		// 检测token
		this.checkToken();
	},
	onShow: function() {
		console.log('App Show');
		this.pushStatus();
	},
	
	onHide: function() {
		console.log('App Hide');
		// this.close()
	},
	// 关闭websocket【必须在实例销毁之前关闭,否则会是underfined错误】
	beforeDestroy() {
		console.log("beforeDestroy")
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
			if(!this.connectionStatus){
				console.log("网络断开...")
				this.resetConnection();
			}
			
		},

		resetConnection(){
			
			if(this.connectionStatus){
				console.log("连接状态：",this.connectionStatus);
				return;
			}
			this.connection();
		},
		// 强制连接
		connection(){
			var that = this;
			// 检测是token否为空
			var token = uni.getStorageSync("token");
			if(!token){
				console.log("token为空：",token)
				return;
			}
			
			this.socketTask = uni.connectSocket({
				// 【非常重要】必须确保你的服务器是成功的,如果是手机测试千万别使用ws://127.0.0.1:9099【特别容易犯的错误】
				url: this.$http.wsUrl+token,
				success(data) {
					console.log("websocket连接成功");
				},
			});


		  this.socketTask.onOpen((res) => {
				console.log("WebSocket连接正常打开中...！");
				this.connectionStatus = true;
				// 注：只有连接正常打开中 ，才能正常成功发送消息
				// this.socketTask.send({
				// 	data: "uni-app发送一条消息",
				// 	async success() {
				// 		console.log("消息发送成功");
				// 	},
				// });
				// 注：只有连接正常打开中 ，才能正常收到消息
				this.socketTask.onMessage((res) => {
					console.log('收到服务器内容：' + res.data);
					if(!res.data){
						return
					}
					var obj = JSON.parse(res.data);
					uni.$emit("MESSAGE",obj);
					
					
					
				});
			})
			// 这里仅是事件监听【如果socket关闭了会执行】
			this.socketTask.onClose(() => {
				this.connectionStatus = false;
				console.log("已经被关闭了")
			})
			this.socketTask.onError(()=>{
					this.connectionStatus = false;
			})

		
			// uni.onSocketError((res)=> {
			// 	this.connectionStatus = false;
			// 	uni.closeSocket({
			// 		success() {
			// 			console.log("关闭连接成功")
			// 		},
			// 		fail(err){
			// 			console.log("关闭连接失败，",JSON.stringify(err))
			// 		}
			// 	})
			//     console.log('WebSocket连接打开失败，请检查！',JSON.stringify(res));
			// });

		
		},
		close(){
			uni.closeSocket({
				success() {
					console.log("关闭连接成功")
				},
				fail(err){
					console.log("关闭连接失败，",JSON.stringify(err))
				}
			})
		},
		messageDetail(obj){
			var that = this;
			if(obj.messageType == 'CROWD'){
				uni.$emit('CROWD',obj)
				console.log("群消息来了")
				that.addCrowd(obj);
				that.createMessage(obj);
								
								
			}
			if(obj.messageType == 'SYSTEM'){
					console.log("系统消息来了")
					if(obj.body.eventType == 'JIAN_QUN_SUCCES'){
						var userInfo = uni.getStorageSync("userInfo");
						userInfo.showCrowd = 1;
						
						try{
							uni.setStorageSync("userInfo",userInfo);
						}catch(err){
							
						}
					}
					uni.$emit('SYSTEM',obj)
					
					that.createMessage(obj);
			}
			if(obj.messageType == 'ALONE'){
				console.log("个人消息来了")
				if(obj.body.eventType == 'LOGIN_OTHER'){
						var token = uni.getStorageSync("token");
						if(obj.body.text == token){
							
							uni.showToast({
								icon:"none",
								title:"您的账号在别的地方登陆",
											
							})
							
							setTimeout(()=>{
								uni.$emit("logout")
							},2000)
						}
					return;
				}
				
				
				uni.$emit('ALONE',obj)
				that.addAlone(obj);
				
				that.createMessage(obj);
				var aloneList = uni.getStorageSync("aloneList");
				if(!aloneList){
					aloneList = new Array();
				}
				aloneList.push(obj);
				
				
				try{
					uni.setStorageSync("aloneList",aloneList);
				}catch(err){
					
				}
			}
		},
		createMessage(data){
			
			if(this.offSwith){
				if(this.isPush){
					var content = this.formtContent(data.body);
					
					//#ifdef APP-PLUS  
					plus.push.createMessage( content,'',{cover:true});
					//#endif
				}
				
			}
			
		},
		pushStatus(){
			var pushStatus =uni.getStorageSync("pushStatus");
			if(String(typeof(pushStatus)) == 'boolean'){
				this.offSwith = pushStatus;
			}
			
		},
		pushData(data){
			this.isPush = data;
		},
		
		toLogin(){
			uni.reLaunch({
				url: '/pages/login/login'
			});
		},
		// 退出
		logout(){
			// 清空用户数据
			uni.removeStorageSync("userInfo");
			uni.removeStorageSync("token");
			// 关闭原来的连接
			this.close();
			// 跳转去登录页
			this.toLogin();
		},
		// 登录成功
		loginSuccess(){
			// 关闭原来的连接
			this.close();
			// 1秒钟之后连接websocket,重新连接
			setTimeout(()=>{
				console.log("开始连接")
				this.connection()
			},3000);
			
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
					try{
						uni.setStorageSync(this.messageListKey,this.messageList);
					}catch(err){
						
					}
					
					uni.$emit('UPDATE_MSG')
				}
			}
		},
		addCrowd(data){
			
			this.refreshMessageList();
			
			if(data.crowdId ){
					
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
					try{
						uni.setStorageSync(this.messageListKey,this.messageList);
					}catch(err){
						
					}
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
			
			
			try{
				uni.setStorageSync(this.messageListKey,this.messageList);
			}catch(err){
				
			}
			
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
