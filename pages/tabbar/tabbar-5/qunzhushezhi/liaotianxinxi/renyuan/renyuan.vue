<template>
	<view>
		<view class="search">
			<image src="/static/sousuo.png"></image>
			<input type="text" placeholder="搜索" v-model="val">
		</view>
		<view class="ulBox" >
			<ul class="userList">
				<li v-for="(item,index) in showUserList" :key="index" >
					<image :src="item.headUrl ? item.headUrl : '/static/img/weixin.png'" style="" mode="aspectFill"></image>
					<text>{{item.nickName}}</text>
					<span class="after" v-show="item.role" :style="{backgroundColor:handleText(item.role,'color')}">{{handleText(item.role)}}</span>
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
				userList:[],
				val:'',
			}
		},
		watch:{
			val(newVal){
				if(newVal==''){
					this.showUserList = this.userList
				}else{
					this.showUserList = this.userList.filter((item)=>(item.nickName.indexOf(newVal) != -1))
				}
			}
		},
		onLoad(option) {
			// console.log(JSON.parse(option.userList))
			this.userList = JSON.parse(option.userList)
			this.showUserList = [...this.userList]
			uni.setNavigationBarTitle({
				title:"群成员（53645）"
			})
		},
		methods:{
			handleText:(item,color)=>{
				switch(item){
					case 'QUN_ZHU': {
						if(color){
							return 'red'; break
						}else{
							return '群主'; break
						}
					}
					case 'MIAN_SI': {
						if(color){
							return 'green'; break
						}else{
							return '免死号'; break
						}
					}
					case 'CAI_WU': {
						if(color){
							return 'green'; break
						}else{
							return '财务'; break
						}
					}
					case 'GU_DONG': {
						if(color){
							return 'green'; break
						}else{
							return '股东'; break
						}
					}
					case 'ZONG_DAI': {
						if(color){
							return 'green'; break
						}else{
							return '总代'; break
						}
					}
					case 'KE_FU': {
						if(color){
							return 'green'; break
						}else{
							return '客服'; break
						}
					}
				}
				
			},
		}
	}
</script>

<style lang="scss" scoped>
	.search{
		padding: 0upx 20upx 20upx 20upx;
		border-bottom: 1upx solid #eee;
		position: fixed;
		top: 0;
		left: 0;
		height: 40upx;
		z-index: 8;
		background-color: #fff;
		// box-sizing: border-box;
		image{
			width: 40upx;
			height: 40upx;
			vertical-align: middle;
		}
		input{
			display: inline-block;
			vertical-align: middle;
			width: 655upx;
			padding-left: 15upx;
		}
	}
	.ulBox{
		text-align: center;
		padding: 20upx 0;
		background-color: #fff;
		margin-top: 60upx;
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
					font-size: 1upx;
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
