String.prototype.startsWith = function (value) {
    value = value || '';
    return this.substr(0, value.length) === value;
};

Date.prototype.toFormatString = function (format, isZeroize) {
    format = format || 'yyyy-MM-dd hh:mm:ss';
    isZeroize = !!isZeroize;
    let dy = this.getFullYear(),
        dM = this.getMonth() + 1,
        dd = this.getDate(),
        dh = this.getHours(),
        dm = this.getMinutes(),
        ds = this.getSeconds(),
        dS = this.getMilliseconds(),
        config = {
            'y+': dy.toString(),
            'M+': !isZeroize ? dM.toString() : dM < 10 ? '0' + dM : dM.toString(),
            'd+': !isZeroize ? dd.toString() : dd < 10 ? '0' + dd : dd.toString(),
            'h+': !isZeroize ? dh.toString() : dh < 10 ? '0' + dh : dh.toString(),
            'm+': !isZeroize ? dm.toString() : dm < 10 ? '0' + dm : dm.toString(),
            's+': !isZeroize ? ds.toString() : ds < 10 ? '0' + ds : ds.toString(),
            'S': dS.toString()
        };
    for (let i in config) {
        let item = config[i],
            pattern = new RegExp(i);
        if (pattern.test(format)) {
            let matches = format.match(pattern);
            if (matches) {
                let first = matches[0];
                if (i === 'S') {
                    format = format.replace(first, item);
                } else {
                    format = format.replace(first, item.substr(item.length - first.length));
                }
            }
        }
    }
    return format;
};

Date.prototype.addDays = function (value) {
    value = Number(value);
    if (isNaN(value)) {
        value = 0;
    }
    let clone = new Date(this.getTime()),
        result = clone.setDate(clone.getDate() + value);
    return new Date(result);
};

Date.prototype.addMonths = function (value) {
    value = Number(value);
    if (isNaN(value)) {
        value = 0;
    }
    let clone = new Date(this.getTime()),
        result = clone.setMonth(clone.getMonth() + value);
    return new Date(result);
};