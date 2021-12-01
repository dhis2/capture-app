// @flow
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { navigateToEnrollmentOverview } from '../../../../actions/navigateToEnrollmentOverview/navigateToEnrollmentOverview.actions';
import { useTrackerProgram } from '../../../../hooks/useTrackerProgram';
import { useWorkingListsCommonStateManagement, fetchTemplatesSuccess, fetchTemplates } from '../../WorkingListsCommon';
import { TEI_WORKING_LISTS_TYPE } from '../constants';
import { TeiWorkingListsSetup } from '../Setup';
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

    const onSelectListRow = useCallback(({ id }) => dispatch(navigateToEnrollmentOverview({
        teiId: id,
        programId,
        orgUnitId,
    })), [dispatch, orgUnitId, programId]);

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
