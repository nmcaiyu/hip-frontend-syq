<template>
	<div class="identification-reading main-container flex-grow flex-column">
		<timer />
		<nav-caption v-if="identificationMethod" :caption="`读取${identificationMethod.label}`" />
		<section class="main-section flex-grow flex-column flex-align-center">
			<object :classid="classId" ref="activexObj" class="hidden-input" />
			<template v-if="identificationMethod">
				<span>请将{{ identificationMethod.label }}放置指定处进行扫描</span>
				<span v-if="methodName === 'OUTPATIENT_NO'">或在下方小键盘输入</span>
				<div class="identity-example flex flex-justify-center flex-align-center">
					<img :src="identificationMethod.imgSrc" />
					<div class="top-left"></div>
					<div class="top-right"></div>
					<div class="bottom-left"></div>
					<div class="bottom-right"></div>
					<el-input v-if="methodName === 'OUTPATIENT_NO'" ref="visibleInput" class="visibleInput" v-model="keyInput" :placeholder="identificationMethod.label" @focus="autoBlur" />
				</div>
				<span>正在读取{{ identificationMethod.label }}信息，请稍后 <i class="el-icon-loading" /></span>
			</template>
		</section>
		<nav-footer class="nav-footer" />
		<audio-tip v-if="identificationMethod.audioName" :name="identificationMethod.audioName" />
	</div>
</template>

<script>
import Timer from '@/layouts/components/Timer.vue';
import NavFooter from '@/layouts/components/NavFooter.vue';
import NavCaption from '@/layouts/components/NavCaption.vue';
import { mapState, mapMutations, mapActions } from 'vuex';
import { getPatient } from '@/api';
import { sleep } from '@/utils/helper';
import AudioTip from '@/components/AudioTip';
import {
	medicalInsuranceUpdateRequest,
	getDeviceInfo,
	getPatientInfo,
} from '@/api';

