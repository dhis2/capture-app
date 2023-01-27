// @flow
import { useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import { getEventProgramThrowIfNotFound } from '../../../../metaData';
import { getRulesActions } from './DataEntry';
import type { RenderFoundation } from '../../../../metaData';

export const useRulesEngine = ({
    programId,
    orgUnit,
    formFoundation,
}: {
    programId: string,
    orgUnit: ?OrgUnit,
    formFoundation: RenderFoundation,
}) => {
    const dispatch = useDispatch();
    const program = useMemo(() => programId && getEventProgramThrowIfNotFound(programId), [programId]);
    const orgUnitRef = useRef();

    // TODO: Getting the entire state object is bad and this needs to be refactored.
    // The problem is the helper methods that take the entire state object.
    // Refactor the helper methods (getCurrentClientValues, getCurrentClientMainData in rules/actionsCreator) to be more explicit with the arguments.
    const state = useSelector(stateArg => stateArg);
    useEffect(() => {
        if (orgUnit && program) {
            dispatch(batchActions([
                getRulesActions({
                    state,
                    program,
                    orgUnit,
                    formFoundation,
                }),
            ]));
            orgUnitRef.current = orgUnit;
        }
    // Ignoring state (due to various reasons, bottom line being that field updates are handled in epic)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        dispatch,
        program,
        orgUnit,
    ]);

    return !!orgUnit && orgUnitRef.current === orgUnit;
};
