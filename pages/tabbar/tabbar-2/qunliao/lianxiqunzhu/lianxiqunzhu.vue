<template>
	<view class="maxBox">
		
		<view class="wxorzfb">
			<view class="content">
				<view class="top">
					<text>微信号：</text>
					<text>{{wx}}</text>
					<text style="text-decoration:underline; margin-left: 20upx; color: #1482D1; height: 50upx; line-height: 50upx;" @click="copy">复制</text>
				</view>
				<view class="imageBox" >
					<image :src="srcWx" mode="scaleToFill" :lazy-load="true"></image>
				</view>
				<text class="text">扫一扫上面的二维码图案与客服联系吧~</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				srcWx:'http://img1.imgtn.bdimg.com/it/u=1010441052,79968067&fm=26&gp=0.jpg',
				wx:'ww45654686',
			}
		},
		methods:{
			copy(str){
				uni.setClipboardData({
					data: this.wx,
					success: function () {
						uni.showToast({
							title:"已复制微信号",
							icon:'none'
						})
					}
				});
			}
		}
	}
</script>

<style lang="scss" >
	page{
		background-color: #EEEEEE;
	}
	.maxBox{
		background-color: #fff;
		width: 690upx;
		padding: 0 30upx;
		.wxorzfb{
			text-align: center;
			.content{
				.top{
					width: 100%;
					height: 120upx;
					line-height: 120upx;
					border-bottom: 1upx solid #eee;
				}
				.imageBox{
					margin: 50upx auto;
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
				.text{
					font-weight: bold;
					margin-top: 40upx;
					margin-bottom: 60upx;
					display: inline-block;
					width: 330upx;
				}
			}
			
		}
	}
</style>
