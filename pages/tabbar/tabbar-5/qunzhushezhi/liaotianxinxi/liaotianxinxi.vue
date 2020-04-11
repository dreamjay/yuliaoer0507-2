<template>
	<view>
		<Loading v-if="isLoading"></Loading>
		<view v-show="!isLoading">
			<view class="ulBox" >
				
				<ul class="userList">
					<li v-for="(item,index) in userList" :key="index" v-if="index<19" @click='liClick(index)'>
						<image :src="item.headUrl ? item.headUrl : '/static/img/weixin.png'" style="" mode="aspectFill"></image>
						<text>{{item.nickName}}</text>
						<span class="after" v-show="item.role" :style="{backgroundColor:handleText(item.role,'color')}">{{handleText(item.role)}}</span>
					</li>
					<li class="deleteClass" @click="deleteUser"></li>
				</ul>
				
				<view>
					<navigator :url="'./renyuan/renyuan?userList='+JSON.stringify(userList)+''" open-type="navigate" hover-class="">
						<view class="bottom"><text>查看全部成员 ></text></view>
					</navigator>
				</view>
			</view>
			<view class="myList">
				<ul>
					<li class="SelectList listBorderTop">
						<navigator :url="'./tongyong/tongyong?title=群名称&crowdId='+(crowdInfo && crowdInfo.id)+'&val='+(crowdInfo && crowdInfo.name)+''" open-type="navigate" hover-class="">
							<text>群聊名称</text><text>{{crowdInfo && crowdInfo.name}}</text><image src="/static/img/wo/youjiantou.png"></image>
						</navigator>
					</li>
					<li class="SelectList">
						<navigator :url="'../../fenxiang/fenxiang?crowdId='+(crowdInfo && crowdInfo.id)+'&val='+(crowdInfo && crowdInfo.crowdCode)+''" open-type="navigate" hover-class="">
							<text>分享群ID</text><text>{{crowdInfo && crowdInfo.crowdCode}}</text><image src="/static/img/wo/youjiantou.png"></image>
						</navigator>
					</li>
					<li class="SelectListMax">
						<navigator :url="'./tongyong/tongyong?title=群公告&crowdId='+(crowdInfo && crowdInfo.id)+'&val='+(crowdInfo && crowdInfo.notice)+''" open-type="navigate" hover-class="">
							<text>群公告</text><image src="/static/img/wo/youjiantou.png"></image>
							<view class="bottom">
								<text>{{crowdInfo && crowdInfo.notice}}</text>
							</view>
						</navigator>
					</li>
					
					<li class="SelectListMax listBorderTop">
						<navigator :url="'./tongyong/tongyong?title=群须知&crowdId='+(crowdInfo && crowdInfo.id)+'&val='+(crowdInfo && crowdInfo.inNotice)+''" open-type="navigate" hover-class="">
							<text>群须知</text><image src="/static/img/wo/youjiantou.png"></image>
							<view class="bottom">
								<text>{{crowdInfo && crowdInfo.inNotice}}</text>
							</view>
						</navigator>
					</li>
					<li class="SelectList listBorderTop">
						<navigator :url="'./shangchuanma/shangchuanma?crowdInfo='+JSON.stringify(crowdInfo)+''" open-type="navigate" hover-class="">
							<text>上传收款码及微信号</text><image src="/static/img/wo/youjiantou.png"></image>
						</navigator>
					</li>
					<li class="SelectList">
						
						<text>消息免打扰</text> <switch :checked='switchStatus.miandarao' @change="miandarao"/>
						
					</li>
					<li class="SelectList">
						
						<text>开启群禁言</text> <switch :checked='!!(crowdInfo && Number(crowdInfo.bannedPost))' @change="qunjinyan"/>
						
					</li>
					<li class="SelectList">
						
						<text>开启封盘</text> <switch :checked='!!(crowdInfo && Number(crowdInfo.bannedClose))' @change="qunfengpan"/>
						
					</li>
					<li class="SelectList">
						
						<text>开启查功能</text> <switch :checked='!!(crowdInfo && Number(crowdInfo.bannedCha))' @change="quncha"/>
						
					</li>
					<li class="SelectList">
						
						<text>置顶聊天</text> <switch :checked='switchStatus.zhiding' @change="zhiding"/>
						
					</li>
					<li class="SelectList">
						
						<text>中雷提示</text> <switch :checked='switchStatus.zhonglei' @change="zhonglei"/>
						
					</li>
					
					<li class="SelectList listBorderTop">
						<navigator :url="'./tongyong/tongyong?title=发包金额修改&crowdId='+(crowdInfo && crowdInfo.id)+'&val='+(crowdInfo && JSON.stringify({redMaxAmount:crowdInfo.redMaxAmount,redMinAmount:crowdInfo.redMinAmount}))+''" open-type="navigate" hover-class="">
						
							<text>发包金额修改</text><image src="/static/img/wo/youjiantou.png"></image>
						</navigator>
					</li>
					<li class="SelectList">
						<navigator :url="'./tongyong/tongyong?title=修改群赔率倍数&crowdId='+(crowdInfo && crowdInfo.id)+'&val='+(crowdInfo && crowdInfo.redOdds)+''" open-type="navigate" hover-class="">
							<text>修改群赔率倍数</text><image src="/static/img/wo/youjiantou.png"></image>
						</navigator>
					</li>
					
					<li class="SelectList">
						<navigator :url="'./tongyong/tongyong?title=红包失效时间&crowdId='+(crowdInfo && crowdInfo.id)+'&val='+(crowdInfo && crowdInfo.redInavlidTime)+''" open-type="navigate" hover-class="">
							<text>红包失效时间</text><text>{{crowdInfo && crowdInfo.redInavlidTime}}分</text><image src="/static/img/wo/youjiantou.png"></image>
						</navigator>
					</li>
					<li class="SelectList">
						<navigator :url="'./tongyong/tongyong?title=红包返点&crowdId='+(crowdInfo && crowdInfo.id)+'&val='+(crowdInfo && crowdInfo.redRebate)+''" open-type="navigate" hover-class="">
							<text>红包返点</text><text>{{crowdInfo && crowdInfo.redRebate}}%</text><image src="/static/img/wo/youjiantou.png"></image>
						</navigator>
					</li>
					<li class="SelectList">
						<navigator :url="'./tongyong/tongyong?title=推荐人返点&crowdId='+(crowdInfo && crowdInfo.id)+'&val='+(crowdInfo && crowdInfo.referrerRebate)+''" open-type="navigate" hover-class="">
							<text>推荐人返点</text><text>{{crowdInfo && crowdInfo.referrerRebate}}%</text><image src="/static/img/wo/youjiantou.png"></image>
						</navigator>
					</li>
					<li class="SelectList">
						<navigator :url="'./tongyong/tongyong?title=推荐人上级返点&crowdId='+(crowdInfo && crowdInfo.id)+'&val='+(crowdInfo && crowdInfo.referrerUpRebate)+''" open-type="navigate" hover-class="">
							<text>推荐人上级返点</text><text>{{crowdInfo && crowdInfo.referrerUpRebate}}%</text><image src="/static/img/wo/youjiantou.png"></image>
						</navigator>
					</li>
					<li class="SelectList">
						<navigator :url="'./tongyong/tongyong?title=上分最低金额&crowdId='+(crowdInfo && crowdInfo.id)+'&val='+(crowdInfo && crowdInfo.shangfenMinAmount)+''" open-type="navigate" hover-class="">
							<text>上分最低金额</text><text>{{crowdInfo && crowdInfo.shangfenMinAmount}}</text><image src="/static/img/wo/youjiantou.png"></image>
						</navigator>
					</li>
					<li class="SelectList">
						<navigator :url="'./tongyong/tongyong?title=下分最低金额&crowdId='+(crowdInfo && crowdInfo.id)+'&val='+(crowdInfo && crowdInfo.xiafenMinAmount)+''" open-type="navigate" hover-class="">
							<text>下分最低金额</text><text>{{crowdInfo && crowdInfo.xiafenMinAmount}}</text><image src="/static/img/wo/youjiantou.png"></image>
						</navigator>
					</li>
					<li class="SelectList nullBottom">
						<navigator :url="'./tiaozhengguizhe/tiaozhengguizhe?guizheList='+JSON.stringify(jiangliguizheList)+''" open-type="navigate" hover-class="">
							<text>奖励规则</text><text>调整规则</text><image src="/static/img/wo/youjiantou.png"></image>
						</navigator>
					</li>
					<li class="guizhi" v-for="(item,index) in jiangliguizheList" :key="index">
						<text>{{item.name}}</text>
						<text>{{item.ruleCode}}</text>
						<text>{{item.amount}}</text>
						
					</li>
				</ul>
				
			</view>
		</view>
	</view>
