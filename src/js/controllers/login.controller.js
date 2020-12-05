import qs from 'qs';
import UserToken from 'src@/js/helpers/userToken';
import Urls from 'src@/js/config/urls';
import {AxiosType, ErrorType} from 'src@/js/config/enums';
import {buildPath} from 'src@/js/common/utils';

function LoginController(logo) {
    this.logo = logo;
}

LoginController.prototype = {
    init() {
        let self = this;
        return {
            data() {
                return {
                    logo: self.logo,
                    username: '',
                    password: '',
                    isSuccess: false,
                    isError: false,
                    errorText: ''
                }
            },
            directives: {
                focus: {
                    inserted: function (elem) {
                        elem.focus();
                    }
                }
            },
            methods: {
                inputFocus() {
                    this.isError = false;
                },
                errorHandle(key) {
                    const config = {
                        username: this.$t('m.login.error1'),
                        password: this.$t('m.login.error2')
                    };
                    this.isError = true;
                    this.errorText = config[key];
                    return false;
                },
                execValidate() {
                    if (!this.username) return this.errorHandle('username');
                    if (!this.password) return this.errorHandle('password');
                    return true;
                },
                confirmLogin() {
                    let self = this,
                        isValidate = self.execValidate();
                    if (!isValidate) return;

                    self.$caxios({
                        url: Urls.auth.login,
                        method: 'post',
                        data: qs.stringify({
                            'LoginForm[username]': self.username,
                            'LoginForm[password]': self.password
                        })
                    }, AxiosType.Default)
                        .then(data => self.loginSuccess(data))
                        .catch(err => self.loginError(err));
                },
                loginSuccess(data) {
                    let self = this;
                    self.isError = false;
                    self.isSuccess = true;
                    setTimeout(() => {
                        UserToken.setUserToken(data);
                        self.$router.push(buildPath(null, self.$i18n.locale === 'zh-CN', '/'));
                    }, 1000);
                },
                loginError(err) {
                    let self = this;
                    self.isError = true;
                    self.errorText = err.type === ErrorType.DataError ? self.$t('m.login.error3') : self.$t('m.login.error4');
                }
            }
        }
    }
};

export default LoginController;