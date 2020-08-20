<template>
	<view class="myPage">
		<cu-custom bgColor="bg-gradual-pink" :isBack="true"><block slot="backText">返回</block><block slot="content">{{name}}</block></cu-custom>
		<scroll-view id="scrollview" scroll-y :scroll-into-view="'indexes-'+ nowPos"  :style="[{height:'calc(100vh - '+ CustomBar + 'px - 50px)'}]">
			<view class="marginPage cu-chat">
				<view v-for="(item, index) in listData" v-bind:key="index" :id="'indexes-' + index" :data-index="index">
						<!-- <view class="cu-item self" v-if="item.userId == userInfoA.userId && item.messageType != 3 && item.messageType !== 5  && item.messageType !== 6">
							<view class="main" v-if="item.messageType == 2 || item.messageType == 0">
								<view class="content bg-green shadow" v-if="item.messageType == 2">
									<text>{{item.messageContent}}</text>
								</view> 
								<image src="https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg" class="radius" mode="widthFix" v-else></image>
							</view>
							<view class="main" v-else-if="item.messageType == 1 ">
								<view class="action text-bold text-grey">
									3"
								</view>
								<view class="content shadow">
									<text class="cuIcon-sound text-xxl padding-right-xl"> </text>
								</view>
							</view>
							<view class="main" v-else-if="item.messageType == 4">
								<view class="action">
									<text class="cuIcon-locationfill text-orange text-xxl"></text>
								</view>
								<view class="content shadow">
									喵星球，喵喵市
								</view>
							</view>
							<view class="cu-avatar radius" :style="[{ backgroundImage: 'url('+ userInfoA.userAvatar + ')'}]"></view>
							<view class="date">2018年3月23日 13:23</view>
						</view>
						
						<view class="cu-item" v-if="item.userId !== userInfoA.userId && item.messageType != 3">
							<view class="cu-avatar radius" :style="[{ backgroundImage: 'url('+ userInfoA.userAvatar + ')'}]"></view>
							<view class="main" v-if="item.messageType == 2 || item.messageType == 0">
								<view class="content bg-green shadow" v-if="item.messageType == 2">
									<text>{{item.messageContent}}</text>
								</view> 
								<image src="https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg" class="radius" mode="widthFix" v-else></image>
							</view>
							<view class="main" v-else-if="item.messageType == 1 ">
								<view class="action text-bold text-grey">
									3"
								</view>
								<view class="content shadow">
									<text class="cuIcon-sound text-xxl padding-right-xl"> </text>
								</view>
							</view>
							<view class="main"   v-else-if="item.messageType == 4">
								<view class="action">
									<text class="cuIcon-locationfill text-orange text-xxl"></text>
								</view>
								<view class="content shadow">
									喵星球，喵喵市
								</view>
							</view>
							
							<view class="date">2018年3月23日 13:23</view>
						</view>
						
						<view class="cu-item flex align-center" v-else-if="item.messageType == 3">
							<view class="cu-info round" v-if="item.userId == userInfoA.userId">你撤回一条消息!</view>
							<view class="cu-info round" v-else>对方撤回一条消息！</view>
						</view>
						
						<view class="flex" v-else-if="item.messageType == 5">
							<view class="cu-info align-center">
								对方开启了好友验证，你还不是他(她)的好友。请先发送好友验证请求，对方验证通过后，才能聊天。
								<text class="text-blue">发送好友验证</text>
							</view>
							
						</view>
						
						<view class="flex"  v-else-if="item.messageType == 6">
							<view class="cu-info align-center">
								<text class="cuIcon-roundclosefill text-red "></text> 对方拒绝了你的消息
							</view>
							
						</view> -->
					<view class="cu-item self" v-if="item.customerId == userInfo.id">
						<view class="main">
							<view class="content bg-green shadow">
								<text>{{item.content}}</text>
							</view> 
						</view>
						<view class="cu-avatar radius" :style="[{ backgroundImage: 'url('+ imgApi + userInfo.imgurl + ')'}]"></view>
						<view class="date">{{item.updateTime}}</view>
					</view>
						
					<view class="cu-item" v-if="item.customerId !== userInfo.id">
						<view class="cu-avatar radius" :style="[{ backgroundImage: 'url('+ imgApi + item.customerUrl + ')'}]"></view>
						<view class="main">
							<view class="content bg-green shadow">
								<text>{{item.content}}</text>
							</view> 
						</view>
						<view class="date">{{item.updateTime}}</view>
					</view>
						
					<view class="cu-item flex align-center" v-else-if="item.messageType == 3">
						<view class="cu-info round" v-if="item.userId == userInfoA.userId">你撤回一条消息!</view>
						<view class="cu-info round" v-else>对方撤回一条消息！</view>
					</view>
						
					<view class="flex" v-else-if="item.messageType == 5">
						<view class="cu-info align-center">
							对方开启了好友验证，你还不是他(她)的好友。请先发送好友验证请求，对方验证通过后，才能聊天。
						<text class="text-blue">发送好友验证</text>
						</view>	
					</view>
					
					<view class="flex"  v-else-if="item.messageType == 6">
						<view class="cu-info align-center">
							<text class="cuIcon-roundclosefill text-red "></text> 对方拒绝了你的消息
						</view>	
					</view>
				</view>
			</view>
		</scroll-view>

		<view class="cu-bar foot input" :style="[{bottom:InputBottom+'px'}]">
			<view class="action">
				<text class="cuIcon-sound text-grey"></text>
			</view>
			<input class="solid-bottom" :adjust-position="false" :focus="false" maxlength="300" cursor-spacing="10"
			 @focus="InputFocus" @blur="InputBlur" v-model="messageCon"></input>
			<view class="action">
				<text class="cuIcon-emojifill text-grey"></text>
			</view>
			<button class="cu-btn bg-green shadow" @click="sendMessage">发送</button>
		</view>
		<view class="cu-tabbar-height"></view>
	</view>
