// @flow
import { useMemo } from 'react';
import { useOptionSetsForAttributes } from './hooks/useOptionSetsForAttributes';
import { scopeTypes } from '../../../../../metaData';
import { useProgramFromIndexedDB } from '../../../../../utils/cachedDataHooks/useProgramFromIndexedDB';
import { useScopeInfo } from '../../../../../hooks/useScopeInfo';
import { useTrackedEntityTypeCollection } from './hooks/useTrackedEntityTypeCollection';
import { useEnrollmentFormFoundation } from './hooks/useEnrollmentFormFoundation';
import { useTrackedEntityTypeFromIndexedDB } from '../../../../../utils/cachedDataHooks/useTrackedEntityTypeFromIndexedDB';
import { useUserLocale } from '../../../../../utils/localeData/useUserLocale';
import { useTrackedEntityAttributes } from './hooks/useTrackedEntityAttributes';
import { useDataEntryFormConfig } from './hooks/useDataEntryFormConfig';

type Props = {|
    selectedScopeId: string,
|}

export const FieldElementObjectTypes = Object.freeze({
    TRACKED_ENTITY_ATTRIBUTE: 'TrackedEntityAttribute',
    ATTRIBUTE: 'Attribute',
});

export const useMetadataForRegistrationForm = ({ selectedScopeId }: Props) => {
    const { program } = useProgramFromIndexedDB(selectedScopeId, { enabled: !!selectedScopeId });
    const { locale } = useUserLocale();
    const { scopeType, tetId } = useScopeInfo(selectedScopeId);
    const { trackedEntityType } = useTrackedEntityTypeFromIndexedDB(tetId, { enabled: !!tetId });

    const cachedTrackedEntityAttributeIds = useMemo(() => {
        if (scopeType === scopeTypes.TRACKER_PROGRAM && program) {
            return program
                .programTrackedEntityAttributes
                .map(({ trackedEntityAttributeId }) => trackedEntityAttributeId);
        }
        if (scopeType === scopeTypes.TRACKED_ENTITY_TYPE && trackedEntityType) {
            return trackedEntityType
                .trackedEntityTypeAttributes
                .map(({ trackedEntityAttributeId }) => trackedEntityAttributeId);
        }
        return undefined;
    }, [program, scopeType, trackedEntityType]);

    const { cachedTrackedEntityAttributes } = useTrackedEntityAttributes({
        selectedScopeId,
        attributeIds: cachedTrackedEntityAttributeIds,
    });

    const { optionSets } = useOptionSetsForAttributes({
        selectedScopeId,
        attributes: cachedTrackedEntityAttributes,
    });
    const { dataEntryFormConfig, configIsFetched } = useDataEntryFormConfig({ selectedScopeId });

    const { trackedEntityTypeCollection } = useTrackedEntityTypeCollection({
        trackedEntityType,
        optionSets,
        dataEntryFormConfig,
        configIsFetched,
        locale,
    });

    const { enrollment } = useEnrollmentFormFoundation({
        program,
        optionSets,
        scopeType,
        trackedEntityType,
        trackedEntityTypeCollection,
        cachedTrackedEntityAttributes,
        selectedScopeId,
        dataEntryFormConfig,
        configIsFetched,
        locale,
    });

    if (scopeType === scopeTypes.TRACKED_ENTITY_TYPE && trackedEntityTypeCollection && tetId) {
        return {
            name: trackedEntityTypeCollection.name,
            formFoundation: trackedEntityTypeCollection?.teiRegistration?.form,
            registrationMetaData: trackedEntityTypeCollection?.teiRegistration,
            formId: `registrationPageForm-${tetId}`,
        };
    }

    if (scopeType === scopeTypes.TRACKER_PROGRAM && enrollment && program) {
        return {
            name: program.name,
            formFoundation: enrollment.enrollmentForm,
            registrationMetaData: enrollment,
            formId: `registrationPageForm-${program.id}`,
        };
    }

    return {
        formFoundation: null,
        formId: null,
        registrationMetaData: null,
    };
};
