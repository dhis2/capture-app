import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { TrackerWorkingListsReduxProvider } from '../TrackerWorkingListsReduxProvider.container';

const mockOnSelectTemplate = jest.fn();
let mockCommonStateManagement;

jest.mock('react-redux', () => ({
    useDispatch: () => jest.fn(),
    useSelector: () => undefined,
}));

jest.mock('capture-core/components/WorkingLists/WorkingListsCommon', () => ({
    useWorkingListsCommonStateManagement: () => mockCommonStateManagement,
    fetchTemplates: jest.fn(),
    TEMPLATE_SHARING_TYPE: {},
}));

jest.mock('capture-core/components/WorkingLists/TrackerWorkingLists/ViewMenuSetup', () => ({
    TrackerWorkingListsViewMenuSetup: () => null,
}));

jest.mock('capture-core/components/WorkingLists/TrackerWorkingLists/helpers', () => ({
    getDefaultTemplate: () => ({ id: 'program-default' }),
}));

jest.mock('capture-core/hooks/useTrackerProgram', () => ({
    useTrackerProgram: () => ({}),
}));

jest.mock('capture-core/utils/routing', () => ({
    useNavigate: () => ({ navigate: jest.fn() }),
    buildUrlQueryString: jest.fn(),
}));

jest.mock('capture-core/actions/navigateToEnrollmentOverview/navigateToEnrollmentOverview.actions', () => ({
    navigateToEnrollmentOverview: jest.fn(),
}));

const stateManagementWith = (currentTemplateId, viewPreloaded = false) => ({
    onSelectTemplate: mockOnSelectTemplate,
    onAddTemplate: jest.fn(),
    onDeleteTemplate: jest.fn(),
    onUpdateDefaultTemplate: jest.fn(),
    currentTemplateId,
    viewPreloaded,
});

describe('TrackerWorkingListsReduxProvider selecting the template from the URL', () => {
    let container;
    let root;

    const render = (urlTemplateId, currentTemplateId, viewPreloaded) => {
        mockCommonStateManagement = stateManagementWith(currentTemplateId, viewPreloaded);
        act(() => {
            root.render(
                <TrackerWorkingListsReduxProvider
                    storeId="teiList"
                    programId="program"
                    selectedTemplateId={urlTemplateId}
                />,
            );
        });
    };

    beforeAll(() => {
        global.IS_REACT_ACT_ENVIRONMENT = true;
    });

    beforeEach(() => {
        mockOnSelectTemplate.mockClear();
        container = document.createElement('div');
        root = createRoot(container);
    });

    afterEach(() => {
        act(() => root.unmount());
    });

    it('selects the template from the URL when it is not the current template', () => {
        render('program-default', 'program-default');
        render('saved', 'program-default');

        expect(mockOnSelectTemplate).toHaveBeenCalledTimes(1);
        expect(mockOnSelectTemplate).toHaveBeenCalledWith('saved');
    });

    it('keeps a newly saved template selected while the URL still points at the previous template', () => {
        render('program-default', 'program-default');
        render('program-default', 'saved');

        expect(mockOnSelectTemplate).not.toHaveBeenCalled();
    });

    it('does not select anything when the delayed URL update catches up with the saved template', () => {
        render('program-default', 'program-default');
        render('program-default', 'saved');
        render('saved', 'saved');

        expect(mockOnSelectTemplate).not.toHaveBeenCalled();
    });

    it('does not select the template from the URL while the view is preloaded', () => {
        render('program-default', 'program-default', true);
        render('saved', 'program-default', true);

        expect(mockOnSelectTemplate).not.toHaveBeenCalled();
    });
});
