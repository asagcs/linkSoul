import Vue from 'vue'
import App from './App'
import store from './store'

import ModelIndex from './utils/model.index.js';

import friends from './pages/friends/indexes.vue'
Vue.component('friends',friends)

import components from './pages/component/home.vue'
Vue.component('components',components)

import plugin from './pages/plugin/home.vue'
Vue.component('plugin',plugin)

import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom',cuCustom)

import mqtt from "./pages/component/mqtt.vue";
Vue.component('mqtt',mqtt)


const msg = (title, duration=1500, mask=false, icon='none')=>{
	//统一提示方便全局修改
	if(Boolean(title) === false){
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}
Vue.prototype.$api = {msg};
Vue.config.productionTip = false

Vue.prototype.$store = store;
Vue.prototype.$request = {ModelIndex};

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()

 



