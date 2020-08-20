<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">个性签名</block>
		</cu-custom>
		<View class="myPage padding">
			<form>
				<view class="cu-form-group align-start">
					<view class="title">签名</view>
					<textarea maxlength="-1" :disabled="modalName!=null" @input="textareaBInput" placeholder="多行文本输入框"></textarea>
				</view>
				<view class="padding flex flex-direction">
					<button class="cu-btn bg-green lg" @tap="saveSign">保存</button>
				</view>
			</form>
		</View>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods: {
			textareaBInput(e) {
				if(e.detail.value.length > 140){
					//console.log(333)
					return;
				}
				this.textareaBValue = e.detail.value;
			},
			saveSign(){
					uni.navigateBack({
						delta: 1
					})
			}
		}
	}
</script>

<style>
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}
</style>
