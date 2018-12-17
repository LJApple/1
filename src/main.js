import Vue from 'vue'
import ElementUI from 'element-ui'

import "normalize.css"
import '@/assets/styl/index.styl'
// theme
import '@/theme/element-#41B883/index.css'
import Icon from 'vue-svg-icon/Icon.vue'
import scroll from 'vue-seamless-scroll'

import App from '@/App.vue'
import { router } from '@/router'
import store from '@/store'

import i18n from '@/lang'
Vue.component('icon', Icon)

Vue.config.productionTip = false
Vue.use(scroll)
Vue.use(ElementUI, {
  size: 'medium',
  i18n: (key, value) => i18n.t(key, value)
})
// new Vue({
//   router,
//   store,
//   i18n,
//   render: h => h(App),
// }).$mount('#app')
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})