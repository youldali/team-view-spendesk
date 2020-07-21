import { UserId } from '../users/user.model'
import { TeamId } from '../teams/team.model'
import { uniqBy } from 'ramda'

export interface ApprovalStep {
    approverUserId: UserId,
    threshold: number | null,
}

export interface ApprovalScheme {
    teamId: TeamId,
    approvalSteps: ApprovalStep[],
}

export const isApproverUniqueInApprovalSteps = (approvalSteps: ApprovalStep[]): boolean => {
    const approvalStepsWithUniqueApprovers = uniqBy(
        (approvalStep: ApprovalStep) => approvalStep.approverUserId, 
        approvalSteps
    );

    return approvalSteps.length === approvalStepsWithUniqueApprovers.length;
}

export const areThresholdsPositive = (approvalSteps: ApprovalStep[]): boolean => (
    !approvalSteps.some(approvalStep => approvalStep.threshold !== null && approvalStep.threshold <= 0)
)

export const areThresholdsNotOverlapping = (approvalSteps: ApprovalStep[]): boolean => {
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
                currentThreshold < previousThreshold ? false : 
                true
            );
        }

        return true;
    } 

    return checkLastThresholdIsNull() && checkThresholdsValues();
}