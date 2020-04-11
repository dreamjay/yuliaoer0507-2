<template>
    <view >
		
		<view class="search" :style="{marginTop: zhuangtailan+'px'}">
			
			<view @click="openNewPage"><text>请输入群ID码</text></view>
			
			<view class="imageBox" >
				<image src="/static/img/jiahao.png" @click="open(false)"></image>
				<uni-transition @click="open(true)" :mode-class="['zoom-in']" :duration="100" :styles="{
					'zIndex':'8',
					'width':'100px',
					'height':'60px',
					'line-height':'60px',
					'backgroundColor':'black',
					'borderRadius':'4px',
					'top':'32px',
					'right':'0px',
					'position':'absolute',
					}" :show="show" @change="change">
						<view style="width: 10px!important; height: 10px; border-radius:0 4px 0 0; background-color: black; position: absolute; right: 0; top:0; transform: rotate(45deg);"></view>
						<image src="/static/img/xiaoxi.png" style="height:20px; width: 20px; position: absolute; left: 10px; top: 20px;" ></image>
						<text style="color:#fff; margin-left: 30px; vertical-align: super;">我要建群</text>
					
				</uni-transition>
			</view>
		</view>
		<view class="qunliaoBox" @click="wodequnliao">
			
			<view class="qunliao breakLine">
				<view class="imgBox">
					<image src="/static/img/weixinqunliao.png" mode="scaleToFill" ></image>
				</view>
				<text>群聊</text>
				
			</view>
		</view>
		
		<uni-indexed-list :style="{top:'104px'}" :options="list" :showSelect="false" @click="bindClick"></uni-indexed-list>
		
		
    </view>
</template>
<script>
	import uniIndexedList from "@/components/uni-indexed-list/uni-indexed-list.vue"
	import uniTransition from "@/components/uni-transition/uni-transition.vue"
	
	
	export default {
		components: {uniIndexedList, uniTransition},
		data(){
			return{
				zhuangtailan:'',
				show: false,
				list:[
					{
					"letter": "A",
					"data": [
							{
								headImg:"/static/img/weixin.png",
								text:"阿克苏机场",
							},
							{
								headImg:"/static/img/weixin.png",
								text:"阿克苏机场",
							},
							{
								headImg:"/static/img/weixin.png",
								text:"阿克苏机场",
							},
							{
								headImg:"/static/img/weixin.png",
								text:"阿克苏机场",
							},
							{
								headImg:"/static/img/weixin.png",
								text:"阿克苏机场",
							},
							{
								headImg:"/static/img/weixin.png",
								text:"阿克苏机场",
							}
						]
					},
					{
						"letter": "B",
						"data": [
							{
								headImg:"/static/img/weixin.png",
								text:"保山机场",
							},
							{
								headImg:"/static/img/weixin.png",
								text:"保山机场",
							},
							{
								headImg:"/static/img/weixin.png",
								text:"保山机场",
							},
							{
								headImg:"/static/img/weixin.png",
								text:"保山机场",
							},
							{
								headImg:"/static/img/weixin.png",
								text:"保山机场",
							}
						]
					},
				]
			}
		},
		mounted() {
			this.$nextTick( ()=> {
			 //    let height = document.querySelector('#list').offsetHeight+'px'
				// console.log(height)
				// #ifdef APP-PLUS  
					let height
					
					const query = uni.createSelectorQuery().in(this);
					query.select('#uni-indexed-list-0').boundingClientRect(data => {
					  console.log("得到布局位置信息" + JSON.stringify(data));
					  console.log("节点离页面顶部的距离为" + data.top);
					  
					  uni.showModal({
					  	title:"提示",
					  	content: String(data.height)
					  })
					}).exec();
					
				// #endif
			})
		},
		onLoad() {
			//获取系统状态栏高度
			// #ifdef APP-PLUS
			this.zhuangtailan = plus.navigator.getStatusbarHeight();
			
			// #endif
		},
		methods:{
			wodequnliao(){
				uni.navigateTo({
					url:'../tabbar-5/qunliao/qunliao'
				})
			},
			openNewPage(){
				uni.navigateTo({
					url:'./search/search'
				})
			},
			open(is) {
				
				if(is) {
					uni.navigateTo({
						url:'./newCrowd/newCrowd'
					})
				}
				this.show = !this.show
			},
			change(){
				
			},
			bindClick(){
				
			}
		}
	};
</script>
<style lang="scss">
	.search{
		height: 30px;
		padding: 6px 120upx 6px 60upx;
		position: relative;
		// box-sizing: border-box;
		border-bottom: 1upx solid #eee;
		view:first-of-type{
			height: 30px;
			line-height: 30px;
			// background-color: #cfdad8;
			background-color: #d3dcdd;
			border-radius: 15px;
			width: 570upx;
			padding-left: 10px;
			text{
				
				color: #888;
				font-size: 14px;
			}
		}
		.imageBox{
			
			height: 26px;
			width: 26px;
			position: absolute;
			right: 30upx;
			top:8px;
			image{
				height: 26px;
				width: 26px;
				position: absolute;
				right: 0upx;
				top:0px;
				z-index: 2;
			}
			
		}
	}
	.qunliaoBox{
		.qunliao{
			height: 42px;
			padding: 0 15px;
			line-height: 42px;
			.imgBox{
				background-color: #4cB964;
				border-radius: 5px;
				height: 32px;
				width: 32px;
				display: inline-block;
				position: relative;
				z-index: 1;
				margin-top: 5px;
				image{
					position: absolute;
					border-radius: 5px;
					z-index: 2;
					left: 5px;
					top: 5px;
					height: 22px;
					width: 22px;
				}
			}
			text{
				font-size: 14px;
				margin-left: 20upx;
				vertical-align: text-bottom;
			}
		}
	}
	
	#list{
		
		.uni-indexed-list__item-border{
			position: relative;
			border: 0!important;
			
		}
		.uni-indexed-list__item-border::after{
			content: "";
			position: absolute;
			height: 1upx ;
			background-color: #eee;
			width: 590upx;
			right: 0;
			bottom: 1upx;
		}
		.uni-indexed-list__title-wrapper{
			border: 0!important ;
		}
		.uni-indexed-list__list{
			border: 0!important;
		}
		.uni-indexed-list__menu{
			background-color: #fff;
		}
	}
	
</style>
