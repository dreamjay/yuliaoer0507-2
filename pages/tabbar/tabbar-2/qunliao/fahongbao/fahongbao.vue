<template>
	<view class="box">
		<view class="inputItem">
			<text>总金额</text>
			<view class="right">
				<input type="number" placeholder="0.00" v-model="money">
				<text>元</text>
			</view>
		</view>
		<view class="inputItem hintBox">
			<text class="hint">红包发布范围：{{this.crowdInfo.redMinAmount}}~{{this.crowdInfo.redMaxAmount}}元</text>
		</view>
		<view class="inputItem">
			<text>红包个数</text>
			<view class="right">
				<input type="number"  :disabled="true" :value="crowdInfo.redCount">
				<text>个</text>
			</view>
		</view>
		<view class="inputItem" style="margin-top: 40upx;">
			<text>雷数</text>
			<view class="right">
				<input type="number" :placeholder="crowdInfo.playerType=='SAO_LEI'?'请输入单雷':'请输入多雷,例：123'" :maxlength="crowdInfo.playerType=='SAO_LEI'?1:4" v-model="lei">
				<!-- <text>个</text> -->
			</view>
		</view>
		<view class="inputItem hintBox">
			<text class="hint">单个雷数存在0到9</text>
		</view>
		<h1 class="boldMoney">￥{{money ? (Number(money)).toFixed(2) : '0.00'}}</h1>
		
		<button @click="hbActive" style="background-color:#F35543; width: 690upx; margin-top:40upx ;" type="primary">塞钱进红包</button>
		<p style="text-align: center; line-height: 80upx; font-size: 12px; color: #999;">未领取的红包，将于{{crowdInfo.redInavlidTime}}分钟后发起退款</p>
		
		<view style="text-align: center;">
			<image src="/static/liaotian/icon_jg.png" style="width: 20upx; height:20upx; vertical-align: unset;"></image>
			<text style="display: inline-block; width: 300upx; vertical-align: top; font-size: 12px; color:#666; margin-left: 10upx;">本平台纯属娱乐禁止赌博！如有被骗与平台一律无关！</text>
		</view>
		
		<!-- 隐藏的用来自动聚焦 -->
		<input style="position: absolute; left: -999px; top: 0;" :focus="focus" v-if="value" v-model="password" type="number" :maxlength="6" @blur="blur">
		<chunLei-modal v-model="value" :mData="data" :type="type" :navHeight="height" :tabbarHeight="0" :maskEnable="false">
			
			<view class="custom-view" @tap.stop>
				<view class="hongbao" style="text-align: center;">
					<image class="close" src="/static/liaotian/icon_finish.png" @click="close"></image>
					<text style="">请输入支付密码</text>
					<br>
					<text style="font-size: 50upx; font-weight: bold; position: absolute; top: 180upx; left: 50%; transform: translateX(-50%);">￥{{money ? (Number(money)).toFixed(2) : '0.00'}}</text>
					<view class="mark" @touchend.prevent="markClick">
						<view v-for="(item,index) in 6" :key="index" :class="password && (index + 1) <= password.length ?'active':null"></view>
					</view>
				</view>
				
			</view>
		</chunLei-modal>
	</view>
</template>

