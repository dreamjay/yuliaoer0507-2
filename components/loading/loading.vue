<template>
	<view class="maxBox">
		<view  class="loadBox" >
			<image  src="/static/loading2.gif"></image>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				
			}
		},
		watch:{
			'$store.state.isLoading'(newVal){
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.maxBox{
		position: absolute;
		// width: 100vw;
		// height: 100vh;
		z-index: 999;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background-color: transparent;
	}
	.loadBox{
		/* width: 300upx; 
		height: 200upx; */
		width: 100upx;
		height: 100upx;
		position: absolute; 
		/* background-color: rgba(76,185,100,1); */
		background-color: rgba(255,255,255,1);
		left: 50%; 
		top: 44%; 
		transform: translate(-50%,-50%);
		border-radius: 10upx;
		box-shadow:#ccc 0px 0px 33px;//将h-shadow,v-shadow设为0px,实现四周阴影
	}
	image{
		z-index: 2; 
		position: absolute;
		left: 25upx;
		top:25upx;
		width:50upx; 
		height:50upx;
	}
</style>
