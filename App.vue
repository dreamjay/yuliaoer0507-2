
<script>


export default {
	
	data(){
		return{
			connectionStatus:false,
			timer:null
		}
	},
	
	onLaunch: function() {
		
		// 登录成功，重置连接
		uni.$on("loginSuccess",this.loginSuccess)
		
		uni.$on("logout",this.logout)
		
		if(!this.timer){
			this.timer = setInterval(this.ping,5000)
		}
		// 检测token
		this.checkToken();
	},
	onShow: function() {
		console.log('App Show');
		
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
				console.log("开始重新连接")
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
			// 检测是token否为空
			var token = uni.getStorageSync("token");
			if(!token){
				console.log("token为空：",token)
				return;
			}
			
			uni.connectSocket({ //连接
			    url: this.$http.wsUrl+token
			});
			
			uni.onSocketOpen( (res)=> {
				this.connectionStatus = true;
			    console.log('WebSocket连接已打开！connectionStatus:',this.connectionStatus);
			  
			});
			uni.onSocketError((res)=> {
				this.connectionStatus = false;
			    console.log('WebSocket连接打开失败，请检查！',JSON.stringify(res));
			});
			
			uni.onSocketClose((res)=>{
				this.connectionStatus = false;
				console.log('WebSocket 已关闭！',JSON.stringify(res));
			});
			
			uni.onSocketMessage((res)=> {
			  console.log('收到服务器内容：' + res.data);
			  if(!res.data){
			  	return
			  }
			  var obj = JSON.parse(res.data);
			  this.messageDetail(obj);
			});
			
		
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
				that.addAlone(obj);
				uni.$emit('ALONE',obj)
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
			var content = this.formtContent(data.body);
			
			//#ifdef APP-PLUS  
			plus.push.createMessage( content,'',{cover:true});
			//#endif
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
			// 重新连接
			this.connection();
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
