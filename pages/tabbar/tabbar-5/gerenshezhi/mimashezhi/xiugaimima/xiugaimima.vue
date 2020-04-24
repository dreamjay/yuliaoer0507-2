<template>
	<view>
		<view>
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
						<button form-type="reset" style="color: #fff; background-color:#666; width: 325upx; height:100upx; line-height: 100upx; display: inline-block;">重置</button>
						<text style="visibility: hidden;">2</text>
						<button form-type="submit" style="color: #fff; background-color:#4cb964; width: 325upx; height:100upx; line-height: 100upx; display: inline-block;">提交</button>
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
		onLoad(option) {
			if(option.type == 'zhifu'){
				this.type = 'zhifu'
				uni.setNavigationBarTitle({
					title:"修改支付密码"
				})
			}else if(option.type == 'denglu'){
				this.type = 'denglu'
				uni.setNavigationBarTitle({
					title:"修改登录密码"
				})
			}
		},
        methods: {
			xiugaiZhifu(obj){
				
				this.$http.httpTokenRequest({
					url: '/user/updatePayPassword',
					method: 'post'
				}, {
					oldPayPassword:obj.jiu,
					payPassword:obj.xin
				}).then(res => {
					
					if(res.data.success){
						uni.showToast({
							title:'修改成功'
						})
						setTimeout(()=>{
							uni.hideToast()
							uni.navigateBack()
						},1500)
						
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
			xiugaiDenglu(obj){
				this.$http.httpTokenRequest({
					url: '/user/updatePassword',
					method: 'post'
				}, {
					oldPassword:obj.jiu,
					password:obj.xin
				}).then(res => {
					
					if(res.data.success){
						uni.showToast({
							title:'修改成功'
						})
						setTimeout(()=>{
							uni.hideToast()
							uni.navigateBack()
						},1500)
						
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
            formSubmit: function(e) {
                // console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
                if(e.detail.value.xin != e.detail.value.xin1){
					uni.showToast({
						title:'两次密码不一致',
						icon:'none'
					})
				}else{
					this.type == 'zhifu' && this.xiugaiZhifu(e.detail.value)
					this.type == 'denglu' && this.xiugaiDenglu(e.detail.value)
				}
                
            },
            formReset: function(e) {
                console.log('清空数据')
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
