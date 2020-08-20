<template name="groupInfo">
	<view>
		<scroll-view class="page">
			<view class="bg-img bg-gradual-green padding-top" style="height: 414upx;">
				<view class="action padding-lr" @tap="BackPage" :style="[{marginTop:'calc(' + StatusBar + 'px)'}]">
					<text class="cuIcon-back"></text>
				</view>
				<view class="padding-xl text-white flex align-center">
					<view class="padding">
						<view class="cu-avatar lg round margin-left" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big25002.jpg);"></view>
					</view>
					<view>
						<view class="padding-xs text-xxl text-bold">
							{{groupName}}
						</view>
						<view class="padding-xs text-lg">
							Only the guilty need fear me.
						</view>
					</view>
				</view>
			</view>
			
			<view class="cu-bar bg-white solid-bottom margin-top">
				<view class="action">
					<text class="cuIcon-title text-orange "></text> 成员列表
				</view>
				<view class="action">
					<button class="cu-btn bg-green shadow" @tap="goToOtherPage(`/pages/friends/addNewMembers?groupId=${groupId}`)">新增成员</button>
				</view>
			</view>
			<view class="cu-list grid" :class="['col-5']">
				<view class="cu-item" v-for="(item,index) in list" :key="index" @tap="goToOtherPage(`/pages/friends/personInfo?friendId=${item.customer.id}&groupId=${groupId}`)">
					<view class="flex-direction align-center justify-center">
						<view class="cu-avatar lg round" :style="[{backgroundImage: `url(${item.customer.imgurl ? imgApi + item.customer.imgurl : 'https://ossweb-img.qq.com/images/lol/web201310/skin/big25002.jpg'})`}]"></view>
						<text :class="groupOwner ==  item.customerName? 'myRedText' : ''">{{item.customerName}}</text>
					</view>
				</view>
			</view>
			
			<view class="cu-list menu" :class="[menuBorder?'sm-border':'',menuCard?'card-menu margin-top':'']">
				<view class="cu-item arrow" @tap="showModal" data-target="DialogModal1">
					<view class="content">
						<text class="cuIcon-circlefill text-grey"></text>
						<text class="text-grey">群名称修改</text>
					</view>
				</view>
				<view class="cu-item arrow" @tap="showModal"  data-target="DialogModal2">
					<view class="content">
						<text class="cuIcon-circlefill text-grey"></text>
						<text class="text-grey">群组昵称：</text>
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
					<button class="cu-btn bg-green lg" @tap="() => goToOtherPage('/pages/component/chat&name=${groupName}&chatId=${groupId}&chatType=1')">发送消息</button>
					<button class="cu-btn bg-red margin-tb-sm lg" @tap="BackPage">拉黑</button>
				</view>
			</view>
			<view class="cu-tabbar-height"></view>
		</scroll-view>
		<view class="cu-modal" :class="modalName=='DialogModal1'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">修改群名</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					<input placeholder="群名称" name="input" maxlength="14" v-model="groupName"></input>
					<text class="text-red text-sm">{{warningText}}</text>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-green text-green" @tap="hideModal">取消</button>
						<button class="cu-btn bg-green margin-left" @tap="changeGroupName">确定</button>

					</view>
				</view>
			</view>
		</view>
		<view class="cu-modal" :class="modalName=='DialogModal2'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">修改昵称</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					<input placeholder="你在群组中的昵称" name="input" maxlength="14" v-model="nickName"></input>
					<text class="text-red text-sm">{{warningText}}</text>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-green text-green" @tap="hideModal">取消</button>
						<button class="cu-btn bg-green margin-left" @tap="changeNickname">确定</button>
		
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapMutations, mapGetters } from 'vuex';
	import config from '../../utils/config.js';
	
	export default {
		data() {
			return {
				modalName: null,
				gridBorder: false,
				menuBorder: false,
				menuArrow: false,
				menuCard: false,
				skin: false,
				listTouchStart: 0,
				listTouchDirection: null,
				StatusBar: this.StatusBar,
				list: [],
				imgApi: config.imgApi,
				groupName: "",
				groupOwner: "",
				needMembersChange: true,
				warningText: '',
				nickName: '',
				groupId: '',
			};
		},
		onLoad(options) {
			this.groupId = options.groupId;
			this.getMembers(this.groupId);
		},
		computed: {
			...mapGetters(["myGroupMemberR"]),
		},
		watch:{
			myGroupMemberR(val) {
				this.getMembers(this.groupId);
			}
		},
		methods: {
			...mapMutations(["setGroupList", "setrefreshGroupMember"]),
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.warningText = ""
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

			goToOtherPage(url) {
				uni.navigateTo({ url: url })
			},
			BackPage() {
				uni.navigateBack({
					delta: 1
				});
			},
			getMembers(id) {
				if(!this.myGroupMemberR){
					return;
				}
				this.$request.ModelIndex.posFnc(`/api/chat/list/PeopleInGroup?groupId=${id}`, {
					// page: 1, pageSize: 9
				}).then(res => {
					if (res.code == 1) {
						this.list = res.data;
						this.groupName = res.data[0].group.groupName;
						this.groupOwner = res.data[0].group.creater;
						this.needMembersChange = false;
						//this.allList = res.list;
						this.setrefreshGroupMember(false);
					}
				}).catch(e => {
					console.log("获取网络数据失败");
				})
			},
			changeGroupName() {
				if(this.groupName.length == 0){
					this.warningText = "请输入组名";
					return;
				}
				let changeValue = { groupName: this.groupName, id: this.groupId };
				this.$request.ModelIndex.posFnc(`/api/chat/list/editGroup`, changeValue).then(res => {
					//console.log(res)
					this.changeGroupList();
					this.hideModal()
				}).catch(e => {
					//console.log("获取网络数据失败");
					this.hideModal()
				})
			},
			changeGroupList() {
				let { groupList } = this.$store.state;
				let newGroupName = this.groupName;
				groupList.map(currentVal => {
					if(currentVal.group.id == this.groupId){
						// let newGoup = this.deepClone(currentVal, null);
						currentVal.group.groupName = newGroupName;
					}
				})
				this.setGroupList(groupList)
			},
			changeNickname() {
				if(this.groupName.length == 0){
					this.warningText = "请输入昵称";
					return;
				}
				this.$request.ModelIndex.posFnc(`/api/chat/list/editMyName?groupId=${this.groupId}&name=${this.nickName}`, {}).then(res => {
					//console.log(res)
					this.getMembers(this.groupId);
					this.hideModal();
				}).catch(e => {
					//console.log("获取网络数据失败");
					this.hideModal()
				})
			},
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
	.myRedText {
		color: #e54d42 !important;
	}
</style>
