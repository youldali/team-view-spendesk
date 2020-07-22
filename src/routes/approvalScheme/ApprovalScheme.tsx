import React, { useEffect, useState } from 'react';
import Table, { Column } from 'routes/common/Table'
import { useSelector, useDispatch } from 'react-redux';
import { fetchTeamsThunk, selectTeamById, selectTeamsLoadingStatus } from 'features/teams/teams.slice'
import { fetchUsersThunk, selectUsersLoadingStatus, selectUserEntities } from 'features/users/users.slice'
import { selectApprovalSchemeByTeamId } from 'features/approvalSchemes/approvalScheme.slice'
import { ApprovalScheme, ApprovalStep } from 'features/approvalSchemes/approvalScheme.model'
import { User } from 'features/users/user.model'
import { useParams } from "react-router-dom";
import { Dictionary } from '@reduxjs/toolkit'
import { RootState } from 'store';
import { LoadingState } from 'features/asyncSlice.util'

interface ApprovalStepViewData {
    id: number,
    approverName: string,
    approveFrom: number,
    approveTo: number | null
}

const columns: Column[] = [
    { id: 'approverName', label: 'Approver name', minWidth: 170 },
    { id: 'approvalRange', label: 'Approval range', minWidth: 200 },
];

interface RowData {
    id: string,
    approverName: string,
    approveFrom: string,
    approveTo: string,
}

const approvalStepToApprovalStepViewData = 
(usersEntity: Dictionary<User>) =>
(approvalSteps: ApprovalStep[]): ApprovalStepViewData[] => {

    const reducer = (
        approvalStepsViewData: ApprovalStepViewData[], 
        approvalStep: ApprovalStep, 
        index: number, 
        approvalSteps: ApprovalStep[]
    ): ApprovalStepViewData[]  => {
        
        const approver = usersEntity[approvalStep.approverUserId];
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

const prepareData = (approvalStepViewData: ApprovalStepViewData): RowData => (
    {
        id: approvalStepViewData.id.toString(),
        approverName: approvalStepViewData.approverName,
        approveFrom: 'From: ' + approvalStepViewData.approveFrom,
        approveTo: approvalStepViewData.approveTo === null ? ' - ' : 'to ' + approvalStepViewData.approveTo
    }
);

//-------------------------------
const addApprovalStep = (approvalSteps: ApprovalSteps[]): ApprovalSteps[] => {
    const numberOfSteps = approvalSteps.length;
    const lastStepIndex = approvalSteps.length - 1;
    const approverUserId = null;
    const newThreshold =    numberOfSteps === 0 ? null :
                            numberOfSteps === 1 ? 0 :
                            approvalSteps[numberOfSteps - 2].threshold
    const addApprovalStepToEmptySteps = () => (
        [{
            approverUserId,
            threshold: null,
        }]
    );

    const addApprovalStepToSingleStep = () => (
        [
            {
                approverUserId,
                threshold: 0,
            },
            ...approvalSteps
        ]
    );

    const addApprovalStepMultipleSteps = () => (
        [
            ...take(lastStepIndex - 1, approvalSteps),
            {
                approverUserId,
                threshold: approvalSteps[numberOfSteps - 2].threshold,
            },
            approvalSteps[lastStepIndex],
        ]
    );

    return (
            numberOfSteps === 0 ? addApprovalStepToEmptySteps() :
            numberOfSteps === 1 ? addApprovalStepToSingleStep() :
            addApprovalStepMultipleSteps()
    );
}

function useEditApprovalScheme(approvalScheme: ApprovalScheme) {
    const approvalSteps = approvalScheme.approvalSteps;
    const [draft, setDraft] = useState(approvalSteps);
  
    return isOnline;
  }

export default () => {
    const dispatch = useDispatch()

    const { teamId } = useParams();
    const usersEntities = useSelector(selectUserEntities);
    const approvalScheme = useSelector((state: RootState) => selectApprovalSchemeByTeamId(state, teamId));
    const approvalSteps = approvalScheme?.approvalSteps ?? [];

    const approvalStepsViewData = approvalStepToApprovalStepViewData(usersEntities)(approvalSteps);
    const rows = approvalStepsViewData.map(prepareData);

    
    const team = useSelector((state: RootState) => selectTeamById(state, teamId));
    const teamsLoadingStatus = useSelector(selectTeamsLoadingStatus);
    
    const usersLoadingStatus = useSelector(selectUsersLoadingStatus);

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

    return (
        <section>
            <h5>
                {
                    approvalScheme === undefined ? 'No approval scheme created yet' : 'Below the approval scheme defined'
                }
            </h5>
            <Table
                rows = {rows}
                columns = {columns}
            />
        </section>
    )
}
