<template>
	<view class="myList">
		<ul>
			<li class="SelectList">
				<text>群名称</text>
				<input class="right" type="text" placeholder-class="input-placeholder" placeholder="请填写您的俱乐部名称" v-model="name">
			</li>
			<li class="SelectListMax1">
				<text>群公告</text>
				<view class="bottom">
					<textarea :maxlength="80"  placeholder-class="input-placeholder" placeholder="最多输入80字" v-model="notice"/>
				</view>
			</li>
			<li class="SelectListMax1">
				<text>进群须知</text>
				<view class="bottom">
					<textarea :maxlength="80"  placeholder-class="input-placeholder" placeholder="最多输入80字" v-model="inNotice"/>
				</view>
			</li>
			<li class="SelectList ">
				<text>红包失效时间</text>
				<input class="right" type="number"  placeholder-class="input-placeholder" placeholder="请输入有效时间(分)" v-model="redInavlidTime">
			</li>
			<li class="SelectList listBorderTop">
				<text>红包返点</text>
				<input class="right" type="number"  placeholder-class="input-placeholder" placeholder="请输入发包返点比率(%)" v-model="redRebate">
			</li>
			<li class="SelectList ">
				<text>推荐人返点</text>
				<input class="right" type="number"  placeholder-class="input-placeholder" placeholder="请输入推荐返点比率(%)" v-model="referrerRebate">
			</li>
			<li class="SelectList ">
				<text>推荐人上级返点</text>
				<input class="right" type="number"  placeholder-class="input-placeholder" placeholder="请输入推荐返点比率(%)" v-model="referrerUpRebate">
			</li>
			<li class="SelectList shizhi">
				<navigator :url="'./wanfashezhi/wanfashezhi?playerType='+playerType+'&redCount='+redCount+'&redMaxAmount='+redMaxAmount+'&redMinAmount='+redMinAmount+'&redOdds='+redOdds+'&oddsTwo='+oddsTwo+'&oddsThree='+oddsThree+'&oddsFour='+oddsFour" open-type="navigate" hover-class="">			
					<text>玩法设置</text>
					<view>
						<input :disabled="true" type="text" placeholder-class="input-placeholder" placeholder="未设置"  v-model="playerType">
						<image src="/static/img/wo/youjiantouHuise.png"></image>
					</view>
				</navigator>
			</li>
			<li class="SelectList listBorderTop">
				<text>申请人微信号</text>
				<input class="right" type="text" placeholder-class="input-placeholder"  placeholder="请输入您的微信账号" v-model="wxAccount">
			</li>
		</ul>
		<view class="bottomBox">
			<button @click="subime" style="background-color:#4cb964;  width: 650upx; margin-left: 50upx;" type="primary">提交审核</button>
			<p>如审核不通过，请联系客服</p>
			<p>
				<text>客服微信：</text>
				<text @click="copy('??????')">?????</text>
			</p>
		</view>
	</view>
</template>

