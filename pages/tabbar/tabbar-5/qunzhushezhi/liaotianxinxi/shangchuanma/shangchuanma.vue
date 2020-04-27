<template>
	<view>
		<view class="content">
			<view><image @click="openImage('wx')" :src="crowdInfo.wxUrl ? crowdInfo.wxUrl : '/static/moren.png'"></image></view>
			<view><text>上传微信收款码</text></view>
			<view>
				<text>微信号：</text>
				<input type="text" v-model="wxVal" placeholder="填写微信号">
			</view>
		</view>
		<view class="content">
			<view><image @click="openImage('zfb')" :src="crowdInfo.zfbUrl ? crowdInfo.zfbUrl : '/static/moren.png'"></image></view>
			<view><text>上传支付宝收款码</text></view>
			<view>
				<text>支付包账号：</text>
				<input type="text" v-model="zfbVal" placeholder="填写支付宝账号">
			</view>
		</view>
		<view class="content">
			<view><image @click="openImage('qz')" :src="crowdInfo.qunZhuUrl ? crowdInfo.qunZhuUrl : '/static/moren.png'"></image></view>
			<view><text>上传群主收款码</text></view>
			<view>
				<text>群主微信号：</text>
				<input type="text"  v-model="qzVal" placeholder="填写群主微信号">
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
			this.wxVal = this.crowdInfo.wxAccountSh?this.crowdInfo.wxAccountSh:'';
			this.zfbVal = this.crowdInfo.zfbAccount?this.crowdInfo.zfbAccount:'';
			this.qzVal = this.crowdInfo.qunZhuAccount?this.crowdInfo.qunZhuAccount:'';
			this.token = uni.getStorageSync('token')
		},
		onNavigationBarButtonTap:function() {
			uni.showModal({
				title: "提示",
				content: '是否确定保存',
				success:  (res)=> {
					console.log(res)
					
					if (res.confirm) {
						this.updateWxAccount();
						this.updateQunzhuAccount();
						this.updateZfbAccount();
					}
				}
			})
		},
		methods:{
			updateWxAccount(){
				console.log(this.wxVal)
				if( this.wxVal.trim() != ''){
						return;
				}
				
				this.$http.httpPostToken('/crowd/updateCollection',{
					crowdId: this.crowdInfo.id,
					wxAccountSh:this.wxVal.trim()
				},(res)=>{
					uni.$emit('updateWxAccount',this.wxVal)
					uni.hideToast()
					uni.showToast({
						title:'更新成功',
						icon:'none'
					})
				},false)
			},
			updateZfbAccount(){
				if( this.zfbVal.trim() != ''){
						return;
				}
				this.$http.httpPostToken('/crowd/updateCollection',{
					crowdId: this.crowdInfo.id,
					zfbAccount:this.zfbVal.trim()
					
				},(res)=>{
					uni.$emit('updateZfbAccount',this.zfbVal)
					uni.hideToast()
					uni.showToast({
						title:'更新成功',
						icon:'none'
					})
				},false)
			},
			updateQunzhuAccount(){
				if( this.qzVal.trim() != ''){
						return;
				}
				this.$http.httpPostToken('/crowd/updateCollection',{
					crowdId: this.crowdInfo.id,
					qunZhuAccount:this.qzVal.trim()
				},(res)=>{
					uni.$emit('updateQunzhuAccount',this.qzVal)
					uni.hideToast()
					uni.showToast({
						title:'更新成功',
						icon:'none'
					})
				},false)
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
							uni.showLoading({
								title:"上传微信收款码"
							})
							this.updataImg(this.wxImgFiles, 'wxFile', '/crowd/uploadWxFile')
							
						} else if(type == 'zfb'){
							this.zfbImgFiles = imgRes.tempFilePaths[0]
							this.crowdInfo.zfbUrl = this.zfbImgFiles
							
							uni.showLoading({
								title:"上传支付宝收款码"
							})
							this.updataImg(this.zfbImgFiles, 'zfbFile', '/crowd/uploadZfbFile')
						} else{
							this.qzImgFiles = imgRes.tempFilePaths[0]
							this.crowdInfo.qunZhuUrl = this.qzImgFiles
							uni.showLoading({
								title:"上传群主微信"
							})
							this.updataImg(this.qzImgFiles, 'qunZhuFile', '/crowd/uploadQunzhuWxFile')
						}
					}
				})
			},
			updataImg(imgFiles,type,url){ //修改头像和用户名
				
				var then = this
				var uper = uni.uploadFile({
					// 需要上传的地址
					url:then.$http.baseUrl+url,
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
						var obj = JSON.parse(res1.data);
						if(obj.success){
							// uni.$emit('updateInfo',{msg:'页面更新1'})
							
							console.
							uni.$emit(type,obj.data)
							uni.hideToast()
							uni.showToast({
								title: '上传收款码成功',
								icon:'none',
								complete: () => {
										
								}
							})
							
						}else{
							uni.showToast({
								title: obj.msg,
								icon:'none'
							})
						}
					},
					fail(err){
						
					},
					complete:function(){
						uni.hideLoading();
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
