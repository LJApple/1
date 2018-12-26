import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import app from './modules/app'
import user from './modules/user'
import tagsView from './modules/tagsView'
import router from './modules/router'


import getters from './getters'

const store = new Vuex.Store({
    modules: {
        app,
        user,
        tagsView,
        router
    },
    getters,
    strict: false
})
export default store