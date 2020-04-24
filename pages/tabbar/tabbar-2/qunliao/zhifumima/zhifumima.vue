<template>
	<view>
		<view style="margin-top: 50upx; ">
			<view style="margin-left: 50upx; width: 650upx;">
				<view class="uni-form-item uni-column" >
					<text class="title" style="display: inline-block;">密码：</text>
					<input  v-model="mima1" type="password" placeholder="请输入6位数字密码" style="display: inline-block; border-bottom: 1upx solid #aaa; width: 450upx;"/>
				</view>
				<view class="uni-form-item uni-column" >
					<text class="title" style="display: inline-block;">确认密码：</text>
					<input v-model="mima2" type="password" placeholder="请输入确认密码" style="display: inline-block; border-bottom: 1upx solid #aaa; width: 450upx;"/>
					
				</view>
			</view>
			<button @click="setZhifu" style="background-color:#4CB964; width: 650upx; margin-top:50upx;" type="primary">完成</button>
		</view>
	</view>
</template>

<script>
    export default {
        data() {
            return {
				type:'',
				mima1:'',
				mima2:''
            }
        },
		onLoad(option) {
			
			
		},
        methods: {
			
			setZhifu(){
				if(this.mima1.length !=6 || this.mima2.length !=6){
					uni.showToast({
						title:"密码必须6位",
						icon:'none'
					})
					return
				} else if(this.mima1 !=this.mima2){
					uni.showToast({
						title:"两次密码不一致",
						icon:'none'
					})
					return
				} else{
					this.$http.httpTokenRequest({
						url: '/user/setPayPassword',
						method: 'post'
					}, {
						payPassword:this.mima1
					}).then(res => {
						
						if(res.data.success){
							uni.$emit('updateUserInfo',{msg:'页面更新1'})
							
							uni.showToast({
								title:'设置成功'
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
					}
				}
			}
		}
</script>

<style lang="scss" scoped>
	.uni-form-item{
		padding: 50upx 0;
		input{
			display: inline-block;
			vertical-align: middle;
			width: 400upx !important;
			margin-left: 30px;
		}
	}
    .uni-form-item .title {
        /* padding: 20upx 0; */
    }
</style>
