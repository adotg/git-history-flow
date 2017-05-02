import { combineReducers } from 'redux';
import { default as mode } from './mode';

const model = combineReducers({
    mode
});

export { model as default };
