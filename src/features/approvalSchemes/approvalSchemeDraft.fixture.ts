import { ApprovalSchemeDraft } from './approvalSchemeDraft.model';

export const validApprovalSchemeFixture: ApprovalSchemeDraft = {
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
};

export const approvalSchemeDuplicatedApproverFixture: ApprovalSchemeDraft = {
        "teamId": "TEAM1",
        "approvalSteps": [
            {
                approverUserId: "user1",
                threshold: 500,
            },
            {
                approverUserId: "user1",
                threshold: 1000,
            },
            {
                approverUserId: "user3",
                threshold: null,
            }
        ]
};

export const approvalSchemeMissingApproverFixture: ApprovalSchemeDraft = {
    "teamId": "TEAM1",
    "approvalSteps": [
        {
            approverUserId: "user1",
            threshold: 500,
        },
        {
            approverUserId: null,
            threshold: 1000,
        },
        {
            approverUserId: "user3",
            threshold: null,
        }
    ]
};

export const approvalSchemeOverlappingThresholdsFixture: ApprovalSchemeDraft = {
    "teamId": "TEAM1",
    "approvalSteps": [
        {
            approverUserId: "user1",
            threshold: 500,
        },
        {
            approverUserId: "user2",
            threshold: 499,
        },
        {
            approverUserId: "user3",
            threshold: null,
        }
    ]
};

export const approvalSchemeNegativeThresholdFixture: ApprovalSchemeDraft = {
    "teamId": "TEAM1",
    "approvalSteps": [
        {
            approverUserId: "user1",
            threshold: -5,
        }
    ]
};

export const approvalSchemeEmptyDraftFixture: ApprovalSchemeDraft = {
    "teamId": "TEAM1",
    "approvalSteps": [
    ]
};

export const approvalSchemeSingleStepDraftFixture: ApprovalSchemeDraft = {
    "teamId": "TEAM1",
    "approvalSteps": [
        {
            approverUserId: "user1",
            threshold: null,
        }
    ]
};

export const approvalSchemeTwoStepDraftFixture: ApprovalSchemeDraft = {
    "teamId": "TEAM1",
    "approvalSteps": [
        {
            approverUserId: "user1",
            threshold: 500,
        },
        {
            approverUserId: "user2",
            threshold: null,
        }
    ]
};
