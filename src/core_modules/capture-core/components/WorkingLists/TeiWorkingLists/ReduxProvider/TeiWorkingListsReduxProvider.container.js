// @flow
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { TeiWorkingListsSetup } from '../Setup';
import { useWorkingListsCommonStateManagement, fetchTemplates } from '../../WorkingListsCommon';
import { useTrackerProgram } from '../../../../hooks/useTrackerProgram';
import { TEI_WORKING_LISTS_TYPE } from '../constants';
import type { Props } from './teiWorkingListsReduxProvider.types';
import { navigateToEnrollmentOverview } from '../../../../actions/navigateToEnrollmentOverview/navigateToEnrollmentOverview.actions';

export const TeiWorkingListsReduxProvider = ({ storeId, programId, orgUnitId }: Props) => {
    const program = useTrackerProgram(programId);

    const {
        lastTransaction,
        lastTransactionOnListDataRefresh,
        listDataRefreshTimestamp,
        onSetTemplateSharingSettings,
        records,
        ...commonStateManagementProps
    } = useWorkingListsCommonStateManagement(storeId, TEI_WORKING_LISTS_TYPE, program);
    const dispatch = useDispatch();

    const onLoadTemplates = useCallback(() => {
        dispatch(fetchTemplates(programId, storeId, TEI_WORKING_LISTS_TYPE));
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
