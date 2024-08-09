<template>
    <div class="department-list main-container flex-grow flex-column">
        <timer />
        <nav-caption caption="查询并选择科室" />
        <section class="main-section flex-grow flex-column">
            <el-tabs
                v-model="activeTabName"
                class="department-tab flex-grow flex-column"
            >
                <el-tab-pane
                    v-for="(d1, i1) in pageableDepartmentList"
                    :key="i1"
                    :label="d1.deptName"
                    :name="i1.toString()"
                    class="flex-grow flex-column"
                >
                    <template v-if="d1.pageable">
                        <div class="flex-grow">
                            <div class="page-wrapper flex flex-column flex-align-stretch">
                                <div
                                    v-for="(row, i2) in d1.pageable.pages[d1.pageable.currentPage - 1]"
                                    :key="i2"
                                    class="department-row flex flex-justify-between"
                                >
                                    <template v-for="(d2, i3) in row">
                                        <department-item
                                            v-if="d2"
                                            :key="i3"
                                            :label="d2.deptName"
                                            @click="onClick(d2)"
                                        />
                                        <department-item-empty
                                            v-else
                                            :key="i3"
                                        />
                                    </template>
                                </div>
                            </div>
                        </div>
                        <el-pagination
                            background
                            layout="pager"
                            :total="d1.pageable.total"
                            :page-size="pageSize"
                            hide-on-single-page
                            @current-change="pageChange"
                            class="department-pagination flex flex-justify-center"
                        />
                    </template>
                </el-tab-pane>
            </el-tabs>
        </section>
        <nav-footer class="nav-footer" />
        <audio-tip name="choose-department" />
    </div>
</template>

<script>
import Timer from '@/layouts/components/Timer.vue'
import NavFooter from '@/layouts/components/NavFooter.vue'
import NavCaption from '@/layouts/components/NavCaption.vue'
import DepartmentItem from './components/DepartmentItem.vue'
import DepartmentItemEmpty from './components/DepartmentItemEmpty.vue'
import { mapMutations } from 'vuex'
import { getDepartments } from '@/api'
import { dividePage } from '@/utils/helper'
import AudioTip from '@/components/AudioTip'

export default {
    components: {
        Timer,
        NavFooter,
        NavCaption,
        DepartmentItem,
        DepartmentItemEmpty,
        AudioTip
    },
    data() {
        return {
            pageSize: 12,
            rowSize: 4,
            pageableDepartmentList: [],
            activeTabName: null,
        }
    },
    created() {
        const bookType = this.$route.name.includes('Today') ? 1 : 2

        getDepartments(bookType).then(result => {
            for (const d1 of result) {
                const { childDepts } = d1
                if (childDepts && childDepts.length > 0) {
                    const pages = dividePage(childDepts, this.pageSize, this.rowSize)
                    d1.pageable = {
                        total: childDepts.length,
                        currentPage: 1,
                        pages,
                    }
                }
            }
            this.pageableDepartmentList = result
        })
    },
    methods: {
        ...mapMutations({
            setSession: 'session/set'
        }),
        pageChange(page) {
            this.pageableDepartmentList[this.activeTabName].pageable.currentPage = page
        },
        onClick(department) {
            this.setSession([ 'department', department ])
            const isToday = this.$route.name.includes('Today')
            const routeName = isToday ? 'AppointmentTodayDoctors' : 'AppointmentDoctors'
            this.$router.push({ name: routeName }).catch(err => err)
        }
    }
}
</script>

<style lang="scss" scoped>
.department-tab {
    ::v-deep {
        .el-tabs__content {
            flex-grow: 0.5;
            display: flex;
            flex-direction: column;
        }
    }
}
.department-pagination {
    padding-bottom: 25px;
}
</style>
