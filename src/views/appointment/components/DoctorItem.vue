<template>
    <div class="doctor-container flex flex-align-center">
        <div class="info flex-grow flex flex-justify-between">
            <div>
                <span>{{ doctor.doctorName }}</span>
                <span v-if="doctor.rank && doctor.rank !== ''"> ({{ doctor.rank }})</span>
            </div>
            <div>
                <span v-if="doctor.typeCode === 0">普通号</span>
                <span v-if="doctor.typeCode === 1">专家号</span>
            </div>
            <div>
                <span v-if="doctor.schedules && doctor.schedules.length > 0">费用：{{ doctor.schedules[0].totalFee }} 元</span>
            </div>
            <!--
            <div
                v-if="truncatedBeProficientAt"
                class="beProficientAt"
            >
                擅长：{{ truncatedBeProficientAt }}
            </div>
            -->
        </div>
        <button
            class="button flex flex-justify-center flex-align-center"
            @click="choose"
        >选择</button>
    </div>
</template>

<script>
import _ from 'lodash'
import { mapMutations } from 'vuex'

export default {
    props: {
        doctor: {
            type: Object,
            required: true
        },
    },
    computed: {
        truncatedBeProficientAt () {
            if (this.doctor.doctorSkill && this.doctor.doctorSkill !== '') {
                return _.truncate(this.doctor.doctorSkill, { length: 24 })
            } else {
                return false
            }
        }
    },
    methods: {
        ...mapMutations({
            setSession: 'session/set'
        }),
        choose () {
            this.setSession([ 'doctor', this.doctor ])
            const isToday = this.$route.name.includes('Today')
            const routeName = isToday ? 'AppointmentTodayDoctorSchedule' : 'AppointmentDoctorSchedule'
            this.$router.push({ name: routeName }).catch(err => err)
        }
    }
}
</script>

<style lang="scss" scoped>
.doctor-container {
    border: 1px solid #3A8FFF;
    border-radius: 10px;
    padding: 20px;
    cursor: pointer;
}
.info {
    padding-right: 20px;
    font-size: 30px;
}
.beProficientAt {
    padding-top: 10px;
    color: #999;
}
.button {
    min-width: 150px;
    height: 100px;
    border: none;
    border-radius: 10px;
    background-color: #3A8FFF;
    font-size: 30px;
    color: #FFFFFF;
}
</style>
