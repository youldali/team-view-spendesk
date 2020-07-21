import { usersSliceInitialState, fetchUsersThunk, selectAllUsers, selectUsersLoadingError, selectUsersLoadingStatus, selectUsersSlice } from './users.slice';
import { rootReducer } from 'store';
import { usersFixture } from './users.fixture';
import { getInitialState } from 'utils/tests.util';
import { LoadingState } from '../asyncSlice.util'

describe('Users slice', () => {
    it('should return the initial state on first run', () => {
        expect(selectUsersSlice(getInitialState())).toEqual(usersSliceInitialState);
    });

    it('should set the loading status to "Loading" when the request is started', () => {
        const action = {
            type: fetchUsersThunk.pending.type,
        }
        const nextState = rootReducer(getInitialState(), action);
        expect(selectUsersLoadingStatus(nextState)).toBe(LoadingState.Loading);
    });

    it('should set the loading status to "Failed" and set the error message when the loading fails', () => {
        const errorMessage = "HTTP 500 internal error";
        const action = {
            type: fetchUsersThunk.rejected.type,
            payload: errorMessage,
        }
        const nextState = rootReducer(getInitialState(), action);
        expect(selectUsersLoadingStatus(nextState)).toBe(LoadingState.Failed);
        expect(selectUsersLoadingError(nextState)).toBe(errorMessage);
    });

    it('should set the users in the state when the loading succeeds, and the loading status to "succeeded"', () => {
        const action = {
            type: fetchUsersThunk.fulfilled.type,
            payload: usersFixture,
        }
        const nextState = rootReducer(getInitialState(), action);
        expect(selectAllUsers(nextState)).toEqual(usersFixture);
        expect(selectUsersLoadingStatus(nextState)).toEqual(LoadingState.Succeeded);
    });
});
