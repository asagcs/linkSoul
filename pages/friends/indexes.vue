<template>
	<view class="myPage">
		<cu-custom bgImage="https://image.weilanwl.com/color2.0/plugin/sylb2244.jpg" :isAdd=true @showModal="showModalFnc">
			<block slot="content">好友</block>
		</cu-custom>

		<view class="cu-modal drawer-modal justify-start" :class="modalName?'show':''" @tap="hideModal">
			<view class="cu-dialog basis-lg" @tap.stop="" :style="[{top:CustomBar+'px',height:'calc(100vh - ' + CustomBar + 'px)'}]">
				<view class="cu-list menu text-left">
					<view class="cu-item arrow" v-for="(bitem,index) in leftModalData" :key="index">
						<view class="content" @click="jumpPage(bitem.url)">
							<view>{{bitem.name}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="cu-bar bg-white search fixed" :style="[{ top:CustomBar + 'px' }]">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" placeholder="输入搜索的关键词" confirm-type="search"></input>
			</view>
			<view class="action">
				<button class="cu-btn bg-gradual-green shadow-blur round">搜索</button>
			</view>
		</view>
		<scroll-view scroll-y class="indexes searchTop" :scroll-into-view="'indexes-'+ listCurID" :style="[{height:'calc(100vh - '+ CustomBar + 'px - 50px)', marginTop: 'calc(' + CustomBar +  'px )'}]"
		 :scroll-with-animation="true" :enable-back-to-top="true">
			 <view class="cu-bar bg-white solid-bottom margin-top" @tap="showGroupBtn">
				<view class="action">
					<text class="cuIcon-title text-orange"></text> 群组列表
				</view>
			 </view>
			 <view v-if="showGroup">
				 <view class="cu-list menu-avatar no-padding">
				 	<view class="cu-item" v-for="(items,sub) in gList" :key="sub">
				 		<view class="cu-avatar round lg">{{items.group.id}}</view>
				 		<view class="content" @click="GoOtherPage(`/pages/friends/groupInfo?groupId=${items.group.id}&name=${items.group.groupName}&creater=${items.group.creater}`)">
				 			<view class="text-grey">{{items.group.groupName}}</view>
				 			<view class="text-gray text-sm">
				 				有{{sub+2}}个主子需要伺候
				 			</view>
				 		</view>
				 	</view>
				 </view>
			 </view>
			<view class="cu-bar bg-white solid-bottom margin-top" @tap="showFriendListBtn">
				<view class="action">
					<text class="cuIcon-title text-orange"></text> 好友列表
				</view>
			</view>
			<view v-if="showFriendList">
				<block v-for="(item,index) in sortList" :key="index">
					<view :class="'indexItem-' + item" :id="'indexes-' + item" :data-index="item">
						<view class="padding" v-if="list[item].length > 0">{{item}}</view>
						<view class="cu-list menu-avatar no-padding">
							<view class="cu-item" v-for="(person,sub) in list[item]" :key="sub"  @click="GoOtherPage(`/pages/friends/personInfo?friendId=` + person.id + '&pos=' + item)">
								<view class="cu-avatar round lg" 
									:style="[{backgroundImage: person.imgurl.length > 0 ? ('url(' + imgApi + person.imgurl + ')') : 'url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg)'}]"></view>
									<view class="content">
										<view class="text-grey">{{person.fullName || person.name}}</view>
										<view class="text-gray text-sm">
											有{{sub+2}}个主子需要伺候
									</view>
								</view>
							</view>
						</view>
					</view>
				</block>
			</view>
			
			<view class="cu-tabbar-height"></view>
		</scroll-view>
		<view class="indexBar" :style="[{height:'calc(100vh - ' + CustomBar + 'px - 50px)'}]">
			<view class="indexBar-box" @touchstart="tStart" @touchend="tEnd" @touchmove.stop="tMove">
				<view class="indexBar-item" v-for="(item,index) in sortList" :key="index" :id="index" @touchstart="getCur" @touchend="setCur"> {{item}}</view>
			</view>
		</view>
		<!--选择显示-->
		<view v-show="!hidden" class="indexToast">
			{{listCur}}
		</view>
	</view>
</template>

<script>
	import { mapMutations, mapGetters } from 'vuex';
	import config from '../../utils/config.js';
	
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				hidden: true,
				listCurID: '',
				sortList: [ '#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '`' ],
				list: [],
				listCur: '',
				showGroup: false,
				showFriendList: true,
				modalName: false,
				leftModalData : [{
					name: '添加朋友',
					url: "/pages/friends/searchGroup?searchType=0"
				},{
					name: '创建群组',
					url: "/pages/friends/addNewMembers"
				},{
					name: '搜索群组',
					url: '/pages/friends/searchGroup?searchType=1'
				}],
				imgApi: config.imgApi,
				gList: null
			};
		},
		onLoad() {
			
		},
		onReady() {
			this.getData()
			this.gList =  this.$store.state.groupList;
			
			/*
			*
			*/
		   let that = this;
			uni.createSelectorQuery().in(this).select('.indexBar-box').boundingClientRect(function(res) {
				that.boxTop = res.top
			}).exec();
			uni.createSelectorQuery().in(this).select('.indexes').boundingClientRect(function(res) {
				that.barTop = res.top
			}).exec()
		},
		computed: {
		        ...mapGetters([
		            'myFriendList',
					'myGroupList'
		        ])
		},
		watch: {
		        myFriendList(newVal) {
		            this.list = newVal
		        },
				myGroupList(newVal) {
					console.log(this.gList);
				},
				deep: true,
		},
		methods: {
			...mapMutations(['setFriendList']),
			//获取文字信息
			getCur(e) {
				this.hidden = false;
				this.listCur = this.sortList[e.target.id];
			},
			setCur(e) {
				this.hidden = true;
				this.listCur = this.listCur
			},
			//滑动选择Item
			tMove(e) {
				let y = e.touches[0].clientY,
					offsettop = this.boxTop,
					that = this;
				//判断选择区域,只有在选择区才会生效
				if (y > offsettop) {
					let num = parseInt((y - offsettop) / 20);
					this.listCur = that.sortList[num];
				};
			},

			//触发全部开始选择
			tStart() {
				this.hidden = false
			},

			//触发结束选择
			tEnd() {
				this.hidden = true;
				this.listCurID = this.listCur
			},
			//选择
			// indexSelect(e) {
			// 	let that = this;
			// 	let barHeight = this.barHeight;
			// 	let list = this.list;
			// 	let scrollY = Math.ceil(list.length * e.detail.y / barHeight);
			// 	for (let i = 0; i < list.length; i++) {
			// 		if (scrollY < i + 1) {
			// 			that.listCur = list[i].name;
			// 			that.movableY = i * 20
			// 			return false
			// 		}
			// 	}
			// },
			//页面跳转
			GoOtherPage(url) {
				uni.navigateTo({url});
			},
			//群组列表展开与显示
			showGroupBtn(e) {
				this.showGroup = !this.showGroup;
			},
			//好友列表展开与关闭
			showFriendListBtn() {
				this.showFriendList = !this.showFriendList;
			},
			showModalFnc() {
				this.modalName = true
			},
			hideModal() {
				this.modalName = false
			},
			//关闭左侧弹框并关闭
			jumpPage(url) {
				this.modalName = false;
				this.GoOtherPage(url);
			},
			_wrapData(data) {
			    return {data: data, timestamp: new Date().getTime()};
			},
			//获取数据
			getData() {
				this.getFriendsList().then(result => {
					this.setFriendList(result);
				}).catch(err => {
					console.log(err);
					
				})
			},
			//获取好友列表
			getFriendsList(){
				return new Promise((resolve, reject) => {
				    this.fetchLocalData('friendList').then((wrapData) => {
						//console.log("获取到本地数据")
				        if (wrapData && this.checkTimestampValid(wrapData.timestamp)) {
				            resolve(wrapData);
				        } else {
				            this.$request.ModelIndex.posFnc('/api/chat/list/customerPage', {
				            	// page: 1, pageSize: 9
				            }).then(res => {
				            	if (res.code == 1) {
				            		//console.log('过了有效期',res);
				            		resolve(this._wrapData(res.data));
				            		//this.allList = res.list;
				            	}
				            })
				        }
				
				    }).catch((error) => {
						//console.log("我错了",error)
				        this.$request.ModelIndex.posFnc('/api/chat/list/customerPage', {
				        	// page: 1, pageSize: 9
				        }).then(res => {
				        	//console.log('获取不到本地数据',res)
				        	if (res.code == 1) {
								resolve(this._wrapData(res.data));
				        		//this.allList = res.list;
				        	}
				        })
				    });
				});
			},
			
			checkTimestampValid(timestamp) {
			    const currentDate = new Date();
			    const targetDate = new Date();
			    targetDate.setTime(timestamp);
			    if (currentDate.getMonth() !== targetDate.getMonth()) {
			        return false;
			    }
			    if (currentDate.getDate() - targetDate.getDate() > 1) {
			        return false;
			    }
			    // if (currentDate.getHours() - targetDate.getHours() > 6) {
			    //     return false;
			    // }//有效期4个小时
			    // if (currentDate.getMinutes() - targetDate.getMinutes() > 1)return false;
			    return true;
			},
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
						//console.log(e)
						reject(e)
				    }
				});
			}
		}
	}
</script>

<style>
	page {
		
	}


	.indexes {
		position: relative;
	}

	.indexBar {
		position: fixed;
		right: 0px;
		bottom: 0px;
		padding: 20upx 20upx 20upx 60upx;
		display: flex;
		align-items: center;
	}

	.indexBar .indexBar-box {
		width: 40upx;
		height: auto;
		background: #fff;
		display: flex;
		flex-direction: column;
		box-shadow: 0 0 20upx rgba(0, 0, 0, 0.1);
		border-radius: 10upx;
	}

	.indexBar-item {
		flex: 1;
		width: 40upx;
		height: 40upx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24upx;
		color: #888;
	}

	movable-view.indexBar-item {
		width: 40upx;
		height: 40upx;
		z-index: 9;
		position: relative;
	}

	movable-view.indexBar-item::before {
		content: "";
		display: block;
		position: absolute;
		left: 0;
		top: 10upx;
		height: 20upx;
		width: 4upx;
		background-color: #f37b1d;
	}

	.indexToast {
		position: fixed;
		top: 0;
		right: 80upx;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		width: 100upx;
		height: 100upx;
		border-radius: 10upx;
		margin: auto;
		color: #fff;
		line-height: 100upx;
		text-align: center;
		font-size: 48upx;
	}
</style>
