import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

window.Vue = Vue;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  template:`
    <App/>
  `,
  component:{
    App,
  },
  // render: h => h(App),
}).$mount('#app');
