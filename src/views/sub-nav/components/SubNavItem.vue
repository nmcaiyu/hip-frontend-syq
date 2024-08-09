<template>
    <div
        class="sub-nav-button flex-column flex-align-center"
        :style="{ background: backgroundColor }"
        @click="$emit('click')"
    >
        <!-- <svg-icon :icon-class="iconName" /> -->
        <img :src="`${$publicPath}icons/${iconName}.png`">
        <span class="label flex flex-justify-center">{{ label }}</span>
    </div>
</template>

<script>

export default {
    props: {
        backgroundColor: {
            type: String,
            required: true
        },
        iconName: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true
        }
    }
}
</script>

<style lang="scss" scoped>
.sub-nav-button {
    width: 262px;
    border-radius: 10px;
    padding: 20px 5px;
    cursor: pointer;
}
// .svg-icon {
//     font-size: 150px;
//     color: #FFFFFF;
// }
img {    
    width: 80px;
}
.label {
    padding-top: 20px;
    font-size: 30px;
    color: #FFFFFF;
}
</style>