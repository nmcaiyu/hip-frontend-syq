<template>
    <div
        class="sub-nav-button flex-column flex-align-center"
        @click="$emit('click')"
    >
        <!-- <svg-icon :icon-class="iconName" :style="{ color: iconColor }" /> -->
        <img :src="`${$publicPath}icons/${iconName}.png`">
        <span class="label flex flex-justify-center">{{ label }}</span>
    </div>
</template>

<script>

export default {
    props: {
        label: {
            type: String,
            required: true
        },
        iconName: {
            type: String,
            required: true
        },
        iconColor: {
            type: String,
            required: true
        }
    }
}
</script>

<style lang="scss" scoped>
.sub-nav-button {
    width: 280px;
    border-radius: 10px;
    padding: 20px 5px 30px;
    cursor: pointer;
    background: #F0F5FF;
}
// .svg-icon {
//     font-size: 150px;
//     color: #FFFFFF;
// }
img {
    width: 150px;
}
.label {
    padding-top: 20px;
    font-size: 30px;
    color: #000;
}
</style>