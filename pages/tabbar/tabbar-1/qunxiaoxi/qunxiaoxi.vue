
<template>
	<view>
		<Loading v-if="isLoading"></Loading>
		<view v-if="!isLoading">
			<view class="content">
				<scroll-view
					:scroll-y="isScroll" 
					:style="{height:scrollHei+'px'}"
					:refresher-enabled="isActive"
					:refresher-threshold="80"
					refresher-default-style="white"
					@scroll="scroll"
					@scrolltoupper="scrolltoupper"
					refresher-background="#ddd"
					:refresher-triggered="triggered"
					@refresherpulling="onPulling"
					@refresherrefresh="onRefresh"
					@refresherrestore="onRestore"
					@refresherabort="onAbort"
					>
					
					<view v-for="(item,index) in recordsSQ" :key="index" class="scrollItem">
						<view class="time"><text >{{item.createTime}}</text></view>
						<view class="content">
							<view >
								<div>
									<image :src="item.headUrl ? item.headUrl : '/static/moren.png'"></image>
								</div>
							</view>
							<view>
								<text class="">{{item.content}}</text>
							</view>
							<view>
								<div>
									<button style="" type="primary" size="mini" @click="tongyiSQ(index)" v-show="item.status == 0">同意</button>
									<button style="" type="primary" size="mini" @click="jujueSQ(index)" v-show="item.status == 0">拒绝</button>
									<button style="background-color: #ccc; border: 0; color: #fff;" type="primary" size="mini" :disabled="true" v-if="item.status == 1" >已同意</button>
									<button style="" type="primary" size="mini" :disabled="true" v-if="item.status == 2" >已拒绝</button>
								</div>
							</view>
						</view>
					</view>
				</scroll-view>
					
			</view>
		</view>
	</view>
</template>


<script>
	import Loading from '@/components/loading/loading.vue'
	export default {
	    components: {Loading},
	    data() {
	        return {
	            
				scrollHei:uni.getSystemInfoSync().windowHeight,
				triggered:true,
				is_freshing:false,//
				isScroll:true,
				isActive:true,
				recordsSQ:[],
				dataSQ:{}, 
				pageIndexSQ:1 ,// 上拉初始页
				pageTotal:4,
				initHttpTotal:1,
				
	        }
	    },
		onLoad() {
			this.httpSQ()
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
			tongyiOrJujueSQ(index,status,url){ //同意拒绝
				this.$http.httpTokenRequest({
					url: url,
					method: 'post'
				}, {
					id:this.recordsSQ[index].id,
					status:status,
					
				}).then(res => {
					if(res.data.success){
						if(status == 1){//同意
							this.recordsSQ.find((item,indexx)=>(indexx==index)).status = 1
						}
						if(status == 2){//拒绝
							this.recordsSQ.find((item,indexx)=>(indexx==index)).status = 2
						}
						console.log('同意或拒绝加群成功')
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
			
			tongyiSQ(index){
				this.tongyiOrJujueSQ(index,1,'/crowd-join-record/agree')
			},
			jujueSQ(index){
				this.tongyiOrJujueSQ(index,2,'/crowd-join-record/agree')
			},
			httpSQ(is){
				if(is){//下拉
					if(this.dataSQ.current >= this.dataSQ.pages){
						uni.showToast({
							title:'没有更多数据了',
							icon:'none'
						})
						this.triggered = false;
						this.is_freshing = false;
						return
					}
					this.pageIndexSQ++
					
				}
				this.$http.httpTokenRequest({
					url: '/crowd-join-record/page',
					method: 'get'
				}, {
					pageNo:this.pageIndexSQ,
					pageSize:this.pageTotal
				}).then(res => {
					if(res.data.success){
						if(this.pageIndexSQ>1){
							this.triggered = false;
							this.is_freshing = false;
						}else{
							this.initHttpTotal--
						}
						
						this.dataSQ = res.data.data
						this.recordsSQ = res.data.data.records.concat(this.recordsSQ)
						
						// console.log('股东',this.recordsSQ)
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
				// console.log("触发下拉",this.is_freshing,this.triggered)
				if (this.is_freshing) return;
				this.isScroll = false
				this.is_freshing = true;
				this.httpSQ(true)
				
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
	page{
		background-color: #EEEEEE;
	}
	.scrollItem{
		height: 230upx;
		background-color: #eee;
		// border-bottom: 1upx solid #ddd;
		// line-height: 300upx;
		padding: 30upx 30upx 30upx 30upx;
		.time{
			text-align: center;
			margin-bottom: 20upx;
			text{
				display: inline-block;
				padding: 10upx 30upx;
				border-radius: 5px;
				background-color: #ddd;
				color: #fff;
				font-size: 12px;
			}
		}
		.content{
			width: 650upx;
			height: 120upx;
			padding: 20upx;
			background-color: #fff;
			border-radius: 5px;
			view:nth-of-type(1){
				display: inline-block;
				vertical-align: middle;
				position: relative;
				width: 120upx;
				height: 120upx;
				div{
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
					image{
						height: 90upx;
						width: 90upx;
						border-radius: 5px;
						vertical-align: middle;
					}
					text{
						font-size: 10px;
						color: #999;
					}
				}
				
			}
			view:nth-of-type(2){
				display: inline-block;
				width: 420upx;
				padding-right: 10upx;
				vertical-align: middle;
				height: 120upx;
				font-size: 12px;
				text{
					color: #999;
					margin-top: 20upx;
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
				height: 120upx;
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
						margin-bottom: 0;
					}
				}
			}
		}
	}
</style>
