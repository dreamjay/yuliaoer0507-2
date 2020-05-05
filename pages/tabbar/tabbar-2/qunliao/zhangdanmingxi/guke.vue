<template>
	<view>
		
		
		
		<view>

			
			<view v-for="(item,index) in dataList2" :key="index"  class="scrollItem2">
				<view class="s_head">
					<view><org-image :css="'s_img'" :src="item.headUrl"></org-image></view>
					<view class="s_center"><text>{{item.nickName}}</text></view>
				</view>
				<view style="flex: 1;">
				<view class="body">
					<view class="b_left">
						<text>充值：{{item.rechargeAmount.toFixed(2)}}</text>
					</view>
					<view class="b_right">
						<text>提现：{{item.withdrawAmount.toFixed(2)}}</text>
					</view>
				</view>
				
				<view class="body">
					<view class="b_left">
						<text>发包流水：{{item.fabaoAmount.toFixed(2)}}</text>
					</view>
					<view class="b_right">
						<text>所抢红包：{{item.gradBaoAmount.toFixed(2)}}</text>
					</view>
				</view>
				
				<view class="body">
					<view class="b_left">
						<text>派发福利：{{item.zhongJiangReturnAmount.toFixed(2)}}</text>
					</view>
					<view class="b_right">
						<text>盈亏：：{{  ( item.gradBaoAmount + item.redReturnAmount + item.gradBaoReturnAmount  - item.fabaoAmount - item.zhongleiAmount)  .toFixed(2)  }}</text>
					</view>
				</view>
				
				<view class="body">
					<view class="b_left">
						<text>推荐返水：{{item.tuijianReturnAmount.toFixed(2)}}</text>
					</view>
					<view class="b_right">
						<text>总余分：{{(item.blance + item.freezeBlance).toFixed(2)}}</text>
					</view>
				</view>
				
				<view class="body">
					<view class="b_left">
						<text>返福利后总盈亏：{{ ( item.gradBaoAmount + item.redReturnAmount + item.gradBaoReturnAmount + item.zhongJiangReturnAmount + item.tuijianReturnAmount + item.fabaoAmount * redRebate  - item.fabaoAmount - item.zhongleiAmount  ).toFixed(2)  }}</text>
					</view>
					<view class="b_right">
					</view>
				</view>
				
				<view class="body2" style="color: #4CD964;">
							免死号抢号：{{item.miansiAmount.toFixed(2)}} X {{(100).toFixed(2)}}% = {{(item.miansiAmount).toFixed(2)}}
				</view>
				
				
				
				
				
				</view>
			</view>
			
			
			
			<uni-load-more :status="more"></uni-load-more>
		</view>
		
	</view>
</template>

