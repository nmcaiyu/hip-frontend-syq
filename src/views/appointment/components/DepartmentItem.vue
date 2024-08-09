<template>
    <div class="container flex-column flex-align-center" @click="$emit('click')">
        <!-- <svg-icon :icon-class="iconName" /> -->
        <img :src="`${$publicPath}icons/${iconName}.png`">
        <span>{{ label }}</span>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    props: {
        label: {
            required: true,
            type: String
        }
    },
    data() {
        return {
            iconName: 'medicine-stethoscope'
        }
    },
    computed: {
        ...mapState({
            departmentIcon: state => state.constant.departmentIcon
        }),
    },
    created() {
        for (const key of Object.keys(this.departmentIcon)) {
            if (this.label.includes(key)) {
                this.iconName = this.departmentIcon[key]
                break
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    width: 187px;
    height: 92px;
    border-radius: 11px;
    background: #3A8FFF;
    color: #FFF;
    cursor: pointer;
    padding: 10px 10px 5px;
    // .svg-icon {
    //     font-size: 70px;
    // }
    img {
        width: 40px;
    }
    span {
        padding-top: 10px;
        font-size: 18px;
        font-weight: 500;
        text-align: center;
    }
}
</style>
