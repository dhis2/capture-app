// @flow
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { QueryRefetchFunction } from '@dhis2/app-runtime';
import { TEI_MODAL_STATE } from '../index';

export const useRefetchTrackedEntityInstance = (refetch: QueryRefetchFunction) => {
    const { modalState } = useSelector(store => ({
        modalState: store.trackedEntityInstance?.modalState || TEI_MODAL_STATE.CLOSE,
    }));

    useEffect(() => {
        modalState === TEI_MODAL_STATE.CLOSE_UPDATE && refetch();
    }, [modalState, refetch]);

    return { trackedEntityInstance: { modalState } };
};