// 读卡
import activex from '@/utils/activex';
export default {
	components: {
		Timer,
		NavFooter,
		NavCaption,
		AudioTip,
	},
	data() {
		return {
			classId: 'clsid:1B6A233A-C5B0-4FB2-A36C-E4041434A866',
			methodName: null,
			identificationMethod: null,
			qrCode: null,
			validation: {
				MEDICAL_RECORD_NO: {
					length: 18,
				},
				OUTPATIENT_NO: {
					length: 10,
				},
			},
			keyInput: '',
			cardInfoRaw: null,
			activexResp: null,
			logId: null,
			deviceInfo: {},
		};
	},
	computed: {
		...mapState({
			identificationMethods: (state) =>
				state.constant.identificationMethods,
			session: (state) => state.session,
		}),
	},
	watch: {
		qrCode(val) {
			if (val) {
				this.startLoading({ text: '正在获取信息' });
				this.fetchData(val);
			}
		},
		activexResp(resp) {
			if (resp) this.stopLoading();
			if (resp && this.logId) {
				const data = {
					logHealthcareId: this.logId,
					outputData: resp,
				};
				medicalInsuranceUpdateRequest(data)
					.then((resp) => {})
					.catch((error) => {
						this.handleError(error);
					});
			}
		},
	},
	created() {
		this.methodName = this.$route.params.method;
		this.identificationMethod = this.identificationMethods[this.methodName];
		if (!this.identificationMethod) {
			this.$router.replace({ name: 'Home' }).catch((err) => err);
		}
		getDeviceInfo().then((resp) => {
			this.deviceInfo = resp;
		});
	},
	mounted() {
		if (
			this.methodName === 'IDENTITY_CARD' ||
			this.methodName === 'SOCIAL_SECURITY_CARD'
		) {
			this.fetchData();
		} else {
			document.addEventListener('keydown', this.keydown);
		}
	},
	methods: {
		...mapMutations({
			setSession: 'session/set',
		}),
		...mapActions({
			startLoading: 'session/startLoading',
			stopLoading: 'session/stopLoading',
		}),
		keydown(e) {
			const regExp = /^[0-9xX]*$/;
			if (!this.qrCode && e.key.match(regExp)) {
				this.keyInput += e.key;
				const { length } = this.validation[this.methodName];
				if (this.keyInput.length === length) {
					this.qrCode = this.keyInput;
				}
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
			this.activexResp = obj.getcardinfo();
		},
		fetchData(val = null) {
			const { idType } = this.identificationMethod;
			const params = {};
			let infoList = [];
			if (this.methodName === 'SOCIAL_SECURITY_CARD') {
				this.startLoading({ text: '正在获取信息' });
				// 读卡
				this.invokeActiveX();
				this.cardInfoRaw = this.handleActiveXResp(this.activexResp);
				if (!this.cardInfoRaw) return false;
				infoList = this.cardInfoRaw.split('$')[0].split('|');
				params.idNum = infoList[1];
			} else if (this.methodName === 'MEDICAL_RECORD_NO') {
				params.mrId = val;
			} else if (this.methodName === 'OUTPATIENT_NO') {
				params.ehealthCode = val;
			}
			getPatient(idType, params)
				.then((result) => {
					this.stopLoading();
					this.handleResult(result);
				})
				.catch((error) => {
					if (error.code && error.code === 1) {
						this.$alert(error.msg, '提示', {
							confirmButtonText: '确定',
							showClose: false,
						}).then(() => {
							this.$router
								.push({ name: 'Home' })
								.catch((err) => err);
						});
					}
				});
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
		handleResult(result) {
			if (
				this.methodName === 'IDENTITY_CARD' ||
				this.methodName === 'SOCIAL_SECURITY_CARD'
			) {
				this.startLoading({ text: '正在获取信息' });
			}
			sleep(1);
			this.stopLoading();
			if (result && result.patientId) {
				this.setSession(['patient', result]);
				this.$router
					.push({
						name: 'IdentificationInfo',
						params: { methodName: this.methodName },
					})
					.catch((err) => err);
			} else {
				if (this.methodName === 'IDENTITY_CARD') {
					const routeParams = { name: 'IdentificationRegister' };
					if (result) result.methodName = this.methodName;
					routeParams.params = result;
					this.$router.push(routeParams).catch((err) => err);
				} else if (this.methodName === 'SOCIAL_SECURITY_CARD') {
					let routeParams = { name: 'IdentificationRegister' };
					let infoList = this.cardInfoRaw.split('$')[0].split('|');
					let params = {
						idCardNum: infoList[1],
						fullName: infoList[4],
						presentAddress: '',
						nationCode: '',
						birthday: `${infoList[1].substr(
							6,
							4
						)}-${infoList[1].substr(10, 2)}-${infoList[1].substr(
							12,
							2
						)}`,
					};
					getPatientInfo({
						patientName: infoList[4],
						idNum: infoList[1],
					}).then((d) => {
						params.nationCode = d.Nation;
					});
					routeParams.params = params;
					this.$router.push(routeParams).catch((err) => err);
				} else {
					this.$alert('未查到患者信息，请使用身份证识别', '提示', {
						confirmButtonText: '确定',
						showClose: false,
					}).then(() => {
						this.$router.push({ name: 'Home' }).catch((err) => err);
					});
				}
			}
		},
		autoBlur() {
			this.$refs.visibleInput.blur();
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
		font-size: 28px;
		color: #2b2b2b;
	}
}
.identity-example {
	margin-top: 20px;
	margin-bottom: 30px;
	position: relative;
	width: 840px;
	height: 400px;
	img {
		width: 600px;
	}
	.top-left {
		position: absolute;
		top: 0;
		left: 0;
		width: 160px;
		height: 100px;
		border-top: 15px solid #dedede;
		border-left: 15px solid #dedede;
	}
	.top-right {
		position: absolute;
		top: 0;
		right: 0;
		width: 160px;
		height: 100px;
		border-top: 15px solid #dedede;
		border-right: 15px solid #dedede;
	}
	.bottom-left {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 160px;
		height: 100px;
		border-bottom: 15px solid #dedede;
		border-left: 15px solid #dedede;
	}
	.bottom-right {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 160px;
		height: 100px;
		border-bottom: 15px solid #dedede;
		border-right: 15px solid #dedede;
	}
	.visibleInput {
		position: absolute;
		top: 20px;
		left: 292px;
		width: 256px;
		font-size: 24px;
	}
}
</style>
