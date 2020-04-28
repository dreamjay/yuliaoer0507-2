<template>
	<view>
		<Search></Search>
		
		 <scroll-view  scroll-y="true" class="scroll-Y" :style="{height:scrollHei+'px'}" >
		<view class="liaotianList"  >
			<navigator url="./guanfang/list" open-type="navigate" hover-class="">
				<view class="item breakLine" >
					<uni-swipe-action>
						<uni-swipe-action-item  @click="onClick" @change="change">
							<view class="img">
								<image  src="/static/icon_gftz.png" mode="scaleToFill" ></image>
							</view>
							<view class="left">
								<text class="title">官方通知</text>
								<text class="text">{{systemContent}}</text>
							</view>
							<view class="right">{{time}}</view>
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
							<view class="img">
								<image  src="/static/icon_qzxx.png" mode="scaleToFill" ></image>
							</view>
							<view class="left">
								<text class="title">群主消息</text>
								<text class="text">{{qunzhuContent}}</text>
							</view>
							<view class="right">{{qunzhutime}}</view>
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
						<view class="img">
							<image  src="/static/icon_qtz.png" mode="scaleToFill" ></image>
						</view>
						<view class="left">
							<text class="title">群消息</text>
							<text class="text">{{qunContent}}</text>
						</view>
							<view class="right">{{quntime}}</view>
						</uni-swipe-action-item>
					</uni-swipe-action>
				</view>
			</navigator>
		</view>
		
		<view class="liaotianList" v-for="(item,index) in messageList" :key="index" v-if="item.isShow">
			
			<navigator :url="item.url ? item.url : ''" open-type="navigate" hover-class="">
				<view class="item breakLine" v-if="item.type == 'ALONE'" >
					<uni-swipe-action>
						<uni-swipe-action-item :options="options" @click="onClick" @change="change">
							<view class="img">
								<image  :src="item.headUrl?item.headUrl:'/static/moren.png'" mode="scaleToFill" ></image>
							</view>
							<view class="left">
								<text class="title">{{item.title}}</text>
								<text class="text">{{item.text}}</text>
							</view>
							<view class="right">{{item.time}}</view>
						</uni-swipe-action-item>
					</uni-swipe-action>
				</view>
				
				<view class="item breakLine" v-if="item.type == 'CROWD'" >
					<uni-swipe-action>
						<uni-swipe-action-item :options="options" @click="onClick" @change="change">
				
							<view class="imageBox" :class="headimgClass(item.imgs ? item.imgs.length : null)">
								<image v-for="(itemm,indexx) in item.imgs" :key="indexx" :src="itemm ? itemm : '/static/moren.png'" mode="scaleToFill"></image>
							</view>
							
							
							<view class="left">
								<text class="title">{{item.title}}</text>
								<text class="text">{{item.text}}</text>
							</view>
							<view class="right">{{item.time}}</view>
						</uni-swipe-action-item>
					</uni-swipe-action>
				</view>
				
			</navigator>
		</view>
		
		 </scroll-view>
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
				scrollHei:uni.getSystemInfoSync().windowHeight - 90,
				userInfo:null,
				systemContent:'',
				qunzhuContent:'',
				qunContent:'',
				time:'4:00',
				qunzhutime:'4:00',
				quntime:'4:00',
				isQunzhu:false,
				messageCount:0,
				messageList:[
					{
						id:"",
						url:"",
						headUrl:"",
						title:"官方通知",
						text:"官方通知",
						type:'SYSTEM',
						time:"4:00",
						type:"ALONE"
					},
					{
						id:"",
						url:"",
						imgs:[null,null,null],
						title:"官方通知群",
						text:"官方通知",
						type:'SYSTEM',
						time:"4:00",
						type:"CROWD"
					},
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
				if(this.isQunzhu != 1){
					this.userInfo = uni.getStorageSync('userInfo');
					this.isQunzhu = !!this.userInfo.showCrowd;
				}
				
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
			},
			headimgClass(number){
				switch(Number(number)){
					case 1:{return 'yi';break}
					case 2:{return 'er';break}
					case 3:{return 'san';break}
					case 4:{return 'si';break}
					case 5:{return 'wu';break}
					case 6:{return 'liu';break}
					case 7:{return 'qi';break}
					case 8:{return 'ba';break}
					case 9:{return 'jiu';break}
				}
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
			height: 140rpx;
			position: relative;
			line-height: 140rpx;
			
			.img{
				width: 90rpx ;
				image{
					height: 90rpx;
					width: 90rpx;
					vertical-align: middle;
					border-radius: 5px;
				}
				margin-left: 15upx;
			}
			.left{
				flex: 1;
				padding: 35rpx 35rpx ;
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				.title{
					height: 35rpx;
					line-height: 35rpx;
					font-size: 32rpx;
					font-weight: 400;
				}
				.text{
					height: 35rpx;
					line-height: 35rpx;
					font-size: 24rpx;
					color: #aaaaaa;
					word-break: break-all;  /* break-all(允许在单词内换行。) */
					text-overflow: ellipsis;  /* 超出部分省略号 */
					display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
					-webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
					-webkit-line-clamp: 2; /** 显示的行数 **/
				}
			}
			.right{
				height: 100%;
				font-size: 10px;
				right: 15upx;
				color:#999;
				width: 40px;
			}
		}
	}
	
	.imageBox{
		width: 90rpx;
		height: 90rpx;
		display: inline-block;
		border-radius: 5px;
		overflow: hidden;
		position: relative;
		vertical-align: middle;
		background-color: #eee;
		image{
			box-sizing: border-box;
		}
		margin-top: 25rpx;
		margin-left: 15upx;
	}
</style>
