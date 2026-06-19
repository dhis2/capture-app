import { systemSettingsStore } from '../../../../metaDataMemoryStores';
import { getWithinOrgUnitDateRangeValidator, isIsoDateWithinOrgUnitRange } from './getWithinOrgUnitDateRangeValidator';

describe('getWithinOrgUnitDateRangeValidator', () => {
    beforeAll(() => {
        systemSettingsStore.set({ calendar: 'gregory', dateFormat: 'YYYY-MM-DD' });
    });

    const orgUnit = {
        openingDate: '2023-01-01T00:00:00.000',
        closedDate: '2023-06-30T00:00:00.000',
    };

    const isValid = result => result === true || result?.valid === true;

    it('passes when no value is provided', () => {
        expect(isValid(getWithinOrgUnitDateRangeValidator(orgUnit)(undefined))).toBe(true);
        expect(isValid(getWithinOrgUnitDateRangeValidator(orgUnit)(''))).toBe(true);
    });

    it('passes when the org unit has no opening or closing date', () => {
        expect(isValid(getWithinOrgUnitDateRangeValidator(undefined)('2020-01-01'))).toBe(true);
        expect(isValid(getWithinOrgUnitDateRangeValidator({})('2020-01-01'))).toBe(true);
    });

    it('passes for a date within the range', () => {
        expect(isValid(getWithinOrgUnitDateRangeValidator(orgUnit)('2023-03-15'))).toBe(true);
    });

    it('is inclusive of both the opening and the closing date', () => {
        expect(isValid(getWithinOrgUnitDateRangeValidator(orgUnit)('2023-01-01'))).toBe(true);
        expect(isValid(getWithinOrgUnitDateRangeValidator(orgUnit)('2023-06-30'))).toBe(true);
    });

    it('fails for a date before the opening date', () => {
        const result = getWithinOrgUnitDateRangeValidator(orgUnit)('2022-12-31');
        expect(result).toMatchObject({ valid: false });
    });

    it('fails for a date after the closing date', () => {
        const result = getWithinOrgUnitDateRangeValidator(orgUnit)('2023-07-01');
        expect(result).toMatchObject({ valid: false });
    });

    it('only enforces the lower bound when only an opening date is set', () => {
        const validator = getWithinOrgUnitDateRangeValidator({ openingDate: '2023-01-01T00:00:00.000' });
        expect(validator('2022-12-31')).toMatchObject({ valid: false });
        expect(isValid(validator('2025-01-01'))).toBe(true);
    });

    it('only enforces the upper bound when only a closing date is set', () => {
        const validator = getWithinOrgUnitDateRangeValidator({ closedDate: '2023-06-30T00:00:00.000' });
        expect(validator('2023-07-01')).toMatchObject({ valid: false });
        expect(isValid(validator('2020-01-01'))).toBe(true);
    });

    describe('isIsoDateWithinOrgUnitRange', () => {
        it('returns true for an ISO date within the inclusive range', () => {
            expect(isIsoDateWithinOrgUnitRange('2023-03-15T00:00:00.000', orgUnit)).toBe(true);
            expect(isIsoDateWithinOrgUnitRange('2023-01-01', orgUnit)).toBe(true);
            expect(isIsoDateWithinOrgUnitRange('2023-06-30', orgUnit)).toBe(true);
        });

        it('returns false for an ISO date outside the range', () => {
            expect(isIsoDateWithinOrgUnitRange('2022-12-31', orgUnit)).toBe(false);
            expect(isIsoDateWithinOrgUnitRange('2023-07-01', orgUnit)).toBe(false);
        });

        it('returns true when the date or the bounds are missing', () => {
            expect(isIsoDateWithinOrgUnitRange(undefined, orgUnit)).toBe(true);
            expect(isIsoDateWithinOrgUnitRange('2010-01-01', undefined)).toBe(true);
            expect(isIsoDateWithinOrgUnitRange('2010-01-01', {})).toBe(true);
        });
    });

    describe('error message org unit label', () => {
        it('uses the default term when no custom label is provided', () => {
            const result = getWithinOrgUnitDateRangeValidator(orgUnit)('2022-12-31');
            expect(result.errorMessage).toContain('organisation unit');
        });

        it('uses the provided custom org unit label instead of the default term', () => {
            const result = getWithinOrgUnitDateRangeValidator(orgUnit, 'Facility')('2022-12-31');
            expect(result.errorMessage).toContain('Facility');
            expect(result.errorMessage).not.toContain('organisation unit');
        });
    });

    describe('with the DHIS2 "gregorian" calendar id', () => {
        beforeAll(() => {
            systemSettingsStore.set({ calendar: 'gregorian', dateFormat: 'YYYY-MM-DD' });
        });
        afterAll(() => {
            systemSettingsStore.set({ calendar: 'gregory', dateFormat: 'YYYY-MM-DD' });
        });

        it('enforces the range using the production calendar id, not just the Temporal id', () => {
            const validator = getWithinOrgUnitDateRangeValidator(orgUnit);
            expect(isValid(validator('2023-03-15'))).toBe(true);
            expect(validator('2022-12-31')).toMatchObject({ valid: false });
            expect(validator('2023-07-01')).toMatchObject({ valid: false });
        });
    });
});
