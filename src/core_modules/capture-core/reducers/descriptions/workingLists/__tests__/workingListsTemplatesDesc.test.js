import { workingListsTemplatesDesc } from '../workingLists.reducerDescription';
import { workingListsCommonActionTypes } from 'capture-core/components/WorkingLists/WorkingListsCommon';

jest.mock('capture-core/components/WorkingLists/WorkingListsCommon', () =>
    jest.requireActual('capture-core/components/WorkingLists/WorkingListsCommon/actions/workingListsCommon.actions'));

jest.mock('capture-core/components/WorkingLists/EventWorkingLists', () => ({
    eventWorkingListsActionTypes:
        jest.requireActual('capture-core/components/WorkingLists/EventWorkingLists/eventWorkingLists.actions')
            .actionTypes,
}));

jest.mock(
    'capture-core/components/DataEntries/SingleEventRegistrationEntry/DataEntryWrapper/RecentlyAddedEventsList',
    () => jest.requireActual(
        'capture-core/components/DataEntries/SingleEventRegistrationEntry/DataEntryWrapper/RecentlyAddedEventsList/' +
        'recentlyAddedEventsList.actions',
    ),
);

const storeId = 'teiList';
const defaultTemplate = { id: 'program-default', isDefault: true };
const savedTemplate = { id: 'saved', name: 'Saved view' };
const otherTemplate = { id: 'other', name: 'Other view' };
const { updaters } = workingListsTemplatesDesc;

const stateWith = selectedTemplateId => ({
    [storeId]: {
        selectedTemplateId,
        templates: [defaultTemplate, savedTemplate, otherTemplate],
    },
});

const deleteAction = type => ({ type, payload: { template: savedTemplate, storeId } });

describe('workingListsTemplatesDesc deleting a template', () => {
    it('selects the default template when the deletion starts', () => {
        const state = updaters[workingListsCommonActionTypes.TEMPLATE_DELETE](
            stateWith(savedTemplate.id),
            deleteAction(workingListsCommonActionTypes.TEMPLATE_DELETE),
        );

        expect(state[storeId].selectedTemplateId).toBe(defaultTemplate.id);
        expect(state[storeId].templates.find(({ id }) => id === savedTemplate.id).deleted).toBe(true);
    });

    it('selects the failed template again when the deletion fails', () => {
        const deleting = updaters[workingListsCommonActionTypes.TEMPLATE_DELETE](
            stateWith(savedTemplate.id),
            deleteAction(workingListsCommonActionTypes.TEMPLATE_DELETE),
        );
        const state = updaters[workingListsCommonActionTypes.TEMPLATE_DELETE_ERROR](
            deleting,
            deleteAction(workingListsCommonActionTypes.TEMPLATE_DELETE_ERROR),
        );

        expect(state[storeId].selectedTemplateId).toBe(savedTemplate.id);
        expect(state[storeId].templates.find(({ id }) => id === savedTemplate.id).deleted).toBeUndefined();
    });

    it('keeps another selected template when the deletion fails', () => {
        const state = updaters[workingListsCommonActionTypes.TEMPLATE_DELETE_ERROR](
            stateWith(otherTemplate.id),
            deleteAction(workingListsCommonActionTypes.TEMPLATE_DELETE_ERROR),
        );

        expect(state[storeId].selectedTemplateId).toBe(otherTemplate.id);
    });

    it('keeps the default template selected when the deletion succeeds', () => {
        const deleting = updaters[workingListsCommonActionTypes.TEMPLATE_DELETE](
            stateWith(savedTemplate.id),
            deleteAction(workingListsCommonActionTypes.TEMPLATE_DELETE),
        );
        const state = updaters[workingListsCommonActionTypes.TEMPLATE_DELETE_SUCCESS](
            deleting,
            deleteAction(workingListsCommonActionTypes.TEMPLATE_DELETE_SUCCESS),
        );

        expect(state[storeId].selectedTemplateId).toBe(defaultTemplate.id);
        expect(state[storeId].templates.map(({ id }) => id)).toEqual([defaultTemplate.id, otherTemplate.id]);
    });
});
