import UserToken from 'src@/js/helpers/userToken';

function getAnalyzerAirportList(isEast) {
    isEast = !!isEast;
    const defaultList = [
        {key: 'ZBAA', value: 'ZBAA'},
        {key: 'ZSPD', value: 'ZSPD'},
        {key: 'ZGGG', value: 'ZGGG'},
        {key: 'ZUUU', value: 'ZUUU'},
        {key: 'ZPPP', value: 'ZPPP'},
        {key: 'ZGSZ', value: 'ZGSZ'},
        {key: 'ZSSS', value: 'ZSSS'},
        {key: 'ZLXY', value: 'ZLXY'},
        {key: 'ZUCK', value: 'ZUCK'},
        {key: 'ZSHC', value: 'ZSHC'},
        {key: 'ZSAM', value: 'ZSAM'},
        {key: 'ZSNJ', value: 'ZSNJ'},
        {key: 'ZGHA', value: 'ZGHA'},
        {key: 'ZHHH', value: 'ZHHH'},
        {key: 'ZHCC', value: 'ZHCC'},
        {key: 'ZSQD', value: 'ZSQD'},
        {key: 'ZWWW', value: 'ZWWW'},
        {key: 'ZBTJ', value: 'ZBTJ'},
        {key: 'ZJHK', value: 'ZJHK'}
    ];
    const eastList = [
        {key: 'ZSPD', value: 'ZSPD'},
        {key: 'ZSSS', value: 'ZSSS'},
        {key: 'ZSNJ', value: 'ZSNJ'},
        {key: 'ZSHC', value: 'ZSHC'},
        {key: 'ZSAM', value: 'ZSAM'},
        {key: 'ZSQD', value: 'ZSQD'},
        {key: 'ZSFZ', value: 'ZSFZ'},
        {key: 'ZSNT', value: 'ZSNT'}
    ];
    const schkList = [
        {key: 'ZSYA', value: 'ZSYA'},
        {key: 'ZSXZ', value: 'ZSXZ'},
        {key: 'ZSWZ', value: 'ZSWZ'},
        {key: 'ZSWX', value: 'ZSWX'},
        {key: 'ZSOF', value: 'ZSOF'},
        {key: 'ZSNB', value: 'ZSNB'},
        {key: 'ZSJN', value: 'ZSJN'},
        {key: 'ZSCN', value: 'ZSCN'},
        {key: 'ZSCG', value: 'ZSCG'}
    ];
    if (!isEast) return defaultList;
    else {
        let userInfo = UserToken.getUserInfo(),
            username = userInfo ? userInfo.username : '';
        if (username !== 'schk') return eastList;
        return eastList.concat(schkList);
    }
}

export default getAnalyzerAirportList;