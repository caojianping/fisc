<template>
    <div class="fisc-mobile">
        <a class="logo" href="javascript:void(0)">
            <img :src="logo" alt="FISC">
        </a>

        <section class="login-box">
            <ul class="login-list">
                <li class="login-item">
                    <label for="username"></label>
                    <input id="username" type="text" name="username" placeholder="Username"
                           v-model="username" v-focus @focus="inputFocus" @keyup.enter="confirmLogin">
                </li>
                <li class="login-item">
                    <label for="password"></label>
                    <input id="password" type="password" name="password" placeholder="Password"
                           v-model="password" @focus="inputFocus" @keyup.enter="confirmLogin">
                </li>
                <li class="login-item login-success" v-if="isSuccess">
                    <i class="fa fa-check"></i>
                    <span>{{$t('m.login.success')}}</span>
                </li>
                <li class="login-item login-error" v-if="isError">
                    <i class="fa fa-exclamation-circle"></i>
                    <span>{{errorText}}</span>
                </li>
                <li class="login-item">
                    <button type="button" @click="confirmLogin">{{$t('m.login.text')}}</button>
                </li>
            </ul>
        </section>

        <footer>{{$t('m.global.mtitle')}}</footer>
    </div>
</template>

<script>
    import logo from 'src@/images/logo/logo-mobile.png';
    import LoginController from 'src@/js/controllers/login.controller';

    export default new LoginController(logo).init();
</script>

<style lang="less" scoped>
    @import '../../less/mobile/login.less';
</style>
