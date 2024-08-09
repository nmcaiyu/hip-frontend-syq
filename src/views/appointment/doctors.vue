<template>
    <div class="main-container flex-grow flex-column">
        <timer />
        <nav-caption :caption="department.deptName" />
        <section class="main-section flex-grow flex-column">
            <el-tabs
                v-model="activeTabName"
                class="doctor-tab flex-grow flex-column"
            >
                <el-tab-pane
                    v-for="(t, i1) in tabs"
                    :key="i1"
                    :label="t.label"
                    :name="i1.toString()"
                    class="flex-grow flex-column"
                >
                    <template v-if="t.pageable && t.pageable.total > 0">
                        <div
                            class="flex-grow flex-column"
                        >
                            <div class="doctor-list-wrapper flex flex-column flex-align-stretch">
                                <div
                                    v-for="(row, i2) in t.pageable.pages[t.currentPage - 1]"
                                    :key="i2"
                                    class="doctor-row flex flex-justify-between"
                                >
                                    <template v-for="(d, i3) in row">
                                        <doctor-item-new
                                            v-if="d"
                                            :key="i3"
                                            :doctor="d"
                                            @click="choose(d)"
                                        />
                                        <doctor-item-new-empty
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
                            :total="t.pageable.total"
                            :page-size="option.doctorListPageSize"
                            hide-on-single-page
                            @current-change="pageChange"
                            class="doctor-pagination flex flex-justify-center"
                        />
                    </template>
                </el-tab-pane>
            </el-tabs>
        </section>
        <nav-footer class="nav-footer" />
        <audio-tip name="choose-doctor" />
    </div>
</template>

<script>
import Timer from '@/layouts/components/Timer.vue'
import NavFooter from '@/layouts/components/NavFooter.vue'
import NavCaption from '@/layouts/components/NavCaption.vue'
import DoctorItemNew from './components/DoctorItemNew.vue'
import DoctorItemNewEmpty from './components/DoctorItemNewEmpty.vue'
import { mapState, mapMutations } from 'vuex'
import { getDepartmentDoctors } from '@/api'
import { dividePage } from '@/utils/helper'
import AudioTip from '@/components/AudioTip'

export default {
    components: {
        Timer,
        NavFooter,
        NavCaption,
        DoctorItemNew,
        DoctorItemNewEmpty,
        AudioTip
    },
    data() {
        return {
            rowSize: 3,
            activeTabName: null,
            tabs: [
                {
                    label: '普通号',
                    pageable: null,
                    currentPage: 1
                },
                {
                    label: '专家号',
                    pageable: null,
                    currentPage: 1
                }
            ]
        }
    },
    computed: {
        ...mapState({
            department: state => state.session.department,
            option: state => state.option
        })
    },
    created() {
        const bookType = this.$route.name.includes('Today') ? 1 : 2
        const isAll = bookType === 1 ? 0 : 1
        const data = {
            deptCode: this.department.deptCode,
            bookType,
            isAll,
        }

        getDepartmentDoctors(data).then(result => {
            let list = result['0']
            let pages = dividePage(list, this.option.doctorListPageSize, this.rowSize)
            this.tabs[0].pageable = {
                total: list.length,
                pages
            }

            list = result['1']
            pages = dividePage(list, this.option.doctorListPageSize, this.rowSize)
            this.tabs[1].pageable = {
                total: list.length,
                pages
            }
        })
    },
    methods: {
        ...mapMutations({
            setSession: 'session/set'
        }),
        pageChange(page) {
            this.tabs[this.activeTabName].currentPage = page
        },
        choose(doctor) {
            this.setSession([ 'doctor', doctor ])
            const isToday = this.$route.name.includes('Today')
            const routeName = isToday ? 'AppointmentTodayDoctorSchedule' : 'AppointmentDoctorSchedule'
            this.$router.push({ name: routeName }).catch(err => err)
        }
    }
}
</script>

<style lang="scss" scoped>
.doctor-list-wrapper {
    /* gap: 30px; */
    .doctor-row {
        margin-top: 30px;
    }
    .doctor-row:first-child {
        margin-top: 0;
    }
}
.doctor-pagination {
    padding-bottom: 10px;
}
.doctor-tab {
    ::v-deep {
        .el-tabs__content {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            padding-top: 20px;
        }

        .el-tabs__item {
            padding: 0 40px;
        }

        .el-tabs__item.is-top:nth-child(2) {
            padding-left: 40px;
        }

        .el-tabs__item.is-top:last-child {
            padding-right: 40px;
        }
    }
}
</style>
