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
import { getEventDateValidatorContainers, getOrgUnitValidatorContainers } from '../DataEntry/fieldValidators';
import { getCachedSingleResourceFromKeyAsync } from '../../../metaDataMemoryStoreBuilders/baseBuilder/singleResourceFromKeyGetter';
import { USER_METADATA_STORES } from '../../../storageControllers';
import { FEATURES, featureAvailable } from '../../../../capture-core-utils';


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
    }: {
        eventContainer: ClientEventContainer,
        orgUnit: { ...OrgUnit, path: string },
        foundation: RenderFoundation,
        program: Program,
        dataEntryId: string,
        dataEntryKey: string,
        enrollment?: EnrollmentData,
        attributeValues?: Array<AttributeValue>,
        onCategoriesQuery?: ?Promise<Object>,
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
                id: 'orgUnit',
                type: 'ORGANISATION_UNIT',
                validatorContainers: getOrgUnitValidatorContainers(),
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
            const newUIDsSeparator = featureAvailable(FEATURES.newUIDsSeparator);
            // $FlowFixMe - this should work
            const attributeCategoryOptionIds = eventContainer.event?.attributeCategoryOptions.split(newUIDsSeparator ? ',' : ';');
            const getCategoryOptionsFromIndexedDB = async (optionIds) => {
                const categoryOptionsPromises = optionIds.map(async (optionId) => {
                    const cachedCategoryOption = await getCachedSingleResourceFromKeyAsync(USER_METADATA_STORES.CATEGORY_OPTIONS, optionId);
                    if (cachedCategoryOption.displayName === 'default') {
                        return null;
                    }
                    return cachedCategoryOption;
                });
                const categoryOptions = await Promise.all(categoryOptionsPromises);
                return categoryOptions.filter(Boolean);
            };
            const categoryOptionsFromIndexedDB = await getCategoryOptionsFromIndexedDB(attributeCategoryOptionIds);
            attributeCategoryOptions = categoryOptionsFromIndexedDB.reduce((acc, categoryOption) => {
                acc[`${attributeCategoryId}-${categoryOption.categories[0]}`] = categoryOption.id;
                return acc;
            }, {});

            dataEntryPropsToInclude.push(...Object.keys(attributeCategoryOptions).map(id => ({ id, type: 'TEXT' })));
        }

        const clientValuesForDataEntry = {
            ...eventContainer.event,
            orgUnit: { id: orgUnit.id, name: orgUnit.name, path: orgUnit.path },
        };

        const extraProps = {
            eventId: eventContainer.event.eventId,
        };

        const { actions: dataEntryActions, dataEntryValues, formValues } = await
        loadEditDataEntryAsync(
            dataEntryId,
            dataEntryKey,
            clientValuesForDataEntry,
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
