import device from 'src@/js/common/device';

//-------------------------------原版本工具函数-----------------------------------//
export const dateFormate = (date, fmt) => {
    let o = {
        'M+': date.getMonth() + 1, //month
        'd+': date.getDate(), //date
        'h+': date.getHours(), //hour
        'm+': date.getMinutes(), //min
        's+': date.getSeconds(), //second
        'S': date.getMilliseconds() //millsecond
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    return fmt;
};

export const secondToDateByFormate = (second, fmt) => {
    second = Number(second);
    let date = new Date(second * 1000);
    return dateFormate(date, fmt);
};

export const mappingStatus = (statusCode) => {
    statusCode = Number(statusCode);
    let obj = {
        0: 'Schedule',
        1: 'Take-off',
        2: 'Arrived',
        3: 'Cancelled',
        4: 'Delay',
        5: 'Divert',
        9: 'Boarding Finished',
        11: 'Returning',
        12: 'Boarding',
        73: 'Cancel in Advance'
    };
    return obj[statusCode];
};

export const numberToEnMonthName = (month) => {
    month = Number(month);
    let obj = {
        1: 'Jan',
        2: 'Feb',
        3: 'Mar',
        4: 'Apr',
        5: 'May',
        6: 'Jun',
        7: 'Jul',
        8: 'Aug',
        9: 'Sep',
        10: 'Oct',
        11: 'Nov',
        12: 'Dec'
    };
    return obj[month];
};

export const decimal2 = (n) => {
    return Number(n).toFixed(2);
};

export const meterToKiloMeter = (meter) => {
    return Math.ceil(Number(meter) / 1000);
};

export const calculateSecond = (second) => {
    if (second) {
        let hour = parseInt(second / (60 * 60));
        let min = parseInt((second % (60 * 60)) / 60);
        hour = String(hour).length === 1 ? '0' + hour : hour;
        min = String(min).length === 1 ? '0' + min : min;
        return hour + ':' + min;
    } else {
        return '-';
    }
};

export const toCamelCase = (prefix, str) => {
    prefix = prefix || '';
    str = str || '';
    return prefix.toLowerCase() + str.replace(/^\w/i, value => value.toUpperCase());
};

//-------------------------------新版本工具函数-----------------------------------//
//JSON对象转换
export const parseJSON = (value) => {
    try {
        return JSON.parse(value);
    } catch (ex) {
        throw new Error(ex);
    }
};

//补零函数
export const zerofill = (value) => {
    value = Number(value);
    if (isNaN(value)) return null;
    return value < 10 ? '0' + String(value) : String(value);
};

//转换百分比
export const convertPercent = (value) => {
    return Number((value * 100).toFixed(2));
};

//构建路径
export const buildPath = (isMobile, isChinese, postfix) => {
    if (isMobile === null) {
        isMobile = device.isMobile();
    }
    isChinese = !!isChinese;
    postfix = postfix || '/login';
    return (isMobile ? '/mobile' : '') + (isChinese ? '/cn' : '') + postfix;
};

//判断月初，统计分析日期范围中，每月前三天为月初
export const isEarly = () => {
    let day = new Date().getDate(),
        diff = 1;//日期范围组件的默认值为前一天，误差值为1
    return day === 1 + diff || day === 2 + diff || day === 3 + diff;
};

export const getKeys = (data) => {
    if (!data) return [];
    let result = [];
    for (let key in data) {
        result.push(key);
    }
    return result;
};

export const fillEquals = (count) => {
    let result = '';
    for (let i = 0; i < count; i++) {
        result += '=';
    }
    return result;
};