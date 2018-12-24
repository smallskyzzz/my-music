// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import VueLazyLoad from 'vue-lazyload'

import 'element-ui/packages/theme-chalk/src/index.scss'
import './common/stylus/index.styl'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueLazyLoad, {
  loading: require('./loading.jpg')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
