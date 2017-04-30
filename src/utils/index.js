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
