<template>
	<view class="myPage">
		<cu-custom bgColor="bg-gradual-pink" :isBack="true"><block slot="backText">返回</block><block slot="content">操作条</block></cu-custom>
		
		<view class="cu-bar search bg-white fixed"  :style="[{ top:CustomBar + 'px' }]">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input @focus="InputFocus" @blur="InputBlur" :adjust-position="false" type="text" :placeholder="addType == 0 ? '搜索好友' : '搜索群组'" confirm-type="search"></input>
			</view>
			<view class="action">
				<button class="cu-btn bg-green shadow-blur round">搜索</button>
			</view>
		</view>
		<view class="box scrollView" :style="[{height:'calc(100vh - '+ CustomBar + 'px)', marginTop: CustomBar + 'px'}]">
			<view>
				<view class="cu-list menu-avatar no-padding">
					<view class="cu-item" v-for="(items,sub) in 10" :key="sub" @tap="goToOtherPage(item)">
						<view class="cu-avatar round lg">{{item.name}}</view>
						<view class="content">
							<view class="text-grey">{{item.name}}<text class="text-abc">{{list[sub].name}}</text>君</view>
							 <view class="text-gray text-sm">
							 	有{{sub+2}}个主子需要伺候
							 </view>
						</view>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				InputBottom: 0,
				addType: 0,
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
			};
		},
		onLoad(option) {
			this.addType = option.searchType; 
		},
		
		methods: {
			InputFocus(e) {
				this.InputBottom = e.detail.height
			},
			InputBlur(e) {
				this.InputBottom = 0
			},
			goToOtherPage(item) {
				let url;
				if(this.addType == 0){
					url = '/pages/friends/personInfo';
				}else{
					url = '/pages/friends/groupInfo';
				}
				uni.navigateTo({
					url: url
				})
			}
		}
	}
</script>

<style>
	.myPage{
		overflow: hidden;
		height: 100vh;
	}
	.scrollView{
		padding-top: 100upx;
		flex-grow: 1;
		overflow: scroll;
	}
</style>
