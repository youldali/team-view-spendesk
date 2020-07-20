import { Team } from './team.model';
import { createAsyncThunk, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'
import { fetchTeams } from 'apis/team-view.api'
import { RootState } from 'store';

export const fetchTeamsThunk = createAsyncThunk(
    'teams',
    fetchTeams
);

const teamsAdapter = createEntityAdapter<Team>();
export const teamsSliceInitialState = teamsAdapter.getInitialState({
    isLoading: false,
    isError: false,
    error: "",
});

export const teamsSlice = createSlice({
    name: 'teams',
    initialState: teamsSliceInitialState,
    reducers: {
    },
    extraReducers: builder => {
        builder.addCase(fetchTeamsThunk.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.isError = false;
            state.error = "";
            teamsAdapter.setAll(state, payload);
        });
        builder.addCase(fetchTeamsThunk.pending, (state, _) => {
            state.isLoading = true;
        });
        builder.addCase(fetchTeamsThunk.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.isError = true;
            state.error = payload as string;
        });
    }
});

export const selectTeamsSlice = (state: RootState) => state.teams;
export const selectIsTeamsLoading = createSelector(
    selectTeamsSlice,
    teamsSlice => teamsSlice.isLoading
);
export const selectIsTeamsError = createSelector(
    selectTeamsSlice,
    teamsSlice => teamsSlice.isError
);
export const selectTeamsError = createSelector(
    selectTeamsSlice,
    teamsSlice => teamsSlice.error
);
export const {
    selectAll: selectAllTeams,
    selectById: selectTeamById,
} = teamsAdapter.getSelectors(selectTeamsSlice);

export default teamsSlice.reducer;