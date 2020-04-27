<template>
	<view class="myList" >
		<view :class="show ? 'gameOpen' : ''"></view>
		<ul>
			<li class="SelectList shizhi" @click="open">
				
				<text>玩法设置</text>
				<view>
					<input :disabled="true" type="text" placeholder-class="input-placeolder" style="color: #333333;" v-model="game">
					<image src="/static/img/wo/youjiantouHuise.png"></image>
				</view>
			</li>
			
			<li class="SelectList double" >
				<text>红包金额范围</text>
				<view>
					<input  type="number" placeholder="最小金额" v-model="min"   @confirm='confirm'>
					<text>-</text>
					<input  type="number" placeholder="最大金额" v-model="max"   @confirm='confirm'>
				</view>
			</li>
			<li class="SelectList"  v-if="gameIndex == 1">
				<text>红包几包</text>
				<input class="right" type="number" placeholder="请设置红包个数" v-model="shuliang"   @confirm='confirm'>
			</li>
			<li class="SelectList"  v-if="gameIndex == 2">
				<text>红包几包</text>
				<input class="right" type="number" disabled="true" placeholder="请设置红包个数"  value="9"   @confirm='confirm'>
			</li>
			<li class="SelectList"  v-if="gameIndex == 1" >
				<text>红包几倍</text>
				<input class="right" type="number" placeholder="请设置红包赔率" v-model="beishu"   @confirm='confirm'>
			</li>
			
			<li class="SelectList"  v-if="gameIndex == 2" >
				<text>2中2赔率</text>
				<input class="right" type="number" placeholder="请设置2中2赔率" v-model="oddsTwo"   @confirm='confirm'>
			</li>
			
			<li class="SelectList"  v-if="gameIndex == 2" >
				<text>3中3赔率</text>
				<input class="right" type="number" placeholder="请设置3中3赔率" v-model="oddsThree"   @confirm='confirm'>
			</li>
			
			<li class="SelectList"  v-if="gameIndex == 2" >
				<text>4中4赔率</text>
				<input class="right" type="number" placeholder="请设置4中4赔率" v-model="oddsFour"   @confirm='confirm'>
			</li>
			
		</ul>
		<uni-transition @click="open" :mode-class="['zoom-in']" :duration="100" :show="show" @change="change" :styles="{
			'zIndex':'8',
			'backgroundColor':'#fff',
			'position':'absolute',
			'width':'220px',
			'height':'120px',
			'padding':'15px',
			'borderRadius':'5px',
			'top':'44%',
			'left':'50%',
			'transform':'translate(-50%,-50%)',
			'box-shadow': '0px 0px 33px #ccc;'
			}" >
			<view class="gameBox" style="width: 100%; height: 120px;">
				<view class="game" style="width: 100%; height: 50%; line-height: 60px;border-bottom: #DDDDDD solid 1px;" @click="gameClick(1)">
					<text >单雷</text>
					<image src='/static/img/gou.png' mode='aspectFit' style="width: 20px; height: 20px; vertical-align: middle;" v-if="gameIndex == 1"></image>
				</view>
				<view class="game" style="width: 100%; height: 50%; line-height: 60px;" @click="gameClick(2)">
					<text >9包多雷</text>
					<image src='/static/img/gou.png' mode='aspectFit' style=" width: 20px; height: 20px; vertical-align: middle;" v-if="gameIndex == 2"></image>
				</view>
			</view>
		</uni-transition>
	</view>
</template>

