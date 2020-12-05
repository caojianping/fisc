<template>
    <div class="calcluate-rules" @mouseover="isShowList = true" @mouseout="isShowList && (isShowList = false)">
        <span class="rules-box">
            <i class="fa fa-question-circle"></i> {{$t('m.analyzer.calculateRule')}}
        </span>

        <transition name="fade">
            <div class="rules-list" v-show="isShowList">
                <table>
                    <tr v-show="ruleList['hasScheduleFlight']">
                        <td>{{$t('m.analyzer.tableHeader.scheduleFlight')}}</td>
                        <td>{{$t('m.analyzer.calculateRules.scheduleFlight')}}</td>
                    </tr>
                    <tr v-show="ruleList['hasdepOnTimeFlight']">
                        <td>{{$t('m.analyzer.calculateRules.depOnTimeFlight')}}</td>
                        <td>{{$t('m.analyzer.calculateRules.depOnTimeFlightText')}}</td>
                    </tr>
                    <tr v-show="ruleList['hasarrOnTimeFlight']">
                        <td>{{$t('m.analyzer.calculateRules.arrOnTimeFlight')}}</td>
                        <td>{{$t('m.analyzer.calculateRules.arrOnTimeFlightText')}}</td>
                    </tr>
                    <tr v-show="ruleList['hasOntimeFlight']">
                        <td>{{$t('m.analyzer.calculateRules.onTimeFlight')}}</td>
                        <td>{{$t('m.analyzer.calculateRules.ontimeFlight')}}</td>
                    </tr>
                    <tr v-show="ruleList['hasFlightOTP']">
                        <td>{{$t('m.analyzer.tableHeader.flightOTP')}}</td>
                        <td>{{$t('m.analyzer.calculateRules.flightOTP')}}</td>
                    </tr>
                    <tr v-show="ruleList['hasDepFlightOTP']">
                        <td>{{$t('m.analyzer.tableHeader.depFlightOTP')}}</td>
                        <td>{{$t('m.analyzer.calculateRules.depFlightOTP')}}</td>
                    </tr>
                    <!--机场滑行标准时长-->
                    <tr v-show="ruleList['hasTaxiout']">
                        <td>{{$t('m.analyzer.calculateRules.taxiout')}}</td>
                        <td>{{$t('m.analyzer.calculateRules.taxioutText')}}</td>
                    </tr>
                    <!--总量-->
                    <tr v-show="ruleList['hasTotal']">
                        <td>{{$t('m.analyzer.tableHeader.total')}}</td>
                        <td>{{$t('m.analyzer.calculateRules.total')}}</td>
                    </tr>
                    <!--排名-->
                    <tr v-show="ruleList['hasRank']">
                        <td>{{$t('m.analyzer.tableHeader.rank')}}</td>
                        <td>{{$t('m.analyzer.calculateRules.rank')}}</td>
                    </tr>
                    <!--出港准点率-->
                    <tr v-show="ruleList['hasdepOTP']">
                        <td>{{$t('m.analyzer.tableHeader.depOTP')}}</td>
                        <td>{{$t('m.analyzer.calculateRules.depOTP')}}</td>
                    </tr>
                    <!--出港平均延误时长-->
                    <tr v-show="ruleList['hasaverageDEPDelayTime']">
                        <td>{{$t('m.analyzer.tableHeader.averageDEPDelayTime')}}</td>
                        <td>{{$t('m.analyzer.calculateRules.averageDEPDelayTime')}}</td>
                    </tr>
                    <!--出港平均延误时长2-->
                    <tr v-show="ruleList['hasaverageDEPDelayTimeAnother']">
                        <td>{{$t('m.analyzer.tableHeader.averageDEPDelayTime')}}</td>
                        <td>{{$t('m.analyzer.calculateRules.averageDEPDelayTimeAnother')}}</td>
                    </tr>
                    <!--到港准点率-->
                    <tr v-show="ruleList['hasarrOTP']">
                        <td>{{$t('m.analyzer.tableHeader.arrOTP')}}</td>
                        <td>{{$t('m.analyzer.calculateRules.arrOTP')}}</td>
                    </tr>
                    <!--到港平均延误时长-->
                    <tr v-show="ruleList['hasaverageARRDelayTime']">
                        <td>{{$t('m.analyzer.tableHeader.averageARRDelayTime')}}</td>
                        <td>{{$t('m.analyzer.calculateRules.averageARRDelayTime')}}</td>
                    </tr>
                    <!--计划航段时长-->
                    <tr v-show="ruleList['hasscheduledDuration']">
                        <td>{{$t('m.analyzer.tableHeader.scheduledDuration')}}</td>
                        <td>{{$t('m.analyzer.calculateRules.scheduledDuration')}}</td>
                    </tr>
                    <!--实际飞行时长-->
                    <tr v-show="ruleList['hasactualDuration']">
                        <td>{{$t('m.analyzer.tableHeader.actualDuration')}}</td>
                        <td>{{$t('m.analyzer.calculateRules.actualDuration')}}</td>
                    </tr>

                    <!--西南地区计划航班-->
                    <tr v-show="ruleList['hasSouthWestScheduleFlight']">
                        <td>{{$t('m.analyzer.calculateRules.title.southWestScheduleFlight')}}</td>
                        <td>{{$t('m.analyzer.calculateRules.intro.southWestScheduleFlight')}}</td>
                    </tr>
                    <!--西南地区正常航班-->
                    <tr v-show="ruleList['hasSouthWestNormalFlight']">
                        <td>{{$t('m.analyzer.calculateRules.title.southWestNormalFlight')}}</td>
                        <td>{{$t('m.analyzer.calculateRules.intro.southWestNormalFlight')}}</td>
                    </tr>
                    <!--西南地区航班正常率-->
                    <tr v-show="ruleList['hasSouthWestFlightOTP']">
                        <td>{{$t('m.analyzer.calculateRules.title.southWestFlightOTP')}}</td>
                        <td>{{$t('m.analyzer.calculateRules.intro.southWestFlightOTP')}}</td>
                    </tr>
                </table>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        props: ['ruleList'],
        data() {
            return {
                isShowList: false
            }
        }
    }
</script>

<style scoped>
    .calcluate-rules {
        position: fixed;
        top: 80px;
        right: 30px;
        z-index: 10;
    }

    .rules-box {
        font-size: 14px;
        color: #5096fa;
        cursor: pointer;
    }

    .rules-list {
        position: absolute;
        color: #555;
        width: 900px;
        font-size: 15px;
        right: 0;
        padding: 5px;
        background: #f8f8f8;
        border: 1px solid #ddd;
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
        z-index: 10;
    }

    .rules-list > table {
        width: 100%;
        color: #555;
        font-size: 12px;
    }

    .rules-list > table > tr {
        border-bottom: 1px solid #ddd;
        width: 100%;
    }

    .rules-list > table > tr:last-child {
        border: none;
    }

    .rules-list > table > tr > td {
        padding: 5px;
    }

    .rules-list > table > tr > td:first-child {
        font-weight: bold;
        color: #5096fa;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.5s;
    }

    .fade-enter,
    .fade-leave-to {
        opacity: 0;
    }
</style>
