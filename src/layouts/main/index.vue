<template>
    <div class="app-container flex-column flex-grow">
        <section v-if="option.showBanner" class="banner-container" />
        <router-view :key="$route.path" />
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    computed: {
        ...mapState({
            option: state => state.option
        })
    }
}
</script>

<style lang="scss" scoped>
.banner-container {
    background-image: url('~@/assets/layouts/banner.jpg');
    background-size: 100% 100%;
    background-repeat: no-repeat;
}
</style>
