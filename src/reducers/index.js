import { combineReducers } from 'redux';
import { mode, xType } from './common';

const model = combineReducers({
    mode,
    xType
});

export { model as default };
