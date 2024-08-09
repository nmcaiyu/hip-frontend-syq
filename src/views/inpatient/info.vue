<template>
    <div class="main-container flex-grow flex-column">
        <timer />
        <nav-caption caption="住院信息" />
        <section class="main-section flex-grow flex flex-justify-center">
            <div class="info-container">
                <el-card class="info-card">
                    <el-descriptions
                        v-if="patient"
                        :column="1"
                        label-class-name="el-descriptions-label-content"
                        content-class-name="el-descriptions-label-content"
                        border
                    >
                        <el-descriptions-item label="姓名">{{ patient.fullName }}</el-descriptions-item>
                        <el-descriptions-item label="住院号">{{ patient.inpatientNum }}</el-descriptions-item>
                        <el-descriptions-item label="联系电话">{{ patient.phone }}</el-descriptions-item>
                        <el-descriptions-item label="身份证号">{{ patient.idCardNum }}</el-descriptions-item>
                        <el-descriptions-item label="余额">{{ patient.prepayBal | currency }} 元</el-descriptions-item>
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
import Timer from '@/layouts/components/Timer.vue'
import NavFooter from '@/layouts/components/NavFooter.vue'
import NavCaption from '@/layouts/components/NavCaption.vue'
import { mapState } from 'vuex'
import AudioTip from '@/components/AudioTip'

export default {
    components: {
        Timer,
        NavFooter,
        NavCaption,
        AudioTip
    },
    computed: {
        ...mapState({
            session: 'session',
            patient: state => state.session.patient
        })
    },
    methods: {
        confirm () {
            this.$router.push({ name: this.session.redirect }).catch(err => err)
        }
    }
}
</script>

<style lang="scss" scoped>
.info-container {
    width: 840px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
}
</style>