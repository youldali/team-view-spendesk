import { approvalSchemeSliceInitialState, selectApprovalSchemeSlice, selectAllApprovalSchemes, setApprovalScheme } from './approvalScheme.slice';
import { rootReducer } from 'store';
import { approvalSchemesFixture } from './approvalScheme.fixture';
import { getInitialState } from 'utils/tests.util';

describe('Approval Scheme slice', () => {
    it('should return the initial state on first run', () => {
        expect(selectApprovalSchemeSlice(getInitialState())).toEqual(approvalSchemeSliceInitialState);
    });

    it('should add an approval scheme if it does not exist', () => {
        const action = {
            type: setApprovalScheme.type,
            payload: approvalSchemesFixture[0],
        }
        const nextState = rootReducer(getInitialState(), action);
        expect(selectAllApprovalSchemes(nextState)).toEqual([approvalSchemesFixture[0]]);
    });

    it('should replace an approval scheme if it does exist', () => {
        const action1 = {
            type: setApprovalScheme.type,
            payload: approvalSchemesFixture[0],
        }
        const nextState1 = rootReducer(getInitialState(), action1);

        const modifiedApprovalScheme = {...approvalSchemesFixture[1], teamId: approvalSchemesFixture[0].teamId }
        const action2 = {
            type: setApprovalScheme.type,
            payload: modifiedApprovalScheme,
        }
        const nextState2 = rootReducer(nextState1, action2);

        expect(selectAllApprovalSchemes(nextState2)).toEqual([modifiedApprovalScheme]);
    });

});