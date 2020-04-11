<template>
	<view class="maxBox">
		<view class="left">
			<view @click="handleRoute('left',index)" class="box" :key="index" v-for="(item,index) in querys.left">
				<text>{{item.text}}</text>
			</view>
		</view>
		<view class="right">
			<view @click="handleRoute('right',index)" class="box" :key="index" v-for="(item,index) in querys.right">
				<text>{{item.text}}</text>
			</view>
		</view>
		
	</view>
	
</template>

<script>
export default {
	data() {
		return {
			querys: {
				left:[
					{
						path:'./query/query1',
						text:'联系客服'
					},
					{
						path:'./query/query2',
						text:'群架构'
					},
					{
						path:'./query/query3',
						text:'如何充值提现？'
					},
					{
						path:'./query/query4',
						text:'群ID靓号'
					}
				],
				right:[
					{
						path:'./query/query5',
						text:'娱乐平台'
					},
					{
						path:'./query/query6',
						text:'开群如何盈利'
					},
					{
						path:'./query/query7',
						text:'投诉与建议'
					},
					{
						path:'./query/query8',
						text:'靓号推荐码'
					}
				]
			}
		};
	},
	onLoad() {},
	methods: {
		handleRoute(leftOrRight,index){
			if(leftOrRight == 'left'){
				uni.navigateTo({url:this.querys.left[index].path})
			} else{
				uni.navigateTo({url:this.querys.right[index].path})
			}
			
		}
	}
};
</script>

<style lang='scss' scope>
	page{
		background-color: #eee;
	}
	.maxBox{
		width: 100vw;
		height: 95vh;
		.left{
			float: left;
		}
		.right{
			float: right;
		}
		.left,.right{
			display: flex;
			flex-direction: column ;
			justify-content: space-around;
			height: 100%;
			/* display: inline-block; */
			width: 50%;
			.box {
				position: relative;
				width: 50px;
				height: 86.6px;
				// margin: 50px auto;
				line-height: 86.6px;
				text-align: center;
				background-color: #fff;
				transform: rotate(-90deg) translateY(-25%);
				left: 50%;
				
				
				/* transform: translateX(-50%); */
				text{
					color: #4cB964;
					position: absolute;
					left: 0px;
					top: 18px;
					transform: rotate(90deg);
					white-space: nowrap;  /*强制span不换行*/
					font-size: 14px;
					width: 86.6px;
					height: 50px;
				}
			}
			.box::before {
				
				content: '';
				display: block;
				position: absolute;
				width: 0;
				height: 0;
				right:50px;
				border-width: 43.3px 25px;
				border-style: solid;
				border-color: transparent #fff transparent transparent;
			}
			.box::after {
				
				content: '';
				display: block;
				position: absolute;
				width: 0;
				height: 0;
				left:50px;
				border-width: 43.3px 25px;
				border-style: solid;
				border-color: transparent transparent transparent #fff;
				top:0;
			}
		}
	}
	
</style>
