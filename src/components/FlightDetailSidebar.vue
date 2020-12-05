<template>
    <div class="aside-adsb-info" style="left: 0;">
        <div class="close-btn" @click="closeAsidePanel"></div>

        <div class="aside-adsb-info-main">
            <div class="aside-adsb-info-content">
                <div class="aside-codes">
                    <div class="aside-code-text">
                        <img src="../images/adsb_03.png" alt="">
                        <span class="aside-code3">{{ detailsDataList.code3 }}</span>
                        <span class="aside-code2">/{{ detailsDataList.code2 }}</span>
                        <span class="aside-airline">{{ detailsDataList.airline }}</span>
                    </div>
                </div>
                <div class="aside-info-2">
                    <div class="airport-info">
                        <div class="details-info-flex">
                            <div class="details-airport forg">
                                <strong>{{ detailsDataList.forg }}</strong>
                            </div>
                            <div class="airport-icon"><img src="../images/adsb_07.png" alt=""></div>
                            <div class="details-airport fdst">
                                <strong>{{ detailsDataList.fdst }}</strong>
                            </div>
                        </div>
                        <div class="airport-en-name">
                            <div class="details-airport forg">
                                <span>{{ detailsDataList.forgName }}</span>
                            </div>
                            <div class="details-airport fdst">
                                <span>{{ detailsDataList.fdstName }}</span>
                            </div>
                        </div>
                        <div class="process-main">
                            <div class="prpcess-bar">
                                <div class="finish-process" :style="{width: detailsDataList.processPrecent || 0}"></div>
                                <div class="finish-circle" :style="{left: detailsDataList.processPrecent || 0}"></div>
                            </div>
                        </div>
                        <div class="finish-info" v-show="detailsDataList.distance || detailsDataList.time">
                            <span>{{ detailsDataList.distance }}</span>
                            <span>{{ detailsDataList.time }}</span>
                            <span>{{$t('m.adsb.detail.AGO')}}</span>
                        </div>
                    </div>
                    <div class="table-info-main">
                        <table>
                            <tbody>
                            <tr>
                                <td>
                                    <span>{{$t('m.adsb.detail.STD')}}</span>
                                    <span>{{detailsDataList.STD}}</span>
                                </td>
                                <td>
                                    <span>{{$t('m.adsb.detail.STA')}}</span>
                                    <span>{{detailsDataList.STA}}</span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span>{{$t('m.adsb.detail.ATD')}}</span>
                                    <span>{{detailsDataList.ATD}}</span>
                                </td>
                                <td>
                                    <span>{{$t('m.adsb.detail.ETA')}}</span>
                                    <span>{{detailsDataList.ETA}}</span>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div id="speed-height-chart"></div>
                </div>
                <div class="flight-detail-info">
                    <ul>
                        <li>
                            <div>
                                <span>{{ $t('m.flightDetailsText.distance') }}</span>
                            </div>
                            <div>
                                <span>{{ detailsDataList.totalDistance }}</span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <span>{{ $t('m.flightDetailsText.duration') }}</span>
                            </div>
                            <div>
                                <span>{{ detailsDataList.duration }}</span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <span>{{ $t('m.flightDetailsText.type') }}</span>
                            </div>
                            <div>
                                <span>{{ detailsDataList.type }}</span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <span>{{ $t('m.flightDetailsText.registration') }}</span>
                            </div>
                            <div>
                                <span>{{ detailsDataList.anum }}</span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <span>{{ $t('m.flightDetailsText.height') }}</span>
                            </div>
                            <div>
                                <span>{{ detailsDataList.height }}</span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <span>{{ $t('m.flightDetailsText.track') }}</span>
                            </div>
                            <div>
                                <span>{{ detailsDataList.angle }}</span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <span>{{ $t('m.flightDetailsText.speed') }}</span>
                            </div>
                            <div>
                                <span>{{ detailsDataList.speed }}</span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <span>{{ $t('m.flightDetailsText.lat') }}</span>
                            </div>
                            <div>
                                <span>{{ detailsDataList.lat }}</span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <span>{{ $t('m.flightDetailsText.long') }}</span>
                            </div>
                            <div>
                                <span>{{ detailsDataList.long }}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['detailsDataList'],
        methods: {
            closeAsidePanel() {
                this.$emit('close');
            }
        }
    };
</script>

