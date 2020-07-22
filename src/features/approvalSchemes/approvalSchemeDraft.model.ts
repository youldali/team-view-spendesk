import { UserId } from '../users/user.model'
import { TeamId } from '../teams/team.model'
import { take, uniqBy } from 'ramda'

export interface ApprovalStepDraft {
    approverUserId: UserId | null,
    threshold: number | null,
}

export interface ApprovalSchemeDraft {
    teamId: TeamId,
    approvalSteps: ApprovalStepDraft[],
}

export enum ApprovalSchemeDraftValidationErrors {
    ApproverNotUnique = "ApproverNotUnique",
    ApproverUndefined = "ApproverUndefined",
    ThresholdNotPositiveNumber = "ThresholdNotPositiveNumber",
    ThresholdOverlapping = "ThresholdOverlapping",
}
export const getEmptyDraft = (teamId: TeamId): ApprovalSchemeDraft => (
    {
        teamId,
        approvalSteps: [],
    }
);

export const isApproverUniqueInApprovalSteps = ({ approvalSteps }: ApprovalSchemeDraft): boolean => {
    const approvalStepsWithUniqueApprovers = uniqBy(
        (approvalStep: ApprovalStepDraft) => approvalStep.approverUserId, 
        approvalSteps
    );

    return approvalSteps.length === approvalStepsWithUniqueApprovers.length;
}

export const areApproversDefined = ({ approvalSteps }: ApprovalSchemeDraft): boolean => (
    !approvalSteps.some(approvalStep => approvalStep.approverUserId === null)
)

export const areThresholdsPositive = ({ approvalSteps }: ApprovalSchemeDraft): boolean => (
    !approvalSteps.some(approvalStep => 
        approvalStep.threshold !== null && 
        (typeof approvalStep.threshold !== 'number' || approvalStep.threshold <= 0)
    )
)

export const areThresholdsNotOverlapping = ({ approvalSteps }: ApprovalSchemeDraft): boolean => {
    const lastIndex = approvalSteps.length - 1;

    const checkLastThresholdIsNull = () => approvalSteps[lastIndex].threshold === null;

    const checkThresholdsValues = () => {
        if(approvalSteps.length < 3) {
            return true;
        }

        for(let i = lastIndex - 1; i > 0; i--) {
            const currentThreshold = approvalSteps[i].threshold;
            const previousThreshold = approvalSteps[i - 1].threshold;
            return (
                currentThreshold === null || previousThreshold === null ? false :
                currentThreshold <= previousThreshold ? false : 
                true
            );
        }

        return true;
    } 

    return checkLastThresholdIsNull() && checkThresholdsValues();
}

const validationToErrorMap = {
    [ApprovalSchemeDraftValidationErrors.ApproverNotUnique]: isApproverUniqueInApprovalSteps,
    [ApprovalSchemeDraftValidationErrors.ApproverUndefined]: areApproversDefined,
    [ApprovalSchemeDraftValidationErrors.ThresholdNotPositiveNumber]: areThresholdsPositive,
    [ApprovalSchemeDraftValidationErrors.ThresholdOverlapping]: areThresholdsNotOverlapping,
}

export const getApprovalDraftValidateErrors = (approvalScheme: ApprovalSchemeDraft): ApprovalSchemeDraftValidationErrors[] => (
    Object.entries(validationToErrorMap).reduce(
        (acc, [validationErrorKey, validateFunction]): ApprovalSchemeDraftValidationErrors[] => {
            if (!validateFunction(approvalScheme)) {
                acc.push(validationErrorKey as ApprovalSchemeDraftValidationErrors)  
            }
            return acc;
        }
    , [] as ApprovalSchemeDraftValidationErrors[])
)

export const addApprovalStepToDraft = (approvalScheme: ApprovalSchemeDraft): ApprovalSchemeDraft => {
    const { approvalSteps } = approvalScheme;
    const numberOfSteps = approvalSteps.length;
    const lastStepIndex = approvalSteps.length - 1;
    const approverUserId = null;

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
            ...take(numberOfSteps - 1, approvalSteps),
            {
                approverUserId,
                threshold: approvalSteps[lastStepIndex - 1].threshold,
            },
            approvalSteps[lastStepIndex],
        ]
    );

    const newApprovalStepsDraft = (
            numberOfSteps === 0 ? addApprovalStepToEmptySteps() :
            numberOfSteps === 1 ? addApprovalStepToSingleStep() :
            addApprovalStepMultipleSteps()
    );

    return {
        ...approvalScheme,
        approvalSteps: newApprovalStepsDraft,
    }
}

export const modifyStepThreshold = 
(threshold: number) => 
(stepIndex: number) =>
(approvalScheme: ApprovalSchemeDraft): ApprovalSchemeDraft => {
    const { approvalSteps } = approvalScheme;
    const lastStepIndex = approvalSteps.length - 1;

    if(stepIndex >= lastStepIndex) {
        return approvalScheme;
    }

    approvalSteps[stepIndex].threshold = threshold;
    return {
        ...approvalScheme,
        approvalSteps,
    }
}

export const modifyStepApprover = 
(approverId: UserId) => 
(stepIndex: number) =>
(approvalScheme: ApprovalSchemeDraft): ApprovalSchemeDraft => {
    const { approvalSteps } = approvalScheme;
    const lastStepIndex = approvalSteps.length - 1;

    if(stepIndex > lastStepIndex) {
        return approvalScheme;
    }

    approvalSteps[stepIndex].approverUserId = approverId;
    return {
        ...approvalScheme,
        approvalSteps,
    }
}
