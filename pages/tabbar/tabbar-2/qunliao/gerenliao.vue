<template  class="app">
	<view>
		<view class="content" @touchstart="hideDrawer">
			
			<scroll-view class="msg-list" 
			scroll-y="true" 
			scroll-x="false"
			:scroll-with-animation="scrollAnimation" 
			:scroll-top="scrollTop" 
			:scroll-into-view="scrollToView"
			 @scroll="scroll"
			 :upper-threshold="50" >
				
		
				
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
									<!-- <image :src="row.msg.content.url" @error="imgError" :style="{'width': row.msg.content.w+'px','height': row.msg.content.h+'px'}"></image> -->
								
								<org-image :src="row.msg.content.url" :style="{'width': row.msg.content.w+'px','height': row.msg.content.h+'px'}"></org-image>
								</view>
							
								
							</view>
							<!-- 右-头像 -->
							<view class="right">
								<!-- <image :src="row.msg.userinfo.face"></image> -->
								
								<org-image :src="userInfo.headUrl"></org-image>
							</view>
						</view>
						<!-- 别人发出的消息 -->
						<view class="other" v-if="row.msg.userinfo.uid!=myuid">
							<!-- 左-头像 -->
							<view class="left">
								<!-- <image :src="row.msg.userinfo.face"></image> -->
								<org-image :src="row.msg.userinfo.face"></org-image>
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
									<!-- <image :src="row.msg.content.url"  @error="imgError" :style="{'width': row.msg.content.w+'px','height': row.msg.content.h+'px'}"></image> -->
							
									<org-image :src="row.msg.content.url" :style="{'width': row.msg.content.w+'px','height': row.msg.content.h+'px'}"></org-image>
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
			<!-- H5下不能录音，输入栏布局改动一下 -->
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

		
	</view>
