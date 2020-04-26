<template>

	<view style="background-color: #fff; position: absolute; width: 100%;">
		<Loading v-show="isLoading"></Loading>
		<view style="margin-left: 50upx; width: 650upx;">
			<view class="uni-form-item uni-column" >
				<text class="title" style="display: inline-block;">手机号：</text>
				<input  type="tel" placeholder="请输入手机号" style="display: inline-block;  width: 250upx; vertical-align: middle;" v-model="shoujihaoVal" />
				
			</view>
			<view class="uni-form-item uni-column" >
				<text class="title" style="display: inline-block;">图形验证码：</text>
				<input  type="text" placeholder="请输入验证码" style="display: inline-block; width: 250upx; vertical-align: middle;" v-model="yanzhengmaVal"/>
				<image :src="yanzhengma" class="yanzhengma" @click="yanzhengmaClick"></image>
			</view>
			<view class="uni-form-item uni-column" >
				<text class="title" style="display: inline-block;">验证码：</text>
				<input  type="text" placeholder="请输入验证码" style="display: inline-block;  width: 250upx; vertical-align: middle;" v-model="shoujiYanzhengmaVal"/>
				<button @click="shoujiYanzhengma" class="shoujiYanzhengma" type="primary" >{{isSend ? sendText : "获取验证码"}}</button>
			</view>
			
			
			<view class="uni-form-item uni-column" >
				<text class="title" style="display: inline-block;">登录密码：</text>
				<input  type="password" placeholder="请输入新密码" style="display: inline-block; width: 250upx; vertical-align: middle;" v-model="denglumimaVal"/>
				
			</view>
			<view class="uni-form-item uni-column" >
				<text class="title" style="display: inline-block;">确认密码：</text>
				<input  type="password" placeholder="请确认新密码" style="display: inline-block; width: 250upx; vertical-align: middle;" v-model="querenmimaVal"/>
				
			</view>
		</view>
		
		<button @click="ok" style="width: 650upx;  position: relative; bottom: -150upx; background-color:#4cB964; " type="primary">完成</button>
		
	</view>
	
</template>

<script>
	
	import Loading from '@/components/loading/loading.vue'
	
	export default{
		components:{Loading},
		data(){
			return{
				yanzhengma:"",
				yanzhengmaVal:'',
				shoujiYanzhengmaVal:"",
				shoujihaoVal:'',
				denglumimaVal:"",
				querenmimaVal:'',
				isSend: false,
				sendText: "",
				uuid:'',
			}
		},
		computed:{
			isLoading:function(){
				return this.$store.state.isLoading
			}
		},
		onLoad(){
			this.uuid = this.uuidFn()
			this.yanzhengma = this.$http.baseUrl+"/yzm/getByImgCode?rnd="+Math.random()+"&uid="+this.uuid
		},
		methods:{
			yanzhengmaClick(){
				this.uuid = this.uuidFn()
				this.yanzhengma = this.$http.baseUrl+"/yzm/getByImgCode?rnd="+Math.random()+"&uid="+this.uuid
			},
			shoujiYanzhengma(){
				
				if(!this.shoujihaoVal) {
					uni.showToast({
						title:"手机号不能为空",
						icon:"none"
					})
				} else if(!this.yanzhengmaVal){
					
					uni.showToast({
						title:"请先输入图形验证码",
						icon:"none"
					})
				}else if(this.isSend){
					uni.showToast({
						title:"稍候再试",
						icon:"none"
					})
				}else{
					this.$http.httpPost("/yzm/sendSmsYzm",
					{
						imgCode:this.yanzhengmaVal,
						phone:this.shoujihaoVal,
						uid:this.uuid
					},(res) =>{
						this.isSend = true;
						let time = 60;
						this.sendText = "已发送("+time+"s)";
						let id = setInterval(()=>{
							time--;
							this.sendText = "已发送("+time+"s)";
							if(time < 0) {
								this.isSend = false;
								clearInterval(id);
							}
						},1000)
					},true);
					
				}
				
			},
			uuidFn() {
			    var s = [];
			    var hexDigits = "0123456789abcdef";
			    for (var i = 0; i < 36; i++) {
			        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
			    }
			    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
			    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
			    s[8] = s[13] = s[18] = s[23] = "-";
			 
			    var uuid = s.join("");
			    return uuid;
			},
			toastFun(val){
				uni.showToast({
					title:""+val+"不能为空",
					icon:"none"
				})
			},
			ok(){
				console.log(this.shoujihaoVal)
				if(this.shoujihaoVal == ''){
					this.toastFun('手机号')
					return
				}else if(this.yanzhengmaVal == '') {
					this.toastFun('图型验证码')
					return
				}else if(this.shoujiYanzhengmaVal == '') {
					this.toastFun('短信验证码')
					return
				}else if(this.denglumimaVal == '') {
					this.toastFun('登录')
					return
				}else if(this.querenmimaVal == '') {
					this.toastFun('确认登录')
					return
				}else if(this.denglumimaVal !== this.querenmimaVal){
					uni.showToast({
						title:"两次密码不一致",
						icon:"none"
					})
					return
				}
				
				
				this.$http.httpPost("/user/registerToPhone",
				{
					phone:this.shoujihaoVal,
					password:this.denglumimaVal,
					yzm:this.shoujiYanzhengmaVal
				},(res) =>{
				
					uni.showToast({
						title:"注册成功",
					})
					setTimeout(()=>{
						uni.navigateBack()
					},1500)
				},true);
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color:#eee;
	}
	.uni-form-item{
		margin-top: 30upx;
		height: 90upx;
		line-height: 90upx;
		border-bottom: 1upx solid #4cB964;
		text{
			// font-size: 14px;
			color:#333;
		}
		position: relative;
		.yanzhengma,
		.shoujiYanzhengma{
			position: absolute;
			right: 0upx;
			width: 150upx;
			height: 70upx;
			top: 10upx;
			
		}
		.shoujiYanzhengma{
			padding: 0;
			font-size: 12px;
			background-color: #4Cb964;
		}
	}
	
</style>
