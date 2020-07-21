import React from 'react';
import Table, { Column } from 'routes/common/Table'
import { useSelector, useDispatch } from 'react-redux';
import { selectApprovalSchemeByTeamId } from 'features/approvalSchemes/approvalScheme.slice'
import { ApprovalScheme, ApprovalStep } from 'features/approvalSchemes/approvalScheme.model'
import { User } from 'features/users/user.model'
import { selectUserEntities } from 'features/users/users.slice'
import { useParams } from "react-router-dom";
import { Dictionary } from '@reduxjs/toolkit'
import { RootState } from 'store';

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


export default () => {
    const { teamId } = useParams();
    const usersEntities = useSelector(selectUserEntities);
    const approvalScheme = useSelector((state: RootState) => selectApprovalSchemeByTeamId(state, teamId));
    const approvalSteps = approvalScheme?.approvalSteps ?? [];

    const approvalStepsViewData = approvalStepToApprovalStepViewData(usersEntities)(approvalSteps);
    const rows = approvalStepsViewData.map(prepareData);

    return (
        <Table
            rows = {rows}
            columns = {columns}
        />
    )
}
