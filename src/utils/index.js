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

export { utils as default };
