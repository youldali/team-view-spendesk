import { teamsSliceInitialState, fetchTeamsThunk, selectAllTeams, selectIsTeamsError, selectTeamsError, selectIsTeamsLoading, selectTeamsSlice } from './teams.slice';
import { rootReducer } from 'store';
import { teamsFixture } from './teams.fixture';
import { getInitialState } from 'utils/tests.util';

describe('Teams slice', () => {
    it('should return the initial state on first run', () => {
        expect(selectTeamsSlice(getInitialState())).toEqual(teamsSliceInitialState);
    });

    it('should set the isLoading flag to true when the request is started', () => {
        const action = {
            type: fetchTeamsThunk.pending.type,
        }
        const nextState = rootReducer(getInitialState(), action);
        expect(selectIsTeamsLoading(nextState)).toBe(true);
    });

    it('should set the isError flag and the error message when the loading fails', async () => {
        const errorMessage = "HTTP 500 internal error";
        const action = {
            type: fetchTeamsThunk.rejected.type,
            payload: errorMessage,
        }
        const nextState = rootReducer(getInitialState(), action);
        expect(selectIsTeamsError(nextState)).toBe(true);
        expect(selectTeamsError(nextState)).toBe(errorMessage);
    });

    it('should set the Teams in the state when the loading succeeds', async () => {
        const action = {
            type: fetchTeamsThunk.fulfilled.type,
            payload: teamsFixture,
        }
        const nextState = rootReducer(getInitialState(), action);
        expect(selectAllTeams(nextState)).toEqual(teamsFixture);
    });
});
