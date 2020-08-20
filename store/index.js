import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo: {},
		sessionid: "",
		friendList: {},
		groupList: [],
		chatList: {},
		refreshChatList: false,
		socketAction: '',
        connectFlag: false,
		chatTextList: {},
		refreshMember: true,
	},
	getters: {   //实时监听state值的变化(最新状态)
	    myFriendList(state) {
			console.log("状态树中的好友",state.friendList)
			return state.friendList.data
		},
		myGroupList(state) {
			console.log("group状态树中的好友",state.groupList)
			return state.groupList
		},
		myChatList(state) {
			console.log("聊天状态树中的好友",state.chatList)
			return state.chatList
		},
		myChatTextToOne(state) {
			return function(chatTextName) {
				console.log(chatTextName, state.chatTextList)
				return state.chatTextList[chatTextName]
			}
		},
		myGroupMemberR(state) {
			return state.refreshMember
		}
	},
	mutations: {
		login(state, provider) {
			console.log(state, provider)
			if(provider.sessionid){
				state.sessionid = provider.sessionid;
				state.userId = provider.id;
				state.hasLogin = true;
			}
			state.userInfo = provider;
			uni.setStorage({
				key: 'userInfo',
				data: provider  
			});
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = {};
			uni.removeStorage({  
			    key: 'userInfo'  
			});
		},
		changeUserInfo(state, provider) {
			state.userInfo = provider;
			uni.setStorage({
				key: 'userInfo',
				data: provider
			})
		},
		/**
		 * @param {type} state
		 * @param {Object} list { 时间戳， 数据列表 } 
		 * */
		setFriendList(state, list) {
			console.log("状态树更新了")
			state.friendList = list;
			uni.setStorage({
				key: 'friendList',
				data: JSON.stringify(list)
			})
		},
		setGroupList(state, list) {
			console.log("group状态树更新了")
			state.groupList = list;
			uni.setStorage({
				key: 'groupList',
				data: JSON.stringify(list)
			})
		},
		setChatList(state, list) {
			console.log("聊天状态树更新了")
			state.chatList = list;
			state.refreshChatList = true;
			uni.setStorage({
				key: 'chatList',
				data: JSON.stringify(list)
			})
		},
		setChatTextHistory(state, list) {
			//console.log("聊天记录更新了")
			if(list.fetchData){
				Vue.set(state.chatTextList,list.id, list.chatTextList)
			}else if(state.chatTextList[list.id]){
				state.chatTextList[list.id].push(list.chatTextList);
			}else{
				Vue.set(state.chatTextList,list.id, [list.chatTextList]);
				state.refreshChatList = false;
			}
			// uni.setStorage({
			// 	key: name,
			// 	data: JSON.stringify(list.chatTextList)
			// })
		},
		setRefreshChatList(state){
			state.refreshChatList = false;
		},
		catchSocketAction(state, data) {
            state.socketAction = data;
        },
        connectSuccess(state, obj) {
            state.connectFlag = obj
        },
		setrefreshGroupMember(state) {
			 state.refreshMember = true;
		}
	}
})

export default store
