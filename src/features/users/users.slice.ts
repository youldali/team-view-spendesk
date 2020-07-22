import { User } from './user.model';
import { createAsyncThunk, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'
import { fetchUsers } from 'apis/team-view.api'
import { RootState } from 'store';
import { adapterInitialState, buildAsyncReducer } from '../asyncSlice.util';

const usersAdapter = createEntityAdapter<User>();

export const fetchUsersThunk = createAsyncThunk(
    'users',
    fetchUsers
);

export const usersSliceInitialState = usersAdapter.getInitialState(adapterInitialState);

export const usersSlice = createSlice({
    name: 'users',
    initialState: usersSliceInitialState,
    reducers: {
    },
    extraReducers: buildAsyncReducer(fetchUsersThunk)(usersAdapter)
});

export const selectUsersSlice = (state: RootState) => state.users;

export const selectUsersLoadingStatus = createSelector(
    selectUsersSlice,
    usersSlice => usersSlice.status
);

export const selectUsersLoadingError = createSelector(
    selectUsersSlice,
    usersSlice => usersSlice.error
);

export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectEntities: selectUserEntities,
} = usersAdapter.getSelectors(selectUsersSlice);

export default usersSlice.reducer;