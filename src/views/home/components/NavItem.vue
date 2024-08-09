<template>
    <div class="nav-button flex-column" @click="$emit('click')">
        <div
            class="nav-icon flex flex-justify-center flex-align-center"
            :style="{ background: backgroundColor }"
        >
            <!-- <svg-icon :icon-class="iconName" /> -->
            <img :src="`${$publicPath}icons/${iconName}.png`">
        </div>
        <div class="label flex flex-justify-center">{{ label }}</div>
        <div v-if="mongolianWords" class="mongolian flex flex-justify-center sxt">
            <span v-for="(w, i) in mongolianWords" :key="i">{{ w }}</span>
        </div>
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
        routeName: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        mongolianWords: {
            type: Array,
            // required: true
        }
    }
}
</script>

<style lang="scss" scoped>
.nav-button {
    width: 160px;
    .label {
        font-size: 24px;
        padding-top: 15px;
    }
}
.nav-icon {    
    width: 160px;
    height: 160px;
    // .svg-icon {
    //     font-size: 120px;
    //     color: #FFFFFF;
    // }
    img {
        width: 120px;
    }
    border-radius: 60px/60px;
}
.mongolian {
    height: 50px;
    padding-top: 15px;
    font-size: 18px;
    /* font-weight: 400; */
    span {
        writing-mode: vertical-lr;
    }
}
</style>
