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
    formFoundation?: RenderFoundation | null;
}) => {
    const dispatch = useDispatch();
    const program = useMemo(() => programId && getEventProgramThrowIfNotFound(programId), [programId]);
    const orgUnitRef = useRef<OrgUnit | undefined>(undefined);
    // TODO: Getting the entire state object is bad and this needs to be refactored.
    // The problem is the helper methods that take the entire state object.
    // Refactor the helper methods (getCurrentClientValues, getCurrentClientMainData in rules/actionsCreator) to be more explicit with the arguments.
    const state = useSelector((stateArg: any) => stateArg);
    useEffect(() => {
        if (orgUnitContext && program && !!formFoundation) {
            dispatch(batchActions([
                getRulesActions({
                    state,
                    program,
                    orgUnit: orgUnitContext,
                    formFoundation,
                }),
            ]));
            orgUnitRef.current = orgUnitContext;
        }
    // Ignoring state (due to various reasons, bottom line being that field updates are handled in epic)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        dispatch,
        program,
        orgUnitContext,
        formFoundation,
        state,
    ]);

    return orgUnitRef.current === orgUnitContext;
};
