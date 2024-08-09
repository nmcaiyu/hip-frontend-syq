<template>
    <div class="main-container flex-grow flex-column">
        <timer />
        <nav-caption caption="住院费用清单" />
        <section class="main-section flex-grow flex-column">
            <div class="date-picker-wrapper flex">
                <el-date-picker
                    v-model="startDate"
                    placeholder="选择起始日期"
                    type="date"
                    value-format="yyyyMMdd"
                    class="date-picker"
                    popper-class="date-picker-popper"
                />
                <el-date-picker
                    v-model="endDate"
                    placeholder="选择结束日期"
                    type="date"
                    value-format="yyyyMMdd"
                    class="date-picker"
                    popper-class="date-picker-popper"
                />
                <button class="date-picker-button" @click="submit">查询</button>
            </div>
            <div class="flex-grow">
                <el-table
                    :data="pageable.lists[this.currentPage - 1]"
                    class="table"
                    height="510"
                    v-loading="loading"
                >
                    <!-- <el-table-column type="selection" width="120" /> -->
                    <el-table-column label="日期" prop="feeDate">
                        <template slot-scope="scope">
                            {{ scope.row.feeDate | formatHisDate }}
                        </template>
                    </el-table-column>
                    <el-table-column label="费用(元)" prop="money" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.money | currency }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="160">
                        <template slot-scope="scope">
                            <button class="list-button" @click="detail(scope.row.feeDate)">查看明细</button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <el-pagination
                v-if="pageable.total > 0"
                background
                layout="pager"
                :total="pageable.total"
                :page-size="pageSize"
                hide-on-single-page
                @current-change="pageChange"
                class="pagination-wrapper flex flex-justify-center"
            />

            <!-- <span class="tip">每张住院费用清单仅能免费打印一次</span> -->
        </section>
        <nav-footer class="nav-footer" />
        <!-- <audio-tip name="choose-inpatient-invoice" /> -->
    </div>
</template>

<script>
import Timer from '@/layouts/components/Timer.vue'
import NavFooter from '@/layouts/components/NavFooter.vue'
import NavCaption from '@/layouts/components/NavCaption.vue'
import { mapState } from 'vuex'
import { getInpatientInvoiceList } from '@/api'
// import AudioTip from '@/components/AudioTip'
import { getDate, formatDate, divideArray, sleep } from '@/utils/helper'

export default {
    components: {
        Timer,
        NavFooter,
        NavCaption,
        // AudioTip
    },
    data() {
        return {
            currentPage: 1,
            pageSize: 6,
            pageable: {
                total: 0,
                lists: []
            },
            startDate: '',
            endDate: '',
            loading: false
        }
    },
    computed: {
        ...mapState({
            patient: state => state.session.patient
        }),
    },
    created() {
        this.startDate = formatDate(getDate(-7), { divider: '' })
        this.endDate = formatDate(getDate(), { divider: '' })
        this.fetchData()
    },
    methods: {
        async fetchData() {
            this.loading = true
            await sleep(0.5)
            const params = {
                inpatientNum: this.patient.inpatientNum,
                startDate: this.startDate,
                endDate: this.endDate
            }
            getInpatientInvoiceList(params).then(result => {
                this.loading = false
                this.currentPage = 1
                this.pageable.total = result.length
                this.pageable.lists = divideArray(result, this.pageSize)
            })
        },
        pageChange(page) {
            this.currentPage = page
        },
        submit() {
            this.fetchData()
        },
        detail(date) {
            this.$router.push({ name: 'InpatientInvoiceDetail', params: { date } })
        }
    }
}
</script>

<style lang="scss" scoped>
.table {
    width: 100%;
}
.list-button {
    border: none;
    border-radius: 7px;
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
.pagination-wrapper {
    padding-bottom: 30px;
}
.date-picker-wrapper {
    padding-bottom: 20px;
    column-gap: 20px;
}
.date-picker-button {
    border: none;
    border-radius: 7px;
    background-color: #3A8FFF;
    color: #FFFFFF;
    padding: 5px 20px;
    cursor: pointer;
    font-size: 24px;
}
</style>
