<template>
	<div>
	   	<div class="status">我的消息</div>
	   	<div class="container">
	   		<div class="item1">
				<div class="item01" @click='showdetail(0,$event)'><i>=</i>未读消息  <span>{{count}}{{arrow[0]}}</span></div>
				<div class="list"  v-show='arr[0]' v-if='message.hasnot_read_messages.length!=0' v-for='(i,key) in message.hasnot_read_messages'  :key='i.id'>
					<router-link  :to="'/topic/'+i.id" class='topic'  >
					  <i> ○ </i>
					  <p class="tit">{{i.reply.content}}</p>
					  <span>{{i.reply.create_at|dateformatter}}</span>
					</router-link>
				</div>
			</div>
			<div class="item1">
					<div class="item01" @click='showdetail(1,$event)'><i>=</i>已读消息<span>{{arrow[1]}}</span></div>
					<div class="list"  v-show='arr[1]' v-if='message.has_read_messages.length!=0' v-for='(i,key) in message. has_read_messages'>
					<router-link  :to="'/topic/'+i.id" class='topic'  :key='i.id' >
					  <i> ○ </i>
					  <p class="tit">{{i.reply.content}}</p>
					  <span>{{i.reply.create_at|dateformatter}}</span>
					</router-link>
				</div>
			</div>
	   	</div>
		<navbottom></navbottom>
	</div>
</template>
<script>
import {getCookie} from '../util/cookie.js'
import navbottom from '../components/bottomNav.vue'
import Vue from 'vue'
// import this.$axios from 'this.$axios'
	export default{
		data(){
			return {
				message:{},
				count:0,
				arrow:['^','^'],
				arr:[false,false]
			}
		},
		components:{
			navbottom
		},
		beforeRouteEnter(to,from ,next){
			if(to.meta.requireAuth){   //此组件需要登录
					if(getCookie('accesstoken')==null){
						next({
							path:'/login'
						})
					}else{
						next() //如果已存在cookie，则进入
					}
				}else {
       			   next(); //否则不需要登录，直接进入路由
    			}
		},
		created(){
			this.getmessage();
			this.getcount();
		},
		methods:{
			//获取消息
			getmessage(){
				this.$axios.get('api/v1/messages?accesstoken='+getCookie('accesstoken'))
				.then(
					res=>{
						this.message=res.data
					}
				)
			},
			getcount(){
				this.$axios.get('api/v1/message/count?accesstoken='+getCookie('accesstoken'))
				.then(
					res=>{
						this.count=res.data.data
					}
					)
			},
			//下拉列表
			showdetail(arrEle,event){
				Vue.set(this.arr, arrEle, !this.arr[arrEle])
				Vue.set(this.arrow,arrEle,this.arrow[arrEle]=='v'?'^':'v')
				//vue.set能检测到数据的变化，哇，作为一个没有好好看过vue文档的人，真的是....
			}
		}
	}
</script>
<style lang='scss'>
    @import '../style/base/_base.scss';
	.status{
		height:40px;
		width: 100%;
		color: white;
		display: flex;
		background:#474A4F;
		justify-content: center;
		align-items: center;
	}
	.container>div{

	}
	.item1{
		padding:0 10px;
		.item01{
			height:48px;

			line-height:48px;
			cursor:pointer;
		}
		.item01 span{
			float:right;
		}
	}
</style>