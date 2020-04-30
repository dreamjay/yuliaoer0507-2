<template>
	<view>
		<view class="liaotianList"  >
			<navigator url="./guanfang/list" open-type="navigate" hover-class="">
				<view class="item breakLine" >
					<uni-swipe-action>
						<uni-swipe-action-item  @click="onClick" @change="change">
							<view class="img">
								<image  src="/static/icon_gftz.png" mode="scaleToFill" ></image>
							</view>
							<view class="left">
								<text class="title">官方通知</text>
								<text class="text">{{systemContent}}</text>
							</view>
							<view class="right">{{time}}</view>
						</uni-swipe-action-item>
					</uni-swipe-action>
				</view>
			</navigator>
		</view>
		
		<view class="liaotianList" v-if="isQunzhu">
			<navigator url="./qunxiaoxi/qunxiaoxi" open-type="navigate" hover-class="">
				<view class="item breakLine" >
					<uni-swipe-action>
						<uni-swipe-action-item  @click="onClick" @change="change">
						<view class="img">
							<image  src="/static/icon_qtz.png" mode="scaleToFill" ></image>
						</view>
						<view class="left">
							<text class="title2">群消息</text>
						</view>
						</uni-swipe-action-item>
					</uni-swipe-action>
				</view>
			</navigator>
		</view>
		
		<view class="liaotianList" v-if="isQunzhu">	
			<navigator url="./qunzhuxiaoxi/qunzhuxiaoxi"  open-type="navigate" hover-class="">
				<view class="item breakLine" >
					<uni-swipe-action>
						<uni-swipe-action-item  @click="onClick" @change="change">
							<view class="img">
								<image  src="/static/icon_qzxx.png" mode="scaleToFill" ></image>
							</view>
							<view class="left">
								<text class="title2">群主消息</text>
							</view>
						</uni-swipe-action-item>
					</uni-swipe-action>
				</view>
			</navigator>
		</view>
		
		<view class="liaotianList" @click="itemClick(item.type,item.id,index)" v-for="(item,index) in messageList" :key="index">
			
				<view class="item breakLine" v-if="item.type == 'ALONE'" >
					<uni-swipe-action>
						<uni-swipe-action-item :options="calcData(index)" @click="onClick" @change="change">
							<view class="img">
								<image  :src="item.headUrl?item.headUrl:'/static/moren.png'" mode="scaleToFill" ></image>
								<span class="after" v-if="item.num>0" :style="{backgroundColor:'red'}">{{item.num > 99?"99":item.num}}</span>
							</view>
							<view class="left">
								<text class="title">{{item.title}}</text>
								<text class="text">{{item.text}}</text>
							</view>
							<view class="right">{{item.time}}</view>
						</uni-swipe-action-item>
					</uni-swipe-action>
				</view>
				
				<view class="item breakLine" v-if="item.type == 'CROWD'" >
					<uni-swipe-action>
						<uni-swipe-action-item  @click="onClick" @change="change" :disabled="true">
				
							<view class="imageBox1" :class="headimgClass(item.imgs ? item.imgs.length : null)">
								<image v-for="(itemm,indexx) in item.imgs" :key="indexx" :src="itemm ? itemm : '/static/moren.png'" mode="scaleToFill"></image>
								<span class="after" v-if="item.num>0" :style="{backgroundColor:'red'}">{{item.num > 99?"99":item.num}}</span>
							
							</view>
							
							
							<view class="left">
								<text class="title">{{item.title}}</text>
								<text class="text">{{item.text}}</text>
							</view>
							<view class="right">{{item.time}}</view>
						</uni-swipe-action-item>
					</uni-swipe-action>
				</view>
		</view>
		
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
			}" :show="show" >
				<view style="width: 10px!important; height: 10px; border-radius:0 4px 0 0; background-color: black; position: absolute; right: 0; top:0; transform: rotate(45deg);"></view>
				<image src="/static/img/xiaoxi.png" style="height:20px; width: 20px; position: absolute; left: 10px; top: 20px;" ></image>
				<text style="color:#fff; margin-left: 30px; vertical-align: super;">我要建群</text>
			
		</uni-transition>
	</view>

</template>

