import config from './config.js';
import request from './request.js';

export default{
	
	async posFnc(url,data){
		let allUrl = config.api + url;
		let result = await request.post(allUrl,data,{});
		return result;
	},

	async getFnc(url){
		let allUrl = config.api + url;
		let result = await request.get(allUrl,{});
		return result;
	},
	
	//登陆
	async login(data){
		let url = config.api + '/api/customer/login';
		let result = await request.post(url,data,{});
		return result;
	},
}
