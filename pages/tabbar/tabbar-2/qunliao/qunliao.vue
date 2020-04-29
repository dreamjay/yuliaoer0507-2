<template>
	<view class="uni-column">
		<view class="content" id="content" :style="{height:style.contentViewHeight+'px'}">
			<scroll-view 
				id="scrollview" 
				:scroll-y="isScroll" 
				:style="{height:style.contentViewHeight+'px'}" 
				:scroll-with-animation="false"
			    :scroll-top="scrollTop" 
				@click="scrollViewClick"
				:refresher-enabled="isActive"
				:refresher-threshold="80"
				refresher-default-style="white"
				@scroll="scroll"
				@scrolltoupper="scrolltoupper"
				refresher-background="#EEEEEE"
				:refresher-triggered="triggered"
				@refresherpulling="onPulling"
				@refresherrefresh="onRefresh"
				@refresherrestore="onRestore"
				@refresherabort="onAbort"
				>
				<!-- <page-foot :name="name"></page-foot> -->
				<message-show v-for="(message,index) in messages" :key="index" 
					:message="message" 
					:cid="index"
					@hongbaoClick="hongbaoClick"
					></message-show>
				<view id="bottom"></view>
			</scroll-view>
		</view>
		<view class="foot" style="padding-top: 5px;">
			<chat-input @send-message="getInputMessage" @show="setScrollH" @foc="setScrollH" ref="chatInput" :crowdInfo="crowdInfo"></chat-input>
			
		</view>
		
		<chunLei-modal v-model="value" :mData="data" :type="type" :maskEnable="false" :navHeight="height" :tabbarHeight="0" :opacity="0.5">
			
			<view class="custom-view" @tap.stop>
				<view class="hongbao" style="text-align: center;">
					
					<image class="hongbaoBody" src="/static/liaotian/bg_hb.png"></image>
					
					<view class="messageInfo">
						<view class="userHBInfo">
							<image src="/static/moren.png"></image>
							<text>士大夫的红包</text>
						</view>
						<text class="message">{{messageContent(isType)}}</text>
						
						<text v-if="isType=='shouman'" class="shouman" @click="toXiangqing">看看大家的运气</text>
						<image v-if="isType=='kai'" src="/static/liaotian/icon_hb_kai.png" class="kai" :class="rotate ? 'rotate' : null" @click="openHongbao"></image>
					</view>
					<image class="close" src="/static/liaotian/icon_hg_dismiss.png" @click="closeHongbao"></image>
				</view>
				
			</view>
		</chunLei-modal>
	</view>
