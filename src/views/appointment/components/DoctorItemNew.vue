<template>
    <div class="doctor-container flex-column" @click="$emit('click')">
        <div class="basic-info flex flex-align-center">
            <div class="avatar flex flex-justify-center flex-align-center">
                <img src="~@/assets/image/doctor-item-avatar-male.png" />
            </div>
            <div class="info-wrapper flex-column">
                <span class="doctor-name">{{ doctor.doctorName }}</span>
                <div class="doctor-title">
                    <span v-if="doctor.rank && doctor.rank !== ''">{{ doctor.rank }} | </span>
                    <span v-if="doctor.typeCode === 0">普通</span>
                    <span v-if="doctor.typeCode === 1">专家</span>
                </div>
            </div>
        </div>
        <div class="extra-info flex">
            <svg-icon icon-class="hospital" />
            <span v-if="doctor.schedules">挂号费：{{ doctor.schedules[0].totalFee }} 元</span>
        </div>
        <div class="extra-info flex">
            <svg-icon icon-class="hospital" />
            <span v-if="doctor.schedules">科室：{{ doctor.deptName }}</span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        doctor: {
            type: Object,
            required: true
        },
    }
}
</script>

<style lang="scss" scoped>
.doctor-container {
    background-image: url('~@/assets/image/doctor-item-background.png');
    color: #fff;
    border-radius: 10px;
    padding: 15px;
    cursor: pointer;
    width: 272px;
    height: 178px;
    /* row-gap: 10px; */
}
.basic-info {
    /* column-gap: 20px; */
    .info-wrapper {
        margin-left: 20px;
    }
}
.avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
}
.info-wrapper {
    /* row-gap: 5px; */
    .doctor-title {
        margin-top: 5px;
    }
}
.doctor-name {
    font-size: 22px;
    font-weight: bold;
}
.doctor-title, .extra-info {
    font-size: 14px;
}
.extra-info {
    margin-top: 10px;
    /* column-gap: 5px; */
    span {
        margin-left: 5px;
    }
    .svg-icon {
        margin-top: 1px
    }
}
</style>
