import { combineReducers } from 'redux';
import { mode, xType, focus } from './common';

const model = combineReducers({
    mode,
    xType,
    focus
});

export { model as default };
