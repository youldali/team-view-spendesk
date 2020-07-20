import { combineReducers, configureStore } from '@reduxjs/toolkit';
import usersReducer from 'features/users/users.slice'
import teamsReducer from 'features/teams/teams.slice'

export const rootReducer = combineReducers({
    users: usersReducer,
    teams: teamsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default configureStore({
    reducer: rootReducer,
});
