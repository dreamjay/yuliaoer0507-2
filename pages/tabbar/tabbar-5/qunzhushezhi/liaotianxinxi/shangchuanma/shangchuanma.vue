<template>
	<view>
		<view class="content">
			<view><image @click="openImage('wx')" :src="crowdInfo.wxUrl ? crowdInfo.wxUrl : '/static/moren.jpg'"></image></view>
			<view><text>上传微信收款码</text></view>
			<view>
				<text>微信号：</text>
				<input type="text" v-if="crowdInfo.wxAccountSh" v-model="crowdInfo.wxAccountSh">
				<input type="text" v-if="!crowdInfo.wxAccountSh" v-model="wxVal" placeholder="填写微信号">
			</view>
		</view>
		<view class="content">
			<view><image @click="openImage('zfb')" :src="crowdInfo.zfbUrl ? crowdInfo.zfbUrl : '/static/moren.jpg'"></image></view>
			<view><text>上传支付宝收款码</text></view>
			<view>
				<text>支付包账号：</text>
				<input type="text" v-if="crowdInfo.zfbAccount" v-model="crowdInfo.zfbAccount">
				<input type="text" v-if="!crowdInfo.zfbAccount" v-model="zfbVal" placeholder="填写支付宝账号">
			</view>
		</view>
		<view class="content">
			<view><image @click="openImage('qz')" :src="crowdInfo.qunZhuUrl ? crowdInfo.qunZhuUrl : '/static/moren.jpg'"></image></view>
			<view><text>上传群主收款码</text></view>
			<view>
				<text>群主微信号：</text>
				<input type="text" v-if="crowdInfo.qunZhuAccount" v-model="crowdInfo.qunZhuAccount">
				<input type="text" v-if="!crowdInfo.qunZhuAccount" v-model="qzVal" placeholder="填写群主微信号">
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				crowdInfo:null,
				token:'',
				wxImgFiles:'', //微信码
				zfbImgFiles:'',//支付宝码
				qzImgFiles:'',//群主微信码
				wxVal:'', //微信账号
				zfbVal:'', //支付宝账号
				qzVal:'', //群主微信账号
				
			}
		},
		onLoad(option) {
			this.crowdInfo = JSON.parse(option.crowdInfo)
			this.token = JSON.parse(uni.getStorageSync('userInfo')).token
		},
		onNavigationBarButtonTap:function() {
			uni.showModal({
				title: "提示",
				content: '是否确定保存',
				success:  (res)=> {
					if (res.confirm) {
						if(this.crowdInfo.wxAccountSh || this.wxVal){
							this.updateAccount('wxAccountSh',this.crowdInfo.wxAccountSh ? this.crowdInfo.wxAccountSh : this.wxVal)
						}
						if(this.crowdInfo.zfbAccount || this.zfbVal){
							this.updateAccount('zfbAccount',this.crowdInfo.zfbAccount ? this.crowdInfo.zfbAccount : this.zfbVal)
						}
						if(this.crowdInfo.qunZhuAccount || this.qzVal){
							this.updateAccount('qunZhuAccount',this.crowdInfo.qunZhuAccount ? this.crowdInfo.qunZhuAccount : this.qzVal)
						}
						
						
						if(this.wxImgFiles){
							this.updataImg(this.wxImgFiles, 'wxFile', '/crowd/uploadWxFile')
						}
						if(this.zfbImgFiles){
							this.updataImg(this.zfbImgFiles, 'zfbFile', '/crowd/uploadZfbFile')
						}
						if(this.qzImgFiles){
							this.updataImg(this.qzImgFiles, 'qunZhuFile', '/crowd/uploadQunzhuWxFile')
						}
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			})
		},
		methods:{
			
			updateAccount(key, val){
				const obj = {crowdId: this.crowdInfo.id}
				obj[key] = val
				this.$http.httpTokenRequest({
					url: '/crowd/updateCollection',
					method: 'post'
				}, obj).then(res => {
					
					if(res.data.success){
						uni.$emit('updateInfo',{msg:'页面更新1'})
						uni.hideToast()
						uni.showToast({
							title:'上传账号成功',
							icon:'none'
						})
						
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
			openImage(type){ //相册或者拍图片
				uni.chooseImage({
					count:1,
					fail:()=>{
						
					},
					success:(imgRes)=>{
						//因为有一张图片， 输出下标[0]， 直接输出地址
						if(type == 'wx'){
							this.wxImgFiles = imgRes.tempFilePaths[0]
							this.crowdInfo.wxUrl = this.wxImgFiles
						} else if(type == 'zfb'){
							this.zfbImgFiles = imgRes.tempFilePaths[0]
							this.crowdInfo.zfbUrl = this.zfbImgFiles
						} else{
							this.qzImgFiles = imgRes.tempFilePaths[0]
							this.crowdInfo.qunZhuUrl = this.qzImgFiles
							
						}
					}
				})
			},
			updataImg(imgFiles,type,url){ //修改头像和用户名
				
				var then = this
				var uper = uni.uploadFile({
					// 需要上传的地址
					url:'http://zcttt.vipgz5.idcfengye.com'+url+'',
					// filePath  需要上传的文件
					filePath: imgFiles,
					name: type,
					header:{
						token:then.token
					},
					formData: {
						'crowdId': then.crowdInfo.id
					},
					success(res1) {
						// 显示上传信息
						if(JSON.parse(res1.data).success){
							uni.$emit('updateInfo',{msg:'页面更新1'})
							uni.hideToast()
							uni.showToast({
								title: '上传收款码成功',
								icon:'none',
								complete: () => {
										
								}
							})
							
						}else{
							uni.showToast({
								title: JSON.parse(res1.data).msg,
								icon:'none'
							})
						}
					},
					fail(err){
						
					}
				});
				// onProgressUpdate 上传对象更新的方法
				uper.onProgressUpdate((res)=>{
					// 进度条等于 上传到的进度
					// _self.percent = res.progress
					
					// console.log('上传进度' + res.progress)
					// console.log('已经上传的数据长度' + res.totalBytesSent)
					// console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend)
					
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		padding: 50upx 60upx;
		border-bottom: 1upx solid #eee;
		
		position: relative;
		view:nth-of-type(1){
			text-align: center;
			image{
				width: 100upx;
				height: 100upx;
			}
		}
		view:nth-of-type(2){
			text-align: center;
			padding: 20upx 0; 
		}
		view:nth-of-type(3){
			input{
				vertical-align: middle;
				display: inline-block;
				padding-left: 15upx;
				padding-bottom: 10upx;
				border-bottom: 1upx solid #eee;
			}
		}
	}
	.content:last-of-type{
		border-bottom: 0;
	}
</style>
