<template>
	<view class="content">
		<button @click="open()">开始</button>
	</view>
</template>

<script>
	export default {
		components:{
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
			},
			open:function(){
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
