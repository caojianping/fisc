<template>
    <div :class="['loading', {shadow: !!isShadow}]">
        <img class="loading-img" :src="loadingImg" alt="loading...">
        <span class="loading-text">{{loadingText}}</span>
    </div>
</template>

<script>
    import loadingImg from 'src@/images/loading.gif';

    export default {
        props: ['isShadow'],
        data() {
            return {
                loadingImg: loadingImg,
                loadingText: 'Loading…'
            };
        }
    };
</script>

<style lang="less" scoped>
    .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        min-height: 168px;
        background-color: transparent;

        &.shadow {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 9999;
            background-color: rgba(0, 0, 0, .08);
        }

        .loading-img {
            display: inline-block;
            width: 32px;
            height: 32px;
        }

        .loading-text {
            display: inline-block;
            margin-left: 10px;
            width: 88px;
            height: 32px;
            font-size: 16px;
            line-height: 32px;
            font-weight: bold;
        }
    }
</style>

