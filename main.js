import Vue from 'vue'
import App from './App'
import HTTP from './common/http.js'
import store from './store/store.js'

Vue.prototype.$store = store
Vue.config.productionTip = false

App.mpType = 'app'

Vue.prototype.$http = HTTP

const app = new Vue({
    ...App,
	store
})
app.$mount()
