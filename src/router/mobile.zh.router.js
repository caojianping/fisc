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
        name: 'mobileCnLogin',
        component: MobileLogin
    },
    {
        path: '',
        name: 'mobileCnDefault',
        redirect: '/mobile/cn/analyzer/rank'
    },
    {
        path: 'analyzer',
        component: MobileAnalyzer,
        children: [
            {
                path: 'rank',
                name: 'mobileCnAnalyzerRank',
                component: MobileAnalyzerRank
            },
            {
                path: 'aviation',
                name: 'mobileCnAnalyzerAviation',
                component: MobileAnalyzerAviation
            },
            {
                path: 'east',
                name: 'mobileCnAnalyzerEast',
                component: MobileAnalyzerEast
            },
            {
                path: 'southWest',
                name: 'mobileCnAnalyzerSouthWest',
                component: MobileAnalyzerSouthWest
            },
            {
                path: 'attention',
                name: 'mobileCnAnalyzerAttention',
                component: MobileAnalyzerAttention
            },
            {
                path: 'route',
                name: 'mobileCnAnalyzerRoute',
                component: MobileAnalyzerRoute
            },
            {
                path: 'cancel',
                name: 'mobileCnAnalyzerCancel',
                component: MobileAnalyzerCancel
            }
        ]
    }
];