<template>
	<view style="overflow: hidden;">
		<friends v-if="PageCur=='friends'"></friends>
		<components v-if="PageCur=='component'"></components>
		<plugin v-if="PageCur=='plugin'"></plugin>
		<view class="cu-bar tabbar bg-white shadow foot">
			<view class="action" @click="NavChange" data-cur="component">
				<view class='cuIcon-cu-image'>
					<image :src="'/static/tabbar/component' + [PageCur == 'component'?'_cur':''] + '.png'"></image>
				</view>
				<view :class="PageCur=='component'?'text-green':'text-gray'">聊天</view>
			</view>
			<view class="action" @click="NavChange" data-cur="friends">
				<view class='cuIcon-cu-image'>
					<image :src="'/static/tabbar/component' + [PageCur == 'friends'?'_cur':''] + '.png'"></image>
				</view>
				<view :class="PageCur=='friends'?'text-green':'text-gray'">好友</view>
			</view>
			<view class="action" @click="NavChange" data-cur="plugin">
				<view class='cuIcon-cu-image'>
					<image :src="'/static/tabbar/plugin' + [PageCur == 'plugin'?'_cur':''] + '.png'"></image>
				</view>
				<view :class="PageCur=='plugin'?'text-green':'text-gray'">我的</view>
			</view>
		</view>
		<mqtt v-if="userId"/>
	</view>
</template>

<script>
	import {mapState} from 'vuex';
	
	export default {
		computed: mapState(['forcedLogin', 'hasLogin', 'userName', 'userId']),
		data() {
			return {
				PageCur: 'component',
				CustomBar: this.CustomBar,
			}
		},
		onLoad() {
			if (!this.hasLogin) { //没有登陆跳转登陆页面
				uni.navigateTo({
					url: "/pages/login/index"
				})
			}

		},
		methods: {
			NavChange: function(e) {
				this.PageCur = e.currentTarget.dataset.cur
			},
			
		}
	}
</script>

<style>

</style>