<script>


	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	import orgImage from '@/components/org-image/org-image';
	export default {
	    components: {uniLoadMore,orgImage},
		data(){
			
			// console.log(year,month,day)
			return{
				more:"more",
				redRebate:0,
				dataList2:[]
			}
			
		},
		
		computed:{
			
			
		},
		
		onLoad(option) {
			this.crowdId = option.crowdId;
			this.parentUserId = option.userId;
			this.startTime = option.startTime;
			this.endTime = option.endTime;
			this.redRebate = option.redRebate;
			let height
			uni.getSystemInfo({
				success: (e) => {
				  // #ifdef APP-PLUS
				  // console.log('app-plus', e)
				  height = e.statusBarHeight + 44
				  // #endif
				}
			})
			let fn = ()=>{
				// this.hide()
				// this.close()
			}
			
			this.loadData();
		},
		methods:{
			loadData(){
				this.lock = true;
				
				this.$http.httpGetToken("/crowd-account-trade-record/gukeList",{
					crowdId:this.crowdId,
					parentUserId:this.parentUserId,
					startTime:this.startTime,
					endTime:this.endTime,
				},(res)=>{
					this.lock = false;
					var list = res.data;
					this.dataList2 = list;
					console.log(list)
					this.more="noMore"
				},false)
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.navBox{
		position: sticky;
		width: 100%;
		left: 0;
		right: 0;
		top:0;
		z-index: 1;
		border-top: 1px solid #EEEEEE;
		background-color: #FFFFFF;
		
		.navItem{
			float: left;
			width: 375upx;
			box-sizing: border-box;
			height: 60px;
			text-align: center;
			padding: 10px 0;
			
			text{
				height: 20px;
				line-height: 20px;
				display: inline-block;
			}
		}
		.navItem:nth-of-type(1){
			border-right: 1px solid #EEEEEE;
			border-bottom: 1px solid #EEEEEE;
		}
		.navItem:nth-of-type(2){
			border-bottom: 1px solid #EEEEEE;
		}
		.navItem:nth-of-type(3){
			border-right: 1px solid #EEEEEE;
			border-bottom: 1px solid #EEEEEE;
		}
		.navItem:nth-of-type(4){
			border-bottom: 1px solid #EEEEEE;
		}
		.navItem:nth-of-type(5){
			border-right: 1px solid #EEEEEE;
			border-bottom: 1px solid #EEEEEE;
		}
		.navItem:nth-of-type(6){
			border-bottom: 1px solid #EEEEEE;
		}
	}
	.navBox::after{
		content: '';
		display: block;
		clear:both;
	}
	.title{
		height: 35px;
		padding: 0 15px;
		line-height: 35px;
		font-size: 12px;
		background-color: #eee;
		.red{
			margin-left: 10px;
			color: red;
		}
	}
	.scrollItem{
		display: flex;
		height: 50px;
		padding: 0 15px;
		border-bottom: 1px solid #EEEEEE;
		.minView{
			display: flex;
			flex-direction: column;
			flex: 1;
			width: calc(50% - 15px);
			text:first-of-type{
				display: block;
				height: 30px;
				line-height: 30px;
				
			}
			text:last-of-type{
				display: block;
				height: 20px;
				line-height: 20px;
				font-size: 10px;
				color: #999;
			}
		}
		.right{
			display: inline-block;
			width: calc(50% - 15px);
			height: 50px;
			line-height: 50px;
			float: right;
			text-align: right;
		}
	}
	.pickerViewBox{
		height: 500upx;
		position: relative;
		z-index: 999;
		background-color: #fff;
		border-radius: 10px 10px 0 0;
		.quxiao{
			line-height: 80upx;
			float: left;
			margin-left: 30upx;
			padding: 10upx;
		}
		.queding{
			margin-right: 30upx;
			float: right;
			line-height: 80upx;
			padding: 10upx;
			color: #4CB964;
		}
		.pickerView{
			position: relative;
			top: 100upx;
			left: 0;
			height: 400upx;
			text-align: center;
			.item{
				line-height: 50px;
			}
		}
	}
	.classViewBox{
		height: 640upx;
		position: relative;
		z-index: 999;
		background-color: #fff;
		border-radius: 10px 10px 0 0;
		.top{
			height: 100upx;
			line-height: 100upx;
			text-align: center;
			border-bottom: 1px solid #eee;
			box-sizing: border-box;
		}
		.content{
			padding: 30upx;
			view{
				text-align: center;
				height: 80upx;
				width: 220upx;
				background-color: #eee;
				border-radius: 3px;
				float: left;
				margin-left: 15upx;
				margin-top: 20upx;
				text{
					line-height: 80upx;
				}
			}
			.active{
				color: #fff;
				background-color: #4CB964;
			}
			view:nth-of-type(1),
			view:nth-of-type(4),
			view:nth-of-type(7),
			view:nth-of-type(10){
				margin-left: 0;
			}
			view:nth-of-type(1),
			view:nth-of-type(2),
			view:nth-of-type(3){
				margin-top: 0;
			}
		}
		.content::after{
			content: '';
			display: block;
			clear: both;
		}
		.bottom{
			border-top: 1px solid #eee;
			box-sizing: border-box;
			height: 100upx;
			line-height: 100upx;
			text-align: center;
		}
	}
	
	
.scrollItem2{
	display: flex;
	padding:  15px;
	border-bottom: 1px solid #EEEEEE;
	flex-direction: row;
	
	
	
}	
.s_head{
	width: 50px;
	display: flex;
	flex-direction: column;
}
.s_img{
	margin-top: 8px;
	width: 24px;
	height: 24px;
}
.s_center{
	flex: 1;
	line-height: 40px;
}

	
.body{
	display: flex;
	height: 20px;
	font-size: 12px;
	line-height: 20px;
}
.body2{
	display: flex;
	height: 20px;
	font-size: 12px;
	line-height: 20px;
	
}
.b_left{
	width: 50%;
}
.b_right{
	width: 50%;
}
</style>