</template>
<script>

	import orgImage from '@/components/org-image/org-image.vue'
	
	export default {
		components: {
			orgImage
		},
		data() {
			return {
				userInfo:{},
				fromUserId:'',
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
				height:0, //状态栏加导航栏的高度
				
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
					kaiStatus:true,
					roateStatus:false,
					isChakan:false,
					msg:null
				},
				isBottom:true
		
			};
		},
		
		onLoad(option) {
			
			// 初始化数据
			this.init(option);
			
			// 设置标题
			if(option.nickName){
				this.setTitle(option.nickName);
			}
			// 开启消息监听
			this.startListener();
			// this.getMsgList();
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
				console.log("录音结束")
				this.recordEnd(e);
			})
			// #endif
		},
		onShow(){
			console.log("onShow")
			this.scrollTop = 9999999;
			uni.$emit("ping")
			uni.$emit("isPush",false);
		},
	
		methods:{
			imgError(event){
			},
			lower(){
				console.log("到底部了")
				this.isBottom = true;
				
			},
			scroll(e){
			},
			
			
			init(option){
				console.log('用户信息',option)
				// 群信息
				// 用户信息
				this.userInfo =  uni.getStorageSync('userInfo')
				
				this.myuid = this.userInfo.id;
				this.fromUserId = option.userId;
				
				uni.getSystemInfo({
				    success: (e) => {
				      
				      // #ifdef APP-PLUS
				      // console.log('app-plus', e)
				      
				      this.height = e.statusBarHeight + 44
				      // #endif
					}
				})
				
				var aloneList = uni.getStorageSync("aloneList");
				if(aloneList.length > 300){
					aloneList.splice(0,aloneList.length - 300);
					uni.setStorageSync("aloneList",aloneList);
				}
				if(aloneList){
					var lastMsgId;
					for(var i=0;i<aloneList.length;i++){
						var data = aloneList[i];
						if(data.sendUser && data.sendUser.userId == this.fromUserId){
							if(data.sendUser.userId == this.userInfo.id){
								return;
							}
							var obj = this.convertMsg(data);
							if(obj){
								lastMsgId = obj.msg.id;
								this.screenMsg(obj,false);
							}
						}else if(data.toUserId == this.fromUserId){
							this.screenMsg(data.msg,false);
							lastMsgId = data.msg.id;
						}
						
					}
					
					this.$nextTick(function() {
						// 滚动到底
						if(aloneList.length > 0){
							this.scrollToView = 'msg'+lastMsgId
						}
						
					});			
					
				}
				
				
				
			},
			setTitle(title){
				uni.setNavigationBarTitle({
					title: title
				})
			},
			startListener(){
				uni.$on('ALONE',(data)=>{
					if(data.sendUser.userId != this.fromUserId){
						return;
					}
					console.log("消息来了")
					this.onMessage(data);
				})
			
			},
			onMessage(data){
				//自己发送的消息，这里不需要处理
				if(data.sendUser.userId == this.userInfo.id){ 
					return;
				}
				
				var obj = this.convertMsg(data);
				if(obj){
					
					this.screenMsg(obj,true);
					// if(this.isBottom){
						this.$nextTick(function() {
							// 滚动到底
								this.scrollToView = 'msg'+obj.msg.id
						});			
					// }
				}
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
			
			
			
			convertMsg(data){
			
			    var msgId = data.sendTime+''+data.sendUser.userId;
				
				var bodyType = data.body.bodyType;
				if(bodyType == 'TEXT'){
					var eventType =  data.body.eventType;
					if(eventType == 'COMMON'){
						var msg = {
							type:"user",
							msg:{
								id:msgId,
								type:"text",
								time:this.calcTime(data.sendTime),
								userinfo:{
									uid:data.sendUser.userId,
									username:data.sendUser.nickName,
									face:data.sendUser.headUrl?data.sendUser.headUrl:'/static/moren.png',
								},
								content:{
									text: this.replaceEmoji(data.body.text),
								},
							},
						};
						return msg;
					}	
				}else if(bodyType == 'IMG'){
					var msg = {
							type:"user",
							msg:{
								id:msgId,
								type:"img",
								time:this.calcTime(data.sendTime),
								userinfo:{
									uid:data.sendUser.userId,
									username:data.sendUser.nickName,
									face:data.sendUser.headUrl?data.sendUser.headUrl:'/static/moren.png',
								},
								content:{
									url: data.body.url,
									w:data.body.width,
									h:data.body.height,
								},
							},
						};
					return msg;
				}else if(bodyType == 'AUDIO'){
					var msg = {
							type:"user",
							msg:{
								id:msgId,
								type:"voice",
								time:this.calcTime(data.sendTime),
								userinfo:{
									uid:data.sendUser.userId,
									username:data.sendUser.nickName,
									face:data.sendUser.headUrl?data.sendUser.headUrl:'/static/moren.png',
								},
								content:{
									url: data.body.src,
									lenght:data.body.duration
								},
							},
						};
					return msg;
				}
				
				return null;
				
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
			
			// // 接受消息(筛选处理)
			screenMsg(msg,isZhendong){
				
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
					if(isZhendong && msg.msg.userinfo.uid!=this.myuid){
						console.log('振动');
						uni.vibrateLong();
					}
				}
				this.$nextTick(function() {
					// 滚动到底
					this.scrollToView = 'msg'+msg.msg.id
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
					
					this.$http.httpPostTokenPush('/push/sendToUser',{
						userId:this.fromUserId,
						message:info
					},(res)=>{
						let c = this.replaceEmoji(info);
						console.log(c)
						
		
						this.sendCommonMsg(c);
					})
				}else if(type == 'voice'){
			
					
					this.sendVoice(content)
					
				}else if(type == 'img'){
					this.sendImg(content);
				}
				
				
				
			},
			sendImg(content){
				console.log(content);
				
				var nowDate = new Date();
				let lastid = nowDate.getTime();
				if(this.msgList.length > 0){
					let lastid = this.msgList[this.msgList.length-1].msg.id;
				}
				lastid = lastid + "S05";
				let msg = {
					type:'user',
					msg:{
						id:lastid,
						time: this.calcTime(new Date().getTime()),
						type:"img",
						userinfo:{
						uid:this.userInfo.id,
						username:this.userInfo.nickName,
						face:this.userInfo.headUrl?this.userInfo.headUrl:'/static/moren.png',
						},
						content:content,
					},
				}
				// 发送消息
				var then = this;
				then.token = uni.getStorageSync("token");
				uni.showLoading({
					title:"正在发送图片..."
				})
							
				var uper = uni.uploadFile({
					// 需要上传的地址
					url:then.$http.baseUrlMeg+"/push/sendToUserImg",
					// filePath  需要上传的文件
					filePath: content.url,
					name: "file",
					header:{
						token:then.token
					},
					
					formData: {
						'userId':then.fromUserId,
						'width': content.w,
						"height":content.h
					},
					success(res1) {
						console.log(res1)
					
						// 显示上传信息
						if(res1.data){
							var obj = JSON.parse(res1.data);
							if(obj.success){
								uni.hideLoading();
								then.screenMsg(msg,false);
								
								then.addHistoryMsg(msg);
								
								
							}else{
								uni.showToast({
									icon:"none",
									title:'发送图片失败，请稍后再试！'
								})
							}
						}else{
							uni.showToast({
								icon:"none",
								title:'发送图片失败，请稍后再试！'
							})
						}
						
					},
					fail(err){
						uni.showToast({
							icon:"none",
							title:'发送图片失败，请稍后再试！'
						})
					},
					complete:function(){
					
					}
				});
				
				
			},
			sendVoice(content){
				console.log("content",content)
				var nowDate = new Date();
				let lastid = nowDate.getTime();
				if(this.msgList.length > 0){
					let lastid = this.msgList[this.msgList.length-1].msg.id;
				}
				lastid = lastid + "S05";
				let msg = {
					type:'user',
					msg:{
						id:lastid,
						time: this.calcTime(new Date().getTime()),
						type:"voice",
						userinfo:{
						uid:this.userInfo.id,
						username:this.userInfo.nickName,
						face:this.userInfo.headUrl?this.userInfo.headUrl:'/static/moren.png',
						},
						content:content,
					},
				}
				// 发送消息
				var then = this;
				then.token = uni.getStorageSync("token");
				uni.showLoading({
					title:"正在发送语音..."
				})
			
				console.log(then.$http.baseUrlMeg+"/push/sendToUserAudio")
				var uper = uni.uploadFile({
					// 需要上传的地址
					url:then.$http.baseUrlMeg+"/push/sendToUserAudio",
					// filePath  需要上传的文件
					filePath: content.url,
					name: "file",
					header:{
						token:then.token
					},
					
					formData: {
						'userId':then.fromUserId,
						'duration': content.length
					},
					success(res1) {
						console.log(res1)
					
						// 显示上传信息
						if(res1.data){
							var obj = JSON.parse(res1.data);
							if(obj.success){
								uni.hideLoading();
								then.screenMsg(msg,false);
								
								then.addHistoryMsg(msg);
							}else{
								uni.showToast({
									icon:"none",
									title:'发送语音失败，请稍后再试！'
								})
							}
						}else{
							uni.showToast({
								icon:"none",
								title:'发送语音失败，请稍后再试！'
							})
						}
						
					},
					fail(err){
						uni.showToast({
							icon:"none",
							title:'发送语音失败，请稍后再试！'
						})
					},
					complete:function(){
						setTimeout(()=>{
							this.willStop = false;
						},1000)
					}
				});
				// // onProgressUpdate 上传对象更新的方法
				// uper.onProgressUpdate((res)=>{
				// 	// 进度条等于 上传到的进度
				// 	// _self.percent = res.progress
				// 	console.log(res.progress)
				// 	uni.showLoading({
				// 		title:"正在发送语音"+res.progress
				// 	})
				// 	// console.log('上传进度' + res.progress)
				// 	// console.log('已经上传的数据长度' + res.totalBytesSent)
				// 	// console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend)
					
				// })
			},
			sendCommonMsg(data){
				var nowDate = new Date();
				var lastid = "S01";
				if(this.msgList.length > 0){
					lastid = this.msgList[this.msgList.length-1].msg.id;
					lastid = lastid+"01";
				}
			
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
				
				this.addHistoryMsg(msg);
				
				this.$nextTick(function() {
					// 滚动到底
					this.scrollToView = 'msg'+msg.msg.id
					this.isBottom = true;
				});
				
				
				
			},
			addHistoryMsg(msg){
				var aloneList = uni.getStorageSync("aloneList");
				if(!aloneList){
					aloneList = new Array();
				}
				
				aloneList.push({
					toUserId:this.fromUserId,
					msg:msg
				})
				
				
				try{
					uni.setStorageSync("aloneList",aloneList);
				} catch(err){
					
				}
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
			
			sendSystemMsg(content,type){
				let lastid = this.msgList[this.msgList.length-1].msg.id;
				lastid++;
				let row = {type:"system",msg:{id:lastid,type:type,content:content}};
				this.screenMsg(row,true)
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
					console.log("录音信息发送: " + JSON.stringify(e));
					this.willStop = true;
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
	
	
	.rests{
		padding: 0upx 0upx 10upx 0upx;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		.pageItem{
		
			flex: 1;
			height:140upx;
			text-align: center;
			.c-item{
				display: flex;
				flex-direction: column;
				text-align: center;
			}
			image{
				width: 100upx;
				height: 100upx;
				border-radius: 5px;
				vertical-align: middle;
				text-align: center;
				margin: 0 auto;
			}
			text{
				line-height: 40upx;
				font-size: 12px;
				vertical-align: middle;
				color: #999;
			}
		}
	}
	.rests::after{
		content: '';
		display: block;
		clear: both;
	}
	
	
	.m-item {
		
		display: flex;
		flex-direction: row;
		padding-top: 40upx;
	}
	
	.m-left {
		display: flex;
		width: 120upx;
		justify-content: center;
		align-items: flex-start;
	}
	
	.m-content {
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: center;
		word-break: break-all;
		margin-right: 30px;
	}
	
	.m-right {
		display: flex;
		width: 120upx;
		justify-content: center;
		align-items: flex-start;
	}
	
	.head_icon {
		width: 80upx;
		height: 80upx;
		border-radius: 5px;
	}
	
	.m-content-head {
		position: relative;
	}
	
	.m-content-head-right {
		display: flex;
		justify-content: flex-end;
		position: relative;
	}
	
	.m-content-head-himName{
		// position: absolute;
		font-size: 10px;
		line-height: 20px;
		height: 20px;
		// top: -15px;
		color: #333;
		
	} 
	.m-content-head-him {
		text-align: left;
		background: #FFFFFF;
		border: 1px #FFFFFF solid;
		border-radius: 6px;
		padding: 20upx;
		color: #333;
		display: inline-block;
	}
	
	.m-content-head-him:before {
		border: 15upx solid transparent;
		border-right: 15upx solid #FFFFFF;
		left: -26upx;
		width: 0;
		height: 0;
		position: absolute;
		content: ' '
	}
	.m-content-head-customerName{
		font-size: 10px;
		line-height: 20px;
		height: 20px;
		text-align: right;
		color: #333;
		position: absolute;
		right: 0;
		top: -20px;
	} 
	.m-content-head-customer {
		border: 1upx #1482d1 solid;
		background: #1482d1;
		border-radius: 6px;
		padding: 20upx;
	}
	.m-content-head-customer:after {
		border: 15upx solid transparent;
		border-left: 15upx solid #1482d1;
		top: 20upx;
		right: -26upx;
		width: 0;
		height: 0;
		position: absolute;
		content: ' ';
		
	}
	.subClass{
		position: relative;
		left: -10upx;
		image{
			width: 420upx;
			height: 150upx;
		}
		text{
			position: absolute;
			font-size: 12px;
			color: #fff;
			line-height: 16px;
		}
		text:nth-of-type(1){
			left: 110upx;
			top:15%;
		}
		text:nth-of-type(2){
			left: 110upx;
			top: calc(15% + 16px);
		}
		text:nth-of-type(3){
			bottom: 15upx;
			left: 30upx;
			font-size: 10px;
		}
	}
	.customerSubClass{
		position: relative;
		right: -10upx;
		image{
			width: 420upx;
			height: 150upx;
		}
		text{
			position: absolute;
			font-size: 12px;
			color: #fff;
			line-height: 16px;
		}
		text:nth-of-type(1){
			left: 110upx;
			top:15%;
		}
		text:nth-of-type(2){
			left: 110upx;
			top: calc(15% + 16px);
		}
		text:nth-of-type(3){
			bottom: 15upx;
			left: 30upx;
			font-size: 10px;
		}
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
				display: flex;
				flex-direction: column;
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
					width: 100%;
					position: absolute;
					bottom: -100upx;
					left: 50%;
					transform: translateX(-50%);
					font-size: 20px;
				}
				
				.kai{
					position: absolute;
					bottom: -340upx;
					left: calc(50% - 75upx);
					width: 150upx;
					height: 150upx;
				}
				.xiangqing{
					width: 100%;
					position: absolute;
					bottom: -440upx;
					left: 50%;
					transform: translateX(-50%);
					height: 30upx;
					font-size: 12px;
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
</style>