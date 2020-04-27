<template>
	<view style="padding-top: 5px;">
		<!-- 前三个 -->
		<input type="text"   @confirm='confirm' v-model="val" :focus="true" v-if="type == '群名称' || type=='群公告' || type=='群须知'" class="defultInput" :cursor='Number(val.length)'>
		<!-- 发包金额修改 -->
		<view v-if="type == '发包金额修改'" class="hongbaofanwei">
			<text>{{minTitle}}</text>
			<view class="right">
				<input   @confirm='confirm' type="number" v-model="minVal" :cursor='Number(minVal.length)'>
				<text>-</text>
				<input   @confirm='confirm' type="number" v-model="maxVal" :cursor='Number(maxVal.length)' :focus="true">
			</view>
		</view>
		<!-- 剩下的 -->
		<view v-if="!(type == '群名称' || type=='群公告' || type=='群须知' || type == '发包金额修改')" class="else">
			<text>{{minTitle}}</text>
			<view>
				<input   @confirm='confirm' type="number" v-model="val" :cursor='Number(val.length)' :focus="true" :class="!unit ? 'hiddenText' : null">
				<text v-if="unit">{{unit}}</text>
			</view>
			
		</view>
	</view>
</template>

<script>
	
	export default{
		
		data(){
			return{
				minTitle:'', //子标题
				minVal:'',
				maxVal:'',
				val:'',
				type:'', //修改类型
				crowdId:null,
				unit:null,//单位
			}
		},
		onLoad(option) {
			
			uni.setNavigationBarTitle({
				title:option.title
			})
			this.val = option.val
			this.type = option.title
			
			this.crowdId = option.crowdId
			console.log('进来是',this.crowdId)
			if(option.title == '发包金额修改'){
				
				this.minTitle = '红包金额范围'
				this.maxVal = JSON.parse(option.val).redMaxAmount
				this.minVal = JSON.parse(option.val).redMinAmount
				
			} else if(option.title == '修改群赔率倍数'){
				this.minTitle = '红包几倍'
				
			}else if(option.title == '红包失效时间'){
				this.minTitle = '红包失效时间'
				this.unit = '分'
			}else if(option.title == '红包返点'){
				this.minTitle = '红包返点'
				this.unit = '%'
			}else if(option.title == '推荐人返点'){
				this.minTitle = '推荐人返点'
				this.unit = '%'
			}else if(option.title == '推荐人上级返点'){
				this.minTitle = '推荐人上级返点'
				this.unit = '%'
			}else if(option.title == '上分最低金额'){
				this.minTitle = '上分最低金额'
				
			}else if(option.title == '下分最低金额'){
				this.minTitle = '下分最低金额'
				
			}
			
		},
		onNavigationBarButtonTap:function() {
			this.handleSave()
		},
		methods:{
			confirm(){
				this.handleSave()
			},
			handleSave(){
				let url = ''
				let key = ''
				switch(this.type){
					case '群名称':{
						url = '/crowd/updateName'
						key = 'name'
						break
					}
					case '群公告':{
						url = '/crowd/updateNotice'
						key = 'notice'
						break
					}
					case '群须知':{
						url = '/crowd/updateInNotice'
						key = 'inNotice'
						break
					}
					case '发包金额修改':{
						
						url = '/crowd/updateRedAmount'
						key = ['redMaxAmount','redMinAmount']
						break
					}
					case '修改群赔率倍数':{
						url = '/crowd/updateRedOdds'
						key = 'redOdds'
						break
					}
					case '红包失效时间':{
						url = '/crowd/updateRedInavlidTime'
						key = 'redInavlidTime'
						break
					}
					case '红包返点':{
						url = '/crowd/updateRedRebate'
						key = 'redRebate'
						break
					}
					case '推荐人返点':{
						url = '/crowd/updateReferrerRebate'
						key = 'referrerRebate'
						break
					}
					case '推荐人上级返点':{
						url = '/crowd/updateReferrerUpRebate'
						key = 'referrerUpRebate'
						break
					}
					case '上分最低金额':{
						url = '/crowd/updateShangfenMinAmount'
						key = 'shangfenMinAmount'
						break
					}
					case '下分最低金额':{
						url = '/crowd/updateXiafenMinAmount'
						key = 'xiafenMinAmount'
						break
					}
				}
				this.http(url, key)
			},
			http(url, key){
				let obj = {crowdId:this.crowdId}
				if(typeof(key) === 'string'){
					obj[key] = this.val
				}else{
					obj[key[0]] = this.maxVal
					obj[key[1]] = this.minVal
				}
				
				this.$http.httpPostToken(url,obj,(res) =>{
					
				},false)
				// console.log(key,obj)
				this.$http.httpTokenRequest({
					url: url,
					method: 'post'
				}, obj).then(res => {
					
					if(res.data.success){
						uni.hideKeyboard()
						uni.$emit('updateInfo',{msg:'页面更新1'})
						uni.showToast({
							title:'修改成功'
						})
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