</template>

<script>
	import { mapMutations, mapGetters, mapState } from 'vuex';
	import config from '../../utils/config.js';
	
	export default {
		data() {
			return {
				InputBottom: 0,
				pageSize: 15,
				page: 1,
				scrollTop:0,
				CustomBar: this.CustomBar,
				// messageList: [
				// 	{
				// 		userId: 1,
				// 		userAvatar: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg',
				// 		messageType: 2, //0 图片 1语音 2文字 3 撤回 4定位 5非好友 6.拒收消息
				// 		messageContent: "我就是测试测试"
				// 	},
				// 	{
				// 		userId: 1,
				// 		userAvatar: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg',
				// 		messageType: 3, //0 图片 1语音 2文字
				// 		messageContent: "e, 测试啊"
				// 	},
				// 	{
				// 		userId: 1,
				// 		messageType: 0, //0 图片 1语音 2文字
				// 		messageContent: "e, 测试啊"
				// 	},
				// 	{
				// 		userId: 2,
				// 		userAvatar: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg',
				// 		messageType: 2, //0 图片 1语音 2文字 3 撤回 4定位 5非好友 6.拒收消息
				// 		messageContent: "我就是测试测试"
				// 	},
				// 	{
				// 		userId: 2,
				// 		messageType: 0, //0 图片 1语音 2文字
				// 		messageContent: "e, 测试啊"
				// 	},
				// 	{
				// 		userId: 1,
				// 		messageType: 1, //0 图片 1语音 2文字
				// 	},
				// 	{
				// 		userId: 1,
				// 		messageType: 4, //0 图片 1语音 2文字
				// 	},
				// 	{
				// 		userId: 1,
				// 		messageType: 5,
				// 	},
				// 	{
				// 		userId: 1,
				// 		messageType: 6,
				// 	}
				// ],
				userInfoA:{
					userId: 1,
					userAvatar: "https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg"
				},
				chatType: 0,
				chatId: 0,
				listData: [],
				imgApi: config.imgApi,
				messageCon: '',
				nowPos: '',
				name: ''
			};
		},
		computed: {
			...mapState(["userInfo"]),
			myChatTextToOne() {
				return this.$store.getters.myChatTextToOne('chatId' + this.chatId)
			}
		},
		watch: {
		    myChatTextToOne(newVal, oldVal) {
		        this.listData = newVal
				this.nowPos = oldVal ? oldVal.length - 1 : 0;
				this.$nextTick(function(){
					this.nowPos = newVal.length - 1;
				})
		    },
		
		},
		onLoad(options) {
			this.chatId = options.chatId;
			this.listData = this.$store.state['chatId' + options.chatId]
			this.chatType = options.chatType;
			this.name = options.name;
			this.client = this.$mqttClient;
			this.onTopic = 'chat/' + options.chatId;
			this.subscribe();
			if(options.listId) {
				this.getChatTextList(options.chatId, options.chatType);
			}else{
				this.$request.ModelIndex.posFnc(`/api/chat/list/add`, {
					customerId: this.$store.state.userId,
					customer: {
							id: options.chatId,
							
					},
					listType: options.chatType
				}).then(res => {
					if (res.code == 1) {
						this.listId = res.data.id;
						this.getChatTextList(options.chatId, options.chatType)
					}
				})
			}
			//this.getChatTextList(options.chatId, options.chatType);
			//创建聊天通道
			//this.scrollToBottom()
		},
		methods: {
			...mapMutations(['setChatTextHistory']),
			InputFocus(e) {
				this.InputBottom = e.detail.height
			},
			InputBlur(e) {
				this.InputBottom = 0
			},
			//获取该聊天的聊天记录
			getChatTextList(chatId, chatType){
				let chetKey = "chatId" + chatId;
				let hasData = this.$store.state.chatTextList[chetKey];
				if(hasData){
					return;
				}
				this.$request.ModelIndex.posFnc(`/api/chat/history/page?ListId=${this.chatId}&chatType=${chatType}&customerId=${this.userInfo.id}&page=${this.page}&pageSize=15`, {
				}).then(res => {
					if (res.code == 1) {
						// console.log('获取聊天记录',res);
						this.setChatTextHistory(this._wrapData(res.list, chatId));
						//this.allList = res.list;
					}
				})
			},
			_wrapData(data, chatId) {
				// console.log("我的数据", data)
				return { id:  "chatId" + chatId, chatTextList: data, fetchData: true }
			},
			sendMessage() {
				let userId = this.$store.state.userId;
				let id = Number(
					this.randomNum(1, 100) + "" + new Date().getTime() + userId
				);
				this.$request.ModelIndex.posFnc(`/api/chat/list/send`, {
					chatType: this.chatType,
					content: this.messageCon,
					customerId: userId,
					id: id,
					messageType: 0,
					toId: Number(this.chatId)
				}).then(res => {
					if (res.code == 1) {
						console.log('获取聊天记录',res);
						/* this.setChatTextHistory(this._wrapData(res.list, this.chatId)); */
						//this.allList = res.list;
					}
				})
				this.publish();
				
			},
			getUUID(){
			    function S4() {
			        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
			    }
			    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
			},
			randomNum(minNum, maxNum) {
			     return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
			},
			publish: function() {
				// 判断是否已成功连接
				if (!this.client || !this.client.connected) {
					console.log('客户端未连接', 1000)
					return;
				}
				if (this.sendMassage != '') {
					let time = new Date();
					let nowTime = time.getHours() + ':' + time.getMinutes();
					var send = {
						content: this.messageCon,
						chatType: this.chatType,
						createTime: nowTime,
						customerId: this.userInfo.id,
						customerName: this.userInfo.funllName || this.userInfo.name,
						customerUrl: this.userInfo.imgurl,
						messageType: 0,
						toId: this.chatId
					};
					
					this.client.publish(this.onTopic,JSON.stringify(send), error => {
						console.log(error || '消息发布成功');
						this.messageCon = ""
					});
				} else {
					console.log('发布消息为空', 1000)
				}
			
			},
			subscribe: function() {
				// 判断是否已成功连接
				if (!this.client || !this.client.connected) {
					console.log('客户端未连接', 1000)
					return;
				}
				let userId = this.$store.state.userId;
				this.client.subscribe(this.onTopic, {
					qos: 1
				}, error => {
					if (!error) {
						console.log('订阅成功', 1000, 'success')
					}
				});
			
				/* //订阅多个主题
			this.client.subscribe(['one', 'two', 'three'], { qos: 1 }, err => {
				console.log(err || '订阅成功');
				this.show(err || '订阅成功');
			});
					
					
			}); */
			},
			// scrollToBottom() {
			// 	let that = this
			// 	let query = uni.createSelectorQuery()
			// 	query.select('#scrollview').boundingClientRect()
			// 	query.select('#msglistview').boundingClientRect()
			// 	query.exec((res) => {
			// 		// console.log(res)
			// 		if(res[1].height > res[0].height){
			// 			that.$nextTick(function() {
			// 				that.scrollTop = res[1].height;
			// 			});
			// 			that.scrollTop = res[1].height;
						
			// 		}
			// 	})
			// },
		}
	}
</script>

<style>

.myPage{
	overflow: hidden;
	height: calc(100vh - 100upx) ;
}

.marginPage {
	margin-top: 100upx;
}
</style>
