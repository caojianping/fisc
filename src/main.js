import Vue from 'vue';
import caxios from 'src@/js/common/caxios';
import 'src@/js/common/extension';
import i18n from 'src@/js/lang/index';
import router from 'src@/router/index';

import 'iview/dist/styles/iview.css';
import 'src@/less/reset.less';
import 'src@/less/common.less';

import {Message, Notice, Input, Select, Option, DatePicker, Switch, Button} from 'iview';
import {TransferDom, Popup, Group, XInput, Calendar, XSwitch, Selector, XButton} from 'vux';
import App from 'src@/App.vue';

if (process.env.NODE_ENV !== 'production') {
    Vue.config.debug = true;
}

Vue.prototype.$caxios = caxios;
Vue.prototype.$Message = Message;
Vue.prototype.$Notice = Notice;

//PC端UI库
Vue.component('Select', Select);
Vue.component('Option', Option);
Vue.component('Input', Input);
Vue.component('DatePicker', DatePicker);
Vue.component('Button', Button);

//移动端UI库
Vue.directive('transfer-dom', TransferDom);
Vue.component('XPopup', Popup);
Vue.component('XGroup', Group);
Vue.component('XInput', XInput);
Vue.component('XCalendar', Calendar);
Vue.component('XSwitch', XSwitch);
Vue.component('XSelector', Selector);
Vue.component('XButton', XButton);

window.isRefreshToken = false;

new Vue({
    el: '#app',
    router,
    i18n,
    components: {App},
    template: '<App/>'
});