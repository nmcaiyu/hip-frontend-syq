<template>
	<div class="appointment-confirmation main-container flex-grow flex-column">
		<timer />
		<nav-caption caption="挂号信息确认" />
		<section class="main-section flex-grow flex-column flex-align-center">
			<div class="info-container flex-column flex-align-stretch">
				<el-card>
					<el-descriptions :column="1" label-class-name="el-descriptions-label-content" content-class-name="el-descriptions-label-content" border>
						<el-descriptions-item label="患者姓名">{{ session.patient.fullName }}</el-descriptions-item>
						<el-descriptions-item label="挂号科室">{{ session.department.deptName }}</el-descriptions-item>
						<el-descriptions-item label="挂号医生">{{ session.doctor.doctorName }}</el-descriptions-item>
						<el-descriptions-item label="就诊日期">{{ session.appointmentTimePeriod.regDate }}</el-descriptions-item>
						<el-descriptions-item label="就诊时段">{{ session.appointmentTimePeriod.phaseDesc }}</el-descriptions-item>
						<el-descriptions-item label="挂号费">{{ session.appointmentTimePeriod.regFee | currency }}</el-descriptions-item>
						<el-descriptions-item label="诊疗费">{{ session.appointmentTimePeriod.treatFee | currency }}</el-descriptions-item>
						<el-descriptions-item label="总费用">{{ session.appointmentTimePeriod.totalFee | currency }}</el-descriptions-item>
					</el-descriptions>
				</el-card>
				<button class="confirm-button" @click="confirm">确认挂号</button>
			</div>
		</section>
		<nav-footer class="nav-footer" />
		<audio-tip name="confirm-appointment-info" />
	</div>
</template>

<script>
import Timer from '@/layouts/components/Timer.vue';
import NavFooter from '@/layouts/components/NavFooter.vue';
import NavCaption from '@/layouts/components/NavCaption.vue';
import { mapState, mapMutations, mapActions } from 'vuex';
import { lockAppointment } from '@/api';
import { getDate, formatDate } from '@/utils/helper';
import AudioTip from '@/components/AudioTip';
import { sleep } from '@/utils/helper';

export default {
	components: {
		Timer,
		NavFooter,
		NavCaption,
		AudioTip,
	},
	computed: {
		...mapState({
			session: 'session',
		}),
	},
	methods: {
		...mapMutations({
			setSession: 'session/set',
		}),
		...mapActions({
			startLoading: 'session/startLoading',
			stopLoading: 'session/stopLoading',
		}),
		confirm() {
			const regType =
				formatDate(getDate()) ===
				this.session.appointmentTimePeriod.regDate
					? 1
					: 2;
			const { patientId, fullName } = this.session.patient;
			const { deptCode, deptName } = this.session.department;
			const { doctorCode, doctorName } = this.session.doctor;
			const {
				regId,
				totalFee,
				regFee,
				treatFee,
				regDate,
				typeCode,
				typeName,
			} = this.session.appointmentTimePeriod;
			// 呼市第一医院
			// const { appoTime } = this.session.appointmentTimePoint
			const appoTime =
				this.session.appointmentTimePeriod.phaseCode.split('-')[0];
			let { phaseCode, phaseDesc } = this.session.appointmentTimePeriod;
			// 呼市第一医院
			// const { beginEndTime } = this.session.appointmentTimePoint
			const beginEndTime = this.session.appointmentTimePeriod.phaseCode;
			phaseCode = regType === 1 ? phaseCode : beginEndTime;
			phaseDesc = regType === 1 ? phaseDesc : beginEndTime;
			const data = {
				channel: 1,
				regType,
				patientId,
				fullName,
				deptCode,
				deptName,
				doctorCode,
				doctorName,
				regId,
				regFee,
				treatFee,
				regDate,
				typeCode,
				typeName,
				appoTime,
				phaseCode,
				phaseDesc,
			};
			this.startLoading({ text: '确认中' });
			sleep(1);
			lockAppointment(data)
				.then((result) => {
					this.stopLoading();
					if (result) {
						this.setSession(['paymentBusinessType', 'APPOINTMENT']);
						this.setSession(['paymentAmount', totalFee]);
						this.setSession(['paymentOrderNo', result]);
						this.$router
							.push({ name: 'SettlementDispatch' })
							.catch((err) => err);
					} else if (result.data == null) {
						this.$router.push({
							name: 'Home',
							params: { icon: 'error', title: '锁定挂号失败' },
						});
					}
				})
				.catch((err) => {
					this.$alert(err.msg, '提示', {
						confirmButtonText: '返回首页',
						showClose: false,
					}).then(() => {
						this.$router.push({ name: 'Home' });
					});
				});
		},
	},
};
</script>

<style lang="scss" scoped>
::v-deep .el-descriptions :not(.is-bordered) .el-descriptions-item__cell{
        padding-bottom: 0px;
}
::v-deep .el-descriptions .is-bordered .el-descriptions-item__cell{

    padding: 2px 10px;
}
::v-deep .el-descriptions-label-content{
    font-size: 22px;
}
.info-container {
	width: 840px;
}
</style>
