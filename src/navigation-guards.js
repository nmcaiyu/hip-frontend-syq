import router from './router'
import store from './store'
import _ from 'lodash'

router.beforeEach((to, from, next) => {
    if (!store.state.auth.token) {
        store.dispatch('auth/authenticate')
    }
    let failedAuth = null
    let failedRecord = null
    for (const record of to.matched) {
        const { auths } = record.meta
        if (auths && !Array.isArray(auths)) {
            console.error('invalid route meta prop "auths" in', record)
        }
        const isValidAuths = auths && Array.isArray(auths) && auths.length > 0
        if (isValidAuths) {
            for (const a of auths) {
                if (store.state.session[a.sessionKey] === null) {
                    failedAuth = a
                    failedRecord = record
                    break
                }
            }
        }
        if (failedAuth) break
    }
    if (failedAuth) {
        if (from.matched.some(record => record.name === failedAuth.unauthorized)) {
            next(false)
        } else {
            const isValidRouteName = router.resolve({ name: failedAuth.unauthorized }).resolved.matched.length > 0
            if (isValidRouteName) {
                next({ name: failedAuth.unauthorized })
            } else {
                console.error(`invalid route meta prop "auth[{unauthorized}]": ${failedAuth.unauthorized} in`, failedRecord)
                next(false)
            }
        }
    } else {
        next()
    }
})

router.afterEach((to, from) => {
    if (to.matched.some(record => record.name === 'Home')) {
        store.commit('session/reset')
        store.dispatch('auth/authenticate')
    }
})
