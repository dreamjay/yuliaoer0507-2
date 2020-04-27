<template>
	<view class="content">
		<view class="myCenter">
			<navigator url="./myCenter/myCenter" open-type="navigate" hover-class="">
				<image class="touxiang" :src="userInfo.headUrl ? userInfo.headUrl : '/static/moren.png'" mode="aspectFill"></image>
				<view class="text">
					<p>{{userInfo.nickName ? userInfo.nickName : '新用户'}}</p>
					<p>推荐码：{{userInfo.referralCode}}</p>
				</view>
				<image class="bianji" src='/static/img/wo/bianji.png'></image>
			</navigator>
		</view>
		
		<view class="myList">
			<ul>
				<li class="SelectList listBorderTop nullBottom" v-if="userInfo.showCrowd">
					<navigator url="./qunzhushezhi/qunzhushezhi" open-type="navigate" hover-class="">
						<image src="/static/img/wo/qunzhu.png" mode=""></image><text>群主设置</text><image src="/static/img/wo/youjiantou.png"></image>
					</navigator>
				</li>
				<li class="SelectList listBorderTop">
					<navigator url="./fenxiang/fenxiang" open-type="navigate" hover-class="">
						<image src="/static/img/wo/fenxiang.png" mode=""></image><text>推荐分享</text><image src="/static/img/wo/youjiantou.png"></image>
					</navigator>
				</li>
				<li class="SelectList">
					<navigator url="./qunliao/qunliao" open-type="navigate" hover-class="">
						<image src="/static/img/wo/qunliao.png" mode=""></image><text>我的群聊</text><image src="/static/img/wo/youjiantou.png"></image>
					</navigator>
				</li>
				<li class="SelectList nullBottom" @click="updataApp">
					<image src="/static/img/wo/gengxin.png" mode=""></image><text>版本更新</text><image src="/static/img/wo/youjiantou.png"></image>
				</li>
				<li class="SelectList nullBottom listBorderTop">
					<navigator url="./gerenshezhi/gerenshezhi" open-type="navigate" hover-class="">
						<image src="/static/img/wo/shezhi.png" mode=""></image><text>个人设置</text><image src="/static/img/wo/youjiantou.png"></image>
					</navigator>
				</li>
			</ul>
		</view>
		
		
		
		
	</view>
</template>

<script>
	

	export default {
		data() {
			return {
				title: 'Hello',
				userInfo: ''
			}
		},
		onLoad() {
			
		},
		onShow(){
			this.userInfo = uni.getStorageSync('userInfo')
		},
		methods: {
			updataApp(){
				//#ifdef APP-PLUS  
					console.log(plus)
				    var server = "http://zcttt.vipgz5.idcfengye.com/version/getVersionByAppid"; //检查更新地址  
				    var req = { //升级检测数据  
				        "appid": plus.runtime.appid,  
				    };
					uni.showToast({
						title:"已是最新版本",
						icon:'none'
					})
					return
				    uni.request({
				        url: server,  
				        data: req,  
				        success: (res) =>{  
				            // if (res.statusCode == 200 && res.data.status === 1) {  
				            //     uni.showModal({ //提醒用户更新  
				            //         title: "更新提示",  
				            //         content: res.data.note,  
				            //         success: (res) => {  
				            //             if (res.confirm) {  
				            //                 plus.runtime.openURL(res.data.url);  
				            //             }  
				            //         }  
				            //     })  
				            // }
							console.log(res)
				        }  
				    })  
				//#endif  
			}
		}
	}
</script>

<style>
	page {
		background-color: #eee;
	}
	.content {
		
		height: 100%;
		
	}
	
	.myCenter{
		background-color: #fff;
		height: 160upx;
		padding: 40upx;
	}
	.myCenter .touxiang {
		width: 140upx;
		height: 140upx;
		border-radius: 70upx 70upx;
		margin-top: 10upx;
	}
	.myCenter .text{
		padding-left: 15upx;
		width: 400upx;
		vertical-align: top;
		display: inline-block;
		margin-top: 5%;
		
	}
	.myCenter .text p{
		
		line-height: 50upx;
		font-size: 30upx;
		color: #333;
	}
	.myCenter .text p:first-of-type{
		font-weight: bold;
	}
	.myCenter .text p:last-of-type{
		font-size: 12px;
	}
	.myCenter .bianji{
		float: right;
		margin-top: 60upx;
		width: 40upx;
		height: 40upx;
	}
	.myList{
		
		font-size: 28upx;
		color: #333;
	}
	.myList ul{
		border-top: 1upx solid #ddd;
		border-bottom: 1upx solid #ddd;
	}
	.myList .SelectList{
		position: relative;
		height: 120upx;
		line-height: 120upx;
		padding: 0upx 50upx;
		background-color: #fff;
		/* border-bottom: 1px solid #ddd; */
	}
	.myList .SelectList::before{
		content: '';
		position: absolute;
		height: 1upx;
		background-color: #ddd;
		width: calc(100% - 50upx);
		bottom: 0;
		right: 0;
	}
	.myList .nullBottom::before{
		content: '';
		position: absolute;
		height: 0upx;
		background-color: #ddd;
		width: calc(100% - 50upx);
		bottom: 0;
		right: 0;
	}
	.myList .SelectList image{
		width: 40upx;
		height: 40upx;
	}
	.myList text{
		vertical-align: middle;
		margin-left: 15upx;
	}
	.myList .SelectList image:first-of-type{
		float: left;
		margin-top: 40upx;
	}
	.myList .SelectList image:last-of-type{
		float: right;
		margin-top: 40upx;
	}
</style>
