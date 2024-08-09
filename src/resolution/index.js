import currency from 'currency.js'
import store from '../store'

const w = window.innerWidth
const h = window.innerHeight
const ratio = currency(w).divide(h).value

const point = 0.8
if (ratio <= point) {
    // 1080/1920 ~= 0.56
    import('./r1080x1920.scss')
    store.commit('option/set', [ 'showBanner', true ])
    store.commit('option/set', [ 'doctorListPageSize', 9 ])
} else if (ratio > point) {
    // 1280/1024 ~= 1.25
    import('./r1280x1024.scss')
    store.commit('option/set', [ 'showBanner', false ])
    store.commit('option/set', [ 'doctorListPageSize', 6 ])
}
