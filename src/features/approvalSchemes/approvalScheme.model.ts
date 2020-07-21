import { UserId } from '../users/user.model'
import { TeamId } from '../teams/team.model'

export interface ApprovalStep {
    approverUserId: UserId,
    threshold: number | null,
}

export interface ApprovalScheme {
    teamId: TeamId,
    approvalSteps: ApprovalStep[],
}
