// @flow
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import { getOpenDataEntryActions } from '../DataEntry';
import { type TrackerProgram, type RenderFoundation } from '../../../metaData';
import type { OrgUnit } from '../common.types';

export const useLifecycle = (
    program: TrackerProgram,
    formFoundation: RenderFoundation,
    orgUnit?: OrgUnit,
    dataEntryId: string,
) => {
    const [ready, setReadyState] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (orgUnit) {
            dispatch(batchActions([
                ...getOpenDataEntryActions(program, formFoundation, orgUnit),
            ]));
        }
    }, [dispatch, program, formFoundation, orgUnit]);

    // temporary logic until we clean up the data from the redux store
    const readyTrigger = useSelector(({ dataEntries }) => dataEntries[dataEntryId]);
    const mounting = useRef(true);
    useEffect(() => {
        if (!mounting.current) {
            setReadyState(true);
        }
        mounting.current = false;
    }, [readyTrigger]);

    return ready;
};
