<template>
	<view>
		<!-- 一般用法 -->
		<uni-list >
		    <uni-list-item title="头像" >
		        <template v-slot:right="">
					<avatar selWidth="500upx" selHeight="500upx"   @upload="doUpload" @avtinit="doBefore" quality="1" ref="avatar" :avatarSrc="touxiang"
					 avatarStyle="width: 100upx; height: 100upx; border-radius: 6%;"
					></avatar>
				</template>
		    </uni-list-item>
		    <uni-list-item title="昵称" @click="changName" >
				<template v-slot:right="">
					<input   @confirm='confirm' type="text" :focus="isClick" style="width: 200upx; text-align: right;" :cursor="String(valueName).length" v-model="valueName" >
				</template>
			</uni-list-item>
		    <uni-list-item title="推荐码" :showArrow="false" :rightText="tuijianma"></uni-list-item>
			
		</uni-list>
		
		
		
	</view>
</template>

<script>
	import uniList from "@/components/uni-list/uni-list.vue"
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
	import avatar from "@/components/yq-avatar/yq-avatar.vue";
	export default {
		components: {uniList,uniListItem,avatar},
		data() {
			return {
				tuijianma:'',
				title: '',
				valueName: "",
				isClick: false,
				imgFiles:null,
				touxiang:'/static/moren.png',
				userInfo:null,
				token:null,
				
			}
		},
		onLoad(option) {
			
		},
		onShow(){
			this.userInfo = uni.getStorageSync('userInfo');
			this.valueName = this.userInfo.nickName;
			this.tuijianma = this.userInfo.referralCode;
			if(this.userInfo.headUrl){
				this.touxiang = this.userInfo.headUrl;
			}
			this.token = uni.getStorageSync('token');
		},
		onNavigationBarButtonTap:function() {
			this.save()
			
		},
		computed:{
		
		},
		methods: {
			confirm(){
				this.save()
			},
			save(){
				uni.showModal({
					title: "提示",
					content: '是否确定保存',
					success:  (res)=> {
						if (res.confirm) {
							if(String(this.valueName).length > 8){
								uni.showToast({
									title:'昵称长度不能大于8',
									icon:'none'
									
								})
								return
							}
							this.updateName(this.valueName)
						} 
					}
				})
			},
		
			
			changName(){
				this.isClick = !this.isClick
				
			},
			updateName(newVal){ //改用户名
				let then = this
				this.$http.httpPostToken('/user/updateNickName',{
					nickName:newVal
				},(res) => {
					uni.hideKeyboard()
					uni.showToast({
						title: '保存成功',
						icon:'none'
					})
					var userInfo = uni.getStorageSync("userInfo");
					userInfo.nickName = newVal;
					uni.setStorageSync("userInfo",userInfo);
				},true);
			},
			
			doBefore() {
				this.$refs.avatar.fChooseImg(0,{
					selWidth: '500upx', selHeight: '500upx', 
					expWidth: '500upx', expHeight: '500upx',
					inner: 'true',
					canRotate: 'false',
					lock:'x'
				});
			},
			
			doUpload(rsp) {
				let then = this
				this.touxiang = rsp.path;
				uni.showLoading({
					title:"正在上传头像..."
				})
				uni.uploadFile({
					url: this.$http.baseUrl+'/user/fileUpload', //仅为示例，非真实的接口地址
					filePath: rsp.path,
					name: 'file',
					header:{
						token:this.token
					},
					success: (uploadFileRes) => {
						console.log(uploadFileRes)
						if(uploadFileRes.data){
							var obj = JSON.parse(uploadFileRes.data);
							if(obj.success){
								var userInfo = uni.getStorageSync("userInfo");
								userInfo.headUrl = obj.data;
								uni.setStorageSync("userInfo",userInfo);
								this.touxiang =  obj.data;
								uni.showToast({
									title:'修改头像成功',
									icon:'none',
									duration: 1500
								})
							}else{
								uni.showToast({
									title:'上传头像失败',
									icon:'none',
									duration: 1500
								})
							}
						}
						
					
					},
					complete(res) {
						uni.hideLoading();
					}
				});
			}
		}
	}
</script>

<style>
	page {
		background-color: #eee;
	}
	.uni-list-item:nth-of-type(2) .uni-list-item__container::after{
		display: none;
	}
</style>
