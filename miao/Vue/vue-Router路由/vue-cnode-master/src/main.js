// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// import axios from 'axios'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import filters from './util/dateFormatter.js'
import axios from './api/index.js'
Vue.config.productionTip = false
Vue.prototype.$axios=axios
Vue.use(mavonEditor)
/* eslint-disable no-new */
//全局注册组件
Object.keys(filters).forEach(function(k){
	return Vue.filter(k,filters[k])
})
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
