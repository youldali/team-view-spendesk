import { UserId } from '../users/user.model'
import { TeamId } from '../teams/team.model'

export interface ApprovalStep {
    userId: UserId,
    threshold: number,
}

export interface ApprovalScheme {
    teamId: TeamId,
    approvalSteps: ApprovalStep[],
}
