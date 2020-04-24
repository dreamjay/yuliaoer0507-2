<template>
    <view >
		<Search></Search>
		<view class="qunliaoBox" @click="wodequnliao">
			<view class="qunliao breakLine">
				<image src="/static/icon_ql.png" mode="scaleToFill" ></image>
				<text>群聊</text>
			</view>
		</view>
		<uni-indexed-list :style="{top:''+(zhuangtailan+92)+'px'}" :options="list" :showSelect="false" @click="bindClick"></uni-indexed-list>
	</view>
</template>
<script>
	import uniIndexedList from "@/components/uni-indexed-list/uni-indexed-list.vue"
	import Search from "@/components/search/search.vue"
	export default {
		components: {uniIndexedList,Search},
		data(){
			return{
				zhuangtailan:0,
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
			bindClick(){
				
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
			height: 50px;
			padding: 0 15px;
			line-height: 50px;
			image{
				// position: absolute;
				// z-index: 2;
				vertical-align: middle;
				height: 32px;
				width: 32px;
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
