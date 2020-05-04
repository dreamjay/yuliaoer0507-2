<!-- 
	自定义图片组件
	1.对异常出错图片或加载失败图片进行替补方案，
	2.对图片地址路径进行补充操作，当为服务器地址是，自动添加服务器需要的请求前缀，如：https://192.168.0.1:3000/fileUpload等
	3.对图片进行缓存操作，如果图片可以正确显示，那么对图片下载到本地，以便下次可以快速操作
	4.对图片进行归类，不同的类别，缓存不同的时间，
		永久缓存 （实现）
		应用临时缓存（实现）
		如果图片类型时效性强，则缓存30分钟（未实现 【期望】），
		如果为系统常用图片，则永久缓存（未实现 【期望】），
		如果为常用信息图标，则缓存7天，生效日期以下载图片日期为准（未实现 【期望】），
 -->
<template>

	<image v-if="showDefault||!src" :class="orgStyle" mode="aspectFit" :src="defautlError"></image>
	<image  v-else :class="orgStyle" :fade-show="fadeShow" :mode="mode" :src="imgSrc" lazy-load="true"  @error="errorImage(imgSrc)"
	 @tap="previewImage"></image>
</template>

<script>
	const cacheTypeTime = {
		'-1': -1, //永久
		'0': 0, //临时文件，在程序启动时间内可用
		// '1': 30 * 60, //30分钟
		// '2': 24 * 60 * 7, //7天
	}
	//图片保存到本地的文件夹
	const saveFile = "_doc/";
	
	//图片加载失败，再次尝试间隔时间 （毫秒）
	const errorSplitTime=200;
	

	const hashCode = function(str) {
		var hash = 0,
			i, chr, len;
		if (str.length === 0) return hash;
		for (i = 0, len = str.length; i < len; i++) {
			chr = str.charCodeAt(i);
			hash = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
		}
		return hash;
	}


	import storage from '../../API/storage-cache.js';
	import conf from '../../API/config.js';
	export default {
		name: 'org-image',
		data() {
			return {
				defautlError: conf.defautlErrorImage,
				showAnimation: true,
				showDefault: false,
				imgSrc: this.src,
				httpPrefix: conf.redImgPath, //服务器地址前缀 https://192.168.0.1:3000/fileUpload
				errorCount: 0,
				styles: {
					width: this.size.width,
					height: this.size.height,
					'border-radius': this.isCircle ? '50%' : '0'
				},
				orgStyle:null
			}
		},
		watch: {
			imgSrc(old, news) {
				// uni.showToast({
				// 	title: old,
				// })
			}
		},
		props: {
			src: {
				type: String,
				default: ''
			},
			size: {
				type: Object,
				default: function() {
					return {
						width: '80rpx',
						height: '80rpx'
					}
				}
			},
			mode: {
				type: String,
				default: 'aspectFill'
			},
			fadeShow: {
				type: Boolean,
				default: true

			},
			cacheType: {
				type: Number,
				default: 0
			},
			isPreview: {
				type: Boolean,
				default: false

			},
			isCircle: {
				type: Boolean,
				default: true
			},
			css: {
				type: String,
				default: ''
			}
		},
		methods: {

			previewImage() {
				if (!this.isPreview || this.showDefault) {
					return;
				}
				uni.previewImage({
					count: 1,
					current: 0,
					urls: [this.src]
				})
			},

			errorImage(imageSrc) {
				if (!imageSrc) {
					this.showDefault = true;
					return;
				}
				var ind = setInterval(() => {
					this.errorCount++;
					if (this.errorCount < 2) {
						this.imgSrc = imageSrc;
						this.showDefault = false;
					} else {
						this.showDefault = true;
						this.errorCount = 0;
						clearInterval(ind);
						return;
					}
				}, errorSplitTime);
			},

			//1.修补图片路径为服务器路径 此方法在created中调用
			changeImageSrc() {
				if (!this.imgSrc) {
					return;
				}
				var oldUrl = this.imgSrc;
				//1.判断图片是否是app静态图片
				if (oldUrl.indexOf("/static/") >= 0 || oldUrl.indexOf(saveFile) >= 0) {
					return;
				}
				var _hashCode = hashCode(oldUrl) + "";
				var cachUrl = this.getChcheFile(_hashCode);
				if (cachUrl) {
					this.imgSrc = cachUrl;
					// uni.showToast({
					// 	title: '获取缓存路径：' + this.imgSrc
					// });
					// console.log('获取缓存路径：' + this.imgSrc + '类型：' + this.cacheType);
					return;
				}

				var url = this.imgSrc;
				//2.判断图片是否有http前缀
				if ((url + "").toLowerCase().indexOf("http://") < 0 && (url + "").toLowerCase().indexOf("https://") < 0) {
					//3.追加需要的服务前前缀
					url = this.httpPrefix + url;
				}

				//4.下载图片，并缓存
				this.downImageFile(oldUrl, url);

			},

			//获取缓存的文件路径
			getChcheFile(orlUrl) {
				if (cacheTypeTime[this.cacheType + ""] == 0) {
					return storage.temporary.get(orlUrl);
				} else {
					return storage.get(orlUrl) || storage.temporary.get(orlUrl);
				}
			},

			//下载图片缓存，并记录到缓存中
			downImageFile(orlUrl, url) {
				uni.downloadFile({
					url: url,
					success: (res) => {
						if (res.statusCode === 200) {
							var _hashCode = hashCode(orlUrl) + "";
							//缓存数据
							var typeOrTime = cacheTypeTime[this.cacheType + ""];
							if (typeOrTime == 0) { //临时存储
								storage.temporary.put(_hashCode, res.tempFilePath, 30 * 60);
								// console.log("缓存文件：hashCode" + _hashCode + "为临时存储..下载路径：" + url + "时长：" + typeOrTime + "...文件路径：" + res.tempFilePath)
							} else {

								//本地类型,如果保存失败，则保为应用内缓存（通常会发生在H5端，不支持uni.saveFile该对象）
								try {
									uni.saveFile({
										tempFilePath: res.tempFilePath,
										success: function(res) {
											var savedFilePath = res.savedFilePath;

											// uni.previewImage({
											// 	count: 0,
											// 	urls: [savedFilePath]
											// })
											// console.log("保存文件成功：" + savedFilePath)
											if (typeOrTime == -1) {
												//永久类型
												storage.put(_hashCode, savedFilePath);
												// console.log("缓存文件：hashCode" + _hashCode + "为永久类型" + savedFilePath)
											} else {
												//其他固定时长
												storage.put(_hashCode, savedFilePath, typeOrTime);
												// console.log("缓存文件：hashCode" + _hashCode + "为固定时长类型下载路径：" + url + "时长：" + typeOrTime + "...文件路径：" +
												// savedFilePath)
											}
										}
									});
								} catch (e) {
									storage.temporary.put(_hashCode, res.tempFilePath, 30 * 60);
								}
							}
						}
					}
				});
			}

		},
		created() {
			setTimeout(() => {
				this.showAnimation = false;
			}, 1000);
			//
			this.changeImageSrc();
			
			this.orgStyle=this.css;
		}
	}
</script>

<style lang="scss" scoped>
	// $size:80rpx;

	// .org-image-base {
	// 	width: 100%;
	// 	height: 100%;
	// 	position: relative;

	// 	.org-image {
	// 		position: absolute;
	// 		top: 50%;
	// 		left: 50%;
	// 		transform: translate(-50%, -50%);
	// 	}

	// 	.error-default {

	// 		max-width: 80rpx;
	// 		max-height: 80rpx;
	// 	}

	// 	.error-max-size {
	// 		max-width: 80rpx;
	// 		max-height: 80rpx;
	// 	}
	// }


	// .rotate-animation {
	// 	-webkit-animation: rotate-1 .8s linear infinite;
	// }

	// @-webkit-keyframes rotate-1 {
	// 	0% {
	// 		-webkit-transform: rotate(0deg);
	// 	}

	// 	22% {
	// 		-webkit-transform: rotate(90deg);
	// 	}

	// 	40% {
	// 		-webkit-transform: rotate(180deg);
	// 	}

	// 	76% {
	// 		-webkit-transform: rotate(270deg);
	// 	}

	// 	100% {
	// 		-webkit-transform: rotate(360deg);
	// 	}

	// }
</style>
