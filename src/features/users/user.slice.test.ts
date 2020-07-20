import { usersSliceInitialState, fetchUsersThunk, selectAllUsers, selectIsUsersError, selectUsersError, selectIsUsersLoading, selectUsersSlice } from './users.slice';
import { rootReducer } from 'store';
import { usersFixture } from './users.fixture';
import { getInitialState } from 'utils/tests.util';

describe('Users slice', () => {
    it('should return the initial state on first run', () => {
        expect(selectUsersSlice(getInitialState())).toEqual(usersSliceInitialState);
    });

    it('should set the isLoading flag to true when the request is started', () => {
        const action = {
            type: fetchUsersThunk.pending.type,
        }
        const nextState = rootReducer(getInitialState(), action);
        expect(selectIsUsersLoading(nextState)).toBe(true);
    });

    it('should set the isError flag and the error message when the loading fails', async () => {
        const errorMessage = "HTTP 500 internal error";
        const action = {
            type: fetchUsersThunk.rejected.type,
            payload: errorMessage,
        }
        const nextState = rootReducer(getInitialState(), action);
        expect(selectIsUsersError(nextState)).toBe(true);
        expect(selectUsersError(nextState)).toBe(errorMessage);
    });

    it('should set the users in the state when the loading succeeds', async () => {
        const action = {
            type: fetchUsersThunk.fulfilled.type,
            payload: usersFixture,
        }
        const nextState = rootReducer(getInitialState(), action);
        expect(selectAllUsers(nextState)).toEqual(usersFixture);
    });
});
