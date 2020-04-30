<template>
	<view>
		<view class="content" @touchstart="hideDrawer">
			<scroll-view class="msg-list" scroll-y="true" :scroll-with-animation="scrollAnimation" :scroll-top="scrollTop" :scroll-into-view="scrollToView" @scrolltoupper="loadHistory" upper-threshold="50">
				<!-- 加载历史数据waitingUI -->
				<view class="loading">
					<view class="spinner">
						<view class="rect1"></view>
						<view class="rect2"></view>
						<view class="rect3"></view>
						<view class="rect4"></view>
						<view class="rect5"></view>
					</view>
				</view>
				
				<view class="row" v-for="(row,index) in msgList" :key="index" :id="'msg'+row.msg.id">
					
					
					
					<!-- 系统消息 -->
					<block v-if="row.type=='system'" >
						<view class="system">
							<!-- 文字消息 -->
							<view v-if="row.msg.type=='text'" class="text">
								{{row.msg.content.text}}
							</view>
							<!-- 领取红包消息 -->
							<view v-if="row.msg.type=='redEnvelope'" class="red-envelope">
							</view>
						</view>
					</block>
					<!-- 用户消息 -->
					<block v-if="row.type=='user'">
						<!-- 自己发出的消息 -->
						<view class="my" v-if="row.msg.userinfo.uid==myuid">
							<!-- 左-消息 -->
							<view class="left">
								<!-- 文字消息 -->
								<view v-if="row.msg.type=='text'" class="bubble" v-html="row.msg.content.text" >
									<!-- <rich-text :nodes="row.msg.content.text"></rich-text> -->
								</view>
								<!-- 语言消息 -->
								<view v-if="row.msg.type=='voice'" class="bubble voice" @tap="playVoice(row.msg)" :class="playMsgid == row.msg.id?'play':''">
									<view class="length">{{row.msg.content.length}}</view>
									<view class="icon my-voice"></view>
								</view>
								<!-- 图片消息 -->
								<view v-if="row.msg.type=='img'" class="bubble img" @tap="showPic(row.msg)">
									<image :src="row.msg.content.url" :style="{'width': row.msg.content.w+'px','height': row.msg.content.h+'px'}"></image>
								</view>
								<!-- 红包 -->
								<view v-if="row.msg.type=='redEnvelope'" class="bubble red-envelope" @tap="openRedEnvelope(row.msg,index)">
									<image src="/static/img/red-envelope.png"></image>
									<view class="tis">
										<!-- 点击开红包 -->
									</view>
									<view class="blessing">
										{{row.msg.content.blessing}}
									</view>
								</view>
								
							</view>
							<!-- 右-头像 -->
							<view class="right">
								<image :src="row.msg.userinfo.face"></image>
							</view>
						</view>
						<!-- 别人发出的消息 -->
						<view class="other" v-if="row.msg.userinfo.uid!=myuid">
							<!-- 左-头像 -->
							<view class="left">
								<image :src="row.msg.userinfo.face"></image>
							</view>
							<!-- 右-用户名称-时间-消息 -->
							<view class="right">
								<view class="username">
									<view class="name">{{row.msg.userinfo.username}}</view> <view class="time">{{row.msg.time}}</view>
								</view>
								<!-- 文字消息 -->
								<view v-if="row.msg.type=='text'" class="bubble" v-html="row.msg.content.text">
								</view>
								<!-- 语音消息 -->
								<view v-if="row.msg.type=='voice'" class="bubble voice" @tap="playVoice(row.msg)" :class="playMsgid == row.msg.id?'play':''">
									<view class="icon other-voice"></view>
									<view class="length">{{row.msg.content.length}}</view>
								</view>
								<!-- 图片消息 -->
								<view v-if="row.msg.type=='img'" class="bubble img" @tap="showPic(row.msg)">
									<image :src="row.msg.content.url" :style="{'width': row.msg.content.w+'px','height': row.msg.content.h+'px'}"></image>
								</view>
								<!-- 红包 -->
								<view v-if="row.msg.type=='redEnvelope'" class="bubble red-envelope" @tap="openRedEnvelope(row.msg,index)">
									<image src="/static/img/red-envelope.png"></image>
									<view class="tis">
										<!-- 点击开红包 -->
									</view>
									<view class="blessing">
										{{row.msg.content.blessing}}
									</view>
								</view>
							</view>
						</view>
					</block>
				</view>
				
				
			</scroll-view>
		</view>
		<!-- 抽屉栏 -->
		<view class="popup-layer" :class="popupLayerClass" @touchmove.stop.prevent="discard">
			<!-- 表情 --> 
			<swiper class="emoji-swiper" :class="{hidden:hideEmoji}" indicator-dots="true" duration="150">
				<swiper-item v-for="(page,pid) in emojiList" :key="pid">
					<view v-for="(em,eid) in page" :key="eid" @tap="addEmoji(em)">
						<image mode="widthFix" :src="'/static/img/emoji/'+em.url"></image>
					</view>
				</swiper-item>
			</swiper>
			<!-- 更多功能 相册-拍照-红包 -->
			<view class="more-layer" :class="{hidden:hideMore}">
				<view class="list">
					<view class="box" @tap="chooseImage"><view class="icon tupian2"></view></view>
					<view class="box" @tap="camera"><view class="icon paizhao"></view></view>
					<view class="box" @tap="handRedEnvelopes"><view class="icon hongbao"></view></view>
				</view>
			</view>
		</view>
		<!-- 底部输入栏 -->
		<view class="input-box" :class="popupLayerClass" @touchmove.stop.prevent="discard">
			<!-- H5下不能录音，输入栏布局改动一下 -->
			<!-- #ifndef H5 -->
			<view class="voice">
				<view class="icon" :class="isVoice?'jianpan':'yuyin'" @tap="switchVoice"></view>
			</view>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view class="more" @tap="showMore">
				<view class="icon add"></view>
			</view>
			<!-- #endif -->
			<view class="textbox">
				<view class="voice-mode" :class="[isVoice?'':'hidden',recording?'recording':'']" @touchstart="voiceBegin" @touchmove.stop.prevent="voiceIng" @touchend="voiceEnd" @touchcancel="voiceCancel">{{voiceTis}}</view>
				<view class="text-mode"  :class="isVoice?'hidden':''">
					<view class="box">
						<textarea auto-height="true" v-model="textMsg" @focus="textareaFocus"/>
					</view>
					<view class="em" @tap="chooseEmoji">
						<view class="icon biaoqing"></view>
					</view>
				</view>
			</view>
			<!-- #ifndef H5 -->
			<view class="more" @tap="showMore">
				<view class="icon add"></view>
			</view>
			<!-- #endif -->
			<view class="send" :class="isVoice?'hidden':''" @tap="sendText">
				<view class="btn">发送</view>
			</view>
		</view>
		<!-- 录音UI效果 -->
		<view class="record" :class="recording?'':'hidden'">
			<view class="ing" :class="willStop?'hidden':''"><view class="icon luyin2" ></view></view>
			<view class="cancel" :class="willStop?'':'hidden'"><view class="icon chehui" ></view></view>
			<view class="tis" :class="willStop?'change':''">{{recordTis}}</view>
		</view>
		
		
		<!-- 红包弹窗 -->
		<view class="windows" :class="windowsState">
			<!-- 遮罩层 -->
			<view class="mask" @touchmove.stop.prevent="discard" @tap="closeRedEnvelope"></view>
			<view class="layer" @touchmove.stop.prevent="discard">
				<view class="open-redenvelope">
					<view class="top">
						<view class="close-btn">
							<view class="icon close" @tap="closeRedEnvelope"></view>
						</view>
						<image src="/static/img/im/face/face_1.jpg"></image>
					</view>
					<view class="from">来自{{redenvelopeData.from}}</view>
					<view class="blessing">{{redenvelopeData.blessing}}</view>
					<view class="money">{{redenvelopeData.money}}</view>
					<view class="showDetails" @tap="toDetails(redenvelopeData.rid)">
						查看领取详情 <view class="icon to"></view>
					</view>
				</view>
			</view>
			
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				//文字消息
				textMsg:'',
				//消息列表
				isHistoryLoading:false,
				scrollAnimation:false,
				scrollTop:0,
				scrollToView:'',
				msgList:[],
				msgImgList:[],
				myuid:0,
				
				//录音相关参数
				// #ifndef H5
				//H5不能录音
				RECORDER:uni.getRecorderManager(),
				// #endif
				isVoice:false,
				voiceTis:'按住 说话',
				recordTis:"手指上滑 取消发送",
				recording:false,
				willStop:false,
				initPoint:{identifier:0,Y:0},
				recordTimer:null,
				recordLength:0,
				
				//播放语音相关参数
				AUDIO:uni.createInnerAudioContext(),
				playMsgid:null,
				VoiceTimer:null,
				// 抽屉参数
				popupLayerClass:'',
				// more参数
				hideMore:true,
				//表情定义
				hideEmoji:true,
				emojiList: [[{"url":"emoji_00.png","alt":"[微笑]"},{"url":"emoji_01.png","alt":"[撇嘴]"},{"url":"emoji_02.png","alt":"[色]"},{"url":"emoji_03.png","alt":"[发呆]"},{"url":"emoji_04.png","alt":"[得意]"},{"url":"emoji_05.png","alt":"[流泪]"},{"url":"emoji_06.png","alt":"[害羞]"},{"url":"emoji_07.png","alt":"[闭嘴]"},{"url":"emoji_08.png","alt":"[睡]"},{"url":"emoji_09.png","alt":"[大哭]"},{"url":"emoji_10.png","alt":"[尴尬]"},{"url":"emoji_11.png","alt":"[发怒]"},{"url":"emoji_12.png","alt":"[调皮]"},{"url":"emoji_13.png","alt":"[呲牙]"},{"url":"emoji_14.png","alt":"[惊讶]"},{"url":"emoji_15.png","alt":"[难过]"},{"url":"emoji_16.png","alt":"[酷]"},{"url":"emoji_17.png","alt":"[冷汗]"},{"url":"emoji_18.png","alt":"[抓狂]"},{"url":"emoji_19.png","alt":"[吐]"},{"url":"emoji_20.png","alt":"[偷笑]"},{"url":"emoji_21.png","alt":"[可爱]"},{"url":"emoji_22.png","alt":"[白眼]"},{"url":"emoji_23.png","alt":"[傲慢]"}],[{"url":"emoji_24.png","alt":"[饥饿]"},{"url":"emoji_25.png","alt":"[困]"},{"url":"emoji_26.png","alt":"[惊恐]"},{"url":"emoji_27.png","alt":"[流汗]"},{"url":"emoji_28.png","alt":"[憨笑]"},{"url":"emoji_29.png","alt":"[大兵]"},{"url":"emoji_30.png","alt":"[奋斗]"},{"url":"emoji_31.png","alt":"[咒骂]"},{"url":"emoji_32.png","alt":"[疑问]"},{"url":"emoji_33.png","alt":"[嘘]"},{"url":"emoji_34.png","alt":"[晕]"},{"url":"emoji_35.png","alt":"[折磨]"},{"url":"emoji_36.png","alt":"[衰]"},{"url":"emoji_37.png","alt":"[骷髅]"},{"url":"emoji_38.png","alt":"[敲打]"},{"url":"emoji_39.png","alt":"[再见]"},{"url":"emoji_40.png","alt":"[擦汗]"},{"url":"emoji_41.png","alt":"[抠鼻]"},{"url":"emoji_42.png","alt":"[鼓掌]"},{"url":"emoji_43.png","alt":"[糗大了]"},{"url":"emoji_44.png","alt":"[坏笑]"},{"url":"emoji_45.png","alt":"[左哼哼]"},{"url":"emoji_46.png","alt":"[右哼哼]"},{"url":"emoji_47.png","alt":"[哈欠]"}],[{"url":"emoji_48.png","alt":"[鄙视]"},{"url":"emoji_49.png","alt":"[委屈]"},{"url":"emoji_50.png","alt":"[快哭了]"},{"url":"emoji_51.png","alt":"[阴险]"},{"url":"emoji_52.png","alt":"[亲亲]"},{"url":"emoji_53.png","alt":"[吓]"},{"url":"emoji_54.png","alt":"[可怜]"},{"url":"emoji_55.png","alt":"[菜刀]"},{"url":"emoji_56.png","alt":"[西瓜]"},{"url":"emoji_57.png","alt":"[啤酒]"},{"url":"emoji_58.png","alt":"[篮球]"},{"url":"emoji_59.png","alt":"[乒乓]"},{"url":"emoji_60.png","alt":"[咖啡]"},{"url":"emoji_61.png","alt":"[饭]"},{"url":"emoji_62.png","alt":"[猪头]"},{"url":"emoji_63.png","alt":"[玫瑰]"},{"url":"emoji_64.png","alt":"[凋谢]"},{"url":"emoji_65.png","alt":"[示爱]"},{"url":"emoji_66.png","alt":"[爱心]"},{"url":"emoji_67.png","alt":"[心碎]"},{"url":"emoji_68.png","alt":"[蛋糕]"},{"url":"emoji_69.png","alt":"[闪电]"},{"url":"emoji_70.png","alt":"[炸弹]"},{"url":"emoji_71.png","alt":"[刀]"}],[{"url":"emoji_72.png","alt":"[足球]"},{"url":"emoji_73.png","alt":"[瓢虫]"},{"url":"emoji_74.png","alt":"[便便]"},{"url":"emoji_75.png","alt":"[月亮]"},{"url":"emoji_76.png","alt":"[太阳]"},{"url":"emoji_77.png","alt":"[礼物]"},{"url":"emoji_78.png","alt":"[拥抱]"},{"url":"emoji_79.png","alt":"[强]"},{"url":"emoji_80.png","alt":"[弱]"},{"url":"emoji_81.png","alt":"[握手]"},{"url":"emoji_82.png","alt":"[胜利]"},{"url":"emoji_83.png","alt":"[抱拳]"},{"url":"emoji_84.png","alt":"[勾引]"},{"url":"emoji_85.png","alt":"[拳头]"},{"url":"emoji_86.png","alt":"[差劲]"},{"url":"emoji_87.png","alt":"[爱你]"},{"url":"emoji_88.png","alt":"[NO]"},{"url":"emoji_89.png","alt":"[OK]"},{"url":"emoji_90.png","alt":"[爱情]"},{"url":"emoji_91.png","alt":"[飞吻]"},{"url":"emoji_92.png","alt":"[跳跳]"},{"url":"emoji_93.png","alt":"[发抖]"},{"url":"emoji_94.png","alt":"[怄火]"},{"url":"emoji_95.png","alt":"[转圈]"}],[{"url":"emoji_96.png","alt":"[磕头]"},{"url":"emoji_97.png","alt":"[回头]"},{"url":"emoji_98.png","alt":"[跳绳]"},{"url":"emoji_99.png","alt":"[挥手]"},{"url":"emoji_100.png","alt":"[激动]"},{"url":"emoji_101.png","alt":"[街舞]"},{"url":"emoji_102.png","alt":"[献吻]"},{"url":"emoji_103.png","alt":"[左太极]"},{"url":"emoji_104.png","alt":"[右太极]"}]],
				//红包相关参数
				windowsState:'',
				redenvelopeData:{
					rid:null,	//红包ID
					from:null,
					face:null,
					blessing:null,
					money:null
				}
			};
		},
		onLoad(option) {
			
			// 初始化数据
			this.init(option);
			// 设置标题
			this.setTitle(this.crowdInfo.name);
			// 开启消息监听
			this.startListener();
			this.getMsgList();
			//语音自然播放结束
			this.AUDIO.onEnded((res)=>{
				this.playMsgid=null;
			});
			// #ifndef H5
			//录音开始事件
			this.RECORDER.onStart((e)=>{
				this.recordBegin(e);
			})
			//录音结束事件
			this.RECORDER.onStop((e)=>{
				this.recordEnd(e);
			})
			// #endif
			

	
			
		},
		onShow(){
			this.scrollTop = 9999999;
			
			//模板借由本地缓存实现发红包效果，实际应用中请不要使用此方法。
			//
			// uni.getStorage({
			// 	key: 'redEnvelopeData',
			// 	success:  (res)=>{
			// 		console.log(res.data);
			// 		let nowDate = new Date();
			// 		let lastid = this.msgList[this.msgList.length-1].msg.id;
			// 		lastid++;
			// 		let row = {type:"user",msg:{id:lastid,type:"redEnvelope",time:nowDate.getHours()+":"+nowDate.getMinutes(),userinfo:{uid:0,username:"大黑哥",face:"/static/img/face.jpg"},content:{blessing:res.data.blessing,rid:Math.floor(Math.random()*1000+1),isReceived:false}}};
			// 		this.screenMsg(row);
			// 		uni.removeStorage({key: 'redEnvelopeData'});
			// 	}
			// });
		},
		onNavigationBarButtonTap:function() {
			uni.navigateTo({
				url:'/pages/tabbar/tabbar-5/qunzhushezhi/liaotianxinxi/liaotianxinxi?crowdId='+this.crowdInfo.id+''
			})
		},
		methods:{
			init(option){
				console.log('群信息',option)
				// 群信息
				this.crowdInfo = JSON.parse(option.crowdInfo)
				// 用户信息
				this.userInfo =  uni.getStorageSync('userInfo')
				this.myuid = this.userInfo.id;
			},
			setTitle(title){
				uni.setNavigationBarTitle({
					title: title
				})
			},
			startListener(){
				uni.$on('CROWD',(data)=>{
					if(data.crowdId != this.crowdInfo.id){
						return;
					}
					this.onMessage(data);
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
			},
			onMessage(data){
				//自己发送的消息，这里不需要处理
				if(data.sendUser.userId == this.userInfo.id){ 
					return;
				}
				this.convertMsg(data);
			},
			convertMsg(data){
			
			    var msgId = data.sendTime+''+data.sendUser.id;
				switch(data.body.bodyType) {
					case "TEXT":{
						var eventType =  data.body.eventType;
						switch(eventType){
							case "COMMON":{
								var msg = {
									type:"user",
									msg:{
										id:msgId,
										type:"text",
										time:this.calcTime(data.sendTime),
										userinfo:{
											uid:data.sendUser.id,
											username:data.sendUser.nickName,
											face:data.sendUser.headUrl?data.sendUser.headUrl:'/static/moren.png',
										},
										content:{
											text: data.body.text,
											},
										},
									};
								this.addTextMsg(msg);
								break;
							}
						}
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
				}

				this.$nextTick(function() {
					// 滚动到底
					this.scrollToView = 'msg'+msgId
				});
				
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
			// 接受消息(筛选处理)
			screenMsg(msg){
				//从长连接处转发给这个方法，进行筛选处理
				if(msg.type=='system'){
					// 系统消息
					switch (msg.msg.type){
						case 'text':
							this.addSystemTextMsg(msg);
							break;
						case 'redEnvelope':
							this.addSystemRedEnvelopeMsg(msg);
							break;
					}
				}else if(msg.type=='user'){
					// 用户消息
					switch (msg.msg.type){
						case 'text':
							this.addTextMsg(msg);
							break;
						case 'voice':
							this.addVoiceMsg(msg);
							break;
						case 'img':
							this.addImgMsg(msg);
							break;
						case 'redEnvelope':
							this.addRedEnvelopeMsg(msg);
							break;
					}
					console.log('用户消息');
					//非自己的消息震动
					if(msg.msg.userinfo.uid!=this.myuid){
						console.log('振动');
						uni.vibrateLong();
					}
				}
				this.$nextTick(function() {
					// 滚动到底
					this.scrollToView = 'msg'+msg.msg.id
				});
			},
			
			//触发滑动到顶部(加载历史信息记录)
			loadHistory(e){
				if(this.isHistoryLoading){
					return ;
				}
				this.isHistoryLoading = true;//参数作为进入请求标识，防止重复请求
				this.scrollAnimation = false;//关闭滑动动画
				let Viewid = this.msgList[0].msg.id;//记住第一个信息ID
				//本地模拟请求历史记录效果
				setTimeout(()=>{
					// 消息列表
					let list = [
						{type:"user",msg:{id:1,type:"text",time:"12:56",userinfo:{uid:0,username:"大黑哥",face:"/static/img/face.jpg"},content:{text:"为什么温度会相差那么大？"}}},
						{type:"user",msg:{id:2,type:"text",time:"12:57",userinfo:{uid:1,username:"售后客服008",face:"/static/img/im/face/face_2.jpg"},content:{text:"这个是有偏差的，两个温度相差十几二十度是很正常的，如果相差五十度，那即是质量问题了。"}}},
						{type:"user",msg:{id:3,type:"voice",time:"12:59",userinfo:{uid:1,username:"售后客服008",face:"/static/img/im/face/face_2.jpg"},content:{url:"/static/voice/1.mp3",length:"00:06"}}},
						{type:"user",msg:{id:4,type:"voice",time:"13:05",userinfo:{uid:0,username:"大黑哥",face:"/static/img/face.jpg"},content:{url:"/static/voice/2.mp3",length:"00:06"}}},
					]
					// 获取消息中的图片,并处理显示尺寸
					for(let i=0;i<list.length;i++){
						if(list[i].type=='user'&&list[i].msg.type=="img"){
							list[i].msg.content = this.setPicSize(list[i].msg.content);
							this.msgImgList.unshift(list[i].msg.content.url);
						}
						list[i].msg.id = Math.floor(Math.random()*1000+1);
						this.msgList.unshift(list[i]);
					}
					
					//这段代码很重要，不然每次加载历史数据都会跳到顶部
					this.$nextTick(function() {
						this.scrollToView = 'msg'+Viewid;//跳转上次的第一行信息位置
						this.$nextTick(function() {
							this.scrollAnimation = true;//恢复滚动动画
						});
						
					});
					this.isHistoryLoading = false;
					
				},1000)
			},
			// 加载初始页面消息
			getMsgList(){
				// 消息列表
				let list = [
					{type:"system",msg:{id:0,type:"text",content:{text:"欢迎进入HM-chat聊天室"}}},
					{type:"user",msg:{id:1,type:"text",time:"12:56",userinfo:{uid:0,username:"大黑哥",face:"/static/img/face.jpg"},content:{text:"为什么温度会相差那么大？"}}},
					{type:"user",msg:{id:2,type:"text",time:"12:57",userinfo:{uid:1,username:"售后客服008",face:"/static/img/im/face/face_2.jpg"},content:{text:"这个是有偏差的，两个温度相差十几二十度是很正常的，如果相差五十度，那即是质量问题了。"}}},
					{type:"user",msg:{id:3,type:"voice",time:"12:59",userinfo:{uid:1,username:"售后客服008",face:"/static/img/im/face/face_2.jpg"},content:{url:"/static/voice/1.mp3",length:"00:06"}}},
					{type:"user",msg:{id:4,type:"voice",time:"13:05",userinfo:{uid:0,username:"大黑哥",face:"/static/img/face.jpg"},content:{url:"/static/voice/2.mp3",length:"00:06"}}},
					{type:"user",msg:{id:5,type:"img",time:"13:05",userinfo:{uid:0,username:"大黑哥",face:"/static/img/face.jpg"},content:{url:"/static/img/p10.jpg",w:200,h:200}}},
					{type:"user",msg:{id:6,type:"img",time:"12:59",userinfo:{uid:1,username:"售后客服008",face:"/static/img/im/face/face_2.jpg"},content:{url:"/static/img/q.jpg",w:1920,h:1080}}},
					{type:"system",msg:{id:7,type:"text",content:{text:"欢迎进入HM-chat聊天室"}}},
					
					{type:"system",msg:{id:9,type:"redEnvelope",content:{text:"售后客服008领取了你的红包"}}},
					{type:"user",msg:{id:10,type:"redEnvelope",time:"12:56",userinfo:{uid:0,username:"大黑哥",face:"/static/img/face.jpg"},content:{blessing:"恭喜发财，大吉大利，万事如意",rid:0,isReceived:false}}},
					{type:"user",msg:{id:11,type:"redEnvelope",time:"12:56",userinfo:{uid:1,username:"售后客服008",face:"/static/img/im/face/face_2.jpg"},content:{blessing:"恭喜发财",rid:1,isReceived:false}}},
				]
				// 获取消息中的图片,并处理显示尺寸
				for(let i=0;i<list.length;i++){
					if(list[i].type=='user'&&list[i].msg.type=="img"){
						list[i].msg.content = this.setPicSize(list[i].msg.content);
						this.msgImgList.push(list[i].msg.content.url);
					}
				}
				this.msgList = list;
				// 滚动到底部
				this.$nextTick(function() {
					//进入页面滚动到底部
					this.scrollTop = 9999;
					this.$nextTick(function() {
						this.scrollAnimation = true;
					});
					
				});
			},
			//处理图片尺寸，如果不处理宽高，新进入页面加载图片时候会闪
			setPicSize(content){
				// 让图片最长边等于设置的最大长度，短边等比例缩小，图片控件真实改变，区别于aspectFit方式。
				let maxW = uni.upx2px(350);//350是定义消息图片最大宽度
				let maxH = uni.upx2px(350);//350是定义消息图片最大高度
				if(content.w>maxW||content.h>maxH){
					let scale = content.w/content.h;
					content.w = scale>1?maxW:maxH*scale;
					content.h = scale>1?maxW/scale:maxH;
				}
				return content;
			},
			
			//更多功能(点击+弹出) 
			showMore(){
				this.isVoice = false;
				this.hideEmoji = true;
				if(this.hideMore){
					this.hideMore = false;
					this.openDrawer();
				}else{
					this.hideDrawer();
				}
			},
			// 打开抽屉
			openDrawer(){
				this.popupLayerClass = 'showLayer';
			},
			// 隐藏抽屉
			hideDrawer(){
				this.popupLayerClass = '';
				setTimeout(()=>{
					this.hideMore = true;
					this.hideEmoji = true;
				},150);
			},
			// 选择图片发送
			chooseImage(){
				this.getImage('album');
			},
			//拍照发送
			camera(){
				this.getImage('camera');
			},
			//发红包
			handRedEnvelopes(){
				uni.navigateTo({
					url:'HM-hand/HM-hand'
				});
				this.hideDrawer();
			},
			//选照片 or 拍照
			getImage(type){
				this.hideDrawer();
				uni.chooseImage({
					sourceType:[type],
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					success: (res)=>{
						for(let i=0;i<res.tempFilePaths.length;i++){
							uni.getImageInfo({
								src: res.tempFilePaths[i],
								success: (image)=>{
									console.log(image.width);
									console.log(image.height);
									let msg = {url:res.tempFilePaths[i],w:image.width,h:image.height};
									this.sendMsg(msg,'img');
								}
							});
						}
					}
				});
			},
			// 选择表情
			chooseEmoji(){
				this.hideMore = true;
				if(this.hideEmoji){
					this.hideEmoji = false;
					this.openDrawer();
				}else{
					this.hideDrawer();
				}
			},
			//添加表情
			addEmoji(em){
				this.textMsg+=em.alt;
			},
			
			//获取焦点，如果不是选表情ing,则关闭抽屉
			textareaFocus(){
				if(this.popupLayerClass=='showLayer' && this.hideMore == false){
					this.hideDrawer();
				}
			},
			// 发送文字消息
			sendText(){
				this.hideDrawer();//隐藏抽屉
				if(!this.textMsg){
					return;
				}
				let msg = {text : this.textMsg}
				this.sendMsg(msg,'text');
				this.textMsg = '';//清空输入框
			},
			//替换表情符号为图片
			replaceEmoji(str){
				let replacedStr = str.replace(/\[([^(\]|\[)]*)\]/g,(item, index)=>{
					console.log("item: " + item);
					for(let i=0;i<this.emojiList.length;i++){
						let row = this.emojiList[i];
						for(let j=0;j<row.length;j++){
							let EM = row[j];
							if(EM.alt==item){
								let imgstr = '<image style="width:30px;height:30px;" src="static/img/emoji/'+EM.url+'" />'
								return imgstr;
							}
						}
					}
				});
				return '<div style="display: flex;align-items: center;word-wrap:break-word;">'+replacedStr+'</div>';
			},
			
			// 发送消息
			sendMsg(content,type){
		
				if(type == 'text'){
					var info = content.text;
					console.log((info))
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
							return;
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
							return;
						}
					}
					if(info.indexOf("查") != -1 && info.length == 1){
						this.cha()
						return;
					}
					
					this.$http.httpPostTokenPush('/push/sendToCrowd',{
						crowdId:this.crowdInfo.id,
						message:info
					},(res)=>{
						let c = this.replaceEmoji(info);
						console.log(c)
						this.sendCommonMsg(c);
					})
				}
			},
			
			cha(){
				this.$http.httpPostTokenPush('/push/cha',{
					crowdId:this.crowdInfo.id
				},(res)=>{
						this.sendCommonMsg("查");
				},false);
			},
			xiafen(val){ //下分
				this.$http.httpPostTokenPush('/push/withdraw',{
					crowdId:this.crowdInfo.id,
					amount:val
				},(res)=>{
						this.sendCommonMsg("下分/"+val);
				},false);
			},
			shangfen(val){ //上分
				this.$http.httpPostTokenPush('/push/recharge',{
					crowdId:this.crowdInfo.id,
					amount:val
				},(res)=>{
					// 发送消息
					this.sendCommonMsg("上分/"+val);
				},false);
			},
			sendCommonMsg(data){
				var nowDate = new Date();
				let lastid = this.msgList[this.msgList.length-1].msg.id;
				lastid = lastid+"01";
				let msg = {
					type:'user',
					msg:{
						id:lastid,
						time:this.calcTime(nowDate.getTime()),
						type:'text',
						userinfo:{
							uid:this.userInfo.id,
							username:this.userInfo.nickName,
							face: this.userInfo.headUrl?this.userInfo.headUrl:"/static/moren.png",
						},
						content:{
							text:data
						},
						},
					}
				this.addTextMsg(msg);
				
				this.$nextTick(function() {
					// 滚动到底
					this.scrollToView = 'msg'+msg.msg.id
				});
				
			},
			// 添加文字消息到列表
			addTextMsg(msg){
				this.msgList.push(msg);
			},
			// 添加语音消息到列表
			addVoiceMsg(msg){
				this.msgList.push(msg);
			},
			// 添加图片消息到列表
			addImgMsg(msg){
				msg.msg.content = this.setPicSize(msg.msg.content);
				this.msgImgList.push(msg.msg.content.url);
				this.msgList.push(msg);
			},
			addRedEnvelopeMsg(msg){
				this.msgList.push(msg);
			},
			// 添加系统文字消息到列表
			addSystemTextMsg(msg){
				this.msgList.push(msg);
			},
			// 添加系统红包消息到列表
			addSystemRedEnvelopeMsg(msg){
				this.msgList.push(msg);
			},
			// 打开红包
			openRedEnvelope(msg,index){
				let rid = msg.content.rid;
				uni.showLoading({
					title:'加载中...'
				});
				console.log("index: " + index);
				//模拟请求服务器效果
				setTimeout(()=>{
					//加载数据
					if(rid==0){
						this.redenvelopeData={
							rid:0,	//红包ID
							from:"大黑哥",
							face:"/static/img/im/face/face.jpg",
							blessing:"恭喜发财，大吉大利",
							money:"已领完"
						}
					}else{
						this.redenvelopeData={
							rid:1,	//红包ID
							from:"售后客服008",
							face:"/static/img/im/face/face_2.jpg",
							blessing:"恭喜发财",
							money:"0.01"
						}
						if(!msg.content.isReceived){
							// {type:"system",msg:{id:8,type:"redEnvelope",content:{text:"你领取了售后客服008的红包"}}},
							this.sendSystemMsg({text:"你领取了"+(msg.userinfo.uid==this.myuid?"自己":msg.userinfo.username)+"的红包"},'redEnvelope');
							console.log("this.msgList[index]: " + JSON.stringify(this.msgList[index]));
							this.msgList[index].msg.content.isReceived = true;
						}
					}
					uni.hideLoading();
					this.windowsState = 'show';
					
				},200)
				
			},
			// 关闭红包弹窗
			closeRedEnvelope(){
				this.windowsState = 'hide';
				setTimeout(()=>{
					this.windowsState = '';
				},200)
			},
			sendSystemMsg(content,type){
				let lastid = this.msgList[this.msgList.length-1].msg.id;
				lastid++;
				let row = {type:"system",msg:{id:lastid,type:type,content:content}};
				this.screenMsg(row)
			},
			//领取详情
			toDetails(rid){
				uni.navigateTo({
					url:'HM-details/HM-details?rid='+rid
				})
			},
			// 预览图片
			showPic(msg){
				uni.previewImage({
					indicator:"none",
					current:msg.content.url,
					urls: this.msgImgList
				});
			},
			// 播放语音
			playVoice(msg){
				this.playMsgid=msg.id;
				this.AUDIO.src = msg.content.url;
				this.$nextTick(function() {
					this.AUDIO.play();
				});
			},
			// 录音开始
			voiceBegin(e){
				if(e.touches.length>1){
					return ;
				}
				this.initPoint.Y = e.touches[0].clientY;
				this.initPoint.identifier = e.touches[0].identifier;
				this.RECORDER.start({format:"mp3"});//录音开始,
			},
			//录音开始UI效果
			recordBegin(e){
				this.recording = true;
				this.voiceTis='松开 结束';
				this.recordLength = 0;
				this.recordTimer = setInterval(()=>{
					this.recordLength++;
				},1000)
			},
			// 录音被打断
			voiceCancel(){
				this.recording = false;
				this.voiceTis='按住 说话';
				this.recordTis = '手指上滑 取消发送'
				this.willStop = true;//不发送录音
				this.RECORDER.stop();//录音结束
			},
			// 录音中(判断是否触发上滑取消发送)
			voiceIng(e){
				if(!this.recording){
					return;
				}
				let touche = e.touches[0];
				//上滑一个导航栏的高度触发上滑取消发送
				if(this.initPoint.Y - touche.clientY>=uni.upx2px(100)){
					this.willStop = true;
					this.recordTis = '松开手指 取消发送'
				}else{
					this.willStop = false;
					this.recordTis = '手指上滑 取消发送'
				}
			},
			// 结束录音
			voiceEnd(e){
				if(!this.recording){
					return;
				}
				this.recording = false;
				this.voiceTis='按住 说话';
				this.recordTis = '手指上滑 取消发送'
				this.RECORDER.stop();//录音结束
			},
			//录音结束(回调文件)
			recordEnd(e){
				clearInterval(this.recordTimer);
				if(!this.willStop){
					console.log("e: " + JSON.stringify(e));
					let msg = {
						length:0,
						url:e.tempFilePath
					}
					let min = parseInt(this.recordLength/60);
					let sec = this.recordLength%60;
					min = min<10?'0'+min:min;
					sec = sec<10?'0'+sec:sec;
					msg.length = min+':'+sec;
					this.sendMsg(msg,'voice');
				}else{
					console.log('取消发送录音');
				}
				this.willStop = false;
			},
			// 切换语音/文字输入
			switchVoice(){
				this.hideDrawer();
				this.isVoice = this.isVoice?false:true;
			},
			discard(){
				return;
			}
		}
	}
</script>
<style lang="scss">
	@import "@/static/HM-chat/css/style.scss"; 
</style>