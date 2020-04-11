<template>
	<view class="content">
		<button @click="open()">开始</button>
		<loading 
			ref="loading"
			:custom="false"
			:shadeClick="true"
			:type="1"
			@callback="callback()">
			<!-- <view class="test">自定义</view> -->
		</loading>
	</view>
</template>

<script>
	import loading from '../../components/xuan-loading/xuan-loading.vue'
	export default {
		components:{
			loading
		},
		data() {
			return {
			}
		},
		mounted() {
			this.open();
			setTimeout(()=>{
				this.close();
			},2000)
		},
		methods: {
			close:function(){
				this.$refs.loading.close();
			},
			open:function(){
				this.$refs.loading.open();
			},
			callback(){
				console.log("关闭后回掉");
			}
		}
	}
</script>

<style>
	.test{
		animation: 1s aaa infinite;
	}
	@keyframes aaa{
		from{transform: rotate(0deg);}
		to{transform: rotate(360deg);}
	}
	.content{

	}
</style>
