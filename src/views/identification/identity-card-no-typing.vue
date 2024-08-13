<template>
    <div class="main-container flex-grow flex-column">
        <timer />
        <nav-caption v-if="identificationMethod" :caption="`${identificationMethod.label}`" />
        <section class="main-section flex-grow flex-column flex-align-center">
            <template v-if="identificationMethod">
                <span>请输入身份证号</span>
                <div class="identity-example flex-column flex-justify-center flex-align-center">
                    <el-form ref="form" class="form" :model="formData" :rules="formRules">
                        <el-form-item prop="identityCardNo">
                            <el-input
                                ref="idNoInput"
                                v-model="formData.identityCardNo"
                                maxlength="18"
                                show-word-limit
                                class="id-no-input"
                                placeholder="末尾 X 以小数点代替"
                                @focus="autoBlur"
                            />
                        </el-form-item>
                    </el-form>
                    <img :src="identificationMethods['IDENTITY_CARD'].imgSrc" />
                    <div class="top-left"></div>
                    <div class="top-right"></div>
                    <div class="bottom-left"></div>
                    <div class="bottom-right"></div>
                </div>
            </template>
        </section>
        <nav-footer class="nav-footer" />
        <audio-tip v-if="identificationMethod.audioName" :name="identificationMethod.audioName" />
    </div>
</template>

<script>
import Timer from '@/layouts/components/Timer.vue'
import NavFooter from '@/layouts/components/NavFooter.vue'
import NavCaption from '@/layouts/components/NavCaption.vue'
import SimpleKeyboard from '@/components/SimpleKeyboard'
import { mapState, mapMutations, mapActions } from 'vuex'
import { getPatientByIdentityCardNo } from '@/api'
import { sleep } from '@/utils/helper'
import AudioTip from '@/components/AudioTip'

export default {
    components: {
        Timer,
        NavFooter,
        NavCaption,
        SimpleKeyboard,
        AudioTip
    },
    data() {
        return {
            formData: {
                identityCardNo: ''
            },
            formRules: {
                identityCardNo: [
                    { required: true, message: '请输入身份证号', trigger: 'blur' },
                    { len: 18, message: '请输入18位身份证号', trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        ...mapState({
            identificationMethods: state => state.constant.identificationMethods,
            session: state => state.session
        }),
        identificationMethod() {
            return this.identificationMethods['IDENTITY_CARD_NO_TYPING']
        }
    },
    created() {
    },
    mounted() {
        document.addEventListener('keydown', this.keydown)
    },
    methods: {
        ...mapMutations({
            setSession: 'session/set'
        }),
        ...mapActions({
            startLoading: 'session/startLoading',
            stopLoading: 'session/stopLoading'
        }),
        keydown(e) {
            this.$refs.form.clearValidate()
            const { identityCardNo } = this.formData
            const regExp = /[0-9]/
            if (regExp.test(e.key)) {
                if (identityCardNo.length < 18)
                    this.formData.identityCardNo += e.key
            } else if (e.key === '.') {
                if (identityCardNo.length === 17)
                    this.formData.identityCardNo += 'X'
            } else if (e.key === 'Backspace') {
                if (identityCardNo.length > 0)
                    this.formData.identityCardNo = identityCardNo.slice(0, -1)
            } else if (e.key === 'Enter') {
                if (identityCardNo.length >= 18 && !this.session.loading)
                    this.submit()
            }
        },
        submit() {
            let isValid = false
            this.$refs.form.validate(valid => isValid = valid)
            if (!isValid) return false

            this.startLoading({ text: '正在获取信息' })

            getPatientByIdentityCardNo(this.formData.identityCardNo).then(result => {
                this.stopLoading()
                if (result && result.patientId) {
                    this.setSession([ 'patient', result ])
                    this.$router.push({ name: 'IdentificationInfo' }).catch(err => err)
                } else {
                    const routeParams = { name: 'IdentificationRegister' }
                    if (result && result.idCardNum) routeParams.params = { idCardNum: result.idCardNum }
                    this.$router.push(routeParams).catch(err => err)
                }
            })
        },
        autoBlur() {
            this.$refs.idNoInput.blur()
        },
    },
    destroyed() {
        document.removeEventListener('keydown', this.keydown)
    }
}
</script>

<style lang="scss" scoped>
.main-section {
    span {
        font-size: 28px;
        color: #2B2B2B;
    }
}
.id-no-input {
    width: 500px;
}
.form ::v-deep {
    .el-input {
        font-size: 24px;
    }
    .el-form-item {
        margin-bottom: 28px;
    }
    .el-form-item__error {
        font-size: 20px;
    }
    .el-input__count-inner {
        font-size: 24px;
    }
}
.identity-example {
    margin-top: 20px;
    margin-bottom: 30px;
    position: relative;
    width: 840px;
    height: 540px;
    padding: 0 30px;
    column-gap: 20px;
    img {
        width: 500px;
    }
    .top-left {
        position: absolute;
        top: 0;
        left: 0;
        width: 160px;
        height: 100px;
        border-top: 15px solid #DEDEDE;
        border-left: 15px solid #DEDEDE;
    }
    .top-right {
        position: absolute;
        top: 0;
        right: 0;
        width: 160px;
        height: 100px;
        border-top: 15px solid #DEDEDE;
        border-right: 15px solid #DEDEDE;
    }
    .bottom-left {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 160px;
        height: 100px;
        border-bottom: 15px solid #DEDEDE;
        border-left: 15px solid #DEDEDE;
    }
    .bottom-right {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 160px;
        height: 100px;
        border-bottom: 15px solid #DEDEDE;
        border-right: 15px solid #DEDEDE;
    }
}
</style>