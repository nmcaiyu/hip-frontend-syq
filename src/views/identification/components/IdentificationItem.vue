<template>
    <div
        class="identification-item"
        @click="$emit('click')"
    >
        <div class="image-wrapper flex flex-justify-center">
            <img class="image" :src="imgSrc" />
        </div>
        <span class="identification-label flex flex-justify-center">
            {{ label }}
        </span>
    </div>
</template>

<script>

export default {
    props: {
        imgSrc: {
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
.identification-item {
    width: 280px;
    padding: 16px;
    border: 2px solid #BCD5DD;
    border-radius: 10px;
    cursor: pointer;
}
.image-wrapper {
    background: #EAE7E2;
    padding: 20px 0;
    border-radius: 10px;
    .image {
        width: 200px;
    }
}
.identification-label {
    color: #4F8FFF;
    font-size: 22px;
    padding: 14px;
    padding-bottom: 0;
}
</style>
