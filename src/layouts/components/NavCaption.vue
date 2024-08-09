<template>
    <section class="caption">{{ caption }}</section>
</template>

<script>
export default {
    props: {
        caption: {
            type: String,
            required: true,
        }
    }
}
</script>

<style lang="scss" scoped>
.caption {
    font-size: 30px;
    font-weight: 400;
    color: #000;
    display: flex;
    justify-content: center;
    padding-top: 10px;
}
</style>
