<template name="personInfo">
	<view>
		<scroll-view class="page">
			<view class="bg-img bg-gradual-green padding-top" style="height: 414upx;">
				<view class="action padding-lr" @tap="BackPage" :style="[{marginTop:'calc(' + StatusBar + 'px)'}]">
					<text class="cuIcon-back"></text>
				</view>
				<view class="padding-xl text-white flex align-center">
					<view class="padding">
						<view class="cu-avatar lg round margin-left" :style="[{backgroundImage: personInfo && personInfo.imgurl.length ? 'url(' + imgApi + personInfo.imgurl + ')' : 'url(https://ossweb-img.qq.com/images/lol/web201310/skin/big25002.jpg)'}]"></view>
					</view>
					<view>
						<view class="padding-xs text-xxl text-bold">
							{{personInfo && personInfo.name}}
						</view>
						<view class="padding-xs text-lg">
							Only the guilty need fear me.
						</view>
					</view>
				</view>
			</view>
			
			<view class="cu-list menu" :class="[menuBorder?'sm-border':'',menuCard?'card-menu margin-top':'']">
				<view class="cu-item arrow" @tap="() => goToOtherPage('/pages/friends/mark')">
					<view class="content">
						<text class="cuIcon-circlefill text-grey"></text>
						<text class="text-grey">添加备注和标签</text>
					</view>
				</view>
				<view class="cu-item" :class="menuArrow?'arrow':''">
					<view class="content">
						<text class="cuIcon-btn text-green"></text>
						<text class="text-grey">更换头像</text>
					</view>
					<view class="action">
						<button class="cu-btn round bg-green shadow">
							<text class="cuIcon-upload"></text> 上传</button>
					</view>
				</view>
				<view class="cu-item" :class="menuArrow?'arrow':''">
					<view class="content">
						<text class="cuIcon-tagfill text-red  margin-right-xs"></text>
						<text class="text-grey">标签</text>
					</view>
					<view class="action">
						<view class="cu-tag round bg-orange light">音乐</view>
						<view class="cu-tag round bg-olive light">电影</view>
						<view class="cu-tag round bg-blue light">旅行</view>
					</view>
				</view>
				<view class="cu-item" :class="menuArrow?'arrow':''">
					<view class="content">
						<text class="cuIcon-warn text-green"></text>
						<text class="text-grey">文本</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">小目标还没有实现！</text>
					</view>
				</view>
				
				<view class="padding flex flex-direction">
					<button class="cu-btn bg-green lg" @tap="() => goToOtherPage(`/pages/component/chat?chatId=${friendId}&chatType=0&name=${personInfo.name}`)">发送消息</button>
					<button class="cu-btn bg-red margin-tb-sm lg" @tap="deleteFromGroup" v-if="deleteShow">踢出群聊</button>
					<button class="cu-btn bg-red margin-tb-sm lg" @tap="BackPage" v-else>拉黑</button>
				</view>
			</view>
			<view class="cu-tabbar-height"></view>
		</scroll-view>
	</view>
</template>

<script>
	import config from '../../utils/config.js';
	
	export default {
		data() {
			return {
				cuIconList: [{
					cuIcon: 'cardboardfill',
					color: 'red',
					badge: 120,
					name: 'VR'
				}, {
					cuIcon: 'recordfill',
					color: 'orange',
					badge: 1,
					name: '录像'
				}, {
					cuIcon: 'picfill',
					color: 'yellow',
					badge: 0,
					name: '图像'
				}, {
					cuIcon: 'noticefill',
					color: 'olive',
					badge: 22,
					name: '通知'
				}, {
					cuIcon: 'upstagefill',
					color: 'cyan',
					badge: 0,
					name: '排行榜'
				}, {
					cuIcon: 'clothesfill',
					color: 'blue',
					badge: 0,
					name: '皮肤'
				}, {
					cuIcon: 'discoverfill',
					color: 'purple',
					badge: 0,
					name: '发现'
				}, {
					cuIcon: 'questionfill',
					color: 'mauve',
					badge: 0,
					name: '帮助'
				}, {
					cuIcon: 'commandfill',
					color: 'purple',
					badge: 0,
					name: '问答'
				}, {
					cuIcon: 'brandfill',
					color: 'mauve',
					badge: 0,
					name: '版权'
				}],
				modalName: null,
				gridCol: 3,
				gridBorder: false,
				menuBorder: false,
				menuArrow: false,
				menuCard: false,
				skin: false,
				listTouchStart: 0,
				listTouchDirection: null,
				StatusBar: this.StatusBar,
				personInfo: {},
				imgApi: config.imgApi,
				sortList: [ '#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '`' ],
				deleteShow: false
			};
		},
		onLoad(options) {
			let myFriendsList = this.$store.state.friendList.data;
			this.friendId = options.friendId;
			if(options.pos) {
				let index = myFriendsList[options.pos].findIndex(item => item.id == options.friendId);
				this.personInfo = myFriendsList[options.pos][index];
			}else{
				this.deleteShow = true;
				this.groupId = options.groupId;
				for(let i = 0; i < 28; i++){
					//console.log(this.sortList[i].length)
					if(this.sortList[i].length !== 0){
						let getData = myFriendsList[this.sortList[i]].find(item => item.id == options.friendId);
						if(getData) {
							//console.log(getData)
							this.personInfo = getData;
							break;
						}
					}
				} 
				
			}
		},
		
		methods: {
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
			Gridchange(e) {
				this.gridCol = e.detail.value
			},
			Gridswitch(e) {
				this.gridBorder = e.detail.value
			},
			MenuBorder(e) {
				this.menuBorder = e.detail.value
			},
			MenuArrow(e) {
				this.menuArrow = e.detail.value
			},
			MenuCard(e) {
				this.menuCard = e.detail.value
			},
			SwitchSex(e) {
				this.skin = e.detail.value
			},

			// ListTouch触摸开始
			ListTouchStart(e) {
				this.listTouchStart = e.touches[0].pageX
			},

			// ListTouch计算方向
			ListTouchMove(e) {
				this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left'
			},

			// ListTouch计算滚动
			ListTouchEnd(e) {
				if (this.listTouchDirection == 'left') {
					this.modalName = e.currentTarget.dataset.target
				} else {
					this.modalName = null
				}
				this.listTouchDirection = null
			},
			goToOtherPage(url) {
				uni.navigateTo({ url: url });
			},
			BackPage() {
				uni.navigateBack({
					delta: 1
				});
			},
			deleteFromGroup() {
				this.$request.ModelIndex.posFnc(`/api/chat/list/removeFromGroup?customerId=${this.friendId}&groupId=${this.groupId}`, {
					// page: 1, pageSize: 9
				}).then(res => {
					//console.log(res);
					if (res.code == 1) {
						this.BackPage();
						//this.allList = res.list;
					}
				})
			}
		}
	}
</script>

<style>
	Page {
		height: 100Vh;
		width: 100vw;
	}
	
	.page.show {
		overflow: hidden;
	}

	.switch-sex::after {
		content: "\e716";
	}

	.switch-sex::before {
		content: "\e7a9";
	}

	.switch-music::after {
		content: "\e66a";
	}

	.switch-music::before {
		content: "\e6db";
	}
</style>
