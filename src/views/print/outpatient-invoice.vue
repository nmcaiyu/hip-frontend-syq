<template>
    <div class="main-container flex-grow flex-column">
        <timer />
        <nav-caption caption="门诊结算记录" />
        <section class="main-section flex-grow flex-column">
            <el-table
                :data="settledBills"
                class="table"
                height="500"
            >
                <el-table-column label="收费日期" prop="payDate" width="160" />
                <el-table-column label="科室名称" prop="deptName" />
                <el-table-column label="发票号" prop="invoiceNum" />
                <el-table-column label="总费用(元)" prop="payAmt" width="160" />
                <el-table-column label="操作" width="140">
                    <template slot-scope="scope">
                        <button class="button-print" @click="print(scope.row.hisOrderNum)">打印</button>
                    </template>
                </el-table-column>
            </el-table>

            <span class="tip">每张门诊交费明细单据仅能免费打印一次</span>
        </section>
        <nav-footer class="nav-footer" />
        <audio-tip name="choose-outpatient-order-record" />
    </div>
</template>

<script>
import Timer from '@/layouts/components/Timer.vue'
import NavFooter from '@/layouts/components/NavFooter.vue'
import NavCaption from '@/layouts/components/NavCaption.vue'
import { mapState, mapActions } from 'vuex'
import {
    getSettledOutpatientBills,
    printSettledOutpatientBill,
} from '@/api'
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
            settledBills: [],
        }
    },
    computed: {
        ...mapState({
            patient: state => state.session.patient
        }),
    },
    created() {
        this.fetchData()
    },
    methods: {
        ...mapActions({
            startLoading: 'session/startLoading',
            stopLoading: 'session/stopLoading',
        }),
        fetchData() {
            getSettledOutpatientBills(this.patient.patientId).then(result => {
                this.settledBills = result
            })
        },
        print(hisOrderNum) {
            this.startLoading({ text: '正在打印' })
            const params = {
                patientId: this.patient.patientId,
                hisOrderNum,
                isPrint: 1
            }
            printSettledOutpatientBill(params).then(() => {
                this.stopLoading()
                const params = {
                    icon: 'success',
                    title: '操作成功',
                    subTitle: '正在打印中，请不要走开',
                }
                this.$router.push({ name: 'Result', params }).catch(err=>err)
            })
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
    margin-bottom: 30px;
}
</style>