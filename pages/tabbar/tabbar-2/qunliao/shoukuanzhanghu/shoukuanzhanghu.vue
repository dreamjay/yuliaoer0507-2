<template>
	<view class="maxBox">
		<view class="nav">
			<view class="item" @click="navClick(0)" :class="navIndex == 0 ? 'active' : null"><text>微信</text></view>
			<view class="item" @click="navClick(1)" :class="navIndex == 1 ? 'active' : null"><text>支付宝</text></view>
			<view class="item" @click="navClick(2)" :class="navIndex == 2 ? 'active' : null"><text>银行卡</text></view>
		</view>
		<view v-if="navIndex == 0">
			<view class="content">
				<view >
					<text>微信账号</text>
					<input type="text" v-model="wxAccount">
				</view>
			</view>
			<view class="content">
				<view >
					<text>用户名</text>
					<input type="text" v-model="wxUsername">
				</view>
			</view>
			<view class="button">
				<button style="" @click="saveWx" type="primary">提交</button>
			</view>
		</view>
		
		<view v-if="navIndex == 1">
			<view class="content">
				<view >
					<text>支付宝账号</text>
					<input type="text" v-model="zfbAccount">
				</view>
			</view>
			<view class="content">
				<view >
					<text>用户名</text>
					<input type="text" v-model="zfbUsername">
				</view>
			</view>
			<view class="button">
				<button style="" @click="saveZfb" type="primary">提交</button>
			</view>
		</view>
		
		
		<view v-if="navIndex == 2">
			<view class="content">
				<view >
					<text>所属银行</text>
					<input type="text" v-model="bankName">
				</view>
			</view>
			<view class="content">
				<view >
					<text>卡号</text>
					<input type="text" v-model="bankCard">
				</view>
			</view>
			<view class="content">
				<view >
					<text>持卡人姓名</text>
					<input type="text" v-model="bankUsername">
				</view>
			</view>
			<view class="button">
				<button style="" @click="saveBank" type="primary">提交</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				navIndex:0,
				wxAccount:'',
				wxUsername:'',
				zfbAccount:'',
				zfbUsername:'',
				bankName:'',
				bankCard:'',
				bankUsername:''
			}
		},
		onLoad() {
			this.loadData();
		},
		methods:{
			loadData(){
				this.$http.httpGetToken("/user/getUserAccount",{},(res)=>{
					console.log(res);
					var obj = res.data;
					this.wxAccount = obj.wxAccount ? obj.wxAccount : '';
					this.wxUsername = obj.wxUsername? obj.wxUsername : '';
					this.zfbAccount = obj.zfbAccount? obj.zfbAccount : '';
					this.zfbUsername = obj.zfbUsername? obj.zfbUsername : '';
					this.bankName = obj.bankName? obj.bankName : '';
					this.bankCard = obj.bankCard? obj.bankCard : '';
					this.bankUsername = obj.bankUsername? obj.bankUsername : '';
					
					
				},true);
				
			},
			saveWx(){
				if(this.wxAccount.trim() == ''){
					uni.showToast({
						title:'请输入微信账号',
						icon:"none"
					})
					return;
				}
				if(this.wxUsername.trim() == ''){
					uni.showToast({
						title:'请输入微信用户名',
						icon:"none"
					})
					return;
				}
				this.$http.httpPostToken('/user/updateWxInfo',{
					wxAccount:this.wxAccount.trim(),
					wxUsername:this.wxUsername.trim()
				},(res) =>{
					uni.showToast({
						title:"微信账号设置成功",
						icon:"none"
					})
				},true);
				
			},
			saveZfb(){
				if(this.zfbAccount.trim() == ''){
					uni.showToast({
						title:'请输入支付宝账号',
						icon:"none"
					})
					return;
				}
				if(this.zfbUsername.trim() == ''){
					uni.showToast({
						title:'请输入支付宝用户名',
						icon:"none"
					})
					return;
				}
				this.$http.httpPostToken('/user/updateZfbInfo',{
					zfbAccount:this.zfbAccount.trim(),
					zfbUsername:this.zfbUsername.trim()
				},(res) =>{
					uni.showToast({
						title:"支付宝账号设置成功",
						icon:"none"
					})
				},true);
			},
			saveBank(){
				if(this.bankName.trim() == ''){
					uni.showToast({
						title:'请输入银行名称',
						icon:"none"
					})
					return;
				}
				if(this.bankCard.trim() == ''){
					uni.showToast({
						title:'请输入银行卡号',
						icon:"none"
					})
					return;
				}
				if(this.bankUsername.trim() == ''){
					uni.showToast({
						title:'请输入持卡人姓名',
						icon:"none"
					})
					return;
				}
				this.$http.httpPostToken('/user/updateBankInfo',{
					bankCard:this.bankCard.trim(),
					bankName:this.bankName.trim(),
					bankUsername:this.bankUsername.trim()
				},(res) =>{
					uni.showToast({
						title:"银行卡设置成功",
						icon:"none"
					})
				},true);
			},
			navClick(index){
				this.navIndex = index
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #EEEEEE;
	}
	.maxBox{
		padding: 50upx;
		background-color: #FFFFFF;
		.nav{
			display: flex;
			justify-content: space-between;
			width: 650upx;
			.item{
				width: 200upx;
				height: 80upx;
				border: 1upx solid #4CB964;
				border-radius: 5px;
				text-align: center;
				color: #4CB964;
				text{
					line-height: 80upx;
				}
			}
			.active{
				color: #fff;
				background-color: #4CB964;
			}
		}
		.content{
			width: 600upx;
			padding: 0 25upx;
			view{
				margin-top: 80upx;
				text{
					display: inline-block;
					width: 200upx;
				}
				input{
					vertical-align: middle;
					display: inline-block;
					width: 400upx;
					border-bottom: 1upx solid #ddd;
				}
			}
		}
		.button{
			width: 650upx;
			margin-top: 140upx;
			button{
				width: 100%;
				background-color:#4cb964;
			}
		}
	}
	
</style>
