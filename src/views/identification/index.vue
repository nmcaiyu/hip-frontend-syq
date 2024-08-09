<template>
	<div class="main-container flex-grow flex-column">
		<timer />
		<nav-caption caption="请选择验证方式" />
		<section class="main-section flex-grow">
            <object :classid="classId" ref="activexObjEtc" class="hidden-input" />
			<div class="identification-container flex-column">
				<div v-for="(row, i1) in itemList" :key="i1" class="item-row flex flex-justify-between">
					<template v-for="(item, i2) in row">
						<identification-item v-if="item" :key="i2" @click="choose(item[0])" v-bind="item[1]" />
						<identification-item-empty v-else :key="i2" />
					</template>
				</div>
			</div>
		</section>
		<nav-footer class="nav-footer" />
		<audio-tip name="choose-identification-method" />
	</div>
</template>

<script>
import Timer from '@/layouts/components/Timer.vue'
import NavFooter from '@/layouts/components/NavFooter.vue'
import NavCaption from '@/layouts/components/NavCaption.vue'
import { mapState, mapMutations, mapActions } from 'vuex';
import AudioTip from '@/components/AudioTip'
import IdentificationItem from './components/IdentificationItem.vue'
import IdentificationItemEmpty from './components/IdentificationItemEmpty.vue'
import { divideArray, rowSupplement } from '@/utils/helper'
import { getPatient, getPatientInfo } from '@/api';

export default {
    components: {
        Timer,
        NavFooter,
        NavCaption,
        AudioTip,
        IdentificationItem,
        IdentificationItemEmpty
    },
    data() {
        return {
            rowSize: 3,
            classId: 'clsid:8EEF7302-1FC8-4BA0-8EA5-EC29FDBCA45B',
            activexResp: null
        }
    },
    computed: {
        ...mapState({
            identificationMethods: state => state.constant.identificationMethods
        }),
        itemList() {
            const list = Object.entries(this.identificationMethods)
            rowSupplement(list, this.rowSize)
            const resultList = list.filter(item => item != null);
            return divideArray(resultList, this.rowSize)
        }
    },
    watch: {
        activexResp(resp) {
			if (resp) {
				// 调用自助机读取身份识别信息接口
                const params = {};
                params.idNum = resp.idNo;
                getPatient(2, params)
				.then((result) => {
					this.handleResult(result, resp);
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
		}),
        choose(name) {
            if (name === 'IDENTITY_CARD_NO_TYPING') {
                this.$router.push({
                    name: 'IdentificationTypingIdentityCardNo',
                }).catch(err => err)
            } else if (name === 'ETC_SOCIAL_SECURITY_CARD') {
                this.invokeActiveX();
            } else{
                this.$router.push({
                    name: 'IdentificationReading',
                    params: { method: name }
                }).catch(err => err)
            }
        },
        invokeActiveX() {
			let obj = this.$refs.activexObjEtc;
            let inparam = '{"data":{"businessType":"01101","deviceType":"","officeId":"32760","officeName":"消化内科","operatorId":"test001","operatorName":"超级管理员","orgId":"35020319001"},"orgId":"35020319001","transType":"ec.query"}';
            let productResult = JSON.parse(obj.NationEcTrans("http://10.38.22.15:8081/localcfc/api/hsecfc/localQrCodeQuery",inparam));
            if (productResult.code != 0 && productResult.code != -2) {
                this.$alert(productResult.message, '提示', {
					confirmButtonText: '确定',
					showClose: false,
				});
            }
            this.activexResp = productResult.data;
		},
        handleResult(result, resp) {
            if (result && result.patientId) {
				this.setSession(['patient', result]);
				this.$router
					.push({
						name: 'IdentificationInfo',
						params: { methodName: 'SOCIAL_SECURITY_CARD' },
					})
					.catch((err) => err);
			} else {
                let routeParams = { name: 'IdentificationRegister' };
                let params = {
                    idCardNum: resp.idNo,
                    fullName: resp.userName,
                    presentAddress: '',
                    nationCode: '',
                    birthday: `${resp.idNo.substr(
							6,
							4
						)}-${resp.idNo.substr(10, 2)}-${resp.idNo.substr(
							12,
							2
						)}`,
                };
                getPatientInfo({
                    patientName: resp.userName,
                    idNum: resp.idNo,
                }).then((d) => {
                    params.nationCode = d.Nation;
                });
                routeParams.params = params;
                this.$router.push(routeParams).catch((err) => err);
			}
        }
    }
}
</script>

<style lang="scss" scoped>
.identification-container {
	/* gap: 40px; */
	.item-row {
		margin-top: 40px;
	}
	.item-row:first-child {
		margin-top: 0;
	}
}
</style>
