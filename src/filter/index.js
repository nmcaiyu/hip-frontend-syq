import Vue from 'vue'
import currency from 'currency.js'
import { formatHisDate } from '../utils/helper'

const filters = {
    currency,
    formatHisDate
}

for (const [key, value] of Object.entries(filters)) {
    Vue.filter(key, value)
}
