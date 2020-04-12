<template>
	<view>
		
		<ul class="ulBox">
			<li v-for="(item,index) in xuanran" :key="index" @click='popupOpen(item)'>
				<view class="imageBox" :class="headimgClass(item.imgs ? item.imgs.length : null)">
					<image v-for="(itemm,indexx) in item.imgs" :key="indexx" :src="itemm" mode="scaleToFill"></image>
				</view>
				
				<text>{{item.name}}</text>
			</li>
			
		</ul>
		
		<chunLei-modal v-model="value" :mData="data" :type="type" @onConfirm="onConfirm" @cancel="cancel" :navHeight="height" :tabbarHeight="0">
			
			<div class="custom-view" @tap.stop>
				<div class="hongbao" style="text-align: center;">
					<text style="color:#4CB964; margin-top: 50upx;">请输入推荐码</text>
					<input type="text" :focus='true' v-model="inputVal" @confirm='shenqingjiaqun' confirm-type='完成'>
					<button @click="shenqingjiaqun" style="width: 400upx; background-color:#4cb964; margin-top: 50upx;" type="primary">确定</button>
				</div>
				
			</div>
		</chunLei-modal>
	</view>
</template>

<script>
	
	import chunLeiModal from '@/components/chunLei-modal/chunLei-modal.vue'
	import TabMask from '@/components/chunLei-modal/tabMask'
	
	export default{
		components: {chunLeiModal},
		data(){
			return{
				data:{},
				value:false,
				type:'custom',
				height:0, //状态栏加导航栏的高度
				xuanran:[],
				tabMask:null,
				crowdCode:null, //群号
				inputVal:'', //推荐码
				crowds:[
					// {
					// 	url: '/static/img/qa.png',
					// 	text: '546546556'
					// },
					// {
					// 	url: '/static/img/qa.png',
					// 	text: '546546556'
					// },
					// {
					// 	url: '/static/img/qa.png',
					// 	text: '546546556'
					// },
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
		},
		onNavigationBarSearchInputConfirmed(obj){ //点搜索
			// console.log(obj.txt)
			// uni.showToast({
			// 	"title":obj.text
			// })
			
			
			if(String(obj.text).length < 2) {
				uni.showToast({
					title:'至少要输入两个关键字',
					icon:'none'
				})
				return
			}
			// #ifdef APP-PLUS
				var webView = this.$mp.page.$getAppWebview();  
				webView.setTitleNViewSearchInputFocus(false)  //点搜索去焦点
			// #endif
			
			this.$http.httpTokenRequest({
				url: '/crowd-join-record/listBySeclect',
				method: 'get'
			}, {
				name:obj.text
			}).then(res => {
				
				if(res.data.success){
					// console.log(res.data.data)
					if(!res.data.data.length){
						uni.showToast({
							title:'没有发现相关群',
							icon:'none'
						})
					} else{
						this.crowds = res.data.data
						this.crowds.forEach((item)=>{
							this.getImage(item.id).then((d)=>{
								
								this.crowds.find((itemm)=>(itemm.id == d.crowdId)).imgs = d.data
								this.xuanran = [...this.crowds]
								// console.log('看看渲染',this.xuanran)
							}).catch((d)=>{
								this.crowds.find((itemm)=>(itemm.id == d.crowdId)).imgs = []
							})
							
						})
					}
					
				}else{
					console.log(res.data.msg)
				}
			},error => {
				uni.showToast({
					title:'错误'+error,
					icon:'none'
				})
			}) 
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
				
				this.$http.httpTokenRequest({
					url: '/crowd-join-record/add',
					method: 'post'
				}, {
					crowdCode:this.crowdCode,
					referralCode:this.inputVal
				}).then(res => {
					if(res.data.success){
						// console.log(res.data.data)
						uni.hideKeyboard()
						this.value = !this.value
						uni.showToast({
							title:'已申请'
						})
						setTimeout(()=>{
							uni.navigateBack({})
						},1500)
					}else{
						uni.showToast({
							title:res.data.msg,
							icon:'none',
							position:'top'
						})
						// console.log(res.data.msg)
					}
				},error => {
					uni.showToast({
						title:'错误'+error,
						icon:'none'
					})
				}) 
			},
			popupOpen(item){
				this.crowdCode = item.crowdCode
				this.type = this.type
				this.value = !this.value
			},
			getImage(crowdId){
				// console.log('拿图片crowdId',crowdId)
				
				return new Promise((resolve, reject)=>{
					this.$http.httpTokenRequest({
						url: '/crowd/listUserHeadByCrowdId',
						method: 'get'
					}, {
						crowdId:crowdId
					}).then(res => {
						if(res.data.success){
							console.log('头像',res.data.data)
							// res.data.data = [
							// 	'http://img4.imgtn.bdimg.com/it/u=662024917,967301403&fm=26&gp=0.jpg',
							// 	'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2151447830,1807870251&fm=11&gp=0.jpg',
							// 	'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3208586113,2688222785&fm=26&gp=0.jpg',
							// 	'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1013062358,2295738855&fm=26&gp=0.jpg',
							// 	'http://img4.imgtn.bdimg.com/it/u=662024917,967301403&fm=26&gp=0.jpg',
							// 	'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2151447830,1807870251&fm=11&gp=0.jpg',
							// 	'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1013062358,2295738855&fm=26&gp=0.jpg',
							// 	'http://img4.imgtn.bdimg.com/it/u=662024917,967301403&fm=26&gp=0.jpg',
							// 	'http://img4.imgtn.bdimg.com/it/u=662024917,967301403&fm=26&gp=0.jpg',
							// ]
							
							resolve({data:res.data.data,crowdId:crowdId})
							
						}else{
							resolve({data:res.data.data,crowdId:crowdId})
							console.log(res.data.msg)
						}
					},error => {
						uni.showToast({
							title:'拿群图片错误'+error,
							icon:'none'
						})
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.custom-view{
		overflow: hidden;
		z-index: 999;
		position: absolute;
		top: 10%;
		
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
