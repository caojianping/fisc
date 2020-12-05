import caxios from '../common/caxios';
import {Base64} from 'js-base64';
import {parseJSON, fillEquals} from '../common/utils';
import Urls from '../config/urls';
import CONSTANTS from '../config/constants';
import {AxiosType} from '../config/enums';

let LocalStorage = window.localStorage;
let UserToken = {
    isExpired(userToken) {
        let self = this;
        if (!userToken) {
            let utoken = self.getUserToken();
            if (!utoken) return true;
            userToken = utoken;
        }

        let userInfo = this.getUserInfo(userToken.token);
        if (!userInfo) return true;

        let diff = userInfo.iat - userToken.flag;
        return Date.now() / 1000 + diff >= userInfo.exp;
    },
    getUserToken() {
        return parseJSON(LocalStorage.getItem(CONSTANTS.USER_TOKEN) || null);
    },
    setUserToken(token) {
        LocalStorage.setItem(CONSTANTS.USER_TOKEN, JSON.stringify({token: token, flag: Date.now() / 1000}));
    },
    clearUserToken() {
        LocalStorage.removeItem(CONSTANTS.USER_TOKEN);
    },
    refreshUserToken(token) {
        if (window.isRefreshToken === true) return;

        window.isRefreshToken = true;
        let self = this;
        if (!token) {
            let userToken = self.getUserToken();
            if (!userToken) return;
            token = userToken.token;
        }
        caxios({
            url: Urls.auth.refreshToken,
            method: 'get',
            params: {token: token}
        }, AxiosType.Default)
            .then(data => {
                window.isRefreshToken = false;
                self.setUserToken(data);
            })
            .catch(err => {
                window.isRefreshToken = false;
                // console.log('refreshUserToken err:', err);
            });
    },
    getUserInfo(token) {
        try {
            if (!token) {
                let userToken = this.getUserToken();
                if (!userToken) return null;
                token = userToken.token;
            }
            //“=”符号填充处理
            let mtoken = token.match(/\.[\s\S]*\./)[0].replace(/\./g, ''),
                residue = mtoken.length % 4,
                ftoken = mtoken;
            if (residue > 0) {
                ftoken = mtoken + fillEquals(residue);
            }
            //token解密处理
            let dtoken = Base64.decode(ftoken),
                str = dtoken.replace(String.fromCharCode(0), '');
            // console.log('getUserInfo str、str.length、lastChar:', str, str.length, str.charAt(str.length - 1));
            return parseJSON(str);
        } catch (e) {
            console.log('getUserInfo e:', e);
        }
    }
};

export default UserToken;