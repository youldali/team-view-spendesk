import React, { useEffect, useState } from 'react';
import { nanoid } from '@reduxjs/toolkit'
import Table, { Column } from 'routes/common/Table'
import { useSelector, useDispatch } from 'react-redux';
import { UserId } from 'features/users/user.model'
import { fetchTeamsThunk, selectTeamById, selectTeamsLoadingStatus } from 'features/teams/teams.slice'
import { fetchUsersThunk, selectAllUsers, selectUsersLoadingStatus, selectUserEntities } from 'features/users/users.slice'
import { selectApprovalSchemeByTeamId, setApprovalScheme } from 'features/approvalSchemes/approvalScheme.slice'
import { ApprovalScheme, ApprovalStep } from 'features/approvalSchemes/approvalScheme.model'
import { 
    ApprovalSchemeDraft, 
    ApprovalStepDraft, 
    addApprovalStepToDraft, 
    getEmptyDraft, 
    modifyStepThreshold,
    modifyStepApprover,
    getApprovalDraftValidateErrors,
    ApprovalSchemeDraftValidationErrors,
} from 'features/approvalSchemes/approvalSchemeDraft.model'
import { User } from 'features/users/user.model'
import { useParams } from "react-router-dom";
import { Dictionary } from '@reduxjs/toolkit'
import { RootState } from 'store';
import { LoadingState } from 'features/asyncSlice.util'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Link } from "react-router-dom";
import Loading from '../common/Loading'

interface ApprovalStepViewData {
    id: number,
    approverId: UserId | null,
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
    approverName: string | React.ReactElement,
    approveFrom: string | React.ReactElement,
    approveTo: string | React.ReactElement,
}

interface DraftActions {
    addStepToDraft: () => void,
    modifyThreshold: (threshold: number, stepIndex: number) => void,
    modifyApprover: (approverId: UserId, stepIndex: number) => void,
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
                approverId: approvalStep.approverUserId,
                approverName,
                approveFrom: 0,
                approveTo: approvalStep.threshold
            }
        );

        const approvalStepViewDataForOtherElements = () => (
            {
                id: index,
                approverId: approvalStep.approverUserId,
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
(usersList: User[]) =>
(draftActions: DraftActions) => 
(approvalStepViewData: ApprovalStepViewData): RowData => (
    {
        id: approvalStepViewData.id.toString(),
        approverName: getUserSelect
                        (usersList)
                        ((event: any) => draftActions.modifyApprover(event.target.value, approvalStepViewData.id))
                        (approvalStepViewData.approverId),
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
    const dispatch = useDispatch()
    const [draft, setDraft] = useState(approvalScheme);
    const [draftErrors, setDraftErrors] = useState([] as ApprovalSchemeDraftValidationErrors[]);

    const addStepToDraft = () => setDraft(addApprovalStepToDraft(draft));
    const modifyThreshold = (threshold: number, stepIndex: number) => setDraft(modifyStepThreshold(threshold)(stepIndex)(draft));
    const modifyApprover = (approverId: string, stepIndex: number) => setDraft(modifyStepApprover(approverId)(stepIndex)(draft));
    const validateDraft = () => {
        const errors = getApprovalDraftValidateErrors(draft);
        if(errors.length === 0){
            dispatch(setApprovalScheme(draft as ApprovalScheme))
        }
        setDraftErrors(errors)
    }

    return {
        draft,
        draftErrors,
        draftActions: {
            addStepToDraft,
            modifyThreshold,
            modifyApprover,
            validateDraft,
        }
    };
}

const getUserSelect = 
(usersList: User[]) => 
(onChange: any) => 
(value: string | null) => {
    const selectId = nanoid();
    return (
        <FormControl>
            <InputLabel id = {selectId}>Users</InputLabel>
            <Select
                value = {value ?? ''}
                labelId = {selectId}
                id = {selectId}
                onChange = {onChange}
            >
                {usersList.map(
                    (user) => (
                        <MenuItem 
                            value = {user.id}
                            key = {user.id}
                        >
                            {`${user.firstName} ${user.lastName}`}
                        </MenuItem>
                    ) 
                )}
            </Select>
        </FormControl>
    );
}

export default function ApprovalStepEditView() {
    const dispatch = useDispatch()

    const { teamId } = useParams();
    const team = useSelector((state: RootState) => selectTeamById(state, teamId));
    const teamsLoadingStatus = useSelector(selectTeamsLoadingStatus);

    const usersEntities = useSelector(selectUserEntities);
    const usersList = useSelector(selectAllUsers);
    const usersLoadingStatus = useSelector(selectUsersLoadingStatus);

    const maybeApprovalScheme = useSelector((state: RootState) => selectApprovalSchemeByTeamId(state, teamId));
    const approvalScheme = maybeApprovalScheme ?? getEmptyDraft(teamId);
    
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

    const {draft, draftErrors, draftActions} = useEditApprovalScheme(approvalScheme);
    
    const approvalStepsViewData = approvalStepsToApprovalStepViewData(usersEntities)(draft.approvalSteps);
    const rows = approvalStepsViewData.map(prepareData(usersList)(draftActions));

    if(team === undefined && teamsLoadingStatus === LoadingState.Succeeded) {
        return (
            <section>
                <section>
                    <Link to={`/`}>Back to teams list</Link>
                </section>
                <h5>No team with this Id exist</h5>
            </section>
        );
    }
    return (
        <Loading
            loadingStates = {[teamsLoadingStatus, usersLoadingStatus]}
        >
            <section>
                <section>
                    <Link to={`/`}>Back to teams list</Link>
                </section>
                <section>
                    <h5>
                        {
                            approvalScheme === undefined ? 'No approval scheme created yet' : 'Below the approval scheme defined'
                        }
                        for {team?.name}
                    </h5>
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={draftActions.addStepToDraft}
                    >
                        Add approval step
                    </Button>
                    <Table
                        rows = {rows}
                        columns = {columns}
                    />
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={draftActions.validateDraft}
                    >
                        Validate the approval scheme
                    </Button>

                    {
                        draftErrors.length > 0 &&
                        <div>
                            <h5>Approval Scheme invalid: </h5>
                            { draftErrors.map(error => <p>{error}</p>) }
                        </div>
                    }
                </section>
            </section>
        </Loading>
    )
}
