import { getMenuAll } from '@/api/menu'
import { SET_ROUTES } from '../mutaion-types'
const router = {
    state: {
        routes: ''
    },
    mutations: {
        [SET_ROUTES]: (state, routes) => {
            state.routes = routes
        }
    },
    actions: {
        async getMenuAll({commit}) {
            try {
                const response = await getMenuAll()
                if (response.data) {
                    commit(SET_ROUTES, response.data)
                }
                return response.data
            } catch (error) {
                /* eslint-disable */
                console.error('getMenuAll', error)  
            }
        }
    }
}

export default router