<script>
	import chunLeiModal from '@/components/chunLei-modal/chunLei-modal.vue'
	export default{
		components: {chunLeiModal},
		data(){
			return{
				data:{},
				value:false,
				type:'custom',
				height:0, //状态栏加导航栏的高度
				money:'',
				hbCount:7,
				lei:'',
				userInfo:null,
				crowdInfo:null,
				token:null,
				password:null, //支付密码
				focus: true, //支付密码聚焦状态
			}
		},
		watch:{
			money(newV){
				if(String(newV).indexOf(".") != -1 && String(newV).indexOf(".") == String(newV).length-4){
					this.money = Number(String(newV).slice(0,-1))
				}
			},
			password(newV){
				if(String(newV).length == 6){
					this.fahongbao()
					
				}
			}
		},
		onLoad(option) {
			this.userInfo = uni.getStorageSync('userInfo')
			this.token = this.userInfo.token
			this.crowdInfo = JSON.parse(option.crowdInfo)
			uni.$on('updateUserInfo',(data)=>{ //设置了支付密码更新用户信息
				this.userInfo.payPassword = data;
				uni.setStorageSync('userInfo',this.userInfo);
			})
			uni.getSystemInfo({
			    success: (e) => {
			      
			      // #ifdef APP-PLUS
			      // console.log('app-plus', e)
			      
			      this.height = e.statusBarHeight + 44
			      // #endif
				}
			})
		},
		onBackPress(e){
			if(this.value){ //模态框打开了，先关掉在返回
				if(e.from == 'backbutton') {//实体键
					this.value = false
					// setTimeout(()=>{
					// 	uni.navigateBack({})
					// },10)
					return true
				}
				if(e.from == 'navigateBack'){
					return false
				}
			} else{
				return false
			}
		},
		methods:{
			close(){
				this.password = null;
				this.value = false;
				this.focus = false
			},
			blur(){
				this.focus = false
			},
			markClick(){
				if(this.value){
					this.focus = true
				}
			},
			fahongbao(){
				
				this.value = false
				this.$http.httpPostTokenPush('/push/fabao',{
					amount:this.money,
					boomNum:this.lei,
					crowdId:this.crowdInfo.crowdId,
					payPassword:this.password
				},(res)=>{
					uni.$emit("fahongbao",{
						lei:this.lei,
						money:this.money,
						hbCount:this.hbCount
					})
					uni.navigateBack({})
				},true)
			},
			hbActive(){
				if(!this.money){
					uni.showToast({
						title:"红包金额不能是空",
						icon:'none'
					})
					return
				}
				
				if(Number(this.money) < this.crowdInfo.redMinAmount){
					uni.showToast({
						title:"红包金额不能小于"+this.crowdInfo.redMinAmount,
						icon:'none'
					})
					return
				}
				if(Number(this.money) > this.crowdInfo.redMaxAmount){
					uni.showToast({
						title:"红包金额不能大于"+this.crowdInfo.redMaxAmount,
						icon:'none'
					})
					return
				}
				
				if(!this.lei){
					uni.showToast({
						title:"雷不能是空",
						icon:'none'
					})
					return
				}
				
				if(this.crowdInfo.playerType=='MORE_SAO_LEI'){
					if(this.lei.length <2 || this.lei > 4){
						uni.showToast({
							title:"请输入2~4个雷",
							icon:'none'
						})
						return
					}
				}
				
				
				if(!this.userInfo.payPassword){
					uni.showModal({
						title:"提示",
						content:"请设置支付密码",
						cancelText:"稍后设置",
						confirmText:"现在设置",
						success(res){
							if(res.confirm){
								uni.navigateTo({
									url:'../../../tabbar-5/gerenshezhi/mimashezhi/paypassword/paypassword'
								})
							}
							if(res.cancel) {
								uni.navigateBack({})
							}
							
						}
					})
				}else{
					this.value = true
					this.focus = true
					this.password=null
				}
			}
		}
	}
</script>

<style lang="scss" >
	page{
		background-color: #eee;
	}
	.custom-view{
		overflow: hidden;
		z-index: 999;
		position: absolute;
		top: 5%;
		
		.hongbao{
			position: relative;
			width: 440upx;
			height: 380upx;
			border-radius: 5px;
			background: #fff;
			padding-top: 50upx;
			padding-left: 30upx;
			padding-right: 30upx;
			.close{
				width: 30upx;
				height: 30upx;
				position: absolute;
				top: 50upx;
				left: 30upx;
			}
			.mark{
				position: absolute;
				left: 30upx;
				top:290upx;
				width: 440upx;
				height: 80upx;
				box-sizing: border-box;
				border-radius: 5px;
				border: 1upx solid #eee;
				view{
					float: left;
					width: 16.66%;
					height: 100%;
					box-sizing: border-box;
					border-right: 1upx solid #eee;
					position: relative;
				}
				.active::before{
					content: '';
					width: 20upx;
					height: 20upx;
					border-radius: 10upx;
					background-color: #333;
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%,-50%);
				}
				view:last-of-type{
					border: 0;
				}
			}
		}
		
	}
	.box{
		padding: 25upx 30upx;
		.inputItem{
			width: 630upx;
			padding: 25upx 30upx;
			background-color: #fff;
			border-radius: 5px;
			.right{
				float: right;
				display: inline-block;
				width: 60%;
				vertical-align: middle;
				input{
					display: inline-block;
					vertical-align: middle;
					width: calc(100% - 20px);
					text-align: right;
					margin-right: 10upx;
				}
				text{
					width: 20px;
					text-align: right;
					vertical-align: middle;
				}
			}
			.hint{
				font-size: 12px;
				color: #999;
			}
		}
		.hintBox{
			background-color: #eee;
		}
		.boldMoney{
			text-align: center;
			font-weight: bold;
		}
	}
</style>