</template>
<script>
	import chatInput from '@/components/liaotian/chatinput.vue';
	import messageShow from '@/components/liaotian/messageshow.vue';
	import chunLeiModal from '@/components/chunLei-modal/chunLei-modal.vue'
	
	export default {
		components: {
			chatInput,
			messageShow,
			chunLeiModal
		},
		data() {
			return {
				data:{},
				value:false,
				type:'custom',
				height:0, //状态栏加导航栏的高度
				name:'xcecd@qq.com',
				style: {
					pageHeight: 0,
					contentViewHeight: 0,
					footViewHeight: 90,
					mitemHeight: 0,
				},
				scrollTop: 0,
				messages: [],
				isType: null , //模拟数据，手慢还是积分不足
				rotate:false, //红包转不转
				crowdInfo:null,
				userInfo:null,
				triggered:true,
				is_freshing:false,//
				isScroll:true,
				isActive:true,
			}
		},
		onBackPress(e){
			if(this.value){ //模态框打开了，先关掉在返回
				if(e.from == 'backbutton') {//实体键
					this.value = false
					// setTimeout(()=>{
					// 	uni.navigateBack({})
					// },10)
					return true
				}
				if(e.from == 'navigateBack'){
					return false
				}
			} else{
				return false
			}
		},
		onNavigationBarButtonTap:function() {
			
			uni.navigateTo({
				url:'/pages/tabbar/tabbar-5/qunzhushezhi/liaotianxinxi/liaotianxinxi?crowdId='+this.crowdInfo.crowdId+''
			})
		},
		onLoad: function (option) {
			console.log('群信息',option)
			const res = uni.getSystemInfoSync();
			this.style.pageHeight = res.windowHeight;
			this.style.contentViewHeight = res.windowHeight - uni.getSystemInfoSync().screenWidth / 750 * (100) ; //像素
			
			uni.getSystemInfo({
			    success: (e) => {
			      
			      // #ifdef APP-PLUS
			      // console.log('app-plus', e)
			      
			      this.height = e.statusBarHeight + 44
			      // #endif
				}
			})
			this.crowdInfo = JSON.parse(option.crowdInfo)
			
			this.getCrowdInfo(this.crowdInfo.crowdId);
			
			this.userInfo =  uni.getStorageSync('userInfo')
			uni.setNavigationBarTitle({
				title:JSON.parse(option.crowdInfo).name+'(456)'
			})
			
			uni.$on('CROWD',(data)=>{
				if(data.crowdId == this.crowdInfo.crowdId){
					if(data.sendUser.userId == this.userInfo.id){ //自己不在这加
						
					}else{
						switch(data.body.bodyType) {
							case "TEXT":{
								this.messages.push({
									user: 'him',
									content: data.body.text,
									hasSub: false,
									subcontent: {},
									userId: data.sendUser.userId,
									nickName:data.sendUser.nickName,
									headUrl:data.sendUser.headUrl,
									sendTime:data.sendTime,
									type: 'head', //input,content 
									isSucceed:true,
								});
								break
							}
							case "RED_PACKET":{
								this.messages.push({
									user: 'him',
									content: '',
									hasSub: true,
									subcontent: {
										name:'扫雷红包',
										isOpen:data.body.status,
										val:data.amount,
										lei:data.boomNum
									},
									userId: data.sendUser.userId,
									nickName:data.sendUser.nickName,
									headUrl:data.sendUser.headUrl,
									sendTime:data.sendTime,
									type: 'head', //input,content 
									isSucceed:true,
								});
								break
							}
							// name:'扫雷红包',val:data.money,lei:data.lei,isOpen:false
							// "redId": 30, // 红包Id
							// "title": "100-7", // 红包标题
							// "status": 0, // 红包状态： 0 未抢光 1 已抢光 2 已失效
							// "eventType": "COMMON",
							// "bodyType": "RED_PACKET"
						}
						this.scrollToBottom1();
					}
				}
			})
			
			uni.$on("fahongbao",(data)=>{ //发红包
				console.log(data)
				this.messages.push({
					user: 'customer',
					content: '',
					hasSub: true,
					// 红包状态： 0 未抢光 1 已抢光 2 已失效
					subcontent: {name:'扫雷红包',val:data.money,lei:data.lei,isOpen:1},
					userId: this.userInfo.userId,
					nickName:this.userInfo.nickName,
					headUrl:this.userInfo.headUrl,
					sendTime:new Date().getTime(),
					type: 'head', //input,content 
					isSucceed:true,
				});
			})
			
			// this.is_freshing = false;
			// setTimeout(() => {
			// 	this.triggered = true;
			// }, 1000)
		},
		watch:{
			value(newVal,oldVal){
				if(newVal){
					
				}else{
					this.rotate = false
				}
			}
		},
		methods: {
			scrolltoupper(){
				setTimeout(()=>{
					// console.log("到顶部")
					this.isActive = true
				},100)
			},
			scroll(e){
				this.scrollTop = e.detail.scrollTop
				// console.log("滚动",e.detail.scrollTop,e.detail.deltaY)
				if(e.detail.scrollTop == 0) {
					this.isActive = true
				}
				if(e.detail.deltaY < 0){
					this.isActive = false
				}
			},
			onPulling(e) { //下拉
				// console.log("onpulling", e);
				
			},
			onRefresh() { //触发下拉
				console.log("触发下拉",this.is_freshing)
				this.isScroll = false
				if (this.is_freshing) return;
				this.is_freshing = true;
				setTimeout(() => {
					this.triggered = false;
					this.is_freshing = false;
				}, 3000)
			},
			onRestore() { // 需要重置
				this.triggered = 'restore'; 
				this.isScroll = true
				console.log("onRestore");
			},
			onAbort() { // 中止
				console.log("onAbort");
			},
			scrollViewClick(){ //子组件来处理
				this.$refs.chatInput.scrollViewClick()
			},
			openHongbao(){
				
				this.rotate = true
				const innerAudioContext = uni.createInnerAudioContext();
				innerAudioContext.autoplay = true;
				innerAudioContext.src = '/static/audio/open_hb_msg.mp3';
				innerAudioContext.onPlay(() => {
				  // console.log('开始播放');
				});
				innerAudioContext.onError((res) => {
				  console.log(res.errMsg);
				  console.log(res.errCode);
				});
				setTimeout(()=>{
					setTimeout(()=>{
						this.value = false
					},278)
					
					uni.navigateTo({
						url:'./hongbaoxiangqing/hongbaoxiangqing?succeed='+true+''
					})
					
				},500)
			},
			messageContent(text){
				switch(text){
					case "shouman":{return"手慢了，红包派完了"; break}
					case "jifenbuzhu":{return"您的积分不足，请先充值"; break}
					case "kai":{return"恭喜发财，大吉大利"; break}
				}
			},
			toXiangqing(){
				this.value = false; 
				uni.navigateTo({url:'./hongbaoxiangqing/hongbaoxiangqing'})
			},
			closeHongbao(){
				this.value = false
			},
			hongbaoClick(message){
				
				console.log("红包点击",message)
				let rand = Math.random()
				if(rand < 0.3){ //模拟积分不足
					this.value = true
					this.isType = 'jifenbuzhu'
				} else if(true){ //正常打开红包
					this.value = true
					this.isType = 'kai'
				}else{ //模拟手慢
					this.value = true
					this.isType = 'shouman'
				}
				
			},
			getInputMessage: function (message) { //获取子组件的输入数据
				// console.log(message);
				
				this.toRobot(message.content);
				// this.setScrollH()
				
			},
			
			scrollToBottom: function () {
				var that = this;
				this.scrollTop += 133; 
				//console.log(this.scrollTop)
			},
			cha(){
				this.$http.httpTokenRequest({
					url: '/push/cha',
					method: 'post'
				}, {
					crowdId:this.crowdInfo.crowdId,
					msg:true,
				}).then(res => {
					if(res.data.success){
						console.log("查成功")
					}else{
						uni.showToast({
						    title: res.data.msg,
							icon:'none'
						})
					}
				},error => {
					uni.showToast({
						title:'错误'+error,
						icon:'none'
					})
				}) 
			},
			xiafen(val){ //下分
				this.$http.httpPostTokenPush('/push/withdraw',{
					crowdId:this.crowdInfo.crowdId,
					amount:val
				},(res)=>{
					
				},false);
			},
			shangfen(val){ //上分
				this.$http.httpPostTokenPush('/push/recharge',{
					crowdId:this.crowdInfo.crowdId,
					amount:val
				},(res)=>{
					
				},false);
			},
			toRobot: function (info) { //发消息
				if(info.indexOf('上分') != -1){
					var num = info.replace(/[^0-9]/ig,"");
					if(num && num.length>0 && Number(num) > 0){
						this.shangfen(Number(num));
						return;
					}else{
						uni.showModal({
							title:"提示",
							content:"正确上分格式是：上分+金额\n\n例：上分1000",
							showCancel:false,
							confirmText:"我知道了"
						})
					}
				}
				if(info.indexOf('下分') != -1){
					var num = info.replace(/[^0-9]/ig,"");
					if(num && num.length>0 && Number(num) > 0){
						this.xiafen(Number(num));
						return;
					}else{
						uni.showModal({
							title:"提示",
							content:"正确上分格式是：上分+金额\n\n例：上分1000",
							showCancel:false,
							confirmText:"我知道了"
						})
					}
				}
				if(info.indexOf("查") != -1 && info.length == 1){
					this.cha()
					return;
				}
				
				this.$http.httpPostTokenPush('/push/sendToCrowd',{
					crowdId:this.crowdInfo.crowdId,
					message:info
				},(res)=>{
					this.messages.push({
						user: 'customer',
						content: info,
						hasSub: false,
						subcontent: false,
						userId: this.userInfo.id,
						nickName:this.userInfo.nickName,
						headUrl:this.userInfo.headUrl,
						sendTime:new Date().getTime(),
						type: 'head', //input,content 
						isSucceed:true,
					});
					this.scrollToBottom1()
				})
				
			},
			scrollToBottom1: function () { //跳转页面底部
				let that = this;
				let query = uni.createSelectorQuery();
				query.selectAll('.m-item').boundingClientRect();
				query.select('#scrollview').boundingClientRect();
				query.exec((res) => {
					that.style.mitemHeight = 0;
					res[0].forEach((rect) => that.style.mitemHeight = that.style.mitemHeight + rect.height + 40)   //获取所有内部子元素的高度
					// 因为vue的虚拟DOM 每次生成的新消息都是之前的，所以采用异步setTimeout
					setTimeout(() => {
						if (that.style.mitemHeight > (that.style.contentViewHeight - 100)) {   //判断子元素高度是否大于显示高度
							that.scrollTop = that.style.mitemHeight - that.style.contentViewHeight - 10    //用子元素的高度减去显示的高度就获益获得序言滚动的高度
						}
					}, 100)
				})
			},
			// 设置高度 用emit辅助
			setScrollH(obj){
				// console.log('获取焦点或者表情触发',obj)
				// uni.showToast({
				// 	title: String(this.style.contentViewHeight)
				// })
				var query = uni.createSelectorQuery();
				let footh = query.select('.foot');
				//console.log('fh',footh);
				const res = uni.getSystemInfoSync();
				this.style.pageHeight = res.windowHeight;
				
				this.$nextTick(function(){
					footh.fields({
						size: true
					}, data => {
						footh = data.height;
						console.log('fh',data.height);
						if(obj) {
							if(obj.event){//键盘
							
								this.style.contentViewHeight = res.windowHeight - (Number(obj.event.detail.height) + footh)
								this.scrollToBottom1()
								
							}else if(obj.isShow) {
								this.style.contentViewHeight = res.windowHeight - footh ; //像素
								this.scrollToBottom1()
							} else{ //失焦和去表情
								this.style.contentViewHeight = res.windowHeight - footh ; //像素
								
							}
						}
					}).exec();	
					// uni.showToast({
					// 	title: String(this.style.contentViewHeight)
					// })
					console.log('contentViewHeight',this.style.contentViewHeight);
				})	
			},
			getCrowdInfo(id){
				this.crowdId = id
				this.$http.httpGetToken('/crowd/getById',{
					crowdId:id
				},(res) =>{
					this.crowdInfo = res.data
					this.crowdInfo.crowdId = id;
				},false);
			}
		}
	}
