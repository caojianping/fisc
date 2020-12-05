export const m = {
    global: {
        title: '航班信息服务平台',
        stitle: '让世界更了解中国民航',
        mtitle: '飞常准航班正常率分析系统',
        flight: '航班量',
        search: '搜索',
        reset: '重置',
        submit: '提交',
        share: '共享',
        flightStatus: {
            '-1': '未知',
            '0': '计划',
            '1': '起飞',
            '2': '到达',
            '3': '取消',
            '4': '延误',
            '5': '备降',
            '9': '登机结束',
            '11': '返航',
            '12': '正在登机',
            '73': '提前取消'
        },
        language: '中英文切换',
        please: '请输入'
    },
    header: {
        navs: [
            {
                title: '航班跟踪',
                subnavs: [
                    {
                        title: '航班信息查询',
                        route: '/cn/flight-status-data',
                        desc: '全球航班信息实时查询'
                    },
                    {
                        title: 'ADS-B',
                        route: '/cn/ads-b',
                        desc: 'ADS-B实时追踪航班动态'
                    }
                ]
            },
            {
                title: '机场跟踪',
                subnavs: [
                    {
                        title: '机场天气',
                        route: '/cn/weather/pek',
                        desc: '中国机场天气状况及天气预报'
                    },
                    {
                        title: '机场流量',
                        route: '/cn/operation',
                        desc: '实时掌握中国机场的交通量'
                    }
                ]
            },
            {
                title: '统计分析',
                subnavs: [
                    {
                        title: '航空公司正常性统计',
                        route: '/cn/analyzer/rank',
                        desc: '多维度分析航空公司航班正常性'
                    },
                    // {
                    //     title: '机场正常性统计',
                    //     route: '',
                    //     desc: '多维度分析机场航班正常性'
                    // }
                ]
            }
        ],
        language: '中英文切换',
        logout: '退出登录',
        password: '修改密码'
    },
    footer: {
        contact: '联系我们',
        email: '邮箱',
        telephone: '电话',
        fax: '传真',
        visit: '访问我们',
        address: '中国安徽省合肥市蜀山区潜山路320号新华国际广场A座17楼',
    },
    login: {
        text: '登录',
        success: '登录成功',
        error1: '用户名不能为空',
        error2: '密码不能为空',
        error3: '用户名或密码错误',
        error4: '网络有问题，请稍后再试'
    },
    password: {
        oldPwd: {
            label: '旧密码',
            placeholder: '请输入旧密码',
            validate: '旧密码不可以为空'
        },
        newPwd: {
            label: '新密码',
            placeholder: '请输入新密码（6-20位字母数字组合）',
            validate: '新密码不可以为空',
            format: '密码为6-20位字母数字的组合'
        },
        confirmPwd: {
            label: '确认新密码',
            placeholder: '请再次输入新密码',
            validate: '两次密码输入不一致'
        },
        success: '密码修改成功',
        error10101: '一天只可修改一次密码',
        error10102: '旧密码不正确',
        error10103: '新密码不可与旧密码相同',
        error10104: '密码修改失败'
    },
    traffic: {
        searchText: '机场查询',
        navs: [
            {title: '航班波', route: '/cn/operation/wave'},
            {title: '实时航班信息', route: '/cn/operation/info', isPage: true}
        ],
        title1: '航班波',
        title2: '航班实况分析',
        types: [
            {key: 'dep', value: '出港'},
            {key: 'arr', value: '进港'},
            {key: 'gate', value: '登机口等待时间'}
        ],
        waveLegends: ['计划出港', '实际出港', '计划进港', '实际进港'],
        columnLegends: {
            'CANCELED': '取消',
            'ONSCHEDULE': '准点',
            //dep
            'ATD_DLY_30': '延误≦30分钟',
            'ATD_DLY_60': '延误≦60分钟',
            'ATD_DLY_90': '延误≦90分钟',
            'ATD_DLY_MORE': '延误﹥90分钟',
            'ETD_DLY_30': '预计延误≦30分钟',
            'ETD_DLY_60': '预计延误≦60分钟',
            'ETD_DLY_MORE': '预计延误﹥60分钟',
            // 'ETD NOT ASSIGNED/NO DLY': '无状态',
            'ETD NOT ASSIGNED/NO DLY': '计划',
            //arr
            'ATA_DLY_30': '延误≦30分钟',
            'ATA_DLY_60': '延误≦60分钟',
            'ATA_DLY_90': '延误≦90分钟',
            'ATA_DLY_MORE': '延误﹥90分钟',
            'ETA_DLY_30': '预计延误≦30分钟',
            'ETA_DLY_60': '预计延误≦60分钟',
            'ETA_DLY_MORE': '预计延误﹥60分钟',
            // 'NOT AIRBORNE/NO DLY': '无状态',
            'NOT AIRBORNE/NO DLY': '计划',
            //gate
            'WITHIN 30': '30分钟以内',
            'WITHIN 60': '60分钟以内',
            'WITHIN 90': '90分钟以内',
            'MORE THAN 90': '超过90分钟',
            // 'NOT ASSIGNED': '无状态',
            'NOT ASSIGNED': '计划'
        },
        overview: {
            lastTime: {dep: '最近起飞时间', arr: '最近到达时间'},
            delay: '延误占比',
            delayMore: '延误≧1小时',
            average: '平均延误时间',
            averageGate: '平均登机口等待时间'
        },
        thead: {
            STD: '计划起飞时间',
            STA: '计划到达时间',
            flightNo: '航班号',
            acType: '机型',
            tail: '飞机编号',
            terminal: '航站楼',
            to: '目的地',
            from: '出发地',
            gate: '登机口',
            takeOff: '实际起飞时间',
            landing: '实际到达时间',
            status: '状态'
        }
    },
    adsb: {
        types: {
            flight: '飞行航班',
            monitor: '地面监控'
        },
        search: [
            {key: 'fnum', name: '航班号', placeholder: '航班号'},
            {key: 'airline', name: '航司', placeholder: '航司二字码/三字码'},
            {key: 'airport', name: '机场', placeholder: '机场三字码'}
        ],
        maps: {
            mapbox: 'FISC地图',
            openStreet: 'OpenStreet地图',
            terrain: '地形地图'
        },
        placeholder: '航班号或飞机编号',
        detail: {
            AGO: '已飞行',
            STD: '计划起飞',
            STA: '计划到达',
            ATD: '实际起飞',
            ETA: '预计到达'
        }
    },
    weather: {
        paraStatus: {
            '0': '无状态',
            '1': '无进港/出港',
            '2': '流量正常',
            '3': '小面积延误',
            '4': '大面积延误',
            '6': '机场关闭',
            '-1': '-'
        },
        weatherRadar: '天气雷达',
        aptTitle1: '机场信息',
        aptTitle2: '天气趋势',
        lastest: '最新',
        metar: 'METAR',
        taf: 'TAF',
        more: '更多',
        weather: '天气',
        historyWeather: '历史天气',
        futureWeather: '未来天气',
        futureWeatherStatus: {
            CLEAR_DAY: '晴',
            CLEAR_NIGHT: '晴',
            PARTLY_CLOUDY_DAY: '多云',
            PARTLY_CLOUDY_NIGHT: '多云',
            CLOUDY: '阴',
            RAIN: '雨',
            SNOW: '雪',
            WIND: '风',
            HAZE: '雾霾沙尘'
        },
        airportTraffic: '异常机场',
        status: '当前状态',
        Inbound: '进港',
        Outbound: '出港',
        lastestTime: '最后进出港',
        avgTime: '进/出港速度',
        otp: '准点率',
        dewPoint: '露点',
        wind: '风速',
        qnh: '气压',
        visibility: '能见度',
        noInfo: '暂无该机场的天气信息',
        airportStatus: {
            specialSituation: '特殊情况',
            largeAreaDelay: '大面积延误'
        },
        temperature: '温度',
        unstable: '不定向',
        metarTitle: '数据取自METAR报文',
        cloudTitle: '数据取自彩云天气'
    },
    analyzer: {
        menus: {
            rank: '航司排名',
            aviation: '民航总局通报',
            east: '华东局通报',
            southWest: '西南局通报',
            attention: '航司关注',
            route: '航段分析',
            cancel: '取消航班分析'
        },
        calculateRule: '计算规则',
        calculateRules: {
            //title
            onTimeFlight: '正常航班',
            depOnTimeFlight: '出港正常航班',
            arrOnTimeFlight: '到港正常航班',
            taxiout: '机场滑行标准时长',

            title: {
                southWestScheduleFlight: '西南地区计划航班',
                southWestNormalFlight: '西南地区正常航班',
                southWestFlightOTP: '西南地区航班正常率',
            },

            //intro
            scheduleFlight: '计划的非经停航班量，不包括提前取消航班和国际（含地区）返程航班',//计划航班量
            depOnTimeFlightText: '实际起飞时间-计划起飞时间小于等于相应机场滑行时间的航班',//出港正常航班
            arrOnTimeFlightText: '实际到达时间-计划到达时间小于等于20分钟的航班',//到港正常航班
            ontimeFlight: '符合出港正常或到港正常的航班',//正常航班
            flightOTP: '航班正常率=正常航班量/计划航班量',//航班正常率
            depFlightOTP: '出港航班正常率=出港正常航班量/计划航班量',//出港航班正常率
            taxioutText: 'PEK、SHA、PVG、CAN、SZX、CTU、KMG 及所有国外机场30分钟，HGH、CKG、XIY、URC、NKG、XMN、TSN、TAO、CGO、WUH、CSX等机场25分钟，HAK、SYX、HRB、DLC、KWE、SHE、TNA、FOC、NNG、LHW等机场20分钟，其他机场15分钟',
            total: '出发机场航班总量',//总量
            rank: '航班正常率在出发机场的排名，按降序排名',//排名

            depOTP: '（实际起飞时间 - 计划起飞时间小于等于民航局规定的该机场滑行标准时长的航班量） / 航班执飞次数',//出港准点率
            averageDEPDelayTime: '所有执飞航班总的出港延误时长（实际起飞-计划起飞-机场滑行标准时长） / 出港不正常航班量',//出港平均延误时长
            averageDEPDelayTimeAnother: '出港延误时长（实际起飞-计划起飞-机场滑行标准时长） / 出港不正常航班量',//出港平均延误时长
            arrOTP: '实际到达时间-计划到达时间小于等于20分钟的航班量 / 航班执飞次数',//到港准点率
            averageARRDelayTime: '所有执飞航班总的到港延误时长（实际到达-计划到达）/ 航班执飞次数',//到港平均延误时长
            scheduledDuration: '所有执飞航班的计划航段时长（计划到达时间-计划起飞时间） / 航班执飞次数',//计划航段时长
            actualDuration: '所有执飞航班的实际飞行时长（实际到达时间-实际起飞时间） / 航班执飞次数',//实际飞行时长

            intro: {
                southWestScheduleFlight: '西南地区计划的非经停航班量，不包括提前取消航班和国际（含地区）返程航班',
                southWestNormalFlight: '西南地区符合出港正常或到港正常的航班',
                southWestFlightOTP: '西南地区正常航班量 / 西南地区计划航班量',
            }
        },
        tableHeader: {
            rank: '排名',
            total: '总量',
            flightNo: '航班号',
            forg: '出发机场',
            fdst: '到达机场',
            ETD: '计划起飞时间',
            scheduleFlight: '计划航班量',
            ontimeFlight: '正常航班量',
            flightOTP: '航班正常率',
            depFlightOTP: '出港航班正常率',
            RankingOfOTP: '航班正常率在机场排名',
            totalOfOTP: '航班正常率总量',
            totalOfFlight: '航班总量',
            averageDEPDelayTime: '出港平均延误时长',
            arrFlightOTP: '到港航班正常率',
            airlines: '航司',
            airlinesCode: '航司二字码',
            aType: '计划机型',
            actualFlight: '执飞次数',
            depOTP: '出港准点率',
            arrOTP: '到港准点率',
            averageARRDelayTime: '到港平均延误时长',
            scheduledDuration: '计划航段时长',
            actualDuration: '实际飞行时长',
            southWest: '西南地区'
        },
        cancels: [
            {key: 1, value: '不包括'},
            {key: 2, value: '包括'}
        ],
        seeTypes: [
            {key: 1, value: '全国航司'},
            {key: 2, value: '前十大航司'}
        ],
        startDate: '开始日期',
        endDate: '结束日期',
        date: '日期',
        flightNumber: '航班号',
        minNumber: '最小计划航班量',
        airport: '机场',
        airlineCode2: '航司二字码',
        planAirplane: '计划机型',
        STD: '计划起飞时刻',
        STA: '计划到达时刻',
        cancelTime: '取消时刻',
        cancelTotalText: '今日取消航班总量',
        seeType: '航司类型',
        isContainCancel: '是否包括取消航班',
        timeout: '您的验证已经过期，请重新登录。'
    },
    flightListHeader: {
        flightNum: '航班号',
        atype: '机型',
        tail: '飞机编号',
        from: '出发地',
        to: '到达地',
        STD: '计划起飞',
        ATD: '实际起飞',
        STA: '计划到达',
        ATA: '实际到达',
        carousel: '行李转盘',
        status: '状态',
        'totalText': '共 '
    },
    flightDetailsText: {
        'distance': '航程全长',
        'duration': '全程耗时',
        'type': '机型',
        'registration': '飞机编号',
        'height': '垂直高度',
        'track': '方位角',
        'speed': '水平速度',
        'lat': '纬度',
        'long': '经度'
    },
    //标签
    label: {
        popularAirport: '热门机场三字码',
        departDate: '出发日期',
        flightNO: '航班号',
        airport: '机场',
        airline: '航司'
    },
    //提示
    placeholder: {
        flightNO: '输入航班号',
        airportStart: '出发地',
        airportEnd: '到达地',
        airline: 'IATA/ICAO编码',
        date: '选择日期',
        airport: '三字码或四字码'
    },
    //验证
    validate: {
        required: '必填项',
        illegal: '格式不合法',
        dateRequired: '日期不能为空',
        flightRequired: '航班号不能为空',
        airlineRequired: '航司不能为空',
        airportRequired: '机场三字码不能为空',
        dateIllegal: '日期格式不合法',
        flightIllegal: '航班号不合法',
        airlineIllegal: '航司不合法',
        airportIllegal: '机场编码不合法',
        mustNumeric: '请只输入数字',
        dateSize: '开始日期不能小于结束日期'
    },
    //错误
    error: {
        pageNotFound: '不巧，网页走丢了...',
        flightInfoNotFound: '抱歉，没有找到您输入的航班信息',
        flightNONotFound: '抱歉，暂无该航班数据',
        airportNotFound: '没有该机场信息',
        straceNotFound: '没有该航班轨迹数据'
    }
};