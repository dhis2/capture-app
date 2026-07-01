import { D2Form } from '../D2Form.component';

// Mock the heavy/irrelevant imports so importing D2Form.component does not pull in the full
// metadata + section module graph (which reaches untransformed node_modules ESM). These methods
// under test use neither at runtime. jest hoists these above the import above.
jest.mock('../D2Section.container', () => ({ D2SectionContainer: () => null }));
jest.mock('../../../metaData', () => ({ Section: { LEFTOVERS_SECTION_ID: 'LEFTOVERS' } }));
jest.mock('loglevel');

const createSectionInstance = ({ isHidden = false, isValid, invalidFields = [] }) => ({
    props: { isHidden },
    sectionFieldsInstance: {
        isValid: () => isValid,
        getInvalidFields: jest.fn(() => invalidFields),
    },
});

const createForm = (sections) => {
    const form = new D2Form({});
    form.sectionInstances = new Map(sections);
    return form;
};

describe('D2Form scroll to first failed field', () => {
    // Regression for DHIS2-21286: in a multi-section form, a section's isValid() inspects the
    // form-wide field UI state, so an otherwise-valid section reports invalid when a *later*
    // section has the failing field. The previous short-circuiting collection stopped at that
    // first section (which owns no invalid fields), leaving nothing to scroll to.
    it('collects the failing field from a later section even when an earlier section reports invalid', () => {
        const goto = jest.fn();
        const failingField = { instance: { goto } };
        const form = createForm([
            ['section1', createSectionInstance({ isValid: false, invalidFields: [] })],
            ['section2', createSectionInstance({ isValid: false, invalidFields: [failingField] })],
        ]);

        const { isValid, failedFields } = form.validateFormIncludeSectionFailedFields({});

        expect(isValid).toBe(false);
        expect(failedFields).toEqual([failingField]);

        expect(form.validateFormScrollToFirstFailedField({})).toBe(false);
        expect(goto).toHaveBeenCalledTimes(1);
    });

    it('scrolls to the first failed field that exposes a goto method', () => {
        const goto = jest.fn();
        const form = createForm([
            ['section1', createSectionInstance({
                isValid: false,
                invalidFields: [{ instance: undefined }, { instance: { goto } }],
            })],
        ]);

        expect(form.validateFormScrollToFirstFailedField({})).toBe(false);
        expect(goto).toHaveBeenCalledTimes(1);
    });

    it('does not throw when no failed field exposes a goto method', () => {
        const form = createForm([
            ['section1', createSectionInstance({ isValid: false, invalidFields: [{ instance: undefined }] })],
        ]);

        expect(form.validateFormScrollToFirstFailedField({})).toBe(false);
    });

    it('returns valid and does not scroll when every section is valid', () => {
        const goto = jest.fn();
        const form = createForm([
            ['section1', createSectionInstance({ isValid: true })],
            ['section2', createSectionInstance({ isValid: true })],
        ]);

        expect(form.validateFormScrollToFirstFailedField({})).toBe(true);
        expect(goto).not.toHaveBeenCalled();
    });

    it('ignores hidden sections', () => {
        const hiddenSection = createSectionInstance({ isHidden: true, isValid: false, invalidFields: [] });
        const form = createForm([['section1', hiddenSection]]);

        expect(form.validateFormScrollToFirstFailedField({})).toBe(true);
        expect(hiddenSection.sectionFieldsInstance.getInvalidFields).not.toHaveBeenCalled();
    });
});
