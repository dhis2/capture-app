// @flow
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { navigateToTrackedEntityDashboard } from '../../../../utils/navigateToTrackedEntityDashboard';
import { TeiWorkingListsSetup } from '../Setup';
import { useWorkingListsCommonStateManagement, fetchTemplatesSuccess, fetchTemplates } from '../../WorkingListsCommon';
import { useTrackerProgram } from '../../../../hooks/useTrackerProgram';
import { TEI_WORKING_LISTS_TYPE } from '../constants';
import type { Props } from './teiWorkingListsReduxProvider.types';

export const TeiWorkingListsReduxProvider = ({ storeId, programId, orgUnitId }: Props) => {
    const program = useTrackerProgram(programId);

    // Being pragmatic here, disabling behavior we will implement later
    const {
        lastTransaction,
        lastTransactionOnListDataRefresh,
        listDataRefreshTimestamp,
        onAddTemplate,
        onUpdateTemplate,
        onDeleteTemplate,
        onSetTemplateSharingSettings,
        records,
        ...commonStateManagementProps
    } = useWorkingListsCommonStateManagement(storeId, TEI_WORKING_LISTS_TYPE, program);
    const dispatch = useDispatch();

    const onLoadTemplates = useCallback(() => {
        dispatch(fetchTemplates(programId, storeId, TEI_WORKING_LISTS_TYPE));
        dispatch(fetchTemplatesSuccess([], 'default', storeId));
    }, [dispatch, programId, storeId]);


    const { pathname, search } = useLocation();
    const onSelectListRow = useCallback(({ id }) => {
        navigateToTrackedEntityDashboard({
            teiId: id,
            orgUnitId,
            scopeSearchParam: `program=${programId}`,
            currentUrl: `${pathname}${search}`,
            trackedEntityInstance: records[id],
        });
    }, [orgUnitId, programId, pathname, search, records]);

    return (
        <TeiWorkingListsSetup
            {...commonStateManagementProps}
            onSelectListRow={onSelectListRow}
            onLoadTemplates={onLoadTemplates}
            program={program}
            records={records}
            orgUnitId={orgUnitId}
        />
    );
};
