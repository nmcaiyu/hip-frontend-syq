<template>
    <div class="main-container flex-grow flex-column">
        <timer />
        <nav-caption caption="住院充值" />
        <section class="main-section flex-grow flex-column flex-align-center">
            <div class="identity-example flex-column flex-align-stretch">
                <el-form ref="form" class="form" :model="formData" :rules="formRules">
                    <el-form-item prop="amount">
                        <el-input
                            ref="amountInput"
                            v-model="formData.amount"
                            placeholder="请输入金额（下方小键盘输入）"
                            @focus="autoBlur"
                        />
                    </el-form-item>
                </el-form>
                <span>当前余额：{{ patient.prepayBal | currency }} 元</span>
            </div>
        </section>
        <nav-footer class="nav-footer" />
        <audio-tip name="type-amount" />
    </div>
</template>

<script>
import Timer from '@/layouts/components/Timer.vue'
import NavFooter from '@/layouts/components/NavFooter.vue'
import NavCaption from '@/layouts/components/NavCaption.vue'
import { mapState, mapMutations, mapActions } from 'vuex'
import { sleep } from '@/utils/helper'
import AudioTip from '@/components/AudioTip'
import { createInpatientRechargeOrder } from '@/api'

export default {
    components: {
        Timer,
        NavFooter,
        NavCaption,
        AudioTip
    },
    data() {
        return {
            formData: {
                amount: ''
            },
            formRules: {
                amount: [
                    { required: true, message: '请输入金额', trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        ...mapState({
            session: state => state.session,
            patient: state => state.session.patient
        })
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
            const { amount } = this.formData
            const regExp = /[0-9]/
            if (regExp.test(e.key)) {
                const condition1 = amount !== '0'
                const condition2 = !amount.includes('.') || amount.split('.')[1].length < 2
                if (condition1 && condition2)
                    this.formData.amount += e.key
            } else if (e.key === '.') {
                if (!amount.includes(e.key) && amount.length > 0)
                    this.formData.amount += e.key
            } else if (e.key === 'Backspace') {
                if (this.formData.amount.length > 0)
                    this.formData.amount = amount.slice(0, -1)
            } else if (e.key === 'Enter') {
                if (!this.session.loading)
                    this.submit()
            }
        },
        async submit() {
            let isValid = false
            await this.$refs.form.validate(valid => isValid = valid)
            if (!isValid) return false

            this.startLoading({ text: '创建支付订单' })
            await sleep(1)

            const data = {
                inpatientNum: this.patient.inpatientNum,
                payAmt: this.formData.amount
            }
            createInpatientRechargeOrder(data).then(result => {
                this.stopLoading()
                if (result) {
                    this.setSession([ 'paymentBusinessType', 'INPATIENT' ])
                    this.setSession([ 'paymentAmount', this.formData.amount ])
                    this.setSession([ 'paymentOrderNo', result ])
                    this.$router.push({ name: 'PaymentMethods' }).catch(err => err)
                } else {
                    this.$router.push({ name: 'Result', params: { icon: 'error', title: '支付订单创建失败' } })
                }
            })
        },
        autoBlur() {
            this.$refs.amountInput.blur()
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
