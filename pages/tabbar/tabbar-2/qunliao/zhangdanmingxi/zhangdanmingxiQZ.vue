<template>
	<view>
		<view class="navBox">
			
			<view class="navItem" @click="open('start')">
				<text>开始时间</text>
				
				<br>
				<text>{{defaultYearS}}-{{defaultMonthS}}-{{defaultDayS}}</text>
				<text  class="uni-icon uni-icon-arrowdown" style="font-size: 14px; color:#999;vertical-align: middle;"></text>
			</view>
			<view class="navItem" @click="open('end')">
				<text>结束时间</text>
				
				<br>
				<text>{{defaultYearE}}-{{defaultMonthE}}-{{defaultDayE}}</text>
				<text  class="uni-icon uni-icon-arrowdown" style="font-size: 14px; color:#999;vertical-align: middle;"></text>
			</view>
			<view class="navItem">
				<text>今日输赢</text>
				<br>
				<text>{{cAmount}}</text>
			</view>
			<view class="navItem" @click="open('class')">
				<text>选择分类</text>
				
				<br>
				<text>{{classList[classIndex]}}</text>
				<text  class="uni-icon uni-icon-arrowdown" style="font-size: 14px; color:#999;vertical-align: middle;"></text>
			</view>
		</view>
		<view class="title">
			<text>{{classList[classIndex]}}</text>
			<text class="red">累积：{{totalAmount}}</text>
		</view>
		
		<view>
			<view v-for="(item,index) in dataList" :key="index" class="scrollItem">
				<view class="minView">
					<text>{{item.mark}}</text>
					<text>{{item.createTime}}</text>
				</view>
				<view class="right">
					<text>{{item.flag}}{{item.tradeAmount.toFixed(2)}}</text>
				</view>
			</view>
			<uni-load-more :status="more"></uni-load-more>
		</view>
		
		<uni-popup ref="popup" type="bottom" :maskClick="false" >
			<view class="pickerViewBox" v-if="type=='start'||type=='end'">
				<text class="quxiao" @click="close(false)">取消</text>
				<text class="queding" @click="close(true)">确定</text>
				<picker-view class="pickerView" v-if="visible" :indicator-style="indicatorStyle" :value="type=='start'?SelectValueS:type=='end'?SelectValueE:[]" @change="bindChange">
					<picker-view-column>
						<view class="item" v-for="(item,index) in years" :key="index">{{item}}年</view>
					</picker-view-column>
					<picker-view-column>
						<view class="item" v-for="(item,index) in months" :key="index">{{item}}月</view>
					</picker-view-column>
					<picker-view-column>
						<view class="item" v-for="(item,index) in days" :key="index">{{item}}日</view>
					</picker-view-column>
					
				</picker-view>
			</view>
			<view class="classViewBox" v-if="type=='class'">
				<view class="top"><text>选择交易类型</text></view>
				<view class="content">
					<view v-for="(item,index) in classList" :key="index" :class="index==classIndex?'active':null" @click="close(true,index)">
						<text>{{item}}</text>
					</view>
				</view>
				<view class="bottom" @click="close(false)">
					<text>取消</text>
				</view>
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
			const date = new Date()
			const years = []
			const year = date.getFullYear()
			const months = []
			const month = date.getMonth() + 1
			const days = []
			const day = date.getDate()
			for (let i = 2018; i <= date.getFullYear(); i++) {
				years.push(i)
			}
			for (let i = 1; i <= 12; i++) {
				months.push(i)
			}
			for (let i = 1; i <= 31; i++) {
				days.push(i)
			}
			// console.log(year,month,day)
			return{
				more:"more",
				pageNo:1,
				pageSize:20,
				totalPage:2,
				reload:false,
				lock: false,
				crowdId:null,
				aAmount:'-',
				bAmount:'-',
				cAmount:'-',
				totalAmount:'-',
				classList:['充值记录',"提现记录","发福利明细","免死号抢包明细","代理流水福利","股东下级盈亏","每日总收益","当日总流水","顾客余分"],
				classIndex:0,
				typeList:["SHANG_FEN","XIA_FEN","ZHONG_JIANG","MIAN_SI_GRAD_BAO","TUI_JIAN_FAN_LI","GUDONG_XIA_JI","JIN_RI_YING_KUI","FA_BAO","GU_KE"],
				modalValue:false,
				tabMask:null,
				defaultYearS: date.getFullYear(),
				defaultMonthS: date.getMonth() + 1,
				defaultDayS: date.getDate(),
				defaultYearE: date.getFullYear(),
				defaultMonthE: date.getMonth() + 1,
				defaultDayE: date.getDate(),
				years:years,
				year: year,
				months:months,
				month:month,
				days:days,
				day:day,
				type:null,
				visible:true,
				indicatorStyle: `height: ${Math.round(uni.getSystemInfoSync().screenWidth/(750/100))}px;`,
				dataList:[]
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
		computed:{
			SelectValueS(){
				let year,month,day
				this.years.forEach((item,index)=>{
					if(item == this.defaultYearS){
						year = index
					}
				})
				this.months.forEach((item,index)=>{
					if(item == this.defaultMonthS){
						month = index
					}
				})
				this.days.forEach((item,index)=>{
					if(item == this.defaultDayS){
						day = index
					}
				})
				return [year,month,day]
			},
			SelectValueE(){
				let year,month,day
				this.years.forEach((item,index)=>{
					if(item == this.defaultYearE){
						year = index
					}
				})
				this.months.forEach((item,index)=>{
					if(item == this.defaultMonthE){
						month = index
					}
				})
				this.days.forEach((item,index)=>{
					if(item == this.defaultDayE){
						day = index
					}
				})
				return [year,month,day]
			},
			
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
		onLoad(option) {
			this.crowdId = option.crowdId;
			
			
			
			console.log('crowdId',this.crowdId)
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
			
			this.loadAmount();
			this.today();
			this.reload = true;
			this.loadData();
		},
		methods:{
			loadData(){
				
				var sMonth =Number(this.defaultMonthS) < 10?"0"+this.defaultMonthS:this.defaultMonthS;
				var Sday = Number(this.defaultDayS) < 10?"0"+this.defaultDayS:this.defaultDayS;
				
				var eMonth =Number(this.defaultMonthE) < 10?"0"+this.defaultMonthE:this.defaultMonthE;
				var da = Number(this.defaultDayE) + 1;
				var eday = da < 10?"0"+ da : da;
				
				var startTime = this.defaultYearS+'-'+sMonth+"-"+Sday + " 00:00:00";
				var endTime = this.defaultYearE+'-'+eMonth+"-"+eday + " 00:00:00";
				var tradeType = this.typeList[this.classIndex];
				
				this.lock = true;
				this.more = "loading";
				this.$http.httpGetToken("/crowd-account-trade-record/pageByQunzhu",{
					crowdId:this.crowdId,
					pageNo:this.pageNo,
					pageSize:this.pageSize,
					tradeType:tradeType,
					startTime:startTime,
					endTime:endTime,
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
				
				this.$http.httpGetToken("/crowd-account-trade-record/pageSumByQunzhu",{
					crowdId:this.crowdId,
					tradeType:tradeType,
					startTime:startTime,
					endTime:endTime,
				},(res)=>{
					this.totalAmount = res.data.toFixed(2);
				},false)
				
				
			},
			
			loadAmount(){
				
			},
			today(){
				this.$http.httpPostToken("/crowd-account-trade-record/today",{
					crowdId:this.crowdId,
				},(res)=>{
					console.log(res)
					this.cAmount = res.data.toFixed(2);
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
			open(type,index){
				this.type = type
				if(this.type == 'start'){
					this.year = this.defaultYearS
					this.month = this.defaultMonthS
					this.day = this.defaultDayS
					this.visible = true
				} else if(this.type == 'end'){
					this.year = this.defaultYearE
					this.month = this.defaultMonthE
					this.day = this.defaultDayE
					this.visible = true
				} else if(this.type == 'class'){
					
				}
				this.$refs.popup.open()
				this.show()
				
			},
			close(is,index){
				
				if(is){
					if(this.type == 'start'){
						this.defaultYearS = this.year
						this.defaultMonthS = this.month
						this.defaultDayS = this.day
					} else if(this.type == 'end'){
						this.defaultYearE = this.year
						this.defaultMonthE = this.month
						this.defaultDayE = this.day
					} else if(this.type == 'class'){
						this.classIndex = index
					}
					
					
				}
				this.pageNo = 1;
				this.reload = true;
				this.loadData();
				this.hide()
				this.$refs.popup.close()
				this.visible = false
			},
			bindChange: function (e) {
				
				const val = e.detail.value
				this.year = this.years[val[0]]
				this.month = this.months[val[1]]
				this.day = this.days[val[2]]
				
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
</style>
