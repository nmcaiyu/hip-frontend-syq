<template>
    <div></div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    computed: {
        ...mapState({
            settlementType: state => state.session.settlementType
        }),
    },
    created() {
        if (this.settlementType && this.settlementType === 'HEALTH_INSURANCE') {
            this.$router.replace({ name: 'HealthInsuranceSettle' }).catch(err => err)
        } else if (this.settlementType && this.settlementType === 'SELF_PAY') {
            this.$router.replace({ name: 'PaymentMethods' }).catch(err => err)
        } else {
            this.$router.replace({ name: 'HealthInsuranceSettleEtc' }).catch(err => err)
        }
    }
}
</script>