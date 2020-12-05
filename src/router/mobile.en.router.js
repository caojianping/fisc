import MobileLogin from 'src@/views/mobile/Login.vue';
import MobileAnalyzer from 'src@/views/mobile/Analyzer.vue';

import MobileAnalyzerRank from 'src@/components/mobile/analyzer/Rank.vue';
import MobileAnalyzerAviation from 'src@/components/mobile/analyzer/Aviation.vue';
import MobileAnalyzerEast from 'src@/components/mobile/analyzer/East.vue';
import MobileAnalyzerSouthWest from 'src@/components/mobile/analyzer/SouthWest.vue';
import MobileAnalyzerAttention from 'src@/components/mobile/analyzer/Attention.vue';
import MobileAnalyzerRoute from 'src@/components/mobile/analyzer/Route.vue';
import MobileAnalyzerCancel from 'src@/components/mobile/analyzer/Cancel.vue';

export default [
    {
        path: 'login',
        name: 'mobileLogin',
        component: MobileLogin
    },
    {
        path: '',
        name: 'mobileDefault',
        redirect: '/mobile/analyzer/rank'
    },
    {
        path: 'analyzer',
        component: MobileAnalyzer,
        children: [
            {
                path: 'rank',
                name: 'mobileAnalyzerRank',
                component: MobileAnalyzerRank
            },
            {
                path: 'aviation',
                name: 'mobileAnalyzerAviation',
                component: MobileAnalyzerAviation
            },
            {
                path: 'east',
                name: 'mobileAnalyzerEast',
                component: MobileAnalyzerEast
            },
            {
                path: 'southWest',
                name: 'mobileAnalyzerSouthWest',
                component: MobileAnalyzerSouthWest
            },
            {
                path: 'attention',
                name: 'mobileAnalyzerAttention',
                component: MobileAnalyzerAttention
            },
            {
                path: 'route',
                name: 'mobileAnalyzerRoute',
                component: MobileAnalyzerRoute
            },
            {
                path: 'cancel',
                name: 'mobileAnalyzerCancel',
                component: MobileAnalyzerCancel
            }
        ]
    }
];