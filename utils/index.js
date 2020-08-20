const baseUrl = "https://nhyhtapi.zkhuashui.com/"

function request(url,data,way){//封装的requset

	
	data = data || {},
	
	uni.showToast({//请求数据时的loading
	    title: '加载中',
	    duration: 200,
		icon:"loading"
	});
	return new Promise((resolve,rejext)=>{
		uni.request({//这里是uniapp网络请求的api
		    url: baseUrl + url, //仅为示例，并非真实接口地址。
		    data,
			method:way||"POST",//默认请求方式是POST
		    success: (res) => {
				resolve(res)
		    }
		});
	})
}

function showToast(options){//封装Toast
	let { title,duration,icon } = options;
	uni.showToast({
	    title:title,
	    duration: duration,
		icon:icon || "none"
	});
}


module.exports = {
	request,
	baseUrl,
	showToast
}
