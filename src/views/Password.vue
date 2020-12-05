<template>
    <div>
        <FISCHeader></FISCHeader>

        <div class="fisc-main">
            <ul class="form-list">
                <li class="form-item">
                    <label for="oldPwd">{{$t('m.password.oldPwd.label')}}</label>
                    <input type="password" id="oldPwd" v-model="oldPwd"
                           :placeholder="$t('m.password.oldPwd.placeholder')"
                           @keyup.enter="submit"/>
                </li>
                <li class="form-item">
                    <label for="newPwd">{{$t('m.password.newPwd.label')}}</label>
                    <input type="password" id="newPwd" v-model="newPwd"
                           :placeholder="$t('m.password.newPwd.placeholder')"
                           @keyup.enter="submit"/>
                </li>
                <li class="form-item">
                    <label for="confirmPwd">{{$t('m.password.confirmPwd.label')}}</label>
                    <input type="password" id="confirmPwd" v-model="confirmPwd"
                           :placeholder="$t('m.password.confirmPwd.placeholder')"
                           @keyup.enter="submit"/>
                </li>
                <li class="form-item">
                    <button @click="submit">{{$t('m.global.submit')}}</button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import qs from 'qs';
    import UserToken from 'src@/js/helpers/userToken';
    import Urls from 'src@/js/config/urls';
    import {AxiosType, ErrorType} from 'src@/js/config/enums';
    import {buildPath} from 'src@/js/common/utils';
    import {PasswordRegExp} from 'src@/js/config/regulars';
    import FISCHeader from 'src@/components/FISCHeader.vue';

    export default {
        components: {FISCHeader},
        data() {
            return {
                oldPwd: '',
                newPwd: '',
                confirmPwd: ''
            };
        },
        methods: {
            errorHandle(key) {
                let self = this,
                    config = {
                        oldPwd: self.$t('m.password.oldPwd.validate'),
                        newPwd: self.$t('m.password.newPwd.validate'),
                        newPwdFormat: self.$t('m.password.newPwd.format'),
                        equals: self.$t('m.password.confirmPwd.validate')
                    };
                self.$Message.error(config[key]);
                return false;
            },
            execValidate() {
                let self = this;
                if (!self.oldPwd) return self.errorHandle('oldPwd');
                if (!self.newPwd) return self.errorHandle('newPwd');
                if (!PasswordRegExp.test(self.newPwd)) return self.errorHandle('newPwdFormat');
                if (self.newPwd !== self.confirmPwd) return self.errorHandle('equals');
                return true;
            },
            submit() {
                let isValidate = this.execValidate();
                if (!isValidate) return;

                let self = this;
                self.$caxios({
                    url: Urls.auth.password,
                    method: 'post',
                    data: qs.stringify({
                        old_user_pwd: self.oldPwd,
                        new_user_pwd: self.newPwd
                    })
                }, AxiosType.Token)
                    .then(data => {
                        UserToken.clearUserToken();
                        self.$Notice.success({title: 'Success', desc: self.$t('m.password.success')});
                        setTimeout(() => {
                            self.$router.push(buildPath(null, self.$i18n.locale === 'zh-CN', '/login'));
                        }, 1200);
                    })
                    .catch(err => {
                        // 10101 => already revised
                        // 10102 => old password error
                        // 10103 => new password the same as old password
                        // 10104 => revise failed
                        let msg = self.$t('m.password.error10104');
                        if (err.type === ErrorType.DataError) {
                            switch (err.code) {
                                case 10101:
                                    msg = self.$t('m.password.error10101');
                                    break;
                                case 10102:
                                    msg = self.$t('m.password.error10102');
                                    break;
                                case 10103:
                                    msg = self.$t('m.password.error10103');
                                    break;
                                case 10104:
                                    msg = self.$t('m.password.error10104');
                                    break;
                            }
                        }
                        self.$Notice.error({title: 'Error', desc: msg});
                    });
            }
        }
    }
</script>

<style lang="less" scoped>
    .form-list {
        margin: 100px auto 0;
        padding: 30px 50px;
        width: 568px;
        border-radius: 3px;
        box-shadow: 0 0 6px 6px rgba(0, 0, 0, .08);

        .form-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 20px 0;

            label {
                min-width: 130px;
                font-size: 16px;
                color: #555;
                text-align: left;
                white-space: nowrap;
            }

            input {
                flex-grow: 1;
                display: block;
                margin: 0;
                padding: 0 6px;
                height: 36px;
                font-size: 14px;
                line-height: 36px;
                color: #495060;
                border: 1px solid #dddee1;
                border-radius: 4px;
                background-color: white;
            }

            button {
                display: block;
                margin: auto;
                width: 300px;
                height: 45px;
                font-size: 16px;
                line-height: 45px;
                color: white;
                text-align: center;
                letter-spacing: 5px;
                background-color: #3d86e5;
                border-radius: 3px;
                border: none;
                outline: none;
                cursor: pointer;
            }
        }
    }
</style>


