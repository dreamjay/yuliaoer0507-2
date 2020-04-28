
<template>
	<view>
		<view>
			<view class="badgeBox">
				<uni-badge :text="badge.sf" type="error" class="shangfen" size="small" ></uni-badge>
				<uni-badge :text="badge.xf" type="error" class="xiafen" size="small" ></uni-badge>
				<uni-badge :text="badge.gd" type="error" class="gudong" size="small" ></uni-badge>
			</view>
			<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" style-type="text" active-color="#4CB964"></uni-segmented-control>
			
			<view class="content">
				
				<view v-if="current === 0">
					<scroll-view
						:scroll-y="true" 
						:style="{height:scrollHei+'px'}"
						:show-scrollbar="true"
						:refresher-enabled="true"
						:refresher-threshold="45"
						refresher-default-style="white"
						refresher-background="#EEEEEE"
						:refresher-triggered="pageSf.triggered"
						@refresherrefresh="onRefreshSf"
						@scrolltolower="refreshBottomSf"
						>
						
						<view v-for="(item,index) in recordsSF" :key="index" class="scrollItem">
							<view >
								<div>
									<image :src="item.headUrl ? item.headUrl : '/static/moren.png'"></image>
									<br>
									<text>{{item.createTime}}</text>
								</div>
							</view>
							<view>
								<text class="fontMax">{{item.nickName}}</text>
								<br>
								<text class="fontMax">群号：{{item.crowdCode}}</text>
								<br>
								<text class="color fontMax">上分{{item.amount}}</text>
								<br>
								<div v-if="item.type == 'wx'">
									<text>微信：</text><text>{{item.wxAccount}}</text><text class="copy" @click="copy(item.wxAccount)">复制</text>
									<br>
									<text>用户名：{{item.wxUsername}}</text>
								</div>
								<div v-if="item.type == 'zfb'">
									<text>支付宝：</text><text>{{item.zfbAccount}}</text><text class="copy" @click="copy(item.zfbAccount)">复制</text>
									<br>
									<text>用户名：{{item.zfbUsername}}</text>
								</div>
								<div v-if="item.type == 'yhk'">
									<text>银行卡：</text><text>{{item.bankCard}}</text><text class="copy" @click="copy(item.bankCard)">复制</text>
									<br>
									<text>{{item.bankName}}</text>
									<text style="margin-left: 10upx;">{{item.bankUsername}}</text>
								</div>
								
							</view>
							<view>
								<div>
									<button style="" type="primary" size="mini" @click="agreeShangfen(item.id,index,1)" v-show="item.status == 0">同意</button>
									<button style="" type="primary" size="mini" @click="agreeShangfen(item.id,index,2)" v-show="item.status == 0">拒绝</button>
									<button style="background-color: #ccc; border: 0; color: #fff;" type="primary" size="mini" :disabled="true" v-if="item.status == 1" >已同意</button>
									<button style="" type="primary" size="mini" :disabled="true" v-if="item.status == 2" >已拒绝</button>
								</div>
							</view>
						</view>
						<uni-load-more :status="pageSf.more"></uni-load-more>
					</scroll-view>
				</view>
				<view v-if="current === 1">
					<scroll-view
						:scroll-y="true" 
						:style="{height:scrollHei+'px'}"
						:show-scrollbar="true"
						:refresher-enabled="true"
						:refresher-threshold="45"
						refresher-default-style="white"
						refresher-background="#EEEEEE"
						:refresher-triggered="pageXf.triggered"
						@refresherrefresh="onRefreshXf"
						@scrolltolower="refreshBottomXf"
						>
						
						<view v-for="(item,index) in recordsXF" :key="index" class="scrollItem">
							<view >
								<div>
									<image :src="item.headUrl ? item.headUrl : '/static/moren.png'"></image>
									<br>
									<text>{{item.createTime}}</text>
								</div>
							</view>
							<view>
								<text class="fontMax">{{item.nickName}}</text>
								<br>
								<text class="fontMax">群号：{{item.crowdCode}}</text>
								<br>
								<text class="color fontMax">下分{{item.amount}}</text>
								<br>
								<div v-if="item.type == 'wx'">
									<text>微信：</text><text>{{item.wxAccount}}</text><text class="copy" @click="copy(item.wxAccount)">复制</text>
									<br>
									<text>用户名：{{item.wxUsername}}</text>
								</div>
								<div v-if="item.type == 'zfb'">
									<text>支付宝：</text><text>{{item.zfbAccount}}</text><text class="copy" @click="copy(item.zfbAccount)">复制</text>
									<br>
									<text>用户名：{{item.zfbUsername}}</text>
								</div>
								<div v-if="item.type == 'yhk'">
									<text>银行卡：</text><text>{{item.bankCard}}</text><text class="copy" @click="copy(item.bankCard)">复制</text>
									<br>
									<text>{{item.bankName}}</text>
									<text style="margin-left: 10upx;">{{item.bankUsername}}</text>
								</div>
								
							</view>
							<view>
								<div>
									<button style="" type="primary" size="mini" @click="agreeXiafen(item.id,index,1)" v-show="item.status == 0">同意</button>
									<button style="" type="primary" size="mini" @click="agreeXiafen(item.id,index,2)" v-show="item.status == 0">拒绝</button>
									<button style="background-color: #ccc; border: 0; color: #fff;" type="primary" size="mini" :disabled="true" v-if="item.status == 1" >已同意</button>
									<button style="" type="primary" size="mini" :disabled="true" v-if="item.status == 2" >已拒绝</button>
								</div>
							</view>
						</view>
						
						<uni-load-more :status="pageXf.more"></uni-load-more>
					</scroll-view>
				</view>
				<view v-if="current === 2">
					<scroll-view
						:scroll-y="true" 
						:style="{height:scrollHei+'px'}"
						:show-scrollbar="true"
						:refresher-enabled="true"
						:refresher-threshold="45"
						refresher-default-style="white"
						refresher-background="#EEEEEE"
						:refresher-triggered="pageGd.triggered"
						@refresherrefresh="onRefreshGd"
						@scrolltolower="refreshBottomGd"
						>
						
						<view v-for="(item,index) in recordsGD" :key="index" class="scrollItem">
							<view >
								<div>
									<image :src="item.headUrl ? item.headUrl : '/static/moren.png'"></image>
									<br>
									<text>{{item.createTime}}</text>
								</div>
							</view>
							<view>
								<text class="fontMax">{{item.nickName}}</text>
								<br>
								<text class="" style="">{{item.content}}</text>
								<br>
								<text>微信：</text><text>{{item.wxAccount}}</text><text class="copy" @click="copy(item.wxAccount)">复制</text>
								<br>
								<text>电话号：</text><text>{{item.phone}}</text><text class="copy" @click="copy(item.phone)">复制</text>
								<br>
								<text>备注：</text><text>{{item.mark}}</text>
								
								
							</view>
							<view>
								<div>
									<button style="" type="primary" size="mini" @click="agreeGudong(item.id,index,1)" v-show="item.status == 0">同意</button>
									<button style="" type="primary" size="mini" @click="agreeGudong(item.id,index,2)" v-show="item.status == 0">拒绝</button>
									<button style="background-color: #ccc; border: 0; color: #fff;" type="primary" size="mini" :disabled="true" v-if="item.status == 1" >已同意</button>
									<button style="" type="primary" size="mini" :disabled="true" v-if="item.status == 2" >已拒绝</button>
								</div>
							</view>
						</view>
						
						
						<uni-load-more :status="pageGd.more"></uni-load-more>
						</scroll-view>
				</view>
			</view>
		</view>
	</view>
