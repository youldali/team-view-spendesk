import React, { useEffect, useState } from 'react';
import Table, { Column } from 'routes/common/Table'
import { useSelector, useDispatch } from 'react-redux';
import { fetchTeamsThunk, selectTeamById, selectTeamsLoadingStatus } from 'features/teams/teams.slice'
import { fetchUsersThunk, selectUsersLoadingStatus, selectUserEntities } from 'features/users/users.slice'
import { selectApprovalSchemeByTeamId } from 'features/approvalSchemes/approvalScheme.slice'
import { ApprovalScheme, ApprovalStep } from 'features/approvalSchemes/approvalScheme.model'
import { 
    ApprovalSchemeDraft, 
    ApprovalStepDraft, 
    addApprovalStepToDraft, 
    getEmptyDraft, 
    modifyStepThreshold 
} from 'features/approvalSchemes/approvalSchemeDraft.model'
import { User } from 'features/users/user.model'
import { useParams } from "react-router-dom";
import { Dictionary } from '@reduxjs/toolkit'
import { RootState } from 'store';
import { LoadingState } from 'features/asyncSlice.util'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

interface ApprovalStepViewData {
    id: number,
    approverName: string,
    approveFrom: number,
    approveTo: number | null
}

const columns: Column[] = [
    { id: 'approverName', label: 'Approver name', minWidth: 170 },
    { id: 'approveFrom', label: 'Approve From', minWidth: 200 },
    { id: 'approveTo', label: 'Approve To', minWidth: 200 },
];

interface RowData {
    id: string,
    approverName: string,
    approveFrom: string | React.ReactElement,
    approveTo: string | React.ReactElement,
}

interface DraftActions {
    addStepToDraft: () => void,
    modifyThreshold: (threshold: number, stepIndex: number) => void
}

const approvalStepsToApprovalStepViewData = 
(usersEntity: Dictionary<User>) =>
(approvalSteps: ApprovalStepDraft[]): ApprovalStepViewData[] => {

    const reducer = (
        approvalStepsViewData: ApprovalStepViewData[], 
        approvalStep: ApprovalStepDraft, 
        index: number, 
        approvalSteps: ApprovalStepDraft[]
    ): ApprovalStepViewData[]  => {
        
        const approver = approvalStep.approverUserId ? usersEntity[approvalStep.approverUserId] : undefined;
        const approverName = approver === undefined ? '' : `${approver.firstName} ${approver.lastName}`;

        const approvalStepViewDataForFirstElement = () => (
            {
                id: index,
                approverName,
                approveFrom: 0,
                approveTo: approvalStep.threshold
            }
        );

        const approvalStepViewDataForOtherElements = () => (
            {
                id: index,
                approverName,
                approveFrom: approvalSteps[index - 1].threshold as number,
                approveTo: approvalStep.threshold
            }
        );

        const approvalStepViewData = index === 0 ? approvalStepViewDataForFirstElement() : approvalStepViewDataForOtherElements();
        approvalStepsViewData.push(approvalStepViewData);

        return approvalStepsViewData;
    }

    return approvalSteps.reduce(reducer, [])
};

const prepareData = 
(draftActions: DraftActions) => 
(approvalStepViewData: ApprovalStepViewData): RowData => (
    {
        id: approvalStepViewData.id.toString(),
        approverName: approvalStepViewData.approverName,
        approveFrom: 'From: ' + approvalStepViewData.approveFrom,
        approveTo:  approvalStepViewData.approveTo === null ? ' - ' 
                    :   <> 
                            <TextField
                                id="standard-number"
                                label="Up to"
                                type="number"
                                value={approvalStepViewData.approveTo}
                                onChange={event => draftActions.modifyThreshold(+event.target.value, approvalStepViewData.id)}
                            />
                        </>
                    
    }
);

function useEditApprovalScheme(approvalScheme: ApprovalSchemeDraft) {
    // const approvalSteps = approvalScheme.approvalSteps;
    const [draft, setDraft] = useState(approvalScheme);

    const addStepToDraft = () => setDraft(addApprovalStepToDraft(draft));
    const modifyThreshold = (threshold: number, stepIndex: number) => setDraft(modifyStepThreshold(threshold)(stepIndex)(draft))
    return {
        draft,
        draftActions: {
            addStepToDraft,
            modifyThreshold,
        }
    };
}

export default function ApprovalStepEditView() {
    const dispatch = useDispatch()

    const { teamId } = useParams();
    const team = useSelector((state: RootState) => selectTeamById(state, teamId));
    const teamsLoadingStatus = useSelector(selectTeamsLoadingStatus);

    const usersEntities = useSelector(selectUserEntities);
    const usersLoadingStatus = useSelector(selectUsersLoadingStatus);

    const maybeApprovalScheme = useSelector((state: RootState) => selectApprovalSchemeByTeamId(state, teamId));
    const approvalScheme = maybeApprovalScheme ?? getEmptyDraft(teamId);
    const approvalSteps = approvalScheme.approvalSteps;
    
    useEffect(() => {
        if(teamsLoadingStatus === LoadingState.Idle){
            dispatch(fetchTeamsThunk());
        }
    }, [teamsLoadingStatus, dispatch])

    useEffect(() => {
        if(usersLoadingStatus === LoadingState.Idle){
            dispatch(fetchUsersThunk());
        }
    }, [usersLoadingStatus, dispatch])

    const {draft, draftActions} = useEditApprovalScheme(approvalScheme);
    
    const approvalStepsViewData = approvalStepsToApprovalStepViewData(usersEntities)(draft.approvalSteps);
    const rows = approvalStepsViewData.map(prepareData(draftActions));

    return (
        <section>
            <h5>
                {
                    approvalScheme === undefined ? 'No approval scheme created yet' : 'Below the approval scheme defined'
                }
            </h5>
            <Button 
                variant="contained" 
                color="primary"
                onClick={draftActions.addStepToDraft}
            >
                Add step
            </Button>
            <Table
                rows = {rows}
                columns = {columns}
            />
        </section>
    )
}
