<template>
	<view class="emotion-box" :style="{height: height + 'px'}">
		<view v-if="!rests">
			<view class="uni-padding-wrap">
				<view class="page-section swiper">
					<view class="page-section-spacing">
						<swiper :style="{height: (height -30) + 'px'}" class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
							<swiper-item>
								<view class="swiper-item uni-bg-red">
									<view class="emotion-box-line" v-for="(line, i) in list.slice(0,3)" :key="i" >
										<view class="emotion-item" v-for="(item, index) in line" :key="index" @click="clickHandler(item)" >
											<view v-if="!item" style="width: 50upx;height: 50upx; display: inline-block;"></view>
											<image v-if="item" :src="emotion(item)" style="width: 50upx;height: 50upx;" mode=""></image>
										</view>
									</view>
								</view>
							</swiper-item>
							<swiper-item>
								<view class="swiper-item uni-bg-green">
									<view class="emotion-box-line" v-for="(line, i) in list.slice(3,6)" :key="i" >
										<view class="emotion-item" v-for="(item, index) in line" :key="index" @click="clickHandler(item)" >
											<view v-if="!item" style="width: 50upx;height: 50upx; display: inline-block;"></view>
											<image v-if="item" :src="emotion(item)" style="width: 50upx;height: 50upx;" mode=""></image>
										</view>
									</view>
								</view>
							</swiper-item>
							<swiper-item>
								<view class="swiper-item uni-bg-blue">
									<view class="swiper-item uni-bg-green">
										<view class="emotion-box-line" v-for="(line, i) in list.slice(6,9)" :key="i" >
											<view class="emotion-item" v-for="(item, index) in line" :key="index" @click="clickHandler(item)" >
												<view v-if="!item" style="width: 50upx;height: 50upx; display: inline-block;"></view>
												<image v-if="item" :src="emotion(item)" style="width: 50upx;height: 50upx;" mode=""></image>
											</view>
										</view>
									</view>
								</view>
							</swiper-item>
							<swiper-item>
								<view class="swiper-item uni-bg-blue">
									<view class="swiper-item uni-bg-green">
										<view class="emotion-box-line" v-for="(line, i) in list.slice(9,12)" :key="i" >
											<view class="emotion-item" v-for="(item, index) in line" :key="index" @click="clickHandler(item)" >
												<view v-if="!item" style="width: 50upx;height: 50upx; display: inline-block;"></view>
												<image v-if="item" :src="emotion(item)" style="width: 50upx;height: 50upx;" mode=""></image>
											</view>
										</view>
									</view>
								</view>
							</swiper-item>
							<swiper-item>
								<view class="swiper-item uni-bg-blue">
									<view class="swiper-item uni-bg-green">
										<view class="emotion-box-line" v-for="(line, i) in list.slice(12,15)" :key="i" >
											<view class="emotion-item" v-for="(item, index) in line" :key="index" @click="clickHandler(item)" >
												<view v-if="!item" style="width: 50upx;height: 50upx; display: inline-block;"></view>
												<image v-if="item" :src="emotion(item)" style="width: 50upx;height: 50upx;" mode=""></image>
											</view>
										</view>
									</view>
								</view>
							</swiper-item>
							<swiper-item>
								<view class="swiper-item uni-bg-blue">
									<view class="swiper-item uni-bg-green">
										<view class="emotion-box-line" v-for="(line, i) in list.slice(15,18)" :key="i" >
											<view class="emotion-item" v-for="(item, index) in line" :key="index" @click="clickHandler(item)" >
												<view v-if="!item" style="width: 50upx;height: 50upx; display: inline-block;"></view>
												<image v-if="item" :src="emotion(item)" style="width: 50upx;height: 50upx;" mode=""></image>
											</view>
										</view>
									</view>
								</view>
							</swiper-item>
						</swiper>
					</view>
				</view>
			</view>
		</view>
		
		<view v-if="rests" class="rests">
				<view class="pageItem">
					<navigator :url="'/pages/tabbar/tabbar-2/qunliao/fahongbao/fahongbao?crowdInfo='+JSON.stringify(crowdInfo)+''" open-type="navigate" hover-class="">
						<view class="c-item">
							<image src="/static/liaotian/icon_hb.png"></image>
							<text>红包</text>
						</view>
					</navigator>
				</view>
				<view class="pageItem">
					<navigator url="/pages/tabbar/tabbar-2/qunliao/zhangdanmingxi/zhangdanmingxi" open-type="navigate" hover-class="">
						<view class="c-item">
						<image src="/static/liaotian/icon_zd.png"></image>
						<text>账单</text>
						</view>
					</navigator>
				</view>
				<view class="pageItem">
					<navigator url="/pages/tabbar/tabbar-2/qunliao/chongzhi/chongzhi" open-type="navigate" hover-class="">
						<view class="c-item">
						<image src="/static/liaotian/icon_top_up.png"></image>
						<text>充值</text>
						</view>
					</navigator>
				</view>
				<view class="pageItem">
					<navigator url="/pages/tabbar/tabbar-2/qunliao/shoukuanzhanghu/shoukuanzhanghu" open-type="navigate" hover-class="">
						<view class="c-item">
						<image src="/static/liaotian/icon_sk_account.png"></image>
						<text>收款账户</text>
						</view>
					</navigator>
				</view>
			</view>
			
			<view v-if="rests" class="rests">
				<view class="pageItem">
					<view class="c-item">
					<image src="/static/liaotian/icon_wfsm.png"></image>
					<text>玩法说明</text>
					</view>
				</view>
				<view class="pageItem">
					<navigator url="/pages/tabbar/tabbar-2/qunliao/lianxiqunzhu/lianxiqunzhu" open-type="navigate" hover-class="">
						<view class="c-item">
						<image src="/static/liaotian/icon_lxqz.png"></image>
						<text>联系群主</text>
						</view>
					</navigator>
				</view>
				<view class="pageItem">
					
				</view>
				<view class="pageItem">
					
				</view>
			</view>
	</view>
