
<template>
	<view>
		<Loading v-if="isLoading"></Loading>
		<view v-if="!isLoading">
			<view class="badgeBox">
				<uni-badge :text="badge.sf" type="error" class="shangfen" size="small" ></uni-badge>
				<uni-badge :text="badge.xf" type="error" class="xiafen" size="small" ></uni-badge>
				<uni-badge :text="badge.gd" type="error" class="gudong" size="small" ></uni-badge>
			</view>
			
			<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" style-type="text" active-color="#4CB964"></uni-segmented-control>
			<view class="content">
				
				<view v-if="current === 0">
					<scroll-view
						:scroll-y="isScroll" 
						:style="{height:scrollHei+'px'}"
						:refresher-enabled="isActive"
						:refresher-threshold="80"
						refresher-default-style="white"
						@scroll="scroll"
						@scrolltoupper="scrolltoupper"
						refresher-background="#EEEEEE"
						:refresher-triggered="triggered"
						@refresherpulling="onPulling"
						@refresherrefresh="onRefresh"
						@refresherrestore="onRestore"
						@refresherabort="onAbort"
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
									<button style="" type="primary" size="mini" @click="tongyiSF(index)" v-show="item.status != 2">同意</button>
									<button style="" type="primary" size="mini" @click="jujueSF(index)" v-show="item.status != 2">拒绝</button>
									<button style="" type="primary" size="mini" :disabled="true" v-if="item.status == 2" >已拒绝</button>
								</div>
							</view>
						</view>
					</scroll-view>
					
				</view>
				<view v-if="current === 1">
					<scroll-view
						:scroll-y="isScroll" 
						:style="{height:scrollHei+'px'}"
						:refresher-enabled="isActive"
						:refresher-threshold="80"
						refresher-default-style="white"
						@scroll="scroll"
						@scrolltoupper="scrolltoupper"
						refresher-background="#EEEEEE"
						:refresher-triggered="triggered"
						@refresherpulling="onPulling"
						@refresherrefresh="onRefresh"
						@refresherrestore="onRestore"
						@refresherabort="onAbort"
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
									<button style="" type="primary" size="mini" @click="tongyiXF(index)" v-show="item.status != 2">同意</button>
									<button style="" type="primary" size="mini" @click="jujueXF(index)" v-show="item.status != 2">拒绝</button>
									<button style="" type="primary" size="mini" :disabled="true" v-if="item.status == 2" >已拒绝</button>
								</div>
							</view>
						</view>
					</scroll-view>
				</view>
				<view v-if="current === 2">
					<scroll-view
						:scroll-y="isScroll" 
						:style="{height:scrollHei+'px'}"
						:refresher-enabled="isActive"
						:refresher-threshold="80"
						refresher-default-style="white"
						@scroll="scroll"
						@scrolltoupper="scrolltoupper"
						refresher-background="#EEEEEE"
						:refresher-triggered="triggered"
						@refresherpulling="onPulling"
						@refresherrefresh="onRefresh"
						@refresherrestore="onRestore"
						@refresherabort="onAbort"
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
									<button style="" type="primary" size="mini" @click="tongyiGD(index)" v-show="item.status != 2">同意</button>
									<button style="" type="primary" size="mini" @click="jujueGD(index)" v-show="item.status != 2">拒绝</button>
									<button style="" type="primary" size="mini" :disabled="true" v-if="item.status == 2" >已拒绝</button>
								</div>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
	</view>
</template>