<script>
	
	import uniTransition from "@/components/uni-transition/uni-transition.vue"
	
	export default {
		components: { uniTransition},
		data(){
			return{
				show:false,
				game:null, //玩法
				gameIndex:null, //玩法索引
				beishu:'',
				shuliang:'',
				max:'',
				min:'',
				oddsTwo:'',
				oddsThree:'',
				oddsFour:''
			}
		},
		onLoad(option) {
			console.log(option)
			if(option.playerType != ''){
				this.game = option.playerType
				this.beishu = option.redOdds
				this.shuliang = option.redCount
				this.max = option.redMaxAmount
				this.min = option.redMinAmount
				this.oddsFour = option.oddsFour;
				this.oddsThree = option.oddsThree;
				this.oddsTwo = option.oddsTwo;
				switch(option.playerType){
					case '单雷':{this.game="单雷";this.gameIndex=1; break}
					case '9包多雷':{this.game="9包多雷";this.gameIndex=2; break}
				}
			}else{
				this.game = '单雷',
				this.gameIndex = 1
			}
		},
		onNavigationBarButtonTap:function() {
			
			this.save()
		},
		methods:{
			confirm(){
				this.save()
			},
			save(){
				uni.showModal({
					title: "提示",
					content: '是否确定保存',
					success:  (res)=> {
						if (res.confirm) {
							
							if(this.gameIndex == 1){
								if(!this.shuliang){
									this.showToast('红包数量')
									return
								} else if(!this.beishu){
									this.showToast('红包赔率')
									return
								}else if(!this.max){
									this.showToast('红包最大金额')
									return
								}else if(!this.min){
									this.showToast('红包最小金额')
									return
								}
							}
							if(this.gameIndex == 2){
								if(!this.max){
									this.showToast('红包最大金额')
									return
								}
								 if(!this.min){
									this.showToast('红包最小金额')
									return
								}
								if(!this.oddsTwo){
									this.showToast('2中2赔率')
									return
								}
								if(!this.oddsThree){
									this.showToast('3中3赔率')
									return
								}
								if(!this.oddsFour){
									this.showToast('4中4赔率')
									return
								}
							}
							
							uni.hideKeyboard()
							uni.$emit('redUpdate',{
								playerType:this.game,
								redCount: this.shuliang,
								redMaxAmount: this.max,
								redMinAmount: this.min,
								redOdds: this.beishu,
								oddsTwo:this.oddsTwo,
								oddsThree:this.oddsThree,
								oddsFour:this.oddsFour
							})
							uni.navigateBack({})
						} 
					}
				})
			},
			showToast(val){
				uni.showToast({
					title:'请输入'+val,
					icon:'none'
				})
			},
			open(){
				
				this.show = !this.show
			},
			change(){
				
			},
			gameClick(number){
				switch(number){
					case 1:{this.game = '单雷';break}
					case 2:{this.game = '9包多雷';break}
				}
				this.gameIndex = number
				// console.log(number)
			}
		}
	}
</script>

<style>
	page{
		/* background-color: #eee; */
	}
	.myList{
		position: absolute;
		font-size: 32upx;
		color: #333;
		left: 0;
		right: 0;
		top:0;
		bottom: 0;
		z-index: 0;
	}
	
	.gameOpen {
		content:'';
		position: absolute;
		left: 0;
		right: 0;
		top:0;
		bottom: 0;
		z-index: 2;
		background-color: rgba(0,0,0,0.1)/*透明度默认为1*/
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
	
	.myList .double view{
		height: 40upx;
		width: 400upx;
		float: right;
		margin-top: 40upx;
		display: inline-block;
	}
	.myList .double view text{
		float: left;
		vertical-align: middle;
		height: 40upx;
		line-height: 40upx;
	}
	.myList .double view input:first-of-type{
		width: 150upx;
		float: left;
	}
	.myList .double view input:last-of-type{
		width: 150upx;
		float: right;
		margin-right: 30upx;
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
	.shizhi view{
		width: 500upx;
		height: 120upx;
		line-height: 120upx;
		display: inline-block;
		float: right;
		/* margin-top: 20px; */
		/* margin-top: 40px; */
	}
	.shizhi view input{
		width: 400upx;
		text-align: right;
		display: inline-block;
		vertical-align: text-bottom;
		color: #888;
	}
	
	.input-placeholder{
		color: #ccc;
		font-size:26upx;
	}
	
	
	
</style>
