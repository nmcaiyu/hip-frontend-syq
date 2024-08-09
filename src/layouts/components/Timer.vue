<template>
    <div class="timer">
        <span v-if="countdown >= 0">{{ countdown }}</span>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
    props: {
        start: Number,
        redirect: {
            type: String,
            default: 'Home'
        }
    },
    computed: {
        ...mapState({
            countdown: state => state.session.timerCountdown,
            intervalId: state => state.session.timerIntervalId
        })
    },
    watch: {
        countdown(seconds) {
            if (seconds <= 0) {
                this.resetTimer(this.start).then(() => {
                    this.$router.push({ name: this.redirect }).catch(err => err)
                })
            }
        }
    },
    mounted() {
        this.resetTimer(this.start).then(() => {
            this.startTimer()
        })
    },
    beforeDestroy() {
        this.resetTimer()
    },
    methods: {
        ...mapActions({
            resetTimer: 'session/resetTimer',
            startTimer: 'session/startTimer'
        }),
    }
}
</script>

<style lang="scss" scoped>
.timer {
    display: flex;
    justify-content: flex-end;
    font-size: 50px;
    color: red;
}
</style>
