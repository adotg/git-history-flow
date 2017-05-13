const 
    changeMode = (mode) => ({ type: 'CHANGE_MODE', payload: { mode: mode } }),
    changeXType = (type) => ({ type: 'CHANGE_X', payload: { type: type } });

export { changeMode, changeXType };
