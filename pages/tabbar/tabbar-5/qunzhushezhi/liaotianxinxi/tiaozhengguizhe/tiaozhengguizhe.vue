<template>
	<view>
		<view class="box">
			<view class="top"><text>修改奖励规则</text> <button  type="primary" @click="httpAdd(index)">添加</button></view>
			<view class="input"> 
				<input type="text" v-model="addName">
				<input type="number" v-model="addRuleCode">
				<input type="number" v-model="addAmount">
			</view>
		</view>
		<view class="content">
			<view class="guizhe" v-for="(item,index) in guizheList" :key="index" :class="index != disabledKey ? '' : 'active'">
				<input type="text" v-model="item.name" :disabled='index != disabledKey'>
				<input type="number" v-model="item.ruleCode" :disabled='index != disabledKey'>
				<input type="number" v-model="item.amount" :disabled='index != disabledKey'>
				<view class="image">
					<image :src='index != disabledKey ? "/static/img/bianji.png" : "/static/img/gou.png"' @click='edit(index)'></image>
					<text>66</text>
					<image src="/static/img/cha.png" @click="httpDelete(index)"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				disabledKey:-1,
				guizheList:[],
				addName:'',
				addRuleCode:'',
				addAmount:''
			}
		},
		onLoad(option){
			this.guizheList = JSON.parse(option.guizheList)
		},
		methods:{
			getGuizhe(crowdId,isAdd){
				this.$http.httpTokenRequest({
					url: '/crowd/ruleList',
					method: 'post'
				}, {
					crowdId:crowdId
				}).then(res => {
					
					if(res.data.success){
						// console.log('奖励规则',res.data.data)
						if(isAdd){
							this.addName=''
							this.addRuleCode=''
							this.addAmount=''
						}
						
						this.guizheList = res.data.data
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
			showToast(val){
				uni.showToast({
					title:val+'不能为空',
					icon:'none'
				})
			},
			httpAdd(index){
				if(this.addName == '') {
					this.showToast('名字')
					return
				} else if(this.addRuleCode == '') {
					this.showToast('倍数')
					return
				}else if(this.addAmount == '') {
					this.showToast('总数')
					return
				}
				this.$http.httpTokenRequest({
					url: '/crowd/ruleAdd',
					method: 'post'
				}, {
					crowdId:this.guizheList[0].crowdId,
					name:this.addName,
					ruleCode:this.addRuleCode,
					amount:this.addAmount
				}).then(res => {
					
					if(res.data.success){
						uni.$emit('updateInfo',{msg:'页面更新1'})
						
						this.getGuizhe(this.guizheList[0].crowdId, true) //拿新数据
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
			httpDelete(index){
				uni.showModal({
					title: "提示",
					content: '是否要删除 '+this.guizheList[index].name+' ？',
					success:  (res)=> {
						if (res.confirm) {
							this.$http.httpTokenRequest({
								url: '/crowd/ruleDel',
								method: 'post'
							}, {
								crowdId:this.guizheList[index].crowdId,
								id:this.guizheList[index].id,
								
							}).then(res => {
								
								if(res.data.success){
									uni.$emit('updateInfo',{msg:'页面更新1'})
									this.getGuizhe(this.guizheList[0].crowdId, false)
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
							
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			},
			httpEdit(index){
				
				this.$http.httpTokenRequest({
					url: '/crowd/ruleEdit',
					method: 'post'
				}, {
					amount:this.guizheList[index].amount,
					crowdId:this.guizheList[index].crowdId,
					id:this.guizheList[index].id,
					name:this.guizheList[index].name,
					ruleCode:this.guizheList[index].ruleCode
				}).then(res => {
					
					if(res.data.success){
						uni.$emit('updateInfo',{msg:'页面更新1'})
						this.disabledKey = -1
						
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
			edit(index){
				if(this.disabledKey == index){
					uni.showModal({
						title: "提示",
						content: '是否确定修改？',
						success:  (res)=> {
							if (res.confirm) {
								this.httpEdit(index)
								
							} else if (res.cancel) {
								
								console.log('用户点击取消');
							}
						}
					})
				}else{
					this.disabledKey = index
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.box{
		height: 140upx;
		position: fixed;
		padding-bottom: 10upx;
		left: 0;
		top:0;
		z-index: 2;
		background-color: #fff;
		.top{
			height: 80upx;
			padding: 0 30upx;
			button{
				background-color:#4cb964; 
				display: inline-block;
				vertical-align: middle;
				width: 120upx;
				height: 60upx;
				line-height: 60upx;
				float: right;
				font-size: 14px;
			}
		}
		.input{
			padding: 10upx 30upx;
			height: 40upx;
			display: flex;
			justify-content: space-between;
			input{
				flex:0 0 25%; 
				border: 1upx solid #ccc;
				border-radius: 5px;
				text-align: center;
			}
		}
	}
	.content{
		margin-top: 150upx;
		.guizhe{
			display: flex;
			justify-content: space-around;
			// line-height: 30px;
			background-color: #fff;
			color: #999;
			text-align: center;
			padding: 15upx 15upx;
			
			input{
				flex:0 0 25%; 
				vertical-align: middle;
			}
			.image{
				flex:0 0 25%;
				text{
					visibility: hidden;
				}
				image{
					vertical-align: middle;
					display: inline-block;
					width: 44upx;
					height: 44upx;
				}
				
			}
			
		}
		.active{
			input{
				box-sizing: border-box;
				border: 1upx solid #ccc;
				border-radius: 5px;
			}
		}
	}
	
	
</style>
