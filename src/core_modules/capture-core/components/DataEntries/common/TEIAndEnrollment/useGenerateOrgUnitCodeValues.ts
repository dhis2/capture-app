import { useEffect, useMemo } from 'react';
import { useDispatch, useStore } from 'react-redux';
import { useDataEngine } from '@dhis2/app-runtime';
import { v4 as uuid } from 'uuid';
import { useCoreOrgUnit } from '../../../../metadataRetrieval/coreOrgUnit';
import { makeQuerySingleResource } from '../../../../utils/api';
import { getValidators, validateValue, validatorTypes } from '../../../../utils/validation';
import { updateFieldFromAsync } from '../../../D2Form/asyncHandlerHOC/actions';
import type { RenderFoundation } from '../../../../metaData';
import { getGeneratedOrgUnitCodeValuesAsync } from './getGeneratedUniqueValuesAsync';

type Props = {
    formFoundation?: RenderFoundation | null;
    formId: string;
    orgUnitId?: string;
    ready: boolean;
    teiId?: string;
};

// Generates the values using the org unit code for the org unit selected in the form
export const useGenerateOrgUnitCodeValues = ({ formFoundation, formId, orgUnitId, ready, teiId }: Props) => {
    const dispatch = useDispatch();
    const store = useStore();
    const dataEngine = useDataEngine();
    const orgUnitCodeDataElements = useMemo(() => (formFoundation?.getElements() ?? [])
        .filter(dataElement => dataElement.unique?.generatable && dataElement.unique.usesOrgUnitCode),
    [formFoundation]);
    // Few forms use the org unit code, so the org unit is only fetched when needed
    const { orgUnit } = useCoreOrgUnit(orgUnitCodeDataElements.length > 0 ? orgUnitId : undefined);
    const orgUnitCode = orgUnit?.code;

    useEffect(() => {
        // The org unit is required, so the values are generated when it is set or changed
        if (!ready || !orgUnitCode) {
            return undefined;
        }
        const formValues = (store.getState() as any).formsValues[formId] || {};
        // An existing tracked entity keeps its values, so only missing values are generated
        const dataElements = orgUnitCodeDataElements
            .filter(dataElement => !teiId || !formValues[dataElement.id]);
        if (dataElements.length === 0) {
            return undefined;
        }

        const request = { active: true };
        const querySingleResource = makeQuerySingleResource(dataEngine.query.bind(dataEngine));
        getGeneratedOrgUnitCodeValuesAsync(dataElements, orgUnitCode, querySingleResource)
            .then(values => Promise.all(values.map(async ({ dataElement, value }) => {
                // Generated values are reserved as unique, so only the other validators are needed
                const validators = getValidators(dataElement)
                    .filter(validator => validator.type !== validatorTypes.UNIQUE);
                const validation = await validateValue({ validators, value });
                const uiState = { ...validation, touched: !!value };
                return updateFieldFromAsync(value, uiState, dataElement.id, formId, formId, uuid());
            })))
            .then((actions) => {
                if (request.active) {
                    actions.forEach(action => dispatch(action));
                }
            });

        // A newer org unit replaces this result
        return () => {
            request.active = false;
        };
    }, [ready, orgUnitCode, orgUnitCodeDataElements, formId, teiId, store, dataEngine, dispatch]);
};
