<template>
    <div class="main-container flex-grow flex-column">
        <timer />
        <nav-caption caption="挂号记录" />
        <section class="main-section flex-grow flex-column">
            <el-table
                ref="table"
                :data="appointments"
                class="table"
                height="500"
                v-loading="loading"
            >
                <el-table-column label="就诊日期" prop="regDate" width="160" />
                <el-table-column label="就诊时段" prop="phaseDesc" width="160" />
                <el-table-column label="科室" prop="deptName" />
                <el-table-column label="医生" prop="doctorName" />
                <el-table-column label="费用(元)" prop="payFee" width="140" />
                <el-table-column label="操作" width="140">
                    <template slot-scope="scope">
                        <button class="button-print" @click="print(scope.row.orderNum)">打印</button>
                    </template>
                </el-table-column>
            </el-table>
            <span class="tip">每张单据只限补打一次</span>
        </section>
        <nav-footer class="nav-footer" />
        <audio-tip name="choose-appointment-log" />
    </div>
</template>

<script>
import Timer from '@/layouts/components/Timer.vue'
import NavFooter from '@/layouts/components/NavFooter.vue'
import NavCaption from '@/layouts/components/NavCaption.vue'
import { mapState, mapActions } from 'vuex'
import { getLatestAppointments, printAppointmentTickets } from '@/api'
import AudioTip from '@/components/AudioTip'
import { sleep } from '@/utils/helper'

export default {
    components: {
        Timer,
        NavFooter,
        NavCaption,
        AudioTip
    },
    data() {
        return {
            appointments: [],
            loading: false
        }
    },
    computed: {
        ...mapState({
            patient: state => state.session.patient
        })
    },
    created() {
        this.fetchData()
    },
    methods: {
        ...mapActions({
            startLoading: 'session/startLoading',
            stopLoading: 'session/stopLoading',
        }),
        async fetchData() {
            this.loading = true
            await sleep(0.5)
            const params = {
                patientId: this.patient.patientId,
                regType: 3
            }
            getLatestAppointments(params).then(result => {
                this.loading = false
                this.appointments = result
            }).catch(error => {
                this.loading = false
                this.handleError(error)
            })
        },
        async print(orderNum) {
            this.startLoading({ text: '正在打印' })
            await sleep(1)
            const data = {
                printType: 2,
                orderNums: [orderNum]
            }
            printAppointmentTickets(data).then(result => {
                this.stopLoading()
                if (result && result.printCode === '1') {
                    const params = {
                        icon: 'success',
                        title: '操作成功',
                        subTitle: '正在打印中，请不要走开',
                    }
                    this.$router.push({ name: 'Result', params }).catch(err=>err)
                } else if (!result || result.printCode === '2') {
                    if (result.printMsg) console.error('===', result.printMsg)
                    const params = {
                        icon: 'warning',
                        title: '打印失败',
                        subTitle: '请联系工作人员',
                    }
                    this.$router.push({ name: 'Result', params }).catch(err=>err)
                }
            }).catch(error => {
                this.handleError(error)
            })
        },
        handleError(error) {
            if (error.code && error.code === 1) {
                this.$alert(error.msg, '提示', {
                    confirmButtonText: '确定',
                    showClose: false
                }).then(() => {
                    this.$router.push({ name: 'Home' }).catch(err=>err)
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.table {
    width: 100%;
}
.button-print {
    border: none;
    border-radius: 10px;
    background-color: #3A8FFF;
    color: #FFFFFF;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 24px;
}
.tip {
	font-size: 20px;
    color: #606266;
    font-weight: 500;
    margin-bottom: 20px;
}
</style>
