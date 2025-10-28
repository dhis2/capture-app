import { useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import { getEventProgramThrowIfNotFound } from '../../../../metaData';
import { getRulesActions } from './DataEntry';
import type { RenderFoundation } from '../../../../metaData';

export const useRulesEngine = ({
    programId,
    orgUnitContext,
    formFoundation,
}: {
    programId: string;
    orgUnitContext?: OrgUnit | null;
    formFoundation: RenderFoundation | null;
}) => {
    const dispatch = useDispatch();
    const program = useMemo(() => programId && getEventProgramThrowIfNotFound(programId), [programId]);
    const orgUnitRef = useRef<OrgUnit | undefined>(undefined);
    const state = useSelector(({
        dataEntriesFieldsUI,
        dataEntriesFieldsValue,
        dataEntriesFieldsMeta,
        formsValues,
        formsSectionsFieldsUI,
    }: any) => ({
        dataEntriesFieldsUI,
        dataEntriesFieldsValue,
        dataEntriesFieldsMeta,
        formsValues,
        formsSectionsFieldsUI,
    }));
    useEffect(() => {
        if (orgUnitContext && program && !!formFoundation) {
            getRulesActions({
                state,
                program,
                orgUnit: orgUnitContext,
                formFoundation,
            }).then((effects) => {
                dispatch(batchActions([effects]));
                orgUnitRef.current = orgUnitContext;
            });
        }
    // Ignoring state (due to various reasons, bottom line being that field updates are handled in epic)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        dispatch,
        program,
        orgUnitContext,
        formFoundation,
    ]);

    return orgUnitRef.current === orgUnitContext;
};
