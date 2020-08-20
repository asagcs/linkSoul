<template>
	<view class="myPage">
		
		<cu-custom bgColor="bg-gradual-pink" :isBack="false"><block slot="content">LinkSoul</block></cu-custom>
		<view class="cu-list menu-avatar">
			<view class="cu-item" v-for="(chatItem, index) in myChatList" :key="index" :class="chatItem.listType == 1 ? cur : ''" @click="GoOtherPage(chatItem)">
				<view class="cu-avatar radius lg" :style="[{backgroundImage: getAvatar(chatItem)}]">
					<view class="cu-tag badge" v-if="chatItem.group != '' && (chatItem.num > 0)">{{chatItem.num}}</view>
				</view>
				<view class="content" v-if="chatItem.listType == 1">
					<view>
						<view class="text-cut">{{chatItem.group.groupName}}</view>
						<view class="cu-tag round bg-orange sm">6人</view>
					</view>
					<view class="text-gray text-sm flex">
						<view class="text-cut"> 
							伊泽瑞尔：
							<text class="cuIcon-locationfill text-orange margin-right-xs"></text>
							<text>{{chatItem.lastContent}}</text>
						</view>
					</view>
				</view>
				<view class="content" v-else>
					<view class="text-pink"><view class="text-cut">{{getName(chatItem)}}</view></view>
					<view class="text-gray text-sm flex"> <view class="text-cut">{{chatItem.lastContent}}</view></view>
				</view>
				<view class="action">
					<view class="text-grey text-xs">{{chatItem.updateTime.substring(11,16)}}</view>
					<view class="cuIcon-notice_forbid_fill text-gray"   v-if="chatItem.listType == 1"></view>
					<view class="cu-tag round bg-red sm" v-else-if="chatItem.num">{{chatItem.num}}</view>
				</view>
			</view>
			<!-- <view class="cu-item ">
				<view class="cu-avatar radius lg" style="background-image:url(https://ossweb-img.qq.com/images/lol/img/champion/Morgana.png);"></view>
				<view class="content">
					<view class="text-pink"><view class="text-cut">莫甘娜</view></view>
					<view class="text-gray text-sm flex"> <view class="text-cut">凯尔，你被自己的光芒变的盲目！</view></view>
				</view>
				<view class="action">
					<view class="text-grey text-xs">22:20</view>
					<view class="cu-tag round bg-red sm">5</view>
				</view>
			</view> -->
		</view>
		<view class="cu-tabbar-height"></view>
		</scroll-view>
	</view>
</template>

<script>
	import { mapMutations, mapGetters, mapState } from 'vuex';
	import config from '../../utils/config.js';
	
	export default {
		data() {
			return {
				InputBottom: 0,
				imgApi: config.imgApi
			};
		},
		onLoad() {
		},
		onReady() {
			this.getData()
		},
		onShow() {
			this.getData();
		},
		computed: {
		        ...mapGetters([
		            'myChatList',
		        ]),
				...mapState(["refreshChatList", "userInfo"])
		},
		watch: {
		        myChatList(newVal) {
		            this.list = newVal
		        },
		},
		methods: {
			...mapMutations(['setChatList', 'setGroupList']),
			InputFocus(e) {
				this.InputBottom = e.detail.height
			},
			InputBlur(e) {
				this.InputBottom = 0
			},
			GoOtherPage(chatItem) {
				if(chatItem.listType == 0) {
					//单聊
					let toId = chatItem.customer.id == this.userInfo.id ? chatItem.customerId : chatItem.customer.id;
					let name = chatItem.customer.id == this.userInfo.id ? chatItem.customerName : (chatItem.customer.fullName || chatItem.customer.name);
					uni.navigateTo({
					    url: `/pages/component/chat?chatId=${toId}&chatType=0&listId=${chatItem.id}&name=${name}`,
					});
				}else{
					uni.navigateTo({
					    url: `/pages/component/chat?chatId=${chatItem.group.id}&chatType=1&listId=${chatItem.id}&name=${chatItem.group.groupName}`,
					});
				}
				
			},
			//获取数据
			getData() {
				if(this.refreshChatList){
					return;
				}
				this.getChatsList().then(result => {
					let groupList = [];
					result.map(currentVal => {
						if(currentVal.listType == 1) {
							groupList.push(currentVal)
						}
					});
					this.setGroupList(groupList)
					this.setChatList(result);
					
				}).catch(err => {
					console.log(err);
				})
			},
			//获取聊天列表
			getChatsList(){
				return new Promise((resolve, reject) => {
				    this.$request.ModelIndex.posFnc(`/api/chat/list/page?customerId=${this.userInfo.id}`, {
				    	// page: 1, pageSize: 9
				    }).then(res => {
						//console.log(res)
				    	if (res.code == 1) {
							// console.log(res.data);
				    		resolve(res.data);
				    		//this.allList = res.list;
				    	}
				    }).catch(e => {
						//console.log("获取网络数据失败");
						fetchLocalData('chatList').then(result => {
							resolve(result)
						})
					})
				});
			},
			//获取本地数据
			fetchLocalData(key) {
				return new Promise((resolve, reject) => {
				    try {
				        const value = uni.getStorageSync(key);
				        if (value) {
							let data = JSON.parse(value);
				            resolve(data)
				        }else{
							throw new Error("获取到的数据是空的")
						}
				    } catch (e) {
				        // error
						console.log(e)
						reject(e)
				    }
				});
			},
			//获取头像
			getAvatar(chatItem) {
				if(chatItem.customer != ''){
					return chatItem.customer.imgurl.length > 0 ? (`url(${config.imgApi + chatItem.customer.imgurl})`) : `url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg)`;
				}else{
					return chatItem.group.imgurl ? (`url(${config.imgApi + chatItem.group.imgurl})`) : `url(https://ossweb-img.qq.com/images/lol/web201310/skin/big81020.jpg)`;
				}
			},
			getName(chatItem) {
				if(chatItem.customer.id == this.userInfo.id) {
					return chatItem.customerName;
				}else{
					return chatItem.customer.fullName || chatItem.customer.name
				}
			}
		}
	}
</script>

<style>
	
	.box view.cu-bar {
		margin-top: 0upx;
	}
	
	.firstLevel{
		margin-bottom: 50upx;
	}
</style>
