<template>
	<div>
		  <p>标题</p>
		  <input type="text" name="" class="articleTitle" v-model='articleTitle' placeholder="不能少于10个字">
		  <p>请选择板块</p>
		  <select class="tab" v-model='tab'>
		  	<option selected>ask</option>
		  	<option>share</option>
		  	<option>job</option>
		  </select>
		   <span class="publish" @click='publish'>发布</span>
		  <mavon-editor v-model="valueText"/>
		  <bottomNav></bottomNav>
	</div>
</template>
<script>
	import bottomNav from '../components/bottomNav.vue'
	// import this.$axios from 'this.$axios'
	import {getCookie} from '../util/cookie.js'
	export default{
		components:{bottomNav},
		data(){
			return {
			valueText:'',
			articleTitle:'',
			tab:''
			}
		},
		methods:{
			publish(){
				if(this.articleTitle.length<10){
					alert('标题不能少于10个字哦')
					return false;
				}
				if(this.tab==''){
					alert('请选择一个模块呢')
					return false;
				}
				if(this.valueText==''){
					alert('内容不能为空哦~~')
					return false;
				}
				this.$axios.post('api/v1/topics',{accesstoken:getCookie('accesstoken'),title:this.articleTitle,tab:this.tab,content:this.valueText}).then(res=>{
					if(res.data.success){
						alert('发布成功啦~~')
					    this.$router.push('/topic/'+res.data.topic_id)
					}
				}).catch(
					err=>alert(err)
				)
			}
		}
	}
</script>
<style type="text/css">
	@import '../style/base/_base.scss';
	.publish{
	    display: block;
	    border-radius: 2px;
	    height: 36px;
	    line-height: 36px;
	    width: 88px;
	    text-align: center;
	    color: white;
	    margin: 5px auto;
	    cursor: pointer;
	    background: #fa8072;
	    -webkit-box-shadow: 0 1px 6px rgba(0, 0, 0, 0.117647), 0 1px 4px rgba(0, 0, 0, 0.11764);
	    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.117647), 0 1px 4px rgba(0, 0, 0, 0.11764);
	}
	.tab{
		width: 100%;
		height: 30px;
		font-size: 18px;
	}
	.articleTitle{
		width: 100%;
		height: 30px;
		font-size: 18px;
	}
</style>