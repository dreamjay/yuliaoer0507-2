<template>
	<view>
		
		<!-- 一般用法 -->
		<uni-list style="border-bottom:1upx solid #ccc;">
			<navigator url="./xiugaimima/xiugaimima" open-type="navigate" hover-class="">
				<uni-list-item title="修改支付密码" :showArrow="true" ></uni-list-item>
			</navigator>
		</uni-list>
		
		
		<!-- <button style="background-color:#4cB964; position:absolute; bottom: 50upx; width: 690upx; left:30upx" type="primary">退出登录</button> -->
	</view>
</template>

<script>
	import uniList from "@/components/uni-list/uni-list.vue"
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
	
	
	export default {
		components: {uniList,uniListItem},
		data() {
			return {
				
				
			}
		},
		onLoad(option) {
			
			
		},
		
		created() {  
			
		},  
		methods: {
			
		}
	}
</script>

<style>
	page {
		background-color: #eee;
	}
	.listBorderTop .uni-switch-input-checked{
		background-color: #4cB964!important;
		border-color: #4cB964!important;
	}
</style>
