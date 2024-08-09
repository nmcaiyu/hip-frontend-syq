<template>
    <div class="main-container flex-grow flex-column">
        <timer />
        <nav-caption caption="请选择支付方式" />
        <section class="main-section flex-grow">
            <div class="payment-container flex-column">
                <div
                    v-for="(row, i1) in paymentList"
                    :key="i1"
                    class="payment-row flex flex-justify-between"
                >
                    <template
                        v-for="(item, i2) in row"
                    >
                        <payment-item
                            v-if="item"
                            :key="i2"
                            v-bind="item[1]"
                            @click="onClick(item[0])"
                        />
                        <payment-item-empty
                            v-else
                            :key="i2"
                        />
                    </template>
                </div>
            </div>
        </section>
        <nav-footer class="nav-footer" />
        <audio-tip name="choose-payment-method" />
    </div>
</template>

<script>
import Timer from '@/layouts/components/Timer.vue'
import NavFooter from '@/layouts/components/NavFooter.vue'
import NavCaption from '@/layouts/components/NavCaption.vue'
import PaymentItem from './components/PaymentItem.vue'
import PaymentItemEmpty from './components/PaymentItemEmpty.vue'
import { mapState, mapMutations } from 'vuex'
import AudioTip from '@/components/AudioTip'
import { divideArray, rowSupplement } from '@/utils/helper'

export default {
    components: {
        Timer,
        NavFooter,
        NavCaption,
        PaymentItem,
        PaymentItemEmpty,
        AudioTip
    },
    data() {
        return {
            rowSize: 3,
        }
    },
    computed: {
        ...mapState({
            paymentMethods: state => state.constant.paymentMethods
        }),
        paymentList() {
            const list = Object.entries(this.paymentMethods)
            rowSupplement(list, this.rowSize)
            return divideArray(list, this.rowSize)
        }
    },
    methods: {
        ...mapMutations({
            setSession: 'session/set'
        }),
        onClick(paymentMethod) {
            this.setSession([ 'paymentMethod', paymentMethod ])
            this.$router.push({ name: 'PaymentPay' }).catch(err => err)
        }
    }
}
</script>

<style lang="scss" scoped>
.payment-container {
    /* gap: 40px; */
    .payment-row {
        margin-top: 40px;
    }
    .payment-row:first-child {
        margin-top: 0;
    }
}
</style>
