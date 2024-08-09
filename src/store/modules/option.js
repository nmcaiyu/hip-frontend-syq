const initState = () => {
    return {
        showBanner: true,
        doctorListPageSize: 9,
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
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