</template>


<script>
	import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"
	import uniBadge from "@/components/uni-badge/uni-badge.vue"
	export default {
	    components: {uniSegmentedControl,uniBadge},
	    data() {
	        return {
	            items: ['上分申请','下分申请','股东申请'],
	            current: 0, //nav默认项
				scrollHei:uni.getSystemInfoSync().windowHeight - 60,
			
				recordsSF:[],
				pageSf:{
					pageNo:1,
					pageSize:10,
					totalPage:2,
					reload:false,
					lock: false,
					more:"noMore",
					triggered: false  
				},
				recordsXF:[],
				pageXf:{
					pageNo:1,
					pageSize:10,
					totalPage:2,
					reload:false,
					lock: false,
					more:"noMore",
					triggered: false  
				},
				recordsGD:[],
				pageGd:{
					pageNo:1,
					pageSize:10,
					totalPage:2,
					reload:false,
					lock: false,
					more:"noMore",
					triggered: false  
				},
				
				badge:{ //小红点
					sf:0,
					xf:0,
					gd:0
				}
	        }
	    },
		onLoad() {
			this.pageSf.reload = true;
			this.loadDataSf();
			
			this.pageXf.reload = true;
			this.loadDataXf();
			
			this.pageGd.reload = true;
			this.loadDataGd();
			
			this.httpBadge();
		},
		computed:{
		
		},
		watch:{
		
		},
	    methods: {
			onRefreshSf(){
				if(this.pageSf.lock){
					return;
				}
				this.pageSf.pageNo = 1;
				this.pageSf.reload = true;
				this.pageSf.triggered = true;
				this.loadDataSf();
			},
			refreshBottomSf(){
				if(this.pageSf.lock){
					return;
				}
				if(this.pageSf.pageNo > this.pageSf.totalPage){
					this.pageSf.more="noMore"
					return false;
				}
				this.pageSf.reload = false;
				this.loadDataSf();
			},
			loadDataSf(){
				this.pageSf.lock = true;
				this.pageSf.more = "loading";
				this.$http.httpGetToken('/recharge/list',{
					pageNo:this.pageSf.pageNo,
					pageSize:this.pageSf.pageSize
				},(res)=>{
					this.pageSf.lock = false;
					var list = res.data.records;
					this.recordsSF = this.pageSf.reload ? list : this.recordsSF.concat(list);
					this.pageSf.pageNo = res.data.current;
					this.pageSf.totalPage = res.data.pages;
					if(this.pageSf.pageNo == this.pageSf.totalPage || this.pageSf.totalPage == 0){
						this.pageSf.more="noMore"
					}else{
						this.pageSf.more="more"
					}
					
					this.pageSf.pageNo++;
					this.pageSf.triggered = false;
				},false)
			},
			agreeShangfen(id,index,status){
				var content = (status==1)?'同意':'拒绝'
				var that = this;
				uni.showModal({
				    title: '操作确认',
				    content: content+'上分',
				    success: function (res) {
				        if (res.confirm) {
							var url = (status == 1)? '/push/agree':'/push/reject';
				            that.$http.httpPostTokenPush(url,{
								id:id
							},(res)=>{
								that.recordsSF.find((item,index)=>(item.id==id)).status = status;		
							},true);
						} 
					}
				});
			},
			
			
			onRefreshXf(){
				if(this.pageXf.lock){
					return;
				}
				this.pageXf.pageNo = 1;
				this.pageXf.reload = true;
				this.pageXf.triggered = true;
				this.loadDataXf();
			},
			refreshBottomXf(){
				if(this.pageXf.lock){
					return;
				}
				if(this.pageXf.pageNo > this.pageXf.totalPage){
					this.pageXf.more="noMore"
					return false;
				}
				this.pageXf.reload = false;
				this.loadDataXf();
			},
			loadDataXf(){
				this.pageXf.lock = true;
				this.pageXf.more = "loading";
				this.$http.httpGetToken('/withdraw/list',{
					pageNo:this.pageXf.pageNo,
					pageSize:this.pageXf.pageSize
				},(res)=>{
					this.pageXf.lock = false;
					var list = res.data.records;
					this.recordsXF = this.pageXf.reload ? list : this.recordsXF.concat(list);
					this.pageXf.pageNo = res.data.current;
					this.pageXf.totalPage = res.data.pages;
					if(this.pageXf.pageNo == this.pageXf.totalPage || this.pageXf.totalPage == 0){
						this.pageXf.more="noMore"
					}else{
						this.pageXf.more="more"
					}
					console.log(this.pageXf)
					this.pageXf.pageNo++;
					this.pageXf.triggered = false;
				},false)
			},
			agreeXiafen(id,index,status){
				var content = (status==1)?'同意':'拒绝'
				var that = this;
				uni.showModal({
				    title: '操作确认',
				    content: content+'下分',
				    success: function (res) {
				        if (res.confirm) {
							var url = (status == 1)? '/push/agreeWithdraw':'/push/rejectWithdraw';
				            that.$http.httpPostTokenPush(url,{
								id:id
							},(res)=>{
								that.recordsXF.find((item,index)=>(item.id==id)).status = status;		
							},true);
						} 
					}
				});
			},
			
			
			onRefreshGd(){
				if(this.pageGd.lock){
					return;
				}
				this.pageGd.pageNo = 1;
				this.pageGd.reload = true;
				this.pageGd.triggered = true;
				this.loadDataGd();
			},
			refreshBottomGd(){
				if(this.pageGd.lock){
					return;
				}
				if(this.pageGd.pageNo > this.pageGd.totalPage){
					this.pageGd.more="noMore"
					return false;
				}
				this.pageGd.reload = false;
				this.loadDataGd();
			},
			loadDataGd(){
				this.pageGd.lock = true;
				this.pageGd.more = "loading";
				this.$http.httpGetToken('/shareholder-apply/listByUserId',{
					pageNo:this.pageGd.pageNo,
					pageSize:this.pageGd.pageSize
				},(res)=>{
					this.pageGd.lock = false;
					var list = res.data.records;
					this.recordsGD = this.pageGd.reload ? list : this.recordsGD.concat(list);
					this.pageGd.pageNo = res.data.current;
					this.pageGd.totalPage = res.data.pages;
					if(this.pageGd.pageNo == this.pageGd.totalPage || this.pageGd.totalPage == 0){
						this.pageGd.more="noMore"
					}else{
						this.pageGd.more="more"
					}
					this.pageGd.pageNo++;
					this.pageGd.triggered = false;
				},false)
			},
			agreeGudong(id,index,status){
				var content = (status==1)?'同意':'拒绝'
				var that = this;
				uni.showModal({
				    title: '操作确认',
				    content: content+'申请',
				    success: function (res) {
				        if (res.confirm) {
				            that.$http.httpPostToken("/shareholder-apply/agree",{
								id:id,
								status:status
							},(res)=>{
								that.recordsGD.find((item,index)=>(item.id==id)).status = status;		
							},true);
						} 
					}
				});
			},
			
			httpBadge(){
				this.$http.httpPostToken('/shareholder-apply/statistics',{
					
				},(res)=>{
					this.badge.sf = res.data.rechargeCount? res.data.rechargeCount : 0
					this.badge.xf = res.data.withdrawCount? res.data.withdrawCount : 0
					this.badge.gd = res.data.shareholderCount? res.data.shareholderCount : 0
				},false)
			},
			
			onClickItem(e,index) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex;
				}
				
			},
			copy(msg){
				if(!msg)return
				// #ifdef APP-PLUS
					uni.setClipboardData({
						data: msg,
						success: function () {
							uni.showToast({
								title:'复制成功',
								icon:'none'
							})
							
						}
					});
				// #endif
			},
		}
	}
