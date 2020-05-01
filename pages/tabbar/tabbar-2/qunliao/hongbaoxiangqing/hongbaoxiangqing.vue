<template>
	<view>
		<view class="hongbao" :class="succeed ? 'hongbaoActive' : null">
			<image class="hongbaoBody"  :src="headUrl?headUrl:'/static/liaotian/bg_hb_success.png'"></image>
			<view class="messageInfo">
				<view class="userHBInfo">
					<image src="/static/moren.png"></image>
					<text>来自{{nickName}}的红包</text>
					<image src="/static/liaotian/icon_ping.png"></image>
				</view>
				<text class="message">{{title}}</text>
				<view v-if="succeed" class="hongbaoSucceed">
					<text>￥ </text>
					<text>{{userAmount}}</text>
					<br>
					<text>已存入账户，可用于发红包</text>
				</view>
			</view>
		</view>
		
		<view class="myList">
			<view class="title">
				<text v-if="isGradNull">{{num}}个红包，{{sec}}秒被抢光</text>
				<text v-if="!isGradNull">已领取{{a}}/{{num}}个</text>
			</view>
			<ul>
				<li class="SelectList" v-for="(item,index) in list" :key="index">
					<image class="headImage" :src="item.headUrl?item.headUrl:'/static/moren.png'" mode=""></image>
					<view >
						<p class='bold'>{{item.nickName}}</p>
						<text style="font-size: 12px;">{{item.gradTime}}</text>
					</view>
					<view>
						<text class="bold">{{item.amountName}}元</text>
						<view class="textBox" v-if="item.bestNum == 1 && isGradNull">
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
				succeed: false ,//有没有抢成功
				rid:0,
				headUrl:null,
				nickName:'',
				title:'',
				userAmount:'',
				num:'',
				a:'',
				sec:'',
				isGradNull:false,
				list:[]
			}
		},
		onLoad(option) {
			this.userInfo = uni.getStorageSync("userInfo");
			this.rid = option.rid;
			this.$http.httpPostTokenPush('/push/listRed',{id:this.rid},(res)=>{
				console.log(res);
				var obj = res.data;
				this.headUrl = obj.userHeadUrl;
				this.nickName= obj.userNickName;
				this.title = obj.redPackage.amount+ "-" + obj.redPackage.num;
				this.num = obj.redPackage.num;
				this.a = obj.list.length;
				this.isGradNull = obj.list.length == obj.redPackage.num;
				this.sec = obj.finishTime;
				this.list = obj.list;
				for(var i=0;i<obj.list.length;i++){
					if(obj.list[i].id == this.userInfo.id){
						this.succeed = true;
						this.userAmount = obj.list[i].amount.toFixed(2);
					}
				}
			},false);
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
