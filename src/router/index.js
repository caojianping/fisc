import Vue from 'vue';
import Router from 'vue-router';
import device from 'src@/js/common/device';
import {buildPath} from 'src@/js/common/utils';
import UserToken from 'src@/js/helpers/userToken';
import enRouter from './en.router';
import zhRouter from './zh.router';
import mobileEnRouter from './mobile.en.router';
import mobileZhRouter from './mobile.zh.router';
import App from 'src@/App.vue';
import PageNotFound from 'src@/views/PageNotFound.vue';

Vue.use(Router);

const routes = new Router({
    base: '/',
    routes: [
        //PC端路由
        {
            path: '/',
            component: App,
            children: enRouter
        },
        {
            path: '/cn',//中文
            component: App,
            children: zhRouter
        },
        //移动端路由
        {
            path: '/mobile',
            component: App,
            children: mobileEnRouter
        },
        {
            path: '/mobile/cn',//中文
            component: App,
            children: mobileZhRouter
        },
        //404路由
        {
            path: '*',
            name: '404',
            component: PageNotFound
        }
    ]
});

routes.beforeEach((to, from, next) => {
    let toPath = to.path,
        isExpired = UserToken.isExpired(),
        isMobile = device.isMobile();
    if (isExpired) {//已过期
        UserToken.clearUserToken();
        if (toPath.endsWith('/login')) next();
        else next(buildPath(isMobile, toPath.indexOf('/cn') > -1, '/login'));
    } else {//未过期
        let isMobileName = to.name.startsWith('mobile');
        if (isMobile && !isMobileName) next('/mobile' + toPath);
        else if (!isMobile && isMobileName) next(toPath.replace('/mobile', ''));
        else next();
    }
});

routes.afterEach((to, from, next) => {
    setTimeout(() => {
        let _hmt = _hmt || [];
        (function () {
            const ID = 'baidu_tj';
            document.getElementById(ID) && document.getElementById(ID).remove();
            let hm = document.createElement('script');
            hm.src = 'https://hm.baidu.com/hm.js?3bdf5195036a46d6160e47d83d82128e';
            hm.id = ID;
            let s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(hm, s);
        })();
    }, 0);
});


export default routes;