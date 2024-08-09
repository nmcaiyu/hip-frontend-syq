const state = {
    // 首页导航映射
    nav: {
        'AppointmentTodaySubNav': {
            label: '今日挂号',
            iconName: 'file-check-fill',
            backgroundColor: '#43E7C7',
            mongolianWords: ['ᠥᠨᠥᠳᠥᠷ ', ' ᠳ᠋ᠤᠭᠠᠷᠯᠠᠬᠤ ']
        },
        // 'AppointmentSubNav': {
        //     label: '预约挂号',
        //     iconName: 'calendar-clock-fill',
        //     backgroundColor: '#FD891D',
        //     mongolianWords: ['ᠤᠷᠢᠳᠴᠢᠯᠠᠨ', 'ᠳ᠋ᠤᠭᠠᠷᠯᠠᠬᠤ']
        // },
        // 'AppointmentCheck': {
        //     label: '预约取号',
        //     iconName: 'calendar-check-fill',
        //     backgroundColor: '#7D8BFA',
        //     mongolianWords: ['ᠪᠣᠯᠵᠣᠭᠰᠠᠨ', 'ᠨᠣᠮᠧᠷ', 'ᠠᠪᠬᠤ']
        // },
        'OutpatientPaySubNav': {
            label: '门诊缴费',
            iconName: 'bank-card-fill',
            backgroundColor: '#F17986',
            mongolianWords: ['ᠡᠬᠦᠳᠡᠨ  ', 'ᠡᠮᠨᠡᠯᠭᠡ ', '᠎ᠶ᠋ᠢᠨ ', 'ᠰᠦᠢᠳᠬᠡᠯ ', 'ᠲᠤᠰᠢᠶᠠᠬᠤ']
        },
        'PrintSubNav': {
            label: '打印服务',
            iconName: 'printer-fill',
            backgroundColor: '#32C2F7',
            mongolianWords: ['ᠳᠠᠷᠤᠮᠯᠠᠬᠤ', 'ᠦᠢᠯᠡᠴᠢᠯᠡᠭᠡ']
        },
        'ItemPrice': {
            label: '价格查询',
            iconName: 'price-fill',
            backgroundColor: '#FDD012',
            mongolianWords: ['ᠡᠮ  ‍ᠦᠨ ', 'ᠦᠨ᠎ᠡ ᠎ᠶ᠋ᠢ ', 'ᠪᠠᠢᠢᠴᠠᠭᠠᠨ', 'ᠠᠰᠠᠭᠤᠬᠤ ']
        },
        'InpatientSubNav': {
            label: '住院业务',
            iconName: 'hospital-building',
            backgroundColor: '#A079FD',
            mongolianWords: ['ᠡᠮᠨᠡᠯᠭᠡ ', '᠎ᠳ᠋ᠦ᠍ ', 'ᠰᠠᠭᠤᠬᠤ ', 'ᠦᠢᠯᠡᠴᠢᠯᠡᠭᠡ']
        },
        // 'Colors': [
        //     '#43E7C7',
        //     '#FD891D',
        //     '#7D8BFA',
        //     '#F17986',
        //     '#32C2F7',
        //     '#FDD012',
        //     '#A079FD',
        //     '#FF9E46',
        //     '#4F84F5',
        // ]
    },
    // 二级导航映射
    subNav: {
        // 预约挂号
        'AppointmentSubNav': [
            {
                label: '按科室挂号',
                iconName: 'department-fill',
                backgroundColor: '#4F84F5',
                routeName: 'AppointmentViaDepartments'
            },
            // {
            //     label: '按医生姓名',
            //     iconName: 'doctor',
            //     backgroundColor: '#32C2F7',
            //     routeName: 'AppointmentDoctorsByNameInitials'
            // },
        ],
        // 今日挂号
        'AppointmentTodaySubNav': [
            {
                label: '按科室挂号',
                iconName: 'department-fill',
                backgroundColor: '#4F84F5',
                routeName: 'AppointmentTodayViaDepartments'
            },
            // {
            //     label: '按医生姓名',
            //     iconName: 'doctor',
            //     backgroundColor: '#32C2F7',
            //     routeName: 'AppointmentTodayDoctorsByNameInitials'
            // },
        ],
        // 打印服务
        'PrintSubNav': [
            {
                label: '检验报告打印',
                iconName: 'printer-fill',
                backgroundColor: '#32C2F7',
                routeName: 'PrintTestReport'
            },
            {
                label: '补打挂号凭条',
                iconName: 'printer-fill',
                backgroundColor: '#4F84F5',
                routeName: 'PrintAppointmentTicket'
            },
            {
                label: '补打门诊缴费凭条',
                iconName: 'printer-fill',
                backgroundColor: '#32C2F7',
                routeName: 'PrintOutpatientReceipt'
            },
            // {
            //     label: '门诊明细打印',
            //     iconName: 'printer-fill',
            //     backgroundColor: '#7D8BFA',
            //     routeName: 'PrintOutpatientInvoice'
            // },
            {
                label: '补打住院充值凭条',
                iconName: 'printer-fill',
                backgroundColor: '#4F84F5',
                routeName: 'InpatientRechargeRecords'
            },
        ],
        // 住院业务
        'InpatientSubNav': [
            {
                label: '住院充值',
                iconName: 'price-fill',
                backgroundColor: '#4F84F5',
                routeName: 'InpatientRecharge'
            },
            // {
            //     label: '住院一日清单',
            //     iconName: 'medical-list',
            //     backgroundColor: '#32C2F7',
            //     routeName: 'InpatientInvoiceDetail'
            // },
            {
                label: '住院费用清单',
                iconName: 'medical-list',
                backgroundColor: '#7D8BFA',
                routeName: 'InpatientInvoiceList'
            }
        ]
    },
    // 身份识别方式映射
    identificationMethods: {
        'IDENTITY_CARD': {
            label: '居民身份证',
            imgSrc: require('@/assets/identity/identity-card.png'),
            idType: 1,
            audioName: 'place-identity-card'
        },
        'SOCIAL_SECURITY_CARD': {
            label: '社保卡',
            imgSrc: require('@/assets/identity/social-security-card.png'),
            idType: 2,
            audioName: 'insert-social-security-card'
        },
        'MEDICAL_RECORD_NO': {
            label: '就诊码',
            imgSrc: require('@/assets/identity/barcode.png'),
            idType: 3,
            audioName: 'show-medical-record-no'
        },
        // 'HEALTH_RECORD_CODE': {
        //     label: 'ID号',
        //     imgSrc: require('@/assets/identity/barcode.png'),
        //     idType: 4,
        //     audioName: 'show-health-record-code'
        // },
        'OUTPATIENT_NO': {
            label: 'ID号',  // 2023-12-27与周飞协商之后暂时修改为ID号
            imgSrc: require('@/assets/identity/barcode.png'),
            idType: 4,   // 2023-12-27与周飞协商之后暂时修改为4
            audioName: 'show-outpatient-no'
        },
        // 'IDENTITY_CARD_NO_TYPING': {
        //     label: '无卡用户',
        //     imgSrc: require('@/assets/identity/keyboard.png'),
        //     audioName: 'type-identity-card-no'
        // },
        'ETC_SOCIAL_SECURITY_CARD': {
            label: '电子医保码',
            imgSrc: require('@/assets/identity/barcode.png'),
            idType: 2,   // 2023-12-27与周飞协商之后暂时修改为4
            audioName: 'show-outpatient-no'
        },
    },
    // 科室图标映射
    departmentIcon: {
        '骨': 'medicine-bone',
        '胸': 'medicine-chest',
        '儿': 'medicine-child',
        '血液': 'medicine-droplet',
        '耳': 'medicine-ear',
        '眼': 'medicine-eye',
        '感染': 'medicine-germ',
        '整形': 'medicine-head',
        '血管': 'medicine-heart',
        '肝': 'medicine-liver',
        '呼吸': 'medicine-lung',
        '神经': 'medicine-nerve',
        '尿': 'medicine-pee',
        '中医': 'medicine-pestle-mortar',
        '中西': 'medicine-pestle-mortar',
        '产': 'medicine-pregnancy',
        '康复': 'medicine-rehabilitation',
        '急诊外科': 'medicine-scissors',
        '胃': 'medicine-stomach',
        '麻醉': 'medicine-syringe',
        '肿瘤': 'medicine-tumor',
    },
    weekdays: [ '日', '一', '二', '三', '四', '五', '六' ],
    // 支付方式
    paymentMethods: {
        // 'BANK_CARD': {
        //     label: '银行卡支付',
        //     iconName: 'insert-card',
        //     iconColor: '#00508E',
        //     payType: 2,
        //     audioName: 'insert-bank-card'
        // },
        'WECHAT_PAY': {
            label: '微信支付',
            iconName: 'wechat-pay',
            iconColor: '#09BB07',
            payType: 4,
            audioName: 'show-wechat-pay-qrcode'
        },
        'ALIPAY': {
            label: '支付宝支付',
            iconName: 'alipay-circle-fill',
            iconColor: '#009FE9',
            payType: 5,
            audioName: 'show-alipay-qrcode'
        },
        // 'UNION_PAY': {
        //     label: '银联二维码支付',
        //     iconName: 'union-pay',
        //     iconColor: '#000',
        //     payType: 6,
        //     audioName: 'show-union-pay-qrcode'
        // },
    },
    // 支付业务类型
    paymentBusinessType: {
        'APPOINTMENT': 1, // 挂号缴费
        'OUTPATIENT': 2, // 门诊缴费
        'INPATIENT': 3, // 住院预缴费
        'MEDICAL_RECORD_COPY': 4 // 病历复印缴费
    },
    settlementMethods: {
        'SELF_PAY': {
            label: '自费',
            iconName: 'bank-card-fill',
            backgroundColor: '#4F84F5',
        },
        'HEALTH_INSURANCE': {
            label: '医保',
            iconName: 'health-insurance-card',
            backgroundColor: '#32C2F7',
        },
        'ETC_HEALTH_INSURANCE': {
            label: '电子医保',
            iconName: 'health-insurance-card',
            backgroundColor: '#32C2F7',
        },
    },
    // 结算类型
    settlementType: {
        'HEALTH_INSURANCE': 1,
        'SELF_PAY': 2,
        'ETC_HEALTH_INSURANCE': 3,
    },
}

export default {
    namespaced: true,
    state,
}