<script>
	import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"
	import uniBadge from "@/components/uni-badge/uni-badge.vue"
	import Loading from '@/components/loading/loading.vue'
	export default {
	    components: {uniSegmentedControl,uniBadge,Loading},
	    data() {
	        return {
	            items: ['上分申请','下分申请','股东申请'],
	            current: 0, //nav默认项
				scrollHei:uni.getSystemInfoSync().windowHeight - 50,
				triggered:true,
				is_freshing:false,//
				isScroll:true,
				isActive:true,
				recordsSF:[],
				dataSF:{}, 
				pageIndexSF:1 ,// 上拉初始页
				recordsXF:[],
				dataXF:{}, 
				pageIndexXF:1 ,// 上拉初始页
				recordsGD:[],
				dataGD:{}, 
				pageIndexGD:1 ,// 上拉初始页
				pageTotal:3,
				initHttpTotal:4,
				badge:{ //小红点
					sf:0,
					xf:0,
					gd:0
				}
	        }
	    },
		onLoad() {
			this.httpSF()
			this.httpXF()
			this.httpGD()
			this.httpBadge()
			this.$store.commit('watchLoading', true)
		},
		computed:{
			isLoading:function(){
				return this.$store.state.isLoading
			}
		},
		watch:{
			initHttpTotal(newV){
				if(newV <= 0){
					this.$store.commit('watchLoading', false)
				}
			}
		},
	    methods: {
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
			httpBadge(){
				this.$http.httpTokenRequest({
					url: '/shareholder-apply/statistics',
					method: 'post'
				}, {}).then(res => {
					this.initHttpTotal--
					if(res.data.success){
						this.badge.sf = res.data.data.rechargeCount? res.data.data.rechargeCount : 0
						this.badge.xf = res.data.data.withdrawCount? res.data.data.withdrawCount : 0
						this.badge.gd = res.data.data.shareholderCount? res.data.data.shareholderCount : 0
						
					}else{
						uni.showToast({
							title:res.data.msg,
							icon:'none'
						})
					}
				},error => {
					uni.showToast({
						title:'错误'+error,
						icon:'none'
					})
				})
			},
			tongyiSXF(index,url){ //同意拒绝上下分
				this.$http.httpTokenRequest({
					url: url,
					method: 'post'
				}, {
					id:this.recordsSF[index].id,
					msg:true
				}).then(res => {
					if(res.data.success){
						if(url == '/push/agree'){//同意上分
							this.badge.sf--
							this.recordsSF = this.recordsSF.filter((item,indexx)=>(indexx!=index))
						}
						if(url == '/push/reject'){//拒绝上分
							this.recordsSF.find((item,indexx)=>(indexx==index)).status = 2
						}
						if(url == '/push/agreeWithdraw'){//同意下分
							this.badge.xf--
							this.recordsXF = this.recordsXF.filter((item,indexx)=>(indexx!=index))
						}
						if(url == '/push/rejectWithdraw'){//拒绝下分
							this.recordsXF.find((item,indexx)=>(indexx==index)).status = 2
						}
						
						console.log('同意或拒绝上下分成功')
					}else{
						uni.showToast({
							title:res.data.msg,
							icon:'none'
						})
					}
				},error => {
					uni.showToast({
						title:'错误'+error,
						icon:'none'
					})
				})
			},
			tongyiOrJujueGD(index,status,url){ //同意拒绝股东
				this.$http.httpTokenRequest({
					url: url,
					method: 'post'
				}, {
					id:this.recordsGD[index].id,
					status:status,
					
				}).then(res => {
					if(res.data.success){
						if(status == 1){//同意股东
							this.badge.gd--
							this.recordsGD = this.recordsGD.filter((item,indexx)=>(indexx!=index))
						}
						if(status == 2){//拒绝股东
							this.recordsGD.find((item,indexx)=>(indexx==index)).status = 2
						}
						console.log('同意或拒绝股东成功')
					}else{
						uni.showToast({
							title:res.data.msg,
							icon:'none'
						})
					}
				},error => {
					uni.showToast({
						title:'错误'+error,
						icon:'none'
					})
				})
			},
			tongyiXF(index){
				uni.showModal({
					title:"询问",
					content:"同意 "+this.recordsXF[index].nickName+" 下分？",
					success:  (res)=> {
						if (res.confirm) {
							this.tongyiSXF(index,'/push/agreeWithdraw')
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
				
			},
			jujueXF(index){
				uni.showModal({
					title:"询问",
					content:"拒绝 "+this.recordsXF[index].nickName+" 下分？",
					success:  (res)=> {
						if (res.confirm) {
							this.tongyiSXF(index,'/push/rejectWithdraw')
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
				
			},
			tongyiSF(index){
				uni.showModal({
					title:"询问",
					content:"同意 "+this.recordsSF[index].nickName+" 上分？",
					success:  (res)=> {
						if (res.confirm) {
							this.tongyiSXF(index,'/push/agree')
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
				
			},
			jujueSF(index){
				uni.showModal({
					title:"询问",
					content:"拒绝 "+this.recordsSF[index].nickName+" 上分？",
					success:  (res)=> {
						if (res.confirm) {
							this.tongyiSXF(index,'/push/reject')
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
				
			},
			tongyiGD(index){
				uni.showModal({
					title:"询问",
					content:"同意 "+this.recordsGD[index].nickName+" 申请股东？",
					success:  (res)=> {
						if (res.confirm) {
							this.tongyiOrJujueGD(index,1,'/shareholder-apply/agree')
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
				
			},
			jujueGD(index){
				uni.showModal({
					title:"询问",
					content:"拒绝 "+this.recordsGD[index].nickName+" 申请股东？",
					success:  (res)=> {
						if (res.confirm) {
							this.tongyiOrJujueGD(index,2,'/shareholder-apply/agree')
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
				
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
			handleDataSFXF(arr){
				arr.forEach((item)=>{
					item.createTime = item.createTime.slice(5,item.createTime.length-3)
					if(item.wxAccount){
						item.type = 'wx'
					} else if(item.zfbAccount){
						item.type = 'zfb'
					} else{
						item.type = 'yhk'
					}
				})
				return arr
			},
			httpSF(is){
				if(is){//下拉
					if(this.dataSF.current >= this.dataSF.pages){
						uni.showToast({
							title:'没有更多数据了',
							icon:'none'
						})
						this.triggered = false;
						this.is_freshing = false;
						return
					}
					this.pageIndexSF++
					
				}
				this.$http.httpTokenRequest({
					url: '/recharge/list',
					method: 'get'
				}, {
					pageNo:this.pageIndexSF,
					pageSize:this.pageTotal
				}).then(res => {
					if(res.data.success){
						if(this.pageIndexSF>1){
							this.triggered = false;
							this.is_freshing = false;
						}else{
							this.initHttpTotal--
						}
						
						this.dataSF = res.data.data
						this.recordsSF = this.handleDataSFXF(res.data.data.records).concat(this.recordsSF)
						// console.log(res.data.data,this.recordsSF)
					}else{
						uni.showToast({
							title:res.data.msg,
							icon:'none'
						})
					}
				},error => {
					uni.showToast({
						title:'错误'+error,
						icon:'none'
					})
				})
			},
			httpXF(is){
				if(is){//下拉
					if(this.dataXF.current >= this.dataXF.pages){
						uni.showToast({
							title:'没有更多数据了',
							icon:'none'
						})
						this.triggered = false;
						this.is_freshing = false;
						return
					}
					this.pageIndexXF++
					
				}
				this.$http.httpTokenRequest({
					url: '/withdraw/list',
					method: 'get'
				}, {
					pageNo:this.pageIndexXF,
					pageSize:this.pageTotal
				}).then(res => {
					if(res.data.success){
						if(this.pageIndexXF>1){
							this.triggered = false;
							this.is_freshing = false;
						}else{
							this.initHttpTotal--
						}
						
						this.dataXF = res.data.data
						this.recordsXF = this.handleDataSFXF(res.data.data.records).concat(this.recordsXF)
						// console.log(res.data.data,this.recordsSF)
					}else{
						uni.showToast({
							title:res.data.msg,
							icon:'none'
						})
					}
				},error => {
					uni.showToast({
						title:'错误'+error,
						icon:'none'
					})
				})
			},
			httpGD(is){
				if(is){//下拉
					if(this.dataGD.current >= this.dataGD.pages){
						uni.showToast({
							title:'没有更多数据了',
							icon:'none'
						})
						this.triggered = false;
						this.is_freshing = false;
						return
					}
					this.pageIndexGD++
					
				}
				this.$http.httpTokenRequest({
					url: '/shareholder-apply/listByUserId',
					method: 'get'
				}, {
					pageNo:this.pageIndexGD,
					pageSize:this.pageTotal
				}).then(res => {
					if(res.data.success){
						if(this.pageIndexGD>1){
							this.triggered = false;
							this.is_freshing = false;
						}else{
							this.initHttpTotal--
						}
						
						this.dataGD = res.data.data
						res.data.data.records.forEach(item=>{
							item.createTime = item.createTime.slice(5,item.createTime.length-3)
						})
						this.recordsGD = res.data.data.records.concat(this.recordsGD)
						
						// console.log('股东',this.recordsGD)
					}else{
						uni.showToast({
							title:res.data.msg,
							icon:'none'
						})
					}
				},error => {
					uni.showToast({
						title:'错误'+error,
						icon:'none'
					})
				})
			},
			onPulling(e) { //下拉
				// console.log("onpulling", e);
				
			},
			onRefresh() { //触发下拉
				// console.log("触发下拉",this.is_freshing)
				this.isScroll = false
				if (this.is_freshing) return;
				this.is_freshing = true;
				switch(this.current){
					case 0:{ this.httpSF(true);break}
					case 1:{ this.httpXF(true);break}
					case 2:{ this.httpGD(true);break}
				}
				
				
			},
			onRestore() { // 需要重置
				this.triggered = 'restore'; 
				this.isScroll = true
				// console.log("onRestore");
			},
			onAbort() { // 中止
				// console.log("onAbort");
			},
	        onClickItem(e,index) {
	            if (this.current !== e.currentIndex) {
	                this.current = e.currentIndex;
	            }
	        }
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
		background-color: #eee;
		border-bottom: 1upx solid #ddd;
		// line-height: 300upx;
		padding: 70upx 30upx 30upx 30upx;
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
