import router from '@/router'
import { Loading } from 'element-ui'

const defaultTimerStart = 120

const initState = () => {
    return {
        redirect: null,
        loading: null,
        patient: null,
        department: null,
        doctor: null,
        timerCountdown: defaultTimerStart,
        timerIntervalId: null,
        appointmentTimePeriod: null,
        // appointmentTimePoint: null, // 呼市第一医院
        paymentBusinessType: null,
        paymentAmount: null,
        paymentOrderNo: null,
        paymentMethod: null,
        subNav: null,
        settlementType: null,
        settlementData: null,
        selfPayAmount: null,
    }
}

const state = initState()

const mutations = {
    set (state, [ k, v ]) {
        state[k] = v
    },

    reset (state) {
        if (state.loading) {
            state.loading.close()
        }
        if (state.timerIntervalId) {
            clearInterval(state.timerIntervalId)
        }
        Object.assign(state, initState())
    }
}

const actions = {
    stopTimer ({ state, commit }) {
        return new Promise(resolve => {
            if (state.timerIntervalId) {
                clearInterval(state.timerIntervalId)
                commit('set', [ 'timerIntervalId', null ])
            }
            resolve()
        })
    },
    resetTimer ({ commit, dispatch }, start = null) {
        return new Promise(resolve => {
            dispatch('stopTimer').then(() => {
                commit('set', [ 'timerCountdown', start || process.env.VUE_APP_TIMER_START || defaultTimerStart ])
            })
            resolve()
        })
    },
    startTimer ({ state, commit, dispatch }) {
        return new Promise(resolve => {
            if (state.timerIntervalId || state.timerCountdown <= 0) {
                return false
            }
            const intervalId = setInterval(() => {
                commit('set', [ 'timerCountdown', state.timerCountdown - 1 ])
                if (state.timerCountdown <= 0) {
                    dispatch('stopTimer')
                }
            }, 1000)
            commit('set', [ 'timerIntervalId', intervalId ])
            resolve()
        })
    },
    startLoading ({ commit }, options) {
        return new Promise(resolve => {
            const loading = Loading.service(options)
            commit('set', [ 'loading', loading ])
            resolve()
        })
    },
    stopLoading ({ state, commit }) {
        if (state.loading) {
            state.loading.close()
            commit('set', [ 'loading', null ])
        }
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
