<template>
	<div class="main-container flex-grow flex-column">
		<timer />
		<nav-caption :caption="paymentMethodConstantValue.label" />
		<section class="main-section flex-grow flex-column flex-align-center">
			<!-- <svg-icon
                class="large-icon"
                :icon-class="paymentMethodConstantValue.iconName"
                :style="{ color: paymentMethodConstantValue.iconColor }"
            /> -->
			<img :src="`${$publicPath}icons/${paymentMethodConstantValue.iconName}.png`">
			<div class="info-wrapper flex">
				<span>姓名: {{ session.patient.fullName }}</span>
				<span>金额: {{ paymentAmount | currency }} 元</span>
			</div>
			<span>请打开手机付款码，置于扫码区 <i class="el-icon-loading" /></span>
		</section>
		<nav-footer class="nav-footer" />
		<audio-tip v-if="paymentMethodConstantValue.audioName" :name="paymentMethodConstantValue.audioName" />
	</div>
</template>

<script>
import Timer from '@/layouts/components/Timer.vue';
import NavFooter from '@/layouts/components/NavFooter.vue';
import NavCaption from '@/layouts/components/NavCaption.vue';
import { mapState, mapMutations, mapActions } from 'vuex';
import { sleep, durationFrom } from '@/utils/helper';
import {
	qrCodeScanPay,
	printAppointmentTickets,
	getPaymentStatus,
	printOutpatientPaidBill,
	printInpatientRechargeReceipt,
} from '@/api';
import AudioTip from '@/components/AudioTip';

