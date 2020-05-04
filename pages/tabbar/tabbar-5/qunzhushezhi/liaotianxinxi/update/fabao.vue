
<template>
    <view>
		 <view class="hongbaofanwei">
			<text>红包金额范围</text>
			<view class="right">
				<input   @confirm='confirm' type="number" v-model="minVal" :cursor='Number(minVal.length)'>
				<text>-</text>
				<input   @confirm='confirm' type="number" v-model="maxVal" :cursor='Number(maxVal.length)' :focus="true">
			</view>
		 </view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				crowdId:null,
				minVal:'',
				maxVal:''
			}
		},
		onLoad(option) {
		
			this.minVal = option.minVal
			this.maxVal = option.maxVal
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
				if(this.minVal.trim() == ''){
					uni.showToast({
						title:'请填写发包最小金额',
						icon:'none'
					})
					return;
				}
				if(this.maxVal.trim() == ''){
					uni.showToast({
						title:'请填写发包最大金额',
						icon:'none'
					})
					return;
				}
				if(Number(this.minVal) > Number(this.maxVal)){
					uni.showToast({
						title:'最小金额不能大于最大金额',
						icon:'none'
					})
					return;
				}
				
				this.$http.httpPostToken('/crowd/updateRedAmount',{
					crowdId:this.crowdId,
					redMinAmount:this.minVal.trim(),
					redMaxAmount:this.maxVal.trim()
				},(res)=>{
					uni.hideKeyboard()
					uni.navigateBack({});
					uni.$emit("updateRedAmount",{
						redMinAmount:this.minVal.trim(),
						redMaxAmount:this.maxVal.trim()
					})
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
