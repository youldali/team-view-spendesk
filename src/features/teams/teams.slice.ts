import { Team } from './team.model';
import { createAsyncThunk, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'
import { fetchTeams } from 'apis/team-view.api'
import { RootState } from 'store';
import { adapterInitialState, buildAsyncReducer } from '../asyncSlice.util';

const teamsAdapter = createEntityAdapter<Team>();

export const fetchTeamsThunk = createAsyncThunk(
    'teams',
    fetchTeams
);

export const teamsSliceInitialState = teamsAdapter.getInitialState(adapterInitialState);

export const teamsSlice = createSlice({
    name: 'teams',
    initialState: teamsSliceInitialState,
    reducers: {
    },
    extraReducers: buildAsyncReducer(fetchTeamsThunk)(teamsAdapter)
});

export const selectTeamsSlice = (state: RootState) => state.teams;

export const selectTeamsLoadingStatus = createSelector(
    selectTeamsSlice,
    teamsSlice => teamsSlice.status
);

export const selectTeamsLoadingError = createSelector(
    selectTeamsSlice,
    teamsSlice => teamsSlice.error
);

export const {
    selectAll: selectAllTeams,
    selectById: selectTeamById,
} = teamsAdapter.getSelectors(selectTeamsSlice);

export default teamsSlice.reducer;