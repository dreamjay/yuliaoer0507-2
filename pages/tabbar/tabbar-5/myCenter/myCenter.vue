<template>
	<view>
		
		<!-- 一般用法 -->
		<Loading v-show="isLoading"></Loading>
		<uni-list >
		    <uni-list-item title="头像" :showArrow="true" @click="openImage">
		        <template v-slot:right="">
		    		<image style="width: 100upx; height: 100upx; display: inline-block;" :src="touxiang ? touxiang : '/static/moren.jpg'" mode="scaleToFill"></image>
		        </template>
		    </uni-list-item>
		    <uni-list-item title="昵称" @click="changName" >
				<template v-slot:right="">
					<input type="text" :focus="isClick" style="width: 200upx; text-align: right;" :cursor="String(valueName).length" v-model="valueName">
				</template>
			</uni-list-item>
		    <uni-list-item title="推荐码" :showArrow="false" :rightText="tuijianma"></uni-list-item>
			
		</uni-list>
		
		
		
	</view>
</template>

<script>
	import uniList from "@/components/uni-list/uni-list.vue"
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
	import Loading from '@/components/loading/loading.vue'
	
	export default {
		components: {uniList,uniListItem,Loading},
		data() {
			return {
				tuijianma:'',
				title: '',
				valueName: "",
				isClick: false,
				imgFiles:null,
				touxiang:'',
				userInfo:null,
				token:null,
			}
		},
		onLoad(option) {
			
			this.userInfo = JSON.parse(uni.getStorageSync('userInfo')).user
			this.token = JSON.parse(uni.getStorageSync('userInfo')).token
			this.valueName = this.userInfo.nickName
			this.tuijianma = this.userInfo.referralCode
			this.touxiang = this.userInfo.headUrl
			
		},
		onNavigationBarButtonTap:function() {
			
			uni.showModal({
				title: "提示",
				content: '是否确定保存',
				success:  (res)=> {
					if (res.confirm) {
						if(String(this.valueName).length > 8){
							uni.showToast({
								title:'昵称长度不要太长',
								icon:'none'
								
							})
							return
						}
						if(this.imgFiles){//改头像
							this.updataImg(this.imgFiles)
						} else{ //改名字-要把原来的头像转成base64 传一样的头像
							
							this.updateName(this.valueName)
						}
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			})
		},
		computed:{
			isLoading:function(){
				return this.$store.state.isLoading
			}
		},
		methods: {
			openImage(){ //相册或者拍图片
				uni.chooseImage({
					count:1,
					fail:()=>{
						
					},
					success:(imgRes)=>{
						//因为有一张图片， 输出下标[0]， 直接输出地址
						this.imgFiles = imgRes.tempFilePaths[0]
						// console.log('图片地址',this.imgFiles)
						this.touxiang = this.imgFiles
					}
				})
			},
			changName(){
				this.isClick = !this.isClick
				
			},
			getNewUserInfo(){
				// console.log('更新信息')
				this.$http.httpTokenRequest({
					url: '/user/get',
					method: 'post'
				}, {}).then(res => {
					
					if(res.data.success){
						
						// console.log('原来的1',JSON.parse(uni.getStorageSync('userInfo')))
						uni.setStorageSync("userInfo",JSON.stringify({
								user:res.data.data,
								token:this.token
							}))
						// console.log('现在的1',JSON.parse(uni.getStorageSync('userInfo')))
						uni.$emit('update',{msg:'页面更新1'})
					}else{
						uni.showToast({
						    title: '没token',
							icon:'none'
						})
					}
				},error => {
					uni.showToast({
						title:'错误'+error,
						icon:'none'
					})
				}) 
			},
			updateName(newVal){ //改用户名
				let then = this
				this.$http.httpTokenRequest({
					url: '/user/updateNickName',
					method: 'post'
				}, {
					token:this.token,
					nickName:newVal
				}).then(res => {
					
					if(res.data.success){
						uni.showToast({
							title: '保存成功',
							icon:'none',
							complete: () => {
								 then.getNewUserInfo()
									
							}
						})
						setTimeout(function(){
							uni.hideToast()
							uni.navigateBack()
						},1500)
						
					}else{
						uni.showToast({
							title:'修改失败，等会试',
							icon:'none'
						})
					}
				},error => {
					uni.showToast({
						title:'错误'+error,
						icon:'none'
					})
				}) 
			},
			updataImg(imgFiles){ //修改头像和用户名
				let valueName = this.valueName
				var then = this
				this.$store.commit('watchLoading',true)
				var uper = uni.uploadFile({
					// 需要上传的地址
					url:'http://zcttt.vipgz5.idcfengye.com/user/fileUpload',
					// filePath  需要上传的文件
					filePath: imgFiles,
					name: 'file',
					
					header:{
						token:this.token
					},
					formData: {
						'nickName': valueName
					},
					success(res1) {
						// 显示上传信息
						then.$store.commit('watchLoading',false)
						if(JSON.parse(res1.data).success){
							
							uni.showToast({
								title: '保存成功',
								icon:'none',
								complete: () => {
									   then.getNewUserInfo()
										
								}
							})
							setTimeout(function(){
								uni.hideToast()
								uni.navigateBack()
							},1500)
						}else{
							uni.showToast({
								title: JSON.parse(res1.data).msg,
								icon:'none'
							})
						}
					},
					fail(err){
						then.$store.commit('watchLoading',false)
					}
				});
				// onProgressUpdate 上传对象更新的方法
				uper.onProgressUpdate((res)=>{
					// 进度条等于 上传到的进度
					// _self.percent = res.progress
					
					// console.log('上传进度' + res.progress)
					// console.log('已经上传的数据长度' + res.totalBytesSent)
					// console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend)
					
				})
			}
		}
	}
</script>

<style>
</style>