</script>

<style lang="scss">
	
	page{
		background-color: #eee;
	}
	.custom-view{
		overflow: hidden;
		z-index: 999;
		position: absolute;
		
		
		.hongbao{
			width: 580upx;
			height: 900upx;
			border-radius: 5px;
			.hongbaoBody{
				width: 100%;
				height: 800upx;
			}
			.close{
				position: absolute;
				bottom: 0;
				left: 50%;
				transform: translateX(-50%);
				width: 80upx;
				height: 80upx;
			}
			.messageInfo{
				position: absolute;
				width: 100%;
				top: 200upx;
				left: 50%;
				transform: translateX(-50%);
				text-align: center;
				color:#EDD3A2;
				.userHBInfo{
					image{
						display: inline-block;
						width: 80upx;
						height: 80upx;
						border-radius: 5px;
						vertical-align: middle;
					}
					text{
						margin-left: 15upx;
						
					}
					
				}
				.message{
					line-height: 100upx;
					
				}
				.shouman{
					position: absolute;
					bottom: -360upx;
					left: 50%;
					transform: translateX(-50%);
					font-size: 12px;
				}
				.kai{
					position: absolute;
					bottom: -240upx;
					left: calc(50% - 75upx);
					width: 150upx;
					height: 150upx;
				}
				.rotate{
					animation:rotate .8s infinite;
				}
				@keyframes rotate{
				    from{ -webkit-transform:rotateY(0deg);}
				    to{ -webkit-transform:rotateY(360deg);}     
				}
			}
		}
		
	}
	.uni-column {
		display: flex;
		flex-direction: column;
	}

	.content {

		display: flex;
		flex: 1;
		/* margin-bottom: 100upx; */
	}

	.foot {
		position: fixed;
		z-index: 999;
		width: 750upx;
		height: 90upx;
		min-height: 90upx;
		height: auto;
		left: 0upx;
		bottom: 0;
		overflow: hidden;
	}
</style>