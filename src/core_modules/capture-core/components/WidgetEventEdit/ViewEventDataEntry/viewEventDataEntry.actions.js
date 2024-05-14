// @flow
import i18n from '@dhis2/d2-i18n';
import { type OrgUnit, effectActions } from '@dhis2/rules-engine-javascript';
import { actionCreator } from '../../../actions/actions.utils';
import type { RenderFoundation, Program } from '../../../metaData';
import { getConvertGeometryIn, convertGeometryOut, convertStatusOut } from '../../DataEntries';
import { getDataEntryKey } from '../../DataEntry/common/getDataEntryKey';
import { loadEditDataEntryAsync } from '../../DataEntry/templates/dataEntryLoadEdit.template';
import {
    getApplicableRuleEffectsForTrackerProgram,
    getApplicableRuleEffectsForEventProgram,
    updateRulesEffects,
    filterApplicableRuleEffects,
} from '../../../rules';
import { dataElementTypes } from '../../../metaData';
import { convertClientToForm } from '../../../converters';
import type { ClientEventContainer } from '../../../events/eventRequests';
import { TrackerProgram, EventProgram } from '../../../metaData/Program';
import { getStageFromEvent } from '../../../metaData/helpers/getStageFromEvent';
import { prepareEnrollmentEventsForRulesEngine } from '../../../events/prepareEnrollmentEvents';
import { getEnrollmentForRulesEngine, getAttributeValuesForRulesEngine } from '../helpers';
import type {
    EnrollmentData,
    AttributeValue,
} from '../../Pages/common/EnrollmentOverviewDomain/useCommonEnrollmentDomainData';
import { getEventDateValidatorContainers } from '../DataEntry/fieldValidators/eventDate.validatorContainersGetter';
import { getCachedSingleResourceFromKeyAsync } from '../../../metaDataMemoryStoreBuilders/baseBuilder/singleResourceFromKeyGetter';
import { userStores } from '../../../storageControllers/stores';
import { FEATURES, hasAPISupportForFeature } from '../../../../capture-core-utils';


export const actionTypes = {
    VIEW_EVENT_DATA_ENTRY_LOADED: 'ViewEventDataEntryLoadedForViewSingleEvent',
    PREREQUISITES_ERROR_LOADING_VIEW_EVENT_DATA_ENTRY: 'PrerequisitesErrorLoadingViewEventDataEntryForViewSingleEvent',
};

function getAssignee(clientAssignee: ?Object) {
    return clientAssignee ? convertClientToForm(clientAssignee, dataElementTypes.USERNAME) : clientAssignee;
}

export const loadViewEventDataEntry =
    async ({
        eventContainer,
        orgUnit,
        foundation,
        program,
        enrollment,
        attributeValues,
        dataEntryId,
        dataEntryKey,
        serverMinorVersion,
    }: {
        eventContainer: ClientEventContainer,
        orgUnit: OrgUnit,
        foundation: RenderFoundation,
        program: Program,
        dataEntryId: string,
        dataEntryKey: string,
        enrollment?: EnrollmentData,
        attributeValues?: Array<AttributeValue>,
        onCategoriesQuery?: ?Promise<Object>,
        serverMinorVersion: number
    }) => {
        const dataEntryPropsToInclude = [
            {
                id: 'occurredAt',
                type: 'DATE',
                validatorContainers: getEventDateValidatorContainers(),
            },
            {
                id: 'scheduledAt',
                type: 'DATE',
            },
            {
                clientId: 'geometry',
                dataEntryId: 'geometry',
                onConvertIn: getConvertGeometryIn(foundation),
                onConvertOut: convertGeometryOut,
            },
            {
                clientId: 'status',
                dataEntryId: 'complete',
                onConvertIn: value => (value === 'COMPLETED' ? 'true' : 'false'),
                onConvertOut: convertStatusOut,
            },
        ];

        const formId = getDataEntryKey(dataEntryId, dataEntryKey);
        const attributeCategoryId = 'attributeCategoryOptions';
        let attributeCategoryOptions;

        if (eventContainer.event && eventContainer.event.attributeCategoryOptions) {
            const useNewAocApiSeparator = hasAPISupportForFeature(serverMinorVersion, FEATURES.newAocApiSeparator);
            // $FlowFixMe - this should work
            const optionIds = eventContainer.event?.attributeCategoryOptions.split(useNewAocApiSeparator ? ',' : ';');
            const categoryOptionsFromIndexedDB = await Promise.all(
                optionIds
                    .map(optionId =>
                        getCachedSingleResourceFromKeyAsync(userStores.CATEGORY_OPTIONS, optionId),
                    ),
            );
            attributeCategoryOptions = categoryOptionsFromIndexedDB.reduce((acc, categoryOption) => {
                acc[`${attributeCategoryId}-${categoryOption.categories[0]}`] = categoryOption.id;
                return acc;
            }, {});

            dataEntryPropsToInclude.push(...Object.keys(attributeCategoryOptions).map(id => ({ id, type: 'TEXT' })));
        }

        const extraProps = {
            eventId: eventContainer.event.eventId,
        };

        const { actions: dataEntryActions, dataEntryValues, formValues } = await
        loadEditDataEntryAsync(
            dataEntryId,
            dataEntryKey,
            eventContainer.event,
            eventContainer.values,
            dataEntryPropsToInclude,
            foundation,
            attributeCategoryOptions,
            extraProps,
        );

        // $FlowFixMe[cannot-spread-indexer] automated comment
        const currentEvent = { ...eventContainer.event, ...eventContainer.values };

        let effects;
        if (program instanceof TrackerProgram) {
            const stage = getStageFromEvent(eventContainer.event)?.stage;
            if (!stage) {
                throw Error(i18n.t('stage not found in rules execution'));
            }

            effects = getApplicableRuleEffectsForTrackerProgram({
                program,
                stage,
                orgUnit,
                currentEvent,
                otherEvents: prepareEnrollmentEventsForRulesEngine(
                    enrollment?.events.filter(event => event.event !== currentEvent.eventId),
                ),
                enrollmentData: getEnrollmentForRulesEngine(enrollment),
                attributeValues: getAttributeValuesForRulesEngine(attributeValues, program.attributes),
            });
        } else if (program instanceof EventProgram) {
            effects = getApplicableRuleEffectsForEventProgram({
                program,
                orgUnit,
                currentEvent,
            });
        }
        const filteredEffects = filterApplicableRuleEffects(effects, effectActions.ASSIGN_VALUE);

        return [
            ...dataEntryActions,
            updateRulesEffects(filteredEffects, formId),
            actionCreator(actionTypes.VIEW_EVENT_DATA_ENTRY_LOADED)({
                loadedValues: { dataEntryValues, formValues, eventContainer, orgUnit },
                // $FlowFixMe[prop-missing] automated comment
                assignee: getAssignee(eventContainer.event.assignee),
            }),
        ];
    };

export const prerequisitesErrorLoadingViewEventDataEntry = (message: string) =>
    actionCreator(actionTypes.PREREQUISITES_ERROR_LOADING_VIEW_EVENT_DATA_ENTRY)(message);
