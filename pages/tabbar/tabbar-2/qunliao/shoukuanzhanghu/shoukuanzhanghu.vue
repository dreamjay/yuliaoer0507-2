<template>
	<view class="maxBox">
		<view class="nav">
			<view class="item" @click="navClick(0)" :class="navIndex == 0 ? 'active' : null"><text>微信</text></view>
			<view class="item" @click="navClick(1)" :class="navIndex == 1 ? 'active' : null"><text>支付宝</text></view>
			<view class="item" @click="navClick(2)" :class="navIndex == 2 ? 'active' : null"><text>银行卡</text></view>
		</view>
		<view class="content">
			<view v-for="(item,index) in inputs[navIndex]" :key='index'>
				
				<text>{{item.text}}:</text>
				<input type="text">
				
			</view>
		</view>
		<view class="button">
			<button style="" type="primary">提交</button>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				navIndex:0,
				inputs:[
					[
						{
							text:'微信账号',
						},
						{
							text:'用户名'
						}
					],
					[
						{
							text:'支付宝账号',
						},
						{
							text:'用户名'
						}
					],
					[
						{
							text:'所属银行',
						},
						{
							text:'卡号'
						},
						{
							text:'持卡人姓名'
						}
					]
				]
			}
		},
		methods:{
			navClick(index){
				this.navIndex = index
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #EEEEEE;
	}
	.maxBox{
		padding: 50upx;
		background-color: #FFFFFF;
		.nav{
			display: flex;
			justify-content: space-between;
			width: 650upx;
			.item{
				width: 200upx;
				height: 80upx;
				border: 1upx solid #4CB964;
				border-radius: 5px;
				text-align: center;
				color: #4CB964;
				text{
					line-height: 80upx;
				}
			}
			.active{
				color: #fff;
				background-color: #4CB964;
			}
		}
		.content{
			width: 600upx;
			padding: 0 25upx;
			view{
				margin-top: 80upx;
				text{
					display: inline-block;
					width: 200upx;
				}
				input{
					vertical-align: middle;
					display: inline-block;
					width: 400upx;
					border-bottom: 1upx solid #ddd;
				}
			}
		}
		.button{
			width: 650upx;
			margin-top: 140upx;
			button{
				width: 100%;
				background-color:#4cb964;
			}
		}
	}
	
</style>
