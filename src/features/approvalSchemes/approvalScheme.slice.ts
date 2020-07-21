import { ApprovalScheme, ApprovalStep } from './approvalScheme.model';
import { createEntityAdapter, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'store';

const approvalSchemeAdapter = createEntityAdapter<ApprovalScheme>({
    selectId: approvalScheme => approvalScheme.teamId,
});

export const approvalSchemeSliceInitialState = approvalSchemeAdapter.getInitialState();

export const approvalSchemeSlice = createSlice({
    name: 'approvalScheme',
    initialState: approvalSchemeSliceInitialState,
    reducers: {
        setApprovalScheme(state, {payload}: PayloadAction<ApprovalScheme>) {
            approvalSchemeAdapter.removeOne(state, payload.teamId);
            approvalSchemeAdapter.addOne(state, payload)
        }
    },
});

export const { setApprovalScheme } = approvalSchemeSlice.actions;

export const selectApprovalSchemeSlice = (state: RootState) => state.approvalScheme;

export const {
    selectAll: selectAllApprovalSchemes,
    selectById: selectApprovalSchemeByTeamId,
} = approvalSchemeAdapter.getSelectors(selectApprovalSchemeSlice);

export default approvalSchemeSlice.reducer;