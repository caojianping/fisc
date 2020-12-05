<template>
    <div>
        <x-group style="margin-bottom: 12px!important;">
            <x-button type="primary" @click.native="logout">{{logoutText}}</x-button>
        </x-group>
    </div>
</template>

<script>
    export default {
        computed: {
            logoutText() {
                return this.$t('m.header.logout');
            }
        },
        methods: {
            logout() {
                localStorage.removeItem('FISCUserToken');
                if (this.$route.path.startsWith('/mobile/cn')) this.$router.push('/mobile/cn/login');
                else this.$router.push('/mobile/login');
            }
        }
    }
</script>