import Vue from 'vue'
import VueRouter from 'vue-router'

import LayoutMain from '@/layouts/main'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'HomeView',
        component: LayoutMain,
        redirect: '/home',
        children: [
            // 首页导航
            {
                path: 'home',
                name: 'Home',
                component: () => import('../views/home')
            }
        ]
    },
    {
        path: '/main',
        name: 'MainView',
        component: LayoutMain,
        redirect: '/main/identification/methods',
        children: [
            // 结果页
            {
                path: 'result',
                name: 'Result',
                component: () => import('../views/result')
            },
            // 二级导航
            {
                path: 'sub-nav/:category',
                name: 'SubNav',
                component: () => import('../views/sub-nav'),
            },
            // 选择身份识别方式
            {
                path: 'identification/methods',
                name: 'IdentificationMethods',
                component: () => import('../views/identification'),
                meta: {
                    auths: [
                        { sessionKey: 'redirect', unauthorized: 'Home' }
                    ]
                }
            },
            // 读取身份识别信息
            {
                path: 'identification/reading/:method',
                name: 'IdentificationReading',
                component: () => import('../views/identification/reading'),
                meta: {
                    auths: [
                        { sessionKey: 'redirect', unauthorized: 'Home' }
                    ]
                }
            },
            // 无卡用户
            {
                path: 'identification/typing/identity-card-no',
                name: 'IdentificationTypingIdentityCardNo',
                component: () => import('../views/identification/identity-card-no-typing'),
                meta: {
                    auths: [
                        { sessionKey: 'redirect', unauthorized: 'Home' }
                    ]
                }
            },
            // 确认身份信息
            {
                path: 'identification/info',
                name: 'IdentificationInfo',
                component: () => import('../views/identification/info'),
                meta: {
                    auths: [
                        { sessionKey: 'redirect', unauthorized: 'Home' },
                        { sessionKey: 'patient', unauthorized: 'Home' }
                    ]
                }
            },
            // 建档
            {
                path: 'identification/register',
                name: 'IdentificationRegister',
                component: () => import('../views/identification/register'),
                meta: {
                    auths: [
                        { sessionKey: 'redirect', unauthorized: 'Home' },
                    ]
                }
            },
            // 预约挂号二级导航
            {
                path: 'appointment/sub-nav',
                name: 'AppointmentSubNav',
                redirect: { name: 'SubNav', params: { category: 'AppointmentSubNav' } }
            },
            // 预约挂号 - 按科室
            {
                path: 'appointment/departments',
                name: 'AppointmentViaDepartments',
                component: () => import('../views/appointment'),
                meta: {
                    auths: [
                        { sessionKey: 'patient', unauthorized: 'IdentificationMethods' }
                    ]
                }
            },
            // 预约挂号 - 选择医生
            {
                path: 'appointment/doctors',
                name: 'AppointmentDoctors',
                component: () => import('../views/appointment/doctors'),
                meta: {
                    auths: [
                        { sessionKey: 'patient', unauthorized: 'IdentificationMethods' },
                        { sessionKey: 'department', unauthorized: 'AppointmentViaDepartments' }
                    ]
                }
            },
            // 预约挂号 - 按医生姓名
            {
                path: 'appointment/doctors-by-name-initials',
                name: 'AppointmentDoctorsByNameInitials',
                component: () => import('../views/appointment/doctors-by-name-initials'),
                meta: {
                    auths: [
                        { sessionKey: 'patient', unauthorized: 'IdentificationMethods' }
                    ]
                }
            },
            // 预约挂号 - 选择就医日期时段
            {
                path: 'appointment/doctor-schedule',
                name: 'AppointmentDoctorSchedule',
                component: () => import('../views/appointment/schedule'),
                meta: {
                    auths: [
                        { sessionKey: 'patient', unauthorized: 'IdentificationMethods' },
                        { sessionKey: 'doctor', unauthorized: 'AppointmentDoctors' }
                    ]
                }
            },
            // 预约取号
            {
                path: 'appointment/check',
                name: 'AppointmentCheck',
                component: () => import('../views/appointment/check'),
                meta: {
                    auths: [
                        { sessionKey: 'patient', unauthorized: 'IdentificationMethods' },
                    ]
                }
            },
            // 今日挂号结算方式选择
            {
                path: 'appointment-today/sub-nav',
                name: 'AppointmentTodaySubNav',
                redirect: { name: 'Settlement', params: { redirect: 'AppointmentTodaySubNavReal' } }
            },
            // 今日挂号二级导航
            {
                path: 'appointment-today/sub-nav-real',
                name: 'AppointmentTodaySubNavReal',
                redirect: { name: 'SubNav', params: { category: 'AppointmentTodaySubNav' } }
            },
            // 今日挂号 - 按科室
            {
                path: 'appointment-today/departments',
                name: 'AppointmentTodayViaDepartments',
                component: () => import('../views/appointment'),
                meta: {
                    auths: [
                        { sessionKey: 'patient', unauthorized: 'IdentificationMethods' }
                    ]
                }
            },
            // 今日挂号 - 选择医生
            {
                path: 'appointment-today/doctors',
                name: 'AppointmentTodayDoctors',
                component: () => import('../views/appointment/doctors'),
                meta: {
                    auths: [
                        { sessionKey: 'patient', unauthorized: 'IdentificationMethods' },
                        { sessionKey: 'department', unauthorized: 'AppointmentTodayViaDepartments' }
                    ]
                }
            },
            // 今日挂号 - 按医生姓名
            {
                path: 'appointment-today/doctors-by-name-initials',
                name: 'AppointmentTodayDoctorsByNameInitials',
                component: () => import('../views/appointment/doctors-by-name-initials'),
                meta: {
                    auths: [
                        { sessionKey: 'patient', unauthorized: 'IdentificationMethods' }
                    ]
                }
            },
            // 今日挂号 - 选择就医日期时段
            {
                path: 'appointment-today/doctor-schedule',
                name: 'AppointmentTodayDoctorSchedule',
                component: () => import('../views/appointment/schedule'),
                meta: {
                    auths: [
                        { sessionKey: 'patient', unauthorized: 'IdentificationMethods' },
                        { sessionKey: 'doctor', unauthorized: 'AppointmentDoctors' }
                    ]
                }
            },
            // 挂号信息确认
            {
                path: 'appointment/confirmation',
                name: 'AppointmentConfirmation',
                component: () => import('../views/appointment/confirmation'),
                meta: {
                    auths: [
                        { sessionKey: 'patient', unauthorized: 'IdentificationMethods' },
                        { sessionKey: 'department', unauthorized: 'AppointmentViaDepartments' },
                        { sessionKey: 'doctor', unauthorized: 'AppointmentDoctors' },
                        { sessionKey: 'appointmentTimePeriod', unauthorized: 'AppointmentDoctorSchedule' },
                        // { sessionKey: 'appointmentTimePoint', unauthorized: 'AppointmentDoctorSchedule' }
                    ]
                }
            },
            // 补打凭条二级导航
            {
                path: 'print/sub-nav',
                name: 'PrintSubNav',
                redirect: { name: 'SubNav', params: { category: 'PrintSubNav' } }
            },
            // 补打凭条 - 补打挂号凭条
            {
                path: 'print/appointment-ticket',
                name: 'PrintAppointmentTicket',
                component: () => import('../views/print/appointment-ticket'),
                meta: {
                    auths: [
                        { sessionKey: 'patient', unauthorized: 'IdentificationMethods' },
                    ]
                }
            },
            // 补打凭条 - 补打门诊缴费凭条
            {
                path: 'print/outpatient-receipt',
                name: 'PrintOutpatientReceipt',
                component: () => import('../views/print/outpatient-receipt'),
                meta: {
                    auths: [
                        { sessionKey: 'patient', unauthorized: 'IdentificationMethods' },
                    ]
                }
            },
            // 门诊明细打印
            {
                path: 'print/outpatient-invoice',
                name: 'PrintOutpatientInvoice',
                component: () => import('../views/print/outpatient-invoice'),
                meta: {
                    auths: [
                        { sessionKey: 'patient', unauthorized: 'IdentificationMethods' },
                    ]
                }
            },
            // 住院充值记录
            {
                path: 'inpatient/recharge-records',
                name: 'InpatientRechargeRecords',
                component: () => import('../views/print/recharge-receipt'),
                meta: {
                    auths: [
                        { sessionKey: 'patient', unauthorized: 'InpatientNoTyping' },
                    ]
                }
            },
            // 检验报告打印
            {
                path: 'print/test-report',
                name: 'PrintTestReport',
                component: () => import('../views/print/test-report'),
                meta: {
                    auths: [
                        { sessionKey: 'patient', unauthorized: 'IdentificationMethods' },
                    ]
                }
            },
            // 药价查询
            {
                path: 'item-price',
                name: 'ItemPrice',
                component: () => import('../views/item-price'),
            },
            // 选择支付方式
            {
                path: 'payment/methods',
                name: 'PaymentMethods',
                component: () => import('../views/payment'),
                meta: {
                    auths: [
                        { sessionKey: 'patient', unauthorized: 'IdentificationMethods' },
                        { sessionKey: 'paymentBusinessType', unauthorized: 'Home' },
                        { sessionKey: 'paymentAmount', unauthorized: 'Home' },
                        { sessionKey: 'paymentOrderNo', unauthorized: 'Home' },
                    ]
                }
            },
            // 扫码支付页面
            {
                path: 'payment/pay',
                name: 'PaymentPay',
                component: () => import('../views/payment/pay'),
                meta: {
                    auths: [
                        { sessionKey: 'patient', unauthorized: 'IdentificationMethods' },
                        { sessionKey: 'paymentBusinessType', unauthorized: 'Home' },
                        { sessionKey: 'paymentAmount', unauthorized: 'Home' },
                        { sessionKey: 'paymentOrderNo', unauthorized: 'Home' },
                        { sessionKey: 'paymentMethod', unauthorized: 'PaymentMethods' },
                    ]
                }
            },
            // 结算方式选择
            {
                path: 'settlement',
                name: 'Settlement',
                component: () => import('../views/settlement'),
            },
            // 结算跳转
            {
                path: 'settlement/dispatch',
                name: 'SettlementDispatch',
                component: () => import('../views/settlement/dispatch'),
            },
            // 医保结算
            {
                path: 'health-insurance/settle',
                name: 'HealthInsuranceSettle',
                component: () => import('../views/health-insurance/settle'),
                meta: {
                    auths: [
                        { sessionKey: 'patient', unauthorized: 'IdentificationMethods' },
                        { sessionKey: 'paymentBusinessType', unauthorized: 'Home' },
                        { sessionKey: 'paymentAmount', unauthorized: 'Home' },
                        { sessionKey: 'paymentOrderNo', unauthorized: 'Home' },
                    ]
                }
            },
            // 电子医保结算
            {
                path: 'health-insurance/settle-etc',
                name: 'HealthInsuranceSettleEtc',
                component: () => import('../views/health-insurance/settle-etc'),
                meta: {
                    auths: [
                        { sessionKey: 'patient', unauthorized: 'IdentificationMethods' },
                        { sessionKey: 'paymentBusinessType', unauthorized: 'Home' },
                        { sessionKey: 'paymentAmount', unauthorized: 'Home' },
                        { sessionKey: 'paymentOrderNo', unauthorized: 'Home' },
                    ]
                }
            },
            // 门诊缴费 - 二级导航
            {
                path: 'outpatient-pay/sub-nav',
                name: 'OutpatientPaySubNav',
                redirect: { name: 'Settlement', params: { redirect: 'OutpatientPay' } }
            },
            // 门诊缴费
            {
                path: 'outpatient-pay',
                name: 'OutpatientPay',
                component: () => import('../views/outpatient-pay'),
                meta: {
                    auths: [
                        { sessionKey: 'patient', unauthorized: 'IdentificationMethods' },
                    ]
                }
            },
            // 住院业务 - 二级导航
            {
                path: 'inpatient/sub-nav',
                name: 'InpatientSubNav',
                redirect: { name: 'SubNav', params: { category: 'InpatientSubNav' } }
            },
            // 住院业务 - 输入住院号查询
            {
                path: 'inpatient/inpatient-no-typing',
                name: 'InpatientNoTyping',
                component: () => import('../views/inpatient/inpatient-no-typing'),
                meta: {
                    auths: [
                        { sessionKey: 'redirect', unauthorized: 'Home' },
                    ]
                }
            },
            // 确认住院信息
            {
                path: 'inpatient/info',
                name: 'InpatientInfo',
                component: () => import('../views/inpatient/info'),
                meta: {
                    auths: [
                        { sessionKey: 'redirect', unauthorized: 'Home' },
                        { sessionKey: 'patient', unauthorized: 'Home' }
                    ]
                }
            },
            // 住院业务 - 充值
            {
                path: 'inpatient/recharge',
                name: 'InpatientRecharge',
                component: () => import('../views/inpatient/recharge'),
                meta: {
                    auths: [
                        { sessionKey: 'patient', unauthorized: 'InpatientNoTyping' },
                    ]
                }
            },
            // 住院业务 - 住院费用清单
            {
                path: 'inpatient/invoice-list',
                name: 'InpatientInvoiceList',
                component: () => import('../views/inpatient/invoice-detail'),
                meta: {
                    auths: [
                        { sessionKey: 'patient', unauthorized: 'InpatientNoTyping' },
                    ]
                }
            },
            // 住院业务 - 住院一日清单
            {
                path: 'inpatient/invoice-detail',
                name: 'InpatientInvoiceDetail',
                component: () => import('../views/inpatient/invoice-detail'),
                meta: {
                    auths: [
                        { sessionKey: 'patient', unauthorized: 'InpatientNoTyping' },
                    ]
                },
                props: { isSingleDay: true }
            },
        ]
    },
]

const router = new VueRouter({
    routes
})

export default router
