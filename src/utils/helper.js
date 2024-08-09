import dayjs from 'dayjs'

export function sleep (s) {
    if (!s || s <= 0) s = 1
    return new Promise(resolve => setTimeout(resolve, 1000 * s))
}

export function divideArray (arr, segmentSize) {
    if (arr && Array.isArray(arr) && segmentSize && segmentSize > 0) {
        const rows = []
        arr.forEach((item, i) => {
            const index = parseInt(i / segmentSize)
            if (!rows[index]) {
                rows[index] = []
            }
            rows[index].push(item)
        })
        return rows
    } else {
        return []
    }
}

export function getDate (offset = 0) {
    const d = new Date()
    d.setDate(d.getDate() + offset)
    return d
}

export function formatDate (date, { type = 'full', divider = '-' } = {}) {
    const day = dayjs(date)
    if (type === 'short') {
        return day.format(`MM${divider}DD`)
    } else {
        return day.format(`YYYY${divider}MM${divider}DD`)
    }
    // const options = {
    //     month: '2-digit',
    //     day: '2-digit'
    // }
    // if (type !== 'short') {
    //     options.year = 'numeric'
    // }
    // return date
    //     .toLocaleDateString('zh-CN', options)
    //     .replaceAll('/', divider)
}

export function durationFrom (beginDate, endDate = null) {
    if (!endDate) endDate = new Date()
    const beginTime = beginDate.getTime()
    const endTime = endDate.getTime()
    if (beginTime >= endTime) {
        return 0
    } else {
        return parseInt((endTime - beginTime) / 1000)
    }
}

export function formatHisDate(value) {
    if (!value || value.length < 8) return value
    const year = value.slice(0, 4)
    const month = value.slice(4, 6)
    const day = value.slice(6, 8)
    return `${year}-${month}-${day}`
}

export function rowSupplement(list, rowSize) {
    const lastRowLength = list.length % rowSize
    if (lastRowLength > 1) {
        for (let i = 0; i < rowSize - lastRowLength; i++)
            list.push(null)
    }
}

export function dividePage(list, pageSize, rowSize) {
    const divided = divideArray(list, pageSize)
    const pages = []
    for (let i = 0; i < divided.length; i++) {
        const p = divided[i]
        rowSupplement(p, rowSize)
        const page = divideArray(p, rowSize)
        pages.push(page)
    }
    return pages
}
