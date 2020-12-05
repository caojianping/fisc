import device from 'device';

export default {
    isMobile() {
        let userAgent = window.navigator.userAgent;
        if (!userAgent) throw new Error('无效的用户代理！');
        return device(userAgent).type !== 'desktop';
    },
    isPC() {
        let userAgent = window.navigator.userAgent;
        if (!userAgent) throw new Error('无效的用户代理！');
        return !userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
    },
    isIE() {
        let userAgent = window.navigator.userAgent;
        if (!userAgent) throw new Error('无效的用户代理！');
        return userAgent.indexOf('MSIE') >= 1;
    }
}