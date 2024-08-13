<template>
    <div class="main-container flex-grow flex-column">
        <timer />
        <nav-caption caption="无卡建档" />
        <section class="main-section flex-grow flex-column">
            <el-form
                :model="formData"
                :rules="formRules"
                label-position="left"
                label-width="140px"
                class="form"
                ref="form"
            >
                <el-form-item label="姓名" prop="fullName">
                    <el-input
                        v-model="formData.fullName"
                        ref="fullName"
                        @focus="launchKeyboard('fullName')"
                        disabled
                    />
                </el-form-item>
                <el-form-item label="性别" prop="sexCode">
                    <el-radio
                        v-model="formData.sexCode"
                        label="1"
                        disabled
                    >男</el-radio>
                    <el-radio
                        v-model="formData.sexCode"
                        label="2"
                        disabled
                    >女</el-radio>
                </el-form-item>
                <el-form-item label="身份证号" prop="idCardNum">
                    <el-input
                        v-model="formData.idCardNum"
                        ref="idCardNum"
                        @focus="launchKeyboard('idCardNum')"
                        disabled
                    />
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input
                        v-model="formData.phone"
                        ref="phone"
                        @focus="launchKeyboard('phone')"
                    />
                </el-form-item>
                <el-form-item label="地址" prop="presentAddress">
                    <el-input
                        v-model="formData.presentAddress"
                        ref="presentAddress"
                        @focus="launchKeyboard('presentAddress')"
                        disabled
                    />
                </el-form-item>
            </el-form>

            <button class="button" @click="submit">立即创建</button>

            <el-drawer
                ref="drawer"
                :visible.sync="drawer"
                direction="btt"
                class="drawer"
                :modal="false"
                @close="drawerClose"
                :show-close="false"
            >
                <simple-keyboard
                    v-model="formData[focusedRef]"
                    layout="pinyin-number"
                    @on-key-press="onKeyPress"
                />
            </el-drawer>
        </section>
        <nav-footer class="nav-footer" />
    </div>
</template>

<script>
import Timer from '@/layouts/components/Timer.vue'
import NavFooter from '@/layouts/components/NavFooter.vue'
import NavCaption from '@/layouts/components/NavCaption.vue'
import SimpleKeyboard from '@/components/SimpleKeyboard'
import { mapState, mapMutations, mapActions } from 'vuex'
import { registerPatient } from '@/api'
import { sleep } from '@/utils/helper'

export default {
    components: {
        Timer,
        NavFooter,
        NavCaption,
        SimpleKeyboard
    },
    data() {
        return {
            drawer: false,
            formData: {
                fullName: null,
                sexCode: null,
                idCardNum: null,
                phone: null,
                presentAddress: null,
                nationCode: null,
                birthday: null,
            },
            formRules: {
                fullName: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                ],
                idCardNum: [
                    { required: true, message: '请输入身份证号', trigger: 'blur' },
                    { len: 18, message: '请输入18位身份证号', trigger: 'blur' }
                ],
                sexCode: [
                    { required: true, message: '请选择性别', trigger: 'blur' },
                ],
                phone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { len: 11, message: '请输入正确的手机号', trigger: 'blur' }
                ],
                // presentAddress: [
                //     { required: true, message: '请输入地址', trigger: 'blur' },
                // ],
            },
            focusedRef: null
        }
    },
    computed: {
        ...mapState({
            session: state => state.session
        }),
    },
    mounted() {
        this.$refs.drawer.$el.getElementsByClassName('el-drawer').item(0).style.height = '360px'
        const { idCardNum, fullName, presentAddress, nationCode, birthday } = this.$route.params
        if (idCardNum) {
            this.formData.idCardNum = idCardNum
            this.formData.sexCode = idCardNum[16] % 2 !== 0 ? '1' : '2'
        }
        if (fullName) this.formData.fullName = fullName
        if (presentAddress) this.formData.presentAddress = presentAddress
        if (nationCode) this.formData.nationCode = nationCode
        if (birthday) this.formData.birthday = birthday
    },
    methods: {
        ...mapMutations({
            setSession: 'session/set'
        }),
        ...mapActions({
            startLoading: 'session/startLoading',
            stopLoading: 'session/stopLoading'
        }),
        launchKeyboard(ref) {
            this.$refs.form.clearValidate()
            this.focusedRef = ref
            this.$refs[this.focusedRef].blur()
            this.drawer = true
        },
        drawerClose() {
            this.focusedRef = null
            this.drawer = false
        },
        submit() {
            let isValid = false
            this.$refs.form.validate(valid => isValid = valid)

            if (isValid) {
                this.drawer = false
                this.startLoading({
                    // target: this.$el,
                    text: '正在建档'
                })


                registerPatient(this.formData).then(result => {
                    this.stopLoading()
                    if (result) {
                        this.setSession([ 'patient', result ])
                        this.$router.push({ name: this.session.redirect }).catch(err=>err)
                    } else {
                        this.$router.push({ name: 'Result', params: { icon: 'warning', title: '建档失败' } }).catch(err=>err)
                    }
                })
            }
        },
        onKeyPress(button) {
            if (button === '{escape}') {
                this.drawerClose()
            } else {
                this.$refs.form.clearValidate()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.button {
    border: none;
    border-radius: 10px;
    background-color: #3A8FFF;
    color: #FFFFFF;
    padding: 20px 20px;
    cursor: pointer;
    font-size: 35px;
    margin: 20px 0 40px;
}
.form ::v-deep {
    .el-form-item__label {
        font-size: 28px;
    }
    .el-radio__inner {
        width: 24px;
        height: 24px;
    }
    .el-radio__label {
        font-size: 24px;
    }
    .el-input {
        font-size: 24px;
    }
    .el-form-item {
        margin-bottom: 28px;
    }
    .el-form-item__error {
        font-size: 20px;
    }
    .el-radio, .el-radio__input {
        line-height: 1.9;
    }
}
</style>
