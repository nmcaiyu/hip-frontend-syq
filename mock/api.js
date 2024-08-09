const navList = require('./data/nav')
const patient = require('./data/patient')
const departments = require('./data/departments')
const doctors = require('./data/doctors')
const schedule = require('./data/schedule')
const appointments = require('./data/appointments')
const latestAppointments = require('./data/latest-appointments')
const paidBills = require('./data/paid-bills')
const paidBillInvoice = require('./data/paid-bill-invoice')
const unpaidBills = require('./data/unpaid-bills')
const settledBills = require('./data/settled-bills')
const doctorsByNameInitials = require('./data/doctors-by-name-initials')
const idcardInfo = require('./data/idcard-info')
const itemPrice = require('./data/item-price')
const inpatient = require('./data/inpatient')
const inpatientInvoiceList = require('./data/inpatient-invoice-list')
const inpatientInvoiceDetail = require('./data/inpatient-invoice-detail')
const rechargeRecords = require('./data/recharge-records')
const testRecords = require('./data/test-records')

const token = 'hip-token'

function responseBody(data = null) {
    return {
        code: 0,
        msg: 'success',
        data
    }
}

function responseBodyFailed() {
    return {
        code: 1,
        msg: 'failed',
    }
}

module.exports = [
    // 获取token
    {
        url: '/device/device/getCurrDeviceByIP',
        type: 'get',
        response: config => {
            return responseBody(token)
        }
    },
    // 获取自助机信息
    {
        url: '/device/device/getCurrDevice',
        type: 'get',
        response: config => {
            return responseBody({
                deviceNum: 'zzj00',
            })
        }
    },
    // 首页导航列表
    {
        url: '/device/device/menuList',
        type: 'get',
        response: config => {
            return responseBody(navList)
        }
    },
    // 自助机读取身份识别信息
    // idType: 1 => 身份证, 2 => 社保卡, 3 => 就诊码, 4 => 健康码, 5 => 门诊号
    {
        url: '/patient/patient/getPatientByDevice/[1-5]',
        type: 'get',
        response: config => {
            return responseBody(patient)
        }
    },
    // 查询当日挂号/预约挂号存在排班的两级就诊专业/科室列表
    {
        url: '/outpatient/dept/scheduleDeptList/[1-2]',
        type: 'get',
        response: config => {
            return responseBody(departments)
        }
    },
    // 按专业/科室编码查询有排班的医生列表
    {
        url: '/outpatient/doctor/scheduleStatByDept',
        type: 'post',
        response: config => {
            return responseBody(doctors)
        }
    },
    // 查询某医生排班信息
    {
        url: '/outpatient/doctor/scheduleByDoctorCode',
        type: 'post',
        response: config => {
            return responseBody(schedule)
        }
    },
    // 挂号锁号
    {
        url: '/outpatient/register/lockReg',
        type: 'post',
        response: config => {
            return responseBody("PaymentOrderNo")
        }
    },
    // 预约信息查询
    {
        url: '/outpatient/register/appoRegQuery',
        type: 'get',
        response: config => {
            return responseBody(appointments)
        }
    },
    // 预约登记后挂号锁号
    {
        url: '/outpatient/register/appoLockReg',
        type: 'post',
        response: config => {
            return responseBody("PaymentOrderNo")
        }
    },
    // 7天内的挂号信息查询
    {
        url: '/outpatient/register/recentRegisters',
        type: 'get',
        response: config => {
            return responseBody(latestAppointments)
        }
    },
    // 用于自助机(1)补打挂号凭条和(2)预约取号 勾选须打印项后调取
    {
        url: '/outpatient/register/regByOrderNums',
        type: 'post',
        response: config => {
            return responseBody({ printCode: '1' })
        }
    },
    // 分页查询已缴费单据所属的挂号序号列表
    {
        url: '/outpatient/payBill/paidBillRegs',
        type: 'get',
        response: config => {
            return responseBody(paidBills)
        }
    },
    // 分页查询待缴费单据所属的挂号序号列表
    {
        url: '/outpatient/payBill/unpaidBillRegs',
        type: 'get',
        response: config => {
            return responseBody(unpaidBills)
        }
    },
    // 根据 billId 查询缴费单据详情列表
    {
        url: '/outpatient/payBill/payBillItems/[1|43|44]',
        type: 'get',
        response: config => {
            return responseBody(paidBillInvoice)
        }
    },
    // 根据 orderNum 查询已缴费单据列表 打印门诊缴费单据
    {
        url: '/outpatient/payBill/paidBillByOrderNum',
        type: 'get',
        response: config => {
            return responseBody({ printCode: '1' })
        }
    },
    // 查询 HIS 近 30 天的门诊就诊已结算收费主信息
    {
        url: '/outpatient/payBill/paidOrdersByWS',
        type: 'get',
        response: config => {
            return responseBody(settledBills)
        }
    },
    // 打印门诊就诊已结算收费明细
    {
        url: '/outpatient/payBill/paidOrderItemsByWS',
        type: 'get',
        response: config => {
            return responseBody()
        }
    },
    // 无卡用户查询 (身份证号查询)
    {
        url: '/patient/patient/queryByIdCardNum',
        type: 'get',
        response: config => {
            return responseBody(patient)
        }
    },
    // 按医生姓名首字母查询有排班的医生信息列表
    {
        url: '/outpatient/doctor/queryDoctorsByInitials',
        type: 'get',
        response: config => {
            return responseBody(doctorsByNameInitials)
        }
    },
    // 通过身份证号码 获取就诊人的籍贯 性别 出生日期等信息
    {
        url: '/patient/patient/getIdCardInfo',
        type: 'get',
        response: config => {
            return responseBody(idcardInfo)
        }
    },
    // 无卡建档
    {
        url: '/patient/patient/savePatient',
        type: 'post',
        response: config => {
            return responseBody(patient)
        }
    },
    // HIS药品与诊疗项目信息查询
    {
        url: '/others/drugsAndItem/drugs',
        type: 'get',
        response: config => {
            return responseBody(itemPrice)
        }
    },
    // 根据 orderNum 查询挂号待支付信息
    {
        url: '/outpatient/register/regByOrderNum',
        type: 'get',
        response: config => {
            return responseBody({ orderNum: 1, payFee: 15 })
        }
    },
    // 自助机扫码支付
    {
        url: '/pay/devicePayCenter/orderScanPay',
        type: 'get',
        response: config => {
            return responseBody({ businessType: 1, orderNum: 1 })
        }
    },
    // 支付状态查询
    {
        url: '/pay/devicePayCenter/pollPay',
        type: 'get',
        response: config => {
            return responseBodyFailed()
        }
    },
    // 自助机收银系统银行卡支付准备
    {
        url: '/pay/devicePayCenter/preCardPay',
        type: 'get',
        response: config => {
            return responseBody({ businessType: 1, orderNum: 1 })
        }
    },
    // 自助机收银系统银行卡支付获取键值
    {
        url: '/pay/devicePayCenter/getOnePass',
        type: 'get',
        response: config => {
            return responseBody({ remarks: '2a' })
        }
    },
    // 自助机收银系统银行卡支付
    {
        url: '/pay/devicePayCenter/cardPay',
        type: 'get',
        response: config => {
            return responseBody({ businessType: 1, orderNum: 1 })
        }
    },
    // 选择多笔待缴费单据 生成一个支付订单
    {
        url: '/outpatient/payBill/createPayOrder',
        type: 'post',
        response: config => {
            return responseBody("PaymentOrderNo")
        }
    },
    // 住院号查询患者信息
    {
        url: '/inpatient/inpatient/getByInpatientNum',
        type: 'get',
        response: config => {
            return responseBody(inpatient)
        }
    },
    // 获取住院费用清单列表
    {
        url: '/inpatient/inpatient/getInPatientFeeList',
        type: 'get',
        response: config => {
            return responseBody(inpatientInvoiceList)
        }
    },
    // 获取住院费用清单详情
    {
        url: '/inpatient/inpatient/getInPatientFeeDetail',
        type: 'get',
        response: config => {
            return responseBody(inpatientInvoiceDetail)
        }
    },
    // 住院充值订单生成
    {
        url: '/inpatient/payment/createPrePayment',
        type: 'post',
        response: config => {
            return responseBody('InpatientRechargeOrderNo')
        }
    },
    // 住院充值小票打印
    {
        url: '/inpatient/recharge/rechargeInfoPrint',
        type: 'get',
        response: config => {
            return responseBody({ printCode: '1' })
        }
    },
    // 住院充值记录列表
    {
        url: '/inpatient/recharge/queryListByInpatientNum',
        type: 'get',
        response: config => {
            return responseBody(rechargeRecords)
        }
    },
    // 检验报告列表
    {
        url: '/print/inspectionReport/list',
        type: 'post',
        response: config => {
            return responseBody(testRecords)
        }
    },
    // 检验报告打印
    {
        url: '/print/inspectionReport/print',
        type: 'post',
        response: config => {
            return responseBody({ printCode: '1' })
        }
    },
    // 新增医保 ActiveX 请求日志
    {
        url: '/healthcare',
        type: 'post',
        response: config => {
            return responseBody({ logHealthcareId: 1 })
        }
    },
    // 更新医保 ActiveX 请求日志
    {
        url: '/healthcare',
        type: 'put',
        response: config => {
            return responseBody()
        }
    },
    // 医保卡状态轮询
    {
        url: '/pay/devicePayCenter/checkCard',
        type: 'get',
        response: config => {
            return responseBody()
        }
    },
    // 医保预结算
    {
        url: '/pay/devicePayCenter/preSettlement',
        type: 'post',
        response: config => {
            return responseBody({
                number: '0125',
                sum: 10,
                socialPay: 6,
                medicarePay: 2,
                cashPay: 2,
            })
        }
    },
    // 医保结算
    {
        url: '/pay/devicePayCenter/settlement',
        type: 'post',
        response: config => {
            return responseBody()
        }
    },
]
