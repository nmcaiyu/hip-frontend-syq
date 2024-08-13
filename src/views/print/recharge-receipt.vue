<template>
    <div class="main-container flex-grow flex-column">
        <timer />
        <nav-caption caption="住院充值记录" />
        <section class="main-section flex-grow flex-column">
            <div class="flex-grow">
                <el-table
                    :data="lists[currentPage - 1]"
                    class="table"
                    height="550"
                    v-loading="loading"
                >
                    <el-table-column label="时间" prop="payTime" width="500" />
                    <el-table-column label="费用(元)" prop="payAmt">
                        <template slot-scope="scope">
                            <span>{{ scope.row.payAmt | currency }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="140">
                        <template slot-scope="scope">
                            <button class="button-print" @click="print(scope.row.outTradeNo)">打印</button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <el-pagination
                v-if="total > 0"
                background
                layout="pager"
                :total="total"
                :page-size="pageSize"
                hide-on-single-page
                @current-change="pageChange"
                class="pagination-wrapper flex flex-justify-center"
            />

            <span class="tip">每张充值凭条仅能免费打印一次</span>
        </section>
        <nav-footer class="nav-footer" />
        <!-- <audio-tip name="choose-outpatient-order-record" /> -->
    </div>
</template>

<script>
import Timer from '@/layouts/components/Timer.vue'
import NavFooter from '@/layouts/components/NavFooter.vue'
import NavCaption from '@/layouts/components/NavCaption.vue'
import { mapState, mapActions } from 'vuex'
import {
    getInpatientRechargeRecords,
    printInpatientRechargeReceipt,
} from '@/api'
// import AudioTip from '@/components/AudioTip'
import { divideArray, sleep } from '@/utils/helper'

export default {
    components: {
        Timer,
        NavFooter,
        NavCaption,
        // AudioTip
    },
    data() {
        return {
            total: 0,
            lists: [],
            currentPage: 1,
            pageSize: 6,
            loading: false
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
            this.loading = true
            getInpatientRechargeRecords(this.patient.inpatientNum).then(result => {
                this.loading = false
                this.total = result.length
                this.lists = divideArray(result, this.pageSize)
            })
        },
        print(outTradeNo) {
            this.startLoading({ text: '正在打印' })
            const params = {
                outTradeNo,
                printType: 2
            }
            printInpatientRechargeReceipt(params).then(result => {
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
