function responseSucceed(str) {
    return '0@' + str
}

function responseFailed(str = 'failed') {
    return '1@' + str
}

const cardInfo = '150000TLOZG000000000532646|毛晓艳|2|152326197610250063|1976-10-25||奈曼旗人民医院（在职）|150525|0|1|null|1101|310|1628.73|150500D156000005000F2614735147A4|||$'
const appointmentInfo = '0124|1112|1113|10|2|6|2|01|11|16|神经'
const outpatientInfo = '0123|1111|1112|10|2|8|0|01|11|16|神经^0124|1112|1113|10|2|6|2|01|11|16|神经'

export default {
    'APPOINTMENT': {
        getcardinfo: (lx, opter) => responseSucceed(cardInfo),
        yb2206: (opter, cardinfo, instr) => responseSucceed(appointmentInfo),
        yb2207: (opter, cardinfo, instr) => responseSucceed(appointmentInfo),
    },
    'OUTPATIENT': {
        getcardinfo: (lx, opter) => responseSucceed(cardInfo),
        yb2206: (opter, cardinfo, instr) => responseSucceed(outpatientInfo),
        yb2207: (opter, cardinfo, instr) => responseSucceed(outpatientInfo),
    }
}