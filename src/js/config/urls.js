// const adoHost = 'http://dev.variflight.com/muyang/testado/web/v1';
const adoHost = 'http://fisc.variflight.com/v1';

export default {
    airlineIconUrl: 'http://pic.veryzhun.com/assets/image/aircorp/',
    fetchFlightStatusByFnumUrl: `${adoHost}/flight/get-by-fnum`,
    fetchFlightStatusByAirportUrl: `${adoHost}/flight/get-by-route`,
    fetchFlightStatusByAirlineUrl: `${adoHost}/flight/get-by-airline`,
    fetchRealtimePlanesOfMapUrl: `${adoHost}/adsb/list`,
    fetchDetailsInfoUrl: `${adoHost}/adsb/detail`,
    fetchGroundMonitoringPlanesUrl: `${adoHost}/adsb/ground-list`,
    fetchDetailsOfGroundMonitoringUrl: `${adoHost}/adsb/ground-trace`,
    weather: {
        fetchWarnList: `${adoHost}/airport/warning-list`,
        fetchRadar: `${adoHost}/weather/radar`,
        fetchChart: `${adoHost}/weather/chart`,
        fetchNewestAirportInfo: `${adoHost}/airport/states`,
        fetchNewestWeatherInfo: `${adoHost}/weather/latest`,
        fetchWeatherAndMessageList: `${adoHost}/weather/list`,
        fetchAirportHourlyWeatherPatterns: `${adoHost}/weather/h-forecast`
    },
    auth: {
        login: `${adoHost}/user/login`,
        refreshToken: `${adoHost}/auth/refresh-token`,
        password: `${adoHost}/auth/revise-pwd`
    },
    analyzer: {
        rank: `${adoHost}/airline-chart/index`,
        aviation: `${adoHost}/aviation/index`,
        east: `${adoHost}/east/index`,
        southWest: `${adoHost}/south-west/index`,
        attention: `${adoHost}/attention/index`,
        route: `${adoHost}/segment/index`,
        cancel: `${adoHost}/cancel/index`
    },
    operation: {
        traffics: `${adoHost}/airport/traffics`,
        states: `${adoHost}/airport/states`,
        screen: `${adoHost}/airport/screen`,
        screenDiagram: `${adoHost}/airport/screen-diagram`
    }
}