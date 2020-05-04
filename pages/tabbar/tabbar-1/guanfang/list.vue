<template>
	<view>
		<view v-for="(item, index) in dataList" :key="index">
			<view class="scrollItem">
				<view class="time">
					<text>{{ item.createTime }}</text>
				</view>
				<view class="content">
						<text style="color: #333333;font-size: 32upx;">官方通知</text>
					<view>
						<text style="color: #999999;font-size: 26upx;">{{ item.content }}</text>
					</view>
				</view>
			</view>
		</view>
		<uni-load-more :status="more"></uni-load-more>
	</view>
</template>

<script>
import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
export default {
	components: { uniLoadMore},
	data() {
		return {
			dataList: [
			],
			more:"more",
			pageNo:1,
			pageSize:10,
			totalPage:2,
			reload:false,
			lock: false
		};
	},
	onPullDownRefresh(){
		if(this.lock){
			return;
		}
		this.pageNo = 1;
		this.reload = true;
		this.loadData();
		
	},
	onReachBottom(){
		if(this.lock){
			return;
		}
		if(this.pageNo > this.totalPage){
			this.more="noMore"
			return false;
		}
		this.reload = false;
		this.loadData();
	},
	onLoad() {
		this.reload = true;
		this.loadData();
	},
	methods:{
		loadData(){
			this.lock = true;
			this.more = "loading";
			this.$http.httpGetToken('/system-message/listByUserId',{
				pageNo:this.pageNo,
				pageSize:this.pageSize
			},(res)=>{
				this.lock = false;
				var list = res.data.records;
				this.dataList = this.reload ? list : this.dataList.concat(list);
				this.pageNo = res.data.current;
				this.totalPage = res.data.pages;
				if(this.pageNo == this.totalPage || this.totalPage == 0){
					this.more="noMore"
				}else{
					this.more="more"
				}
				this.pageNo++;
				uni.stopPullDownRefresh();
			},false)
		
		}
		
	}
};
</script>

<style lang="scss">
page {
	background-color: #eeeeee;
}
.scrollItem {
	height: 230upx;
	background-color: #eee;
	// border-bottom: 1upx solid #ddd;
	// line-height: 300upx;
	padding: 30upx 30upx 30upx 30upx;
	.time {
		text-align: center;
		margin-bottom: 20upx;
		text {
			display: inline-block;
			padding: 10upx 30upx;
			border-radius: 5px;
			background-color: #ddd;
			color: #fff;
			font-size: 12px;
		}
	}
	.content {
		width: 650upx;
		height: 150upx;
		padding: 20upx;
		background-color: #fff;
		border-radius: 5px;
		
		view {
			display: inline-block;
			vertical-align: middle;
			height: 120upx;
			font-size: 12px;
			text {
				color: #999;
				margin-top: 20upx;
				line-height: 40upx;
				height: 40upx;
				display: inline-block;
			}
			.fontMax {
				font-size: 14px;
			}
			.color {
				color: #4cb964;
			}
			.copy {
				color: #999;
				text-decoration: underline;
				margin-left: 15upx;
			}
		}
		view:nth-of-type(3) {
			position: relative;
			float: right;
			vertical-align: middle;
			display: inline-block;
			width: 100upx;
			height: 120upx;
			div {
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				button {
					padding: 0;
					width: 100upx;
					line-height: 50upx;
					height: 50upx;
					float: right;
					margin-bottom: 20upx;
				}
				button:first-of-type {
					background-color: #4cb964;
				}
				button:last-of-type {
					background-color: #dd524d;
					margin-bottom: 0;
				}
			}
		}
	}
}
</style>
