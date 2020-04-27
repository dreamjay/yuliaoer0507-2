<template>
	<view>
		<Search></Search>
		<view class="liaotianList"  >
			<navigator url="" open-type="navigate" hover-class="">
				<view class="item breakLine" >
					<uni-swipe-action>
						<uni-swipe-action-item  @click="onClick" @change="change">
							<image  src="/static/icon_gftz.png" mode="scaleToFill" ></image>
							<text class="left">官方通知</text>
							<text class="right">{{time}}</text>
						</uni-swipe-action-item>
					</uni-swipe-action>
				</view>
			</navigator>
		</view>
		<view class="liaotianList" v-if="isQunzhu">	
			<navigator url="./qunzhuxiaoxi/qunzhuxiaoxi" open-type="navigate" hover-class="">
				<view class="item breakLine" >
					<uni-swipe-action>
						<uni-swipe-action-item  @click="onClick" @change="change">
							<image  src="/static/icon_qzxx.png" mode="scaleToFill" ></image>
							<text class="left">群主消息</text>
							<text class="right">{{qunzhutime}}</text>
						</uni-swipe-action-item>
					</uni-swipe-action>
				</view>
			</navigator>
		</view>
		<view class="liaotianList" v-if="isQunzhu">	
			<navigator url="./qunxiaoxi/qunxiaoxi" open-type="navigate" hover-class="">
				<view class="item breakLine" >
					<uni-swipe-action>
						<uni-swipe-action-item  @click="onClick" @change="change">
							<image  src="/static/icon_qtz.png" mode="scaleToFill" ></image>
							<text class="left">群消息</text>
							<text class="right">{{quntime}}</text>
						</uni-swipe-action-item>
					</uni-swipe-action>
				</view>
			</navigator>
		</view>
		
		<view class="liaotianList" v-for="(item,index) in messageList" :key="index" v-if="item.isShow">
			
			<navigator :url="item.url ? item.url : ''" open-type="navigate" hover-class="">
				<view class="item breakLine" >
					<uni-swipe-action>
						<uni-swipe-action-item :options="options" @click="onClick" @change="change">
							<image  src="/static/icon_gftz.png" mode="scaleToFill" ></image>
							<text class="left">{{item.text}}</text>
							<text class="right">{{item.time}}</text>
						</uni-swipe-action-item>
					</uni-swipe-action>
				</view>
			</navigator>
		</view>
	</view>
</template>

<script>
	import Search from '@/components/search/search.vue'
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
	import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
	export default {
		components:{Search,uniSwipeAction,uniSwipeActionItem},
		data(){
		    return {
				userInfo:null,
				time:'4:00',
				qunzhutime:'4:00',
				quntime:'4:00',
				isQunzhu:false,
				messageCount:0,
				messageList:[
					// {
					// 	text:"官方通知",
					// 	type:'SYSTEM',
					// 	time:"4:00"
					// },
					// {
					// 	text:"群主消息",
					// 	time:"4:00",
					// 	url:'./qunzhuxiaoxi/qunzhuxiaoxi'
					// },
					// {
					// 	text:"群消息",
					// 	time:"4:00",
					// 	url:'./qunxiaoxi/qunxiaoxi'
					// }
				],
				options:[
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
					
				]
		    }
		},
		onLoad() {
			this.userInfo = uni.getStorageSync('userInfo');
			this.messageList.forEach((item)=>{
				if(item.text == '群主消息' || item.text == '群消息'){
					item.isShow = !!this.userInfo.showCrowd
				}else{
					item.isShow = true
				}
				
			})
			uni.$on('SYSTEM',(data) => {
				this.userInfo = uni.getStorageSync('userInfo');
				this.isQunzhu = !!this.userInfo.showCrowd;
				console.log(data)
				this.messageCount++;
				uni.setTabBarBadge({
					index: 0,
					text: this.messageCount+''
				});
			})
			
		},
		onShow() {
			this.userInfo = uni.getStorageSync('userInfo');
			this.isQunzhu = !!this.userInfo.showCrowd;
			if(this.messageCount <= 0){
				uni.removeTabBarBadge({index: 0})
			}
		},
		methods:{
			onClick(e){
			  console.log('当前点击的是第'+e.index+'个按钮，点击内容是'+e.content.text)
			},
			change(open){
			  console.log('当前开启状态：'+ open)
			}
		}
	};
</script>

<style lang="scss">
	page{
		background-color: #eee;
	}
	.liaotianList{
		// margin-top: 20upx;
		background-color: #FFFFFF;
		.item{
			height: 60px;
			position: relative;
			line-height: 60px;
			image{
				margin-top: 9px;
				height: 40px;
				width: 40px;
				margin-left: 15upx;
			}
			.left{
				font-size: 14px;
				margin-left: 20upx;
				display: inline-block;
				height: 100%;
				vertical-align: top;
			}
			.right{
				position: absolute;
				height: 100%;
				font-size: 10px;
				right: 15upx;
				color:#999;
			}
		}
	}
</style>
