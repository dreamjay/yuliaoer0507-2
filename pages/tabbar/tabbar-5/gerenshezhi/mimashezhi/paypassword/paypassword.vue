<template>
	<view>
		<view>
			<view style="margin-top: 50upx; ">
				<form @submit="formSubmit" @reset="formReset">
					<view style="margin-left: 50upx; width: 650upx;">
						
						<view class="uni-form-item uni-column" >
							<text class="title" style="display: inline-block;">新密码：</text>
							<input name="xin" type="password" style="display: inline-block; border-bottom: 1upx solid #aaa; width: 450upx;"/>
							
						</view>
						<view class="uni-form-item uni-column" >
							<text class="title" style="display: inline-block;">确认密码：</text>
							<input name="xin1" type="password" style="display: inline-block; border-bottom: 1upx solid #aaa; width: 450upx;"/>
							
						</view>
					</view>
					
					
					<view class="uni-btn-v" style="margin-top: 100upx; text-align: center;">
						<button form-type="reset" type="default" style="color: #fff; background-color:#666; width: 325upx; display: inline-block;" >重置</button>
						<text style="visibility: hidden;">2</text>
						<button form-type="submit" style="color: #fff; background-color:#4cb964; width: 325upx; display: inline-block;" type="primary">提交</button>
					</view>
				</form>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	
    export default {
        data() {
            return {
				type:'',
				
            }
        },
		computed:{
		
		},
		onLoad(option) {
		},
        methods: {
            formSubmit: function(e) {
				if(!e.detail.value.xin || e.detail.value.xin == ''){
					uni.showToast({
						title:'请输入支付密码',
						icon:'none'
					})
					return;
				}
                if(e.detail.value.xin != e.detail.value.xin1){
					uni.showToast({
						title:'两次密码不一致',
						icon:'none'
					})
				}else{
					this.$http.httpPostToken("/user/setPayPassword",{
						payPassword:e.detail.value.xin
					},(res) => {
						
						uni.showToast({
							title:'设置支付密码成功',
							icon:'none',
							duration: 1500,
							complete:function(){
								setTimeout(function() {  
									uni.navigateBack({

									});
								}, 1500);
							},
						})
						var userInfo = uni.getStorageSync('userInfo');
						userInfo.payPassword = e.detail.value.xin;
						uni.setStorageSync("userInfo",userInfo);
						
					},true)
				}
            },
            formReset: function(e) {
                uni.showToast({
                	title:'重置成功',
                	icon:'none'
                })
            }
        }
    }
</script>

<style>
	.uni-form-item{
		padding: 20upx 0;
	}
    .uni-form-item .title {
        padding: 20upx 0;
    }
</style>
