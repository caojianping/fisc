<template>
    <footer class="fisc-footer">
        <div class="fisc-container clearfix">
            <dl>
                <dt>{{$t('m.footer.contact')}}</dt>
                <dd><a href="mailto:data@VariFlight.com">{{$t('m.footer.email')}}: data@VariFlight.com</a></dd>
                <dd>{{$t('m.footer.telephone')}}: +86 0551 65817238</dd>
                <dd>{{$t('m.footer.fax')}}: 0551 65817238</dd>
            </dl>
            <dl>
                <dt>{{$t('m.footer.visit')}}</dt>
                <dd>{{$t('m.footer.address')}}</dd>
            </dl>
        </div>
        <p class="copyright">Copyright by Feeyo Technology Co., Ltd</p>
    </footer>
</template>

<script>
    export default {}
</script>

<style lang="less" scoped>
    @import "../less/footer.less";
</style>