</template>

<script>
	let clearCount = 0
	export default {
		props: {
			height: {
				type: Number,
				default: 200
			},
			rests: {
				type: Boolean,
				default: false
			},
			crowdInfo:{
				type:Object,
				default(){
					return{}
				}
			}
		},
		watch:{
			rests(newVal){ //换成rests时不会初始化组件
				clearCount = 0;
			}
		},
		created() { ///每次初始化组件
			clearCount = 0;
			console.log("emoji子组件",this.crowdInfo)
		},
		data() {
			return {
				
				background: ['color1', 'color2', 'color3'],
				indicatorDots: true,
				autoplay: false,
				interval: 2000,
				duration: 500,
				// list: [
				// 	['微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞'],
				// 	['闭嘴','睡', '大哭', '尴尬', '发怒', '调皮', '呲牙'],
				// 	['惊讶', '难过','酷', '冷汗', '抓狂', '吐',  '偷笑'],
				// 	['可爱', '白眼', '傲慢','饥饿', '困', '惊恐', '流汗'],
				// 	['憨笑', '大兵', '奋斗', '咒骂','疑问', '嘘', '晕',],
				// 	[ '折磨', '衰', '骷髅', '敲打', '再见','擦汗', '抠鼻',],
				// 	[ '鼓掌', '糗大了', '坏笑', '左哼哼', '右哼哼', '哈欠','鄙视',],
				// 	[ '委屈', '快哭了', '阴险', '亲亲', '吓', '可怜', '菜刀', ],
				// 	['西瓜', '啤酒', '篮球', '乒乓', '咖啡', '饭', '猪头',],
				// 	[ '玫瑰','凋谢', '示爱', '爱心', '心碎', '蛋糕', '闪电',],
				// 	[ '炸弹', '刀','足球', '瓢虫', '便便', '月亮', '太阳',],
				// 	[ '礼物', '拥抱', '强','弱', '握手', '胜利', '抱拳',],
				// 	[ '勾引', '拳头', '差劲', '爱你','NO', 'OK', '爱情',],
				// 	[ '飞吻', '跳跳', '发抖', '怄火', '转圈','磕头', '回头',],
				// 	[ '跳绳', '挥手', '激动', '街舞', '左太极', '右太极']
				// ],
				list: [
					['微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞'],
					['闭嘴','睡', '大哭', '尴尬', '发怒', '调皮', '呲牙'],
					['惊讶', '难过','酷', '冷汗', '抓狂', '吐', "clear"],
					[ '偷笑','可爱', '白眼', '傲慢','饥饿', '困', '惊恐',],
					[ '流汗','憨笑', '大兵', '奋斗', '咒骂','疑问', '嘘',],
					[  '晕','折磨', '衰', '骷髅', '敲打', '再见',"clear"],
					[ '擦汗', '抠鼻','鼓掌', '糗大了', '坏笑', '左哼哼', '右哼哼'],
					['哈欠','鄙视','委屈', '快哭了', '阴险', '亲亲', '吓', ],
					[ '可怜', '菜刀','西瓜', '啤酒', '篮球', '乒乓',"clear"],
					[  '咖啡', '饭', '猪头','玫瑰','凋谢', '示爱', '爱心',],
					[  '心碎', '蛋糕', '闪电','炸弹', '刀','足球', '瓢虫',],
					[  '便便', '月亮', '太阳','礼物', '拥抱', '强',"clear"],
					[ '弱', '握手', '胜利', '抱拳','勾引', '拳头', '差劲',],
					[  '爱你','NO', 'OK', '爱情','飞吻', '跳跳', '发抖',],
					[  '怄火', '转圈','磕头', '回头','跳绳', '挥手',"clear"],
					[ '激动', '街舞', '献吻','左太极', '右太极',"", ""],
					[ "", "", "", "","", "",""],
					[ "", "", "", "","", "","clear"]
				],
				reg: /\S{1,3}/gi,
				item: []
			}
		},
		methods: {
			changeIndicatorDots(e) {
				this.indicatorDots = !this.indicatorDots
			},
			changeAutoplay(e) {
				this.autoplay = !this.autoplay
			},
			intervalChange(e) {
				this.interval = e.target.value
			},
			durationChange(e) {
				this.duration = e.target.value
			},
			clickHandler(i) {
				if(!i)return
				if(i=='clear'){
					this.$emit('clear')
					return
				}
				let emotion = `#${i};`
				
				this.$emit('emotion', emotion)
			},
			emotion(res) {
				//let word = res.replace(/\#|\;/gi,'')
				let arr = []
				this.list.forEach((item,index)=>{arr = arr.concat(item)})
				const list = arr
				
				if(res == 'clear') {
					clearCount++
					return '/static/clear.png'
					
				}
				if(!res) return
				
				let index = list.indexOf(res)
				// console.log('表情索引',index)
				
				// return `<img src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${index}.gif" align="middle">`
				index = index - clearCount
				index = index < 10 ? ('0'+index) : index
				
				return '/static/emoji/emoji_'+index+'.png'
			}
		}
	}
</script>

<style lang="scss" scoped>
	.rests{
		padding: 0upx 0upx 30upx 0upx;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		.pageItem{
			width: 100upx;
			height:140upx;
			text-align: center;
			.c-item{
				display: flex;
				flex-direction: column;
			}
			image{
				position: relative;
				width: 100upx;
				height: 100upx;
				left: 0upx;
				top: 0upx;
				border-radius: 5px;
				vertical-align: middle;
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
	.emotion-box {
		margin: 0 auto;
		width: 720upx;
		box-sizing: border-box;
		padding: 15px 15upx;
		/* border: 1px solid #b4b4b4; */
		overflow: hidden;
		overflow-y: auto;
		background-color: #eee;
	}

	.emotion-box-line {
		display: flex;
		
	}

	.emotion-item {
		flex: 1;
		height: 20px;
		padding: 10px 0;
		text-align: center;
		cursor: pointer;
	}
</style>
