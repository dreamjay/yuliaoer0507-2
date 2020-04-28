<template>
	<view>
		<view class="ulBox" >
			<ul class="userList">
				<li v-for="(item,index) in showUserList" :key="index">
					<image :src="item.headUrl ? item.headUrl : '/static/moren.png'" style="" mode="aspectFill"></image>
					<text>{{item.nickName}}</text>
				</li>
				
			</ul>
			
		</view>
	
	</view>
</template>

<script>

	export default{
		data(){
			return{
				showUserList:[],
				crowdId:null
			}
		},
		onLoad(option) {
			this.crowdId = option.crowdId
			console.log((this.crowdId))
			this.loadData();
		},
		methods:{
			loadData(){
				this.$http.httpGetToken('/crowd/listByParentUserId',{
					crowdId:this.crowdId
				},(res)=>{
					this.$forceUpdate();
					this.showUserList = res.data;
				},true)
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	.ulBox{
		text-align: center;
		padding: 20upx 0;
		background-color: #fff;
		.userList{
			padding: 0 25upx;
			li{
				float: left;
				width: 140upx;
				height: 140upx;
				padding: 0 0 30upx 0;
				position: relative;
				image{
					width: 100upx;
					height: 100upx;
					border-radius: 5px;
					display: inline-block;
					vertical-align: top;
				}
				text{
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
					word-break: break-all;
					display: inline-block;
					width: 120upx;
					height: 30upx;
					line-height: 30upx;
					color: #999;
					font-size: 12px;
					vertical-align: top;
					
					margin-top: 10upx;
				}
				.after{
					color:#fff;
					padding: 1upx 5upx;
					font-size: 8px;
					line-height: 20upx;
					position: absolute;
					height: 20upx;
					right: 20upx;
					top:10upx;
					border-radius: 10upx 0 0 10upx;
					
				}
			}
			
			
		}
		.userList::before{
			content: '';
			display: block;
			clear: both;
		}
	}
</style>
