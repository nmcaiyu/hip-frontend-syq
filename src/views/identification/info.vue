<template>
	<div class="main-container flex-grow flex-column">
		<timer />
		<nav-caption caption="个人信息" />
		<section class="main-section flex-grow flex flex-justify-center">
			<div class="info-container">
				<el-card class="info-card">
					<el-descriptions v-if="session.patient" :column="1" label-class-name="el-descriptions-label-content" content-class-name="el-descriptions-label-content" border>
						<el-descriptions-item label="姓名">{{ session.patient.fullName }}</el-descriptions-item>
						<!-- <el-descriptions-item label="病历号">{{ session.patient.mrId }}</el-descriptions-item> -->
						<el-descriptions-item label="患者编号">{{ session.patient.patientId }}</el-descriptions-item>
						<el-descriptions-item label="联系电话">{{ session.patient.phone }}</el-descriptions-item>
						<el-descriptions-item label="身份证号码">{{ session.patient.idCardNum }}</el-descriptions-item>
					</el-descriptions>
				</el-card>
				<button class="confirm-button" @click="confirm">确认信息并继续</button>
			</div>
		</section>
		<nav-footer class="nav-footer" />
		<audio-tip name="confirm-identity-info" />
	</div>
</template>

<script>
import Timer from '@/layouts/components/Timer.vue';
import NavFooter from '@/layouts/components/NavFooter.vue';
import NavCaption from '@/layouts/components/NavCaption.vue';
import { mapState } from 'vuex';
import AudioTip from '@/components/AudioTip';

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
	data() {
		return {
			methodName: '',
		};
	},
	created() {
		this.methodName = this.$route.params.methodName;
	},
	methods: {
		confirm() {
			if (this.methodName && (this.methodName == 'SOCIAL_SECURITY_CARD' || this.methodName == 'ETC_SOCIAL_SECURITY_CARD')) {
				this.$router.push({ name: this.session.redirect,params: { methodName: this.methodName }}).catch((err) => err);
			} else {
				this.$router.push({ name: this.session.redirect }).catch((err) => err);
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.info-container {
	width: 840px;
	display: flex;
	flex-direction: column;
	align-items: stretch;
}
::v-deep .el-descriptions :not(.is-bordered) .el-descriptions-item__cell {
	padding-bottom: 2px;
}
</style>