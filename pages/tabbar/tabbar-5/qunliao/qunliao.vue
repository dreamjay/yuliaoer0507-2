<template>
	<view>
		<Loading v-if="isLoading"></Loading>
		<ul class="ulBox" v-show="!isLoading">
			<li v-for="(item,index) in xuanran" :key="index" >
				<view class="imageBox">
					<image v-for="(itemm,indexx) in item.imgs" :key="indexx" :src="itemm" mode="scaleToFill"></image>
				</view>
				
				<text>{{item.name}}</text>
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
	.ulBox{
		border-top: 1upx solid #eee;
		
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
				border: 1upx solid #eee;
				overflow: hidden;
				image{
					box-sizing: border-box;
					
					float: left;
					width: 33.33%;
					height: 33.33%;
				}
				image:nth-of-type(1) {
					border-right:4upx solid #eee;
					border-bottom: 4upx solid #eee;
				}
				image:nth-of-type(2) {
					border-right:4upx solid #eee;
					border-bottom: 4upx solid #eee;
				}
				image:nth-of-type(3) {
					border-bottom: 4upx solid #eee;
				}
				image:nth-of-type(4) {
					border-right:4upx solid #eee;
					border-bottom: 4upx solid #eee;
				}
				image:nth-of-type(5) {
					border-right:4upx solid #eee;
					border-bottom: 4upx solid #eee;
				}
				image:nth-of-type(6) {
					border-bottom: 4upx solid #eee;
				}
				image:nth-of-type(7) {
					border-right:4upx solid #eee;
					
				}
				image:nth-of-type(8) {
					border-right:4upx solid #eee;
				}
				image:nth-of-type(9) {
					
				}
			}
			text{
				margin-left: 20upx;
				vertical-align: text-bottom;
			}
		}
	}
</style>
