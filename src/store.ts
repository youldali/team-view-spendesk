import { combineReducers, configureStore } from '@reduxjs/toolkit';

export const rootReducer = combineReducers({
});

export type RootState = ReturnType<typeof rootReducer>;

export default configureStore({
    reducer: rootReducer,
});
