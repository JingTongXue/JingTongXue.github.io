<template>
	<section>
		<!-- <brand :articleTitle='mtitle' id="top"></brand> -->
		<div class="brand" >
			<i class="brand-back" @click='goback'> <- </i>
			<p class="brand-title">{{item.title}}</p>
			<div class="brand-item"  @click='showtap'> =
				<section v-if='ishow'>
					<a href="#top">顶部</a>
					<a href="#replies">评论区</a>
					<a href="#comment">写评论</a>
					<router-link to='/'>返回首页</router-link>
				</section>
			</div>
		</div>
		<section class="aticlecontent" id="top">
			<title class="ititle">{{item.title}}</title>
			<div class="article-desc">
				<router-link :to="'/user/'+item.author.loginname" class="avatar_url" ><img :src="item.author.avatar_url" alt=""></router-link>
				<div>
					<span >{{item.author.loginname}}</span><span>{{item.create_at|dateformatter}}</span>
				</div>
				<div>最后回复：<span>{{item.last_reply_at|dateformatter}}</span> 浏览量：<span>{{item.visit_count}}</span></div>
			</div>
			<div @click='iscollect' class="collection" v-model='isCollect'>{{collectText}}</div>
			<article v-html='item.content' class="a-content">
			</article>
			<div class="num" id='replies'>
				<span>{{item.replies.length}}</span>条评论
			</div>
			<div>
				<ul class="comment">
					<li v-for='(val,index) in item.replies' class="replies">
						<div>
							<a href="" class="avatar_url"><img :src="val.author.avatar_url" alt=""></a>
							<span>{{val.author.loginname}}</span>
							<i class="good" @click='like(index)'>{{item.replies[index].ups.length}}</i>
							<span class="comments" @click='commentshow(index)'></span>
						</div>
						<p v-html='val.content' class="a"></p>
						<div v-show='index==i'>
							<textarea name="" v-model='reply_content'  rows="3"  class="reply_one">
							</textarea>
							<div class="comment-btn">
								<span class="btn" @click='cancelComment(index)'>取消</span>
								<span class="btn" @click='commitComment(index)'>确定</span>
							</div>
						</div>
					</li>
				</ul>
			</div>
			<!-- 评论 -->
			<section id="comment">
				<textarea rows="5" cols='100' class="reply" placeholder="请输入评论" v-model='textarea_content'>
				</textarea>
				<span class="publish_reply" @click='publish_reply'>发表评论</span>
			</section>
		</section>
	</section>
