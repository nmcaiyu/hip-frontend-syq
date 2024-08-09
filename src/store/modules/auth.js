import { setToken, getToken } from '@/utils/auth'
import { authenticate } from '@/api'

const initState = () => {
    return {
        token: getToken(),
    }
}

const state = initState()

const mutations = {
    set (state, [ k, v ]) {
        state[k] = v
    },

    reset (state) {
        Object.assign(state, initState())
    }
}

const actions = {
    authenticate ({ commit }) {
        return new Promise(resolve => {
            authenticate().then(resp => {
                const token = resp
                setToken(token)
                commit('set', [ 'token', token ])
            })
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
