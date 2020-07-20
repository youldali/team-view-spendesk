import { rootReducer } from 'store';

export const getInitialState = () => rootReducer(undefined, { type: '@@INIT'});