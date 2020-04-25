<template>
	<view>
		<Loading v-show="isLoading"></Loading>
		<view style="margin-left: 50upx; width: 650upx; margin-top: 300upx;">
			<view class="uni-form-item uni-column" >
				<text class="title" style="display: inline-block;" >账号：</text>
				<input  type="text" placeholder="请输入手机号/账号" style="display: inline-block;  width: 350upx; vertical-align: middle;" v-model="accound"/>
				
			</view>
			
			
			<view class="uni-form-item uni-column" >
				<text class="title" style="display: inline-block;" >密码：</text>
				<input  type="password" placeholder="请输入密码" style="display: inline-block; width: 350upx; vertical-align: middle;" v-model="password"/>
				
			</view>
			<view class="else">
				<navigator url="./register" open-type="navigate" hover-class="">
					<text>注册</text>
				</navigator>
				<navigator url="./forgetPassword" open-type="navigate" hover-class="">
					<text>忘记密码？</text>
				</navigator>
			</view>
			<button @click="login" style="background-color:#4cb964; margin-top: 100upx;" type="primary">登录</button>
			
			<view class="weixin">
				<text>微信登录</text>
				</br>
				<view class="background" @click="weixinLogin">
					<image src="../../static/img/weixin.png"></image>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	import Loading from '@/components/loading/loading.vue'
	
	export default{
		components:{Loading},
		data(){
			return{
				accound:'',
				password:'',
				
			}
		},
		computed:{
			isLoading:function(){
				return this.$store.state.isLoading
			}
		},
		onLoad(){
			
			
		},
		methods:{
			
			
			toastFun(val){
				uni.showToast({
					title:""+val+"不能为空",
					icon:"none"
				})
			},
			login(){
				if(this.accound == ''){
					this.toastFun('账号')
					return
				} else if(this.password == ''){
					this.toastFun('密码')
					return
				} else{
					this.$http.httpRequest({
						url:'/user/phoneLogin',
						method:"post"
					},{
						password:this.password,
						phone:this.accound
					}).then((res)=>{
						if(res.data.success){
							try{
								uni.setStorageSync("userInfo",JSON.stringify(res.data.data))
								uni.$emit('updateWs',{msg:'页面更新'})
								
							} catch(err){
								uni.showToast({
									icon:"none",
									title:"未知错误"
								})
							}
							
							uni.switchTab({
								url:'../tabbar/tabbar-5/tabbar-5'
							})
							
						} else{
							uni.showToast({
								title:res.data.msg,
								icon:"none"
							})
						}
					},(err)=>{
						uni.showToast({
							icon:"none",
							title:"服务器忙...等会再试"
						})
					})
				}
			},
			weixinLogin() {
				var vm = this;
				uni.getProvider({
					service: 'oauth',
					success: function (res) {
						console.log(res.provider) //qq,xiaomi,sinaweibo,weixin
						// vm.log.log1 = res.provider
						if (~res.provider.indexOf('weixin')) {
							uni.login({
								provider: 'weixin', 
								success: function (loginRes) {
									vm.$HTTP({
									  method: 'GET',
									  baseURL:'https://api.weixin.qq.com/sns/userinfo',
									  url: '',
									  data: {
										  openid:loginRes.authResult.openid,
										  access_token:loginRes.authResult.access_token
									  },
									  load:true
									}).then((data) =>{
									  uni.setStorage({
										key: 'userInfo',
										data:{
											name:data.nickname,
											picUrl:data.headimgurl
										}
									  });
									  uni.switchTab({
										url: "../../tabBar/me/me"
									  })
									}, (err) => {
									  console.log(err)
									});
								}
							});
						}
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.uni-form-item{
		margin-top: 30upx;
		height: 90upx;
		border-bottom: 1upx solid #4cB964;
		text{
			// font-size: 14px;
			color:#333;
		}
	}
	.else{
		margin-top: 15upx;
		color: #999;
		font-size: 14px;
		text:first-of-type{
			float: left;
		}
		navigator:last-of-type{
			float: right;
		}
	}
	
	.weixin{
		margin-top: 250upx;
		text-align: center;
		text{
			font-size: 14px;
			color:#999;
			
		}
		.background{
			margin-top: 20upx;
			width: 80upx;
			height: 80upx;
			border-radius: 40upx 40upx;
			position: relative;
			display: inline-block;
			background-color: #deefdd;
			image{
				margin-top: 15upx;
				width: 50upx;
				height: 50upx;
			}
		}
		.background::after{
			content: '';
			position: absolute;
			background-color: #ccc;
			top:40upx;
			left: 115upx;
			height: 1upx;
			width: 250upx;
		}
		.background::before{
			content: '';
			position: absolute;
			background-color: #ccc;
			top:40upx;
			right: 115upx;
			height: 1upx;
			width: 250upx;
		}
		
	}
	
</style>
