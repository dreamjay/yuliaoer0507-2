<template>
	<view class="myList" >
		<view :class="show ? 'gameOpen' : ''"></view>
		<ul>
			<li class="SelectList shizhi" @click="open">
				
				<text>玩法设置</text>
				<view>
					<input :disabled="true" type="text" v-model="game">
					<image src="/static/img/wo/youjiantouHuise.png"></image>
				</view>
			</li>
			
			<li class="SelectList double" >
				<text>红包金额范围</text>
				<view>
					<input  type="number" placeholder="最小金额" v-model="min" confirm-type="完成" @confirm='confirm'>
					<text>-</text>
					<input  type="number" placeholder="最大金额" v-model="max" confirm-type="完成" @confirm='confirm'>
				</view>
			</li>
			<li class="SelectList" >
				<text>红包几包</text>
				<input class="right" type="number" placeholder="请设置红包个数" v-model="beishu" confirm-type="完成" @confirm='confirm'>
			</li>
			<li class="SelectList" >
				<text>红包几倍</text>
				<input class="right" type="number" placeholder="请设置红包倍数" v-model="shuliang" confirm-type="完成" @confirm='confirm'>
			</li>
			
		</ul>
		<uni-transition @click="open" :mode-class="['zoom-in']" :duration="100" :show="show" @change="change" :styles="{
			'zIndex':'8',
			'backgroundColor':'#fff',
			'position':'absolute',
			'width':'220px',
			'height':'180px',
			'padding':'20px',
			'borderRadius':'5px',
			'top':'44%',
			'left':'50%',
			'transform':'translate(-50%,-50%)',
			'box-shadow': '0px 0px 33px #ccc;'
			}" >
			<view class="gameBox" style="width: 100%; height: 180px;">
				<view class="game" style="width: 100%; height: 33.33%; line-height: 60px;" @click="gameClick(1)">
					<text>扫雷</text>
					<image src='/static/img/gou.png' mode='aspectFit' style="margin-left: 70%; width: 20px; height: 20px; vertical-align: middle;" v-if="gameIndex == 1"></image>
				</view>
				<view class="game" style="width: 100%; height: 33.33%; line-height: 60px;" @click="gameClick(2)">
					<text>接龙</text>
					<image src='/static/img/gou.png' mode='aspectFit' style="margin-left: 70%; width: 20px; height: 20px; vertical-align: middle;" v-if="gameIndex == 2"></image>
				</view>
				<view class="game" style="width: 100%; height: 33.33%; line-height: 60px;" @click="gameClick(3)">
					<text>牛牛</text>
					<image src='/static/img/gou.png' mode='aspectFit' style="margin-left: 70%; width: 20px; height: 20px; vertical-align: middle;" v-if="gameIndex == 3"></image>
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
				min:''
			}
		},
		onLoad(option) {
			console.log(option)
			if(option.playerType != '未设置'){
				this.game = option.playerType
				this.beishu = option.redOdds
				this.shuliang = option.redCount
				this.max = option.redMaxAmount
				this.min = option.redMinAmount
				switch(option.playerType){
					case '扫雷':{this.game="扫雷";this.gameIndex=1; break}
					case '接龙':{this.game="接龙";this.gameIndex=2; break}
					case '牛牛':{this.game="牛牛";this.gameIndex=3; break}
				}
			}else{
				this.game = '扫雷',
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
							
							if(!this.shuliang){
								this.showToast('红包数量')
								return
							} else if(!this.beishu){
								this.showToast('红包数量')
								return
							}else if(!this.max){
								this.showToast('红包最大金额')
								return
							}else if(!this.min){
								this.showToast('红包最小金额')
								return
							}
							uni.hideKeyboard()
							uni.$emit('redUpdate',{
								playerType:this.game,
								redCount: this.shuliang,
								redMaxAmount: this.max,
								redMinAmount: this.min,
								redOdds: this.beishu
							})
							uni.navigateBack({})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			},
			showToast(val){
				uni.showToast({
					title:val+'不能为空',
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
					case 1:{this.game = '扫雷';break}
					case 2:{this.game = '接龙';break}
					case 3:{this.game = '牛牛';break}
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
		font-size: 28upx;
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
		border-top: 1upx solid #ddd;
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
		width: 100upx;
		height: 120upx;
		line-height: 120upx;
		display: inline-block;
		float: right;
		/* margin-top: 20px; */
		/* margin-top: 40px; */
	}
	.shizhi view input{
		width: 70upx;
		text-align: right;
		display: inline-block;
		vertical-align: text-bottom;
		color: #888;
	}
	
</style>
