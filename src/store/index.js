import { createStore } from 'redux';
import { default as model } from '../reducers';

const store = createStore(model);

export { store as default };
