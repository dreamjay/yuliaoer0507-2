
<template>
    <view>
		 <view class="else">
			<text>红包失效时间</text>
			<view >
				<input @confirm='confirm' type="number" v-model="valueStr" :cursor='Number(valueStr.length)' :focus="true" >
				<text>分</text>
			</view>
		 </view>
		 
		 
	</view>
</template>

<script>
	export default{
		data(){
			return{
				crowdId:null,
				valueStr:''
			}
		},
		onLoad(option) {
			this.valueStr = option.valueStr
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
				if(this.valueStr.trim() == ''){
					uni.showToast({
						title:'请填写红包失效时间',
						icon:'none'
					})
					return;
				}
				if(Number(this.valueStr) <= 0){
					uni.showToast({
						title:'失效时间必须是正整数',
						icon:'none'
					})
					return;
				}
			
				this.$http.httpPostToken('/crowd/updateRedInavlidTime',{
					crowdId:this.crowdId,
					redInavlidTime:this.valueStr.trim(),
				},(res)=>{
					uni.hideKeyboard()
					uni.navigateBack({});
					uni.$emit("updateRedInavlidTime",this.valueStr.trim())
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
