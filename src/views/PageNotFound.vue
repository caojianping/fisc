<template>
    <div>
        <FISCHeader></FISCHeader>

        <div class="fisc-main">
            <div class="fisc-container">
                <figure>
                    <img :src="error404" alt="404 Not Found!">
                </figure>
                <p>{{$t('m.error.pageNotFound')}}</p>
            </div>
        </div>

        <FISCFooter></FISCFooter>
    </div>
</template>

<script>
    import FISCHeader from 'src@/components/FISCHeader.vue';
    import FISCFooter from 'src@/components/FISCFooter.vue';
    import error404 from 'src@/images/404-1.png';

    export default {
        components: {
            FISCHeader,
            FISCFooter
        },
        data() {
            return {
                error404: error404
            };
        }
    }
</script>

<style lang="less" scoped>
    .fisc-container {
        padding: 120px 0;

        figure {
            display: block;
            margin: auto;
            width: 128px;
            height: 128px;

            img {
                margin: auto;
                width: 100%;
                height: 100%;
            }
        }

        p {
            height: 30px;
            font-size: 14px;
            line-height: 30px;
            font-weight: bold;
            color: #333;
            text-align: center;
        }
    }
</style>


