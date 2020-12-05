<template>
    <div class="page-container">
        <ul class="page-list">
            <li v-for="(item, index) in pageList" :key="index">
                <router-link v-if="item.toPage !== 'null'"
                             :class="{active: Number(item.page) === Number(currentPage) && Number(item.page) !== 0}"
                             :to="item.toPage + ''">
                    {{item.text}}
                </router-link>
                <strong v-if="item.toPage === 'null'">{{ item.text }}</strong>
            </li>
        </ul>
        <div class="page-total">
            {{$t('m.flightListHeader.totalText')}}
            <span>{{options.pageCount}}</span> {{getUnit}}
        </div>
    </div>
</template>

<script>
    export default {
        props: ["options"],
        data() {
            return {
                currentPage: 1
            };
        },
        computed: {
            getUnit() {
                return this.$i18n.locale === "zh-CN"
                    ? "页"
                    : this.options.pageCount <= 1 ? "page" : "pages";
            },
            pageList() {
                return this.setPageList();
            }
        },
        methods: {
            getPageHeader() {
                return [
                    {
                        page: 0,
                        toPage: 1,
                        text: this.$i18n.locale === "zh-CN" ? "首页" : "Home"
                    },
                    {
                        page: 0,
                        toPage:
                            this.currentPage <= 1
                                ? 1
                                : Number(this.currentPage) - 1,
                        text: this.$i18n.locale === "zh-CN" ? "上一页" : "Previous"
                    }
                ];
            },
            getPageFooter() {
                return [
                    {
                        page: 0,
                        toPage:
                            this.currentPage >= this.options.pageCount
                                ? this.options.pageCount
                                : Number(this.currentPage) + 1,
                        text: this.$i18n.locale === "zh-CN" ? "下一页" : "Next"
                    },
                    {
                        page: 0,
                        toPage: this.options.pageCount,
                        text: this.$i18n.locale === "zh-CN" ? "尾页" : "Last"
                    }
                ];
            },
            setPageList() {
                let count = Number(this.options.pageCount),
                    current = Number(this.currentPage),
                    _arr = [];
                //总页数小于6
                if (count < 6) {
                    for (let i = 1; i < count + 1; i++) {
                        _arr.push({
                            page: i,
                            toPage: i,
                            text: i
                        });
                    }
                } else {
                    //总页数大于6
                    //当前页数小于5时 显示省略号
                    if (current < 5) {
                        for (let i = 1; i < 6; i++) {
                            _arr.push({
                                page: i,
                                toPage: i,
                                text: i
                            });
                        }
                        _arr = _arr.concat([
                            {page: 0, toPage: "null", text: "..."},
                            {page: count, toPage: count, text: count}
                        ]);
                    } else {
                        //当前页在末尾时
                        if (current < count - 3) {
                            for (let i = current - 2; i < current + 3; i++) {
                                _arr.push({
                                    page: i,
                                    toPage: i,
                                    text: i
                                });
                            }
                            _arr = _arr.concat([
                                {page: 0, toPage: "null", text: "..."},
                                {page: count, toPage: count, text: count}
                            ]);
                        } else {
                            _arr = _arr.concat([
                                {page: 1, toPage: 1, text: 1},
                                {page: 0, toPage: "null", text: "..."}
                            ]);
                            for (let i = count - 4; i < count + 1; i++) {
                                _arr.push({
                                    page: i,
                                    toPage: i,
                                    text: i
                                });
                            }
                        }
                    }
                }
                //设置pageList
                return this.getPageHeader()
                    .concat(_arr)
                    .concat(this.getPageFooter());
            },
            watchPage() {
                let page = this.$route.params.page;
                if (!page || !/^[0-9]+$/.test(page)) {
                    page = 1;
                }
                this.currentPage = page;
            }
        },
        watch: {
            $route: "watchPage"
        },
        created() {
            this.watchPage();
        }
    };
</script>

<style lang="less" scoped>
    .inline-block {
        display: inline-block;
    }

    .page-container {
        margin: 30px 0;
        text-align: center;

        .page-list {
            .inline-block;

            li {
                .inline-block;
                margin: 0 3px;

                a {
                    padding: 8px 12px;
                    color: #333;
                    border: 1px solid #aaa;
                    border-radius: 5px;

                    &.active {
                        color: white;
                        background: #5096fa;
                        border-color: #5096fa;
                    }

                    &:hover {
                        border-color: #5096fa;
                        box-shadow: 0 0 3px #5096fa;
                    }
                }
            }
        }

        .page-total {
            .inline-block;
            margin-left: 5px;

            span {
                margin: 0 3px;
                font-weight: bold;
            }
        }
    }
</style>