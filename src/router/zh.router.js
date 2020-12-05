import Login from 'src@/views/Login.vue';
import Home from 'src@/views/Home.vue';
import Flight from 'src@/views/Flight.vue';
import ADSB from 'src@/views/ADS-B.vue';
import Weather from 'src@/views/Weather.vue';

import Operation from 'src@/views/Operation.vue';
import OperationWave from 'src@/components/operation/OperationWave.vue';
import OperationInfo from 'src@/components/operation/OperationInfo.vue';
import OperationRate from 'src@/components/operation/OperationRate.vue';

import Analyzer from 'src@/views/Analyzer.vue';
import AnalyzerRank from 'src@/components/analyzer/Rank.vue';
import AnalyzerAviation from 'src@/components/analyzer/Aviation.vue';
import AnalyzerEast from 'src@/components/analyzer/East.vue';
import AnalyzerSouthWest from 'src@/components/analyzer/SouthWest.vue';
import AnalyzerAttention from 'src@/components/analyzer/Attention.vue';
import AnalyzerRoute from 'src@/components/analyzer/Route.vue';
import AnalyzerCancel from 'src@/components/analyzer/Cancel.vue';

import Password from 'src@/views/Password.vue';

export default [
    {
        path: 'login',
        name: 'cnLogin',
        component: Login
    },
    {
        path: '',
        name: 'cnHome',
        component: Home
    },
    {
        path: 'flight-status-data',
        name: 'cnFlight',
        component: Flight
    },
    {
        path: 'flight-status-data/:type/:value/:date/:page',
        name: 'cnFlightData',
        component: Flight
    },
    {
        path: 'ads-b',
        name: 'cnADSB',
        component: ADSB
    },
    {
        path: 'ads-b/:type/:value',
        name: 'cnADSBData',
        component: ADSB
    },
    {
        path: 'weather/:apt',
        name: 'cnWeather',
        component: Weather
    },
    {
        path: 'operation',
        component: Operation,
        children: [
            {
                path: '',
                name: 'cnOperationDefault',
                redirect: '/cn/operation/wave/PEK'
            },
            {
                path: 'wave/:airport',
                name: 'cnOperationWave',
                component: OperationWave
            },
            {
                path: 'info/:airport/:page',
                name: 'cnOperationInfo',
                component: OperationInfo
            },
            {
                path: 'rate/:airport',
                name: 'cnOperationRate',
                component: OperationRate
            }
        ]
    },
    {
        path: 'analyzer',
        component: Analyzer,
        children: [
            {
                path: '',
                name: 'cnAnalyzerDefault',
                component: AnalyzerRank
            },
            {
                path: 'rank',
                name: 'cnAnalyzerRank',
                component: AnalyzerRank
            },
            {
                path: 'aviation',
                name: 'cnAnalyzerAviation',
                component: AnalyzerAviation
            },
            {
                path: 'east',
                name: 'cnAnalyzerEast',
                component: AnalyzerEast
            },
            {
                path: 'southWest',
                name: 'cnAnalyzerSouthWest',
                component: AnalyzerSouthWest
            },
            {
                path: 'attention',
                name: 'cnAnalyzerAttention',
                component: AnalyzerAttention
            },
            {
                path: 'route',
                name: 'cnAnalyzerRoute',
                component: AnalyzerRoute
            },
            {
                path: 'cancel',
                name: 'cnAnalyzerCancel',
                component: AnalyzerCancel
            }
        ]
    },
    {
        path: 'password',
        name: 'cnPassword',
        component: Password
    }
];