<script>
	import Search from '@/components/search/search.vue'
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
	import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
	import uniTransition from "@/components/uni-transition/uni-transition.vue"
	
	var messageListKey = null;
	
	export default {
		components:{Search,uniSwipeAction,uniSwipeActionItem,uniTransition},
		
		data(){
		    return {
				userInfo:null,
				systemContent:'欢迎来到平台',
				time:'',
				isQunzhu:false,
				show:false,
				messageList:[],
				options:[
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						},
						id:''
					}
					
				]
		    }
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
			this.userInfo = uni.getStorageSync('userInfo');
			this.messageListKey = "MESSAGE"+this.userInfo.id;
			
			var systemInfo = uni.getStorageSync("systemInfo"+this.userInfo.id);
			if(systemInfo){
				this.systemContent = systemInfo.systemContent;
				this.time = systemInfo.time;
			}
			
			uni.$on('SYSTEM',(data) => {
				if(this.isQunzhu != 1){
					this.userInfo = uni.getStorageSync('userInfo');
					this.isQunzhu = !!this.userInfo.showCrowd;
				}
				
				this.systemContent = data.body.text;
				this.time = this.calcTime(data.sendTime);
				
				uni.setStorageSync("systemInfo"+this.userInfo.id,{
					systemContent:this.systemContent,
					time:this.time 
				})
				
			})
			// 个人消息
			uni.$on('ALONE',(data) => {
				
			})
			
			
			
			
			// 群消息
			uni.$on('CROWD',(data) => {
				this.messageCount++;
				
			})
			
			uni.$on('UPDATE_MSG',(data) => {
				this.updateList();
			})
			
			
		},
		onShow() {
			this.userInfo = uni.getStorageSync('userInfo');
			this.isQunzhu = !!this.userInfo.showCrowd;
			
			if(this.messageCount <= 0){
				uni.removeTabBarBadge({index: 0})
			}
			this.updateList();
		},
		
		methods:{
			calcData(index){
				return [
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						},
						id:index
					}
					
				];
			},
			updateList(){
				this.$forceUpdate();
				var messageList = uni.getStorageSync(this.messageListKey);
				if(String(typeof(messageList)) != 'object'){
					messageList = [];
				}
				this.messageList = messageList?messageList:[];
				this.setBadge();
			},
			
			removeItem(index){
				
				this.$http.httpPostToken('/user-friend/delFriend',{
					friendUserId:this.messageList[index].id
				},(res)=>{
					this.messageList.splice(index, 1);
					console.log(this.messageList);
					uni.setStorageSync(this.messageListKey,this.messageList);
				},false);
			},
			itemClick(type,id,index){
				console.log(type);
				if(type == 'CROWD'){
					this.$http.httpGetToken('/crowd/getById',{
						crowdId: id
					},(res) =>{
						uni.navigateTo({
							url:'/pages/tabbar/tabbar-2/qunliao/qunliao?crowdInfo='+JSON.stringify(res.data),
							animationType: 'fade-in'
						})
						this.messageList[index].num = 0;
						uni.setStorageSync(this.messageListKey,this.messageList);
						this.setBadge();
					},true);
				}else{
					this.messageList[index].num = 0;	
					uni.setStorageSync(this.messageListKey,this.messageList);
					this.setBadge();
				}
		
			},
			onClick(e){
			  this.removeItem(e.content.id);
			},
			change(open){
			  console.log('当前开启状态：'+ open)
			},
			headimgClass(number){
				switch(Number(number)){
					case 1:{return 'yi';break}
					case 2:{return 'er';break}
					case 3:{return 'san';break}
					case 4:{return 'si';break}
					case 5:{return 'wu';break}
					case 6:{return 'liu';break}
					case 7:{return 'qi';break}
					case 8:{return 'ba';break}
					case 9:{return 'jiu';break}
				}
			},
			open(is) {
				console.log(is)
				this.show = !this.show
				if(is) {
					uni.navigateTo({
						url:'/pages/tabbar/tabbar-2/newCrowd/newCrowd'
					})
				}
				
			},
			calcTime(time){
				var date = new Date();  
				date.setTime(time);
				
				var minute = date.getMinutes();
				if(minute < 10){
					minute = "0"+minute;
				}
				var h =  date.getHours();
				return h + ":" + minute;
			},
			setBadge(){
				
				var a = 0;
				for(var i=0;i<this.messageList.length;i++ ){
					if(this.messageList[i].num){
							a = a + this.messageList[i].num;
					}
				}
				if(a > 0){
					uni.setTabBarBadge({
						index: 0,
						text: a+''
					});
				}else{
					uni.removeTabBarBadge({
						index:0
					})
				}
				
			}
		}
		
	};
</script>

<style lang="scss">
	page{
		background-color: #eee;
	}
	.liaotianList{
		// margin-top: 20upx;
		background-color: #FFFFFF;
		.item{
			height: 60px;
			position: relative;
			line-height: 60px;
			
			.img{
				width: 40px ;
				image{
					height: 40px;
					width: 40px;
					vertical-align: middle;
					border-radius: 5px;
						
				}
				position: relative;
				margin-left: 15px;
				.after{
					color:#fff;
					font-size: 10px;
					line-height: 15px;
					position: absolute;
					height: 15px;
					width:15px;
					right: 0px;
					top: 10px;
					border-radius: 15px;
					text-align: center;
				}
			}
			.left{
				flex: 1;
				padding: 10px ;
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				.title{
					height: 20px;
					line-height: 20px;
					font-size: 16px;
				}
				.title2{
					height: 40px;
					line-height: 40px;
					font-size: 16px;
				}
				.text{
					height: 20px;
					line-height: 20px;
					font-size: 12px;
					color: #aaaaaa;
					 display: -webkit-box;/*作为弹性伸缩盒子模型显示*/
					-webkit-line-clamp: 1; /*显示的行数；如果要设置2行加...则设置为2*/
					overflow: hidden; /*超出的文本隐藏*/
					text-overflow: ellipsis; /* 溢出用省略号*/
					-webkit-box-orient: vertical;/*伸缩盒子的子元素排列：从上到下*/
					
				}
			}
			.right{
				height: 100%;
				font-size: 10px;
				right: 15upx;
				color:#999;
				width: 40px;
			}
		}
	}
	
	.imageBox1{
		width: 40px;
		height: 40px;
		display: inline-block;
		border-radius: 5px;
		overflow: hidden;
		position: relative;
		vertical-align: middle;
		background-color: #eee;
		image{
			box-sizing: border-box;
		}
		margin-top: 10px;
		margin-left: 15px;
	}
	
	.after{
		color:#fff;
		font-size: 10px;
		line-height: 15px;
		position: absolute;
		height: 15px;
		width:15px;
		right: 0px;
		top: 0px;
		border-radius: 15px;
		text-align: center;
	}
</style>
