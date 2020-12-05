import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const messages = {
    'en-US': require('./en.js'),
    'zh-CN': require('./zh.js')
};

export default new VueI18n({
    locale: 'en-US',
    messages
});