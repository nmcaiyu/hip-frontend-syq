<template>
    <div class="main-container flex-grow flex-column">
        <timer />
        <nav-caption caption="请输入住院号" />
        <section class="main-section flex-grow flex-column flex-align-center">
            <div class="identity-example flex-column flex-align-stretch">
                <el-form ref="form" class="form" :model="formData" :rules="formRules">
                    <el-form-item prop="inpatientNo">
                        <el-input
                            ref="idNoInput"
                            v-model="formData.inpatientNo"
                            placeholder="请输入住院号"
                            @focus="autoBlur"
                        />
                    </el-form-item>
                </el-form>
                <simple-keyboard
                    v-model="formData.inpatientNo"
                    layout="capital-alphabet-number"
                    @on-key-press="onKeyPress"
                />
            </div>
        </section>
        <nav-footer class="nav-footer" />
        <audio-tip name="type-inpatient-no" />
    </div>
</template>

<script>
import Timer from '@/layouts/components/Timer.vue'
import NavFooter from '@/layouts/components/NavFooter.vue'
import NavCaption from '@/layouts/components/NavCaption.vue'
import SimpleKeyboard from '@/components/SimpleKeyboard'
import { mapMutations, mapActions } from 'vuex'
import { getInpatient } from '@/api'
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
                inpatientNo: ''
            },
            formRules: {
                inpatientNo: [
                    { required: true, message: '请输入住院号', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
    },
    mounted() {
    },
    methods: {
        ...mapMutations({
            setSession: 'session/set'
        }),
        ...mapActions({
            startLoading: 'session/startLoading',
            stopLoading: 'session/stopLoading'
        }),
        async onKeyPress(button) {
            if (button === '{enter}') {
                let isValid = false
                await this.$refs.form.validate(valid => isValid = valid)
                if (!isValid) return false

                this.startLoading({ text: '正在获取信息' })
                await sleep(1)

                getInpatient(this.formData.inpatientNo).then(result => {
                    this.stopLoading()
                    if (result && result.inpatientNum) {
                        this.setSession([ 'patient', result ])
                        this.$router.push({ name: 'InpatientInfo' }).catch(err => err)
                    } else {
                        this.$router.push({ name: 'Home' }).catch(err => err)
                    }
                }).catch(error => {
                    this.stopLoading()
                    if (error.code && error.code === 1) {
                        this.$alert('未查到住院信息', '提示', {
                            confirmButtonText: '确定',
                            showClose: false
                        })
                    }
                })
            } else {
                this.$refs.form.clearValidate()
            }
        },
        autoBlur() {
            this.$refs.idNoInput.blur()
        },
    },
    destroyed() {
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
}
</style>