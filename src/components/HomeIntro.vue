<template>
    <section class="fisc-container clearfix">
        <dl v-for="(nitem, nindex) in $t('m.header.navs')" :key="nindex" class="desc-item">
            <dt>{{nitem.title}}</dt>
            <dd v-for="(sitem, sindex) in nitem.subnavs" :key="sindex" class="clearfix">
                <figure>
                    <img :src="imgs[String(nindex + 1) + String(sindex + 1)]" :alt="nitem.title">
                </figure>
                <div>
                    <h2>
                        <router-link :to="sitem.route">{{sitem.title}}</router-link>
                    </h2>
                    <p>{{sitem.desc}}</p>
                </div>
            </dd>
        </dl>
    </section>
</template>

<script>
    import desc11 from 'src@/images/desc/desc11.png';
    import desc12 from 'src@/images/desc/desc12.png';
    import desc21 from 'src@/images/desc/desc21.png';
    import desc22 from 'src@/images/desc/desc22.png';
    import desc31 from 'src@/images/desc/desc31.png';
    import desc32 from 'src@/images/desc/desc32.png';

    export default {
        data() {
            return {
                imgs: {
                    '11': desc11,
                    '12': desc12,
                    '21': desc21,
                    '22': desc22,
                    '31': desc31,
                    '32': desc32
                }
            };
        }
    };
</script>

<style scoped>
    .fisc-container {
        padding: 50px 0;
    }

    .fisc-container > dl {
        display: block;
        float: left;
        margin: 0;
        padding: 0;
        width: 33.33%;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }

    .fisc-container > dl > dt {
        padding: 0 0 35px 0;
        font-size: 20px;
        font-weight: bold;
        color: #041230;
        text-align: left;
        text-indent: 30%;
    }

    .fisc-container > dl > dd {
        margin-bottom: 35px;
        padding-right: 15px;
    }

    .fisc-container > dl > dd > figure {
        float: left;
        width: 60px;
        height: 60px;
        background-color: #366fc1;
        border-radius: 3px;
    }

    .fisc-container > dl > dd > figure img {
        display: block;
        margin: 5px auto;
        width: 50px;
        height: 50px;
    }

    .fisc-container > dl > dd > div {
        margin-left: 80px;
        height: 70px;
    }

    .fisc-container > dl > dd > div > h2 {
        padding-bottom: 3px;
    }

    .fisc-container > dl > dd > div > h2 > a {
        font-size: 16px;
        font-weight: normal;
        color: #041230;
        text-decoration: none;
    }

    .fisc-container > dl > dd > div > p {
        font-size: 14px;
        color: #626466;
    }
</style>