<script>
	
	export default{
		data(){
			return{
				inNotice:'', //进群须知
				name:"" ,//群名称
				notice:"", //群公告
				redInavlidTime:'', //红包失效时间
				
				playerType:"", //游戏类型 SAO_LEI，NIU_NIU,JIE_LONG
				redCount:'', //红包数量
				redMaxAmount:'', //扫雷红包最大金额
				redMinAmount:'', //扫雷红包最少金额
				redOdds:'', //赔率
				oddsTwo:'',
				oddsThree:'',
				oddsFour:'',
				
				redRebate:'', //红包返点
				referrerRebate:'', //推荐人返点
				referrerUpRebate:'', //推荐人上级返点
				wxAccount:'', //申请人微信账号
			}
		},
		onLoad() {
			
			uni.$on('redUpdate',(data)=>{
				// console.log('红包返回的值',data)
				this.playerType = data.playerType //游戏类型 SAO_LEI，NIU_NIU,JIE_LONG
				this.redCount = data.redCount, //红包数量
				this.redMaxAmount = data.redMaxAmount, //扫雷红包最大金额
				this.redMinAmount = data.redMinAmount, //扫雷红包最少金额
				this.redOdds = data.redOdds //赔率
				this.oddsFour = data.oddsFour;
				this.oddsThree = data.oddsThree;
				this.oddsTwo = data.oddsTwo;
			})
		},
		computed:{
		
		},
		methods:{
			copy(str){
				uni.setClipboardData({
					data:str,
					success(){
						uni.showToast({
							title:'已复制微信号',
							icon:'none'
						})
					}
				})
			},
			showToast(val){
				uni.showToast({
					title:'请输入'+val,
					icon:'none'
				})
			},
			gameType(type){
				switch(type){
					case '单雷':{return 'SAO_LEI'}
					case '9包多雷':{return 'SAO_LEI_MORE'}
					
				}
			},
			subime(){
				if(!this.inNotice){
					this.showToast('进群须知')
					return
				}else if(!this.inNotice){
					this.showToast('群名称')
					return
				}else if(!this.notice){
					this.showToast('群公告')
					return
				}else if(this.playerType == ''){
					uni.showToast({
						title:'请设置玩法',
						icon:'none'
					})
					return
				}else if(!this.redInavlidTime){
					this.showToast('红包失效时间')
					return
				}else if(!this.redRebate){
					this.showToast('红包返点')
					return
				}else if(!this.referrerRebate){
					this.showToast('推荐人返点')
					return
				}else if(!this.referrerUpRebate){
					this.showToast('推荐人上级返点')
					return
				}else if(!this.wxAccount){
					this.showToast('申请人微信号')
					return
				}
				
				if(this.playerType == '单雷'){
					this.$http.httpPostToken('/crowd/applySaoLei',{
							inNotice: this.inNotice, //进群须知
							name: this.name,//群名称
							notice: this.notice, //群公告
							redInavlidTime: this.redInavlidTime, //红包失效时间
							
							playerType: 'SAO_LEI', //游戏类型 SAO_LEI，NIU_NIU,JIE_LONG
							redCount: this.redCount, //红包数量
							redMaxAmount: this.redMaxAmount, //扫雷红包最大金额
							redMinAmount: this.redMinAmount, //扫雷红包最少金额
							redOdds: this.redOdds, //赔率
							
							redRebate: Number(this.redRebate)/100, //红包返点
							referrerRebate:  Number(this.referrerRebate)/100, //推荐人返点
							referrerUpRebate: Number(this.referrerUpRebate)/100, //推荐人上级返点
							wxAccount: this.wxAccount, //申请人微信账号
						},(res)=>{
						uni.showToast({
							title:'审核中...'
						})
						setTimeout(()=>{
							uni.navigateBack({})
						},1500)
					},true)
				}
				if(this.playerType == '9包多雷'){
					this.$http.httpPostToken('/crowd/applySaoLeiMore',{
							inNotice: this.inNotice, //进群须知
							name: this.name,//群名称
							notice: this.notice, //群公告
							redInavlidTime: this.redInavlidTime, //红包失效时间
							
							playerType: 'SAO_LEI', //游戏类型 SAO_LEI，NIU_NIU,JIE_LONG
							redCount: this.redCount, //红包数量
							redMaxAmount: this.redMaxAmount, //扫雷红包最大金额
							redMinAmount: this.redMinAmount, //扫雷红包最少金额
							redOddsTwo: this.oddsTwo, //赔率
							redOddsThree: this.oddsThree, //赔率
							redOddsFour: this.oddsFour, //赔率
							redRebate: Number(this.redRebate)/100, //红包返点
							referrerRebate: Number(this.referrerRebate)/100, //推荐人返点
							referrerUpRebate: Number(this.referrerUpRebate)/100,//推荐人上级返点
							wxAccount: this.wxAccount, //申请人微信账号
						},(res)=>{
						uni.showToast({
							title:'审核中...'
						})
						setTimeout(()=>{
							uni.navigateBack({})
						},1500)
					},true)
				}
			}
		}
	}
</script>

<style>
	page{
		background-color: #eee;
	}
	.myList{
		
		font-size: 32upx;
		color: #333;
	}
	.myList ul{
		/* border-top: 1upx solid #ddd; */
		/* border-bottom: 1upx solid #ddd; */
	}
	.myList .SelectList{
		position: relative;
		height: 120upx;
		line-height: 120upx;
		padding: 0upx 50upx;
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
	
	.myList text{
		vertical-align: middle;
		margin-left: 10upx;
	}
	.myList .SelectList .right{
		text-align: right;
		border: 0;
		// border:1px solid #ccc;
		float: right;
		margin-top: 40upx;
	}
	.myList .SelectList image{
		width: 30upx;
		height: 30upx;
		float: right;
		margin-top: 45upx;
	}
	.myList .SelectListMax{
		position: relative;
		height: 160upx;
		// line-height: 120upx;
		padding: 0upx 50upx;
		background-color: #fff;
		border-bottom: 1px solid #ddd;
	}
	.myList .SelectListMax text{
		line-height: 80upx;
	}
	.myList .SelectListMax .bottom{
		border: 0;
		width: 650upx;
		// border:1px solid #ccc;
		// margin-bottom: 15px;
		
	}
	.myList .SelectListMax .bottom input{
		border:0;
		
	}
	

	.input-placeholder{
		color: #ccc;
		font-size:26upx;
	}
	
	
	.myList .SelectListMax1{
		position: relative;
		height: 300upx;
		// line-height: 120upx;
		padding: 0upx 50upx;
		background-color: #fff;
		border-bottom: 1px solid #ddd;
	}
	.myList .SelectListMax1 text{
		line-height: 80upx;
	}
	.myList .SelectListMax1 .bottom{
		border: 0;
		width: 650upx;
		// margin-top: 15px;
	}
	.myList .SelectListMax1 .bottom textarea{
		background-color: #EEEEEE;
		width: calc(100% - 30px);
		height: 120upx;
		padding: 15px;
		border-radius: 5px;
	}
	.shizhi view{
		width: 130upx;
		height: 120upx;
		line-height: 120upx;
		display: inline-block;
		float: right;
		/* margin-top: 20px; */
		/* margin-top: 40px; */
	}
	.shizhi view input{
		width: 100upx;
		text-align: right;
		display: inline-block;
		vertical-align: text-bottom;
		color: #888;
	}
	.bottomBox{
		padding-top: 100upx;
		padding-bottom: 120upx;
		background-color: #fff;
		color:#999;
	}
	.bottomBox p{
		text-align: center;
		padding: 10upx;
	}
	.bottomBox p:first-of-type{
		margin-top: 20upx;
	}
	.bottomBox p:last-of-type{
		
	}
	.bottomBox p:last-of-type text:last-of-type{
		text-decoration:underline;
	}
	
	
</style>
