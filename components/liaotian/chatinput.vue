<template>
	<view class="footheight">
		<view class="footer">
			<!-- <view class="footer-left">
				<view class="uni-icon uni-icon-mic" @tap="startRecognize"> </view>
			</view> -->
			<view class="footer-center">
				<input @confirm="sendMessge" :confirm-hold="true" type="text" class="input-text" v-model="inputValue" @focus="foc" @blur="blur" :focus="focus"></input>
			</view>
			<view class="footer-emotion" @touchend.prevent="show">
				<image src="/static/liaotian/icon_input_face.png"></image>
			</view>
			<view class="footer-right">
				<view id='msg-type' v-show="inputValue"  @touchend.prevent="sendMessge">发送</view>
				<image src="/static/liaotian/icon_input_add.png" v-show="!inputValue"  @touchend.prevent="show('rests')"></image>
			</view>
		</view>
		
		<Emotion @emotion="handleEmotion" :height="200" :rests="rests" v-if="showPannel" @clear='clear' :crowdInfo="crowdInfo"></Emotion>
		
	</view>
</template>

<script>
	import Emotion from './emoji.vue'
	
	export default {
		name: "chat-input",
		components: {
			Emotion
		},
		props:{
			crowdInfo:{
				type:Object,
				default(){
					return{}
				}
			}
		},
		data() {
			return {
				inputValue: '',
				showPannel: false,
				showRests:false,
				focus: false,
				rests:false,
				
			}
		},
		mounted() {
			
		},
		methods: {
			scrollViewClick(){ //父组件触发
				if(this.showPannel){
					this.show("close")
				}
			},
			clear(){
				if(this.inputValue[this.inputValue.length - 1] == ';' && this.inputValue[this.inputValue.length - 3] == "#"){
					this.inputValue = this.inputValue.slice(0,-3)
					// console.log('3wei')
				}
				else if(this.inputValue[this.inputValue.length - 1] == ';' && this.inputValue[this.inputValue.length - 4] == "#"){
					this.inputValue = this.inputValue.slice(0,-4)
					// console.log('4wei')
				}
				else if(this.inputValue[this.inputValue.length - 1] == ';' && this.inputValue[this.inputValue.length - 5] == "#"){
					this.inputValue = this.inputValue.slice(0,-5)
					// console.log('5wei')
				}
				else{
					// console.log('1wei')
					this.inputValue = this.inputValue.slice(0,-1)
				}
				// console.log(this.inputValue)
			},
			startRecognize: function() {
				var options = {};
				var that = this;
				options.engine = 'iFly';
				that.inputValue = "";
				plus.speech.startRecognize(options, function(s) {
					console.log(s);
					that.inputValue += s;
				}, function(e) {
					console.log("失败：" + e.message);
				});
			},
			sendMessge: function(e) {
				
				var that = this;
				if (that.inputValue.trim() == '') {
					that.inputValue = '';
				} else {

					//点击发送按钮时，通知父组件用户输入的内容
					this.$emit('send-message', {
						type: 'text',
						content: that.inputValue
					});
					that.inputValue = '';
					// this.showPannel = false
				}
				
			},
			show(val) { //表情和其他
				if(val != 'close'){
					if(val === 'rests'){
						this.rests = true
						if(this.showPannel){
							return
						}
					}else{
						this.rests = false
						if(this.showPannel){
							return
						}
					}
				}
				if(this.rests){
					
					this.$nextTick(function(){
						setTimeout(()=>{
						this.showPannel = !this.showPannel;
						},50)
					})
						
					// setTimeout(()=>{
						uni.hideKeyboard()
					// },0)
					setTimeout(()=>{ //延时一会确保dom更新了
						this.$emit('show',{isShow:this.showPannel})
					},200)
					
				} else{
					this.$nextTick(function(){
						this.showPannel = !this.showPannel;
					})
					setTimeout(()=>{
						uni.hideKeyboard()
					},24)
					
					setTimeout(()=>{ //延时一会确保dom更新了
						this.$emit('show',{isShow:this.showPannel})
					},200)
				}
			},
			foc(event) { // 聚焦
				this.rests = false
				if(this.showPannel){ //隐藏表情
					setTimeout(()=>{
						this.$emit('foc',{isShow:true,event:event})
						
					},200)
					this.showPannel = false
					
				}else{
					this.$emit('foc',{isShow:true,event:event}) //键盘高度事件有，不用等dom更新
				}
			},
			blur(){ //失焦
				
				setTimeout(()=>{
					if(!this.showPannel){ //如果表情打开了，就用show的逻辑
						this.$emit('foc',{isShow:false})
					}
				},200)
			},
			emotion(res) { //没用到
				
				let word = res.replace(/\#|\;/gi, '')
				
				const list = ['微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡', '大哭', '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过', '酷',
					'冷汗', '抓狂', '吐', '偷笑', '可爱', '白眼', '傲慢', '饥饿', '困', '惊恐', '流汗', '憨笑', '大兵', '奋斗', '咒骂', '疑问', '嘘', '晕', '折磨', '衰',
					'骷髅', '敲打', '再见', '擦汗', '抠鼻', '鼓掌', '糗大了', '坏笑', '左哼哼', '右哼哼', '哈欠', '鄙视', '委屈', '快哭了', '阴险', '亲亲', '吓', '可怜',
					'菜刀', '西瓜', '啤酒', '篮球', '乒乓', '咖啡', '饭', '猪头', '玫瑰', '凋谢', '示爱', '爱心', '心碎', '蛋糕', '闪电', '炸弹', '刀', '足球', '瓢虫',
					'便便', '月亮', '太阳', '礼物', '拥抱', '强', '弱', '握手', '胜利', '抱拳', '勾引', '拳头', '差劲', '爱你', 'NO', 'OK', '爱情', '飞吻', '跳跳',
					'发抖', '怄火', '转圈', '磕头', '回头', '跳绳', '挥手', '激动', '街舞', '献吻', '左太极', '右太极'
				]
				let index = list.indexOf(word)
				return `<img src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${index}.gif" align="middle">`
			},
			handleEmotion(i) { //点击表情触发
				
				this.inputValue += i
			},
		}
	}
</script>

<style lang="scss">
	.footer {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 80upx;
		min-height: 80upx;
		border-top: solid 1px #bbb;
		overflow: hidden;
		padding: 5upx;
		background-color: #fafafa;
	}

	.footer-left {

		width: 80upx;
		height: 80upx;

		display: flex;
		justify-content: center;
		align-items: center;
	}

	.footer-right {
		width: 100upx;
		
		height: 80upx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #1482D1;
		#msg-type{
			background-color: #4CB964;
			border-radius: 5upx;
			padding: 10upx 15upx;
			color:#fff;
			font-size: 12px;
		}
		image{
			width: 50upx;
			height: 50upx;
		}
	}

	.footer-emotion {
		width: 60upx;
		
		height: 80upx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		color: #1482D1;
		image{
			width: 50upx;
			height: 50upx;
		}
	}

	.footer-center {
		flex: 1;
		height: 80upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.footer-center .input-text {
		flex: 1;
		background: #fff;
		border: solid 1upx #ddd;
		padding: 10upx !important;
		font-family: verdana !important;
		overflow: hidden;
		border-radius: 10upx;
	}

	@font-face {
		font-family: 'iconfont';
		/* project id 1134039 */
		src: url('http://at.alicdn.com/t/font_1134039_uait6xu86bf.eot');
		src: url('http://at.alicdn.com/t/font_1134039_uait6xu86bf.eot?#iefix') format('embedded-opentype'),
			url('http://at.alicdn.com/t/font_1134039_uait6xu86bf.woff2') format('woff2'),
			url('http://at.alicdn.com/t/font_1134039_uait6xu86bf.woff') format('woff'),
			url('http://at.alicdn.com/t/font_1134039_uait6xu86bf.ttf') format('truetype'),
			url('http://at.alicdn.com/t/font_1134039_uait6xu86bf.svg#iconfont') format('svg');
	}

	.iconfont {
		font-family: "iconfont" !important;
		font-size: 18px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.icon-face:before {
		content: "\e71c";
		font-size: 50upx;
	}
</style>
