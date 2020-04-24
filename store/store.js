
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
		isLoading: false,
		user: {
			home: {
				id: 1,
				name: 'tax',
				img: 'static/img/homeHL.png'
			},
			customer: {
				id: 2,
				name: 'customer',
				img: 'static/img/customerHL.png'
			}
		}
	},
    mutations: {
		watchLoading(state, is){
			state.isLoading = is
		},
		updated:function(){
			console.log('message update:'+ this.scrollTop);
		}
	},
    actions: {}
})
export default store