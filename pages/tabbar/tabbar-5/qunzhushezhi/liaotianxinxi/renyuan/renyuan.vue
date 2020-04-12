<template>
	<view>
		<view class="search">
			<image src="/static/sousuo.png"></image>
			<input type="text" placeholder="搜索" v-model="val">
		</view>
		<view class="ulBox" >
			<ul class="userList">
				<li v-for="(item,index) in showUserList" :key="index" @longtap="longtap(index)">
					<image :src="item.headUrl ? item.headUrl : '/static/img/weixin.png'" style="" mode="aspectFill"></image>
					<text>{{item.nickName}}</text>
					<span class="after" v-show="item.role" :style="{backgroundColor:handleText(item.role,'color')}">{{handleText(item.role)}}</span>
				</li>
				
			</ul>
			
		</view>
		<chunLei-modal v-model="value" :mData="data" :type="type" @onConfirm="onConfirm" @cancel="cancel" :navHeight="height" :tabbarHeight="0">
			
			<view class="custom-view" @tap.stop>
				<view class="hongbao" style="text-align: center;" :class="hideButton ? null : 'miniHongbao'">
					<view><text>设置权限</text></view>
					<view v-if="hideButton"><button :plain='true' size='mini' style="margin-top: 15upx;" :class="setRole == 'KE_FU' ? 'active' : null" @click="setClick('KE_FU')">设为客服</button></view>
					<view v-if="hideButton"><button :plain='true' size='mini' style="margin-top: 15upx;" :class="setRole == 'CAI_WU' ? 'active' : null" @click="setClick('CAI_WU')">设为财务</button></view>
					<view v-if="hideButton"><button :plain='true' size='mini' style="margin-top: 15upx;" :class="setRole == 'MIAN_SI' ? 'active' : null" @click="setClick('MIAN_SI')">设为免死号</button></view>
					<view v-if="hideButton"><button :plain='true' size='mini' style="margin-top: 15upx;" :class="setRole == 'GU_KE' ? 'active' : null" @click="setClick('GU_KE')">设为普通用户</button></view>
					<view v-if="hideButton"><button :plain='true' size='mini' style="margin-top: 15upx;" :class="setRole == 'ZONG_DAI' ? 'active' : null" @click="setClick('ZONG_DAI')">设为总代</button></view>
					<view v-if="hideButton"><button :plain='true' size='mini' style="margin-top: 15upx;" :class="setRole == 'GU_DONG' ? 'active' : null" @click="setClick('GU_DONG')">设为股东</button></view>
					<view><button :plain='true' size='mini' style="margin-top: 15upx;" @click="setClick('DONG_JIE')">冻结</button></view>
				</view>
				
			</view>
		</chunLei-modal>
	</view>
</template>

<script>
	import chunLeiModal from '@/components/chunLei-modal/chunLei-modal.vue'
	export default{
		components:{chunLeiModal},
		data(){
			return{
				data:{},
				value:false,
				type:'custom',
				height:0, //状态栏加导航栏的高度
				setRole:'',//被设置人的角色
				hideButton: true, //股东就一个按钮
				userId: null, //设置角色时的USERID
				showUserList:[],
				userList:[],
				val:'',
				crowdId:null,
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
		onBackPress(e){
			if(this.value){ //模态框打开了，先关掉在返回
				if(e.from == 'backbutton') {//实体键
					this.value = false
					// setTimeout(()=>{
					// 	uni.navigateBack({})
					// },10)
					return true
				}
				if(e.from == 'navigateBack'){
					return false
				}
			} else{
				return false
			}
		},
		onLoad(option) {
			// console.log(JSON.parse(option.userList))
			this.crowdId = option.crowdId
			this.userList = JSON.parse(option.userList)
			this.showUserList = [...this.userList]
			uni.setNavigationBarTitle({
				title:"群成员（53645）"
			})
			uni.getSystemInfo({
			    success: (e) => {
			      
			      // #ifdef APP-PLUS
			      // console.log('app-plus', e)
			      
			      this.height = e.statusBarHeight + 44
			      // #endif
				}
			})
		},
		methods:{
			setClick(type){ //设置角色
				this.value = false
				switch(type){
					case'KE_FU': {this.httpSetRole('/crowd/setUserKefu', this.crowdId, this.userId,type) ;break}
					case'CAI_WU': {this.httpSetRole('/crowd/setUserCaiwu', this.crowdId, this.userId,type) ;break}
					case'MIAN_SI': {this.httpSetRole('/crowd/setUserMianSi', this.crowdId, this.userId,type) ;break}
					// case'GU_KE': {this.httpSetRole('/crowd/setUserKefu', this.crowdId, this.userId,type) ;break}
					case'ZONG_DAI': {this.httpSetRole('/crowd/setUserZongdai', this.crowdId, this.userId,type) ;break}
					case'GU_DONG': {this.httpSetRole('/crowd/setUserGudong', this.crowdId, this.userId,type) ;break}
					// case'DONG_JIE': {this.httpSetRole('/crowd/setUserKefu', this.crowdId, this.userId,type) ;break}
					
				}
				
			},
			httpSetRole(url,crowdId,userId,type){
				console.log(url,crowdId,userId)
				this.$http.httpTokenRequest({
					url: url,
					method: 'post'
				}, {
					userId:userId,
					crowdId:crowdId
				}).then(res => {
					
					if(res.data.success){
						// console.log(this.showUserList)
						this.showUserList.find((item)=>(item.userId == userId)).role = type
						uni.$emit('updateInfo',{msg:'页面更新1'})
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
			longtap(index){
				// console.log(this.showUserList[index].role)
				if(this.showUserList[index].role == 'QUN_ZHU'){
					this.hideButton = true
				} else if(this.showUserList[index].role == 'GU_DONG'){
					this.hideButton = false
					this.value = true
					this.userId = this.showUserList[index].userId
				}
				else{
					this.hideButton = true
					this.userId = this.showUserList[index].userId
					this.setRole = this.showUserList[index].role
					this.value = true
				}
				
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
	.custom-view{
		overflow: hidden;
		z-index: 999;
		position: absolute;
		top: 40%;
		transform: translateY(-50%);
		.hongbao{
			padding: 50upx;
			width: 300upx;
			height: 666.66upx;
			border-radius: 5px;
			background: #fff;
			view{
				height:83upx;
				line-height: 83upx;
			}
			button{
				width: 300upx;
				
				border-color: #4CB964;
				color: #4CB964;
			}
			.active{
				color: #fff;
				background-color: #4CB964;
			}
		}
		.miniHongbao{
			height: 183.33upx;
		}
		
	}
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
