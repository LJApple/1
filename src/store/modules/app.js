import storage from '@/utils/storage'

import * as types from '../mutaion-types'

const app = {
    state: {
        version: 'v1',
        sidebar: {
            sliderState: storage.get('sliderState')
        }
    },
    mutations: {
        [types.SET_SLIDERSTATE]: (state, newSliderState) => {
            state.sidebar.sliderState = newSliderState
            storage.set('sliderState', newSliderState)
        }
    },
    actions: {
        toggleSideBar({ commit }) {
            let state = ''
            storage.get('sliderState') === 'full'
              ? (state = 'collapse')
              : (state = 'full')
            commit(types.SET_SLIDERSTATE, state)
        },
        setSliderState({ commit }, newSliderState) {
            commit(types.SET_SLIDERSTATE, newSliderState)
        }
    }
}
export default app