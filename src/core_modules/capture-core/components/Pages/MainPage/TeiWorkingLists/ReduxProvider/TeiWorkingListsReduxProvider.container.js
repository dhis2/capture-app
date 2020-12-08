// @flow
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TeiWorkingListsSetup } from '../Setup';
import { useWorkingListsCommonStateManagement, fetchTemplatesSuccess, fetchTemplates } from '../../WorkingListsCommon';
import { useTrackerProgram } from '../../../../../hooks/useTrackerProgram';
import { TEI_WORKING_LISTS_TYPE } from '../constants';
import type { Props } from './teiWorkingListsReduxProvider.types';

export const TeiWorkingListsReduxProvider = ({ storeId }: Props) => {
    const programId = useSelector(({ currentSelections }) => currentSelections.programId);
    const program = useTrackerProgram(programId);

    const commonStateManagementProps = useWorkingListsCommonStateManagement(storeId, TEI_WORKING_LISTS_TYPE, program);

    const currentTemplateId = useSelector(({ workingListsTemplates }) =>
        workingListsTemplates[storeId] && workingListsTemplates[storeId].selectedTemplateId);

    const dispatch = useDispatch();

    const onLoadTemplates = useCallback(() => {
        dispatch(fetchTemplates(programId, storeId, TEI_WORKING_LISTS_TYPE));
        dispatch(fetchTemplatesSuccess([], 'default', storeId));
    }, [dispatch, programId, storeId]);
    const onSelectListRow = useCallback(() => {}, []);

    delete commonStateManagementProps.lastTransaction;
    delete commonStateManagementProps.lastTransactionOnListDataRefresh;
    delete commonStateManagementProps.listDataRefreshTimestamp;

    return (
        // $FlowFixMe lastTransaction, lastTransactionOnListDataRefresh and listDataRefreshTimestamp is deleted but flow doesn't recognize this
        <TeiWorkingListsSetup
            {...commonStateManagementProps}
            onSelectListRow={onSelectListRow}
            onLoadTemplates={onLoadTemplates}
            program={program}
            currentTemplateId={currentTemplateId}
        />
    );
};
