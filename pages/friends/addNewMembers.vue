<template>
	<view class="myPage">
		<cu-custom bgImage="https://image.weilanwl.com/color2.0/plugin/sylb2244.jpg" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">选择好友</block>
			
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
			<view class="action">
				<button class="cu-btn bg-gradual-green shadow-blur round" @click="save">保存</button>
			</view>
		</view>
		<scroll-view scroll-y class="indexes searchTop" :scroll-into-view="'indexes-'+ listCurID" :style="[{height:'calc(100vh - '+ CustomBar + 'px - 50px)', marginTop: 'calc(' + CustomBar +  'px )'}]"
		 :scroll-with-animation="true" :enable-back-to-top="true">
			<view>
				<block v-for="(item,index) in sortList" :key="item">
					<view :class="'indexItem-' + item" :id="'indexes-' + item" :data-index="item">
						<view class="padding" v-if="list[item].length > 0">{{item}}</view>
						<view class="cu-list menu-avatar no-padding">
							<view class="cu-item" v-for="(personal,sub) in list[item]" :key="sub"  @click="checkedIt(personal, item)">
								<view class="cu-avatar round lg" 
									:style="[{backgroundImage: personal.imgurl.length > 0 ? ('url(' + imgApi + personal.imgurl + ')') : 'url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg)'}]"></view>
								<view class="content">
									<view class="text-grey">{{personal.fullName || personal.name}}</view>
									<view class="text-gray text-sm">
										有{{sub+2}}个主子需要伺候
									</view>
								</view>
								<view class="margin-right">
									<checkbox class="margin-right checked" :checked="true" v-if="personal.selected"></checkbox>
									<checkbox class="margin-right" :checked="false" v-else></checkbox>
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
	import { mapMutations, mapState } from 'vuex';
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
				modalName: "",
				imgApi: config.imgApi,
				gList: null,
				checkedGroup: [],
			};
		},
		onLoad(options) {
			if(options.groupId){
				this.groupId = options.groupId;
			}
		},
		onReady() {
			this.getData()
			
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
			
		},
		watch: {
		        
		},
		methods: {
			...mapMutations(['setFriendList', 'setRefreshChatList', 'setrefreshGroupMember']),
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
			indexSelect(e) {
				let that = this;
				let barHeight = this.barHeight;
				let list = this.list;
				let scrollY = Math.ceil(list.length * e.detail.y / barHeight);
				for (let i = 0; i < list.length; i++) {
					if (scrollY < i + 1) {
						that.listCur = list[i].name;
						that.movableY = i * 20
						return false
					}
				}
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
				let that = this;
				this.getFriendsList().then(result => {
					this.list = that._deepClone(result.data);
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
						console.log(e)
						reject(e)
				    }
				});
			},
			checkedIt(personal, itemName){
				//数组操作
				let data = this.list[itemName];
				let newIndex = data.findIndex(item => item.id == personal.id);
				if(newIndex === -1){
					return;
				}
				let index = this.checkedGroup.findIndex(item => item.id === personal.id);
				if(index === -1) {
					this.checkedGroup.push(personal);
				}else{
					this.checkedGroup.splice(index, 1)
				};
				
				//对象操作
				this.$set(data[newIndex], 'selected', !data[newIndex].selected );
			},
			
			//深克隆
			_deepClone(obj, hash = new WeakMap()) {
			  if (obj === null) return obj; 
			  // 如果是null或者undefined我就不进行拷贝操作
			  if (obj instanceof Date) return new Date(obj);
			  if (obj instanceof RegExp) return new RegExp(obj);
			  // 可能是对象或者普通的值  如果是函数的话是不需要深拷贝
			  if (typeof obj !== "object") return obj;
			  // 是对象的话就要进行深拷贝
			  if (hash.get(obj)) return hash.get(obj);
			  let cloneObj = new obj.constructor();
			  // 找到的是所属类原型上的constructor,而原型上的 constructor指向的是当前类本身
			  hash.set(obj, cloneObj);
			  for (let key in obj) {
			    if (obj.hasOwnProperty(key)) {
			      // 实现一个递归拷贝
			      cloneObj[key] = this._deepClone(obj[key], hash);
			    }
			  }
			  return cloneObj;
			},
			
			save() {
				if(this.checkedGroup.length == 0){
					return;
				}
				//console.log(this.groupId)
				if(this.groupId){
					let idInGroup = this.checkedGroup.map(currentVal => currentVal.id);
					this.$request.ModelIndex.posFnc(`/api/chat/list/inviatePeople?groupId=${this.groupId}&list=${idInGroup.join(',')}`, {
						// page: 1, pageSize: 9
					}).then(res => {
						//console.log(res)
						if (res.code == 1) {
							this.BackPage();
							this.setrefreshGroupMember(true);
							//this.allList = res.list;
						}
					})
				}else{
					let userInfo = this.$store.state.userInfo;
					let infoInGroup = this.checkedGroup.map(currentVal => ({id: currentVal.id, name: currentVal.name, fullName: currentVal.fullName}));
					let userData = infoInGroup.find(item => item.id == userInfo.id);
					if(!userData){
						infoInGroup.push({ id: userInfo.id, name: userInfo.name, fullName: userInfo.fullName })
					}
					this.$request.ModelIndex.posFnc(`/api/chat/list/invivate`, JSON.stringify(infoInGroup)).then(res => {
						//console.log(res)
						if (res.code == 1) {
							this.setRefreshChatList(true);
							this.BackPage()
							//this.allList = res.list;
						}
					})
				}
				
			},
			BackPage() {
				uni.navigateBack({
					delta: 1
				});
			},
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
