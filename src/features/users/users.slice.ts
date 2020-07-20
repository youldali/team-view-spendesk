import { User } from './user.model';
import { createAsyncThunk, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'
import { fetchUsers } from 'apis/team-view.api'
import { RootState } from 'store';

export const fetchUsersThunk = createAsyncThunk(
    'users',
    fetchUsers
);

const usersAdapter = createEntityAdapter<User>();
export const usersSliceInitialState = usersAdapter.getInitialState({
    isLoading: false,
    isError: false,
    error: "",
});

export const usersSlice = createSlice({
    name: 'users',
    initialState: usersSliceInitialState,
    reducers: {
    },
    extraReducers: builder => {
        builder.addCase(fetchUsersThunk.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.isError = false;
            state.error = "";
            usersAdapter.setAll(state, payload);
        });
        builder.addCase(fetchUsersThunk.pending, (state, _) => {
            state.isLoading = true;
        });
        builder.addCase(fetchUsersThunk.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.isError = true;
            state.error = payload as string;
        });
    }
});

export const selectUsersSlice = (state: RootState) => state.users;
export const selectIsUsersLoading = createSelector(
    selectUsersSlice,
    usersSlice => usersSlice.isLoading
);
export const selectIsUsersError = createSelector(
    selectUsersSlice,
    usersSlice => usersSlice.isError
);
export const selectUsersError = createSelector(
    selectUsersSlice,
    usersSlice => usersSlice.error
);
export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
} = usersAdapter.getSelectors(selectUsersSlice);

export default usersSlice.reducer;