</template>
<script>
	// import brand from '../components/brand.vue';
	// import this.$axios from 'this.$axios';
	import {getCookie} from '../util/cookie.js'
	export default{
		// components:{brand},
		data(){
			return {
				mtitle:'title',
				id: this.$route.params.id,
				item:{
					replies:{},
					author:{}
				},
				textarea_content:'',
				i:-1,
				reply_content:'',
				collectText:'',
				isCollect:false,
				ishow:false
			}
		},
		created(){
			this.getData()
			this.hasCollect()
		},
		computed:{
			//计算属性，当评论成功后，实时显示评论内容
			getmessage:function(){
				return this.item
			}
		},
		scrollBehavior (to, from, savedPosition) {
		  if (to.hash) {
		    return {
		      selector: to.hash
		    }
		  }
		},
		methods:{
			//获取文章内容
			getData(){
				this.$axios.get('api/v1/topic/'+this.id)
				.then(res=>{
					this.item=res.data.data;
					this.mtitle=this.item.title
				})
			},
			//返回
			goback(){
				this.$router.go(-1)
			},
			//显示导航
			showtap(){
				this.ishow=!this.ishow
			},

	 	    //回复文章
	 	    publish_reply(){
	 	    	if(getCookie('accesstoken')){
	 	    		this.$axios.post('api/v1/topic/'+this.id+'/replies?',{
	 	    			accesstoken:getCookie('accesstoken'),
	 	    			content:this.textarea_content})
	 	    		.then(
	 	    			res=>{
		 	   				//评论成功，重新获取数据
		 	   				this.getData();
		 	   				this.textarea_content=''
		 	   				//可以写个小tips,提示评论成功
		 	   			}
		 	   			)
	 	    	}else{
	 	    		alert('请先登录~~')
	 	    	}
	 	    },
		 	//点击评论按钮
		 	commentshow(index){
		 		if(getCookie('accesstoken')){
		 			this.i=index
		 		}else{
		 			alert('请先登录~~')
		 			this.i=-1
		 		}
		 	},
		 	//取消评论
		 	cancelComment(index){
		 		this.i=-1
		 	},
		 	//回复评论的评论
		 	commitComment(index){
		 		if(getCookie('accesstoken')){
		 			this.$axios.post('api/v1/topic/'+this.id+'/replies?',{
		 				accesstoken:getCookie('accesstoken'),
		 				content:'@'+this.item.replies[index].author.loginname+' '+this.reply_content,
			 		reply_id:this.item.replies[index].id//每条评论都有一个ID
			 	}).then(
			 	res=>{
			 		this.getData();
			 		this.i=-1
			 		this.reply_content=''
			 	}
			 	)
			 	.catch(err=>alert('评论失败啦'))
			 }else{
			 	alert('请先登录~~')
			 }
			},
		 	//收藏
		 	iscollect(){
		 		let collectapi=this.isCollect?'de_collect':'collect'
		 		this.$axios.post('api/v1/topic/'+collectapi+'?',{
		 			accesstoken:getCookie('accesstoken'),
		 			topic_id :this.id
		 		}).
		 		then(res=>{
		 			this.collectText=this.isCollect?'♡收藏':'♥取消收藏'
		 			this.isCollect=!this.isCollect
		 		})
		 	},
		 	//判断已登录用户是否收藏
		 	hasCollect(){
		 		const topicid=this.id
		 		let that=this
		 		if(!getCookie('accesstoken')) return;
		 		this.$axios.get('api/v1/user/'+getCookie('username'))
		 		.then(res=>{
		 			if(res.data.data.collect_topics.length!=0){
		 				res.data.data.collect_topics.find(function(value,index,arr){
		 					if(value.id==topicid){
		 						that.collectText='♥取消收藏'
		 						that.isCollect=true
		 					}else{
		 						that.collectText='♡收藏'
		 						that.isCollect=false
		 					}
		 				})
		 			}else{
		 				that.collectText='♡收藏'
		 				that.isCollect=false
		 			}
		 		})
		 	},
		 	//点赞
		 	like(index){
		 		if( !getCookie('accesstoken')){return alert('请先登录~')}
		 			this.$axios.post('api/v1/reply/'+this.item.replies[index].id+'/ups',{
		 				accesstoken:getCookie('accesstoken')
		 			})
		 		.then(res=>{
		 			if(res.data.success){
		 				this.getData()
		 			}else{
		 				alert(res.data.error_msg)
		 			}

		 		})
		 		.catch(err=>{
		 			alert(err)
		 		})
		 	}
		 }
		}
	</script>
	<style>
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
	}
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
	.brand-item section{
		position:fixed;
		right: 5px;
		top: 35px;
		width: 100px;
		text-align: center;
		background:white;
		height: 170px;
		border:1px solid #ccc;
	}
	.brand-item>section *{
		display: block;
		color: #666666;
		margin:14px auto 14px auto;
	}
	/**/
	.ititle{
		display: flex;
		justify-content: center;
		border-bottom: 1px solid #ccc;
		height: 50px;
		align-items: center;
	}
	.article-desc{
		height: 75px;
		border-bottom: 1px solid #ccc;
		box-sizing: border-box;
		padding:10px;
	}
	.avatar_url{
		float: left;
		width: 40px;
		height: 40px;
		display: block;
		margin-right: 10px;
	}
	.avatar_url img{
		width: 100%;
		height: 100%;
		border-radius: 20px;
	}
	.a-content{
		padding:10px;
		border-bottom: 10px solid #EFF2F7;
	}
	.num{
		border-left: 6px solid #FA8072;
		margin-left: 20px;
		height: 40px;
		line-height: 40px;
		border-bottom: 1px solid #ccc;
	}
	.replies>div{
		clear: both;
		padding: 10px 0 0 10px;
		line-height: 40px;
		/*height: 40px;*/
	}
	.replies{
		border-bottom: 1px solid #ccc;
	}
	.aticlecontent{
		margin-top:40px;
	}
	.publish_reply{
		display: flex;
		width: 100px;
		height: 30px;
		line-height: 30px;
		justify-content: center;
		align-items: center;
		background: #fa8072;
		border-radius: 5px;
		cursor: pointer;
		margin:30px auto;
		color: white;
		outline:none;
	}
	textarea:focus { outline: none;
		-webkit-box-shadow: 0px 0px 10px 0px #cacbc3;
		box-shadow: 0px 0px 10px 0px #cacbc3;
	}
	.reply{
		margin:30px auto;
		display: block;
		border:none;
		border-bottom: 1px solid #ccc;
	}
	.good{
		background: url(../assets/img/good.png) no-repeat;
		float: right;
		cursor: pointer;
		padding-left: 24px;
		background-size: 17px;
		margin-right: 20px;
		height: 17px;
		line-height: 17px;
	}
	.comments{
		background: url(../assets/img/comments.png) no-repeat;
		float: right;
		cursor: pointer;
		padding-left: 24px;
		background-size: 17px;
		margin-right: 20px;
		height: 17px;
		line-height: 17px;
	}
	.reply_one{
		margin:30px auto;
		display: block;
		width: 90%;
		border-radius: 5px;
		border-bottom: 1px solid #ccc;
	}
	.btn{
		width: 100px;
		display: inline-block;
		height: 30px;
		line-height: 30px;
		-webkit-box-pack: center;
		justify-content: center;
		-webkit-box-align: center;
		align-items: center;
		background: #fa8072;
		border-radius: 5px;
		cursor: pointer;
		color: white;
		outline: none;
		text-align: center;
		margin: 0 86px;
	}
	.collection{
		display: flex;
		justify-content: center;
		cursor: pointer;
	}
	.comment{
		padding:0 10px;
	}
	.comment-btn{
		display: flex;
		justify-content: center;
	}
	.comment-btn span{
		flex: 0 0 5%;
		width: 30%;
		padding: 0 10px;
		display: inline-block;
	}
</style>