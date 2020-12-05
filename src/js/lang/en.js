export const m = {
    global: {
        title: 'Flight Information Service Center',
        stitle: 'To know more about aviation in China',
        mtitle: 'VariFlight Flight On-schedule Rate Analysis System',
        flight: 'flights',
        search: 'Search',
        reset: 'Reset',
        submit: 'Submit',
        share: 'code sharing',
        flightStatus: {
            '-1': 'UnKnow',
            '0': 'Schedule',
            '1': 'Take-off',
            '2': 'Arrived',
            '3': 'Cancelled',
            '4': 'Delay',
            '5': 'Divert',
            '9': 'Boarding Finished',
            '11': 'Returning',
            '12': 'Boarding',
            '73': 'Cancel in Advance',
        },
        language: 'Chinese-english switch',
        please: 'Please enter '
    },
    header: {
        navs: [
            {
                title: 'Flight Tracking',
                subnavs: [
                    {
                        title: 'Flight Information',
                        route: '/flight-status-data',
                        desc: 'Real-time flight status globally.'
                    },
                    {
                        title: 'ADS-B',
                        route: '/ads-b',
                        desc: 'Live flight status monitoring sourced from ADS-B',
                    }
                ]
            },
            {
                title: 'Airport Monitoring',
                subnavs: [
                    {
                        title: 'Airport Weather',
                        route: '/weather/pek',
                        desc: 'Weather conditions and forecasts for Chinese airport.'
                    },
                    {
                        title: 'Airport Traffic',
                        route: '/operation',
                        desc: 'Traffic volumes for Chinese airports.'
                    }
                ]
            },
            {
                title: 'Flight Analyzer',
                subnavs: [
                    {
                        title: 'Airline Analysis',
                        route: '/analyzer/rank',
                        desc: 'Multi-dimensional analysis of airline on-time performance.'
                    },
                    // {
                    //     title: 'Airport Analysis',
                    //     route: '',
                    //     desc: 'Multi-dimensional analysis of airport on-time performance.'
                    // }
                ]
            }
        ],
        language: 'Switching between Chinese and English',
        logout: 'Log out',
        password: 'Change password'
    },
    footer: {
        contact: 'Contact Us',
        email: 'Mail',
        telephone: 'Tel',
        fax: 'Fax',
        visit: 'Visit Us',
        address: '17, Block A, City International Plaza, No.320 Qianshan Road, Shushan District, Hefei, Anhui, China'
    },
    login: {
        text: 'Login',
        success: 'Login authentication successful',
        error1: 'The user name cannot be empty.',
        error2: 'The password cannot be empty.',
        error3: 'ERROR Incorrect username or password.',
        error4: 'There is a problem with the network, please try again later.'
    },
    password: {
        oldPwd: {
            label: 'Old password',
            placeholder: 'Please enter your old password.',
            validate: 'The old password cannot be empty.'
        },
        newPwd: {
            label: 'New password',
            placeholder: 'Please enter your new password.',
            validate: 'The new password cannot be empty.',
            format: 'Password length should be 6-20 characters combined with letter and digit.'
        },
        confirmPwd: {
            label: 'Confirm password',
            placeholder: 'Please enter a new password again',
            validate: 'The two passwords you entered do not match.'
        },
        success: 'Your password has been changed successfully.',
        error10101: 'You can only change password one time a day.',
        error10102: 'Sorry, you have entered the wrong password.',
        error10103: 'The new password cannot be the same with the old one.',
        error10104: 'Your password has been changed unsuccessful.'
    },
    traffic: {
        searchText: 'Airport',
        navs: [
            {title: 'By Hour', route: '/operation/wave'},
            {title: 'Real-time Status', route: '/operation/info', isPage: true},
            // {title: 'Dep OTP', route: '/operation/rate'}
        ],
        title1: 'By Hour',
        title2: 'Real-time Flight Status',
        types: [
            {key: 'dep', value: 'Departure'},
            {key: 'arr', value: 'Arrival'},
            {key: 'gate', value: 'Gate hold and taxi out'}
        ],
        waveLegends: ['schedule departure', 'actual departure', 'schedule arrival', 'actual arrival'],
        columnLegends: {
            'CANCELED': 'CANCELED',
            'ONSCHEDULE': 'ONSCHEDULE',
            //dep
            'ATD_DLY_30': 'ATD_DLY_30',
            'ATD_DLY_60': 'ATD_DLY_60',
            'ATD_DLY_90': 'ATD_DLY_90',
            'ATD_DLY_MORE': 'ATD_DLY_MORE',
            'ETD_DLY_30': 'ETD_DLY_30',
            'ETD_DLY_60': 'ETD_DLY_60',
            'ETD_DLY_MORE': 'ETD_DLY_MORE',
            'ETD NOT ASSIGNED/NO DLY': 'ETD NOT ASSIGNED/NO DLY',
            //arr
            'ATA_DLY_30': 'ATA_DLY_30',
            'ATA_DLY_60': 'ATA_DLY_60',
            'ATA_DLY_90': 'ATA_DLY_90',
            'ATA_DLY_MORE': 'ATA_DLY_MORE',
            'ETA_DLY_30': 'ETA_DLY_30',
            'ETA_DLY_60': 'ETA_DLY_60',
            'ETA_DLY_MORE': 'ETA_DLY_MORE',
            'NOT AIRBORNE/NO DLY': 'NOT AIRBORNE/NO DLY',
            //gate
            'WITHIN 30': 'WITHIN 30',
            'WITHIN 60': 'WITHIN 60',
            'WITHIN 90': 'WITHIN 90',
            'MORE THAN 90': 'MORE THAN 90',
            'NOT ASSIGNED': 'NOT ASSIGNED'
        },
        overview: {
            lastTime: {dep: 'Last Departure', arr: 'Last Arrival'},
            delay: 'Delay',
            delayMore: 'Delay more than 1 hour',
            average: 'Average delay time',
            averageGate: 'Average gate hold and taxi out'
        },
        thead: {
            STD: 'STD',
            STA: 'STA',
            flightNo: 'Flight No.',
            acType: 'A/C Type',
            tail: 'Tail No.',
            terminal: 'Terminal',
            to: 'To',
            from: 'From',
            gate: 'Gate',
            takeOff: 'Take-Off',
            landing: 'Landing',
            status: 'Status'
        }
    },
    adsb: {
        types: {
            flight: 'The Flying Flights',
            monitor: 'The Ground Monitoring'
        },
        search: [
            {key: 'fnum', name: 'Flight No.', placeholder: 'Flight No.'},
            {key: 'airline', name: 'Airlines', placeholder: 'IATA/ICAO Code'},
            {key: 'airport', name: 'Airports', placeholder: 'Airport Code'}
        ],
        maps: {
            mapbox: 'FISC Map',
            openStreet: 'OpenStreet Map',
            terrain: 'Terrain Map'
        },
        placeholder: 'Flight No. Tail No.',
        detail: {
            AGO: 'AGO',
            STD: 'STD',
            STA: 'STA',
            ATD: 'ATD',
            ETA: 'ETA'
        }
    },
    weather: {
        paraStatus: {
            '0': 'No status',
            '1': 'No ARR/DEP',
            '2': 'In Operation',
            '3': 'Partly Delayed',
            '4': 'Massive Delays',
            '6': 'Closed',
            '-1': '-'
        },
        weatherRadar: 'Weather Radar',
        aptTitle1: 'Airport Information',
        aptTitle2: 'Weather Trend',
        lastest: 'Lastest',
        metar: 'METAR',
        taf: 'TAF',
        more: 'more',
        weather: 'WEATHER',
        historyWeather: 'Historical weather',
        futureWeather: 'Weather forecast',
        futureWeatherStatus: {
            CLEAR_DAY: 'Clear',
            CLEAR_NIGHT: 'Clear',
            PARTLY_CLOUDY_DAY: 'Partly Cloudy',
            PARTLY_CLOUDY_NIGHT: 'Partly Cloudy',
            CLOUDY: 'Cloudy',
            RAIN: 'Light Rain',
            SNOW: 'Snow',
            WIND: 'Wind',
            HAZE: 'Haze'
        },
        airportTraffic: 'Irregular Airport',
        status: 'status',
        Inbound: 'Inbound',
        Outbound: 'Outbound',
        lastestTime: 'Lastest',
        avgTime: 'Average ARR/DEP Time',
        otp: 'OTP Rate',
        dewPoint: 'DewPoint',
        wind: 'Wind',
        qnh: 'QNH',
        visibility: 'Visibility',
        noInfo: 'No weather information for the airport.',
        airportStatus: {
            specialSituation: 'Special Situation',
            largeAreaDelay: 'Area Delay'
        },
        temperature: 'temperature',
        unstable: 'unstable',
        metarTitle: 'Data sourced from METAR',
        cloudTitle: 'Data sourced from ColorfulClouds'
    },
    analyzer: {
        menus: {
            rank: 'Airline Ranking',
            aviation: 'CAAC Notice',
            east: 'East China Aviation Administration',
            southWest: 'Southwest Aviation Administration',
            attention: 'Airline Focus',
            route: 'Flight Leg Analysis',
            cancel: 'Cancellation Statistics'
        },
        calculateRule: 'Statistical Standards',
        calculateRules: {
            //title
            onTimeFlight: 'On-time Flight',
            depOnTimeFlight: 'DEP On-time Flight',
            arrOnTimeFlight: 'ARR On-time Flight',
            taxiout: 'Airport Taxi-out Time(CAAC Standards)',

            title: {
                southWestScheduleFlight: 'Scheduled Flight in Southwest Region',
                southWestNormalFlight: 'On-time Flight in Southwest Region',
                southWestFlightOTP: 'Flight OTP in Southwest Region',
            },

            //intro
            scheduleFlight: 'Scheduled Non-stopover Flight, Excluding flight cancelled in advance and international/regional return flight.',
            depOnTimeFlightText: 'ATD-ETD≤Airport Taxi Time(CAAC Standards)',
            arrOnTimeFlightText: 'ATA-ETA≤20min',
            ontimeFlight: 'ARR On-time or DEP On-time Flight',
            flightOTP: 'Flight OTP =On-time Flgiht/Scheduled Flight',
            depFlightOTP: 'DEP OTP=DEP On-time FLight/Scheduled Flight',
            taxioutText: '30min: PEK、SHA、PVG、CAN、SZX、CTU、KMG and every international airports; 20min: HGH、CKG、XIY、URC、NKG、XMN、TSN、TAO、CGO、WUH、CSX; 20min: HAK、SYX、HRB、DLC、KWE、SHE、TNA、FOC、NNG、LHW; 15min: Other airports.',
            total: 'Total FLights in DEP Airport',
            rank: 'Flight OTP Ranking in DEP Airport',

            depOTP: '(actual departure time - the planned departure time is less than the length of the airport taxi standard specified by the civil aviation administration)/the number of flights.',
            averageDEPDelayTime: 'The total departure delay time of all flight attendants (actual take-off - scheduled departure - Airport Taxi-out Time（CAAC Standards）)/DEP Irregular Flight.',
            averageDEPDelayTimeAnother: 'The departure delay time (actual take-off - scheduled departure - Airport Taxi-out Time（CAAC Standards）)/DEP Irregular Flight.',
            arrOTP: 'Actual arrival time - the planned arrival time is less than or equal to 20 minutes per flight.',
            averageARRDelayTime: 'The total length of flight delay (actual arrival - planned arrival)/flight number of all flights.',
            scheduledDuration: 'All scheduled flight hours (scheduled arrival time - scheduled departure time)/flight number.',
            actualDuration: 'The actual flight hours of all flight attendants (actual arrival time - actual departure time)/flight number.',

            intro: {
                southWestScheduleFlight: 'Scheduled Non-stopover Flight, Excluding flight cancelled in advance and international/regional return flight in southwest region',
                southWestNormalFlight: 'ARR On-time or DEP On-time Flight in Southwest Region',
                southWestFlightOTP: 'On-time Flgiht in Southwest Region/Scheduled Flight in Southwest Region'
            }
        },
        tableHeader: {
            rank: 'Ranking',
            total: 'Total',
            flightNo: 'Flight No.',
            forg: 'Origin',
            fdst: 'Destination',
            ETD: 'ETD',
            scheduleFlight: 'Schedule Flight',
            ontimeFlight: 'On-time Flight',
            flightOTP: 'Flight OTP',
            depFlightOTP: 'DEP Flight OTP',
            RankingOfOTP: 'Ranking Of OTP',
            totalOfOTP: 'Total of OTP',
            totalOfFlight: 'The total flight',
            arrFlightOTP: 'ARR Flight OTP',
            averageDEPDelayTime: 'Average DEP Delay Time',
            airlines: 'Airlines',
            airlinesCode: 'Airlines Code',
            aType: 'Scheduled Type',
            actualFlight: 'Actual Flight',
            depOTP: 'DEP OTP',
            arrOTP: 'ARR OTP',
            averageARRDelayTime: 'Average ARR Delay Time',
            scheduledDuration: 'Scheduled Duration',
            actualDuration: 'Actual Duration',
            southWest: 'Southwest Region'
        },
        cancels: [
            {key: 1, value: 'NO'},
            {key: 2, value: 'YES'}
        ],
        seeTypes: [
            {key: 1, value: 'ALL'},
            {key: 2, value: 'TOP10'}
        ],
        startDate: 'Start Date',
        endDate: 'End Date',
        date: 'Date',
        flightNumber: 'Flight No.',
        minNumber: 'Minimum Scheduled flight amount.',
        airport: 'Airport',
        airlineCode2: 'IATA Code',
        planAirplane: 'Airplane',
        STD: 'STD',
        STA: 'STA',
        cancelTime: 'Cancel time',
        cancelTotalText: 'Total concellations today',
        seeType: 'Airlines',
        isContainCancel: 'Cancelled flight include',
        timeout: 'Your verification has expired. Please log in again.'
    },
    flightListHeader: {
        flightNum: 'Flight No.',
        atype: 'A/C Type',
        tail: 'Tail No.',
        from: 'From',
        to: 'To',
        STD: 'STD',
        ATD: 'ATD',
        STA: 'STA',
        ATA: 'ATA',
        carousel: 'Carousel',
        status: 'Status',
        'totalText': 'a total of '
    },
    flightDetailsText: {
        'distance': 'DISTANCE',
        'duration': 'DURATION',
        'type': 'TYPE',
        'registration': 'REGISTRATION',
        'height': 'CALIBRATED ALTITUDE',
        'track': 'TRACK',
        'speed': 'GROUND SPEED',
        'lat': 'LATITUDE',
        'long': 'LONGITUDE'
    },
    //标签
    label: {
        popularAirport: 'Popular Airport Code',
        departDate: 'Departure',
        flightNO: 'Flight No.',
        airport: 'Airports',
        airline: 'Airlines'
    },
    //提示
    placeholder: {
        flightNO: 'Enter Flight no.',
        airportStart: 'FROM',
        airportEnd: 'TO',
        airline: 'IATA/ICAO Code',
        date: 'Select date',
        airport: 'ICAO Code'
    },
    //验证
    validate: {
        required: ' cannot be empty',
        illegal: ' is illegal',
        dateRequired: 'The date cannot be empty',
        flightRequired: 'The flight number cannot be empty',
        airlineRequired: 'The airline code cannot be empty',
        airportRequired: 'The airport code cannot be empty',
        dateIllegal: 'The date format is illegal',
        flightIllegal: 'The flight number is illegal',
        airlineIllegal: 'The airline is illegal',
        airportIllegal: 'The airport is illegal',
        mustNumeric: 'Please enter only the Numbers.',
        dateSize: 'Start date can not less than end date'
    },
    //错误
    error: {
        pageNotFound: 'Unfortunately, the page has been lost.',
        flightInfoNotFound: 'Sorry, cannot find the flight information you entered',
        flightNONotFound: 'Sorry, there is no data for this flight.',
        airportNotFound: 'The airport was not found',
        straceNotFound: 'There is no data on the flight path.'
    }
};