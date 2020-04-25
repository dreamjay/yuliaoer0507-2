<template>
	<view>
		<view class="navBox">
			<view class="navItem">
				<text>总资产</text>
				<br>
				<text>789.97</text>
			</view>
			<view class="navItem">
				<text>冻结积分</text>
				<br>
				<text>789.97</text>
			</view>
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
				<text>789.97</text>
			</view>
			<view class="navItem" @click="open('class')">
				<text>选择分类</text>
				
				<br>
				<text>{{classList[classIndex]}}</text>
				<text  class="uni-icon uni-icon-arrowdown" style="font-size: 14px; color:#999;vertical-align: middle;"></text>
			</view>
		</view>
		<view class="title">
			<text>提现</text>
			<text class="red">累积：0.55</text>
		</view>
		
		<scroll-view 
			:scroll-y="isScroll" 
			:style="{height:scrollHei+'px'}"
			:refresher-enabled="isActive"
			:refresher-threshold="80"
			refresher-default-style="white"
			@scroll="scroll"
			@scrolltoupper="scrolltoupper"
			:refresher-triggered="triggered"
			@refresherpulling="onPulling"
			@refresherrefresh="onRefresh"
			@refresherrestore="onRestore"
			@refresherabort="onAbort"
			>
			<view v-for="(item,index) in infos" :key="index" class="scrollItem">
				<view class="minView">
					<text>"上分/1200"</text>
					<text>2018-456</text>
				</view>
				<view class="right">
					<text>+1200</text>
				</view>
			</view>
		</scroll-view>
		
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
	export default{
		components: {uniPopup},
		data(){
			const date = new Date()
			const years = []
			const year = date.getFullYear()
			const months = []
			const month = date.getMonth() + 1
			const days = []
			const day = date.getDate()
			for (let i = 2014; i <= date.getFullYear(); i++) {
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
				classList:['充值',"提现","红包发布","好友转账","红包奖励","红包领取","推荐返点","中了雷包","股份收益","中雷扣除","发包流水"],
				classIndex:0,
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
				scrollHei:uni.getSystemInfoSync().windowHeight - 180 - 35,
				triggered:true,
				is_freshing:false,//
				isScroll:true,
				isActive:true,
				infos:[
					{
						text:'上分1200',
						textRight:'+1000',
						time:'2019-7898-57'
					},
					{
						text:'上分1200',
						textRight:'+1000',
						time:'2019-7898-57'
					},
					{
						text:'上分1200',
						textRight:'+1000',
						time:'2019-7898-57'
					},
					{
						text:'上分1200',
						textRight:'+1000',
						time:'2019-7898-57'
					},
					{
						text:'上分1200',
						textRight:'+1000',
						time:'2019-7898-57'
					},
					{
						text:'上分1200',
						textRight:'+1000',
						time:'2019-7898-57'
					},
					{
						text:'上分1200',
						textRight:'+1000',
						time:'2019-7898-57'
					},
					{
						text:'上分1200',
						textRight:'+1000',
						time:'2019-7898-57'
					},
					{
						text:'上分1200',
						textRight:'+1000',
						time:'2019-7898-57'
					},
				]
			}
			
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
		onLoad() {
			console.log('scrollHie',this.scrollHei)
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
			
		},
		methods:{
			scrolltoupper(){
				setTimeout(()=>{
					// console.log("到顶部")
					this.isActive = true
				},100)
			},
			scroll(e){
				// console.log("滚动",e.detail.scrollTop,e.detail.deltaY)
				if(e.detail.scrollTop == 0) {
					this.isActive = true
				}
				if(e.detail.deltaY < 0){
					this.isActive = false
				}
			},
			onPulling(e) { //下拉
				// console.log("onpulling", e);
				
			},
			onRefresh() { //触发下拉
				console.log("触发下拉",this.is_freshing)
				this.isScroll = false
				if (this.is_freshing) return;
				this.is_freshing = true;
				setTimeout(() => {
					this.triggered = false;
					this.is_freshing = false;
				}, 3000)
			},
			onRestore() { // 需要重置
				this.triggered = 'restore'; 
				this.isScroll = true
				console.log("onRestore");
			},
			onAbort() { // 中止
				console.log("onAbort");
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
			border-right: 1upx solid #EEEEEE;
			border-bottom: 1upx solid #EEEEEE;
		}
		.navItem:nth-of-type(2){
			border-bottom: 1upx solid #EEEEEE;
		}
		.navItem:nth-of-type(3){
			border-right: 1upx solid #EEEEEE;
			border-bottom: 1upx solid #EEEEEE;
		}
		.navItem:nth-of-type(4){
			border-bottom: 1upx solid #EEEEEE;
		}
		.navItem:nth-of-type(5){
			border-right: 1upx solid #EEEEEE;
			border-bottom: 1upx solid #EEEEEE;
		}
		.navItem:nth-of-type(6){
			border-bottom: 1upx solid #EEEEEE;
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
		height: 50px;
		padding: 0 15px;
		border-bottom: 1upx solid #EEEEEE;
		.minView{
			display: inline-block;
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
			border-bottom: 1upx solid #eee;
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
			border-top: 1upx solid #eee;
			box-sizing: border-box;
			height: 100upx;
			line-height: 100upx;
			text-align: center;
		}
	}
</style>
