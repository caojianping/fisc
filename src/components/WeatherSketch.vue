<template>
    <div class="sketch">
        <header class="sketch-header">
            <span>{{data.code}}</span>
            <span>{{data.temperature}}℃</span>
        </header>
        <div class="sketch-body">
            <figure class="sketch-figure">
                <img :src="data.weatherIcon" :alt="data.weatherText">
                <span :title="data.weatherText">{{data.weather || '-'}}</span>
            </figure>
            <div class="sketch-kpi">
                <div class="kpi-item">
                    <span>{{$t('m.weather.qnh')}}: {{data.QHN}}hpa</span>
                    <span>{{$t('m.weather.dewPoint')}}: {{data.dewPoint}}℃</span>
                </div>
                <div class="kpi-item">
                    <span>{{$t('m.weather.visibility')}}: {{data.visibility}}m</span>
                    <span>{{$t('m.weather.wind')}}: {{data.wind}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['data']
    }
</script>

<style lang="less" scoped>
    .sketch-header {
        span:first-child {
            display: inline-block;
            margin-right: 30px;
            font-size: 20px;
            color: #333;
        }
    }

    .sketch-body {
        display: flex;
        margin-top: 10px;
        font-size: 13px;
        color: #7b8da0;

        .sketch-figure {
            margin-right: 20px;
            text-align: center;

            img {
                display: block;
                margin: 0 auto;
                margin-bottom: 5px;
                width: 37px;
            }

            span {
                font-size: 14px;
                color: #333;
            }
        }

        .sketch-kpi {
            display: flex;

            .kpi-item {
                &:first-child {
                    margin-right: 18px;
                }

                span {
                    display: block;

                    &:first-child {
                        margin-bottom: 10px;
                    }
                }
            }
        }
    }
</style>


