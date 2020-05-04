
<template>
    <view>
		 <view class="else">
			<text>修改群赔率倍数</text>
			<view >
				<input @confirm='confirm' type="number" v-model="redOdds" :cursor='Number(redOdds.length)' :focus="true" >
				<text>倍</text>
			</view>
		 </view>
		 
		 
	</view>
</template>

<script>
	export default{
		data(){
			return{
				crowdId:null,
				redOdds:''
			}
		},
		onLoad(option) {
			this.redOdds = option.redOdds
			this.crowdId = option.crowdId
		},
		computed:{
		
		},
		onNavigationBarButtonTap:function() {
			this.handleSave()
		},
		methods:{
			confirm(){
				this.handleSave()
			},
			handleSave(){
				if(this.redOdds.trim() == ''){
					uni.showToast({
						title:'请填写发包赔率',
						icon:'none'
					})
					return;
				}
			
				this.$http.httpPostToken('/crowd/updateRedOdds',{
					crowdId:this.crowdId,
					redOdds:this.redOdds.trim(),
				},(res)=>{
					uni.hideKeyboard()
					uni.navigateBack({});
					uni.$emit("updateRedOdds",this.redOdds.trim())
				},true)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.defultInput{
		background-color: #EEEEEE;
		width: calc(100% - 30px);
		height: 160upx;
		padding: 15px;
		border-radius: 5px;
	}
	.else{
		padding: 0 30upx;
		height: 50upx;
		line-height: 50upx;
		view{
			width: 400upx;
			display: inline-block;
			float: right;
			vertical-align: middle;
			input{
				text-align: right;
				padding-right: 30upx;
				display: inline-block;
				vertical-align: middle;
				width: 300upx;
			}
			.hiddenText{
				width: 370upx;
			}
			text{
				vertical-align: middle;
				color: #999;
				font-size: 14px;
			}
		}
	}
	.hongbaofanwei{
		padding: 0 30upx;
		height: 50upx;
		line-height: 50upx;
		text:first-of-type{
			
		}
		.right{
			float: right;
			width: 255upx;
			height: 100%;
			line-height: 50upx;
			text{
				vertical-align: middle;
				
			}
			input{
				padding: 0;
				width: 100upx;
				display: inline-block;
				height: 100%;
				vertical-align: middle;
				
			}
			input:last-of-type{
				text-align: right;
				padding-right: 30upx;
			}
		}
	}
</style>
