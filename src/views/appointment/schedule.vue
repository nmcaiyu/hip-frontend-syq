<template>
    <div class="main-container flex-grow flex-column">
        <timer />
        <nav-caption :caption="caption" />
        <section class="main-section flex-grow flex-column">
            <el-tabs
                v-model="activeTabName"
                class="schedule-tab flex-grow flex-column"
            >
                <el-tab-pane
                    v-for="(s1, i1) in schedule"
                    :key="i1"
                    :label="s1.label"
                    :name="i1.toString()"
                    class="flex-grow flex-column tab-pane"
                    :disabled="!s1.schedule || s1.schedule.length === 0"
                >
                    <schedule-item
                        v-for="(s2, i2) in s1.schedule"
                        :key="i2"
                        :schedule="s2"
                        class="schedule-item"
                    />
                </el-tab-pane>
            </el-tabs>
        </section>
        <nav-footer class="nav-footer" />
        <audio-tip name="choose-appointment-time" />
    </div>
</template>

<script>
import Timer from '@/layouts/components/Timer.vue'
import NavFooter from '@/layouts/components/NavFooter.vue'
import NavCaption from '@/layouts/components/NavCaption.vue'
import ScheduleItem from './components/ScheduleItem.vue'
import { mapState } from 'vuex'
import { getDate, formatDate } from '@/utils/helper'
// import { getDoctorSchedule } from '@/api'
import AudioTip from '@/components/AudioTip'

export default {
    components: {
        Timer,
        NavFooter,
        NavCaption,
        ScheduleItem,
        AudioTip
    },
    data() {
        return {
            pageSize: 3,
            schedule: [],
            activeTabName: null,
            defaultActiveTabName: null,
        }
    },
    computed: {
        ...mapState({
            doctor: state => state.session.doctor,
            weekdays: state => state.constant.weekdays
        }),
        caption() {
            let c = this.doctor.doctorName
            if (this.doctor.rank && this.doctor.rank !== '') {
                c += ` (${this.doctor.rank})`
            }
            return c
        }
    },
    mounted() {
        const isToday = this.$route.name.includes('Today')
        // 奈曼旗人民医院
        if (isToday) {
            const { schedules } = this.doctor
            if (!schedules || schedules.length <= 0) return false
            const d = getDate()
            if (formatDate(d) !== schedules[0].regDate) return false
            const label = `今天(${formatDate(d, { type: 'short' })})`
            const t = { label, schedule: schedules }
            this.schedule.push(t)
        }
        // 呼市第一医院
        // const bookType = isToday ? 1 : 2
        // const data = {
        //     doctorCode: this.doctor.doctorCode,
        //     deptCode: this.doctor.deptCode,
        //     bookType,
        // }
        // if (isToday) {
        //     data.regDate = formatDate(getDate())
        // }
        // getDoctorSchedule(data).then(result => {
        //     if (isToday) {
        //         const { schedules } = result
        //         if (!schedules || schedules.length <= 0) return false
        //         const d = getDate()
        //         if (formatDate(d) === schedules[0].regDate) {
        //             const label = `今天(${formatDate(d, { type: 'short' })})`
        //             const t = { label, schedule: schedules }
        //             this.schedule.push(t)
        //         }
        //     } else {
        //         const { groupSchedules } = result
        //         if (!groupSchedules || groupSchedules.length <= 0) return false
        //         for (let i = 1; i <= 7; i++) {
        //             const d = getDate(i)
        //             let label = i === 1 ? '明天' : `周${this.weekdays[d.getDay()]}`
        //             label += `(${formatDate(d, { type: 'short' })})`
        //             const t = { label }
        //             const matched = groupSchedules.filter(item => item[0].regDate === formatDate(d))
        //             // const matched = groupSchedules
        //             if (matched.length > 0) {
        //                 t.schedule = matched[0]
        //                 if (!this.defaultActiveTabName) {
        //                     this.defaultActiveTabName = (i - 1).toString()
        //                     this.activeTabName = this.defaultActiveTabName
        //                 }
        //             }
        //             this.schedule.push(t)
        //         }
        //     }
        // })
    }
}
</script>

<style lang="scss" scoped>
.tab-pane {
    padding-top: 30px;
    /* row-gap: 30px; */
    .schedule-item {
        margin-top: 30px;
    }
    .schedule-item:first-child {
        margin-top: 0;
    }
}
</style>
