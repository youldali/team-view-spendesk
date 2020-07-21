import { teamsSliceInitialState, fetchTeamsThunk, selectAllTeams, selectTeamsLoadingError, selectTeamsLoadingStatus, selectTeamsSlice } from './teams.slice';
import { rootReducer } from 'store';
import { teamsFixture } from './teams.fixture';
import { getInitialState } from 'utils/tests.util';
import { LoadingState } from '../asyncSlice.util'

describe('Teams slice', () => {
    it('should return the initial state on first run', () => {
        expect(selectTeamsSlice(getInitialState())).toEqual(teamsSliceInitialState);
    });

    it('should set the loading status to "Loading" when the request is started', () => {
        const action = {
            type: fetchTeamsThunk.pending.type,
        }
        const nextState = rootReducer(getInitialState(), action);
        expect(selectTeamsLoadingStatus(nextState)).toBe(LoadingState.Loading);
    });

    it('should set the loading status to "Failed" and set the error message when the loading fails', () => {
        const errorMessage = "HTTP 500 internal error";
        const action = {
            type: fetchTeamsThunk.rejected.type,
            payload: errorMessage,
        }
        const nextState = rootReducer(getInitialState(), action);
        expect(selectTeamsLoadingStatus(nextState)).toBe(LoadingState.Failed);
        expect(selectTeamsLoadingError(nextState)).toBe(errorMessage);
    });

    it('should set the teams in the state when the loading succeeds, and the loading status to "succeeded"', () => {
        const action = {
            type: fetchTeamsThunk.fulfilled.type,
            payload: teamsFixture,
        }
        const nextState = rootReducer(getInitialState(), action);
        expect(selectAllTeams(nextState)).toEqual(teamsFixture);
        expect(selectTeamsLoadingStatus(nextState)).toEqual(LoadingState.Succeeded);
    });
});
