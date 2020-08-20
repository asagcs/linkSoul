<template>
	<view>
		
	</view>
</template>

<script>
	//import mqtt from '../../utils/mqtt.js';//二选一
	import mqtt from '../../utils/mqtt.min.js';
	import { mapMutations, mapState } from "vuex";
	import Vue from 'vue';
	
	export default {
		data() {
			return {
				serve: {
					host: 'redumqtt.zkhuashui.com',
					port: Number(443),
					path: '/mqtt',
				},
				onTopic: 'testtopic',
				Qos: 0,
				sendMassage: 'Hello EMQ-X！',
				time:0,
				receiveMessage: '',
				client: null,
				//MQTT连接的配置
				options: {
					wsOptions: {},
					protocolVersion: 4, //MQTT连接协议版本
					clientId: 'web_' + this.clientId,
					keepalive: 60,
					clean: false,
					username: '',
					password: '',
					reconnectPeriod: 1000, //1000毫秒，两次重新连接之间的间隔
					connectTimeout: 30 * 1000, //1000毫秒，两次重新连接之间的间隔
					resubscribe: true //如果连接断开并重新连接，则会再次自动订阅已订阅的主题（默认true）
				},
			};
		},
		methods: {
			...mapMutations(["catchSocketAction"]),
            ...mapMutations(["connectSuccess"]),
			...mapMutations(["setChatTextHistory"]),
			
			connect: function() {
				var hosts = '',
					// #ifdef H5
					hosts = 'ws://' + this.serve.host + ':' + this.serve.port + this.serve.path
				//#endif
				// #ifdef MP-WEIXIN 
				hosts = 'wxs://' + this.serve.host + this.serve.path
				//#endif
				// #ifdef APP-PLUS
				hosts = 'wx://' + this.serve.host + ':' + this.serve.port + this.serve.path
				//#endif

				if (this.client == null || this.client.connented == false) {
					uni.showLoading({
						title: '连接中···'
					})
					this.connectSuccess(false)
					// console.log(hosts, this.options)
					this.client = mqtt.connect(
						hosts,
						this.options
					);
					
					Vue.prototype.$mqttClient = this.client;

					this.client.on('connect', () => {
						uni.hideLoading();
						this.showToast('连接成功', 1000, 'success');
						this.connectSuccess(true)
						this.subscribe();
					});

					
					this.client.on('message', (topic, message) => {
						//console.log('收到来自' + topic + '的消息' );
						let newData = JSON.parse(message);
						// console.log(newData)
						let newMessage;
						if(topic === ("chat/" + this.$store.state.userInfo.id)){
							newMessage = {
								id: "chatId" + newData.customerId,
								chatTextList: newData,
								fetchData: false,
							}
						}else{
							newMessage = {
								id: topic.replace(/\//, 'Id'),
								chatTextList: newData,
								fetchData: false,
							}
						}
						this.receiveMessage = message;
						
						//console.log(newMessage)
						this.setChatTextHistory(newMessage)
					});
					
				}

				this.client.on('reconnect', error => {
					uni.hideLoading();
					this.showToast('正在重连···', 1000)

				});
				this.client.on('error', error => {
					uni.hideLoading();
					this.showToast('连接失败!', 1000)
					this.connect();
				});

			},
			subscribe: function() {
				// 判断是否已成功连接
				if (!this.client || !this.client.connected) {
					this.showToast('客户端未连接', 1000)
					return;
				}
				let userId = this.$store.state.userId;
				this.client.subscribe("chat/" + userId, {
					qos: this.Qos
				}, error => {
					if (!error) {
						//this.showToast('订阅成功', 1000, 'success')
						console.log('订阅成功');
					}
				});

				/* //订阅多个主题
			this.client.subscribe(['one', 'two', 'three'], { qos: 1 }, err => {
				console.log(err || '订阅成功');
				this.show(err || '订阅成功');
			});
			
				    // 订阅不同 qos 的不同主题
				    this.client.subscribe(
				        [
				            { hello: 1 },
				            { 'one/two/three': 2 },
				            { '#': 0 }
				        ],
				        (err) => {
				          this.show();console.log(err || '订阅成功')
				        },
				    )
		
		
			}); */
			},
			
			unsubscribe: function() {
				this.client.unsubscribe(
					// topic, topic Array, topic Array-Onject
					// ['one', 'two', 'three'],
					this.onTopic,
					err => {
						console.log(err || '取消订阅成功');
						this.showToast('取消订阅成功', 1000, 'success')
					}
				);
			},
			unconnect: function() {
				this.client.end();
				this.client = null
				this.showToast('成功断开连接', 1000, 'success')
				console.log('断开连接');
			},
			showToast: function(title, time, icon = 'none') {
				uni.showToast({
					title: title,
					icon: icon,
				});
				setTimeout(function() {
					uni.hideToast();
				}, time);
			},
			getUUID(){
			    function S4() {
			        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
			    }
			    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
			}
		},
		created() {
			console.log(444)
			// 获取id，无，生成id
			let clientId;
			uni.getStorage({
				key: 'ep_clientId',
				success: function (res) {
					clientId = res.data;
				}
			})
			
			if(!clientId){
				let clientId = this.getUUID();
				uni.setStorage({
					key: 'ep_clientId',
					data: clientId  
				});
			}else{
				this.clientId = clientId;
			}
			// 初始化
			this.connect()
		}
	}
</script>
<style>
	button {
		margin-top: 30upx;
		margin-bottom: 30upx;
	}
</style>
