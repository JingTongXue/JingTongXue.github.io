<template>
	<div class="nav-bottom">
	     <router-link to="/">首页</router-link>
       <router-link to="/more">发布</router-link>
       <router-link to="/message">信息</router-link>
       <router-link to='/myinfo'>我的</router-link>
	</div>
</template>
<script>
   export default{
    name:'navBottom'
   }
</script>
<style>
   *{
    padding: 0;
    bottom: 0;
   }
  .nav-bottom{
    width: 100%;
    border-top: 1px solid #ccc;
    height: 60px;
    display: -webkit-box;
    display: flex;
    align-items: center;
    justify-content: center;
    display: -webkit-flex;
    background: white;
    position: fixed;
    z-index: 200;
    bottom: 0;
  }
  /*要水平居中a标签里面的内容，a就变成了父容器*/
  .nav-bottom a{
    flex: 1;
    text-decoration: none;
     display: flex;
     color: #666666;
    justify-content: center;
  }
</style>