</script>

<style lang="scss">
	.badgeBox{
		position: absolute;
		height: 50px;
		top: 0;
		left: 0;
		.shangfen{
			position: absolute;
			width: 50upx!important;
			height: 50upx!important;
			line-height: 50upx;
			border-radius: 25upx!important;
			z-index: 9;
			padding: 0;
			left: 180upx;
			top: 6upx;
		}
		.xiafen{
			position: absolute;
			width: 50upx!important;
			height: 50upx!important;
			line-height: 50upx;
			border-radius: 25upx!important;
			z-index: 9;
			padding: 0;
			left: 430upx;
			top: 6upx;
		}
		.gudong{
			position: absolute;
			width: 50upx!important;
			height: 50upx!important;
			line-height: 50upx;
			border-radius: 25upx!important;
			z-index: 9;
			padding: 0;
			left: 680upx;
			top: 6upx;
		}
	}
	.segmented-control{
		height: 100upx !important;
		background-color: #EEEEEE;
		border-bottom: 1px solid #ddd;
	}
	.scrollItem{
		height: 200upx;
		background-color: #FFFFFF;
		border-bottom: 1upx solid #ddd;
		// line-height: 300upx;
		padding: 30upx 30upx 30upx 30upx;
		view:nth-of-type(1){
			display: inline-block;
			vertical-align: middle;
			position: relative;
			width: 150upx;
			height: 200upx;
			div{
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				image{
					height: 90upx;
					width: 90upx;
					border-radius: 5px;
				}
				text{
					font-size: 10px;
					color: #999;
				}
			}
			
		}
		view:nth-of-type(2){
			display: inline-block;
			width: 440upx;
			vertical-align: middle;
			height: 200upx;
			font-size: 12px;
			text{
				line-height: 40upx;
				height: 40upx;
				display: inline-block;
				
			}
			.fontMax{
				font-size: 14px;
			}
			.color{
				color: #4CB964;
			}
			.copy{
				color: #999;
				text-decoration:underline;
				margin-left: 15upx;
			}
		}
		view:nth-of-type(3){
			position: relative;
			float: right;
			vertical-align: middle;
			display: inline-block;
			width: 100upx;
			height: 200upx;
			div{
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				button{
					padding: 0;
					width: 100upx;
					line-height: 50upx;
					height: 50upx;
					float: right;
					margin-bottom: 20upx;
				}
				button:first-of-type{
					background-color: #4CB964;
					
				}
				button:last-of-type{
					background-color: #dd524d;
					
				}
			}
			
		}
	}
</style>
