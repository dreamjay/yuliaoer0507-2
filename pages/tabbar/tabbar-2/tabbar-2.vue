<template>
    <view >
		
		<uni-indexed-list  :options="dataList" :showSelect="false" @click="bindClick">
			
			
		</uni-indexed-list>
		<uni-transition @click="open(true)" :mode-class="['zoom-in']" :duration="50" :styles="{
			'zIndex':'8',
			'width':'100px',
			'height':'60px',
			'line-height':'60px',
			'backgroundColor':'black',
			'borderRadius':'4px',
			'top':'0px',
			'right':'0px',
			'position':'absolute',
			}" :show="show">
				<view style="width: 10px!important; height: 10px; border-radius:0 4px 0 0; background-color: black; position: absolute; right: 0; top:0; transform: rotate(45deg);"></view>
				<image src="/static/img/xiaoxi.png" style="height:20px; width: 20px; position: absolute; left: 10px; top: 20px;" ></image>
				<text style="color:#fff; margin-left: 30px; vertical-align: super;">我要建群</text>
			
		</uni-transition>
	</view>
</template>
<script>
	import uniIndexedList from "@/components/uni-indexed-list/uni-indexed-list.vue"
	import pyUtils from '@/common/pyUtils.js';
	export default {
		components: {uniIndexedList},
		data(){
			return{
				zhuangtailan:0,
				show:false,
				dataList:[{
						"letter":"",
						data:[
							{
							headImg:"/static/icon_ql.png",
							text:"群聊",	
							}
						]
					}],
			}
		},
		mounted() {
			this.$nextTick( ()=> {
				
			})
		},
		onNavigationBarButtonTap(obj){
			this.open(false);
		},
		onNavigationBarSearchInputClicked(e){
			uni.navigateTo({
				url:'/pages/tabbar/tabbar-2/search/search',
				animationType: 'fade-in',
				animationDuration: 200
			})
		},
		onLoad() {
			//获取系统状态栏高度
			// #ifdef APP-PLUS
			this.zhuangtailan = plus.navigator.getStatusbarHeight();
			
			// #endif
			
			this.refreshFried();
			
			
		},
		onShow(){
			
			uni.getStorage({
				key:"friendList",
				success(dataList) {
					this.dataList = dataList;
				}
			})
			
		},
		
		methods:{
			refreshFried(){
				this.$http.httpGetToken("/user-friend/listByUser",{},(res) =>{
					console.log(res)
					var data = res.data;
					var dataList = [{
							"letter":"",
							data:[
								{
								headImg:"/static/icon_ql.png",
								text:"群聊",	
								}
							]
						}];
					this.dataList = dataList.concat(this.convertList(data))
					uni.setStorage({
						key:"friendList",
						data:this.dataList
						
					})
					console.log(this.dataList)
				},false)
			},
			convertList(obj){
				var arr = new Array();
				var letter = new Array();
				for(var i=0;i<obj.length;i++){
					console.log(obj[i])
					if(!obj[i].nickName){
						continue;
					}
					obj[i].letter = this.getFirstLetter(obj[i].nickName);
					 if(letter.indexOf(obj[i].letter) == -1){
						letter.push(obj[i].letter);
					}
				}
				letter.sort();
				for(var i=0;i<letter.length;i++){
					var barr = new Array();
					for(var j=0;j<obj.length;j++){
						if(letter[i] == obj[j].letter){
							barr.push({
								headImg:obj[j].headUrl,
								text:obj[j].nickName,
								userId:obj[j].friendUserId
							});
						}
						
					}
					var s = {
						letter:letter[i],
						data:barr
					};
					arr.push(s);
				}
				console.log(arr)
				return arr;
			},
			getFirstLetter(nickName){
				console.log(nickName)
				var a = nickName.substring(0,1);
				var b = pyUtils.getFirst(a);
				return b;
			},
			bindClick(e){
				if(e.item.name == '群聊'){
					uni.navigateTo({
						url:'../tabbar-5/qunliao/qunliao'
					})
				}else{
					
					uni.navigateTo({
						url:'../tabbar-2/qunliao/gerenliao?userId='+e.item.userId+'&nickName='+e.item.name,
						animationType:'fade-in'
					})
				}
			},
			open(is) {
				console.log(is)
				this.show = !this.show
				if(is) {
					uni.navigateTo({
						url:'/pages/tabbar/tabbar-2/newCrowd/newCrowd',
						animationType:"fade-in"
					})
				}
				
			}
		}
	};
</script>
<style lang="scss">
	page{
		background-color: #EEEEEE;
	}
	.qunliaoBox{
		background-color: #FFFFFF;
		.qunliao{
			height: 60px;
			padding: 0 15px;
			line-height: 60px;
			image{
				// position: absolute;
				// z-index: 2;
				vertical-align: middle;
				height: 40px;
				width: 40px;
			}
			
			text{
				font-size: 14px;
				margin-left: 20upx;
				vertical-align: middle;
			}
		}
	}
	#list{
		
		.uni-indexed-list__item-border{
			position: relative;
			border: 0!important;
			
		}
		.uni-indexed-list__item-border::after{
			content: "";
			position: absolute;
			height: 1upx ;
			background-color: #eee;
			width: 590upx;
			right: 0;
			bottom: 1upx;
		}
		.uni-indexed-list__title-wrapper{
			border: 0!important ;
		}
		.uni-indexed-list__list{
			border: 0!important;
		}
		.uni-indexed-list__menu{
			background-color: #fff;
		}
	}
	
</style>
