<template>
	<view>
		<view>
			<view class="ulBox" >
						
				<ul class="userList">
					<li v-for="(item,index) in userList" :key="index" v-if="index<(19 + (isSet ? 0 : 1))" @click='liClick(index)' @longpress="longtap(index)">
						<image :src="item.headUrl ? item.headUrl : '/static/moren.png'" style="" mode="aspectFill"></image>
						<text>{{item.nickName}}</text>
						<span class="after" v-if="item.status" :style="{backgroundColor:'red'}">冻结</span>
						<span class="after" v-if="!item.status" v-show="item.role" :style="{backgroundColor:handleText(item.role,'color')}">{{handleText(item.role)}}</span>
					</li>
					<li class="deleteClass" @click="deleteUser" v-if="isSet"></li>
				</ul>
				
				<view>
					<navigator :url="'./renyuan/renyuan?crowdId='+this.crowdId+'&userList='+JSON.stringify(userList)+'&isSet='+JSON.stringify({isSet:isSet})+''" open-type="navigate" hover-class="">
						<view class="bottom"><text>查看全部成员 ></text></view>
					</navigator>
				</view>
			</view>
			<view class="myList">
				<ul>
					<li class="SelectList listBorderTop">
						<navigator :url="'./update/name?crowdId='+(crowdInfo && crowdInfo.id)+'&val='+(crowdInfo &&crowdInfo.name)" :open-type="isSet?'navigate':null" hover-class="">
							<text>群聊名称</text><text>{{ crowdInfo && crowdInfo.name }}</text><image v-if="isSet" src="/static/img/wo/youjiantou.png" ></image>
						</navigator>
					</li>
					<li class="SelectList">
						<navigator :url="'../../fenxiang/fenxiang?crowdId='+(crowdInfo && crowdInfo.id)+'&crowdCode='+(crowdInfo && crowdInfo.crowdCode)+''" open-type="navigate" hover-class="">
							<text>分享群ID</text><text>{{crowdInfo && crowdInfo.crowdCode}}</text><image src="/static/img/wo/youjiantou.png"></image>
						</navigator>
					</li>
					<li class="SelectList" v-if="!isSet">
						<navigator :url="'./shenqinggudong/shenqinggudong?crowdId='+(crowdInfo && crowdInfo.id)+''"  open-type="navigate" hover-class="">
							<text>申请股东</text><image src="/static/img/wo/youjiantou.png"></image>
						</navigator>
					</li>
					<li class="SelectList">
						<navigator :url="'./wodexiaji/wodexiaji?crowdId='+(crowdInfo && crowdInfo.id)+''"  open-type="navigate" hover-class="">
							<text>我的下级</text><image src="/static/img/wo/youjiantou.png"></image>
						</navigator>
					</li>
					
					<li class="SelectListMax"  v-if="isSet">
						<navigator :url="'./update/notice?crowdId='+(crowdInfo && crowdInfo.id)+'&val='+(crowdInfo && crowdInfo.notice)+''" :open-type="isSet?'navigate':null" hover-class="">
							<text>群公告</text><image   src="/static/img/wo/youjiantou.png" ></image>
							<view class="bottom">
								<text>{{crowdInfo && crowdInfo.notice}}</text>
							</view>
						</navigator>
					</li>
					
					<li class="SelectListMax" style="height: 180px;" v-if="!isSet">
						<navigator :url="'./update/notice?crowdId='+(crowdInfo && crowdInfo.id)+'&val='+(crowdInfo && crowdInfo.notice)+''" :open-type="isSet?'navigate':null" hover-class="">
							<text>群公告</text>
							<view class="bottom">
								<textarea class="defultInput" disabled="true" :value="(crowdInfo? crowdInfo.notice:'')"></textarea>
							</view>
						</navigator>
					</li>
					
					
					<li class="SelectListMax listBorderTop"  v-if="isSet">
						<navigator :url="'./update/inNotice?crowdId='+(crowdInfo && crowdInfo.id)+'&val='+(crowdInfo && crowdInfo.inNotice)+''" :open-type="isSet?'navigate':null" hover-class="">
							<text>群须知</text><image src="/static/img/wo/youjiantouHuise.png" ></image>
							<view class="bottom">
								<text>{{crowdInfo && crowdInfo.inNotice}}</text>
							</view>
						</navigator>
					</li>
					
					<li class="SelectListMax listBorderTop" style="height: 180px;"  v-if="!isSet">
						<navigator :url="'./update/inNotice?crowdId='+(crowdInfo && crowdInfo.id)+'&val='+(crowdInfo && crowdInfo.inNotice)+''" :open-type="isSet?'navigate':null" hover-class="">
							<text>群须知</text>
							<view class="bottom">
								<textarea class="defultInput" disabled="true" :value="(crowdInfo ? crowdInfo.inNotice:'')"></textarea>
							</view>
						</navigator>
					</li>
					<li class="SelectList listBorderTop" v-if="isSet">
						<navigator :url="'./shangchuanma/shangchuanma?crowdInfo='+JSON.stringify(crowdInfo)+''" open-type="navigate" hover-class="">
							<text>上传收款码及微信号</text><image src="/static/img/wo/youjiantou.png"></image>
						</navigator>
					</li>
					
					<!-- 
					<li class="SelectList">
						
						<text>消息免打扰</text> <switch :checked='switchStatus.miandarao' @change="miandarao"/>
						
					</li>
					-->
					<li class="SelectList" v-if="isSet">
						
						<text>开启群禁言</text> <switch :checked='!(crowdInfo && Number(crowdInfo.bannedPost))' @change="qunjinyan"/>
						
					</li>
					<li class="SelectList" v-if="isSet">
						
						<text>开启封盘</text> <switch :checked='!(crowdInfo && Number(crowdInfo.bannedClose))' @change="qunfengpan"/>
						
					</li>
					<li class="SelectList" v-if="isSet">
						
						<text>开启查功能</text> <switch :checked='(crowdInfo && Number(crowdInfo.bannedCha))' @change="quncha"/>
						
					</li>
					
					<!-- 
					<li class="SelectList">
						
						<text>置顶聊天</text> <switch :checked='switchStatus.zhiding' @change="zhiding"/>
						
					</li>
					-->
					
					<li class="SelectList" v-if="isSet">
						
						<text>中雷提示</text> <switch :checked='(crowdInfo && Number(crowdInfo.bannedLei))' @change="zhonglei"/>
						
					</li>
					
					<li class="SelectList listBorderTop" v-if="isSet">
						<navigator :url="'./update/fabao?crowdId='+(crowdInfo && crowdInfo.id)+'&minVal='+(crowdInfo && crowdInfo.redMinAmount)+'&maxVal='+(crowdInfo && crowdInfo.redMaxAmount)" open-type="navigate" hover-class="">
						
							<text>发包金额修改</text>
							<text>{{ crowdInfo? crowdInfo.redMinAmount:'' }} - {{ crowdInfo? crowdInfo.redMaxAmount:'' }}</text>
							<image src="/static/img/wo/youjiantou.png"></image>
						</navigator>
					</li>
					<li class="SelectList" v-if="isSet && (crowdInfo && crowdInfo.playerType=='SAO_LEI')">
						<navigator :url="'./update/fabaopeilv?crowdId='+(crowdInfo && crowdInfo.id)+'&redOdds='+(crowdInfo && crowdInfo.redOdds)+''" open-type="navigate" hover-class="">
							<text>修改群赔率倍数</text>
							<text>{{ crowdInfo && crowdInfo.redOdds }}倍</text>
							<image src="/static/img/wo/youjiantou.png"></image>
						</navigator>
					</li>
					
					<li class="SelectList" v-if="isSet && (crowdInfo && crowdInfo.playerType=='MORE_SAO_LEI')">
						<navigator :url="'./update/fabaopeilv2?crowdId='+(crowdInfo && crowdInfo.id)+'&redOddsTwo='+(crowdInfo && crowdInfo.redOddsTwo)+''" open-type="navigate" hover-class="">
							<text>修改2中2赔率</text>
							<text>{{ crowdInfo && crowdInfo.redOddsTwo }}倍</text>
							<image src="/static/img/wo/youjiantou.png"></image>
						</navigator>
					</li>
					
					<li class="SelectList" v-if="isSet && (crowdInfo && crowdInfo.playerType=='MORE_SAO_LEI')">
						<navigator :url="'./update/fabaopeilv3?crowdId='+(crowdInfo && crowdInfo.id)+'&redOddsThree='+(crowdInfo && crowdInfo.redOddsThree)+''" open-type="navigate" hover-class="">
							<text>修改3中3赔率</text>
							<text>{{ crowdInfo && crowdInfo.redOddsThree }}倍</text>
							<image src="/static/img/wo/youjiantou.png"></image>
						</navigator>
					</li>
					
					<li class="SelectList" v-if="isSet && (crowdInfo && crowdInfo.playerType=='MORE_SAO_LEI')">
						<navigator :url="'./update/fabaopeilv4?crowdId='+(crowdInfo && crowdInfo.id)+'&redOddsFour='+(crowdInfo && crowdInfo.redOddsFour)+''" open-type="navigate" hover-class="">
							<text>修改4中4赔率</text>
							<text>{{ crowdInfo && crowdInfo.redOddsFour }}倍</text>
							<image src="/static/img/wo/youjiantou.png"></image>
						</navigator>
					</li>
					
					
					<li class="SelectList listBorderTop" v-if="isSet">
						<navigator :url="'./update/hongbaotime?crowdId='+(crowdInfo && crowdInfo.id)+'&valueStr='+(crowdInfo && crowdInfo.redInavlidTime)+''" open-type="navigate" hover-class="">
							<text>红包失效时间</text><text>{{crowdInfo && crowdInfo.redInavlidTime}}分</text><image src="/static/img/wo/youjiantou.png"></image>
						</navigator>
					</li>
					<li class="SelectList" v-if="isSet">
						<navigator :url="'./update/hongbaofandian?crowdId='+(crowdInfo && crowdInfo.id)+'&valueStr='+(crowdInfo && Number(crowdInfo.redRebate)*100)+''" open-type="navigate" hover-class="">
							<text>红包返点</text><text>{{crowdInfo && Number(crowdInfo.redRebate)*100}}%</text><image src="/static/img/wo/youjiantou.png"></image>
						</navigator>
					</li>
					<li class="SelectList" v-if="isSet">
						<navigator :url="'./update/tjrfandian?crowdId='+(crowdInfo && crowdInfo.id)+'&valueStr='+(crowdInfo && Number(crowdInfo.referrerRebate) * 100)+''" open-type="navigate" hover-class="">
							<text>推荐人返点</text><text>{{crowdInfo && Number(crowdInfo.referrerRebate) * 100}}%</text><image src="/static/img/wo/youjiantou.png"></image>
						</navigator>
					</li>
					<li class="SelectList" v-if="isSet">
						<navigator :url="'./update/tjrupfandian?crowdId='+(crowdInfo && crowdInfo.id)+'&valueStr='+(crowdInfo && Number(crowdInfo.referrerUpRebate) *100)+''" open-type="navigate" hover-class="">
							<text>推荐人上级返点</text><text>{{crowdInfo && Number(crowdInfo.referrerUpRebate) *100 }}%</text><image src="/static/img/wo/youjiantou.png"></image>
						</navigator>
					</li>
					<li class="SelectList listBorderTop" v-if="isSet">
						<navigator :url="'./update/shangfen?crowdId='+(crowdInfo && crowdInfo.id)+'&valueStr='+(crowdInfo && crowdInfo.shangfenMinAmount)+''" open-type="navigate" hover-class="">
							<text>上分最低金额</text><text>{{crowdInfo && crowdInfo.shangfenMinAmount}}</text><image src="/static/img/wo/youjiantou.png"></image>
						</navigator>
					</li>
					<li class="SelectList" v-if="isSet">
						<navigator :url="'./update/xiafen?crowdId='+(crowdInfo && crowdInfo.id)+'&valueStr='+(crowdInfo && crowdInfo.xiafenMinAmount)+''" open-type="navigate" hover-class="">
							<text>下分最低金额</text><text>{{crowdInfo && crowdInfo.xiafenMinAmount}}</text><image src="/static/img/wo/youjiantou.png"></image>
						</navigator>
					</li>
					<li class="SelectList nullBottom">
						<navigator :url="'./tiaozhengguizhe/tiaozhengguizhe?guizheList='+JSON.stringify(jiangliguizheList)+''" :open-type="isSet ? 'navigate':null" hover-class="">
							<text>奖励规则</text><text v-if="isSet">调整规则</text><image v-if="isSet" src="/static/img/wo/youjiantou.png" ></image>
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
		
		<chunLei-modal v-model="value" :mData="data" :type="type" @onConfirm="onConfirm" @cancel="cancel" :navHeight="height" :tabbarHeight="0">
			
			<view class="custom-view" @tap.stop>
				<view class="hongbao" style="text-align: center;" :class="hideButton ? null : 'miniHongbao'">
					<view><text>设置权限</text></view>
					<view v-if="hideButton"><button :plain='true' size='mini' style="margin-top: 15upx;" :class="setRole == 'KE_FU' ? 'active' : null" @click="setClick('KE_FU')">设为客服</button></view>
					<view v-if="hideButton"><button :plain='true' size='mini' style="margin-top: 15upx;" :class="setRole == 'CAI_WU' ? 'active' : null" @click="setClick('CAI_WU')">设为财务</button></view>
					<view v-if="hideButton"><button :plain='true' size='mini' style="margin-top: 15upx;" :class="setRole == 'MIAN_SI' ? 'active' : null" @click="setClick('MIAN_SI')">设为免死号</button></view>
					<view v-if="hideButton"><button :plain='true' size='mini' style="margin-top: 15upx;" :class="setRole == 'GU_KE' ? 'active' : null" @click="setClick('GU_KE')">设为普通用户</button></view>
					<view v-if="hideButton"><button :plain='true' size='mini' style="margin-top: 15upx;" :class="setRole == 'GU_DONG' ? 'active' : null" @click="setClick('GU_DONG')">设为股东</button></view>
					<view><button :plain='true' size='mini' style="margin-top: 15upx;" @click="setClick('DONG_JIE')">{{isDongjieText}}</button></view>
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
				userList:[], //群成员
				crowdInfo:null, //群信息
				jiangliguizheList:null, //奖励规则
				crowdId:null,
				switchStatus:{} ,//置顶，消息免打扰，中雷提示 开关状态
				isDongjieText:'', //冻结还是解冻,
				userInfo:null, 
				isSet: false //true就是群主
			}
		},
		computed:{
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
			uni.setNavigationBarTitle({
				title:"群设置"
			})
		
			this.crowdId = option.crowdId
			this.switchStatus = uni.getStorageSync("switchStatus"+this.crowdId+"") ? uni.getStorageSync("switchStatus"+this.crowdId+"") : {}
			
			this.userInfo = uni.getStorageSync('userInfo')
			
			this.getCrowdInfo(option.crowdId)
			this.getUserList(option.crowdId)
			this.getJiangliguizhe(option.crowdId)
			uni.$on('updateName',(data)=>{
				this.crowdInfo.name = data;
			})
			uni.$on('updateNotice',(data)=>{
				console.log(data)
				this.crowdInfo.notice = data;
			})
			uni.$on('updateInNotice',(data)=>{
				this.crowdInfo.inNotice = data;
			})
			uni.$on('updateWxAccount',(data)=>{
				this.crowdInfo.wxAccountSh = data;
			})
			uni.$on('updateZfbAccount',(data)=>{
				this.crowdInfo.zfbAccount = data;
			})
			uni.$on('updateQunzhuAccount',(data)=>{
				this.crowdInfo.qunZhuAccount = data;
			})
			
			uni.$on('wxFile',(data)=>{
					console.log(data)
				this.crowdInfo.wxUrl = data;
			})
			uni.$on('zfbFile',(data)=>{
					console.log(data)
				this.crowdInfo.zfbUrl = data;
			})
			uni.$on('qunZhuFile',(data)=>{
				console.log(data)
				this.crowdInfo.qunZhuUrl = data;
			})
			uni.$on('updateRedAmount',(data)=>{
				console.log(data)
				this.crowdInfo.redMinAmount = data.redMinAmount;
				this.crowdInfo.redMaxAmount = data.redMaxAmount;
			})
			uni.$on('updateRedOdds',(data)=>{
				console.log(data)
				this.crowdInfo.redOdds = data;
			})
			uni.$on('updateRedOddsTwo',(data)=>{
				console.log(data)
				this.crowdInfo.redOddsTwo = data;
			})
			uni.$on('updateRedOddsThree',(data)=>{
				console.log(data)
				this.crowdInfo.redOddsThree = data;
			})
			uni.$on('updateRedOddsFour',(data)=>{
				console.log(data)
				this.crowdInfo.redOddsFour = data;
			})
			
			uni.$on('updateRedInavlidTime',(data)=>{
				console.log(data)
				this.crowdInfo.redInavlidTime = data;
			})
			uni.$on('updateRedRebate',(data)=>{
				console.log(data)
				this.crowdInfo.redRebate = data;
			})
			uni.$on('updateReferrerRebate',(data)=>{
				console.log(data)
				this.crowdInfo.referrerRebate = data;
			})
			uni.$on('updateReferrerUpRebate',(data)=>{
				console.log(data)
				this.crowdInfo.referrerUpRebate = data;
			})
			uni.$on('updateShangfenMinAmount',(data)=>{
				console.log(data)
				this.crowdInfo.shangfenMinAmount = data;
			})
			
			uni.$on('updateXiafenMinAmount',(data)=>{
				console.log(data)
				this.crowdInfo.xiafenMinAmount = data;
			})
			
			uni.$on('updateInfo',(data)=>{ //数据变化后，重新拿才准确
				// console.log('监听到事件来自 update ，携带参数 msg 为：' + data.msg);
				// this.getCrowdInfo(option.crowdId)
				this.getJiangliguizhe(option.crowdId)
			})
			
			uni.$on('updateUser',(data)=>{ //数据变化后，重新拿才准确
				this.getUserList(option.crowdId)
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
		onShow() {
			
		},
		methods:{
			onConfirm(){},
			cancel(){},
			qunjinyan(e){
				const is = e.detail.value ? 0 : 1
				this.$http.httpPostToken('/crowd/updateBannedPost',{
					crowdId: this.crowdInfo.id,
					bannedPost:is
				},(res)=>{
					this.crowdInfo.bannedPost = is;
				},false);
			},
			qunfengpan(e){
				const is = e.detail.value ? 0: 1
				this.$http.httpPostToken('/crowd/updateBannedClose',{
					crowdId: this.crowdInfo.id,
					bannedClose:is
				},(res)=>{
					this.crowdInfo.bannedClose = is;
				},false);
			},
			quncha(e){
				const is = e.detail.value ? 1 : 0
				
				this.$http.httpPostToken('/crowd/updateBannedCha',{
					crowdId: this.crowdInfo.id,
					bannedCha:is
				},(res)=>{
					this.crowdInfo.bannedCha = is;
				},false);
			},
			zhiding(e){
				this.switchStatus.zhiding = e.detail.value
				
				try{
					uni.setStorageSync('switchStatus'+this.crowdId+'', this.switchStatus)
				}catch(err){
					
				}
				
			},
			miandarao(e){
				this.switchStatus.miandarao = e.detail.value
				
				try{
					uni.setStorageSync('switchStatus'+this.crowdId+'', this.switchStatus)
				}catch(err){
					
				}
				
			},
			zhonglei(e){
		
				const is = e.detail.value ? 1 : 0
				
				this.$http.httpPostToken('/crowd/updateBannedLei',{
					crowdId: this.crowdInfo.id,
					bannedLei:is
				},(res)=>{
					this.crowdInfo.bannedLei = is;
				},false);
		
			},
			getJiangliguizhe(id){ //奖励规则
				
				this.$http.httpPostToken('/crowd/ruleList',{
					crowdId:id
				},(res) =>{
					this.jiangliguizheList = res.data
				},false)
			
			},
			deleteUser(){ //删除成员
				uni.navigateTo({
					url:'./shanchurenyuan/shenchurenyuan?userList='+JSON.stringify(this.userList)+''
				})
			},
			setClick(type){ //设置角色
				this.value = false
				switch(type){
					case'KE_FU': {this.httpSetRole('/crowd/setUserKefu', this.crowdId, this.userId) ;break}
					case'CAI_WU': {this.httpSetRole('/crowd/setUserCaiwu', this.crowdId, this.userId) ;break}
					case'MIAN_SI': {this.httpSetRole('/crowd/setUserMianSi', this.crowdId, this.userId) ;break}
					case'GU_KE': {this.httpSetRole('/crowd/setUserGuke', this.crowdId, this.userId) ;break}
					case'GU_DONG': {this.httpSetRole('/crowd/setUserGudong', this.crowdId, this.userId) ;break}
					case'DONG_JIE': {this.httpSetRole('/crowd/setUserStatus', this.crowdId, this.userId) ;break}
					
				}
				
			},
			httpSetRole(url,crowdId,userId){
				
				let obj = {
					userId:userId,
					crowdId:crowdId
				}
				
				if(url == '/crowd/setUserStatus'){ //解冻还是冻结
					let is = !this.userList.find((item)=>(item.userId == userId)).status
					obj.status = is ? 1 : 0
				}
				this.$http.httpPostToken(url,obj,(res)=>{
					this.getUserList(crowdId)
				},false)
			
			},
			longtap(index){
				if(!this.isSet){
					return
				}
				if(this.userList[index].role == 'MIAN_SI'){
					
					return
				} 
				
				if(this.userList[index].role == 'CAI_WU'){
					
					return
				} 
				// console.log(this.userList[index].role)
				if(this.userList[index].role == 'QUN_ZHU'){
					this.hideButton = true
				} 
				// else if(this.userList[index].role == 'GU_DONG'){
				// 	this.hideButton = false
				// 	this.value = true
				// 	this.userId = this.userList[index].userId
				// }
				else{
					this.hideButton = true
					this.isDongjieText = this.userList[index].status ? '解冻' : '冻结'
					this.userId = this.userList[index].userId
					this.setRole = this.userList[index].role
					this.value = true
				}
				
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
				// console.log('拿用户是',id)
				this.$http.httpGetToken('/crowd/list',{
					crowdId:id
				},(res) => {
					this.userList = res.data
				},false)
				
			},
			getCrowdInfo(id){
				this.crowdId = id
				this.$http.httpGetToken('/crowd/getById',{
					crowdId:id
				},(res) =>{
					console.log(res	)
					this.isSet = this.userInfo.id == res.data.userId
					this.crowdInfo = res.data
				},true);
			}
		}
	}
</script>

<style lang="scss" >
	page{
		background-color: #eee;
	}
	
	.defultInput{
		background-color: #EEEEEE;
		width: calc(100% - 30px);
		height: 160upx;
		padding: 15px;
		border-radius: 5px;
	}
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
					font-size: 8px;
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
