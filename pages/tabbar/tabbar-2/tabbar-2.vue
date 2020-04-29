<template>
    <view >
		
		<uni-indexed-list  :options="list" :showSelect="false" @click="bindClick">
			
			
		</uni-indexed-list>
		<uni-transition @click="open(true)" :mode-class="['zoom-in']" :duration="50" :styles="{
			'zIndex':'8',
			'width':'100px',
			'height':'60px',
			'line-height':'60px',
			'backgroundColor':'black',
			'borderRadius':'4px',
			'top':'0px',
			'right':'0px',
			'position':'absolute',
			}" :show="show">
				<view style="width: 10px!important; height: 10px; border-radius:0 4px 0 0; background-color: black; position: absolute; right: 0; top:0; transform: rotate(45deg);"></view>
				<image src="/static/img/xiaoxi.png" style="height:20px; width: 20px; position: absolute; left: 10px; top: 20px;" ></image>
				<text style="color:#fff; margin-left: 30px; vertical-align: super;">我要建群</text>
			
		</uni-transition>
	</view>
</template>
<script>
	import uniIndexedList from "@/components/uni-indexed-list/uni-indexed-list.vue"
	export default {
		components: {uniIndexedList},
		data(){
			return{
				zhuangtailan:0,
				show:false,
				list:[{
						"letter":"",
						data:[
							{
							headImg:"/static/icon_ql.png",
							text:"群聊",	
							}
						],
					},
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
				]
			}
		},
		mounted() {
			this.$nextTick( ()=> {
				
			})
		},
		onNavigationBarButtonTap(obj){
			this.open(false);
		},
		onNavigationBarSearchInputClicked(e){
			uni.navigateTo({
				url:'/pages/tabbar/tabbar-2/search/search',
				animationType: 'fade-in',
				animationDuration: 200
			})
		},
		onLoad() {
			//获取系统状态栏高度
			// #ifdef APP-PLUS
			this.zhuangtailan = plus.navigator.getStatusbarHeight();
			
			// #endif
		},
		
		methods:{
			bindClick(e){
				console.log(e)
				if(e.item.name == '群聊'){
					uni.navigateTo({
						url:'../tabbar-5/qunliao/qunliao',
						animationType:'slide-in-right'
					})
				}
			},
			open(is) {
				console.log(is)
				this.show = !this.show
				if(is) {
					uni.navigateTo({
						url:'/pages/tabbar/tabbar-2/newCrowd/newCrowd'
					})
				}
				
			}
		}
	};
</script>
<style lang="scss">
	page{
		background-color: #EEEEEE;
	}
	.qunliaoBox{
		background-color: #FFFFFF;
		.qunliao{
			height: 60px;
			padding: 0 15px;
			line-height: 60px;
			image{
				// position: absolute;
				// z-index: 2;
				vertical-align: middle;
				height: 40px;
				width: 40px;
			}
			
			text{
				font-size: 14px;
				margin-left: 20upx;
				vertical-align: middle;
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
