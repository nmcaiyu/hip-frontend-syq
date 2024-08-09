<template>
    <div class="main-container flex-grow flex-column">
        <timer />
        <nav-caption caption="预约记录" />
        <section class="main-section flex-grow flex-column">
            <el-table
                :data="pageableAppointments.pages[currentPage - 1]"
                class="table"
            >
                <el-table-column label="就诊日期" prop="regDate" width="160" />
                <el-table-column label="就诊时段" prop="phaseDesc" width="160" />
                <el-table-column label="科室" prop="deptName" />
                <el-table-column label="医生" prop="doctorName" />
                <el-table-column label="预约序号" prop="appoNum" width="140" />
                <el-table-column label="操作" width="120">
                    <template slot-scope="scope">
                        <button class="button" @click="check(scope.row)">取号</button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                background
                layout="pager"
                :total="pageableAppointments.total"
                :page-size="pageSize"
                hide-on-single-page
                @current-change="pageChange"
                class="pagination-wrapper flex flex-justify-center"
            />
        </section>
        <nav-footer class="nav-footer" />
        <audio-tip name="choose-appointment-record" />
    </div>
</template>

<script>
import Timer from '@/layouts/components/Timer.vue'
import NavFooter from '@/layouts/components/NavFooter.vue'
import NavCaption from '@/layouts/components/NavCaption.vue'
import { mapState, mapMutations } from 'vuex'
import { getAppointments, lockPreAppointment } from '@/api'
import { divideArray } from '@/utils/helper'
import AudioTip from '@/components/AudioTip'

export default {
    components: {
        Timer,
        NavFooter,
        NavCaption,
        AudioTip
    },
    data() {
        return {
            pageSize: 6,
            pageableAppointments: {
                total: 0,
                pages: []
            },
            currentPage: 1
        }
    },
    computed: {
        ...mapState({
            patient: state => state.session.patient
        })
    },
    created() {
        getAppointments(this.patient.patientId).then(result => {
            this.pageableAppointments = {
                total: result.length,
                pages: divideArray(result, this.pageSize)
            }
        })
    },
    methods: {
        ...mapMutations({
            setSession: 'session/set'
        }),
        check(appointment) {
            const { patientId, fullName } = this.patient
            const {
                regType,
                deptCode, deptName,
                doctorCode, doctorName,
                regId, totalFee, regDate, typeCode, typeName,
                appoTime, appoSeq,
                phaseCode, phaseDesc,
            } = appointment
            const data = {
                channel: 1,
                patientId, fullName,
                regType,
                deptCode, deptName,
                doctorCode, doctorName,
                regId, totalFee, regDate, typeCode, typeName,
                appoTime, appoSeq,
                phaseCode, phaseDesc,
            }
            lockPreAppointment(data).then(result => {
                if (result) {
                    this.setSession([ 'paymentBusinessType', 'APPOINTMENT' ])
                    this.setSession([ 'paymentAmount', totalFee ])
                    this.setSession([ 'paymentOrderNo', result ])
                    this.$router.push({ name: 'PaymentMethods' }).catch(err => err)
                } else {
                    this.$router.push({ name: 'Result', params: { icon: 'error', title: '锁定挂号失败' } })
                }
            })
        },
        pageChange(page) {
            this.currentPage = page
        }
    }
}
</script>

<style lang="scss" scoped>
.table {
    width: 100%;
}
.button {
    border: none;
    border-radius: 10px;
    background-color: #3A8FFF;
    color: #FFFFFF;
    padding: 10px 20px;
    cursor: pointer;
}
.pagination-wrapper {
    padding-bottom: 60px;
}
</style>