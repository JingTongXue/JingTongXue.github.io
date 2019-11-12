import Vue from 'vue'
import Router from 'vue-router'
import home from '@/page/index.vue'
import message from '@/page/message.vue'
import login from '@/page/login.vue'
import more from '@/page/more.vue'
import desc from '@/page/desc.vue'
import people from '@/page/people.vue'
import myinfo from '@/page/myinfo.vue'
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      component: home
    },
    {
    	path:'/message',
      meta:{
        requireAuth:true,
      },
    	component:message
    },
     {
    	path:'/login',
      name:'login',
    	component:login
    },
     {
    	path:'/more',
    	component:more
    },
    {
      path:'/topic/:id',
      component:desc
    },
    {
      path:'/user/:user',
      name:'people',
      component:people
    },
    {
      path:'/myinfo',
      name:'myinfo',
      meta:{
        requireAuth:true,// 添加该字段，表示进入这个路由是需要登录的
      },
      component:myinfo
    },
    {
      path:'*',
      redirect:'/'
    }
  ]
})