<style scoped>
    .aside-adsb-info {
        position: absolute;
        bottom: 0;
        top: 0;
        left: -325px;
        z-index: 9998;
        background-color: white;
        -moz-transition: all .5s;
        -webkit-transition: all .5s;
        transition: all .5s;
        -webkit-box-shadow: 3px 0 12px rgba(0, 0, 0, 0.19);
        box-shadow: 3px 0 12px rgba(0, 0, 0, 0.19);
    }

    .aside-adsb-info > .close-btn {
        position: absolute;
        top: 25px;
        right: -12px;
        display: block;
        width: 15px;
        height: 40px;
        background-color: white;
        cursor: pointer;
        box-shadow: 3px 0 12px rgba(0, 0, 0, 0.19);
    }

    .aside-adsb-info > .close-btn::after {
        position: absolute;
        top: 14px;
        left: -3px;
        display: block;
        width: 0;
        height: 0;
        border-top: 6px solid transparent;
        border-right: 6px solid gray;
        border-bottom: 6px solid transparent;
        border-left: 6px solid transparent;
        content: "";
    }

    .aside-adsb-info > .aside-adsb-info-main {
        width: 320px;
        height: 100%;
        overflow-y: auto;
    }

    .aside-adsb-info > .aside-adsb-info-main::-webkit-scrollbar {
        width: 2px;
    }

    .aside-adsb-info > .aside-adsb-info-main::-webkit-scrollbar-thumb {
        border-radius: 2px;
    }

    .aside-adsb-info > .aside-adsb-info-main::-webkit-scrollbar-track {
        background: transparent;
    }

    .aside-codes {
        height: 90px;
        border-bottom: solid 1px #c8d2e0;
        font-size: 16px;
        position: relative;
    }

    .aside-codes img {
        margin-top: 3px;
    }

    .aside-code3 {
        font-size: 30px;
    }

    .aside-code-text {
        padding: 10px 0 10px 10px;
    }

    .aside-code-text span:last-child {
        display: block;
        margin-left: 32px;
    }

    .aside-info-2 {
        padding: 10px;
        border-bottom: solid 1px #c8d2e0;
    }

    .details-info-flex,
    .airport-en-name {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
    }

    .details-airport {
        width: 120px;
    }

    .airport-icon {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
    }

    .details-airport strong {
        display: block;
        font-size: 26px;
    }

    .details-airport.forg {
        text-align: center;
    }

    .details-airport.fdst {
        text-align: center;
    }

    .details-airport.forg span,
    .details-airport.fdst span {
        word-wrap: break-word;
    }

    .process-main {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        width: 100%;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        margin-top: 15px;
    }

    .process-main .prpcess-bar {
        width: 254px;
        height: 2px;
        position: relative;
        border-radius: 1px;
        background: #dfe5ed;
    }

    .process-main .finish-process {
        background-color: #4088e5;
        width: 50%;
        height: 2px;
        border-radius: 1px;
        position: absolute;
    }

    .process-main .finish-circle {
        width: 7px;
        height: 7px;
        border-radius: 7px;
        border: solid 1px #4d90e7;
        background: #fff;
        position: absolute;
        top: -3px;
        left: 50%;
    }

    .finish-info {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
    }

    .finish-info span {
        margin-right: 10px;
        margin-top: 7px;
        margin-bottom: 10px;
    }

    .table-info-main {
        padding: 20px 10px;
    }

    .table-info-main table {
        width: 100%;
        border-bottom: solid 1px #e6e6e6;
        border-top: solid 1px #e6e6e6;
    }

    .table-info-main table td {
        padding: 8px;
        border-bottom: solid 1px #e6e6e6;
    }

    .table-info-main table tr:nth-last-child(1) td {
        border-bottom: none;
    }

    .table-info-main table tr td:first-child {
        border-right: solid 1px #e6e6e6;
    }

    .table-info-main table td span:first-child {
        float: left;
    }

    .table-info-main table td span:last-child {
        float: right;
    }

    .table-info-main table td span {
        font-weight: bold;
    }

    #speed-height-chart {
        padding: 10px;
        height: 200px;
        width: 100%;
    }

    .flight-detail-info {
        padding: 20px;
    }

    .flight-detail-info li {
        padding: 10px 0;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
    }

    .flight-detail-info li div {
        display: inline-block;
    }

    .flight-detail-info li div:first-child {
        width: 110px;
        font-weight: bold;
    }
</style>

