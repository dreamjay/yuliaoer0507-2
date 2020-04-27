<template>
	<view>
		<Loading v-show="isLoading"></Loading>
		<ul class="ulBox">
			<li v-for="(item,index) in xuanran" :key="index" @click='popupOpen(item)'>
				<view class="imageBox" :class="headimgClass(item.imgs? item.imgs.length : null)">
					<image v-for="(itemm,indexx) in item.imgs" :key="indexx" :src="itemm ? itemm : '/static/moren.png'" mode="scaleToFill"></image>
				</view>
				
				<text>{{item.name}}</text>
			</li>
			
		</ul>
		<!-- 隐藏的用来自动聚焦 -->
		<input style="position: absolute; left: -999px; top: 0;" :focus="true" v-if="value" v-model="inputVal" type="password">
		<chunLei-modal v-model="value" :mData="data" :type="type" @onConfirm="onConfirm" @cancel="cancel" :navHeight="height" :tabbarHeight="0">
			
			<view class="custom-view" @tap.stop>
				<view class="hongbao" style="text-align: center;">
					<text style="color:#4CB964;">请输入推荐码</text>
					<input type="text" :focus='true' v-model="inputVal" @confirm='shenqingjiaqun' confirm-type='完成' >
					<button @touchend.prevent="shenqingjiaqun" style="width: 400upx; background-color:#4cb964; margin-top: 50upx;" type="primary">确定</button>
				</view>
				
			</view>
		</chunLei-modal>
	</view>
</template>

<script>
	
	import chunLeiModal from '@/components/chunLei-modal/chunLei-modal.vue'
	import Loading from '@/components/loading/loading.vue'
	export default{
		components: {chunLeiModal,Loading},
		data(){
			return{
				data:{},
				value:false,
				type:'custom',
				height:0, //状态栏加导航栏的高度
				xuanran:[],
				crowdCode:null, //群号
				inputVal:'', //推荐码
				crowds:[
				
				]
			}
		},
		computed:{
			isLoading:function(){
				return this.$store.state.isLoading
			}
		},
		onNavigationBarSearchInputChanged(obj){ //值变化
			// console.log(obj.txt)
			if(obj.text.length < 2) {
				return;
			}
			this.seach(obj.text);
		},
		onNavigationBarSearchInputConfirmed(obj){ //点搜索

			if(obj.text.length < 2) {
				return;
			}
			// #ifdef APP-PLUS
				var webView = this.$mp.page.$getAppWebview();  
				webView.setTitleNViewSearchInputFocus(false)  //点搜索去焦点
			// #endif
			this.seach(obj.text);
			
			
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
		onLoad() {
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
			this.$store.state.isLoading = false;
		},
		methods:{
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
			onConfirm(){
				console.log('确定')
			},
			cancel(){
				console.log('取消')
			},
			shenqingjiaqun(){ //申请加群
				this.$http.httpPostToken('/crowd-join-record/add',{
					crowdCode:this.crowdCode,
					referralCode:this.inputVal
				},(res) => {
					uni.hideKeyboard()
					this.value = !this.value
					uni.showToast({
						title:'群主审核中.'
					})
					setTimeout(()=>{
						uni.navigateBack({})
					},1500)
				},true)

			},
			
			popupOpen(item){
				this.crowdCode = item.crowdCode
				this.type = this.type
				this.value = !this.value
			},
			seach(key){
				this.$http.httpGetToken('/crowd-join-record/listBySeclect', {
					name:key
				},(res) => {
					console.log(res)
					this.crowds = res.data;
					this.xuanran = [...this.crowds];
					if(!this.crowds.length){
						uni.showToast({
							title:'没有发现相关群',
							icon:'none'
						})
						return;
					}
					
					this.crowds.forEach((item,index)=>{
						this.getImage(item.id,index);
					})
				},true)
			},
			getImage(crowdId,index){
				this.$http.httpGetToken('/crowd/listUserHeadByCrowdId',{
					crowdId:crowdId
				},(res) => {
					console.log(res.data.length)
					this.$forceUpdate();
					this.xuanran[index].imgs = res.data;
					
				},false)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.custom-view{
		overflow: hidden;
		z-index: 999;
		position: absolute;
		top: 5%;
		
		.hongbao{
			width: 500upx;
			height: 380upx;
			border-radius: 5px;
			background: #fff;
			padding-top: 50upx;
			input{
				border-bottom: 1px solid #4cb964;
				width: 400upx;
				margin-left: 50upx;
				margin-top: 50upx;
			}
		}
		
	}
	.ulBox{
		border-top: 1upx solid #eee;
		
		li{
			height: 150upx;
			padding: 0 15upx;
			border-bottom: 1upx solid #eee;
			line-height: 120upx;
			.imageBox{
				margin-top: 20upx;
				width: 110upx;
				height: 110upx;
				display: inline-block;
				border-radius: 5px;
				// border: 1upx solid #eee;
				background-color: #eee;
				overflow: hidden;
				position: relative;
				vertical-align: middle;
				image{
					box-sizing: border-box;
					
				}
				
			}
			
			text{
				margin-left: 20upx;
				vertical-align: sub;
			}
		}
	}
</style>
