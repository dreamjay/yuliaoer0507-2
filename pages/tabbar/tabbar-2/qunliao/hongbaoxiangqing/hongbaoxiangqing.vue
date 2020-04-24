<template>
	<view>
		<view class="hongbao" :class="succeed ? 'hongbaoActive' : null">
			<image class="hongbaoBody"  src="/static/liaotian/bg_hb_success.png"></image>
			<view class="messageInfo">
				<view class="userHBInfo">
					<image src="/static/moren.png"></image>
					<text>士大夫的红包</text>
					<image src="/static/liaotian/icon_ping.png"></image>
				</view>
				<text class="message"> 50-6</text>
				<view v-if="succeed" class="hongbaoSucceed">
					<text>￥ </text>
					<text>6.90</text>
					<br>
					<text>已存入账户，可用于发红包</text>
				</view>
			</view>
		</view>
		
		<view class="myList">
			<view class="title">
				<text>10个红包，6秒 被抢光</text>
			</view>
			<ul>
				<li class="SelectList" v-for="(item,index) in 10" :key="index">
					<image class="headImage" src="/static/moren.png" mode=""></image>
					<view >
						<p class='bold'>群主设置</p>
						<text>2015-5456sd </text>
					</view>
					<view>
						<text class="bold">16.89元</text>
						<view class="textBox" v-if="index == 3">
							<image src='/static/liaotian/icon_best.png'></image>
							<text>手气最佳</text>
						</view>
					</view>
					
				</li>
				
			</ul>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				succeed: false //有没有抢成功
			}
		},
		onLoad(option) {
			if(option.succeed){
				this.succeed = true
			}
		},
		onNavigationBarButtonTap:function() {
			
			uni.navigateTo({
				url:"../hongbaojilu/hongbaojilu"
			})
		},
	}
</script>

<style lang="scss" scoped>
	
	.hongbao{
		height: 400upx;
		padding-bottom: 50upx;
		.hongbaoBody{
			width: 100%;
			height: 100%;
		}
		
		.messageInfo{
			position: absolute;
			width: 100%;
			top: 80upx;
			left: 50%;
			transform: translateX(-50%);
			text-align: center;
			color:#EDD3A2;
			.userHBInfo{
				image:first-of-type{
					display: inline-block;
					width: 80upx;
					height: 80upx;
					border-radius: 5px;
					vertical-align: middle;
				}
				text{
					margin-left: 15upx;
					vertical-align: middle;
				}
				image:last-of-type{
					width: 16px;
					height: 16px;
					vertical-align: middle;
					margin-left: 15upx;
				}
			}
			.message{
				line-height: 100upx;
			}
			.hongbaoSucceed{
				text:nth-of-type(1){
					font-weight: bold;
					font-size: 18px;
				}
				text:nth-of-type(2){
					font-weight: bold;
					font-size: 40px;
					line-height: 50px;
				}
				text:nth-of-type(3){
					font-size: 12px;
				}
			}
		}
	}
	.hongbaoActive{
		height: 500upx;
	}
	.myList{
		border-top: 20upx solid #eee;
		font-size: 28upx;
		color: #333;
	}
	.myList ul{
		// border-top: 1upx solid #eee;
		// border-bottom: 1upx solid #eee;
	}
	.myList .title{
		color: #666;
		height: 40upx;
		padding: 20upx 50upx;
		border-bottom: 1px solid #eee;
	}
	.myList .SelectList{
		position: relative;
		height: 80upx;
		padding: 20upx 50upx;
		background-color: #fff;
		/* border-bottom: 1px solid #eee; */
	}
	.myList .SelectList .headImage{
		width: 80upx;
		height: 80upx;
		vertical-align: middle;
	}
	.myList .SelectList view{
		display: inline-block;
		width: 30%;
		line-height: 40upx;
	}
	.myList .SelectList view:first-of-type{
		vertical-align: middle;
		margin-left: 30upx;
	}
	
	.myList .SelectList view:last-of-type{
		float: right;
		text-align: right;
	}
	.myList .SelectList view .bold{
		font-weight: bold;
	}
	.myList .SelectList view:first-of-type text{
		color: #666;
	}
	.myList .SelectList view:last-of-type .textBox{
		width: 100%;
		height: 50%;
	}
	.myList .SelectList view:last-of-type .textBox image{
		width: 30upx;
		height: 30upx;
		display: inline-block;
		vertical-align: middle;
	}
	.myList .SelectList view:last-of-type .textBox text{
		vertical-align: middle;
		font-size: 12px;
		color: #ffba0c;
		margin-left: 10upx;
	}
	.myList .SelectList::before{
		content: '';
		position: absolute;
		height: 1px;
		background-color: #eee;
		width: calc(100% - 160upx);
		bottom: 0;
		right: 0;
	}
	.myList .nullBottom::before{
		content: '';
		position: absolute;
		height: 0upx;
		background-color: #eee;
		width: calc(100% - 160upx);
		bottom: 0;
		right: 0;
	}
	
	
</style>
