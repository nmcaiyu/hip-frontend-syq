<template>
	<div class="main-container flex-grow flex-column">
		<timer />
		<nav-caption caption="医保结算" />
		<section class="main-section flex-grow flex-column flex-align-stretch">
			<object :classid="classId" ref="activexObj" class="hidden-input" />
			<div class="flex-column flex-align-center">
				<template v-if="step === 'AUTH'">
					<img :src="`${$publicPath}icons/health-insurance-card-colorful.png`">
					<span>请插入医保卡 <i class="el-icon-loading" /></span>
				</template>
				<div v-if="step === 'PRE_SETTLE'" class="info-container
                    flex-column
                    flex-align-stretch">
					<el-card>
						<el-descriptions :column="1" label-class-name="el-descriptions-label-content" content-class-name="el-descriptions-label-content" border>
							<el-descriptions-item v-for="(item, i) in infoList" :key="i" :label="item.label">
								{{ item.value }}
							</el-descriptions-item>
						</el-descriptions>
					</el-card>
					<button class="confirm-button" @click="confirmInfo" :disabled="isLoading">确认</button>
				</div>
			</div>
			<template v-if="step === 'SETTLE'">
				<el-table ref="table" :data="tableList" class="table" height="450">
					<el-table-column label="处方号" prop="prescriptionNo" />
					<el-table-column label="总费用(元)" prop="totalFee" />
					<el-table-column label="统筹费用" prop="coverageFee" />
					<el-table-column label="个人账户支付" prop="accountFee" />
					<el-table-column label="现金支付" prop="selfPayFee" />
				</el-table>
				<button class="settle-button" @click="confirmSettle">确认</button>
			</template>
		</section>
		<nav-footer class="nav-footer" />
		<audio-tip name="insert-health-insurance-card" />
	</div>
</template>

<script>
import Timer from '@/layouts/components/Timer.vue';
import NavFooter from '@/layouts/components/NavFooter.vue';
import NavCaption from '@/layouts/components/NavCaption.vue';
import { mapState, mapMutations, mapActions } from 'vuex';
import { sleep, durationFrom } from '@/utils/helper';
import {
	medicalInsuranceRecordRequest,
	medicalInsuranceUpdateRequest,
	medicalInsurancePreSettle,
	medicalInsuranceSettle,
	printAppointmentTickets,
	printOutpatientPaidBill,
	medicalInsuranceCardPolling,
	getDeviceInfo,
	getPatientBalance,
} from '@/api';
import AudioTip from '@/components/AudioTip';
import currency from 'currency.js';

// ddd
import activex from '@/utils/activex';

