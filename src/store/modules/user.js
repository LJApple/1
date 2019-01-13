import { login } from '@/api/modules/login'
import { setToken } from '@/utils/auth'
import Cookies from 'js-cookie'
import * as types from '../mutaion-types'
const user = {
    state: {
        token: '',
        name: ''
    },
    mutations: {
        [types.SET_TOKEN]: (state, token) => {
            state.token = token
        },
        [types.SET_NAME]: (state, name) => {
            state.name = name
        }
    },
    actions: {
        login({commit}, { account, password, companyId }) {
            return new Promise(async (resolve, reject) => {
                try {
                    const response = await login(account, password, companyId)
                    if (response.data) {
                      commit(types.SET_TOKEN, response.data.token)
                      setToken(response.data.token)
                      Cookies.set('user', account)
                    }
                    resolve(response)
                } catch (error) {
                    reject(error)
                }
            })
        }
    }
}

export default user