</template>

<script>
	import Loading from '@/components/loading/loading.vue'
	export default{
		components:{Loading},
		data(){
			return{
				userList:[], //群成员
				crowdInfo:null, //群信息
				jiangliguizheList:null, //奖励规则
				crowdId:null,
				switchStatus:{} //置顶，消息免打扰，中雷提示 开关状态
			}
		},
		computed:{
			isLoading:function(){
				return this.$store.state.isLoading
			}
		},
		onLoad(option) {
			uni.setNavigationBarTitle({
				title:"聊天信息（53645）"
			})
			this.$store.commit('watchLoading', true)
			this.crowdId = option.crowdId
			
			this.switchStatus = uni.getStorageSync("switchStatus"+this.crowdId+"") ? JSON.parse(uni.getStorageSync("switchStatus"+this.crowdId+"")) : {}
			
			this.getCrowdInfo(option.crowdId)
			this.getJiangliguizhe(option.crowdId)
			uni.$on('updateInfo',(data)=>{ //数据变化后，重新拿才准确
				// console.log('监听到事件来自 update ，携带参数 msg 为：' + data.msg);
				this.getCrowdInfo(option.crowdId)
				this.getJiangliguizhe(option.crowdId)
			})
		},
		
		methods:{
			qunjinyan(e){
				const is = e.detail.value ? 1 : 0
				this.handleSwitch('bannedPost',is,'/crowd/updateBannedPost')
			},
			qunfengpan(e){
				const is = e.detail.value ? 1 : 0
				this.handleSwitch('bannedClose',is,'/crowd/updateBannedClose')
			},
			quncha(e){
				const is = e.detail.value ? 1 : 0
				this.handleSwitch('bannedCha',is,'/crowd/updateBannedCha')
			},
			zhiding(e){
				this.switchStatus.zhiding = e.detail.value
				uni.setStorageSync('switchStatus'+this.crowdId+'', JSON.stringify(this.switchStatus))
			},
			miandarao(e){
				this.switchStatus.miandarao = e.detail.value
				uni.setStorageSync('switchStatus'+this.crowdId+'', JSON.stringify(this.switchStatus))
			},
			zhonglei(e){
				this.switchStatus.zhonglei = e.detail.value
				uni.setStorageSync('switchStatus'+this.crowdId+'', JSON.stringify(this.switchStatus))
			},
			handleSwitch(key,is,url){
				let obj = {crowdId: this.crowdInfo.id}
				obj[key] = is
				this.$http.httpTokenRequest({
					url: url,
					method: 'post'
				}, obj).then(res => {
					
					if(res.data.success){
						
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
			getJiangliguizhe(id){ //奖励规则
				this.$http.httpTokenRequest({
					url: '/crowd/ruleList',
					method: 'post'
				}, {
					crowdId:id
				}).then(res => {
					
					if(res.data.success){
						// console.log('奖励规则',res.data.data)
						this.jiangliguizheList = res.data.data
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
			deleteUser(){ //删除成员
				uni.navigateTo({
					url:'./shanchurenyuan/shenchurenyuan?userList='+JSON.stringify(this.userList)+''
				})
			},
			liClick(index){
				
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
			getUserList(id){
				this.$http.httpTokenRequest({
					url: '/crowd/list',
					method: 'get'
				}, {
					crowdId:id
				}).then(res => {
					this.$store.commit('watchLoading', false)
					if(res.data.success){
						// console.log('群成员',res.data.data)
						this.userList = res.data.data
						
						
						
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
			getCrowdInfo(id){
				
				this.$http.httpTokenRequest({
					url: '/crowd/getById',
					method: 'get'
				}, {
					crowdId:id
				}).then(res => {
					this.getUserList(this.crowdId)
					if(res.data.success){
						// console.log('群信息',res.data.data)
						this.crowdInfo = res.data.data
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

<style lang="scss" >
	page{
		background-color: #eee;
	}
	.myList .guizhi{
		display: flex;
		justify-content: space-around;
		// line-height: 30px;
		padding: 10px 0px;
		background-color: #fff;
		color: #999;
	}
	.myList{
		
		font-size: 28upx;
		color: #333;
	}
	.myList ul{
		border-top: 1upx solid #ddd;
		border-bottom: 1upx solid #ddd;
	}
	.myList .SelectList{
		position: relative;
		height: 120upx;
		line-height: 120upx;
		padding: 0upx 25upx;
		background-color: #fff;
		/* border-bottom: 1px solid #ddd; */
	}
	
	.myList .SelectList::before{
		content: '';
		position: absolute;
		height: 1upx;
		background-color: #ddd;
		width: calc(100% - 0upx);
		bottom: 0;
		right: 0;
	}
	.myList .nullBottom::before{
		content: '';
		position: absolute;
		height: 0upx;
		background-color: #ddd;
		width: calc(100% - 0upx);
		bottom: 0;
		right: 0;
	}
	.myList .SelectList image{
		width: 40upx;
		height: 40upx;
	}
	
	.myList text{
		vertical-align: middle;
		margin-left: 15upx;
	}
	// .myList .SelectList image:first-of-type{
	// 	float: left;
	// 	margin-top: 40upx;
	// }
	
	.myList .SelectList image:last-of-type{
		float: right;
		margin-top: 40upx;
	}
	.myList .SelectList text:nth-of-type(2){
		position: absolute;
		right: 80upx;
		color:#666;
	}
	.myList .SelectList switch{
		float: right;
	}
	.uni-switch-input-checked{
		background-color: #4cb964!important;
		border-color: #4cb964!important;
	}
	.myList .SelectListMax image{
		width: 40upx;
		height: 40upx;
	}
	.myList .SelectListMax image:last-of-type{
		float: right;
		margin-top: 50upx;
	}
	.myList .SelectListMax{
		position: relative;
		height: 140upx;
		// line-height: 120upx;
		padding: 0upx 25upx;
		background-color: #fff;
		border-bottom: 1px solid #ddd;
	}
	.myList .SelectListMax text{
		line-height: 70upx;
	}
	.myList .SelectListMax .bottom{
		border: 0;
		width: 650upx;
		// border:1px solid #ccc;
		// margin-bottom: 15px;
		
	}
	.myList .SelectListMax .bottom text{
		color:#999;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
		display: inline-block;
		width: 100%;
	}
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
					font-size: 1upx;
					line-height: 20upx;
					position: absolute;
					height: 20upx;
					right: 20upx;
					top:10upx;
					border-radius: 10upx 0 0 10upx;
					
				}
			}
			.deleteClass{
				image{
					display: none;
				}
				text{
					display: none;
				}
				.after{
					display: none;
				}
			}
			.deleteClass::before{
				content:'';
				position: absolute;
				height: 2px;
				width: 70upx;
				top:49upx;
				left: 35upx;
				background-color: #ccc;
				border-radius: 1px;
			}
			.deleteClass::after{
				content:'';
				position: absolute;
				width: 100upx;
				height: 100upx;
				border-radius: 5px;
				box-sizing: border-box;
				border: 1px solid #eee;
				top:0;
				left: 20upx;
			}
			
		}
		.userList::after{
			content: '';
			display: block;
			clear: both;
		}
		.bottom{
			text{
				color: #999;
			}
		}
	}
</style>
