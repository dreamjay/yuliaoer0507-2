<template>
	<view>
		<ul class="ulBox" >
			<li v-for="(item,index) in xuanran" :key="index" @click="toUrl(item.crowdId)" >
					<view class="imageBox" :class="headimgClass(item.imgs ? item.imgs.length : null)">
						<image v-for="(itemm,indexx) in item.imgs" :key="indexx" :src="itemm ? itemm : '/static/moren.png'" mode="scaleToFill"></image>
					</view>
					<text>{{item.name}}</text>
			</li>
		</ul>
	</view>
	
</template>

<script>
	export default{
		data(){
			return{
				xuanran:[],
				crowds:[]
			}
		},
		computed:{
		
		},
		onLoad() {
			this.getCrowd()
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
			getCrowd(){
				this.$http.httpGetToken('/crowd/listByUserId', {},(res) => {
				
					this.crowds = res.data;
					this.xuanran = [...this.crowds];
					if(!this.crowds.length){
						uni.showToast({
							title:'没有更多数据',
							icon:'none'
						})
						return;
					}
					
					this.crowds.forEach((item,index)=>{
						this.getImage(item.crowdId,index);
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
					
				},true)
			},
			toUrl(crowdId){
			
				this.$http.httpGetToken('/crowd/getById',{
					crowdId: crowdId
				},(res) =>{
					uni.navigateTo({
						url:'/pages/tabbar/tabbar-2/qunliao/qunliao?crowdInfo='+JSON.stringify(res.data),
						animationType: 'fade-in'
					})
				},true);
		
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
