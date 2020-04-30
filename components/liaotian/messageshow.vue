<template>
	<view class="m-item">
		
		<view class="m-left" v-if="message.classType=='left'">
			<image class="head_icon" :src="message.sendUser.headUrl ? message.sendUser.headUrl : '/static/moren.png'"></image>
		</view>
		<view class="m-content" v-if="message.body.bodyType == 'TEXT'" >
			<view  class="m-content-head" v-if="message.classType =='left'">
				<view class="m-content-head-himName">{{message.sendUser.nickName}}</view>
				<view class="m-content-head-him" v-html="html(message.body.text)" @touchstart="touchstart"  @touchmove="touchmove" @longpress="longtap(message.body.text)">
				</view>
			</view>
			
			<view class="m-content-head m-content-head-right" v-if="message.classType !='left'" >
				<view class="m-content-head-customerName">{{message.sendUser.nickName}}</view>
				<view class="m-content-head-customer" v-html="html(message.body.text)" @touchstart="touchstart"  @touchmove="touchmove" @longpress="longtap(message.body.text)">
				</view>
			</view>
		</view>
		

		
		<view class="m-content" v-if="message.body.bodyType == 'RED_PACKET'">
			<view v-if="message.classType !='left'" class="m-content-head ">
				<view class="m-content-head-customerName">{{message.sendUser.nickName}}</view>
				<view class="customerSubClass">
					<image v-if="message.body.status == 0" @click="$emit('hongbaoClick',{message}) " src="/static/liaotian/_bg_from_hongbao.png'" style="" mode="aspectFit"></image>
					<image v-if="message.body.status != 0"  src="/static/liaotian/bg_hb_right_sel.png" style="" mode="aspectFit"></image>
					<text>{{message.body.title}}</text>
					<text>{{handleRrd(message.body.status)}}</text>
					<text>扫雷红包</text>
				</view>
			</view>
			
			<view v-if="message.classType =='left'" class="m-content-head m-content-head-right">
				<view class="m-content-head-himName">{{message.sendUser.nickName}}</view>
				<view class="subClass">
					<image v-if="message.body.status == 0" @click="$emit('hongbaoClick',{message}) " src="/static/liaotian/_bg_to_hongbao.png'" style="" mode="aspectFit"></image>
					<image v-if="message.body.status != 0"  src="/static/liaotian/bg_hb_left_sel.png" style="" mode="aspectFit"></image>
					<text>{{message.body.title}}</text>
					<text>{{handleRrd(message.body.status)}}</text>
					<text>扫雷红包</text>
				</view>
			</view>
			
			
		</view>
		<view class="m-right" v-if="message.classType=='right'">
			<image class="head_icon" :src="message.sendUser.headUrl ? message.sendUser.headUrl : '/static/moren.png'"></image>
		</view>
	</view>
</template>

<script>
	
	export default {
		props: {
			message: {
				type: Object,
				default () {
					return {};
				}
			},
			cid: {
				type: [Number, String],
				default: ''
			}
		},
		created() {
			// console.log('message',this.message)
			console.log("message组件",this.message,"cid",this.cid)
		},
		data() {
			return {
				reg: /\#[\S]{1,3}\;/gi,
				isCopy:true,
			}
		},
		methods: {
			handleRrd(status){
				// 红包状态： 0 未抢光 1 已抢光 2 已失效
				switch(String(status)){
					case "0":{ return'领取红包';break}
					case "1":{ return'已抢完';break}
					case "2":{ return'已过期';break}
				}
			},
			touchstart(){
				this.isCopy= true
			},
			touchmove(e){
				this.isCopy = false
			},
			longtap(msg){
				if(this.isCopy) {
					// #ifdef APP-PLUS
						uni.setClipboardData({
							data: msg.content,
							success: function () {
								uni.showToast({
									title:'复制成功',
									icon:'none'
								})
								
							}
						});
					// #endif
				}
			},
			html(res){
				console.log(res)
				res.replace(this.reg,this.emotion);
			},
			emotion(res) {
				console.log('mess', res)
				let word = res.replace(/\#|\;/gi, '')
				console.log(word)
				// console.log(word)
				const list = ['微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡', '大哭', '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过', '酷',
					'冷汗', '抓狂', '吐', '偷笑', '可爱', '白眼', '傲慢', '饥饿', '困', '惊恐', '流汗', '憨笑', '大兵', '奋斗', '咒骂', '疑问', '嘘', '晕', '折磨', '衰',
					'骷髅', '敲打', '再见', '擦汗', '抠鼻', '鼓掌', '糗大了', '坏笑', '左哼哼', '右哼哼', '哈欠', '鄙视', '委屈', '快哭了', '阴险', '亲亲', '吓', '可怜',
					'菜刀', '西瓜', '啤酒', '篮球', '乒乓', '咖啡', '饭', '猪头', '玫瑰', '凋谢', '示爱', '爱心', '心碎', '蛋糕', '闪电', '炸弹', '刀', '足球', '瓢虫',
					'便便', '月亮', '太阳', '礼物', '拥抱', '强', '弱', '握手', '胜利', '抱拳', '勾引', '拳头', '差劲', '爱你', 'NO', 'OK', '爱情', '飞吻', '跳跳',
					'发抖', '怄火', '转圈', '磕头', '回头', '跳绳', '挥手', '激动', '街舞', '献吻', '左太极', '右太极'
				]
				let index = list.indexOf(word)
				
				console.log(index)
				index = index < 10 ? ('0'+index) : index
				let src = require('@/static/emoji/emoji_'+index+'.png')
				// return `<img src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${index}.gif" align="middle">`
				return '<image src='+src+' style="vertical-align: middle; display:inline-block; width:20px; height:20px; "> </image>'
				
			}
		}
	}
</script>

<style lang="scss">
	
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
		margin-top: 20px;
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
			font-size: 11upx;
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
			font-size: 11upx;
		}
	}
	
</style>
