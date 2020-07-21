import { isApproverUniqueInApprovalSteps, areThresholdsNotOverlapping } from './approvalScheme.model';
import { approvalSchemeFixture, approvalSchemeDuplicatedApproverFixture, approvalSchemeOverlappingThresholdsFixture } from './approvalScheme.fixture';

describe('isApproverUniqueInApprovalSteps', () => {
    it('returns false if an approver is present more than once', () => {
        const valid = isApproverUniqueInApprovalSteps(approvalSchemeDuplicatedApproverFixture.approvalSteps);
        expect(valid).toBe(false);
    });

    it('returns true if an approver is present more than once', () => {
        const valid = isApproverUniqueInApprovalSteps(approvalSchemeFixture.approvalSteps);
        expect(valid).toBe(true);
    });
});

describe('isApproverUniqueInApprovalSteps', () => {
    it('returns false if thresholds are overlapping', () => {
        const valid = areThresholdsNotOverlapping(approvalSchemeOverlappingThresholdsFixture.approvalSteps);
        expect(valid).toBe(false);
    });

    it('returns true if no threshold is overlapping', () => {
        const valid = areThresholdsNotOverlapping(approvalSchemeFixture.approvalSteps);
        expect(valid).toBe(true);
    });
});
