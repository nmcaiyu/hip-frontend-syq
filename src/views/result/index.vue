<template>
    <div class="main-container flex-grow flex-column">
        <timer :start="20" :redirect="routeName" />
        <section class="main-section flex-grow flex-column">
            <el-result class="result" :icon="icon" :title="title" :subTitle="subTitle">
                <template slot="extra">
                    <button class="button" @click="onClick">{{ buttonLabel }}</button>
                </template>
            </el-result>
        </section>
    </div>
</template>

<script>
import Timer from '@/layouts/components/Timer.vue'
export default {
    components: {
        Timer,
    },
    data() {
        return {
            routeName: 'Home',
            buttonLabel: '返回主页',
        }
    },
    computed: {
        icon() {
            const icons = [ 'success', 'warning', 'error', 'info' ]
            const { icon } = this.$route.params 
            return icon && icons.includes(icon) ? icon : 'info'
        },
        title() {
            return this.$route.params.title
        },
        subTitle() {
            return this.$route.params.subTitle
        },
        redirect() {
            return this.$route.params.redirect
        },
        buttonText() {
            return this.$route.params.buttonText
        }
    },
    mounted() {
        if (this.redirect) this.routeName = this.redirect
        if (this.buttonText) this.buttonLabel = this.buttonText
    },
    methods: {
        onClick() {
            this.$router.push({ name: this.routeName }).catch(err => err)
        }
    }
}
</script>

<style lang="scss" scoped>
.button {
    border: none;
    border-radius: 10px;
    background-color: #3A8FFF;
    color: #FFFFFF;
    padding: 20px 60px;
    cursor: pointer;
    font-size: 40px;
    margin-bottom: 50px;
}
</style>