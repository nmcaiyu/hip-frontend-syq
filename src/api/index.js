import request from '../utils/request'

// 获取token
export const authenticate = () => request({ method: 'get', url: '/device/device/getCurrDeviceByIP' })
// 获取自助机信息
export const getDeviceInfo = () => request({ method: 'get', url: '/device/device/getCurrDevice' })
// 首页导航列表
export const getPermittedNav = () => request({ method: 'get', url: '/device/device/menuList' })
// 自助机读取身份识别信息
// idType: 1 => 身份证, 2 => 社保卡, 3 => 就诊码, 4 => 健康码, 5 => 门诊号
// if (idType === 3) params = { mrId }
// if (idType === 4) params = { ehealthCode }
// if (idType === 5) params = { outPatientCode }
export const getPatient = (idType, params) => request({ method: 'get', url: `/patient/patient/getPatientByDevice/${idType}`, params })
// 查询当日挂号/预约挂号存在排班的两级就诊专业/科室列表
// bookType: 1 => 今日挂号, 2 => 预约挂号
export const getDepartments = bookType => request({ method: 'get', url: `/outpatient/dept/scheduleDeptList/${bookType}` })
// 按专业/科室编码查询有排班的医生列表
// data = { deptCode, bookType, isAll }
export const getDepartmentDoctors = data => request({ method: 'post', url: '/outpatient/doctor/scheduleStatByDept', data })
// 查询某医生排班信息
// data = { doctorCode, bookType, regDate }
export const getDoctorSchedule = data => request({ method: 'post', url: '/outpatient/doctor/scheduleByDoctorCode', data })
// 挂号锁号
// data = {
//     channel: 1, // 自助机
//     regType, // 1 => 今日挂号， 2 => 预约挂号
//     patientId, fullName, // session.patient
//     deptCode, deptName, // session.department
//     doctorCode, doctorName, // session.doctor
//     regId, regFee, treatFee, regDate, typeCode, typeName, // session.appointmentTimePeriod
//     appoTime, // session.appointmentTimePoint
//     phaseCode, // regType === 1 ? session.appointmentTimePeriod.phaseCode : session.appointmentTimePoint.beginEndTime
//     phaseDesc, // regType === 1 ? session.appointmentTimePeriod.phaseDesc : session.appointmentTimePoint.beginEndTime
// }
export const lockAppointment = data => request({ method: 'post', url: '/outpatient/register/lockReg', data })
// 预约信息查询
export const getAppointments = patientId => request({ method: 'get', url: '/outpatient/register/appoRegQuery', params: { patientId } })
// 预约登记后挂号锁号
// data = {
//     channel: 1, // 自助机
//     patientId, fullName, // session.patient
//     // 以下参数来自 getAppointments 接口
//     regType,
//     deptCode, deptName,
//     doctorCode, doctorName,
//     regId, totalFee, regDate, typeCode, typeName,
//     appoTime, appoSeq,
//     phaseCode, phaseDesc,
// }
export const lockPreAppointment = data => request({ method: 'post', url: '/outpatient/register/appoLockReg', data })
// 7天内的挂号信息查询
// params = {
//     patientId,
//     regType, // 3 => 当天 + 预约, 2 => 预约
// }
export const getLatestAppointments = params => request({ method: 'get', url: '/outpatient/register/recentRegisters', params })
// 用于自助机(1)补打挂号凭条和(2)预约取号 勾选须打印项后调取
// data = { printType, orderNums }
export const printAppointmentTickets = data => request({ method: 'post', url: '/outpatient/register/regByOrderNums', data })
// 分页查询已缴费单据所属的挂号序号列表
// params = { page, limit, patientId }
export const getOutpatientPaidBills = params => request({ method: 'get', url: '/outpatient/payBill/paidBillRegs', params })
// 分页查询待缴费单据所属的挂号序号列表
// params = { page, limit, patientId }
export const getOutpatientUnpaidBills = params => request({ method: 'get', url: '/outpatient/payBill/unpaidBillRegs', params })
// 根据 billId 查询缴费单据详情列表
export const getOutpatientBillInvoice = billId => request({ method: 'get', url: `/outpatient/payBill/payBillItems/${billId}` })
// 打印门诊缴费单据
// params = { orderNum, printType }
export const printOutpatientPaidBill = params => request({ method: 'get', url: '/outpatient/payBill/paidBillByOrderNum', params })
// 查询 HIS 近 30 天的门诊就诊已结算收费主信息
export const getSettledOutpatientBills = patientId => request({ method: 'get', url: '/outpatient/payBill/paidOrdersByWS', params: { patientId } })
// 打印门诊就诊已结算收费明细
// params = { patientId, hisOrderNum, isPrint }
export const printSettledOutpatientBill = params => request({ method: 'get', url: '/outpatient/payBill/paidOrderItemsByWS', params })
// 无卡用户查询 (身份证号查询)
export const getPatientByIdentityCardNo = idCardNum => request({ method: 'get', url: '/patient/patient/queryByIdCardNum', params: { idCardNum } })
// 按医生姓名首字母查询有排班的医生信息列表
// params = { bookType, initials }
// bookType: 1 => 今日挂号, 2 => 预约挂号
export const getDoctorsByNameInitials = params => request({ method: 'get', url: '/outpatient/doctor/queryDoctorsByInitials', params })
// 无卡建档
// data = { fullName, idCardNum, phone, sexCode, presentAddress }
export const registerPatient = data => request({ method: 'post', url: '/patient/patient/savePatient', data })
// 通过身份证号码 获取就诊人的籍贯 性别 出生日期等信息
export const getIdCardInfo = idCardNum => request({ method: 'get', url: '/patient/patient/getIdCardInfo', params: { idCardNum } })
// HIS药品与诊疗项目信息查询
// params = {
//     name, // 拼音首字母缩写
//     flag // 1 => 药品, 0 => 项目
// }
export const getItemPrice = params => request({ method: 'get', url: '/others/drugsAndItem/drugs', params })
// 根据 orderNum 查询挂号待支付信息
export const getPaymentOrder = orderNum => request({ method: 'get', url: '/outpatient/register/regByOrderNum', params: { orderNum } })
// 自助机扫码支付
// params = { merOrderNum, qrCode,
//     businessType, // 1 => 挂号缴费, 2 => 门诊缴费, 3 => 住院预缴费, 4 => 病例复印缴费
//     payType // 2 => 银行卡, 4 => 微信支付, 5 => 支付宝, 6 => 银联扫码支付
// }
export const qrCodeScanPay = params => request({ method: 'get', url: '/pay/devicePayCenter/orderScanPay', params })
// 支付状态查询
export const getPaymentStatus = merOrderNum => request({ method: 'get', url: '/pay/devicePayCenter/pollPay', params: { merOrderNum } })
// 自助机收银系统银行卡支付准备
// params = { merOrderNum, businessType, payType }
export const bankCardPayPrepare = params => request({ method: 'get', url: '/pay/devicePayCenter/preCardPay', params })
// 自助机收银系统银行卡支付获取键值
// params = { merOrderNum, businessType, payType }
export const getBankCardPayKeyCode = params => request({ method: 'get', url: '/pay/devicePayCenter/getOnePass', params })
// 自助机收银系统银行卡支付
// params = { merOrderNum, businessType, payType }
export const bankCardPay = params => request({ method: 'get', url: '/pay/devicePayCenter/cardPay', params })
// 选择多笔待缴费单据 生成一个支付订单
export const createOutpatientPayOrder = billNums => request({ method: 'post', url: '/outpatient/payBill/createPayOrder', data: { billNums } })
// 住院号查询患者信息
export const getInpatient = inpatientNo => request({ method: 'get', url: '/inpatient/inpatient/getByInpatientNum', params: { inpatientNum: inpatientNo } })
// 获取住院费用清单列表
// params = { inpatientNum, startDate, endDate }
export const getInpatientInvoiceList = params => request({ method: 'get', url: '/inpatient/inpatient/getInPatientFeeList', params })
// 获取住院费用清单详情
// params = { inpatientNum, startDate, endDate }
export const getInpatientInvoiceDetail = params => request({ method: 'get', url: '/inpatient/inpatient/getInPatientFeeList', params })
// 住院充值订单生成
// data = { inpatientNum, payAmt }
export const createInpatientRechargeOrder = data => request({ method: 'post', url: '/inpatient/payment/createPrePayment', data })
// 住院充值小票打印
// params = { outTradeNo, printType }
export const printInpatientRechargeReceipt = params => request({ method: 'get', url: '/inpatient/recharge/rechargeInfoPrint', params })
// 住院充值记录列表
export const getInpatientRechargeRecords = inpatientNum => request({ method: 'get', url: '/inpatient/recharge/queryListByInpatientNum', params: { inpatientNum } })
// 检验报告列表
export const getTestRecords = idCardNum => request({ method: 'post', url: '/print/inspectionReport/list', data: { idCardNum } })
// 检验报告打印
export const printTestReports = reportList => request({ method: 'post', url: '/print/inspectionReport/print', data: { reportList } })
// 新增医保 ActiveX 请求日志
// data = { remark, inputData }
export const medicalInsuranceRecordRequest = data => request({ method: 'post', url: '/healthcare', data })
// 更新医保 ActiveX 请求日志
// data = { logHealthcareId, outputData }
export const medicalInsuranceUpdateRequest = data => request({ method: 'put', url: '/healthcare', data })
// 医保卡状态轮询
export const medicalInsuranceCardPolling = () => request({ method: 'get', url: '/pay/devicePayCenter/checkCard' })
// 医保预结算
// data = { orderNum, businessType, medicareCardInfo, param }
export const medicalInsurancePreSettle = (data) => request({ method: 'post', url: '/pay/devicePayCenter/preSettlement', data })
// 医保结算
export const medicalInsuranceSettle = (orderNum, businessType) => request({ method: 'post', url: '/pay/devicePayCenter/settlement', data: { orderNum, businessType } })
// 医保卡余额
export const getPatientBalance = params => request({ method: 'get', url: '/pay/devicePayCenter/getPatientBalance', params })
// 医保卡读卡之后调用医保接口，根据身份证号查询患者信息
export const getPatientInfo = params => request({ method: 'get', url: '/pay/devicePayCenter/getPatientInfo', params })