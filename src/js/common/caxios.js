import axios from 'axios';
import {buildPath} from 'src@/js/common/utils';
import {AxiosType, ErrorType} from 'src@/js/config/enums';
import CONSTANTS from 'src@/js/config/constants';
import UserToken from 'src@/js/helpers/userToken';

// let pending = [],//存储数组：存储异步请求的取消函数、标识；
//     cancelToken = axios.CancelToken,
//     removePending = config => {
//         for (let p in pending) {
//             if (pending[p].id === config.url + '&' + config.method) {
//                 pending[p].cancel();//执行取消操作
//                 pending.splice(p, 1);
//             }
//         }
//     };
//
// //添加请求拦截器
// axios.interceptors.request.use(config => {
//     removePending(config);
//     config.cancelToken = new cancelToken(c => {
//         pending.push({
//             id: config.url + '&' + config.method,
//             cancel: c
//         });
//     });
//     return config;
// }, err => {
//     return Promise.reject(err);
// });
//
// //添加响应拦截器
// axios.interceptors.response.use(res => {
//     removePending(res.config);
//     return res;
// }, err => {
//     return {data: {}};
// });

export default function (options, type) {
    options = options || {};
    type = type || AxiosType.Default;

    options['headers'] = {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'};
    options['responseType'] = 'json';
    // options['timeout'] = CONSTANTS.TIMEOUT;

    let self = this,
        redirectToLogin = () => {
            UserToken.clearUserToken();
            self.$Notice.error({title: 'Error', desc: self.$t('m.analyzer.timeout')});
            self.$router.push(buildPath(null, self.$i18n.locale === 'zh-CN', '/login'));
            return Promise.reject({type: ErrorType.TokenError, msg: self.$t('m.analyzer.timeout')});
        },
        loadingRequest = () => {
            options['transformRequest'] = data => {
                self['isLoading'] = true;
                return data;
            };
        };
    if (type === AxiosType.Token || type === AxiosType.TokenLoading || type === AxiosType.TokenNotParams) {
        let userToken = UserToken.getUserToken();
        if (!userToken) return redirectToLogin();

        let isExpired = UserToken.isExpired(userToken);
        if (isExpired) return redirectToLogin();//已过期
        else {//未过期
            if (Date.now() / 1000 - userToken.flag > CONSTANTS.REFRESH_TIME) {//超过5分钟更新一次token
                UserToken.refreshUserToken(userToken.token);
            }
        }

        if (type !== AxiosType.TokenNotParams) {
            options['url'] = options.url + '?token=' + userToken.token;
        }
        if (type === AxiosType.TokenLoading) {
            loadingRequest();
        }
    } else if (type === AxiosType.Loading) {
        loadingRequest();
    }

    return axios(options)
        .then(res => {
            if (type === AxiosType.Loading || type === AxiosType.TokenLoading) {
                self['isLoading'] = false;
            }

            let result = res.data;
            if (!result.hasOwnProperty('code')) return result;

            let code = Number(result.code);
            if (code === 0 || code === 200) return result.data;

            let msg = result.message || result.data.message;
            return Promise.reject({type: ErrorType.DataError, msg: msg, code: code});
        })
        .catch(err => {
            if (type === AxiosType.Loading || type === AxiosType.TokenLoading) {
                self['isLoading'] = false;
            }
            return Promise.reject(err.type ? err : {type: ErrorType.ExceptionError, msg: err});
        });
};