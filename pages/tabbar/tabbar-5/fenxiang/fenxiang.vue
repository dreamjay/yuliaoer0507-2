<template>
    <view>
		
		<Loading v-if="isLoading"></Loading>
		
        <view class="uni-padding-wrap" v-show="!isLoading">
            <view class="page-section swiper">
                <view class="page-section-spacing">
					<uni-swiper-dot :info="imgSrc" field="imageInfo" mode="nav" :current="current">
						<swiper :style="{height: height+'px'}" class="swiper" @change="change">
							<swiper-item :key="index" v-for="(item,index) in imgSrc" :style="{height: height+'px'}" >
								<view class="swiper-item uni-bg-red" style="position: relative;">
									<image @load="loadOver" :style="{height: height+'px',width:width+'px'}" :src="item.src" mode=""></image>
									<button @click="saveImage(item.src)" type="primary" plain="true" style="width: 150px; position: absolute; bottom: 60px; left: 50%; transform: translateX(-50%);">保存图片</button>
								</view>
							</swiper-item>
							
						</swiper>
					</uni-swiper-dot >
                </view>
            </view>
        </view>
        
    </view>
</template>

<script>
	import uniSwiperDot from "@/components/uni-swiper-dot/uni-swiper-dot.vue"
	import Loading from "@/components/loading/loading.vue"
	
	export default {
		components: {uniSwiperDot,Loading},
	    data() {
	        return {
				imgOverIndex: 0,
				current: 0,
				imgSrc: [
					{
						src:'http://img2.imgtn.bdimg.com/it/u=3813919011,2135714019&fm=26&gp=0.jpg',
						imageInfo: '推荐图'
					},
					{
						src:'http://img1.imgtn.bdimg.com/it/u=3840046291,3484085932&fm=26&gp=0.jpg',
						imageInfo: '推荐图'
					},
					{
						src:'http://img1.imgtn.bdimg.com/it/u=3840046291,3484085932&fm=26&gp=0.jpg',
						imageInfo: '推荐图'
					}
				]
				
	        }
	    },
		computed:{
			isLoading:function () {
				return this.$store.state.isLoading
			}
		},
		// watch:{
		// 	"$store.state.isLoading":function(newVal){
		// 		console.log('监控了',newVal,this)
		// 		this.imgIsOver = newVal
		// 	}
		// },
		onLoad() {
			this.$store.commit('watchLoading', true)
			const { screenWidth, screenHeight } = uni.getSystemInfoSync();
			this.height = screenHeight
			this.width = screenWidth
		},
	    methods: {
			loadOver(){
				this.imgOverIndex++
				if(this.imgOverIndex >= 3){
					setTimeout(()=>{
						this.$store.commit('watchLoading', false)
					},200)
				}
			},
			change(e) {
				this.current = e.detail.current;
			},
	        saveImage(src){
				uni.downloadFile({
					url: src,
					success: (res) =>{
						if (res.statusCode === 200){
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: function() {
									uni.showToast({
										title: "保存成功",
										icon: "none"
									});
								},
								fail: function() {
									uni.showToast({
										title: "保存失败，请稍后重试",
										icon: "none"
									});
								}
							});
						}
					}
				})
			}
	    }
	}
</script>

<style>
	
</style>
