<template>
	<view class="allContent padding margin-bottom">
		<view class="flex justify-center margin-bottom">
			<image class="img_logo" src="../../static/logo.png" mode="aspectFit"></image>
		</view>
		<view class="cu-form-group margin-top">
			<view class="title">用户名</view>
			<input v-model="username" placeholder="用户名" name="input" />
		</view>
		<view class="cu-form-group">
			<view class="title">密　码</view>
			<input placeholder="密码" name="input"  v-model="password" type="password"/>
		</view>
		<view class="login" @click="register">还没有账号？立即去注册</view>
		<view class="padding flex flex-direction">
			<button class="cu-btn bg-red margin-tb-sm lg" @click="submitLogin">登录</button>
		</view>
	</view>
</template>

<script>
	
	import { mapMutations} from 'vuex'
	import { request } from "../../utils/index.js"
	export default {
		data() {
			return {
				username:null,
				password:null,
			}
		},
		methods:{
			register(){
				uni.navigateTo({
					url:'/pages/register'
				})
			},
			...mapMutations(['login']),
			submitLogin(){
				if(!this.username){
					this.$api.msg('用户名不能为空');
					return;
				}
				if(!this.password){
					this.$api.msg('密码不能为空');
					return;
				}
				let values = {account: this.username,password: this.password};
				uni.setStorage({
				key: 'webUserInfo',
				data: values
			})
				this.$request.ModelIndex.posFnc(`/api/customer/login?account=${this.username}&password=${this.password}`, {}).then(res => {
					if(res.code == 1){
						this.$api.msg("登陆成功");
						this.login(res.data);
						// console.log(res);
						 
						setTimeout(function(){
							uni.reLaunch({
								url: '/pages/index/index'
							});
						},500);
					}else{
						if(res.reason){
							this.$api.msg(res.reason);
						}else{
							this.$api.msg('登陆失败');
						}
					}
				})
			}
		}
	}
</script>

<style lang='scss' scoped="scoped">
	.img_logo{
		width: 200rpx;
		height: 200rpx;
	}
	.login{
		margin-top: 2%;
		margin-left: 2%;
		font-size: 24rpx;
	}
</style>
