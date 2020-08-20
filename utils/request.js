import store from '../store'
import config from './config.js';


const post = (url, data, opt) => {
	if(opt.silence != true){
		uni.hideLoading();
		uni.showLoading({
			title: '加载中'
		});
	}
	let sessionid = store.state.sessionid;
	let header = {
		'content-type': 'application/json',
		'accept': 'application/json',
	};
	if(sessionid != null){
		header['Authorization'] = sessionid.toString();
	}
	
	return new Promise(resolve => {
		uni.request({
			url: url, //仅为示例，并非真实接口地址。
			data: data,
			method: 'POST',
			header: header,
			success: (res) => {
				if(res.data && res.data.code == '10210008' || res.data.code == '10510010' || res.data.code == -1){
					store.commit('logout');
					uni.reLaunch({url: "/pages/login"});
				}
				uni.hideLoading();
				resolve(res.data);
			},
			fail: (res) => {
				uni.hideLoading();
				resolve(res);
			},
		});
	});
};

const get = (url, opt) => {
	if(opt.silence != true){
		uni.hideLoading();
		uni.showLoading({
			title: '加载中'
		});
	}
	let sessionid = store.state.sessionid;
	let header = {
		'shopId': config.shopId,
		'content-type': 'application/json',
		'accept': 'application/json',
	};
	if(sessionid != null){
		header['Authorization'] = sessionid.toString();
	}
	
	return new Promise(resolve => {
		uni.request({
			url: url,
			method: 'GET',
			header: header,
			success: (res) => {
				if(res.data && res.data.code == '10210008' || res.data.code == '10510010'){
					store.commit('logout');
				}
				uni.hideLoading();
				resolve(res.data);
			},
			fail: (res) => {
				uni.hideLoading();
				resolve(res);
			},
		});
	});
};

export default {
	post,
	get
}
