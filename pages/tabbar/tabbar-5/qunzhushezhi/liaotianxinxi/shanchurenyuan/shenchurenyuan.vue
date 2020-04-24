<template>
	<view>
		<view class="search">
			<image src="/static/sousuo.png"></image>
			<input type="text" placeholder="搜索" v-model="searchVal">
		</view>
		<view class="ulBox" >
			<ul class="myList">
				<!-- <li v-for="(item,index) in showUserList" :key="index" >
					<image :src="item.headUrl ? item.headUrl : '/static/img/weixin.png'" style="" mode="aspectFill"></image>
					<text>{{item.nickName}}</text>
					<span class="after" v-show="item.role" :style="{backgroundColor:handleText(item.role,'color')}">{{handleText(item.role)}}</span>
				</li> -->
				<checkbox-group @change="checkboxChange">
					<li class="SelectList" v-for="(item,index) in showUserList" :key="index">
						
						<image :src="item.headUrl ? item.headUrl : '/static/moren.png'" mode=""></image>
						<text>{{item.nickName}}</text> 
						<checkbox :value="String(index)" color='#4CB964'/>
						
					</li>
				</checkbox-group>
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
				searchVal:'',
				deleteVal:[],
			}
		},
		watch:{
			searchVal(newVal){
				if(newVal==''){
					this.showUserList = this.userList.filter((item)=>(item.role == 'GU_KE'))
				}else{
					this.showUserList = this.showUserList.filter((item)=>(item.nickName.indexOf(newVal) != -1))
				}
			}
		},
		onLoad(option) {
			// console.log(JSON.parse(option.userList))
			this.userList = JSON.parse(option.userList)
			this.showUserList = this.userList.filter((item)=>(item.role == 'GU_KE')) //只能删顾客
			
		},
		onNavigationBarButtonTap:function() {
			
			this.deleteUser(this.deleteVal)
		},
		methods:{
			deleteUser(del){
				
				this.$http.httpTokenRequest({
					url: '/crowd/delsByUser',
					method: 'post'
				}, {
					crowdId:del[0].crowdId,
					ids:del.map((item)=>(item.id))
				}).then(res => {
					
					if(res.data.success){
						// console.log('删除成员',res.data.data)
						uni.showToast({
							title:'已删除'
						})
						uni.$emit('updateInfo',{msg:'页面更新1'})
						setTimeout(()=>{
							uni.navigateBack({})
						},1500)
					}else{
						uni.showToast({
							title:res.data.msg,
							icon:'none'
						})
						
					}
				},error => {
					uni.showToast({
						title:'错误'+error,
						icon:'none'
					})
				}) 
			},
			checkboxChange(data){
				
				this.deleteVal = this.showUserList.filter((item,index)=>(!!data.detail.value.find((itemm)=>(itemm == index))) === '0' ? true : data.detail.value.find((itemm)=>(itemm == index)))
				
				// console.log('this.deleteVal',this.deleteVal)
			},
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
				}
				
			},
		}
	}
</script>

<style lang="scss">
	.uni-checkbox-input:hover{
		border: 1upx solid #d1d1d1!important;
	}
	.search{
		padding: 20upx 20upx 20upx 20upx;
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
	.myList{
		margin-top: 80upx;
		font-size: 28upx;
		color: #333;
	}
	// .myList ul{
	// 	border-top: 1upx solid #ddd;
	// 	border-bottom: 1upx solid #ddd;
	// }
	.myList .SelectList{
		position: relative;
		height: 140upx;
		line-height: 140upx;
		padding: 0upx 50upx;
		background-color: #fff;
		border-bottom: 1px solid #ddd;
	}
	
	.myList text{
		vertical-align: middle;
		margin-left: 15upx;
		color: #666;
	}
	.myList .SelectList image:first-of-type{
		float: left;
		width: 100upx;
		height: 100upx;
		border-radius: 5px;
		display: inline-block;
		margin-top: 20upx;
	}
	.myList .SelectList checkbox{
		float: right;
		vertical-align: middle;
		
	}
</style>
