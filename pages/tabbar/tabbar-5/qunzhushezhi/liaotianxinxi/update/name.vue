<template>
	<view style="padding-top: 5px;">
		<input type="text"   @confirm='confirm' v-model="val" :focus="true"  class="defultInput" :cursor='Number(val.length)'>
		
	</view>
</template>

<script>
	
	export default{
		data(){
			return{
				crowdId:null,
			}
		},
		onLoad(option) {
			this.val = option.val
			this.crowdId = option.crowdId
			
		},
		onNavigationBarButtonTap:function() {
			this.handleSave()
		},
		computed:{
		
		},
		methods:{
			confirm(){
				this.handleSave()
			},
			handleSave(){
				if(this.val.trim() == ''){
					uni.showToast({
						title:'请填写群名称',
						icon:'none'
					})
					return;
				}
				if(this.val.trim().length > 10){
					uni.showToast({
						title:'群名称长度须小于10',
						icon:'none'
					})
					return;
				}
				
				this.$http.httpPostToken('/crowd/updateName',{
					crowdId:this.crowdId,
					name:this.val.trim()
				},(res)=>{
					uni.hideKeyboard()
					uni.navigateBack({});
					uni.$emit("updateName",this.val)
				},true)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.defultInput{
		padding: 0 30upx;
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
