
<template>
    <view>
        <view class="uni-textarea" style="margin-top: 15px;">
            <textarea class="defultInput" :cursor='Number(message.length)' :focus="true"  @confirm='confirm' :maxlength="80" v-model="message" />
         </view>
		<view class="uni-title uni-common-pl" style="margin:15px 0 15px 15px">最大长度80个字，当前：{{ message.length }}个字</view>

		 
        </view>
</template>

<script>
	export default{
		data(){
			return{
				crowdId:null,
				message:''
			}
		},
		onLoad(option) {
		
			this.message = option.val
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
				if(this.message.trim() == ''){
					uni.showToast({
						title:'请填写群公告',
						icon:'none'
					})
					return;
				}
				if(this.message.trim().length > 80){
					uni.showToast({
						title:'群公告长度须小于80',
						icon:'none'
					})
					return;
				}
				
				this.$http.httpPostToken('/crowd/updateNotice',{
					crowdId:this.crowdId,
					notice:this.message.trim()
				},(res)=>{
					uni.hideKeyboard()
					uni.navigateBack({});
					uni.$emit("updateNotice",this.message)
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
