<template>
	<view class="maxBox">
		<view class="wxorzfb">
			<view class="content">
				<view class="imageBox" @longtap="longtap('wx')">
					<image :src="srcWx" mode="aspectFit" :lazy-load="true"></image>
				</view>
				<text style="height: 60upx; line-height: 60upx;">微信充值</text>
				<br>
				<text style="color: #999; height: 50upx; line-height: 50upx;">（长按二维码保存）</text>
				<br>
				<text>微信号：</text>
				<text>{{wx}}</text>
				<text style="text-decoration:underline; margin-left: 20upx; color: #1482D1; height: 50upx; line-height: 50upx;" @click="copy('wx')">复制</text>
			</view>
		</view>
		<view class="wxorzfb">
			<view class="content">
				<view class="imageBox" @longtap="longtap('zfb')">
					<image :src="srcZfb" mode="aspectFit" :lazy-load="true"></image>
				</view>
				<text style="height: 60upx; line-height: 60upx;">支付宝充值</text>
				<br>
				<text style="color: #999; height: 50upx; line-height: 50upx;">（长按二维码保存）</text>
				<br>
				<text>支付宝账号：</text>
				<text>{{zfb}}</text>
				<text style="text-decoration:underline; margin-left: 20upx; color: #1482D1; height: 50upx; line-height: 50upx;" @click="copy('zfb')">复制</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				srcWx:'',
				srcZfb:'',
				wx:'',
				zfb:'',
				crowdInfo:{
					type:Object,
					default(){
						return{}
					}
				}
			}
		},
		onLoad(option) {
			this.crowdInfo = JSON.parse(option.crowdInfo);
			
			this.srcWx = this.crowdInfo.wxUrl?this.crowdInfo.wxUrl:'/static/moren.png';
			this.srcZfb = this.crowdInfo.zfbUrl?this.crowdInfo.zfbUrl:'/static/moren.png';
			this.wx = this.crowdInfo.wxAccountSh?this.crowdInfo.wxAccountSh:'';
			this.zfb = this.crowdInfo.zfbAccount?this.crowdInfo.zfbAccount:'';
		},
		methods:{
			copy(str){
				if(str == 'wx'){
					uni.setClipboardData({
					    data: this.wx,
					    success: function () {
					        uni.showToast({
					        	title:"已复制微信号",
								icon:'none'
					        })
					    }
					});
				}else{
					uni.setClipboardData({
					    data: this.zfb,
					    success: function () {
					        uni.showToast({
					        	title:"已复制支付宝号",
					        	icon:'none'
					        })
					    }
					});
				}
				
			},
			saveImage(src){
				uni.downloadFile({
					url: src,
					success: (res) =>{
						if (res.statusCode === 200){
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: function() {
									uni.showToast({
										title: "已保存到相册",
										icon: "none"
									});
								},
								fail: function() {
									uni.showToast({
										title: "保存失败，请稍后重试",
										icon: "none"
									});
								}
							});
						}
					}
				})
			},
			longtap(str){
				
				if(str == 'wx'){
					this.saveImage(this.srcWx)
				}else{
					this.saveImage(this.srcZfb)
					
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.maxBox{
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		padding: 0 30upx;
		.wxorzfb{
			position: relative;
			height: 50%;
			box-sizing: border-box;
			text-align: center;
			.content{
				position: absolute;
				width: 100%;
				top: 50%;
				transform: translateY(-50%);
				.imageBox{
					margin: 0 auto;
					height: 280upx;
					width: 280upx;
					border:1upx solid #4CB964;
					border-radius: 5px;
					padding: 10upx;
					image{
						height: 280upx;
						width: 280upx;
					}
				}
			}
			
		}
		.wxorzfb:first-of-type{
			border-bottom: 1upx solid #eee;
		}
	}
</style>
