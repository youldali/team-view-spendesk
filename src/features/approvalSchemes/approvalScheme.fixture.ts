import { ApprovalScheme } from './approvalScheme.model';

export const approvalSchemesFixture: ApprovalScheme[] = [
    {
        "teamId": "TEAM1",
        "approvalSteps": [
            {
                approverUserId: "user1",
                threshold: 500,
            },
            {
                approverUserId: "user2",
                threshold: 1000,
            },
            {
                approverUserId: "user3",
                threshold: null,
            }
        ]
    },
    {
        "teamId": "TEAM2",
        "approvalSteps": [
            {
                approverUserId: "user1",
                threshold: 5000,
            },
            {
                approverUserId: "user2",
                threshold: null,
            }
        ]
    }
];
