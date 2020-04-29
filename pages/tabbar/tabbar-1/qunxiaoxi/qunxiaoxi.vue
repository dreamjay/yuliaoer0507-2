<template>
	<view>
		<view v-for="(item, index) in dataList" :key="index">
			<view class="scrollItem">
				<view class="time">
					<text>{{ item.createTime }}</text>
				</view>
				<view class="content">
					<view>
						<div><image :src="item.headUrl ? item.headUrl : '/static/moren.png'"></image></div>
					</view>
					<view>
						<text style="color: #333333;">{{ item.content }}</text>
					</view>
					<view>
						<div>
							<button style="" type="primary" size="mini" @click="agree(item.id,1)" v-show="item.status == 0">同意</button>
							<button style="" type="primary" size="mini" @click="agree(item.id,2)" v-show="item.status == 0">拒绝</button>
							<button style="background-color: #ccc; border: 0; color: #fff;" type="primary" size="mini" :disabled="true" v-if="item.status == 1">已同意</button>
							<button style="" type="primary" size="mini" :disabled="true" v-if="item.status == 2">已拒绝</button>
						</div>
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
			this.$http.httpGetToken('/crowd-join-record/page',{
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
		
		},
		agree(id,status){
			var content = (status==1)?'同意':'拒绝'
			var that = this;
			uni.showModal({
			    title: '操作确认',
			    content: content+'加群',
			    success: function (res) {
			        if (res.confirm) {
			            that.$http.httpPostToken('/crowd-join-record/agree',{
							id:id,
							status:status,
						},(res)=>{
							that.dataList.find((item,index)=>(item.id==id)).status = status;		
						},true);
					} 
				}
			});
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
			font-size: 14px;
		}
	}
	.content {
		width: 650upx;
		height: 120upx;
		padding: 20upx;
		background-color: #fff;
		border-radius: 5px;
		view:nth-of-type(1) {
			display: inline-block;
			vertical-align: middle;
			position: relative;
			width: 120upx;
			height: 120upx;
			div {
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				image {
					height: 90upx;
					width: 90upx;
					border-radius: 5px;
					vertical-align: middle;
				}
				text {
					font-size: 14px;
					color: #999;
				}
			}
		}
		view:nth-of-type(2) {
			display: inline-block;
			width: 420upx;
			padding-right: 10upx;
			vertical-align: middle;
			height: 120upx;
			font-size: 14px;
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
