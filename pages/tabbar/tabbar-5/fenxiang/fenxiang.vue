<template>
    <view>
		<canvas class="canvas"  canvas-id="myCanvas" ></canvas><!-- 海报 -->
        <view class="uni-padding-wrap" >
            <view class="page-section swiper">
                <view class="page-section-spacing">
					<uni-swiper-dot :info="imgSrc" field="imageInfo" mode="none" :current="current">
						<swiper :style="{height: height+'px'}" class="swiper" @change="change">
							<swiper-item :key="index" v-for="(item,index) in imgSrc" :style="{height: height+'px'}" >
								<view class="swiper-item uni-bg-red" style="position: relative;">
									<image  :style="{height: height+'px',width:width+'px'}" :src="item.src" mode="widthFix"></image>
									
									<view  class="erweima" :style="'top:'+(height/2)+'px' ">
										<image class="erweima_img" :src="erweimaUrl" mode="aspectFill" ></image>
										<view class="tjm_text">
											<text>我的推荐码：{{userInfo.referralCode}}</text>
											<view class="select_qun" @tap="selectCrowdId">
												<text>{{crowdCode?'群ID：'+crowdCode : '选择群ID'}}</text>
												<image class="jiantou" src="/static/white_right_arrow.png"></image>
											</view>
											
										</view>
										
										<image  @tap="saveImage(item.src)" class="tjm_button" src="/static/save_pic1.png"></image>
										
									</view>
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
	import orgImage from '@/components/org-image/org-image';
	export default {
		components: {uniSwiperDot,orgImage},
	    data() {
	        return {
				crowds:[],
				testurl:'',
				userInfo:{},
				crowdCode:null,
				imgOverIndex: 0,
				current: 0,
				erweimaUrl:'',
				imgSrc: [
					{
						src:'/static/share_pic1.png',
						imageInfo: '分享图1'
					},
					{
						src:'/static/share_pic2.png',
						imageInfo: '分享图2'
					},
					{
						src:'/static/share_pic3.png',
						imageInfo: '分享图3'
					}
				],
				
				
	        }
	    },
		computed:{
			
		},
		
		onLoad(option) {
			const { screenWidth, screenHeight } = uni.getSystemInfoSync();
			this.height = screenHeight 
			this.width = screenWidth
			this.userInfo = uni.getStorageSync("userInfo");
			if(option.crowdCode){
				this.crowdCode = option.crowdCode;
			}
			
			let sysInfo = uni.getSystemInfoSync();
			this.platform = sysInfo.platform;
			this.pixelRatio = sysInfo.pixelRatio;
			this.windowWidth = sysInfo.windowWidth;
			
			// 加载远程地址
			this.$http.httpGet('/platform-config/getImgByDownUrl',{},(res)=>{
				this.erweimaUrl = res.data;
			},false)
			
			
			this.$http.httpGetToken('/crowd/listByUserId', {},(res) => {
			
				this.crowds = res.data;
				console.log(this.crowds)
				if(this.crowds && this.crowds.length > 1){
					
				}else{
					this.crowdCode = this.crowds[0].crowdCode;
				}
			
			},true)
			
			uni.$on("selectCrowdCode",(data)=>{
				this.crowdCode = data;
			})
			
		},
	    methods: {
			loadOver(){
				
			},
			selectCrowdId(){
				
				uni.navigateTo({
					url:'qunList?crowdCode='+this.crowdCode+'&crowds='+ JSON.stringify(this.crowds)
				})
				
				
				
				
			},
			change(e) {
				this.current = e.detail.current;
			},
			
	        saveImage(src){
				if(!this.crowdCode){
					uni.showToast({
						icon:"none",
						title:"请选择群ID"
					})
					return;
				}
				
				this.ctx = uni.createCanvasContext('myCanvas')
				
				
				uni.showLoading({
				
				})
				this.canvasBg(src);

				
			},
			
			// 绘制背景
			canvasBg(src){
				// 用画布生成分享图
				uni.getImageInfo({
					src:src,
					success:(res)=> {
						var path = res.path;
						this.ctx.drawImage(path, 0, 0,this.width,this.height);
						// 第一次绘制，清空画布
						this.ctx.draw({reserve:true},(res)=>{
							// 绘制二维码
							this.canvasErweima();
							
						})
					}
				})
			},
			canvasErweima(){
				uni.downloadFile({
				    url: this.erweimaUrl, 
				    success: (res) => {
				        if (res.statusCode === 200) {
							var w = this.width / 2;
							var xw =  this.width/2 - w/2;
							var xh = this.height/2 - w/2;
							// 绘制邀请码
							// 绘制群ID
							this.ctx.setFillStyle('white')
							this.ctx.setFontSize(20);
							this.ctx.fillText('我的推荐码：'+this.userInfo.referralCode,w -100, xh + w + 30)
							this.ctx.fillText('群ID：'+this.crowdCode, w - 50, xh + w + 70)
							this.ctx.drawImage(res.tempFilePath,xw,xh, w,w);
							this.ctx.draw({reserve:true},(res)=>{
								this.canvasImg(Number(res.width),Number(res.height));
							});
						}
					}
				});
			},
			
			canvasImg(width,height){
				
				// console.log("开始导出图片：width:"+width+"height:"+height)
				uni.canvasToTempFilePath({
				  x: 0,
				  y: 0,
				  canvasId: 'myCanvas',
				  success: (res) =>{
					 
					// 在H5平台下，tempFilePath 为 base64
						console.log("保存临时路径：",res)
						
						this.exportImg(res.tempFilePath);
							
					}
				},this)
					
			},
			exportImg(temPath){
				this.testurl = temPath
				console.log(this.testurl)
				uni.saveImageToPhotosAlbum({
					filePath: temPath,
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
	}
</script>

<style lang="scss">
	.erweima{
		width: 100%;
		position: absolute;
		z-index: 2;
		left: 50%;
		transform: translateX(-50%);
		margin-top: -125rpx;
		image{
			
		}
	}
	.erweima_img{
		position: relative;
		left: 50%;
		width: 250rpx;
		height: 250rpx;
			transform: translateX(-50%);
			border-radius: 10px;
	}
	.tjm_text{
		width: 100%;
		text-align: center;
		z-index: 2;
		position: relative;
		left: 50%;
		display: flex;
		flex-direction: column;
		color: #FFFFFF;
		font-size: 18px;
		transform: translateX(-50%);
	}
	.select_qun{
		margin: 0 auto;
		margin-top: 10px;
		height: 22px;
		line-height: 22px;
		border-radius: 11px;
		width: 50%;
		border: 1px solid #FFFFFF;
		display: flex;
		flex-direction: row;
		text{
			flex: 1;
		}
		
	}
	.jiantou{
		margin-right: 20px;
		width: 20px;
		height: 20px;
		margin-top: 1px;
	}
	
	.tjm_button{
		margin-top: 40px;
		width: 250rpx;
		height: 120rpx;
		text-align: center;
		z-index: 2;
		position: relative;
		color: #FFFFFF;
		font-size: 18px;
		
		left: 50%;
		transform: translateX(-50%);
		
	}
	
	.canvas {  
	  width: 100%;  
	  height: 100%;  
	  position:fixed;
	  
	}
</style>
