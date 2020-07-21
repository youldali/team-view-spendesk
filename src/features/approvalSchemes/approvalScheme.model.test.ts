import { isApproverUniqueInApprovalSteps, areThresholdsNotOverlapping, areThresholdsPositive } from './approvalScheme.model';
import { 
    approvalSchemeFixture, 
    approvalSchemeDuplicatedApproverFixture, 
    approvalSchemeOverlappingThresholdsFixture,
    approvalSchemeNegativeThreshold,
} from './approvalScheme.fixture';

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

describe('areThresholdsPositive', () => {
    it('returns false if a threshold is negative', () => {
        const valid = areThresholdsPositive(approvalSchemeNegativeThreshold.approvalSteps);
        expect(valid).toBe(false);
    });

    it('returns true if the thresholds are positive', () => {
        const valid = areThresholdsPositive(approvalSchemeFixture.approvalSteps);
        expect(valid).toBe(true);
    });
});
