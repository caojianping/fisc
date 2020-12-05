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
        name: 'login',
        component: Login
    },
    {
        path: '',
        name: 'home',
        component: Home
    },
    {
        path: 'flight-status-data',
        name: 'flight',
        component: Flight
    },
    {
        path: 'flight-status-data/:type/:value/:date/:page',
        name: 'flightData',
        component: Flight
    },
    {
        path: 'ads-b',
        name: 'ADSB',
        component: ADSB
    },
    {
        path: 'ads-b/:type/:value',
        name: 'ADSBData',
        component: ADSB
    },
    {
        path: 'weather/:apt',
        name: 'weather',
        component: Weather
    },
    {
        path: 'operation',
        component: Operation,
        children: [
            {
                path: '',
                name: 'operationDefault',
                redirect: '/operation/wave/PEK'
            },
            {
                path: 'wave/:airport',
                name: 'operationWave',
                component: OperationWave
            },
            {
                path: 'info/:airport/:page',
                name: 'operationInfo',
                component: OperationInfo
            },
            {
                path: 'rate/:airport',
                name: 'operationRate',
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
                name: 'analyzerDefault',
                component: AnalyzerRank
            },
            {
                path: 'rank',
                name: 'analyzerRank',
                component: AnalyzerRank
            },
            {
                path: 'aviation',
                name: 'analyzerAviation',
                component: AnalyzerAviation
            },
            {
                path: 'east',
                name: 'analyzerEast',
                component: AnalyzerEast
            },
            {
                path: 'southWest',
                name: 'analyzerSouthWest',
                component: AnalyzerSouthWest
            },
            {
                path: 'attention',
                name: 'analyzerAttention',
                component: AnalyzerAttention
            },
            {
                path: 'route',
                name: 'analyzerRoute',
                component: AnalyzerRoute
            },
            {
                path: 'cancel',
                name: 'analyzerCancel',
                component: AnalyzerCancel
            }
        ]
    },
    {
        path: 'password',
        name: 'password',
        component: Password
    }
];