export default {
	components: {
		Timer,
		NavFooter,
		NavCaption,
		AudioTip,
	},
	data: () => ({
		validation: {
			WECHAT_PAY: {
				length: 18,
				startsWith: '13',
			},
			ALIPAY: {
				length: 18,
				startsWith: '28',
			},
			UNION_PAY: {
				length: 19,
				startsWith: '62',
			},
		},
		paymentAmount: 0,
		qrCode: null,
		paymentStatusCheckTimeout: 45,
		bankCardPayTimeout: 60,
		keyInput: '',
	}),
	computed: {
		...mapState({
			session: (state) => state.session,
			paymentMethodConstant: (state) => state.constant.paymentMethods,
			paymentBusinessTypeConstant: (state) =>
				state.constant.paymentBusinessType,
			settlementTypeConstant: (state) => state.constant.settlementType,
		}),
		paymentMethodConstantValue() {
			return this.paymentMethodConstant[this.session.paymentMethod];
		},
		businessTypeConstantValue() {
			return this.paymentBusinessTypeConstant[
				this.session.paymentBusinessType
			];
		},
		settlementTypeConstantValue() {
			if (this.session.settlementType === 'HEALTH_INSURANCE') {
				return 1;
			} else {
				return this.settlementTypeConstant[this.session.settlementType];
			}
		},
	},
	created() {
		this.initPaymentAmount();
		document.addEventListener('keydown', this.keydown);
	},
	watch: {
		qrCode(val) {
			if (val) {
				this.scanPay(val);
			}
		},
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
		initPaymentAmount() {
			if (this.session.settlementType === 'HEALTH_INSURANCE') {
				this.paymentAmount = this.session.selfPayAmount;
			} else {
				this.paymentAmount = this.session.paymentAmount;
			}
		},
		keydown(e) {
			const regExp = /[0-9]/;
			if (!this.qrCode && e.key.match(regExp)) {
				this.keyInput += e.key;
				const { length, startsWith } =
					this.validation[this.session.paymentMethod];
				if (
					this.keyInput.length === length &&
					this.keyInput.startsWith(startsWith)
				) {
					this.qrCode = this.keyInput;
				}
			}
		},
		async scanPay(val) {
			this.startLoading({ text: '正在支付' });
			await sleep(1);
			const params = {
				merOrderNum: this.session.paymentOrderNo,
				businessType: this.businessTypeConstantValue,
				payType: this.paymentMethodConstantValue.payType,
				qrCode: val,
				type: this.settlementTypeConstantValue,
			};
			qrCodeScanPay(params)
				.then((result) => {
					this.handlePayResult(result);
				})
				.catch((error) => {
					this.handleError(error);
				});
		},
		async handlePayResult(result) {
			this.stopLoading();
			if (
				result &&
				result.businessType !== -1 &&
				result.orderNum !== -1
			) {
				this.afterPaySucceed(result);
			} else {
				this.resetTimer(this.start).then(() => {
					this.startTimer();
				});
				this.paymentStatusPolling(result);
			}
		},
		async afterPaySucceed(result) {
			if (
				result.businessType ===
				this.paymentBusinessTypeConstant['APPOINTMENT']
			) {
				this.startLoading({ text: '支付成功，正在打印' });
				await sleep(1);
				const data = {
					printType: 1,
					orderNums: [result.orderNum],
				};
				printAppointmentTickets(data)
					.then((result) => {
						this.stopLoading();
						this.handlePrintResult(result);
					})
					.catch((error) => {
						this.handleError(error);
					});
			} else if (
				result.businessType ===
				this.paymentBusinessTypeConstant['OUTPATIENT']
			) {
				this.startLoading({ text: '支付成功，正在打印' });
				await sleep(1);
				const params = {
					orderNum: result.orderNum,
					printType: 1,
				};
				printOutpatientPaidBill(params)
					.then((result) => {
						this.stopLoading();
						this.handlePrintResult(result);
					})
					.catch((error) => {
						this.handleError(error);
					});
			} else if (
				result.businessType ===
				this.paymentBusinessTypeConstant['INPATIENT']
			) {
				this.startLoading({ text: '支付成功，正在打印' });
				await sleep(1);
				const params = {
					outTradeNo: result.orderNum,
					printType: 1,
				};
				printInpatientRechargeReceipt(params)
					.then((result) => {
						this.stopLoading();
						this.handlePrintResult(result);
					})
					.catch((error) => {
						this.handleError(error);
					});
			} else {
				const title = '支付成功';
				this.$router.push({
					name: 'Result',
					params: { icon: 'success', title },
				});
			}
		},
		async paymentStatusPolling(result) {
			this.startLoading({ text: '等待支付结果返回' });
			const startTime = new Date();
			let duration = 0;
			let status = false;
			let error = false;
			while (duration <= this.paymentStatusCheckTimeout) {
				await getPaymentStatus(this.session.paymentOrderNo)
					.then((result) => {
						if (result.status === 1) status = true;
						if (result.status === 2) error = true;
					})
					.catch((err) => {
						error = true;
					});
				if (status || error) break;
				await sleep(1);
				duration = durationFrom(startTime);
			}
			this.stopLoading();
			if (status) {
				const res = {
					businessType: this.businessTypeConstantValue,
					orderNum: this.session.paymentOrderNo,
				};
				this.afterPaySucceed(res);
			} else {
				const title = '支付失败';
				const subTitle = result && result.remarks ? result.remarks : '';
				this.$router.push({
					name: 'Result',
					params: { icon: 'error', title, subTitle },
				});
			}
		},
		handleError(error) {
			if (error.code && error.code === 1) {
				this.$alert(error.msg, '提示', {
					confirmButtonText: '确定',
					showClose: false,
				}).then(() => {
					this.$router.push({ name: 'Home' }).catch((err) => err);
				});
			}
		},
		handlePrintResult(result) {
			const title = '支付成功';
			if (result && result.printCode === '1') {
				const subTitle = '正在打印中，请不要走开';
				this.$router.push({
						name: 'Result',
						params: { icon: 'success', title, subTitle },
					})
					.catch((err) => err);
			} else if (!result || result.printCode === '2') {
				const subTitle = '打印失败，请联系工作人员';
				if (result.printMsg) console.error('===', result.printMsg);
				this.$router
					.push({
						name: 'Result',
						params: { icon: 'warning', title, subTitle },
					})
					.catch((err) => err);
			}
		},
	},
	destroyed() {
		this.stopLoading();
		document.removeEventListener('keydown', this.keydown);
	},
};
</script>

<style lang="scss" scoped>
.main-section {
	span {
		font-size: 30px;
	}
}
// .large-icon {
//     font-size: 400px;
//     color: #666;
// }
img {
	width: 400px;
}
.info-wrapper {
	column-gap: 50px;
	padding-bottom: 20px;
}
.password-wrapper {
	padding-top: 20px;
	column-gap: 20px;
}
.password-input {
	width: 200px;
}
</style>
