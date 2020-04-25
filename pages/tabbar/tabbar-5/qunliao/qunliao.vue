<template>
	<view>
		<Loading v-if="isLoading"></Loading>
		<ul class="ulBox" v-show="!isLoading">
			<li v-for="(item,index) in xuanran" :key="index" >
				<navigator :url="'/pages/tabbar/tabbar-2/qunliao/qunliao?crowdInfo='+JSON.stringify(item)+''" open-type="navigate" hover-class="">
					<view class="imageBox" :class="headimgClass(item.imgs ? item.imgs.length : null)">
						<image v-for="(itemm,indexx) in item.imgs" :key="indexx" :src="itemm ? itemm : '/static/moren.png'" mode="scaleToFill"></image>
					</view>
					<text>{{item.name}}</text>
				</navigator>
				
			</li>
		</ul>
	</view>
	
</template>

<script>
	import Loading from '@/components/loading/loading.vue'
	export default{
		components:{Loading},
		data(){
			return{
				xuanran:[],
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
		onPullDownRefresh() { //下拉
			// console.log('refresh');
			this.getCrowd(true)
			
		},
		onLoad() {
			this.getCrowd()
			this.$store.commit('watchLoading', true)
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
			getCrowd(isShowToast){
				this.$http.httpTokenRequest({
					url: '/crowd/listByUserId',
					method: 'get'
				}, {}).then(res => {
					if(isShowToast){
						uni.stopPullDownRefresh();
						uni.showToast({
							title:'加载完成',
							icon:'none'
						})
					}
					if(res.data.success){
						// console.log('群信息',res.data.data)
						this.crowds = res.data.data
						let count = 0
						this.crowds.forEach((item,index)=>{
							this.getImage(item.crowdId).then((d)=>{
								count++
								if(count == this.crowds.length){
									this.$store.commit('watchLoading', false)
								}
								this.crowds.find((itemm)=>(itemm.crowdId == d.crowdId)).imgs = d.data
								this.xuanran = [...this.crowds]
								// console.log('看看渲染',this.xuanran)
							}).catch((d)=>{
								count++
								if(count == this.crowds.length){
									this.$store.commit('watchLoading', false)
								}
								this.crowds.find((itemm)=>(itemm.crowdId == d.crowdId)).imgs = []
							})
							
						})
						
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
							reject({data:res.data.data,crowdId:crowdId})
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
	.ulBox{
		// border-top: 1upx solid #eee;
		li{
			height: 150upx;
			padding: 0 30upx;
			border-bottom: 1upx solid #eee;
			line-height: 120upx;
			.imageBox{
				margin-top: 20upx;
				width: 110upx;
				height: 110upx;
				display: inline-block;
				border-radius: 5px;
				// border: 1upx solid #eee;
				overflow: hidden;
				position: relative;
				vertical-align: middle;
				background-color: #eee;
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
