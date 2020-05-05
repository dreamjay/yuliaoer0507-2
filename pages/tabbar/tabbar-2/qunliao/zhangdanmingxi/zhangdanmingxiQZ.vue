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
		<view class="title" v-if="!isGudongXiaji">
			<text>{{classList[classIndex]}}</text>
			<text class="red">累计：{{totalAmount}}</text>
		</view>
		
		<view class="title" v-if="isGudongXiaji">
			<text>股东下级盈亏</text>
			<text class="red">累计：{{totalAmount2}}</text>
			
		</view>
		<view class="title" v-if="isGudongXiaji">
			<text>返福利之后下级总盈亏</text>
			<text class="red">累计：{{totalAmount3}}</text>
			
		</view>
		
		
		<view>
			<view v-if="!isYufen && !isJinriyingkui && !isGudongXiaji " v-for="(item,index) in dataList" :key="index" class="scrollItem">
				<view class="minView">
					<text>{{item.mark}}</text>
					<text>{{item.createTime}}</text>
				</view>
				<view class="right">
					<text>{{item.flag}}{{item.tradeAmount}}</text>
				</view>
			</view>
			
			<view v-if="isYufen" v-for="(item,index) in dataList" :key="index" class="scrollItem">
				<view class="minView">
					<text>{{item.nickName}}</text>
					<text>{{ convertRole(item.role) }}</text>
				</view>
				<view class="right">
					<text>{{item.blance.toFixed(2)}}积分</text>
				</view>
			</view>
			
			<view v-if="isJinriyingkui"  class="scrollItem">
				<view class="minView">
					<text>总盈亏</text>
					<text>{{start_time}}至{{end_time}}</text>
				</view>
				<view class="right">
					<text>{{yingkui}}积分</text>
				</view>
			</view>
			
			
			<view v-if="isGudongXiaji" v-for="(item,index) in dataList2" :key="index"  class="scrollItem2">
				<view class="s_head">
					<view><org-image :css="'s_img'" :src="item.headUrl"></org-image></view>
					<view class="s_center"><text>{{item.nickName}}</text></view>
					<view class="s_text" @tap="toInfo(item.userId,item.crowdId)"><text>查看顾客收益 ></text></view>
				</view>
				
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
							免死号抢号：{{item.miansiAmount.toFixed(2)}} X {{(item.bili * 100).toFixed(2)}}% = {{(item.miansiAmount * item.bili).toFixed(2)}}
				</view>
				
				<view class="body2" style="color: #4CD964;">
							流水({{(item.fabaoAmount * redRebate * item.bili).toFixed(2)}}) + 福利({{(item.zhongJiangReturnAmount* item.bili).toFixed(2)}}} + 上级返({{(item.tuijianReturnAmount * item.bili).toFixed(2)}}) = {{((item.zhongJiangReturnAmount + item.tuijianReturnAmount + item.fabaoAmount * redRebate)*item.bili).toFixed(2)}}
				</view>
				
				
				<view class="body2" style="color: #007AFF;">
							股东收益：{{((item.miansiAmount - item.zhongJiangReturnAmount - item.tuijianReturnAmount - item.fabaoAmount * redRebate)*item.bili).toFixed(2)}}
				</view>
				
				<view class="body" >
						<view>
						  调整赚取点数
						  </view>
							 <view>
								 <input type="number" :id="index" @input="changeBili" style="width: 100rpx;text-align: center;border-bottom: 1px solid #333333;" :value="item.bili * 100"/>
							</view>%
							
						 <view>	
							<button type="primary" class="" size="mini" @click="okBili(index,item.userId,item.crowdId)">确定</button>
						</view>
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
	import orgImage from '@/components/org-image/org-image';
	export default {
	    components: {uniPopup,uniLoadMore,orgImage},
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
				totalAmount2:'-',
				totalAmount3:'-',
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
				dataList:[],
				dataList2:[],
				start_time:'',
				end_time:'',
				yingkui:0,
				isYufen:false,
				isJinriyingkui:false,
				isGudongXiaji:false,
				redRebate:0,
				dataBili:[]
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
			this.redRebate = Number(option.redRebate);
			
			
			
			
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
				
				
				
				this.isGudongXiaji = false;
				this.isJinriyingkui = false;
				this.isYufen = false;
				
				
				if(tradeType == 'GU_KE'){
					this.dataList = [];
					this.isYufen = true;
					// 这是顾客余分
					this.$http.httpGetToken("/crowd-account-trade-record/pageByYuFen",{
						crowdId:this.crowdId,
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
					
					this.$http.httpGetToken("/crowd-account-trade-record/pageByYuFenSum",{
						crowdId:this.crowdId
					},(res)=>{
						this.totalAmount = Number(res.data).toFixed(2);
					},false)
					
					
					return;
				}
				
				// 今日盈亏
				if(tradeType == 'JIN_RI_YING_KUI'){
					this.isJinriyingkui = true;
					this.start_time = this.defaultYearS + "-" + this.defaultMonthS + "-" + this.defaultDayS;
					this.end_time = this.defaultYearE + "-" + this.defaultMonthE + "-" + this.defaultDayE;
					
					this.$http.httpGetToken("/crowd-account-trade-record/qunzhuYingKui",{
						crowdId:this.crowdId,
						startTime:startTime,
						endTime:endTime
					},(res)=>{
						console.log(res.data)
						this.yingkui = Number(res.data).toFixed(2);
						this.totalAmount = Number(res.data).toFixed(2);
						uni.stopPullDownRefresh();
						this.more="noMore"
					},false)
					
					return;
				}
				
				
				
				if(tradeType == 'GUDONG_XIA_JI'){
					this.isGudongXiaji = true;
					this.$http.httpGetToken("/crowd-account-trade-record/gudongList",{
						crowdId:this.crowdId,
						startTime:startTime,
						endTime:endTime,
					},(res)=>{
						this.lock = false;
						var list = res.data;
						this.dataList2 = list;
						var a = 0;
						var b = 0;
						for(var i=0;i<list.length;i++){
							 var item = list[i];
							 a = a + Number(( item.gradBaoAmount + item.redReturnAmount + item.gradBaoReturnAmount  - item.fabaoAmount - item.zhongleiAmount  ).toFixed(2));
							 b = b + Number(( item.gradBaoAmount + item.redReturnAmount + item.gradBaoReturnAmount + item.zhongJiangReturnAmount + item.tuijianReturnAmount + item.fabaoAmount * this.redRebate  - item.fabaoAmount - item.zhongleiAmount  ).toFixed(2));
						
						}
						this.totalAmount2 = a.toFixed(2);
						this.totalAmount3 = b.toFixed(2);
						console.log(list)
						this.more="noMore"
						uni.stopPullDownRefresh();
					},false)
					
					return;
				}
				
				
				
				
				
				
				
				
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
					this.totalAmount = Number(res.data).toFixed(2);
				},false)
				
				
				
				
				
			},
			
			toInfo(userId,crowdId){
				
				
				var sMonth =Number(this.defaultMonthS) < 10?"0"+this.defaultMonthS:this.defaultMonthS;
				var Sday = Number(this.defaultDayS) < 10?"0"+this.defaultDayS:this.defaultDayS;
				
				var eMonth =Number(this.defaultMonthE) < 10?"0"+this.defaultMonthE:this.defaultMonthE;
				var da = Number(this.defaultDayE) + 1;
				var eday = da < 10?"0"+ da : da;
				
				var startTime = this.defaultYearS+'-'+sMonth+"-"+Sday + " 00:00:00";
				var endTime = this.defaultYearE+'-'+eMonth+"-"+eday + " 00:00:00";
				console.log("查看顾客详情,",userId)
				uni.navigateTo({
					url:"./guke?userId="+userId+"&crowdId="+crowdId + '&startTime='+ startTime + "&endTime="+endTime + "&redRebate=" + this.redRebate
				})
			},
			
			loadAmount(){
				
			},
			okBili(index,userId,crowdId){
				var bili = this.dataList2[index].bili;
				if(Number(bili)  < 0 || Number(bili) > 1){
					uni.showToast({
						icon:"none",
						title:"股东占比只能是0~100"
					})
					return;
				}
				
				this.$http.httpPostToken('/shareholder-apply/updateBili',{
					crowdId:crowdId,
					userId:userId,
					bili:bili
				},(res) =>{
					uni.showToast({
						icon:"none",
						title:"修改成功"
					})
				},true)
				
			},
			changeBili(e){
				if(e.detail.value){
					var index = Number(e.currentTarget.id);
				  this.dataList2[index].bili = Number(e.detail.value) / 100;
				}
					console.log(e)
		
			},
			today(){
				this.$http.httpGetToken("/crowd-account-trade-record/qunzhuToday",{
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
			convertRole(role){
				
				switch(role){
					case 'GU_KE':
						return "顾客";
					case 'QUN_ZHU':
						return "群主";
					case 'CAI_WU':
						return "财务";
					case 'MIAN_SI':
						return "免死";
					case 'GU_DONG':
						return "股东";
					case 'KE_FU':
						return "客服";
				
				}
				return "";
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
	
	
.scrollItem2{
	display: flex;
	padding:  15px;
	border-bottom: 1px solid #EEEEEE;
	flex-direction: column;
	
	
	
}	
.s_head{
	height: 40px;
	display: flex;

}
.s_img{
	margin-top: 8px;
	width: 24px;
	height: 24px;
}
.s_center{
	flex: 1;
	padding-left: 10px;
	line-height: 40px;
}
.s_text{
	width: 200rpx;
	font-size: 12px;
	color: #999999;
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
