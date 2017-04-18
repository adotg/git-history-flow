const utils = { };

utils.palette = () => {
    let colors = [
            '#023fa5', '#bec1d4', '#d6bcc0', '#8e063b', 
            '#4a6fe3', '#e6afb9', '#e07b91', '#d33f6a', 
            '#11c638', '#ead3c6', '#f0b98d', '#ef9708', 
            '#0fcfc0', '#f3e1eb', '#f6c4e1', '#f79cd4',
            '#7d87b9', '#8595e1', '#8dd593', '#9cded6', 
            '#bb7784', '#b5bbe3', '#c6dec7',  '#d5eae7' 
        ],
        i = 0,
        len = colors.length,
        size = () => len,
        next = () => colors[i++ % len],
        reset = () => (i = 0);

    return { size, next, reset }; 
};

export { utils as default };
