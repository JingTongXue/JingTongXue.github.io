<template>
	<div>
		<header class="brand"><span class="tit">登录</span><a class="reg" href="https://www.vue-js.com/signup">注册</a></header>
		<input type="text" placeholder="请输入accessToken" class="access" v-model='info'>
		<button class="login" @click='login'>登录</button>
		<a href="" class="getlink">如何获取accessToken</a>
        <bottomNav></bottomNav>
    </div>
</template>
<script>
import bottomNav from '../components/bottomNav.vue'
import {setCookie} from '../util/cookie.js'
// import this.$axios from 'this.$axios';
export default{
  components:{bottomNav},
  data(){
     return {
				info:''  //获取vue input的值
			}
		},
		methods:{
			login(){
				this.$axios.post('api/v1/accesstoken',{
					accesstoken:this.info
				})
				.then(
					res=>{
                        const info=this.info;
                        setCookie('accesstoken',this.info)
                        setCookie('username',res.data.loginname)
                        setCookie('userid',res.data.id)
                        this.$router.push( {name:'myinfo',params:{user:res.data.loginname} } )
                    }
                    )
                .catch(
                    err=>{
                        alert(err)
                    }
                    )
            }

        }
    }
    </script>
    <style>
    @import '../style/base/_base.scss';
    .brand{
      width: 100%;
      height: 40px;
      line-height: 40px;
      background:#474A4F;
      text-align: center;
  }
  .brand .tit{
      color:white;
      font-size: 24px;

  }
  .brand .reg{
      color:#FF5252;
      font-size: 20px;
      float: right;
  }
  .access{

   -webkit-appearance: none;
   -moz-appearance: none;
   appearance: none;
   outline: none;
   border: none;
   background: none;
   border-radius: 0 0 0 0;
   box-shadow: none;
   display: block;
   padding: 0;
   margin: 0;
   width: 100%;
   height: 32px;
   font-style: inherit;
   font-variant: inherit;
   font-weight: inherit;
   font-stretch: inherit;
   font-size: inherit;
   color: rgba(0,0,0,.87);
   font-family: inherit;
   margin: 0 auto;
   display: flex;
   width: 40%;
   margin-top: 20%;
   border-bottom: 1px solid #ccc;
}
.login{
   display: inline-block;
   overflow: hidden;
   position: relative;
   border-radius: 2px;
   height: 36px;
   line-height: 36px;
   min-width: 88px;
   transition-duration: .3s;
   transition-timing-function: cubic-bezier(.23,1,.32,1);
   -webkit-transform: translateZ(0);
   transform: translateZ(0);
   text-decoration: none;
   text-transform: uppercase;
   border: none;
   -webkit-appearance: none;
   -moz-appearance: none;
   appearance: none;
   color: rgba(255,255,255,.87);
   -webkit-box-flex: 0;
   -webkit-flex-shrink: 0;
   -ms-flex: 0 0 auto;
   -ms-flex-negative: 0;
   flex-shrink: 0;
   margin: 0;
   outline: 0;
   padding: 0;
   cursor: pointer;
   display: block;
   margin: 10% auto;
   box-shadow: 0 1px 6px rgba(0,0,0,.117647), 0 1px 4px rgba(0,0,0,.117647);
   background: #7E848C;

}
.getlink{
  display: inline-block;
  overflow: hidden;
  position: relative;
  border-radius: 2px;
  height: 36px;
  line-height: 36px;
  min-width: 88px;
  transition-duration: .3s;
  transition-timing-function: cubic-bezier(.23,1,.32,1);
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  text-decoration: none;
  text-transform: uppercase;
  border: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  color: rgba(0,0,0,.87);
  -webkit-box-flex: 0;
  -webkit-flex-shrink: 0;
  -ms-flex: 0 0 auto;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  margin: 0;
  outline: 0;
  padding: 0;
  cursor: pointer;
  box-shadow: 0 1px 6px rgba(0,0,0,.117647), 0 1px 4px rgba(0,0,0,.117647);
  display: block;
  text-align: center;
  width: 30%;
  margin: 0 auto;
  font-size: 12px;
}
</style>