import { useEffect, useMemo } from 'react';
import { useDispatch, useStore } from 'react-redux';
import { useDataEngine } from '@dhis2/app-runtime';
import { makeQuerySingleResource } from '../../../../utils/api';
import { getValidators, validateValue } from '../../../../utils/validation';
import { fieldsValidated } from '../../../D2Form/asyncHandlerHOC/actions';
import { dataElementUniqueScope } from '../../../../metaData';
import type { RenderFoundation } from '../../../../metaData';

type Props = {
    formFoundation?: RenderFoundation | null;
    formId: string;
    orgUnitId?: string;
    programId?: string;
    trackedEntityTypeId?: string;
    teiId?: string;
    ready: boolean;
};

// Checks the values that are unique per org unit again for the org unit selected in the form
export const useValidateOrgUnitScopedUniqueValues = ({
    formFoundation,
    formId,
    orgUnitId,
    programId,
    trackedEntityTypeId,
    teiId,
    ready,
}: Props) => {
    const dispatch = useDispatch();
    const store = useStore();
    const dataEngine = useDataEngine();
    // Generated values are reserved as unique, so they are not checked again
    const orgUnitScopedDataElements = useMemo(() => (formFoundation?.getElements() ?? [])
        .filter(dataElement =>
            dataElement.unique?.scope === dataElementUniqueScope.ORGANISATION_UNIT && !dataElement.unique.generatable),
    [formFoundation]);

    useEffect(() => {
        if (!ready || !orgUnitId) {
            return undefined;
        }
        const getFormValues = () => (store.getState() as any).formsValues[formId] || {};
        const formValues = getFormValues();
        const dataElements = orgUnitScopedDataElements.filter(dataElement => formValues[dataElement.id]);
        if (dataElements.length === 0) {
            return undefined;
        }

        const request = { active: true };
        const querySingleResource = makeQuerySingleResource(dataEngine.query.bind(dataEngine));
        const validationContext = { programId, trackedEntityTypeId, trackedEntityInstanceId: teiId, orgUnitId };
        Promise.all(dataElements.map(async (dataElement) => {
            const value = formValues[dataElement.id];
            const validators = getValidators(dataElement, querySingleResource);
            const validation = await validateValue({ validators, value, validationContext });
            return { id: dataElement.id, value, uiState: { ...validation, touched: true } };
        }))
            .then((results) => {
                if (!request.active) {
                    return;
                }
                // A value changed meanwhile is validated by the form itself
                const currentFormValues = getFormValues();
                const fieldsUI = results
                    .filter(({ id, value }) => currentFormValues[id] === value)
                    .reduce((acc, { id, uiState }) => ({ ...acc, [id]: uiState }), {});
                dispatch(fieldsValidated(fieldsUI, formId, formId, []));
            });

        // A newer org unit replaces this result
        return () => {
            request.active = false;
        };
    }, [
        ready,
        orgUnitId,
        orgUnitScopedDataElements,
        formId,
        programId,
        trackedEntityTypeId,
        teiId,
        store,
        dataEngine,
        dispatch,
    ]);
};
