
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
		isLoading: false,
	},
    mutations: {
		watchLoading(state, is){
			state.isLoading = is
		}
	},
    actions: {}
})
export default store