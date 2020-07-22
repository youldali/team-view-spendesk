import { 
    isApproverUniqueInApprovalSteps, 
    areApproversDefined,
    areThresholdsNotOverlapping, 
    areThresholdsPositive,
    addApprovalStepToDraft,
    modifyStepThreshold,
    modifyStepApprover,
} from './approvalSchemeDraft.model';
import { 
    validApprovalSchemeFixture, 
    approvalSchemeDuplicatedApproverFixture, 
    approvalSchemeMissingApproverFixture,
    approvalSchemeOverlappingThresholdsFixture,
    approvalSchemeNegativeThresholdFixture,
    approvalSchemeEmptyDraftFixture,
    approvalSchemeSingleStepDraftFixture,
    approvalSchemeTwoStepDraftFixture,
} from './approvalSchemeDraft.fixture';
import { clone } from 'ramda';


describe('isApproverUniqueInApprovalSteps', () => {
    it('returns false if an approver is present more than once', () => {
        const valid = isApproverUniqueInApprovalSteps(approvalSchemeDuplicatedApproverFixture);
        expect(valid).toBe(false);
    });

    it('returns true if an approver is present more than once', () => {
        const valid = isApproverUniqueInApprovalSteps(validApprovalSchemeFixture);
        expect(valid).toBe(true);
    });
});

describe('areApproversDefined', () => {
    it('returns false if an approver is not defined', () => {
        const valid = areApproversDefined(approvalSchemeMissingApproverFixture);
        expect(valid).toBe(false);
    });

    it('returns true if all approvers are defined', () => {
        const valid = areApproversDefined(validApprovalSchemeFixture);
        expect(valid).toBe(true);
    });
});

describe('areThresholdsNotOverlapping', () => {
    it('returns false if thresholds are overlapping', () => {
        const valid = areThresholdsNotOverlapping(approvalSchemeOverlappingThresholdsFixture);
        expect(valid).toBe(false);
    });

    it('returns true if no threshold is overlapping', () => {
        const valid = areThresholdsNotOverlapping(validApprovalSchemeFixture);
        expect(valid).toBe(true);
    });
});

describe('areThresholdsPositive', () => {
    it('returns false if a threshold is negative', () => {
        const valid = areThresholdsPositive(approvalSchemeNegativeThresholdFixture);
        expect(valid).toBe(false);
    });

    it('returns true if the thresholds are positive', () => {
        const valid = areThresholdsPositive(validApprovalSchemeFixture);
        expect(valid).toBe(true);
    });
});

describe('addApprovalStepToDraft', () => {
    it('adds a step to an empty draft', () => {
        const newDraft = addApprovalStepToDraft(approvalSchemeEmptyDraftFixture);
        const expectedNewDraft = {
            ...approvalSchemeEmptyDraftFixture,
            approvalSteps: [
                {
                    approverUserId: null,
                    threshold: null
                }
            ]
        };
        expect(newDraft).toEqual(expectedNewDraft);
    });

    it('adds a step to a single step draft', () => {
        const newDraft = addApprovalStepToDraft(approvalSchemeSingleStepDraftFixture);
        const expectedNewDraft = {
            ...approvalSchemeSingleStepDraftFixture,
            approvalSteps: [
                {
                    approverUserId: null,
                    threshold: 0
                },
                approvalSchemeSingleStepDraftFixture.approvalSteps[0],
            ]
        };
        expect(newDraft).toEqual(expectedNewDraft);
    });

    it('adds a step to a 2 step draft', () => {
        const { approvalSteps } = approvalSchemeTwoStepDraftFixture;
        const newDraft = addApprovalStepToDraft(approvalSchemeTwoStepDraftFixture);
        const expectedNewDraft = {
            ...approvalSchemeTwoStepDraftFixture,
            approvalSteps: [
                approvalSteps[0],
                {
                    approverUserId: null,
                    threshold: approvalSteps[0].threshold
                },
                approvalSteps[1],
            ]
        };
        expect(newDraft).toEqual(expectedNewDraft);
    });
});

describe('modifyStepThreshold', () => {
    it('returns a new draft with the step threshold updated', () => {
        const validApprovalSchemeFixtureClone = clone(validApprovalSchemeFixture);
        const secondToLastStepIndex = validApprovalSchemeFixtureClone.approvalSteps.length - 2;
        const newApprovalScheme = modifyStepThreshold(5000)(secondToLastStepIndex)(validApprovalSchemeFixtureClone);
        expect(newApprovalScheme.approvalSteps[secondToLastStepIndex].threshold).toBe(5000);
    });
});

describe('modifyStepApprover', () => {
    it('returns a new draft with the step approver updated', () => {
        const newApproverId = "USR100";
        const validApprovalSchemeFixtureClone = clone(validApprovalSchemeFixture);
        const newApprovalScheme = modifyStepApprover(newApproverId)(0)(validApprovalSchemeFixtureClone);
        expect(newApprovalScheme.approvalSteps[0].approverUserId).toBe(newApproverId);
    });
});
