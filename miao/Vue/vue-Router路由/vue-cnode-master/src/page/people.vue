<template>
    <!-- 用户中心 -->
	<div>
		<header class="brand">
	    	<i class="brand-back" @click='goback'> <- </i>
	    	<p class="brand-title">{{item.loginname}}</p>
	    	<div class="brand-item"> </div>
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
					<div class="item01" @click='showdetail(0)'><i>=</i>最近的话题 <span>{{item.recent_topics.length}}{{arrow[0]}}</span><i></i></div>
					<div class="list" v-show='arr[0]' >
						<router-link  :to="'/topic/'+i.id" class='topic' v-for='(i,key) in item.recent_topics' :key='i.id'>
						  <i> ○ </i>
						  <p class="tit">{{i.title}}</p>
						  <span>{{i.last_reply_at|dateformatter}}</span>
						</router-link>
					</div>
				</div>
				<!-- 最近的回复 -->
				<div class="item1">
					<div class="item01" @click='showdetail(1)'><i>=</i>最近的回复  <span>{{item.recent_replies.length}}{{arrow[1]}}</span><i></i></div>
					<div class="list" v-show='arr[1]'>
						<router-link  :to="'/topic/'+i.id" class='topic' v-for='(i,key) in item.recent_replies' :key='i.id'>
						  <i> ○ </i>
						  <p class="tit">{{i.title}}</p>
						  <span>{{i.last_reply_at|dateformatter}}</span>
						</router-link>
					</div>
				</div class="item1">
				<!-- 收藏的话题 -->
				<div class="item1">
					<div class="item01" @click='showdetail(2)'><i>=</i>收藏的话题  <span>{{item.collect_topics.length}}{{arrow[2]}}</span><i></i></div>
					<div class="list" v-show='arr[2]'>
						<router-link  :to="'/topic/'+i.id" class='topic' v-for='(i,key) in item.ollect_topics' :key='i.id'>
						  <i> ○ </i>
						  <p class="tit">{{i.title}}</p>
						  <span>{{i.last_reply_at}}</span>
						</router-link>
					</div>
				</div>
		</section>
	</div>
</template>
<script>
	import Vue from 'vue'
	// import this.$axios from 'this.$axios';
	export default{
		data(){
			return {
				user:this.$route.params.user, //接收路由信息里的参数
				item:[],
				arr:[false,false,false],
				arrow:['^','^','^']
			}
		},
		created(){
		  this.getinfo();
		},
		methods:{
			goback(){
				this.$router.go(-1)
			},
			getinfo(){
					this.$axios.get('api/v1/user/'+this.user)
			        .then(
			        	res=>{
			        		this.item=res.data.data;
			        	}
	        	)
			},
			showdetail(index){
				Vue.set(this.arr,index,!this.arr[index])
				Vue.set(this.arrow,index,this.arrow[index]=='v'?'^':'v')
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
				flex:0 0 5%;
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
			padding:0 10px;
			height:48px;
			border-bottom:1px solid #eaeaea;
			line-height:48px;
			cursor:pointer;
		}
		.item01 span{
			float:right;
		}
	}
</style>
