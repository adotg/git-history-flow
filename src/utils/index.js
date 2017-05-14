const utils = { };

utils.palette = () => {
    let colors = [
            '#F44336', '#E91E63', '#9C27B0', 
            '#03A9F4', '#00BCD4', '#009688', 
            '#4CAF50', '#8BC34A', '#CDDC39', 
            '#FFEB3B', '#FFC107', '#FF9800', 
            '#FF5722', '#795548', '#9E9E9E', '#607D8B'],
        i = 0,
        len = colors.length,
        size = () => len,
        next = () => colors[i++ % len],
        reset = () => (i = 0);

    return { size, next, reset }; 
};

utils.ISO8601toNativeDate = (isoString) => {
    let isoDateArr = isoString.split(/\s+/),
        dateCompArr = isoDateArr[0].split('-').map(d => parseInt(d)),
        timeCompArr = isoDateArr[1].split(':').map(d => parseInt(d));

    return new Date(dateCompArr[0], dateCompArr[1] - 1, dateCompArr[2], 
        timeCompArr[0], timeCompArr[1], timeCompArr[2]);
};

utils.search = (arr, item, start, end) => {
    let middle;

    start = start || 0;
    end = end || arr.length - 1;

    if (end - start === 1) {
        return ((arr[end] + arr[start]) / 2) > item ? start : end;
    }

    middle = (start + end) / 2;
    middle = Math.floor(middle);

    if (arr[middle] === item) {
        return middle;
    } else if (arr[middle] < item) {
        return utils.search(arr, item, middle, end);
    } else {
        return utils.search(arr, item, start, middle);
    }
};

utils.getNiceDate = (date, towards = 0) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + towards);
};

utils.niceDateTicks = (d1, d2) => {
    let dayFraction, 
        diffInMS = d2.getTime() - d1.getTime();

    dayFraction = diffInMS / (1000 * 60 * 60 * 24);

    if (dayFraction > 1) {
        return [
            d1.getFullYear() + '-' + (d1.getMonth() + 1) + '-' + d1.getDate(),
            d2.getFullYear() + '-' + (d2.getMonth() + 1) + '-' + d2.getDate()
        ];
    } else {
        return [
            d1.getFullYear() + '-' + (d1.getMonth() + 1) + '-' + d1.getDate() + ' ' + 
                d1.getHours() + ':' + d1.getMinutes(),
            d2.getFullYear() + '-' + (d2.getMonth() + 1) + '-' + d2.getDate() + ' ' + 
                d2.getHours() + ':' + d2.getMinutes()
        ];
    }
};

export { utils as default };
