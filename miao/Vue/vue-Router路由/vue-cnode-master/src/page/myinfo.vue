<template>
	<!-- 用户中心 -->
	<div>
		<header class="brand">
			<p class="brand-title">{{item.loginname}}</p>
			<div class="brand-item"></div>
		</header>
		<section>
			<div class="userinfo">
				<img :src="item.avatar_url" alt="" class="avatar_url">
				<div>
					<span>{{item.loginname}}</span><br>
					积分：{{item.score}} <br>
					注册时间：{{item.create_at|dateformatter}}
				</div>
			</div>
			<!-- 最近的话题 -->
			<div class="item1">
				<div class="item01" @click='showdetail(0,$event)'>
					<i>=</i>最近的话题
					<span >{{item.recent_topics.length}}{{arrow[0]}}</span>
				    <!-- <i></i> -->
			    </div>
				<div class="list" v-show='arr[0]' v-model='arr[0]'>
					<router-link  :to="'/topic/'+i.id" class='topic' v-for='(i,index) in item.recent_topics' :key='i.id'>
						<i> ○ </i>
						<p class="tit">{{i.title}}</p>
						<span>{{i.last_reply_at|dateformatter}}</span>
					</router-link>
				</div>
			</div>
			<!-- 最近的回复 -->
			<div class="item1">
				<div class="item01" @click='showdetail(1,$event)'>
					<i>=</i>最近的回复
					 <span>{{item.recent_replies.length}}{{arrow[1]}}</span>
					<!-- <i></i> -->
				</div>
				<div class="list" v-show='arr[1]'>
					<router-link  :to="'/topic/'+i.id" class='topic' v-for='(i,index) in item.recent_replies' :key='i.id'>
						<i> ○ </i>
						<p class="tit">{{i.title}}</p>
						<span>{{i.last_reply_at|dateformatter}}</span>
					</router-link>
				</div>
			</div class="item1">
			<!-- 收藏的话题 -->
			<div class="item1">
				<div class="item01" @click='showdetail(2,$event)'>
					<i>=</i>收藏的话题
					<span>{{item.collect_topics.length}}{{arrow[2]}}</span>
					<!-- <i></i> -->
				</div>
				<div class="list" v-show='arr[2]'>
					<router-link  :to="'/topic/'+i.id" class='topic' v-for='(i,index) in item.collect_topics' :key='i.id'>
							<i> ○ </i>
							<p class="tit">{{i.title}}</p>
							<span>{{i.last_reply_at|dateformatter}}</span>
					</router-link>
				</div>
			</div>
		</section>
		<div class="logout">
			<span  @click="logout" class="demo-raised-button">退出登录</span>
		</div>
		<navbottom></navbottom>
	</div>
</template>
<script>
import navbottom from '../components/bottomNav.vue'
// import this.$axios from 'this.$axios'
import Vue from 'vue'
import {getCookie,delCookie} from '../util/cookie.js'
export default{
		components:{
			navbottom
		},
		data(){
			return {
				accesstoken:'', //接收路由信息里的参数
				item:{
					recent_topics:{},
					collect_topics:{},
					recent_replies:{}
				},
				user:{},
				arr:[false,false,false],
				arrow:['^','^','^']
			}
		},
		beforeRouteEnter(to,from,next){
					if(to.meta.requireAuth){   //此组件需要登录
						if(getCookie('accesstoken')==null){
							next({
								path:'/login'
							})
						}else{
							next()
						}
					}else {
	       			   next(); //否则不需要登录，直接进入路由
	       			}
	    },
	    created(){
	      		this.accesstoken=getCookie('accesstoken');//获取accesstoken
	      		this.getuser();
	      		//this.arr.push('false','false','false')
	    },
      	methods:{
			//验证从cookie获得的accesstoken
			getuser(){
				this.$axios.post('api/v1/accesstoken',{
					accesstoken:this.accesstoken})
				.then(
					res=>{
						this.user=res.data
			        		this.getinfo(); //调用getinfo方法
			        	}
			        )
			},
			//传入username，获取用户信息
			getinfo(){
				this.$axios.get('api/v1/user/'+this.user.loginname)
				.then(
					res=>{
						this.item=res.data.data;
					}
					)
			},
			//下拉列表
			showdetail(arrEle,event){
				Vue.set(this.arr, arrEle, !this.arr[arrEle])
				Vue.set(this.arrow,arrEle,this.arrow[arrEle]=='v'?'^':'v')
				//vue.set能检测到数据的变化，哇，作为一个没有好好看过vue文档的人，真的是....
			},
			//退出登录
			logout(){
				delCookie('userid') //名字要对应getCookie的值
				delCookie('accesstoken')
				delCookie('username')
				this.$router.push({
					path: "/login"
				})
			}
		}
	}
	</script>
	<style lang='scss'>
	@import '../style/base/_base.scss';
	.brand{
		height: 40px;
		background:#474A4F;
		display: flex;
		color: white;
		position: fixed;
		align-items: center;
		width: 100%;
		top: 0;
		.brand-item,.brand-back{
			flex: 0 0 30px;
			cursor: pointer;
		}
		.brand-title{
			flex: 1;
			align-items: center;
			justify-content: center;
			display: flex;
		}
		.brand-item{
			position: relative;
		}
	}
	.avatar_url{
		border-radius: 20px;
	}
	.userinfo{
		height:80px;
		color:#474A4F;
		margin-top:40px;
		display:flex;
		align-items:center;
		padding-left:10px;
		border-bottom:1px solid #ccc;
		img{
			width:40px;
			height:40px;
			float:left;
			margin-right:10px;
		}
		div{
			float:left;
		}
		span{
			font-weight:bold;
			color:#474A4F;
		}
	}
	.item1{

		.topic{
			display:flex;
			min-height:48px;
			color:#666666;
			align-items:center;
			justify-content:center;
			font-family: PingFang-Medium,PingFangSC-Regular,Heiti,Heiti SC,DroidSans,DroidSansFallback,"Microsoft YaHei",sans-serif;
			padding:0 10px;

			i{
				text-align:left;
				flex:0 0 2%;
			}
			span{
				flex:0 0 12%;
				text-align:right;
			}
			.tit{
				flex:1
			}
		}
		.item01{
			height:48px;
			border-bottom:1px solid #eaeaea;
			line-height:48px;
			cursor:pointer;
			padding:0 10px;

		}
		.item01 span{
			float:right;
		}
	}

	.demo-raised-button {
		vertical-align: middle;
		border: 0;
		background: transparent;
	}
	.logout{
		display:block;
		border-radius: 2px;
		height: 36px;
		line-height: 36px;
		width: 88px;
		text-align:center;
		color: rgba(0,0,0,.87);
		margin:31px auto;
		cursor: pointer;
		box-shadow: 0 1px 6px rgba(0,0,0,.117647), 0 1px 4px rgba(0,0,0,.11764)
	}
	</style>
