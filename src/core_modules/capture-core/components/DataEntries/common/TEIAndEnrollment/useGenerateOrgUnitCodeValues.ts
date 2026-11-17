import { useEffect, useMemo, useRef } from 'react';
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
};

// Generates the values using the org unit code for the org unit selected in the form
export const useGenerateOrgUnitCodeValues = ({ formFoundation, formId, orgUnitId, ready }: Props) => {
    const dispatch = useDispatch();
    const store = useStore();
    const dataEngine = useDataEngine();
    const generatedValuesRef = useRef<{ [id: string]: any }>({});
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
        // Values from search, inherited attributes or an existing tracked entity are kept,
        // so only empty values and values generated here are generated again
        const dataElements = orgUnitCodeDataElements.filter(dataElement =>
            !formValues[dataElement.id] || formValues[dataElement.id] === generatedValuesRef.current[dataElement.id]);
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
                return { id: dataElement.id, value, uiState };
            })))
            .then((results) => {
                if (request.active) {
                    results.forEach(({ id, value, uiState }) => {
                        generatedValuesRef.current[id] = value;
                        dispatch(updateFieldFromAsync(value, uiState, id, formId, formId, uuid()));
                    });
                }
            });

        // A newer org unit replaces this result
        return () => {
            request.active = false;
        };
    }, [ready, orgUnitCode, orgUnitCodeDataElements, formId, store, dataEngine, dispatch]);
};
