<template>
		<view>
			<Loading v-show="isLoading"></Loading>
			<view style="margin-top: 50upx; ">
				<form @submit="formSubmit" @reset="formReset">
					<view style="margin-left: 50upx; width: 650upx;">
						<view class="uni-form-item uni-column" >
							<text class="title" style="display: inline-block;">旧密码：</text>
							<input name="jiu" type="password" style="display: inline-block; border-bottom: 1upx solid #aaa; width: 450upx;"/>
						</view>
						<view style="text-align: left; height: 20upx; line-height: 20upx; margin-top: -30upx;">
							<text class="title" style="visibility: hidden;">旧密码：</text>
							<text class="title" style="display: inline-block; color:#666; font-size: 20upx; ">忘记旧密码，请联系客服</text>
						</view>
						
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
						<button type="default" form-type="reset" style="color: #fff; background-color:#666; width: 325upx;  display: inline-block;">重置</button>
						<text style="visibility: hidden;">2</text>
						<button type="primary" form-type="submit" style="color: #fff; background-color:#4cb964; width: 325upx; display: inline-block;">提交</button>
					</view>
				</form>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	import Loading from '@/components/loading/loading.vue'
    export default {
		components:{Loading},
        data() {
            return {
				type:'',
				
            }
        },
		computed:{
			isLoading:function(){
				return this.$store.state.isLoading
			}
		},
		onLoad(option) {
			this.$store.state.isLoading = false;
		},
        methods: {
            formSubmit: function(e) {
				if(!e.detail.value.jiu || e.detail.value.jiu == ''){
         					uni.showToast({
         						title:'请输入旧支付密码',
         						icon:'none'
         					})
         					return;
				}
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
					return;
				}
				
				
				this.$http.httpPostToken("/user/updatePayPassword",{
					oldPayPassword:e.detail.value.jiu,
					payPassword:e.detail.value.xin
				},(res) => {
					uni.showToast({
						title:'修改支付密码成功',
						icon:'none',
						duration: 1500,
						complete:function(){
							setTimeout(function() {  
								uni.navigateBack({
				
								});
							}, 1500);
						},
					})
				},true)
                
            },
            formReset: function(e) {
            
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
