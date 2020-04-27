<template>
	<view class="search" :style="{paddingTop: (zhuangtailan+6)+'px'}">
		
		<view @click="openNewPage"><text>请输入群ID或群名称</text></view>
		
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
</template>

<script>
	import uniTransition from "@/components/uni-transition/uni-transition.vue"
	export default{
		data(){
			return{
				zhuangtailan : 0,
				show:false,
				
			}
		},
		props:{
		
		},
	
		created() {
			//获取系统状态栏高度
			// #ifdef APP-PLUS
				this.zhuangtailan = plus.navigator.getStatusbarHeight();
				
			// #endif
			console.log(this.zhuangtailan)
		},
		methods:{
			openNewPage(){
				uni.navigateTo({
					url:'/pages/tabbar/tabbar-2/search/search'
				})
			},
			open(is) {
				if(is) {
					uni.navigateTo({
						url:'/pages/tabbar/tabbar-2/newCrowd/newCrowd'
					})
				}
				this.show = !this.show
			},
			change(){
				
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	.search{
		height: 29px;
		padding: 0px 120upx 6px 60upx; //top在行内样式
		position: relative;
		background-color: #fff;
		// box-sizing: border-box;
		border-bottom: 1px solid #ddd;
		view:first-of-type{
			height: 30px;
			line-height: 30px;
			// background-color: #cfdad8;
			background-color: #EEEEEE;
			border-radius: 15px;
			width: 570upx;
			padding-left: 10px;
			text{
				
				color: #CCCCCC;
				font-size: 14px;
			}
		}
		.imageBox{
			height: 26px;
			width: 26px;
			position: absolute;
			right: 30upx;
			bottom:8px;
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
</style>
