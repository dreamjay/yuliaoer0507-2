<template>
	<view>
		<ul class="ulBox" >
			<li v-for="(item,index) in crowds" :key="index" @click="selectCrowdId(item.crowdCode)" >
				
				
				<view class="item">
					<view class="left">
						<text style="font-size: 16px;font-weight: 600;">{{item.name}}</text>
						<text style="line-height: 30upx;">群ID：{{item.crowdCode}}</text>
					</view>
					<view class="tag">
						<image v-if="crowdCode && crowdCode == item.crowdCode" style="width: 30px;height: 30px;" src="../../../../static/img/gou.png"></image>
					</view>
				
					
				</view>
					
					
			</li>
		</ul>
	</view>
	
</template>

<script>
	

	export default{
		data(){
			return{
				crowds:[],
				crowdCode:null
			}
		},
		computed:{
		
		},
		onLoad(option) {
			this.crowdCode = option.crowdCode;
			this.crowds = JSON.parse(option.crowds);
		},
		methods:{
			selectCrowdId(crowdCode){
				this.crowdCode = crowdCode;
				uni.$emit("selectCrowdCode",this.crowdCode);
				uni.navigateBack({
					
				});
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ulBox{
		// border-top: 1upx solid #eee;
		li{
			height: 150upx;
			padding: 0 30upx;
			border-bottom: 1upx solid #eee;
			line-height: 120upx;
			.imageBox{
				margin-top: 20upx;
				width: 110upx;
				height: 110upx;
				display: inline-block !important;
				border-radius: 5px;
				// border: 1upx solid #eee;
				overflow: hidden;
				position: relative;
				vertical-align: middle;
				
				background-color: #eee;
				
			}
			
		}
	}
	
	.item{
		height: 100%;
		display: flex;
	}
	.left{
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 10px 0;
		text{
			height: 75upx;
			line-height: 75upx;
		}
	}
	.tag{
		width: 100px;
		display: flex;
		 flex-direction: column;
		 justify-content: space-around;
	}
</style>
