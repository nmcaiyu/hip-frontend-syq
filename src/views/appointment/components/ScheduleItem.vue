<template>
    <div class="schedule-item-container flex flex-align-stretch">
        <div class="ampm flex flex-justify-center flex-align-center">全天</div>
        <div class="info flex-grow flex flex-wrap flex-align-center">
            <el-descriptions
                :column="2"
                label-class-name="el-descriptions-label-content"
                content-class-name="el-descriptions-label-content"
            >
                <el-descriptions-item label="时段">08:00-17:30</el-descriptions-item>
                <el-descriptions-item label="挂号费">{{ schedule.regFee | currency }} 元</el-descriptions-item>
                <el-descriptions-item label="剩余">{{ schedule.haveCount }}</el-descriptions-item>
                <el-descriptions-item label="诊疗费">{{ schedule.treatFee | currency }} 元</el-descriptions-item>
            </el-descriptions>
        </div>
        <div class="operation flex flex-align-center">
            <button
                class="button flex flex-justify-center flex-align-center"
                @click="choose"
            >选择</button>
        </div>
        <!--
        <el-drawer
            ref="drawer"
            :visible.sync="drawer"
            direction="btt"
            class="drawer"
        >
            <span slot="title" class="drawer-title">选择就诊时间</span>
            <el-collapse class="collapse" accordion>
                <el-collapse-item
                    v-for="(period, i1) in schedule.appoNums"
                    :key="i1"
                    :title="period.beginEndTime"
                >
                    <div class="period-wrapper flex">
                        <div
                            v-for="(point, i2) in period.appoNumDetails"
                            :key="i2"
                            class="period-item"
                            @click="choosePoint(point)"
                        >
                            {{ point.appoTime }}
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </el-drawer>
        -->
    </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
    props: {
        schedule: {
            type: Object,
            required: true
        }
    },
    // 呼市第一医院
    // data() {
    //     return {
    //         drawer: false
    //     }
    // },
    computed: {
        ampm() {
            return parseInt(this.schedule.phaseDesc.slice(0, 2)) <= 12 ? '上午' : '下午'
        }
    },
    // 呼市第一医院
    // mounted() {
    //     this.$refs.drawer.$el.getElementsByClassName('el-drawer').item(0).style.height = '40%'
    // },
    methods: {
        ...mapMutations({
            setSession: 'session/set'
        }),
        // 奈曼旗人民医院
        choose() {
            this.setSession([ 'appointmentTimePeriod', this.schedule ])
            this.$router.push({ name: 'AppointmentConfirmation' }).catch(err => err)
        }
        // 呼市第一医院
        // choose() {
        //     this.drawer = true
        // },
        // choosePoint(point) {
        //     this.drawer = false
        //     this.setSession([ 'appointmentTimePeriod', this.schedule ])
        //     this.setSession([ 'appointmentTimePoint', point ])
        //     this.$router.push({ name: 'AppointmentConfirmation' }).catch(err => err)
        // }
    }
}
</script>

<style lang="scss" scoped>
.schedule-item-container {
    border: 1px solid #3A8FFF;
    border-radius: 10px;
}
.ampm {
    min-width: 50px;
    border-radius: 10px 0 0 10px;
    background-color: #3A8FFF;
    font-size: 24px;
    color: #FFFFFF;
    padding: 0 10px;
}
.info {
    font-size: 30px;
    padding: 20px 30px;
}
.operation {
    padding-right: 20px;
}
.button {
    min-width: 150px;
    height: 80px;
    border: none;
    border-radius: 10px;
    background-color: #3A8FFF;
    font-size: 30px;
    color: #FFFFFF;
}
.collapse {
    padding: 20px 20px 0;
    ::v-deep {
        .el-drawer.btt {
            height: 45%;
        }
    }
}
.period-wrapper {
    gap: 20px 20px;
    padding-top: 20px;
}
.period-item {
    background: #3A8FFF;
    font-size: 30px;
    color: #FFFFFF;
    padding: 10px 20px;
    cursor: pointer;
}
</style>
