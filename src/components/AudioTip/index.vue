<template>
    <audio ref="audio" :src="src" />
</template>

<script>
export default {
    props: {
        name: {
            type: String,
            required: true
        }
    },
    computed: {
        src() {
            try {
                return require(`@/assets/audio/${this.name}.mp3`)
            } catch {
                return ''
            }
        }
    },
    mounted() {
        this.$refs.audio.play()
    }
}
</script>