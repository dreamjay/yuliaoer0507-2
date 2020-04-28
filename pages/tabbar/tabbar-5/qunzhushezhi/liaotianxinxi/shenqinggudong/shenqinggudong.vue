<template>
	<view class="myList">
		<ul>
			<li class="SelectList" style="padding-top: 30upx;">
				<text>微信号：</text>
				<input class="right" type="text"  v-model="wx">
			</li>
			<li class="SelectList">
				<text>电话号码：</text>
				<input class="right duan" type="number"  v-model="tel">
			</li>
			<li class="SelectListMax">
				<text>备注：</text>
				<view class="bottom">
					<textarea :maxlength="80"  v-model="beizhu"/>
				</view>
			</li>
			<li class="SelectListMax1">
				<text>设置股东比例：</text><mark style="padding: 10upx; background-color: #4CB964; color: #fff; border-radius: 2px;">{{jindutiao}}% </mark>
				<view class="bottom">
					<cu-progress 
						class="progress" 
						activeColor="#4cb964" 
						noActiveColor="#eee" 
						:strokeWidth="10" 
						width="100%" 
						:borderRadius="5"
						handleColor="#4cb964"
						handleSize="20px"
						handleBorderRadius="20px"
						@change	="change"
						@dragstart	="dragstart"
						@dragging	="dragging"
						@dragged="dragged"	
						@dragcancel="dragcancel"
					></cu-progress>
				</view>
			</li>
			<li class="SelectList" style="padding-bottom: 30upx;">
				<button @click="submit" style="background-color:#4cb964; width: 650upx;" type="primary">提交申请</button>
			</li>
		</ul>
		</view>
	</view>
</template>

<script>
	import cuProgress from '@/components/cu-progress/cu-progress.vue'
	export default{
		components:{cuProgress},
		data(){
			return{
				wx:'',
				tel:'',
				beizhu:'',
				jindutiao:0,
				crowdId:null
			}
		},
		onLoad(option) {
			
			this.crowdId = option.crowdId
		},
		methods:{
			toastFun(val){
				uni.showToast({
					title:""+val+"不能为空",
					icon:"none"
				})
			},
			submit(){
				if(this.wx == ''){
					this.toastFun('微信号')
					return
				} else if(this.tel == ''){
					this.toastFun('电话号')
					return
				} else{
					this.$http.httpPostToken('/shareholder-apply/apply',{
						crowdId:this.crowdId,
						bili:this.jindutiao/100,
						phone:this.tel,
						wxAccount:this.wx,
						mark:this.beizhu
					},(res)=>{
						uni.showToast({
							title:'群主审核中.'
						})
						setTimeout(()=>{
							uni.navigateBack({})
						},1500)
					},true)
				}
				
			},
			change(e){
				this.jindutiao = e.value
			},
			dragstart(e){
				this.jindutiao = e.value
			},
			dragging(e){
				this.jindutiao = e.value
			},
			dragged(e){
				this.jindutiao = e.value
			},
			dragcancel(e){
				this.jindutiao = e.value
			},
		}
	}
</script>

<style>
	page{
		background-color: #eee;
	}
	.myList{
		
		font-size: 28upx;
		color: #333;
	}
	.myList ul{
		/* border-top: 1upx solid #ddd; */
		/* border-bottom: 1upx solid #ddd; */
	}
	.myList .SelectList{
		position: relative;
		height: 120upx;
		line-height: 120upx;
		padding: 0upx 50upx;
		background-color: #fff;
		/* border-bottom: 1px solid #ddd; */
	}
	
	
	.myList text{
		vertical-align: middle;
		margin-left: 10upx;
	}
	.myList .SelectList .right{
		width: 410upx;
		vertical-align: middle;
		display: inline-block;
		/* text-align: right; */
		border-bottom: 1px solid #ddd;
		margin-left: 50upx;
		/* float: right; */
		
	}
	.myList .SelectList .duan{
		margin-left: 30upx;
	}
	.myList .SelectList image{
		width: 30upx;
		height: 30upx;
		float: right;
		margin-top: 45upx;
	}
	.myList .SelectListMax{
		position: relative;
		height: 210upx;
		// line-height: 120upx;
		padding: 30upx 50upx 30upx 50upx;
		background-color: #fff;
		
	}
	.myList .SelectListMax text{
		height: 80upx;
		display: inline-block;
		line-height: 80upx;
		vertical-align: top;
		
	}
	.myList .SelectListMax .bottom{
		border: 0;
		width: 500upx;
		display: inline-block;
		
	}
	.myList .SelectListMax .bottom textarea{
		background-color: #EEEEEE;
		width: calc(100% - 30px);
		height: 120upx;
		padding: 15px;
		border-radius: 5px;
		vertical-align: top;
	}
	.myList .SelectListMax1{
		position: relative;
		height: 210upx;
		// line-height: 120upx;
		padding: 30upx 50upx 30upx 50upx;
		background-color: #fff;
		
	}
	.myList .SelectListMax1 text{
		line-height: 80upx;
		vertical-align: top;
	}
	.myList .SelectListMax1 .bottom{
		border: 0;
		margin-top: 50upx;
		width: 610upx;
		display: inline-block;
		
	}
	
	
</style>