export default {
	components: {
		Timer,
		NavFooter,
		NavCaption,
		AudioTip,
	},
	data: () => ({
		classId: 'clsid:1B6A233A-C5B0-4FB2-A36C-E4041434A866',
		medicalInsuranceCardTimeout: 30,
		cardInfoRaw: null,
		step: 'AUTH',
		infoList: [],
		tableList: [],
		preSettlementDataRaw: null,
		settlementDataRaw: null,
		activexResp: null,
		logId: null,
		deviceInfo: {},
		isLoading: false,
	}),
	computed: {
		...mapState({
			session: (state) => state.session,
			paymentBusinessTypeConstant: (state) =>
				state.constant.paymentBusinessType,
		}),
		paymentBusinessTypeConstantValue() {
			return this.paymentBusinessTypeConstant[
				this.session.paymentBusinessType
			];
		},
	},
	watch: {
		activexResp(resp) {
			if (resp) this.stopLoading();
			if (resp && this.logId) {
				const data = {
					logHealthcareId: this.logId,
					outputData: resp,
				};
				medicalInsuranceUpdateRequest(data)
					.then((resp) => {
					})
					.catch((error) => {
						this.handleError(error);
					});
			}
		},
	},
	created() {
		getDeviceInfo().then((resp) => {
			this.deviceInfo = resp;
		});
	},
	mounted() {
		// this.medicalInsuranceCardPolling()
		this.authenticate();
	},
	methods: {
		...mapMutations({
			setSession: 'session/set',
		}),
		...mapActions({
			startLoading: 'session/startLoading',
			stopLoading: 'session/stopLoading',
			resetTimer: 'session/resetTimer',
			startTimer: 'session/startTimer',
		}),
		handleError(error) {
			if (error.code && error.code === 1) {
				this.$alert(error.msg, '提示', {
					confirmButtonText: '返回主页',
					showClose: false,
				}).then(() => {
					this.$router.push({ name: 'Home' }).catch((err) => err);
				});
			}
		},
		invokeActiveX() {
			let obj = null;
			if (process.env.NODE_ENV === 'production') {
				obj = this.$refs.activexObj;
			} else {
				obj = activex[this.session.paymentBusinessType];
			}
			const { deviceNum } = this.deviceInfo;
			// const data = {
			// 	remark: 'getcardinfo',
			// 	inputData: `0,${deviceNum}`,
			// };
			// medicalInsuranceRecordRequest(data)
			// 	.then((resp) => {
			// 		this.logId = resp.logHealthcareId;
			// 	})
			// 	.catch((error) => {
			// 		this.handleError(error);
			// 	});
			this.activexResp = obj.getcardinfo();
		},
		handleActiveXResp(resp) {
			let ret = null;
			const error = { code: 1 };
			if (resp) {
				const [code, data] = resp.split('@');
				if (code === '0') {
					ret = data;
				} else {
					error.msg = data;
					this.handleError(error);
				}
			} else {
				error.msg = '获取信息失败';
				this.handleError(error);
			}
			return ret;
		},
		authenticate() {
			this.startLoading({ text: '正在获取信息' });
			// 读卡
			this.invokeActiveX();
			this.cardInfoRaw = this.handleActiveXResp(this.activexResp);
			if (!this.cardInfoRaw) return false;
			const infoList = this.cardInfoRaw.split('$')[0].split('|');
			this.getBalance(infoList[4], infoList[1]).then((d) => {
				this.infoList = [
					{ label: '姓名', value: infoList[4] },
					{ label: '证件号码', value: infoList[1] },
					{
						label: '出生日期',
						value: `${infoList[1].substr(6, 4)}/${infoList[1].substr(
							10,
							2
						)}/${infoList[1].substr(12, 2)}`,
					},
					{
						label: '账户余额',
						value: d,
					},
				];
				this.stopLoading();
				this.step = 'PRE_SETTLE';
			});
		},
		getBalance(patientName, idNum) {
			return new Promise((r) => {
				getPatientBalance({
					patientName,
					idNum,
				}).then((d) => {
					r(d);
				});
			});
		},
		preSettle() {
			if (this.isLoading) return;
			this.isLoading = true;

			this.startLoading({ text: '正在预结算' });
			// let initArgs = null;
			// 获取预结算参数
			// console.log(this.session.paymentBusinessType);
			// if (this.session.paymentBusinessType === 'APPOINTMENT') {
			//     console.log(this.session,this.session.doctor,this.session.doctor.param);
			// 	initArgs = this.session.doctor.param;
			// } else if (this.session.paymentBusinessType === 'OUTPATIENT') {
			// 	initArgs = this.session.settlementData;
			// }
			// if (!initArgs) {
			// 	this.stopLoading();
			// 	const error = { code: 1, msg: '无效的预结算参数' };
			// 	this.handleError(error);
			// 	return false;
			// }
			const { paymentOrderNo } = this.session;
			const infoList = this.cardInfoRaw.split('$')[0].split('|');
			const postData = {
				orderNum: paymentOrderNo,
				businessType: this.paymentBusinessTypeConstantValue,
				medicareCardInfo: infoList[1],
			};
			medicalInsurancePreSettle(postData)
				.then((respData) => {
					const item = respData;
					this.tableList.push({
						prescriptionNo: item.number,
						totalFee: item.sum,
						coverageFee: item.socialPay,
						accountFee: item.medicarePay,
						selfPayFee: item.cashPay,
					});
					const selfPayFeeTotal = this.tableList
						.map((i) => i.selfPayFee)
						.reduce((prev, curr) => prev.add(curr), currency(0));
					this.setSession(['selfPayAmount', selfPayFeeTotal.value]);

					this.step = 'SETTLE';
					this.stopLoading();
				})
				.catch((error) => {
					this.stopLoading();
					this.handleError(error);
				}).finally(() => {
					this.isLoading = false; // 请求结束后解除按钮禁用状态
				});
		},
		settle() {
			this.startLoading({ text: '正在结算' });
			let apiResp = null;
			// 结算
			apiResp = null;
			const { paymentOrderNo } = this.session;
			// await medicalInsuranceSettle(
			// 	paymentOrderNo,
			// 	this.paymentBusinessTypeConstantValue
			// )
			// 	.then(() => {
			// 		apiResp = true;
			// 	})
			// 	.catch((error) => {
			// 		this.stopLoading();
			// 		this.handleError(error);
			// 	});
			// if (!apiResp) {
			// 	this.stopLoading();
			// 	return false;
			// }
			this.stopLoading();
			if (this.session.selfPayAmount > 0) {
				let params = {
					icon: 'success',
					title: '医保结算成功',
				};
				params.subTitle = '继续现金支付';
				params.buttonText = '下一步';
				params.redirect = 'PaymentMethods';
				this.$router.push({
					name: 'Result',
					params,
				});
			} else {
				this.printReceipt(paymentOrderNo);
			}
		},
		printReceipt(orderNo) {
			if (this.session.paymentBusinessType === 'APPOINTMENT') {
				this.startLoading({ text: '结算成功，正在打印' });
				const data = {
					printType: 1,
					orderNums: [orderNo],
				};
				printAppointmentTickets(data)
					.then((resp) => {
						this.stopLoading();
						this.handlePrintResult(resp);
					})
					.catch((error) => {
						this.handleError(error);
					});
			} else if (this.session.paymentBusinessType === 'OUTPATIENT') {
				this.startLoading({ text: '结算成功，正在打印' });
				const params = {
					orderNum: orderNo,
					printType: 1,
				};
				printOutpatientPaidBill(params)
					.then((resp) => {
						this.stopLoading();
						this.handlePrintResult(resp);
					})
					.catch((error) => {
						this.handleError(error);
					});
			} else {
				const title = '结算成功';
				this.$router
					.push({
						name: 'Result',
						params: { icon: 'success', title },
					})
					.catch((err) => err);
			}
		},
		handlePrintResult(resp) {
			const title = '结算成功';
			if (resp && resp.printCode === '1') {
				const subTitle = '打印成功';
				this.$router
					.push({
						name: 'Result',
						params: { icon: 'success', title, subTitle },
					})
					.catch((err) => err);
			} else if (!resp || resp.printCode === '2') {
				const subTitle = '打印失败';
				if (resp.printMsg) console.error('===', resp.printMsg);
				this.$router
					.push({
						name: 'Result',
						params: { icon: 'warning', title, subTitle },
					})
					.catch((err) => err);
			}
		},
		confirmInfo() {
			if (this.step === 'PRE_SETTLE') {
				this.preSettle();
			}
		},
		confirmSettle() {
			if (this.step === 'SETTLE') {
				this.settle();
			}
		},
		medicalInsuranceCardPolling() {
			const startTime = new Date();
			let duration = 0;
			let succeed = true;
			while (duration <= this.medicalInsuranceCardTimeout) {
				medicalInsuranceCardPolling()
					.then(() => {
						succeed = true;
					})
					.catch((err) => err);
				if (duration > 2) succeed = true;

				if (succeed) break;


				duration = durationFrom(startTime);
			}
			if (succeed) {
				this.authenticate();
			} else {
				const title = '未识别到医保卡';
				this.$router.push({
					name: 'Result',
					params: { icon: 'error', title },
				});
			}
		},
	},
	destroyed() {
		this.stopLoading();
	},
};
</script>

<style lang="scss" scoped>
.main-section {
	span {
		font-size: 30px;
	}
}
img {
	width: 400px;
}
.info-container {
	width: 840px;
	display: flex;
	flex-direction: column;
	align-items: stretch;
}
.settle-button {
	border: none;
	border-radius: 10px;
	background-color: #3a8fff;
	color: #ffffff;
	padding: 20px 20px;
	cursor: pointer;
	font-size: 35px;
	margin-bottom: 30px;
}
</style>
