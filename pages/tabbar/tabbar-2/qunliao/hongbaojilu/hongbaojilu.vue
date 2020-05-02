<template>
	<view>
		<view class="infoBox">
			<view class="button" @click="open">
				<text>{{defaultYear}}年</text>
				<br>
				<text  class="uni-icon uni-icon-arrowdown"></text>
			</view>
			<image src="../../../../../static/moren.png"></image>
			<br>
			<text style="line-height: 60upx;">抢红包共收到</text>
			<br>
			<text class="money">{{totalAmount}}</text>
			<text>元</text>
		</view>
		
		<view class="myList">
			<ul>
				<li class="SelectList" style="display: flex;" v-for="(item,index) in dataList" :key="index">
					<view style="flex: 1;display: flex;flex-direction: column;">
						<text style="font-size: 16px;color: #000;font-weight: 400;">{{item.mark}}</text>
						<text style="font-size: 12px;color: #999999;">{{item.createTime}}</text>
					</view>
					<view>
						<text class="bold">{{item.tradeAmount}}元</text>
						
					</view>
				</li>
			</ul>
			
			<uni-load-more :status="more"></uni-load-more>
		</view>
		
		<uni-popup ref="popup" type="bottom" :maskClick="false" >
			<view class="pickerViewBox">
				<text class="quxiao" @click="close(false)">取消</text>
				<text class="queding" @click="close(true)">确定</text>
				<picker-view class="pickerView" v-if="visible" :indicator-style="indicatorStyle" :value="value" @change="bindChange">
					<picker-view-column>
						<view class="item" v-for="(item,index) in years" :key="index">{{item}}年</view>
					</picker-view-column>
					
				</picker-view>
			</view>
		</uni-popup>
	
	</view>
</template>

<script>
	import TabMask from '@/components/chunLei-modal/tabMask'
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	export default {
	    components: {uniPopup,uniLoadMore},
		data(){
			let years = []
			let date = new Date()
			for (let i = 2018; i <= date.getFullYear(); i++) {
				years.push(i)
			}
			return{
				more:"more",
				pageNo:1,
				pageSize:20,
				totalPage:2,
				reload:false,
				lock: false,
				crowdId:null,
				totalAmount:'',
				modalValue:false,
				tabMask:null,
				year: date.getFullYear(),
				defaultYear: date.getFullYear(),
				years:years,
				visible:true,
				dataList:[],
				indicatorStyle: `height: ${Math.round(uni.getSystemInfoSync().screenWidth/(750/100))}px;`
			}
		},
		computed:{
			value(){
				let val
				this.years.forEach((item,index)=>{
					if(item == this.defaultYear){
						val = index
					}
				})
				return [val]
			}
		},
		onBackPress(e){
			if(this.modalValue){ //模态框打开了，先关掉在返回
				if(e.from == 'backbutton') {//实体键
					this.hide()
					this.close()
					return true
				}
				if(e.from == 'navigateBack'){
					return false
				}
			} else{
				return false
			}
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
		onLoad(option) {
			console.log(option)
			
			this.crowdId = option.crowdId;
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
			this.tabMask = new TabMask({
				tabbarHeight:0,
				navHeight:height,
				opacity:0.4,
				fn
			})
			this.reload = true;
			this.loadData();
		},
		methods:{
			loadData(){
				
				this.lock = true;
				this.more = "loading";
				console.log(this.defaultYear);
				this.$http.httpGetToken("/red-record/page",{
					crowdId:this.crowdId,
					pageNo:this.pageNo,
					pageSize:this.pageSize,
					startTime:this.defaultYear+'-01-01',
					endTime:Number(this.defaultYear+1)+'-01-01',
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
				
				
				this.$http.httpGetToken("/red-record/totalAmount",{
					crowdId:this.crowdId,
					startTime:this.defaultYear+'-01-01',
					endTime:Number(this.defaultYear+1)+'-01-01',
				},(res)=>{
					this.totalAmount = res.data;
				},false)
				
			},
			show(){
				this.modalValue = true
				this.tabMask.show(600)  //展示动画时间
			},
			hide(){
				this.modalValue = false
				setTimeout(()=>{
					this.tabMask.hide()
				},22)
				
			},
			open(){
				this.$refs.popup.open()
				this.visible = true
				this.show()
			},
			close(is){
				
				if(is){
					this.defaultYear = this.year
					this.pageNo = 1;
					this.reload = true;
					this.loadData();
				}
				this.hide()
				this.$refs.popup.close()
				this.visible = false
			},
			bindChange: function (e) {
				const val = e.detail.value
				this.year = this.years[val[0]]
				
			}
	   }
	}
</script>

<style lang="scss">
	.infoBox{
		padding: 120upx 0 0 0;
		height: 300upx;
		background-color: #eee;
		text-align: center;
		position: sticky;
		width: 100%;
		left: 0;
		right: 0;
		top:0;
		z-index: 1;
		
		image{
			width: 100upx;
			height: 100upx;
			border-radius:5px;
		}
		.money{
			font-size: 30px;
			font-weight: bold;
			margin-right: 30upx;
		}
		.button{
			position: absolute;
			width: 100upx;
			right: 30upx;
			top: 30upx;
			text-align: center;
			color: #F0AD4E;
			
		}
	}
	.myList{
		border-top: 20upx solid #eee;
		font-size: 28upx;
		color: #333;
	}
	.myList ul{
		// border-top: 1upx solid #eee;
		// border-bottom: 1upx solid #eee;
	}
	
	.myList .SelectList{
		position: relative;
		height: 80upx;
		padding: 20upx 30upx;
		background-color: #fff;
		/* border-bottom: 1px solid #eee; */
	}
	
	.myList .SelectList view{
		display: inline-block;
		width: 30%;
		
	}
	.myList .SelectList view:first-of-type{
		vertical-align: middle;
		line-height: 40upx;
	}
	
	.myList .SelectList view:last-of-type{
		line-height: 80upx;
		float: right;
		text-align: right;
	}
	.myList .SelectList view .bold{
		font-weight: bold;
	}
	.myList .SelectList view:first-of-type text{
		color: #666;
	}
	
	.myList .SelectList::before{
		content: '';
		position: absolute;
		height: 1px;
		background-color: #eee;
		width: calc(100% - 30upx);
		bottom: 0;
		right: 0;
	}
	.myList .nullBottom::before{
		content: '';
		position: absolute;
		height: 0upx;
		background-color: #eee;
		width: calc(100% - 30upx);
		bottom: 0;
		right: 0;
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
	
</style>
